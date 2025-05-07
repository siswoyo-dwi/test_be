const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/file/:filename', (req, res) => {
  const fileName = req.params.filename;
  const filePath = path.join(__dirname, 'uploads', fileName);
    console.log(filePath,fileName);
    
  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error('Download error:', err);
      res.status(404).json({ error: 'File not found or download failed' });
    }
  });
});

module.exports = router;
