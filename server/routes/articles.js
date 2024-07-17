const express = require('express');
const Article = require('../models/Article');
const jwt = require('jsonwebtoken');
const { SECRET_KEY } = require('../config'); // Import SECRET_KEY from config file
const router = express.Router();

// Authentication middleware
const auth = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send('Access denied');
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token');
  }
};

// POST a new article
router.post('/', auth, async (req, res) => {
  const { title, content } = req.body;
  const article = new Article({ title, content, author: req.user.userId }); // Set author to userId from JWT token
  try {
    const savedArticle = await article.save();
    res.status(201).json(savedArticle); // Return saved article as JSON response
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).send('Server Error');
  }
});

// GET all articles
router.get('/',auth, async (req, res) => {
  try {
    const articles = await Article.find(); // Fetch all articles from database
    res.json(articles); // Send articles as JSON response
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).send('Server Error');
  }
});

// PUT approve article by ID
router.put('/:id/approve', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { approved: true }, { new: true });
    if (!article) return res.status(404).send('Article not found');
    res.json(article);
  } catch (error) {
    console.error('Error approving article:', error);
    res.status(500).send('Server Error');
  }
});

// PUT disapprove article by ID
router.put('/:id/disapprove', auth, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).send('Access denied');
  try {
    const article = await Article.findByIdAndUpdate(req.params.id, { approved: false }, { new: true });
    if (!article) return res.status(404).send('Article not found');
    res.json(article);
  } catch (error) {
    console.error('Error disapproving article:', error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
