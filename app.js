const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');
const cookieParser = require('cookie-parser');

const app = express();
app.use(cookieParser())

app.use(cors({
  origin: 'https://meally-frontend.onrender.com', 
  credentials: true,
}));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const mongodb_uri = 'mongodb+srv://nikola:2FjHe4lPtfQRW3lt@webapps.fwd9zcy.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.use(express.json());
    app.use('/user', userRoutes);
    app.use('/recipes', recipeRoutes);

    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
