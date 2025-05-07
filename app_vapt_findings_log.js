const express = require('express');
const { Client } = require('pg');
const cors = require('cors');
const authentification = require('./authentification'); 


const app = express();
const PORT = 3000;

app.use(cors());

const client = new Client({
    user: 'postgres',
    password: 'Grafika9',
    host: 'serova.id',
    port: 8485,
    database:'api',
});

client.connect();

app.get('/api/event', authentification,async (req, res) => {
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

app.get('/api/event/summary',authentification, async (req, res) => {
  try {
    const activeResult = await client.query(`
      SELECT COUNT(*) AS active_count FROM events WHERE status ILIKE 'active'
    `);

    const criticalResult = await client.query(`
      SELECT COUNT(*) AS critical_count FROM events WHERE status ILIKE 'active' AND severity ILIKE 'critical'
    `);

    const currentActive = parseInt(activeResult.rows[0].active_count);
        const dropPercent = 15.2
    res.json({
      active_breaches: currentActive,
      drop_from_last_month: dropPercent,
      critical_breaches: parseInt(criticalResult.rows[0].critical_count),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`API server running at http://localhost:${PORT}`);
});
