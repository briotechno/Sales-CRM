const http = require('http');
const app = require('./app');
const { connectDB } = require('./config/db');
const initializeSocket = require('./socket');

const server = http.createServer(app);
const io = initializeSocket(server);

const PORT = process.env.PORT || 5000;

// Connect to Database and start server
const startServer = async () => {
    await connectDB();

    server.listen(PORT, () => {
        console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    });
};

startServer();
