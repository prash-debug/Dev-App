const express = require('express');
var router = express.Router();

// GET api/posts
// Test Route
// Public
router.get('/', (req, res) => res.send('Post Route '));

module.exports = router;
