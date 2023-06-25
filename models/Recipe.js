const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
  title: { type: String, required: true },
  ingredients: [{ type: String }],
  preparation: { type: String },
  image: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  ratings: [{
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    rating: Number,
    difficulty: Number
  }],
});

module.exports = mongoose.model('Recipe', RecipeSchema);
