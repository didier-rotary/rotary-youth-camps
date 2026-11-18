ROTARY YOUTH CAMPS – NETLIFY PROJECT

Bestanden:
- index.html: interactieve tabel
- netlify/functions/polaris-parser.mjs: uitlezen van de Polaris-kampentabel
- netlify/functions/polaris-sync.mjs: dagelijkse synchronisatie om 04:00 UTC
- netlify/functions/camps.mjs: levert de laatst opgeslagen gegevens aan de tabel
- netlify.toml: Netlify-configuratie
- package.json: Netlify Blobs dependency

BELANGRIJK VOOR PUBLICATIE
Dit project bevat Netlify Functions en Netlify Blobs. Publiceer daarom de volledige projectmap via een Git-repository gekoppeld aan Netlify, of via Netlify CLI. Alleen index.html uploaden via Netlify Drop activeert de functies niet.

Na publicatie:
1. Controleer in Netlify > Functions of 'polaris-sync' als Scheduled function verschijnt.
2. Voer de functie eenmalig handmatig uit via Run now om de eerste dagelijkse synchronisatie te testen. (De eerste bezoeker vult de datastore ook automatisch als die nog leeg is.)
3. Open de site en controleer of 'Laatst bijgewerkt' verschijnt.

De dagelijkse planning is 04:00 UTC: 05:00 in België tijdens wintertijd en 06:00 tijdens zomertijd.
De tabel gebruikt ingebouwde reservegegevens als de API tijdelijk niet werkt.
