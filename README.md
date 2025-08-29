# 🗄️ Expense & Income Tracker — Backend (Node.js + Express + MongoDB Atlas)

This is the backend REST API server for the Expense & Income Tracker App.  
It uses *Node.js, **Express, **MongoDB Atlas, and supports **user authentication* (via Auth0) for secure, private tracking.

---

## ✨ Features

- *RESTful CRUD API:* Add, delete, and fetch transactions (expenses/income)
- *User-Based Data:* Each transaction is tied to a unique user (via Auth0 userId)
- *MongoDB Atlas:* Cloud-hosted and scalable database
- *CORS Enabled:* Ready for frontend integration
- *Secure*: Only logged-in users can view or modify their data

---

## ⚡ API Endpoints

### Authentication required for all routes via Auth0.

| Method | Endpoint                  | Description                                  |
|--------|---------------------------|----------------------------------------------|
| GET    | /transactions?userId=UID | List all of user's transactions (income & expenses) |
| POST   | /transactions           | Add a transaction { description, amount, type, userId } |
| DELETE | /transactions/:id       | Delete a transaction by ID (if owner)        |
| GET    | /summary?userId=UID     | Get summary (totalIncome, totalExpenses, balance) |
| GET    | /expenses?userId=UID    | (Legacy) List all user's expenses only       |
| POST   | /expenses               | (Legacy) Add an expense                      |
| DELETE | /expenses/:id           | (Legacy) Delete an expense                   |

- For all POST/DELETE, always provide the Auth0 userId in the body.

---

## 🚦 Getting Started

### 1. *Clone the Repository*

git clone https://github.com/Sidharth-Mehra-0407/expence-tracker-backend.git
cd expence-tracker-backend

### 2. *Install Dependencies*

npm install

### 3. *Set Up Your MongoDB Atlas URI*
- Make sure your .env or the mongoose.connect line contains your *actual connection string*.
- Format:- mongodb+srv://<username>:<password>@cluster0.bdqjbnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
- If your password contains @, replace it with %40.

### 4. *Run the Server*

npm start

Runs on *PORT 5000* by default.

---

## 🚀 Deployment

- Recommended: Deploy to [Render.com](https://render.com/) or [Railway](https://railway.app/).
- Make sure to allow your frontend’s domain in CORS and on Auth0 dashboard.

---

## 📎 Example POST payload (Add transaction)

{
"description": "Salary",
"amount": 10000,
"type": "income",
"userId": "auth0|abc123"
}

---

## 🔒 Security

- All transaction data is linked with Auth0 userId
- Endpoints return *only the logged-in user’s data*

---

## 🛠️ Built With

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Auth0](https://auth0.com/)

---

## 🖥️ Related

- [Frontend Repo](https://github.com/Sidharth-Mehra-0407/expence-tracker-frontend)

---

## 🙏 Credits

- Made by Sidharth Mehra.
