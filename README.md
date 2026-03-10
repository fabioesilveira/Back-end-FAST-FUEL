# Fast Fuel – Backend API

## Description

Fast Fuel is the backend API for a fast-food ordering application designed to simulate how a modern restaurant ordering system works. The goal of this project was to build a structured and scalable backend using **Node.js, Express, and MySQL**, while following a clean architecture pattern based on **MVC and a service layer**.

The API handles product management, order creation, order tracking, and administrative order processing. Customers can calculate their order totals, place an order, and confirm when their food has been received. On the restaurant side, administrators can view incoming orders and update their status as they move through preparation and delivery.

This project was also a great opportunity to practice separating responsibilities across controllers, services, and models instead of placing all logic directly in routes.

---

## Features

### Order System

Fast Fuel simulates a realistic order processing workflow. Customers can place orders by selecting products and the system automatically calculates the final price including tax, delivery fee, and combo discounts.

Orders move through a simple workflow that represents how a restaurant processes incoming orders.


- **received** – the order has been created by the customer  
- **in_progress** – the restaurant is preparing the order  
- **sent** – the order has been dispatched for delivery  
- **completed** – the customer confirmed the order was received  

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

### Role-Based Authorization

The API demonstrates simple role-based authorization.

Some routes are public, while others require authentication and admin privileges.

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

## Screenshots

You can include screenshots of the application here.

Example sections you might add:

### Menu / Products


### Creating an Order



### Admin Order Dashboard



### Order Status Tracking


---

## How to Run This Project

### 1. Clone the repository


