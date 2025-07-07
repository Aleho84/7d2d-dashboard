const express = require('express');
const { getLatestLogFile } = require('../services/logFinder');
const { parseLogFile } = require('../services/logParser');

const router = express.Router();

router.get('/server-info', async (req, res) => {
    const latestLogFile = await getLatestLogFile();
    const data = await parseLogFile(latestLogFile);
    res.json(data);
});

module.exports = router;
