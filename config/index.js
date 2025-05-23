module.exports = {
    port: process.env.PORT || 3000,
    dbUri: process.env.DB_URI || 'mongodb://localhost:27017/metamask-transfer',
    jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret',
    apiVersion: '1.0',
};