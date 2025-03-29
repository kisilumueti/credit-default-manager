# 📌 Credit Default Management System

### 🎓 A Class Group Project for **Advanced Database Systems**
#### **St. Paul’s University | 4th Year | Bachelor’s Degree Program**

## 👥 Group Members
- **BOBITNRB318722**
- **BOBITNRB403222**
- **BOBITLMR230622**
- **BOBITNRB558122**
- **BOBITNRB387822**

## 📜 Project Overview
The **Credit Default Management System** is a full-stack web application designed to help manage credit default records efficiently. It leverages **PostgreSQL**, with the database hosted on **Oracle Cloud**, and provides an interactive user interface for managing and analyzing data.

### 🚀 Tech Stack
- **Backend**: Node.js, Express.js
- **Frontend**: React.js
- **Database**: PostgreSQL (hosted on Oracle Cloud)
- **API Documentation**: Swagger UI

## 🏗️ Installation Guide
### 🔹 Prerequisites
Before running this project, ensure you have the following installed:
- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/)
- [Git](https://git-scm.com/)

### 🔹 Clone the Repository
```sh
 git clone https://github.com/your-username/credit-default-management.git
 cd credit-default-management
```

### 🔹 Install Dependencies
```sh
 npm install
```

### 🔹 Set Up PostgreSQL Database
1. **Create a PostgreSQL Database:**
   ```sql
   CREATE DATABASE credit_default;
   ```
2. **Restore the database from backup:**
   ```sh
   psql -U your_username -d credit_default -f group-j.sql
   ```

### 🔹 Set Up Environment Variables
Create a `.env` file in the root directory and configure the following:
```env
DB_HOST=your-oracle-cloud-host
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=credit_default
PORT=5000
```

### 🔹 Run the Backend Server
```sh
 npm start
```
The backend should now be running at **http://localhost:5000**

### 🔹 Run the Frontend
```sh
 cd frontend
 npm install
 npm start
```
The frontend should now be running at **http://localhost:3000**

## 📖 API Documentation
Swagger UI is integrated for API documentation.
- Open: **http://localhost:5000/api-docs** to view API endpoints.

## 🚀 Contribution & Future Enhancements
We welcome contributions to improve the project. Future enhancements may include:
- Improved data visualization
- AI-based credit risk analysis

## 📜 License
This project is for academic purposes and is licensed under **MIT License**.
