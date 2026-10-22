# TaitajaKarsinta 
# Tapahtumakalenteri – Taitaja2027 karsinta (Laji 206)

Responsiivinen tapahtumasovellus, jossa tapahtumat luetaan `tapahtumat.json`-tiedostosta. Etusivulla tapahtumia voi hakea, suodattaa, lajitella ja merkitä suosikeiksi. Tapahtumakortista avautuu oma yksityiskohtasivu (`tapahtuma.html?id=3`).

## Käytetyt teknologiat
HTML5, CSS3 (ei kirjastoja), JavaScript (vanilla, `fetch`), Docker (PHP 8.2 + Apache vain palvelimena). Tietokantaa ei käytetä.

## Sivuston avaaminen
1. Käynnistä Docker: `docker compose up --build`
2. Avaa selaimessa <http://localhost:8080>

JSON haetaan `fetch`illä, joten sivu pitää avata palvelimen kautta (ei suoraan tiedostona).

## Valmiit ominaisuudet
- Etusivu wireframen mukaan: logo, navigaatio, hero, haku, suodatin, lajittelu, kortit, tilastot, alatunniste
- Responsiivisuus: usean sarakkeen ruudukko työpöydällä, korttirivit ja hampurilaisvalikko mobiilissa
- Kortit muodostetaan JSON-aineistosta JavaScriptillä (`<template>`)
- Haku päivittyy kirjoitettaessa; kategoriat muodostetaan aineistosta; haku ja suodatus toimivat yhdessä
- Lajittelu: nimi A–Ö / Ö–A, osallistujamäärä nouseva / laskeva (toimii haun ja suodatuksen jälkeen)
- Tilastot (näkyvien tapahtumien määrä ja osallistujat) päivittyvät automaattisesti
- Suosikit tallennetaan evästeeseen (`suosikit`) ja säilyvät sivun latauksen jälkeen
- Yksityiskohtasivu `tapahtuma.html?id=N` paluulinkillä ja virheilmoituksella tuntemattomalle id:lle
- Navigaation "Suosikit" rajaa listan suosikkeihin (ei erillistä suosikkisivua)

## Keskeneräiset tai puuttuvat ominaisuudet / huomiot
- Wireframen yksityiskohtasivulla on päivämäärä, kesto ja kuvaus, mutta `tapahtumat.json` ei sisällä niitä. Sivu näyttää vain aineistossa olevat tiedot (kategoria, paikkakunta, osallistujat).
- JSON:n kuvapolut (`images/tapahtuma1.jpg`) vastaavat annettuja PNG-kuvia vaihtamalla pääte JavaScriptissä (`kuvanPolku`); kuvat on kopioitu kansioon `images/` nimillä `tapahtuma1.png` … `tapahtuma6.png`.
- Annettu `Ikonit/favicon.svg` oli katkennut kesken tiedoston, joten se on korjattu (tiedosto päätetty ja pisteet lisätty).
- Alatunnisteen linkit (Tietosuojaseloste, Käyttöehdot, some) ovat paikkamerkkejä.

## Tekoälyn käyttö
- **Työkalu:** Claude (Anthropic)
- **Missä osissa:** koko toteutus: HTML-rakenne (`index.html`, `tapahtuma.html`), CSS (`css/styles.css`), JavaScript (`js/yhteiset.js`, `js/etusivu.js`, `js/tapahtuma.js`) 
- **Mihin tarkoitukseen:** sivujen rakenteen, ulkoasun ja responsiivisuuden luonti wireframejen mukaan sekä haku-, suodatus-, lajittelu-, tilasto- ja suosikkitoimintojen toteutus
- Tekoälyn tuottamat koodiosiot on rajattu lähdekoodissa kommenteilla `AI-KÄYTTÖ ALKAA` / `AI-KÄYTTÖ PÄÄTTYY`.