

const SUOSIKKI_EVAESTE = 'suosikit';
const EVAESTEEN_KESTO = 60 * 60 * 24 * 365; // sekuntia (1 vuosi)

/** Hakee tapahtumat JSON-tiedostosta. */
async function haeTapahtumat() {
  const vastaus = await fetch('tapahtumat.json');
  if (!vastaus.ok) throw new Error('Tapahtumien lataus epäonnistui');
  return vastaus.json();
}

/** JSON:n kuvapolku on muotoa images/tapahtuma1.jpg, mutta annetut kuvat ovat PNG-tiedostoja. */
function kuvanPolku(tapahtuma) {
  return tapahtuma.kuva.replace(/\.jpg$/i, '.png');
}

/** Lukee suosikkien tunnisteet evästeestä taulukkona. */
function lueSuosikit() {
  const rivi = document.cookie.split('; ').find(r => r.startsWith(SUOSIKKI_EVAESTE + '='));
  if (!rivi) return [];
  return decodeURIComponent(rivi.split('=')[1]).split(',').filter(Boolean).map(Number);
}

function onSuosikki(id) {
  return lueSuosikit().includes(id);
}

/** Lisää tai poistaa suosikin ja palauttaa uuden tilan (true = suosikki). */
function vaihdaSuosikki(id) {
  const tunnisteet = lueSuosikit();
  const uudet = tunnisteet.includes(id) ? tunnisteet.filter(t => t !== id) : [...tunnisteet, id];
  document.cookie = `${SUOSIKKI_EVAESTE}=${encodeURIComponent(uudet.join(','))}; max-age=${EVAESTEEN_KESTO}; path=/; SameSite=Lax`;
  return uudet.includes(id);
}

/** Päivittää sydänpainikkeen ulkoasun ja saavutettavuustiedot. */
function paivitaSuosikkinappi(nappi, tapahtuma) {
  const valittu = onSuosikki(tapahtuma.id);
  nappi.setAttribute('aria-pressed', String(valittu));
  nappi.setAttribute('aria-label', `Suosikki: ${tapahtuma.nimi}`);
  nappi.title = valittu ? 'Poista suosikeista' : 'Lisää suosikiksi';
  nappi.querySelector('img').src = valittu ? 'Ikonit/heart-filled.svg' : 'Ikonit/heart-outline.svg';
}

/** Mobiilin hampurilaisvalikko. */
function alustaValikko() {
  const nappi = document.querySelector('.valikko-nappi');
  const valikko = document.getElementById('paavalikko');
  const aseta = auki => {
    valikko.classList.toggle('auki', auki);
    nappi.setAttribute('aria-expanded', String(auki));
    nappi.setAttribute('aria-label', auki ? 'Sulje valikko' : 'Avaa valikko');
  };
  nappi.addEventListener('click', () => aseta(!valikko.classList.contains('auki')));
  valikko.addEventListener('click', e => { if (e.target.closest('a, button')) aseta(false); });
}

alustaValikko();
