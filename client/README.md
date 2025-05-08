# 🌳 Fruit Tree Tracker App

A full-stack application for tracking planted fruit trees, managing user profiles, and participating in a discussion forum — built with **React**, **Flask**, and **SQLite**.

---

## Features

### User Authentication
- Register and login securely
- Passwords hashed using Bcrypt
- User sessions managed with Flask session cookies

### Tree Tracker
- Logged-in users can add, view, edit, and delete fruit trees
- Each tree includes:
  - Geolocation (lat/lng)
  - Fruit type
  - Address (optional)
  - Notes

### Fruit Types
- Admin can add new fruit types (name, image URL, info, and season)
- Used to categorize planted trees

### User Portal
- Profile editor: first name, last name, bio (locally stored for now)
- Displays user-specific information

### Community Forum
- Create public posts (title + content)
- Posts can optionally be linked to a user

---

## Tech Stack

| Layer       | Technology         |
|-------------|--------------------|
| Frontend    | React, MUI, Formik, Yup |
| Backend     | Flask, SQLAlchemy, Flask-RESTful |
| Database    | SQLite             |
| Auth        | Bcrypt + Flask session |
| API         | RESTful endpoints  |

---

##  Getting Started

### Clone the repository
    ```bash
    git clone https://github.com/your-username/fruit-tree-tracker.git
    cd fruit-tree-tracker
 
 ### Backend Setup:
    cd server
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    flask db upgrade  # Ensure migrations are applied
    python seed.py    # (Optional) Seed initial data
    python app.py     # Run Flask app

    React app runs at: http://localhost:3000

   
 ### Security Notes
    Passwords are stored hashed using Bcrypt

    Session management is done via Flask sessions (cookie-based)

    CORS is enabled for development (localhost:3000)

    No CSRF protection or role-based access control yet — not production-ready

 ### Project Structure

    client/               # React frontend
    ├── components/       # React components (UserPortal, TreeList, etc.)
    ├── App.js
    └── ...

    server/               # Flask backend
    ├── models.py         # SQLAlchemy models
    ├── app.py            # Flask app & routes
    ├── config.py         # Database config
    ├── seed.py           # (Optional) Seeding script
    └── ...

### Future Improvements

    Future Improvements
    Persist profile edits to the backend

    Add image uploads for trees

    Enable comment threads in the forum

    Role-based admin controls for fruit types