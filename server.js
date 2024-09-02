// server.js
const express = require('express');
const db = require('./database');

const app = express();

const PORT = process.env.PORT || 8001;
const HOST = process.env.HOST || '0.0.0.0';

app.use(express.json());

// Obtener todos los libros
app.get('/books', (req, res) => {
  db.all("SELECT * FROM books", [], (err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ books: rows });
  });
});

// Obtener un libro específico por ID
app.get('/books/:id', (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM books WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ book: row });
  });
});

// Crear un nuevo libro
app.post('/books', (req, res) => {
  const { title, author, published_date } = req.body;
  db.run("INSERT INTO books (title, author, published_date) VALUES (?, ?, ?)", [title, author, published_date], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id: this.lastID });
  });
});

// Actualizar un libro existente por ID
app.put('/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, published_date } = req.body;
  db.run("UPDATE books SET title = ?, author = ?, published_date = ? WHERE id = ?", [title, author, published_date, id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: `Book with ID ${id} updated` });
  });
});

// Eliminar un libro por ID
app.delete('/books/:id', (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM books WHERE id = ?", [id], function(err) {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ message: `Book with ID ${id} deleted` });
  });
});

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});