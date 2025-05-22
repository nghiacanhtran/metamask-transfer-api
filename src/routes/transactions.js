const express = require('express');
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');

const router = express.Router();

// Middleware xác thực
const validatePrepareTransaction = [
  body('from').isString().notEmpty().withMessage('Địa chỉ người gửi là bắt buộc'),
  body('to').isString().notEmpty().withMessage('Địa chỉ người nhận là bắt buộc'),
  body('value').isString().notEmpty().withMessage('Số lượng ETH là bắt buộc')
];

const validateSendSignedTransaction = [
  body('signedTransaction').notEmpty().withMessage('Giao dịch đã ký là bắt buộc')
];

const validateTransferFunds = [
  body('from').isString().notEmpty().withMessage('Địa chỉ người gửi là bắt buộc'),
  body('to').isString().notEmpty().withMessage('Địa chỉ người nhận là bắt buộc'),
  body('value').isString().notEmpty().withMessage('Số lượng ETH là bắt buộc'),
  body('privateKey').isString().notEmpty().withMessage('Private key là bắt buộc')
];

router.post('/transfer', validateTransferFunds, transactionController.transferFunds);

module.exports = router;