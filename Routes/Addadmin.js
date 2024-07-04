const express = require('express');
const router = express.Router();
const Admin = require('../Login/Defaultadmin');

// Route to add a new admin
router.post('/', Admin.Addadmin);
module.exports = router;
