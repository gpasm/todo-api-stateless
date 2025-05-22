// server.js
const express = require('express');
const path = require('path');
const db = require('./db'); // <-- SQLite DB connection
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET all todos
app.get('/todos', (req, res) => {
  const query = `SELECT * FROM todos`;
  db.all(query, [], (err, rows) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve todos', error: err });
    res.json(rows);
  });
});

// GET todo by ID
app.get('/todos/:id', (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM todos WHERE id = ?`;
  db.get(query, [id], (err, row) => {
    if (err) return res.status(500).json({ message: 'Failed to retrieve todo', error: err });
    if (!row) return res.status(404).json({ message: 'Todo item not found' });
    res.json(row);
  });
});

// POST new todo
app.post('/todos', (req, res) => {
  const { name, priority = 'low', isFun = true } = req.body;

  const parsedIsFun = (isFun === true || isFun === 'true') ? 1 : 0;

  const query = `INSERT INTO todos (name, priority, isComplete, isFun) VALUES (?, ?, 0, ?)`;
  db.run(query, [name, priority, parsedIsFun], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to add todo', error: err.message });
    res.status(201).json({
      id: this.lastID,
      name,
      priority,
      isComplete: false,
      isFun: !!parsedIsFun,
    });
  });
});

// DELETE a todo by ID
app.delete('/todos/:id', (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM todos WHERE id = ?`;
  db.run(query, [id], function (err) {
    if (err) return res.status(500).json({ message: 'Failed to delete todo', error: err });
    if (this.changes === 0) return res.status(404).json({ message: 'Todo item not found' });
    res.json({ message: `Todo item ${id} deleted.` });
  });
});

// Start server
app.listen(port, () => {
  console.log(`Todo API server running at http://localhost:${port}`);
});
