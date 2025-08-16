1. Project Overview

Project Name: ProductManagement

Purpose:
The ProductManagement system helps you efficiently track and manage various products stored in a warehouse. It provides a simple interface to maintain product information and monitor stock levels.

Key Features:

Keep track of products in the warehouse.

Perform basic CRUD (Create, Read, Update, Delete) operations on products.

Option to mark products as publicly visible or private.

2. Objectives

Provide a user-friendly system to manage product inventory.

Allow users to securely store their credentials.

Enable real-time tracking and updates of product quantities.

Support visibility control for products (public/private).

3. Functional Requirements

User Authentication: Users can register and log in using secure credentials.

Product Management (CRUD):

Create: Add new products with quantity, type, and visibility.

Read: View products owned by the user.

Update: Modify product details such as quantity or type.

Delete: Remove products from the system.

Public Visibility: Users can choose to display products publicly.

4. Database Architecture

The system uses a relational database with two primary tables:

4.1 Users Table

Stores user authentication details.

Column Name	Type	Description
username	VARCHAR	Unique username for login
password	VARCHAR	Hashed password for security