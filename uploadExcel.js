const XLSX = require('xlsx');
const { Client } = require('pg');
const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);
const moment = require('moment');

const workbook = XLSX.readFile('./detailed_ddos_logs_6_months.csv'); 
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
function parseDate(dateValue,plus,tipe) {

    if (typeof dateValue === 'number') {
      // Konversi serial date Excel menjadi format tanggal yang valid
      const excelStartDate = new Date(1899, 11, 30); // Excel menghitung dari 30 Desember 1899
      const jsDate = new Date(excelStartDate.getTime() + (dateValue+plus) * 86400000); // 86400000 ms dalam sehari
  
      // Sesuaikan tanggal yang terkonversi ke format yang benar
      return tipe=='date'?moment(jsDate).format('YYYY-MM-DD'):moment(jsDate).format("YYYY-MM-DD HH:mm:ss")
    }
  
    // Jika sudah dalam format teks, langsung parsing
    console.log(dateValue);

     dateValue = dateValue.replace(/\u00A0/g, '').trim();
     const parsed = moment(dateValue.trim(), "YYYY-MM-DD HH:mm:ss");

    console.log(parsed);
    
    const parsedDate = tipe=='date'?moment(dateValue, 'D/M/YY'):moment(dateValue,"YYYY-MM-DD HH:mm:ss");
    if (parsedDate.isValid()) {
      return tipe=='date'?parsedDate.format('YYYY-MM-DD'):moment(dateValue,"YYYY-MM-DD HH:mm:ss");
    } else {
      console.log(`Invalid date: ${dateValue}`);
      return null;
    }
  }
  
  
  
async function importVulnerabilities() {
  await client.connect();

  for (const row of rows) {
    console.log(row['Timestamp']);
    
    const timestamp = parseDate(row['Timestamp'],1); 

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

// importVulnerabilities().catch(console.error);

function parsePercent(value) {
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', '').replace(',', '.'));
  }
  return value;
}

async function importSystemHardening() {
  await client.connect();

  for (const row of rows) {
    console.log(rows);
    
    await client.query(`
      INSERT INTO system_level_hardening_data (
        system_name,
        compliance_percent,
        drift_count,
        critical_drift_count,
        remediation_progress_percent,
        pending_remediation,
        automation_coverage_percent
      ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    `, [
      row['System Name'],
      parsePercent(row['Compliance (%)']),
      row['Drift Count'],
      row['Critical Drift Count'],
      parsePercent(row['Remediation Progress (%)']),
      row['Pending Remediation'],
      parsePercent(row['Automation Coverage (%)'])
    ]);
  }

  console.log('✅ Import system hardening data selesai!');
  await client.end();
}

function parseChange(value) {
  if (typeof value === 'string') {
    return parseFloat(value.replace('%', '').replace(',', '.'));
  }
  return value;
}
async function importSummaryMetrics() {
  await client.connect();

  for (const row of rows) {
    await client.query(`
      INSERT INTO system_hardening_metrics (
        metric,
        current_value,
        target_value,
        change_from_last_month
      ) VALUES ($1, $2, $3, $4)
    `, [
      row['Metric'],
      row['Current Value'],
      row['Target Value'],
      parseChange(row['Change From Last Month'])
    ]);
  }

  console.log('✅ Import hardening metrics selesai!');
  await client.end();
}

// importSummaryMetrics().catch(console.error);

function parseBandwidth(val) {
  return parseFloat(val.toString().replace(',', '.'));
}

function parseTimestamp(ts) {
  return moment(ts, 'M/D/YY H:mm').format('YYYY-MM-DD HH:mm:ss');
}

async function importDdosLogs() {
  await client.connect();
  for (const row of rows) {
      
    console.log(row['Timestamp']);
    
    await client.query(`
      INSERT INTO ddos_attack_logs (
        month,
        timestamp,
        source_ip,
        target_asset,
        attack_type,
        bandwidth_gbps,
        duration_min,
        status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `, [
      row['Month'],
      parseDate(row['Timestamp'],0),
      row['Source IP'],
      row['Target Asset'],
      row['Attack Type'],
      parseBandwidth(row['Bandwidth (Gbps)']),
      row['Duration (min)'],
      row['Status']
    ]);
  }
  console.log('✅ Import DDoS logs selesai!');
  await client.end();
}

importDdosLogs().catch(console.error);