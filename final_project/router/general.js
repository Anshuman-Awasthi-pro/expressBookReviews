const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const { username, password } = req.body;
  
    if (!username || !password) {
      return res.status(400).json({ message: "Username or password missing" });
    }
  
    if (isValid(username)) {
      return res.status(409).json({ message: "User already exists" });
    }
  
    users.push({ username, password });
    return res.status(200).json({ message: "User successfully registered" });
  });
  
  

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
    return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      res.json(books[isbn]);
    } else {
      res.status(404).json({ message: "Book not found" });
    }
  });
  
  
// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let result = {};
  
    // Get all ISBN keys from books object
    Object.keys(books).forEach((key) => {
      if (books[key].author === author) {
        result[key] = books[key];
      }
    });
  
    // Send matching books
    res.send(JSON.stringify(result, null, 4));
  });
  

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    let result = {};

    // Iterate through all books
    Object.keys(books).forEach((key) => {
        if (books[key].title === title) {
            result[key] = books[key];
        }
    });

    res.send(JSON.stringify(result, null, 4));
});


//  Get book review
// Get book review
public_users.get('/review/:isbn', function (req, res) {
    const isbn = req.params.isbn;
  
    if (books[isbn]) {
      res.send(books[isbn].reviews);
    } else {
      res.send("No book found with the given ISBN");
    }
  });
  

module.exports.general = public_users;
