const { Redis } = require('@upstash/redis');
const fs = require('fs');

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || 'https://equipped-falcon-217063.upstash.io',
  token: process.env.UPSTASH_REDIS_REST_TOKEN || 'gQAAAAAAA0_nAAIgcDI1NzMwZmZiODc3ODI0YWYwYWFjNDRjMTNkNDQ1ODRjOQ',
});

// Load the updated mockData
const mockDataContent = fs.readFileSync('src/lib/mockData.js', 'utf8');

// We can require mockData if transpiled or extract arrays
const beasiswaMatch = mockDataContent.match(/export const INITIAL_BEASISWA = (\[[\s\S]*?\]);\n/);
const prestasiMatch = mockDataContent.match(/export const INITIAL_PRESTASI = (\[[\s\S]*?\]);\n/);
const tracerMatch = mockDataContent.match(/export const INITIAL_TRACER = (\[[\s\S]*?\]);\n/);

const beasiswa = beasiswaMatch ? JSON.parse(beasiswaMatch[1]) : [];
const prestasi = prestasiMatch ? JSON.parse(prestasiMatch[1]) : [];
const tracer = tracerMatch ? JSON.parse(tracerMatch[1]) : [];

console.log(`Parsed: ${beasiswa.length} beasiswa, ${prestasi.length} prestasi, ${tracer.length} tracer.`);

async function seed() {
  console.log('Pushing to Upstash Redis...');
  
  console.log('Seeding pkk:beasiswa...');
  await redis.set('pkk:beasiswa', JSON.stringify(beasiswa));
  console.log('✓ pkk:beasiswa seeded!');

  console.log('Seeding pkk:prestasi...');
  await redis.set('pkk:prestasi', JSON.stringify(prestasi));
  console.log('✓ pkk:prestasi seeded!');

  console.log('Seeding pkk:tracer...');
  await redis.set('pkk:tracer', JSON.stringify(tracer));
  console.log('✓ pkk:tracer seeded!');

  console.log('All authentic datasets successfully seeded into Upstash Redis!');
}

seed().catch(err => {
  console.error('Seeding error:', err);
  process.exit(1);
});
