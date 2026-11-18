export const SOURCE = 'https://polaris.rotarybelux.org/nl/content/news/show/13512';
export const STORE_NAME = 'rotary-camps';
export const KEY = 'latest.json';

function decodeEntities(s) {
  return s.replace(/&nbsp;|&#160;/gi, ' ').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'").replace(/&lt;/gi, '<').replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([\da-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
}
function cleanHtml(s) { return decodeEntities(s.replace(/<br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim(); }
export function parseCamps(html) {
  const tables = [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/gi)].map(m => m[1]);
  for (const table of tables) {
    const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/gi)].map(m => m[1]);
    if (!rows.length) continue;
    const header = [...rows[0].matchAll(/<t[hd]\b[^>]*>([\s\S]*?)<\/t[hd]>/gi)].map(m => cleanHtml(m[1]).toLowerCase());
    if (!header.some(x => x.includes('country')) || !header.some(x => x.includes('camp name'))) continue;
    const result = [];
    for (const row of rows.slice(1)) {
      const cells = [...row.matchAll(/<td\b[^>]*>([\s\S]*?)<\/td>/gi)].map(m => m[1]);
      if (cells.length < 8) continue;
      const values = cells.slice(0, 9).map(cleanHtml);
      while (values.length < 9) values.push('');
      const hrefMatch = cells[8]?.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/i) || row.match(/<a\b[^>]*href=["']([^"']+)["'][^>]*>/i);
      const link = hrefMatch ? new URL(decodeEntities(hrefMatch[1]), SOURCE).href : '';
      if (!values[0] || !values[1] || !values[2]) continue;
      values[0] = String(result.length + 1);
      values[8] = 'more';
      result.push({ values, link });
    }
    if (result.length) return result;
  }
  throw new Error('De kampentabel werd niet herkend. De Polaris-pagina kan gewijzigd zijn.');
}
export async function fetchAndParse() {
  const response = await fetch(SOURCE, { headers: { 'User-Agent': 'RotaryCampsSync/1.0' } });
  if (!response.ok) throw new Error(`Polaris antwoordde met HTTP ${response.status}`);
  return parseCamps(await response.text());
}
