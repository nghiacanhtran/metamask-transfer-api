const { validationResult } = require('express-validator');
const web3Service = require('../services/web3Service');
const apiResponse = require('../utils/apiResponse');


/**
 * Tạo, ký và gửi giao dịch (tất cả trong một API)
 * @route POST /api/transactions/transfer
 * @access Public
 */
exports.transferFunds = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse.validationError(res, 'Lỗi xác thực dữ liệu', errors.array());
    }
    
    const { from, to, value, privateKey } = req.body;
    
    // Ước tính phí gas trước
    const gasEstimate = await web3Service.estimateGas(from, to, value);
    
    // Kiểm tra số dư
    if (!gasEstimate.canSend) {
      return apiResponse.error(
        res, 
        'Số dư không đủ để thực hiện giao dịch này',
        400,
        { gasEstimate }
      );
    }
    
    // Gửi giao dịch
    const txResult = await web3Service.sendTestTransaction(from, to, value, privateKey);
    
    return apiResponse.success(
      res, 
      'Chuyển tiền thành công',
      {
        ...txResult,
        gasEstimate
      },
      201
    );
  } catch (error) {
    console.error('Lỗi khi chuyển tiền:', error);
    return apiResponse.error(res, error.message);
  }

};