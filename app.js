import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import client from './config.js';
import authentification from './authentification.js'; 
import morgan from 'morgan';


const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(morgan('combined'))
app.use(authentification);
import uploadRoute from './uploadExcel.js'; 
app.use('/upload', uploadRoute);
import downloadRoute from './download.js'; 
app.use('/download', downloadRoute);

app.get('/api/event',async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM events
      WHERE status ILIKE 'active'
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/event/summary',async (req, res) => {
  try {
    const activeResult = await client.query(`
      SELECT COUNT(*) AS active_count FROM events WHERE status ILIKE 'active'
    `);

    const criticalResult = await client.query(`
      SELECT COUNT(*) AS critical_count FROM events WHERE status ILIKE 'active' AND severity ILIKE 'critical'
    `);

    const currentActive = parseInt(activeResult.rows[0].active_count);
        const dropPercent = -15.2
    res.json({
      active_breaches: currentActive,
      lastmonth_compare: dropPercent>0?"up":dropPercent==0?"same":"down",
      lastmonth_diff:Math.abs(dropPercent),
      critical_breaches: parseInt(criticalResult.rows[0].critical_count),

    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/vapt_findings_log',async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM vapt_findings_log`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/vapt_findings_log/summary',async (req, res) => {
  try {
    const activeResult = await client.query(`
      SELECT COUNT(*) AS active_count FROM vapt_findings_log WHERE severity != 'Critical'
    `);

    const criticalResult = await client.query(`
      SELECT COUNT(*) AS active_count FROM vapt_findings_log WHERE severity = 'Critical'
    `);

    const currentActive = parseInt(activeResult.rows[0].active_count);
        const dropPercent = -12.5
    res.json({
      active_breaches: currentActive,
      lastmonth_compare: dropPercent>0?"up":dropPercent==0?"same":"down",
      lastmonth_diff:Math.abs(dropPercent),
      critical_breaches: parseInt(criticalResult.rows[0].critical_count),

    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/system_level_hardening_data',async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM system_level_hardening_data`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
})
app.get('/api/system_hardening_summary',async (req, res) => {
  try {
    const result = await client.query(`
      SELECT * FROM system_hardening_summary`);
    let metrics = result.rows
    const compliance = metrics.find(m => m.metric === 'Overall Compliance');
    const drift = metrics.find(m => m.metric === 'Configuration Drift');
    const remediation = metrics.find(m => m.metric === 'Remediation Progress');
    const automation = metrics.find(m => m.metric === 'Automation Coverage');
  
    // Ekstrak angka dari string
    const driftMatch = drift.current_value.match(/(\d+).*?(\d+)/); // 42 drifts (12 critical)
    const remediationMatch = remediation.current_value.match(/([\d.]+).*?(\d+)/); // 78.2% (24 pending)

  
  res.json({res:200,message:'sukses',automation_coverage:{automation:parseFloat(automation.current_value.replace(',', '.')),target:automation.target_value,status:parseFloat(automation.change_from_last_month) >= 0 ? 'up' : 'down',point:Math.abs(parseFloat(automation.change_from_last_month))},
    remediation_progress:{progress:remediationMatch[1],pending:remediationMatch[2],status:parseFloat(drift.change_from_last_month) >= 0 ? 'up' : 'down',point:Math.abs(parseFloat(remediation.change_from_last_month))},
    configuration_drift:{drift:driftMatch[1],critical:driftMatch[2],status:parseFloat(drift.change_from_last_month) >= 0 ? 'up' : 'down',point:Math.abs(parseFloat(drift.change_from_last_month))},
    overall_compliance:{compliance:parseFloat(compliance.current_value.replace(',', '.')),target:compliance.target_value,status:parseFloat(compliance.change_from_last_month) >= 0 ? 'up' : 'down'},point:Math.abs(parseFloat(compliance.change_from_last_month))});

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get('/api/ddos-attack-stats',async (req, res) => {
  try {
    const result = await client.query(`
     SELECT 
        month,  TO_CHAR("timestamp", 'YYYY-MM') AS get,
        COUNT(*) AS total_attacks
      FROM ddos_attack_logs
      GROUP BY get , month
      ORDER BY get 
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});
app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
