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


/**
 * Tạo dữ liệu giao dịch
 * @param {string} from - Địa chỉ người gửi
 * @param {string} to - Địa chỉ người nhận
 * @param {string} value - Số lượng ETH
 * @param {string} privateKey - Private key của người gửi (tùy chọn)
 * @returns {Promise<Object>} Dữ liệu giao dịch
 */
const createTransactionData = async (from, to, value, privateKey = null) => {
  try {

    // Các kiểm tra tương tự như estimateGas
    if (!web3.utils.isAddress(from)) {
      throw new Error(`Địa chỉ người gửi không hợp lệ: ${from}`);
    }

    if (!web3.utils.isAddress(to)) {
      throw new Error(`Địa chỉ người nhận không hợp lệ: ${to}`);
    }

    if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      throw new Error('Số lượng ETH không hợp lệ');
    }

    const valueInWei = web3.utils.toWei(value, 'ether');
    const nonce = await web3.eth.getTransactionCount(from, 'latest');
    const gasPrice = await web3.eth.getGasPrice();
    const chainId = await web3.eth.getChainId();

    // Ước tính gas limit
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
      chainId
    };

    // Nếu có privateKey, ký giao dịch ở backend
    if (privateKey) {
      const signedTx = await web3.eth.accounts.signTransaction(txData, privateKey);
      txData.signedTx = signedTx;
    }

    return {
      transactionData: txData,
      readableData: {
        from,
        to,
        value,
        valueInWei,
        nonce,
        gasPrice: web3.utils.fromWei(gasPrice, 'gwei') + ' gwei',
        gasLimit,
        chainId,
        networkType: await web3.eth.net.getNetworkType(),
        createdAt: new Date().toISOString()
      }
    };
  } catch (error) {
    throw new Error(`Lỗi khi tạo dữ liệu giao dịch: ${error.message}`);
  }
};

/**
 * Ước tính phí gas
 * @param {string} from - Địa chỉ người gửi
 * @param {string} to - Địa chỉ người nhận
 * @param {string} value - Số lượng ETH
 * @returns {Promise<Object>} Thông tin ước tính gas
 */
const estimateGas = async (from, to, value) => {
  try {

    // Kiểm tra địa chỉ hợp lệ
    if (!web3.utils.isAddress(from)) {
      throw new Error(`Địa chỉ người gửi không hợp lệ: ${from}`);
    }

    if (!web3.utils.isAddress(to)) {
      throw new Error(`Địa chỉ người nhận không hợp lệ: ${to}`);
    }

    // Kiểm tra giá trị
    if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      throw new Error('Số lượng ETH không hợp lệ');
    }

    const valueInWei = web3.utils.toWei(value, 'ether');

    // Lấy giá gas hiện tại
    const gasPrice = await web3.eth.getGasPrice();

    // Ước tính gas limit
    const gasEstimate = await web3.eth.estimateGas({
      from,
      to,
      value: valueInWei
    });

    // Tính tổng phí gas
    const gasCostWei = BigInt(gasPrice) * BigInt(gasEstimate);
    const gasCostEth = web3.utils.fromWei(gasCostWei.toString(), 'ether');

    // Kiểm tra số dư người gửi
    const balanceWei = await web3.eth.getBalance(from);
    const totalCostWei = BigInt(valueInWei) + gasCostWei;
    const canSend = BigInt(balanceWei) >= totalCostWei;

    return {
      from,
      to,
      value,
      valueInWei,
      gasPrice: web3.utils.fromWei(gasPrice, 'gwei') + ' gwei',
      gasPriceWei: gasPrice,
      gasLimit: gasEstimate,
      gasCostEth,
      gasCostWei: gasCostWei.toString(),
      totalCostEth: web3.utils.fromWei(totalCostWei.toString(), 'ether'),
      totalCostWei: totalCostWei.toString(),
      balanceEth: web3.utils.fromWei(balanceWei, 'ether'),
      balanceWei,
      canSend,
      estimatedAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Lỗi khi ước tính gas: ${error.message}`);
  }
};


/**
 * Demo: Tạo và gửi giao dịch hoàn chỉnh (chỉ sử dụng cho mục đích demo/test)
 * @param {string} from - Địa chỉ người gửi
 * @param {string} to - Địa chỉ người nhận
 * @param {string} value - Số lượng ETH
 * @param {string} privateKey - Private key của người gửi
 * @returns {Promise<Object>} Kết quả giao dịch
 */
const sendTestTransaction = async (from, to, value, privateKey) => {
  try {

    // Các kiểm tra tương tự như createTransactionData
    if (!web3.utils.isAddress(from)) {
      throw new Error(`Địa chỉ người gửi không hợp lệ: ${from}`);
    }

    if (!web3.utils.isAddress(to)) {
      throw new Error(`Địa chỉ người nhận không hợp lệ: ${to}`);
    }

    if (!privateKey || typeof privateKey !== 'string' || !privateKey.startsWith('0x')) {
      throw new Error('Private key không hợp lệ');
    }

    // Kiểm tra xem private key có khớp với địa chỉ from không
    const account = web3.eth.accounts.privateKeyToAccount(privateKey);
    if (account.address.toLowerCase() !== from.toLowerCase()) {
      throw new Error('Private key không khớp với địa chỉ người gửi');
    }

    if (isNaN(parseFloat(value)) || parseFloat(value) <= 0) {
      throw new Error('Số lượng ETH không hợp lệ');
    }

    // Tạo và ký giao dịch
    const { transactionData } = await createTransactionData(from, to, value);
    const signedTx = await web3.eth.accounts.signTransaction(transactionData, privateKey);

    // Gửi giao dịch đã ký
    const result = await sendSignedTransaction(signedTx);

    return {
      ...result,
      value,
      sentAt: new Date().toISOString()
    };
  } catch (error) {
    throw new Error(`Lỗi khi gửi giao dịch test: ${error.message}`);
  }
};

module.exports = {
  web3,
  getBalance,
  estimateGas,
  sendTestTransaction

};