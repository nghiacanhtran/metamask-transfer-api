class TransferController {
    async initiateTransfer(req, res) {
        // Logic for initiating a transfer
        try {
            const { amount, recipient } = req.body;
            // Call to TransferService to create a transaction
            const transaction = await transferService.createTransaction(amount, recipient);
            res.status(201).json({ success: true, transaction });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }

    async getTransferStatus(req, res) {
        // Logic for getting the status of a transfer
        try {
            const { transactionId } = req.params;
            // Call to TransferService to get the transaction status
            const status = await transferService.getTransactionStatus(transactionId);
            res.status(200).json({ success: true, status });
        } catch (error) {
            res.status(500).json({ success: false, message: error.message });
        }
    }
}

const transferService = require('../services/transferService');

module.exports = new TransferController();