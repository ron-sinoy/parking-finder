# Parking Finder

Parking Finder is a full-stack web application that helps users find available parking spaces through a simple and responsive interface. It includes secure user authentication using JSON Web Tokens (JWT) to protect user accounts and authenticated routes.

## Features

* User registration and login
* JWT-based authentication
* Secure protected routes
* Browse available parking spaces
* Responsive user interface

## Tech Stack

**Frontend**

* React

**Backend**

* Express.js

**Authentication**

* JSON Web Tokens (JWT)

## Getting Started

### Backend
```
cd backend
npm install
node server.js
```

### Frontend
```
cd frontend
npm install
npm start
```

### CORS Configuration
The backend uses the `cors` package to allow requests from the frontend. Install it if not already present:
```
npm install cors
```

In `server.js`:
```js
const cors = require('cors');
app.use(cors({ origin: 'http://localhost:3000' }));
```
