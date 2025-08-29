const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 5000;  
const cors = require('cors');
app.use(cors());

app.use(express.json());

mongoose.connect(
  'mongodb+srv://sidharth:Tulsi%40mehra0407@cluster0.bdqjbnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
  { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Updated schema with userId
const transactionSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  userId: { 
    type: String, 
    required: true 
  },
  date: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

// Keep old schema for backward compatibility
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});
const Expense = mongoose.model('Expense', expenseSchema);

app.get('/', (req, res) => {
  res.send('Backend is working with user authentication!');
});

// Get transactions for specific user
app.get('/transactions', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(401).json({ error: 'User authentication required' });
  }
  
  try {
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch transactions' });
  }
});

// Add transaction for specific user
app.post('/transactions', async (req, res) => {
  const { description, amount, type, userId } = req.body;
  
  if (!description || !amount || !type || !userId) {
    return res.status(400).json({ 
      error: 'Please include description, amount, type, and userId.' 
    });
  }
  
  try {
    const transaction = new Transaction({ 
      description, 
      amount, 
      type, 
      userId 
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add transaction' });
  }
});

// Delete transaction (only if it belongs to user)
app.delete('/transactions/:id', async (req, res) => {
  const { userId } = req.body;
  
  if (!userId) {
    return res.status(401).json({ error: 'User authentication required' });
  }
  
  try {
    const result = await Transaction.findOneAndDelete({ 
      _id: req.params.id, 
      userId: userId 
    });
    
    if (!result) {
      return res.status(404).json({ 
        error: 'Transaction not found or you do not have permission to delete it' 
      });
    }
    
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete transaction' });
  }
});

// Get summary for specific user
app.get('/summary', async (req, res) => {
  const { userId } = req.query;
  
  if (!userId) {
    return res.status(401).json({ error: 'User authentication required' });
  }
  
  try {
    const transactions = await Transaction.find({ userId });
    const income = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);
    const balance = income - expenses;
    
    res.json({
      totalIncome: income,
      totalExpenses: expenses,
      balance: balance
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch summary' });
  }
});

// Legacy routes (keep for backward compatibility)
app.get('/expenses', async (req, res) => {
  const { userId } = req.query;
  
  try {    
    if (userId) {
      // New way: filter by user
      const newExpenses = await Transaction.find({ type: 'expense', userId }).sort({ date: -1 });
      res.json(newExpenses);
    } else {
      // Old way: show all (for backward compatibility)
      const newExpenses = await Transaction.find({ type: 'expense' }).sort({ date: -1 });
      
      if (newExpenses.length === 0) {
        const oldExpenses = await Expense.find().sort({ date: -1 });
        res.json(oldExpenses);
      } else {
        res.json(newExpenses);
      }
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch expenses' });
  }
});

app.post('/expenses', async (req, res) => {
  const { description, amount, userId } = req.body;
  
  if (!description || !amount) {
    return res.status(400).json({ error: 'Please include description and amount.' });
  }
  
  try {    
    const transaction = new Transaction({ 
      description, 
      amount, 
      type: 'expense',
      userId: userId || 'legacy' // For backward compatibility
    });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add expense' });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  const { userId } = req.body;
  
  try {    
    let result;
    
    if (userId) {
      // New way: only delete if belongs to user
      result = await Transaction.findOneAndDelete({ _id: req.params.id, userId });
    } else {
      // Old way: delete any (for backward compatibility)
      result = await Transaction.findByIdAndDelete(req.params.id);
    }
        
    if (!result) {
      result = await Expense.findByIdAndDelete(req.params.id);
    }
    
    if (!result) {
      return res.status(404).json({ error: 'Expense not found' });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});