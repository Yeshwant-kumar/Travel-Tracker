# 🌍 Travel Tracker

An interactive, 3D Globe Travel Tracker web application built with **Node.js**, **Express**, **PostgreSQL**, **React**, and **Globe.gl**. Track your travels around the world with personal user profiles and visually explore the globe in 3D with customized marker colors for each member.

---

## ✨ Features

- **🌐 3D Interactive Globe**: Rendered using Three.js and Globe.gl with auto-rotation, polygon altitude extrusion, and hover tooltips showing country names and ISO codes.
- **🎨 Personalized Themes**: Each user chooses their own custom marker color (Teal, Powder Blue, Coral, Gold, Purple) to highlight visited countries on the globe.
- **🔐 User Authentication**: Secure user registration and login system with encrypted passwords powered by `bcryptjs` and session persistence via `express-session`.
- **📍 Real-Time Tracking**: Instant addition and visualization of visited countries with backend duplicate checks and fuzzy country name matching.
- **💎 Modern Dark UI**: Sleek glassmorphism overlay panel with responsive styling.
- **🛡️ Secure Configuration**: Environment variable support with `.env` to keep database credentials and secrets private.

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL (`pg` client)
- **Frontend**: React 18, Babel (JSX), EJS, CSS3 Glassmorphism
- **3D Visualization**: Globe.gl, Three.js
- **Security & Sessions**: `bcryptjs`, `express-session`, `dotenv`

---

## 📋 Prerequisites

Before running the application, make sure you have:

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [PostgreSQL](https://www.postgresql.org/) installed and running locally

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/Yeshwant-kumar/Travel-Tracker.git
cd Travel-Tracker
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

1. Open PostgreSQL (via `psql` or pgAdmin) and create a database named `world`:

   ```sql
   CREATE DATABASE world;
   ```

2. Connect to the `world` database and execute the schema defined in `schema.sql`:

   ```sql
   \c world
   \i schema.sql
   ```

   *(Optional: Load ISO country code reference data into the `countries` table if not already populated.)*

### 4. Configure Environment Variables

Create a `.env` file in the root directory by copying the example file:

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL database credentials and session secret:

```env
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=world
DB_PASSWORD=your_postgres_password
DB_PORT=5432

SESSION_SECRET=your_super_secret_session_key
PORT=3000
```

### 5. Run the Application

Start the development server:

```bash
npm start
```

Or run with automatic restart on file changes (Node.js 18+):

```bash
npm run dev
```

Visit the application in your browser:
```
http://localhost:3000
```

---

## 📁 Project Structure

```plaintext
Travel-Tracker/
├── public/
│   └── styles/
│       ├── main.css         # Main 3D dashboard & auth styling
│       └── new.css          # Color picker styles
├── views/
│   ├── index.ejs            # Main React SPA with 3D Globe.gl integration
│   └── new.ejs              # Legacy add user template
├── .env.example             # Example environment configuration
├── .gitignore               # Ignored files (node_modules, .env, logs)
├── index.js                 # Express server & REST API endpoints
├── package.json             # Project dependencies and scripts
├── schema.sql               # PostgreSQL database schema
└── README.md                # Project documentation
```

---

## 🔒 Security Best Practices

- Real database passwords and sensitive session keys must **never** be committed to version control.
- Ensure your `.env` file is excluded via `.gitignore` before making any commits.

---

## 📄 License

This project is open source and available under the [ISC License](LICENSE).
