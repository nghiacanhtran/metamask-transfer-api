const express = require('express');
const TransferController = require('./transactions/transferController');

const router = express.Router();
const transferController = new TransferController();

function setTransferRoutes(app) {
    router.post('/transfer', transferController.initiateTransfer.bind(transferController));
    router.get('/transfer/status/:id', transferController.getTransferStatus.bind(transferController));
    
    app.use('/api', router);
}

module.exports = setTransferRoutes;