const XLSX = require('xlsx');
const { Client } = require('pg');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const moment = require('moment');

const workbook = XLSX.readFile('./vapt_findings_log.csv'); 
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const rows = XLSX.utils.sheet_to_json(sheet);

const client = new Client({
    user: 'postgres',
    password: 'Grafika9',
    host: 'serova.id',
    port: 8485,
    database:'api',
});

// Fungsi untuk menangani konversi serial date Excel menjadi tanggal
function parseDate(dateValue) {
    if (typeof dateValue === 'number') {
      // Konversi serial date Excel menjadi format tanggal yang valid
      const excelStartDate = new Date(1899, 11, 30); // Excel menghitung dari 30 Desember 1899
      const jsDate = new Date(excelStartDate.getTime() + dateValue * 86400000); // 86400000 ms dalam sehari
  
      // Sesuaikan tanggal yang terkonversi ke format yang benar
      return moment(jsDate).format('YYYY-MM-DD');
    }
  
    // Jika sudah dalam format teks, langsung parsing
    const parsedDate = moment(dateValue, 'D/M/YY');
    if (parsedDate.isValid()) {
      return parsedDate.format('YYYY-MM-DD');
    } else {
      console.log(`Invalid date: ${dateValue}`);
      return null;
    }
  }
  
  
  
async function importVulnerabilities() {
  await client.connect();

  for (const row of rows) {
    console.log(row['Timestamp']);
    
    const timestamp = parseDate(row['Timestamp']); 

console.log(timestamp);

    await client.query(`
      INSERT INTO vapt_findings_log (
        finding_id, timestamp, asset_name,
        vulnerability_type, severity, description,
        remediation_status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      row['Finding ID'],
      timestamp,
      row['Asset Name'],
      row['Vulnerability Type'],
      row['Severity'],
      row['Description'],
      row['Remediation Status']
    ]);
  }

  console.log('✅ Import selesai ke tabel vulnerabilities!');
  await client.end();
}

importVulnerabilities().catch(console.error);
