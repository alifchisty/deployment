const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables from a .env file into process.env
dotenv.config();

// Connect to MongoDB using the URI stored in the .env file
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB Atlas');
}).catch((err) => {
    console.error('Failed to connect to MongoDB Atlas', err);
});
