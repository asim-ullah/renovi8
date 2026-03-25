# 🏠 Renovi8 – Smart Home Upgrades Made Simple

Renovi8 is a modern MERN stack platform designed to simplify home upgrade services by connecting customers with professional technicians. The platform allows users to browse services, place orders, schedule installations, and track progress — all in one seamless interface.

Built with scalability and user experience in mind, Renovi8 delivers a clean, responsive, and highly interactive UI inspired by premium SaaS platforms.

---

## 🚀 Features

### 👤 Customer Features

* Browse home upgrade products and services
* Place and manage orders بسهولة
* Track real-time order status with timeline
* Schedule installation services
* Manage profile and personal information
* Receive notifications for updates

---

### 🛠 Admin Features

* Complete dashboard with analytics
* Manage products, categories, and pricing
* Full order management system
* Assign technicians to orders
* Manage workers (technicians)
* Handle user accounts and reviews
* Monitor revenue and performance

---

### 👷 Worker Management

* Add, edit, and delete technicians
* Assign workers to specific orders
* Track availability and specialization

---

### 📊 Analytics Dashboard

* Total revenue tracking
* Order insights (pending, completed)
* Monthly performance charts
* Most ordered products analysis

---

### 🔔 Notification System

* New order alerts
* Status updates
* Review notifications

---

## 🎨 UI/UX Highlights

* Modern SaaS-inspired design (Stripe / Linear style)
* Fully responsive (Mobile, Tablet, Desktop)
* Smooth animations using Framer Motion
* Interactive dashboards and widgets
* Skeleton loaders and clean empty states
* Toast notifications and confirmation dialogs

---

## 🧭 Navigation System

* Sticky header with profile & notifications
* Breadcrumb navigation (e.g. Dashboard → Orders → Details)
* Back navigation for better UX
* Mobile-friendly collapsible sidebar

---

## 🛠 Tech Stack

**Frontend**

* React.js
* Tailwind CSS
* Framer Motion
* Recharts / Chart.js

**Backend (MERN Ready)**

* Node.js
* Express.js
* MongoDB

---

## 📂 Project Structure

```
client/
 ├── components/
 ├── pages/
 ├── layouts/
 ├── hooks/
 ├── services/
 └── utils/

server/
 ├── controllers/
 ├── models/
 ├── routes/
 └── middleware/
```

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/renovi8.git
cd renovi8
```

### 2. Install dependencies

```bash
cd client
npm install

cd ../server
npm install
```

### 3. Run the application

```bash
# Start backend
cd server
npm run dev

# Start frontend
cd client
npm start
```

---

## 🌐 Environment Variables

Create a `.env` file in the server directory:

```
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

---

## 📸 Core Modules

* Authentication & Authorization
* Product & Category Management
* Order & Service Scheduling
* Worker Assignment System
* Analytics Dashboard
* Notification System

---

## 🔮 Future Enhancements

* Real-time chat between customer & technician
* AI-based service recommendations
* Mobile application (React Native)
* Multi-language support
* Advanced reporting tools

---

## 🤝 Contribution

Contributions are welcome!

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a pull request

---

## 💡 About Renovi8

Renovi8 combines **renovation and innovation** to deliver a seamless digital experience for home upgrades. Whether it's installing new appliances or upgrading your living space, Renovi8 ensures everything is handled efficiently and professionally.

---

### ⭐ If you like this project, don't forget to star the repository!
