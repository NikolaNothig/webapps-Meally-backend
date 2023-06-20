const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user');
const recipeRoutes = require('./routes/recipe');


const app = express();

const mongodb_uri = 'mongodb+srv://nikola:2FjHe4lPtfQRW3lt@webapps.fwd9zcy.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.use(express.json());
    app.use('/user', userRoutes);
    app.use('/recipe', recipeRoutes);

    app.listen(3000, () => console.log('Server running on port 3000'));
  })
  .catch(err => {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1);
  });
