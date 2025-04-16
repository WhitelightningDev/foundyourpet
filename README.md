# 🐾 FoundYourPet

**FoundYourPet** is a comprehensive pet safety and management application that connects pet owners with a smart tagging system. Designed to keep your pets safe, the platform allows you to register your pets, manage their profiles, subscribe to tag packages, and even generate QR codes for quick identification and recovery.

## 🔗 Live Demo

Coming Soon...

---

## 📦 Features

- 🔐 **User Authentication**
  - JWT-based secure login and registration
  - Role-based routing for Admin and User dashboards

- 🐶 **Pet Management**
  - Add, view, and edit detailed pet profiles
  - Manage medical info, microchip details, diet, training level, vet info, etc.

- 🏷️ **Smart Tag Packages**
  - Choose from Standard, Apple AirTag, or Samsung SmartTag packages
  - Dynamic add-on pricing and engraving options
  - Optional monthly support membership (includes benefits like free replacements)

- 🧾 **Integrated Payments**
  - Yoco payments for initial and recurring package billing

- 📸 **QR Code Generation**
  - Admin-generated dynamic QR codes
  - Anyone can scan the code and view pet-owner contact details without logging in

- 🛠️ **Admin Dashboard**
  - View all registered users
  - Manage backend-generated QR tags and pet data

---

## 📁 Project Structure

foundyourpet/ ├── backend/ # Node.js/Express + MongoDB API │ ├── models/ # Mongoose models (User, Pet, Package, AddOn) │ ├── routes/ # API routes for users, pets, packages │ ├── controllers/ # Request handlers │ └── middleware/ # Auth & role verification │ ├── frontend/ # React application │ ├── components/ # UI components (cards, modals, nav) │ ├── pages/ # Dashboard, Login, Admin │ ├── services/ # API calls, edit/add pet logic │ └── utils/ # JWT decoding, helpers


---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- MongoDB
- Yarn or NPM
- Yoco API keys (for payment integration)

### Backend


cd backend
npm install
npm run dev
Create a .env file:

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
YOCO_SECRET_KEY=your_yoco_secret
Frontend

cd frontend
npm install
npm start
🧠 Tech Stack
Frontend: React, Tailwind CSS, Axios

Backend: Node.js, Express, MongoDB, Mongoose

Auth: JWT

Payments: Yoco API

QR Code: qrcode NPM package

💡 Future Roadmap
🔔 SMS/Email alerts when pet is found

📍 Real-time location tracking for SmartTags

📝 Subscription history and invoice downloads

📊 Analytics for pet profile completeness

🤝 Contributing
Pull requests are welcome! Please open an issue first to discuss what you would like to change or add.

📃 License
