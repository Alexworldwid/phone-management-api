# Phone Management App

A CRUD web application for managing phone models and categories with admin-protected actions.

## Features

- Create, update, and delete phones
- Phone categories with relational integrity
- Admin password protection for destructive actions
- Server-side validation
- PostgreSQL database with UUID primary keys

## Tech Stack

- Node.js
- Express
- PostgreSQL
- EJS
- express-validator

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL

### Installation

```bash
git clone https://github.com/yourusername/phone-management-app.git
cd phone-management-app
npm install


### env

DATABASE_URL=postgresql://user:password@localhost:5432/phone_db
ADMIN_PASSWORD=your_admin_password
PORT=3000



## Run the app
npm start
