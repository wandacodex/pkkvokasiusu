const { INITIAL_PRESTASI, INITIAL_BEASISWA, TRACER_PRODI_STATS } = require('../src/lib/mockData.js');

console.log('--- PRESTASI STATS ---');
console.log('Total:', INITIAL_PRESTASI.length);
const tingkatCounts = {};
const tahunCounts = {};
const kategoriCounts = {};
INITIAL_PRESTASI.forEach(p => {
  tingkatCounts[p.tingkat] = (tingkatCounts[p.tingkat] || 0) + 1;
  tahunCounts[p.tahun] = (tahunCounts[p.tahun] || 0) + 1;
  kategoriCounts[p.kategori] = (kategoriCounts[p.kategori] || 0) + 1;
});
console.log('Tingkat:', tingkatCounts);
console.log('Tahun:', tahunCounts);
console.log('Kategori:', kategoriCounts);

console.log('\n--- BEASISWA STATS ---');
console.log('Total:', INITIAL_BEASISWA.length);
const beaTahun = {};
const beaJenis = {};
INITIAL_BEASISWA.forEach(b => {
  beaTahun[b.periodeTahun] = (beaTahun[b.periodeTahun] || 0) + 1;
  beaJenis[b.jenisBeasiswa] = (beaJenis[b.jenisBeasiswa] || 0) + 1;
});
console.log('Tahun:', beaTahun);
console.log('Top Jenis:', Object.entries(beaJenis).slice(0, 10));

console.log('\n--- TRACER PRODI STATS ---');
console.log('Prodi count:', TRACER_PRODI_STATS.length);
let totalLulusan = 0;
let totalBekerja = 0;
let totalBelum = 0;
let totalWira = 0;
let totalMelanjut = 0;
let totalCari = 0;
let totalResp = 0;
TRACER_PRODI_STATS.forEach(p => {
  totalLulusan += p.lulusan;
  totalBekerja += p.bekerja;
  totalBelum += p.belumMemungkinkan;
  totalWira += p.wiraswasta;
  totalMelanjut += p.melanjutkanPendidikan;
  totalCari += p.mencariKerja;
  totalResp += p.totalRespons;
});
console.log({ totalLulusan, totalBekerja, totalBelum, totalWira, totalMelanjut, totalCari, totalResp });
