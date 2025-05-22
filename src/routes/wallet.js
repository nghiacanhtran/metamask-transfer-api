const express = require('express');
const {
  getWalletBalance,
  estimateTransactionGas,
  verifyWallet
} = require('../controllers/walletController');

const router = express.Router();

router.get('/balance/:address', getWalletBalance);
router.post('/estimate-gas', estimateTransactionGas);
router.post('/verify', verifyWallet);

module.exports = router;