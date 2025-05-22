# Metamask Transfer API

## Overview
The Metamask Transfer API is a Node.js application built with Express that facilitates the transfer of funds using Metamask. It provides endpoints for initiating transfers and checking the status of those transfers.

## Features
- Initiate fund transfers
- Check transfer status
- JWT authentication for secure routes
- Utility functions for consistent response formatting and error handling

## Project Structure
```
metamask-transfer-api
├── src
│   ├── app.js
│   ├── controllers
│   │   └── transferController.js
│   ├── routes
│   │   └── transferRoutes.js
│   ├── middleware
│   │   └── auth.js
│   ├── services
│   │   └── transferService.js
│   └── utils
│       └── index.js
├── config
│   └── index.js
├── tests
│   └── transfer.test.js
├── package.json
└── README.md
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd metamask-transfer-api
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage
To start the application, run:
```
npm start
```
For development mode with hot reloading, use:
```
npm run dev
```

## API Endpoints
- `POST /api/transfer`: Initiates a fund transfer.
- `GET /api/transfer/status`: Checks the status of a transfer.

## Testing
To run the tests, use:
```
npm test
```

## License
This project is licensed under the MIT License.