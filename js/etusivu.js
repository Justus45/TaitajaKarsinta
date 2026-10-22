

const lista = document.getElementById('tapahtumalista');
const eiTuloksia = document.getElementById('ei-tuloksia');
const hakuKentta = document.getElementById('haku');
const kategoriaValinta = document.getElementById('kategoria');
const lajitteluValinta = document.getElementById('lajittelu');
const suosikitNappi = document.getElementById('suosikit-nappi');
const korttiMalli = document.getElementById('kortti-malli');

let kaikkiTapahtumat = [];
let vainSuosikit = new URLSearchParams(location.search).has('suosikit');

/** Suodattaa haun, kategorian ja (valinnaisen) suosikkirajauksen mukaan. */
function suodata(tapahtumat) {
  const haku = hakuKentta.value.trim().toLowerCase();
  const kategoria = kategoriaValinta.value;
  return tapahtumat.filter(t =>
    t.nimi.toLowerCase().includes(haku) &&
    (kategoria === 'kaikki' || t.kategoria === kategoria) &&
    (!vainSuosikit || onSuosikki(t.id))
  );
}

/** Lajittelee kopion taulukosta valitun lajitteluperusteen mukaan. */
function lajittele(tapahtumat) {
  const [peruste, suunta] = lajitteluValinta.value.split('-');
  const kerroin = suunta === 'asc' ? 1 : -1;
  return [...tapahtumat].sort((a, b) =>
    peruste === 'nimi'
      ? kerroin * a.nimi.localeCompare(b.nimi, 'fi')
      : kerroin * (a.osallistujat - b.osallistujat)
  );
}

function luoKortti(t) {
  const kortti = korttiMalli.content.firstElementChild.cloneNode(true);
  const kuva = kortti.querySelector('.kuva');
  kuva.src = kuvanPolku(t);
  kuva.alt = t.nimi;
  kortti.querySelector('h3').textContent = t.nimi;
  kortti.querySelector('.kategoria').textContent = t.kategoria;
  kortti.querySelector('.paikkakunta').textContent = t.paikkakunta;
  kortti.querySelector('.osallistujat').textContent = `${t.osallistujat} osallistujaa`;
  const linkki = kortti.querySelector('.kortti-linkki');
  linkki.href = `tapahtuma.html?id=${t.id}`;
  linkki.setAttribute('aria-label', `Lisätietoja: ${t.nimi}`);
  const nappi = kortti.querySelector('.suosikki-nappi');
  nappi.dataset.id = t.id;
  paivitaSuosikkinappi(nappi, t);
  return kortti;
}

function paivitaTilastot(nakyvat) {
  document.getElementById('tilasto-maara').textContent = nakyvat.length;
  const yhteensa = nakyvat.reduce((summa, t) => summa + t.osallistujat, 0);
  document.getElementById('tilasto-osallistujat').textContent = yhteensa.toLocaleString('fi-FI');
}

/** Piirtää näkymän uudelleen nykyisten valintojen mukaan. */
function paivita() {
  const nakyvat = lajittele(suodata(kaikkiTapahtumat));
  lista.replaceChildren(...nakyvat.map(luoKortti));
  eiTuloksia.hidden = nakyvat.length > 0;
  paivitaTilastot(nakyvat);
}

function taytaKategoriat() {
  const kategoriat = [...new Set(kaikkiTapahtumat.map(t => t.kategoria))].sort((a, b) => a.localeCompare(b, 'fi'));
  kategoriat.forEach(k => kategoriaValinta.append(new Option(k, k)));
}

function asetaSuosikkiRajaus(arvo) {
  vainSuosikit = arvo;
  suosikitNappi.setAttribute('aria-pressed', String(arvo));
  paivita();
}

// Suosikkisydämen painallus (tapahtumadelegointi)
lista.addEventListener('click', e => {
  const nappi = e.target.closest('.suosikki-nappi');
  if (!nappi) return;
  const tapahtuma = kaikkiTapahtumat.find(t => t.id === Number(nappi.dataset.id));
  vaihdaSuosikki(tapahtuma.id);
  if (vainSuosikit) paivita(); // poistettu suosikki katoaa listalta
  else paivitaSuosikkinappi(nappi, tapahtuma);
});

hakuKentta.addEventListener('input', paivita);
kategoriaValinta.addEventListener('change', paivita);
lajitteluValinta.addEventListener('change', paivita);
suosikitNappi.addEventListener('click', () => asetaSuosikkiRajaus(!vainSuosikit));

haeTapahtumat()
  .then(data => {
    kaikkiTapahtumat = data;
    taytaKategoriat();
    asetaSuosikkiRajaus(vainSuosikit);
  })
  .catch(() => {
    eiTuloksia.textContent = 'Tapahtumien lataus epäonnistui. Käynnistä sivusto palvelimen kautta (docker compose up).';
    eiTuloksia.hidden = false;
  });
