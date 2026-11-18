const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function getAllBooks() {
  const { data } = await axios.get(`${BASE_URL}/`);
  return data;
}

async function getBookByISBN(isbn) {
  const { data } = await axios.get(`${BASE_URL}/isbn/${isbn}`);
  return data;
}

async function getBooksByAuthor(author) {
  const { data } = await axios.get(
    `${BASE_URL}/author/${encodeURIComponent(author)}`
  );
  return data;
}

async function getBooksByTitle(title) {
  const { data } = await axios.get(
    `${BASE_URL}/title/${encodeURIComponent(title)}`
  );
  return data;
}

async function getBookReviews(isbn) {
  const { data } = await axios.get(`${BASE_URL}/review/${isbn}`);
  return data;
}

async function register(username, password) {
  const { data } = await axios.post(
    `${BASE_URL}/register?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );
  return data;
}

async function login(username, password) {
  const { data } = await axios.post(
    `${BASE_URL}/customer/login?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`
  );
  return data;
}

module.exports = {
  getAllBooks,
  getBookByISBN,
  getBooksByAuthor,
  getBooksByTitle,
  getBookReviews,
  register,
  login
};