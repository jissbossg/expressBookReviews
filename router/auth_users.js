const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb');

const regd_users = express.Router();

let users = [
  { username: 'user1', password: 'pwd1' }
];

const isValid = (username) => {
  return !users.some((u) => u.username === username);
};

const authenticatedUser = (username, password) => {
  return users.some(
    (u) => u.username === username && u.password === password
  );
};

// POST /customer/login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.query;

  if (!username || !password) {
    return res.status(400).json({
      message: 'Username and password required'
    });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({
      message: 'Invalid login. Check username and password'
    });
  }

  const accessToken = jwt.sign({ username }, 'access', {
    expiresIn: '1h'
  });

  req.session.authorization = { accessToken, username };

  return res.status(200).json({
    message: 'User successfully logged in',
    token: accessToken
  });
});

// PUT /customer/auth/review/:isbn → añadir o modificar reseña
regd_users.put('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const { review } = req.query;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({
      message: 'User not authenticated'
    });
  }

  const book =
    books[isbn] ||
    Object.values(books).find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }

  if (!review) {
    return res.status(400).json({
      message: 'Review text is required'
    });
  }

  const existing = book.reviews.find(
    (r) => r.username === username
  );

  if (existing) {
    existing.review = review;
    return res.status(200).json({
      message: 'Review updated',
      reviews: book.reviews
    });
  }

  book.reviews.push({ username, review });
  return res.status(200).json({
    message: 'Review added',
    reviews: book.reviews
  });
});

// DELETE /customer/auth/review/:isbn → eliminar reseña propia
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const { isbn } = req.params;
  const username = req.session.authorization?.username;

  if (!username) {
    return res.status(403).json({
      message: 'User not authenticated'
    });
  }

  const book =
    books[isbn] ||
    Object.values(books).find((b) => b.isbn === isbn);

  if (!book) {
    return res.status(404).json({
      message: `Book with ISBN ${isbn} not found`
    });
  }

  const index = book.reviews.findIndex(
    (r) => r.username === username
  );

  if (index === -1) {
    return res.status(404).json({
      message: `No review by ${username} for ISBN ${isbn}`
    });
  }

  book.reviews.splice(index, 1);
  return res.status(200).json({
    message: 'Review deleted',
    reviews: book.reviews
  });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;