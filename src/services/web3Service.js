const Web3 = require('web3');
require('dotenv').config();

// Khởi tạo web3 với Infura hoặc provider khác
const INFURA_URL = process.env.INFURA_URL || 'https://sepolia.infura.io/v3/e304b12a19834e8db998105db9d75294';
const web3 = new Web3(new Web3.providers.HttpProvider(INFURA_URL));

/**
 * Lấy số dư của ví
 * @param {string} address - Địa chỉ ví Ethereum
 * @returns {Promise<string>} Số dư trong ETH
 */
const getBalance = async (address) => {
  try {
    // Kiểm tra xem địa chỉ có hợp lệ không theo cơ bản
    if (!web3.utils.isAddress(address)) {
      throw new Error(`Địa chỉ không hợp lệ: ${address}`);
    }

    // Chuẩn hóa địa chỉ để tránh lỗi checksum
    const normalizedAddress = address.toLowerCase();
    
    const balanceWei = await web3.eth.getBalance(normalizedAddress);
    const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
    return balanceEth;
  } catch (error) {
    throw new Error(`Lỗi khi lấy số dư: ${error.message}`);
  }
};

// Hàm ước tính phí gas
const estimateGas = async (from, to, value) => {
  try {
    const gasPrice = await web3.eth.getGasPrice();
    const gasEstimate = await web3.eth.estimateGas({
      from,
      to,
      value: web3.utils.toWei(value, 'ether')
    });
    
    return {
      gasPrice: web3.utils.fromWei(gasPrice, 'gwei'),
      gasEstimate,
      totalGasCost: web3.utils.fromWei(
        (BigInt(gasPrice) * BigInt(gasEstimate)).toString(),
        'ether'
      )
    };
  } catch (error) {
    throw new Error(`Lỗi khi ước tính gas: ${error.message}`);
  }
};

// Tạo dữ liệu giao dịch để ký và gửi từ frontend
const createTransactionData = async (from, to, value) => {
  try {
    const valueInWei = web3.utils.toWei(value, 'ether');
    const nonce = await web3.eth.getTransactionCount(from, 'latest');
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await web3.eth.estimateGas({
      from,
      to,
      value: valueInWei
    });
    
    // Tạo dữ liệu giao dịch
    const txData = {
      nonce: web3.utils.toHex(nonce),
      from,
      to,
      value: web3.utils.toHex(valueInWei),
      gasPrice: web3.utils.toHex(gasPrice),
      gasLimit: web3.utils.toHex(gasLimit),
      chainId: web3.utils.toHex(process.env.NETWORK === 'goerli' ? 5 : 1)
    };
    
    return txData;
  } catch (error) {
    throw new Error(`Lỗi khi tạo dữ liệu giao dịch: ${error.message}`);
  }
};

// Kiểm tra status của giao dịch
const getTransactionStatus = async (txHash) => {
  try {
    const tx = await web3.eth.getTransaction(txHash);
    if (!tx) {
      return { status: 'pending', details: 'Giao dịch đang chờ xử lý' };
    }
    
    const receipt = await web3.eth.getTransactionReceipt(txHash);
    if (!receipt) {
      return { status: 'processing', details: 'Giao dịch đang được xử lý' };
    }
    
    return { 
      status: receipt.status ? 'success' : 'failed',
      details: receipt.status ? 'Giao dịch thành công' : 'Giao dịch thất bại',
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed,
      receipt
    };
  } catch (error) {
    throw new Error(`Lỗi khi kiểm tra trạng thái giao dịch: ${error.message}`);
  }
};

// Xác minh chữ ký của người dùng
const verifySignature = (message, signature, address) => {
  try {
    // Lấy địa chỉ từ chữ ký và message đã ký
    const recoveredAddr = web3.eth.accounts.recover(message, signature);
    
    // So sánh với địa chỉ được cung cấp
    return recoveredAddr.toLowerCase() === address.toLowerCase();
  } catch (error) {
    throw new Error(`Lỗi khi xác minh chữ ký: ${error.message}`);
  }
};

module.exports = {
  web3,
  getBalance,
  estimateGas,
  createTransactionData,
  getTransactionStatus,
  verifySignature
};