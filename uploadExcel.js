import XLSX from 'xlsx';
import pkg from 'pg';
const { Client } = pkg;
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
dayjs.extend(customParseFormat);
import moment from 'moment';
import express from 'express';
import multer from 'multer';


const router = express.Router();

const upload = multer({ dest: 'uploads/' });




const client = new Client({
    user: 'postgres',
    password: 'Grafika9',
    host: 'serova.id',
    port: 8485,
    database:'api',
});
 client.connect();

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
  function parseChange(value) {
    if (typeof value === 'string') {
      return parseFloat(value.replace('%', '').replace(',', '.'));
    }
    return value;
  }
  function parsePercent(value) {
    if (typeof value === 'string') {
      return parseFloat(value.replace('%', '').replace(',', '.'));
    }
    return value;
  }
  function parseBandwidth(val) {
    return parseFloat(val.toString().replace(',', '.'));
  }
  
  function parseTimestamp(ts) {
    return moment(ts, 'M/D/YY H:mm').format('YYYY-MM-DD HH:mm:ss');
  }
  router.post('/active_breach_logs', upload.single('file'), async (req, res) => {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    try {
      for (const row of rows) {
        await client.query(`
          INSERT INTO events (
            timestamp, event_id, source_ip, destination_ip,
            event_type, severity, asset_name, breach_type,
            action_taken, status
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        `, [
          new Date(row['Timestamp']),
          row['Event ID'],
          row['Source IP'],
          row['Destination IP'],
          row['Event Type'],
          row['Severity'],
          row['Asset Name'],
          row['Breach Type'],
          row['Action Taken'],
          row['Status']
        ]);
      }
      res.json({ status:200,message: 'Upload and import complete.' });

    } catch (error) {
      res.status(500).json({ error: 'Upload failed.' });

    }

})
  router.post('/vapt_findings_log', upload.single('file'), async (req, res) => {
    const workbook = XLSX.readFile(req.file.path);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    try {
      for (const row of rows) {
        console.log(row['Timestamp']);
        
        const timestamp = parseDate(row['Timestamp'],1); 
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
      res.json({ status:200,message: 'Upload and import complete.' });

    } catch (error) {
      res.status(500).json({ error: 'Upload failed.' });

    }

})



router.post('/system_level_hardening_data', upload.single('file'), async (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  try {
    

  for (const row of rows) {    
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
    res.json({ status:200,message: 'Upload and import complete.' });

  } catch (error) {
    res.status(500).json({ error: 'Upload failed.' });

  }
})


router.post('/system_hardening_summary', upload.single('file'), async (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  try {

  for (const row of rows) {
    await client.query(`
      INSERT INTO system_hardening_summary (
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
  res.json({ status:200,message: 'Upload and import complete.' });

  } catch (error) {
    res.status(500).json({ error: 'Upload failed.' });

  }
})



router.post('/ddos_attack_logs', upload.single('file'), async (req, res) => {
  const workbook = XLSX.readFile(req.file.path);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  try {
    
  for (const row of rows) {
          
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
  res.json({ status:200,message: 'Upload and import complete.' });

  } catch (error) {
    res.status(500).json({ error: 'Upload failed.' });

  }
})
export default router
