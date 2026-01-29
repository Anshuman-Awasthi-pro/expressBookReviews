const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];


// Check if username already exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate username & password
const authenticatedUser = (username, password) => {
  return users.some(
    user => user.username === username && user.password === password
  );
};



regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  if (authenticatedUser(username, password)) {
    const accessToken = jwt.sign(
      { username },
      "access",
      { expiresIn: "1h" }
    );

    req.session.authorization = {
      accessToken,
      username
    };

    return res.json({ message: "User successfully logged in" });
  } else {
    return res.status(401).json({ message: "Invalid username or password" });
  }
});


regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization?.username;

  if (!review) {
    return res.status(400).json({ message: "Review is required" });
  }

  if (books[isbn]) {
    books[isbn].reviews[username] = review;
    return res.json({ message: "Review successfully added/updated" });
  } else {
    return res.status(404).json({ message: "Book not found" });
  }
});



regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization?.username;

  if (books[isbn] && books[isbn].reviews) {
    if (books[isbn].reviews[username]) {
      delete books[isbn].reviews[username];
      return res.json({ message: "Review deleted successfully" });
    } else {
      return res.json({ message: "No review found for this user" });
    }
  } else {
    return res.json({ message: "Book not found" });
  }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
