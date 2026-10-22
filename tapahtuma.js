
const virhe = document.getElementById('virhe');

function naytaVirhe(teksti) {
  virhe.textContent = teksti;
  virhe.hidden = false;
}

function naytaTapahtuma(t) {
  const kuva = document.getElementById('kuva');
  kuva.src = kuvanPolku(t);
  kuva.alt = t.nimi;
  kuva.hidden = false;
  document.getElementById('tiedot').hidden = false;
  document.getElementById('nimi').textContent = t.nimi;
  document.getElementById('kategoria').textContent = t.kategoria;
  document.getElementById('meta-paikkakunta').textContent = t.paikkakunta;
  document.getElementById('meta-osallistujat').textContent = `${t.osallistujat} osallistujaa`;
  document.getElementById('tieto-kategoria').textContent = t.kategoria;
  document.getElementById('tieto-paikkakunta').textContent = t.paikkakunta;
  document.getElementById('tieto-osallistujat').textContent = t.osallistujat;
  document.title = `${t.nimi} | Tapahtumakalenteri`;

  const nappi = document.getElementById('suosikki-nappi');
  paivitaSuosikkinappi(nappi, t);
  nappi.addEventListener('click', () => {
    vaihdaSuosikki(t.id);
    paivitaSuosikkinappi(nappi, t);
  });
}

const id = Number(new URLSearchParams(location.search).get('id'));

haeTapahtumat()
  .then(tapahtumat => {
    const tapahtuma = tapahtumat.find(t => t.id === id);
    if (tapahtuma) naytaTapahtuma(tapahtuma);
    else naytaVirhe('Tapahtumaa ei löytynyt.');
  })
  .catch(() => naytaVirhe('Tapahtuman lataus epäonnistui. Käynnistä sivusto palvelimen kautta (docker compose up).'));
