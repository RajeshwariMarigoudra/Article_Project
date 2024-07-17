const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Ensure cors is required correctly

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mern-article-app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');

app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);


app.get(  (req, res) => {
  res.send('server is on');
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
