const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();

/**
 * TASK 10
 * Get all books using async/await (Promise-based)
 */
public_users.get('/', async (req, res) => {
  try {
    const getAllBooks = () =>
      new Promise((resolve) => resolve(books));

    const result = await getAllBooks();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * TASK 11
 * Get book by ISBN using async/await
 */
public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const getBookByISBN = () =>
      new Promise((resolve, reject) => {
        if (books[isbn]) resolve(books[isbn]);
        else reject("Book not found");
      });

    const result = await getBookByISBN();
    res.status(200).json(result);
  } catch (err) {
    res.status(404).json({ message: err });
  }
});

/**
 * TASK 12
 * Get books by Author using async/await
 */
public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;

    const getBooksByAuthor = () =>
      new Promise((resolve) => {
        let filteredBooks = {};
        Object.keys(books).forEach(key => {
          if (books[key].author === author) {
            filteredBooks[key] = books[key];
          }
        });
        resolve(filteredBooks);
      });

    const result = await getBooksByAuthor();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * TASK 13
 * Get books by Title using async/await
 */
public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;

    const getBooksByTitle = () =>
      new Promise((resolve) => {
        let filteredBooks = {};
        Object.keys(books).forEach(key => {
          if (books[key].title === title) {
            filteredBooks[key] = books[key];
          }
        });
        resolve(filteredBooks);
      });

    const result = await getBooksByTitle();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

/**
 * Register new user
 */
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (isValid(username)) {
    return res.status(409).json({ message: "User already exists" });
  }

  users.push({ username, password });
  return res.status(200).json({ message: "User successfully registered" });
});

/**
 * Get book reviews
 */
public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn]?.reviews || {});
});

module.exports.general = public_users;
