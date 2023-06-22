const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true }, 
  password: { type: String, required: true }, 
  loginToken: String,
  createdRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  ratedRecipes: [{
    recipe: { type: Schema.Types.ObjectId, ref: 'Recipe' },
    rating: Number,
    difficulty: Number
  }],
});

module.exports = mongoose.model('User', UserSchema);
