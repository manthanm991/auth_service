
# 🔐 Auth Service – MERN Stack

A full-stack authentication system built using the MERN stack (MongoDB, Express.js, React.js, Node.js) featuring secure login, registration, token-based authentication (JWT), Google One Tap login (OAuth), and bot protection via reCAPTCHA v3.

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
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
```

#### Frontend (`/.env`)
```env
PORT=3000
REACT_APP_GOOGLE_CLIENT_ID=your_google_client_id
REACT_APP_RECAPTCHA_SITE_KEY=your_recaptcha_site_key
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

---

## 🔐 Auth Features

### ✅ Core Features

- JWT-based authentication
- Secure registration and login
- MongoDB for data persistence
- Form input validation (email/password)
- Middleware for protected routes
- Toast messages for UI feedback
- Environment variable support via `dotenv`
- CORS handled via proxy configuration

### 🔑 Google OAuth – One Tap Sign-In

- Frontend uses **Google Identity Services** to show a "Continue with Google" button.
- Backend verifies the `id_token` using `google-auth-library`.
- Automatically creates or updates users using their Google account.
- Seamless login with minimal friction.

> 📌 Make sure to configure the `GOOGLE_CLIENT_ID` in both frontend and backend `.env` files.

### 🛡️ reCAPTCHA v3 Integration

- Uses Google's reCAPTCHA v3 to prevent bot signups.
- Client fetches a token before form submission using:
  ```js
  window.grecaptcha.execute(REACT_APP_RECAPTCHA_SITE_KEY, { action: 'submit' });
  ```
- Backend verifies the token with Google's server before allowing registration.
- Ensures only human users can submit sensitive forms.

> 🔐 You'll need a **site key** (for frontend) and **secret key** (for backend) from [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin).

---

## 🧪 Available Scripts

From the root project:

- `npm start` — starts the frontend only (React)
- `npm run dev` — runs both frontend and backend using concurrently
- `npm run build` — builds frontend for production

From `/backend`:

- `node index.js` or `nodemon index.js` — runs the backend server

---

## 🛠 Future Improvements

- Role-based access control
- Email verification & password reset
- Rate limiting & brute-force protection
- Dockerize for consistent environments
- Refresh token implementation

---

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

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙌 Acknowledgments

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://mongodb.com/)
- [JWT.io](https://jwt.io/)
- [Google Identity Services](https://developers.google.com/identity)
- [reCAPTCHA v3](https://developers.google.com/recaptcha)

---

<div align="center">

Developed by **Manthan Makode**<br>
📧 [Email](mailto:manthanmakode991@gmail.com) | 
🔗 [LinkedIn](https://www.linkedin.com/in/manthan-makode/) | 
💻 [GitHub](https://github.com/manthanm991) 

</div>