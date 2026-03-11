# Fast Fuel – Backend API

## Description

This repository contains the backend API for **Fast Fuel**, a fast-food ordering web application.

The API was built using **Node.js, Express, and MySQL**, and is responsible for handling product data, order creation, order tracking, and administrative order management.

The backend communicates with the **Fast Fuel frontend application**, which provides the user interface where customers can browse the menu, place orders, and track their order status in real time.

This project follows a layered architecture based on **MVC and a service layer**, where routes, controllers, services, and models are separated to keep the code organized and maintainable.

🔗 **Live Demo (Frontend):** https://fast-fuel-project-git-main-fabioesilveiras-projects.vercel.app/  
📦 **Frontend Repo:** https://github.com/fabioesilveira/FAST-FUEL-PROJECT

---

## Tech Stack

**Backend**

- Node.js  
- Express.js  

**Database**

- MySQL  

**Authentication & Security**

- JSON Web Tokens (JWT)  
- bcrypt (password hashing)

**Architecture**

- MVC (Model–View–Controller)
- Service Layer pattern

**Deployment**

- Railway

---

## Features

### Order System

Fast Fuel simulates a realistic order processing workflow. Customers can place orders by selecting products and the system automatically calculates the final price including tax, delivery fee, and combo discounts.

Orders move through a simple workflow that represents how a restaurant processes incoming orders.

- **received** – the order has been created by the customer  
- **in_progress** – the restaurant accepted the order and started preparing it  
- **sent** – the order has been dispatched for delivery  
- **completed** – the customer confirmed the order was received  

Each time the order status changes, the system records the corresponding timestamp in the database (for example when the order is accepted, sent, or confirmed). This allows the system to track when each step of the order process happened.

Administrators control the preparation and delivery stages while customers confirm when they receive their order.

---

### Checkout Quote Simulation

Before placing an order, the API can generate a **quote** for the selected cart items.

The system calculates:

- subtotal  
- tax  
- delivery fee  
- combo discounts  
- final total  

This simulates how checkout systems work in real food delivery applications.

---

### Guest Checkout

Orders can be created **without requiring authentication**, allowing users to place orders as guests. This mimics the quick checkout experience found in many modern delivery platforms.

---

### Order Snapshot System

When an order is created, the system saves a **snapshot of the product data** included in that order.

The snapshot stores information such as:

- product name  
- price  
- category  
- image  
- quantity  

This prevents future product updates from affecting past orders. For example, if a product price changes later, old orders will still show the original price.

---

### Admin Order Management

Administrators can manage incoming orders through protected routes.

Admins can:

- view all orders  
- inspect individual orders  
- update order status  

These routes are protected using middleware to ensure only authorized users can access them.

---

### Authentication and Security

The API includes user authentication using **JSON Web Tokens (JWT)**.

User passwords are securely stored using **bcrypt hashing**, which prevents raw passwords from being stored in the database.

Once authenticated, users receive a JWT token that allows them to access protected routes. Certain routes are restricted to administrators using role-based middleware.

This ensures that sensitive operations such as order management and product updates are only accessible to authorized users.

---

### Clean Architecture (MVC + Service Layer)

Instead of placing business logic directly inside routes, the project separates responsibilities across multiple layers.

- **Routes** define API endpoints  
- **Controllers** handle request and response logic  
- **Services** contain the core business logic  
- **Models** handle database queries  
- **Utils** provide reusable helper functions  

This structure makes the code easier to maintain and closer to real production backend architectures.

---

## Deployment

The Fast Fuel backend API is deployed on **Railway**, where the Node.js server and environment variables are managed for the production environment.

Railway was used to manage the server environment, environment variables, and database connection for the API.

This allows the backend to run in a production environment and be accessed by the Fast Fuel frontend application.

---

## Screenshots

![Screenshot](/images/railway2.png)
![Screenshot](/images/railway1.png)

---

## How to Run This Project

### 1. Clone the repository

```bash
# 1) Clone the repo
git clone https://github.com/fabioesilveira/Back-end-FAST-FUEL

# 2) Navigate to project folder
cd Back-end-FAST-FUEL

# 3) Install dependencies
npm install 
```

Create a .env file in the root of the project and add your database credentials.

#### Example:

- DB_HOST=localhost
- DB_PORT=3306
- DB_USER=root
- DB_PASSWORD=your_password
- DB_NAME=fast_fuel
- JWT_SECRET=your_secret_key

```bash
# 4) Start the development server

npm run dev
```

The API will start running locally.

#### Example:

```bash
http://localhost:3000
```

You can test the API using tools such as Postman, Insomnia, or Thunder Client.