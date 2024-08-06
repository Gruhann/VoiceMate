const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const reminders = require('./routes/reminders');
const auth = require('./routes/auth');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb+srv://god:test1234@clusterblogs.yhoepuw.mongodb.net/?retryWrites=true&w=majority&appName=ClusterBlogs', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true
}));

app.use(session({
    secret: 'batmansuperman', // Replace with your secret key
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false, // Set to true if using HTTPS
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 // 24 hours
    }
}));

app.use('/api/reminders', reminders);
app.use('/api/auth', auth);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
