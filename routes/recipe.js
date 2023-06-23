const express = require('express');
const router = express.Router();
const Recipe = require('../models/Recipe');
const User = require('../models/User');

router.post('/create', async (req, res) => {
  try {
    const { userId } = req.cookies;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const newRecipe = new Recipe({
      ...req.body,
      createdBy: userId,
    });

    const savedRecipe = await newRecipe.save();
    console.log('Saved recipe', savedRecipe);

    res.status(200).json({ message: 'Recipe created successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
router.get('/user/:userId/recipes', async (req, res) => {
  try {
    const recipes = await Recipe.find({createdBy: req.params.userId});
    console.log('Fetched recipes', recipes); 
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.put('/update/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const { userId } = req.cookies;
    console.log('User ID from cookies:', userId);
    console.log('Recipe createdBy:', recipe.createdBy.toString());

    if (recipe.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'User not authorized to edit this recipe' });
    }

    const updatedRecipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedRecipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


router.delete('/delete/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    const { userId } = req.cookies;
    console.log('Recipe deleted successfully');

    if (recipe.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'User not authorized to delete this recipe' });
    }

    await Recipe.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



router.get('/', async (req, res) => {
  try {
    const recipes = await Recipe.find().populate('createdBy');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/search', async (req, res) => {
  try {
    let { sort, ingredients } = req.query;

    
    let sortOption = {};
    if (sort === 'rating') {
      sortOption = { 'ratings.rating': -1 }; 
    } else if (sort === 'difficulty') {
      sortOption = { 'ratings.difficulty': -1 }; 
    }

    
    let filterOption = {};
    if (ingredients) {
      ingredients = ingredients.split(',');
      filterOption = { 'ingredients': { $in: ingredients } }; 
    }

    const recipes = await Recipe.find(filterOption).sort(sortOption).populate('createdBy');
    res.status(200).json(recipes);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id).populate('createdBy');
    res.status(200).json(recipe);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/:id/rate', async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    const recipe = await Recipe.findById(req.params.id);
    if (!user || !recipe) {
      throw new Error('Invalid user or recipe ID');
    }

    const { rating, difficulty } = req.body;
    recipe.ratings.push({ user: user._id, rating, difficulty });
    user.ratedRecipes.push({ recipe: recipe._id, rating, difficulty });
    await recipe.save();
    await user.save();
    res.status(200).json({ message: 'Rating added successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});



module.exports = router;

