const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Listado de ventas');
});

module.exports = router;
