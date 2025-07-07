const express = require('express');
const auth = require('../middleware/auth');
const { getLatestLogFile } = require('../services/logFinder');
const { parseLogFile } = require('../services/logParser');

const router = express.Router();

// @route   GET api/server-info
// @desc    Get server information
// @access  Private
router.get('/server-info', auth, async (req, res) => {
    const latestLogFile = await getLatestLogFile();
    const data = await parseLogFile(latestLogFile);
    res.json(data);
});

module.exports = router;
