import { getStore } from '@netlify/blobs';
import { fetchAndParse, STORE_NAME, KEY } from './polaris-parser.mjs';
export default async () => {
  try {
    const camps = await fetchAndParse();
    const payload = { camps, updatedAt: new Date().toISOString(), source: 'https://polaris.rotarybelux.org/nl/content/news/show/13512' };
    await getStore(STORE_NAME).setJSON(KEY, payload);
    console.log(`Polaris-synchronisatie voltooid: ${camps.length} kampen`);
  } catch (error) {
    console.error('Polaris-synchronisatie mislukt:', error);
    throw error;
  }
};
export const config = { schedule: '0 4 * * *' }; // dagelijks om 04:00 UTC
