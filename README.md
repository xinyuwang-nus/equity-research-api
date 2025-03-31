
# 📊 Equity Research API

This project provides an authenticated backend API for generating and managing equity research reports using financial data, real-time stock data (Yahoo Finance), and LLMs (Anthropic Claude).

🌐 Live API: http://54.211.30.146:3000 (hosted on AWS EC2)

---
## 🏗️ Project Structure

```
equity-research-api/
├── controllers/         # Handles auth and report logic
├── data/                # Contains static company files
├── middleware/          # Auth and role-checking middlewares
├── models/              # Mongoose models for User and Report
├── routes/              # API route definitions
├── services/            # LLM generation logic
├── utils/               # Helpers: data loader, prompt builder, Yahoo stock fetcher
├── app.js               # Express app definition
├── server.js            # Entry point, connects to MongoDB and starts server
```

---

## 🔐 Features

- **User authentication** using JWT (signup/login)
- **Role-based authorization** (`user`, `admin`)
- **LLM-powered report generation** using Anthropic Claude
- **Export reports** as Markdown or PDF
- **MongoDB integration** via Mongoose
- **Fetch stock data** via Yahoo Finance API
- **Admin route** to access all user reports

---

## 📦 Setup Instructions

### 1. **Clone the repo**
```bash
git clone https://github.com/your-username/equity-research-api.git
cd equity-research-api
```

### 2. **Install dependencies**
```bash
npm install
```

### 3. **Configure `.env`**

Create a `.env` file in the root directory:

```env
PORT=3000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/your-db
JWT_SECRET=your-jwt-secret
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. **Start MongoDB**
You can use:
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (recommended)
- Or local MongoDB server

### 5. **Start the server**
```bash
npm start
```

Server will run at: `http://localhost:3000`

---

## 🚀 API Endpoints

### Documentation

- A Postman collection is included for easy testing.
- Import the collection file into Postman:  
  [`equity-research-api.postman_collection.json`](./equity-research-api.postman_collection.json)


### Auth Routes

| Method | Endpoint         | Description         |
|--------|------------------|---------------------|
| POST   | `/auth/signup`   | Register a new user |
| POST   | `/auth/login`    | Login and receive JWT |

### Report Routes (🔐 require JWT in `Authorization` header)

| Method | Endpoint                        | Description                          |
|--------|----------------------------------|--------------------------------------|
| POST   | `/reports/`                      | Submit new report (starts generation) |
| GET    | `/reports/`                      | Get all reports for the user         |
| GET    | `/reports/:id`                   | Get report by ID                     |
| GET    | `/reports/:id/export-text`       | Download report as Markdown file     |
| GET    | `/reports/:id/export-pdf`        | Download report as PDF file          |
| DELETE | `/reports/:id`                   | Delete a report                      |
| GET    | `/reports/admin/all`             | Admin-only: View all reports         |

📝 **Note**: Provide JWT token like this:
```http
Authorization: Bearer <your_token_here>
```

---

## 🛠️ Tech Stack

- **Node.js** – JavaScript runtime environment for building the server.
- **Express.js** – Web framework for routing and middleware.
- **MongoDB** – NoSQL database for storing users and reports.
- **Mongoose** – ODM (Object Data Modeling) library for MongoDB integration.
- **JWT (JSON Web Token)** – Secure token-based authentication.
- **bcrypt** – Hashing library for storing encrypted passwords.
- **Anthropic Claude API** 
  - Endpoint: `https://api.anthropic.com/v1/messages`
  - Model: `claude-3-5-haiku-20241022`
  - Requires API Key
- **Yahoo Finance** – Fetches real-time stock data like price, market cap, P/E ratio.
- **pdfkit** – Generates downloadable PDF versions of reports.
- **AWS EC2** - Hosting the backend API

---

## 🧪 Testing

Use **Postman** or **cURL** to interact with the API.  

---

## 📄 License

MIT © Xinyu Wang

