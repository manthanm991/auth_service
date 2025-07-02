
# 🔐 Auth Service – MERN Stack

A full-stack authentication system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring secure login, registration, token-based authentication (JWT), and concurrent frontend/backend development setup.

## 📁 Project Structure

```
auth/
├── backend/              # Node.js + Express + MongoDB
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── db.js
│   ├── index.js
│   ├── .env              # Backend environment variables
│   └── package.json
├── public/
├── src/                  # React frontend
│   ├── assets/
│   ├── Auth/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── components/
│   └── App.js
├── .env                  # Frontend environment variables
├── package.json
├── README.md
```

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/auth.git
cd auth
```

### 2. Install Dependencies

Install both frontend and backend dependencies:

```bash
# Root (frontend)
npm install

# Backend
cd backend
npm install
cd ..
```

### 3. Configure Environment Variables

#### Backend (`/backend/.env`)
```env
PORT=5000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
```

#### Frontend (`/.env`)
```env
PORT=3000
```

> You can also add a `"proxy"` field in frontend `package.json` to avoid CORS:
```json
"proxy": "http://localhost:5000"
```

### 4. Run the Application

Use `concurrently` to start both frontend and backend:

```bash
npm run dev
```

This runs:
- React frontend at [http://localhost:3000](http://localhost:3000)
- Node backend at [http://localhost:5000](http://localhost:5000)

## 🧪 Available Scripts

From the root project:

- `npm start` — starts the frontend only (React)
- `npm run dev` — runs both frontend and backend using concurrently
- `npm run build` — builds frontend for production

From `/backend`:

- `node index.js` or `nodemon index.js` — runs the backend server

## 🔐 Features

- JWT-based authentication
- Secure registration and login
- Form input validation (email/password)
- MongoDB for data persistence
- Toast messages for UI feedback
- Environment variable support via `dotenv`
- CORS handled via proxy configuration
- Middleware for protected routes

## ⚠️ Webpack Deprecation Warning Fix

If you see warnings like:

```
[DEP_WEBPACK_DEV_SERVER_ON_BEFORE_SETUP_MIDDLEWARE] option is deprecated
```

To resolve:

- Upgrade `react-scripts` to the latest version:
  ```bash
  npm install react-scripts@latest
  ```
- Or use `craco` to override Webpack config without ejecting:
  ```bash
  npm install @craco/craco --save
  ```

Then, replace `react-scripts` commands in `package.json` with `craco` and create a `craco.config.js` to configure `devServer.setupMiddlewares`.

## 🛠 Future Improvements

- Role-based access control
- Email verification & password reset
- Rate limiting & brute-force protection
- Dockerize for consistent environments

## 📄 License

This project is licensed under the MIT License.

## 🙌 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Create React App](https://create-react-app.dev/)


---
<div align="center">

Developed by **Manthan Makode**<br>
📧 [Email](mailto:manthanmakode991@gmail.com) | 
🔗 [LinkedIn](https://www.linkedin.com/in/manthan-makode/) | 
💻 [GitHub](https://github.com/manthanm991) 
<div>
