
### Chef Module README.md

# 👨‍🍳 Restaurant System - Chef Module

### System Overview

Each module is interconnected, providing a seamless experience for customers, managers, and chefs:

1. **Customer Module**: Customers can browse the menu and place orders. They receive real-time updates on their order status.
2. **Manager Module**: Managers can view all orders, manage the menu, and update order statuses, notifying both customers and chefs.
3. **Chef Module**: Chefs can view and update the status of orders, notifying both managers and customers.
4. **Backend API**: Manages the database operations and real-time communication across all modules.

Together, these modules create an efficient and interactive restaurant management system.
__________________________________________________________________________________________________________________

## Overview

Welcome to the **Restaurant System Chef Module**! This module allows chefs to view and manage orders in real-time, marking them as prepared or served. It is built using **React**, **TailwindCSS**, **Socket.io**, and **Node.js** for efficient real-time updates.

**Live Demo:** [Chef Module](https://restaurant-system-chef-module.netlify.app/)

## Features

- **Order View**: View all incoming orders in real-time.
- **Update Order Status**: Mark orders as prepared or served.
- **Real-time Updates**: Receive and send real-time updates on order statuses.

## How It Works

1. **Order Reception**: Orders placed by customers are received in real-time.
2. **Order Management**: The chef can mark orders as prepared or served, notifying both the manager and the customer.
3. **Real-time Notifications**: Updates on order statuses are sent and received via **Socket.io** to ensure smooth communication.


## Technologies Used
**React**

**TailwindCSS**

**Socket.io**

**Node.js**

**Mongodb**

## Links to Other Modules
**Manager Module**: [GitHub](https://github.com/shahtirthhh/restaurant-system-manager), [Live Demo](https://retaurant-system-manager-module.netlify.app/)

**Customer Module**: [GitHub](https://github.com/shahtirthhh/restaurant-system-customer), [Live Demo](https://restaurant-system-customer-module.netlify.app/)

**Backend API**: [GitHub](https://github.com/shahtirthhh/restaurant-system-backend)

## Contributors
**Tirth Shah**
      
[**Devanshee Ramanuj**](https://github.com/ramanujdevanshee22)

## Installation

To run this module locally:

1. Clone the repository:
   ```bash
   git clone https://github.com/shahtirthhh/restaurant-system-chef.git
