/**
 * Kết quả API thành công
 * @param {object} res - Express response object
 * @param {string} message - Thông báo thành công
 * @param {object} data - Dữ liệu trả về
 * @param {number} statusCode - HTTP status code
 * @returns {object} Express response
 */
exports.success = (res, message, data = null, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Kết quả API thất bại
 * @param {object} res - Express response object
 * @param {string} message - Thông báo lỗi
 * @param {number} statusCode - HTTP status code
 * @param {object|null} errors - Chi tiết lỗi (nếu có)
 * @returns {object} Express response
 */
exports.error = (res, message, statusCode = 400, errors = null) => {
  const response = {
    success: false,
    message
  };
  
  if (errors) {
    response.errors = errors;
  }
  
  return res.status(statusCode).json(response);
};

/**
 * Lỗi xác thực
 * @param {object} res - Express response object
 * @param {string} message - Thông báo lỗi
 * @param {object} errors - Chi tiết lỗi validation
 * @returns {object} Express response
 */
exports.validationError = (res, message, errors) => {
  return res.status(422).json({
    success: false,
    message,
    errors
  });
};

/**
 * Lỗi server
 * @param {object} res - Express response object
 * @param {string} message - Thông báo lỗi
 * @param {Error} error - Đối tượng lỗi
 * @returns {object} Express response
 */
exports.serverError = (res, message = 'Internal Server Error', error = null) => {
  console.error('Server Error:', error);
  
  const response = {
    success: false,
    message
  };
  
  // Chỉ thêm stack trace trong môi trường phát triển
  if (process.env.NODE_ENV === 'development' && error) {
    response.error = error.message;
    response.stack = error.stack;
  }
  
  return res.status(500).json(response);
};