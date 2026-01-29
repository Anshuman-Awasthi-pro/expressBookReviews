const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;

const public_users = express.Router();


public_users.get('/', async (req, res) => {
  try {
    // Simulating async behavior using Promise
    const getBooks = new Promise((resolve, reject) => {
      resolve(books);
    });

    const result = await getBooks;
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});


public_users.get('/isbn/:isbn', async (req, res) => {
  try {
    const isbn = req.params.isbn;

    const getBook = new Promise((resolve, reject) => {
      if (books[isbn]) resolve(books[isbn]);
      else reject("Book not found");
    });

    const result = await getBook;
    res.status(200).json(result);
  } catch (error) {
    res.status(404).json({ message: error });
  }
});


public_users.get('/author/:author', async (req, res) => {
  try {
    const author = req.params.author;
    const result = {};

    const getBooksByAuthor = new Promise((resolve, reject) => {
      Object.keys(books).forEach(key => {
        if (books[key].author === author) {
          result[key] = books[key];
        }
      });
      resolve(result);
    });

    const booksByAuthor = await getBooksByAuthor;
    res.status(200).json(booksByAuthor);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});

public_users.get('/title/:title', async (req, res) => {
  try {
    const title = req.params.title;
    const result = {};

    const getBooksByTitle = new Promise((resolve, reject) => {
      Object.keys(books).forEach(key => {
        if (books[key].title === title) {
          result[key] = books[key];
        }
      });
      resolve(result);
    });

    const booksByTitle = await getBooksByTitle;
    res.status(200).json(booksByTitle);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving books" });
  }
});


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


public_users.get('/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  res.status(200).json(books[isbn]?.reviews || {});
});

module.exports.general = public_users;
