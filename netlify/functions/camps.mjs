import { getStore } from '@netlify/blobs';
import { fetchAndParse, STORE_NAME, KEY, SOURCE } from './polaris-parser.mjs';
export default async () => {
  const store = getStore(STORE_NAME);
  let payload = await store.get(KEY, { type: 'json' });
  // Bij een lege datastore haalt de eerste bezoeker meteen de actuele tabel op.
  if (!payload) {
    try {
      const camps = await fetchAndParse();
      payload = { camps, updatedAt: new Date().toISOString(), source: SOURCE };
      await store.setJSON(KEY, payload);
    } catch (error) {
      console.error('Eerste Polaris-ophaling mislukt:', error);
      return new Response(JSON.stringify({ error: 'Polaris tijdelijk niet bereikbaar' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }
  }
  return new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
};
