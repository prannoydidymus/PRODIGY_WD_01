# PRODIGY_WD_01: Secure User Authentication System

This repository contains **Task-01** for the Prodigy InfoTech Web Development Internship.

The goal of this task is to implement a secure user authentication system with secure login and registration functionality. Users can sign up for an account, log in securely, and access protected routes only after successful authentication.

---

## 🔒 Features & Security Mechanics

1. **Client-Side Cryptographic Hashing**:
   - Implements native **Web Cryptography API** (`crypto.subtle.digest`) to hash user passwords with **SHA-256** on the client side.
   - Plaintext passwords are *never* stored or evaluated in plaintext.

2. **Session Management & Route Protection**:
   - Dynamic router verifies `sessionStorage` on page initialization.
   - Unauthorized users trying to load the dashboard are automatically intercepted and redirected to the login panel.
   - Session keys are cleared immediately upon logging out.

3. **Role-Based Access Control (RBAC)**:
   - Registers users as either a **Standard User** or an **Administrator**.
   - **Standard Users**: View a personalized welcome card and mock system statistics.
   - **Administrators**: Get access to an **Admin Control Panel** containing a live accounts database table and a scrolling security log terminal.

4. **Interactive Security Logs**:
   - Emulates server logs showing registrations, database seeding, failed logins (flagged as danger/warning), successful logouts, and user deletions.

5. **Real-time Input Validation & UI Features**:
   - Interactive password strength meter evaluating length, casing, numbers, and symbols.
   - Visibility toggle (show/hide password).
   - Animated floating toast alerts for actions.

---

## 📂 File Structure
```text
PRODIGY_WD_01/
├── index.html        # Single-Page portal with Login, Sign up, and Dashboards
├── style.css         # Cybersecurity-themed dark mode UI stylesheets
├── script.js         # Security controllers, hashing functions, session management & routing
├── README.md         # Documentation
└── assets/
    └── images/
        └── auth_banner.png  # cybersecurity layout visual banner
```

---

## 🚀 How to Run & Test Locally

1. Double-click **`index.html`** in your file explorer, or run it through a local server.
2. The database is pre-seeded with two default accounts for easy testing:
   
   | Role | Email Address | Password |
   | :--- | :--- | :--- |
   | **Administrator** | `admin@guardian.com` | `Admin@123` |
   | **Standard User** | `user@guardian.com` | `User@123` |

3. Try logging in with the Admin credentials to inspect the database, view password hashes, and see security logs update in real time!
4. Create a new user with the Registration form to test password strength and role assignment.
