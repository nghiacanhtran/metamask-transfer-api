const { getBalance, estimateGas, verifySignature } = require('../services/web3Service');

// @desc    Lấy số dư của ví
// @route   GET /api/wallet/balance/:address
// @access  Public
exports.getWalletBalance = async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!address) {
      return res.status(400).json({ success: false, error: 'Cần cung cấp địa chỉ ví' });
    }
    
    const balance = await getBalance(address);
    
    res.status(200).json({
      success: true,
      data: balance
    });
  } catch (error) {
    console.error('Lỗi khi lấy số dư ví:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Ước tính phí gas cho giao dịch
// @route   POST /api/wallet/estimate-gas
// @access  Public
exports.estimateTransactionGas = async (req, res) => {
  try {
    const { from, to, value } = req.body;
    
    if (!from || !to || !value) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp địa chỉ gửi, địa chỉ nhận và số lượng ethereum'
      });
    }
    
    const gasEstimate = await estimateGas(from, to, value);
    
    res.status(200).json({
      success: true,
      data: gasEstimate
    });
  } catch (error) {
    console.error('Lỗi khi ước tính gas:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

// @desc    Xác thực ví qua chữ ký
// @route   POST /api/wallet/verify
// @access  Public
exports.verifyWallet = async (req, res) => {
  try {
    const { address, message, signature } = req.body;
    
    if (!address || !message || !signature) {
      return res.status(400).json({
        success: false,
        error: 'Vui lòng cung cấp địa chỉ, tin nhắn và chữ ký'
      });
    }
    
    const isValid = verifySignature(message, signature, address);
    
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Xác thực thất bại, chữ ký không hợp lệ'
      });
    }
    
    res.status(200).json({
      success: true,
      data: { address, verified: true }
    });
  } catch (error) {
    console.error('Lỗi khi xác thực ví:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};