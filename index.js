const express = require('express');
const app = express();
const PORT = process.env.Port || 5000;
const cors = require('cors');
app.use(cors());

app.use(express.json());

let expenses = []; 

app.get('/', (req, res) => {
  res.send('Backend is working!');
});

app.get('/expenses', (req, res) => {
  res.json(expenses);
});

app.post('/expenses', (req, res) => {
  const { description, amount } = req.body;
  if (!description || !amount) {
    return res.status(400).json({ error: 'Please include description and amount.' });
  }
  const expense = { id: expenses.length + 1, description, amount, date: new Date().toISOString() };
  expenses.push(expense);
  res.status(201).json(expense);
});

app.delete('/expenses/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const prevLength = expenses.length;
  expenses = expenses.filter(exp => exp.id !== id);
  if (expenses.length === prevLength) {
    return res.status(404).json({ error: 'Expense not found' });
  }
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});