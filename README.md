# JER.CO - Jersey Store (Frontend Demo)

This repository contains the frontend UI demo for JER.CO, an online football jersey store. The project is developed using **React**, **TypeScript (TSX)**, and styled with **Tailwind CSS**. It leverages **Vite** for a fast and efficient development experience.

## Key Features

* **User & Admin Authentication:** Separate login systems for customers and administrators.
* **Product Navigation & Search:** Search functionality with real-time suggestions.
* **Product Catalog:** Comprehensive product listing with filtering and sorting options.
* **Product Details:** Detailed pages for individual jerseys, including images and descriptions.
* **Shopping Cart:** Full cart management (add, update quantity, remove items).
* **Checkout Process:** Streamlined order placement and confirmation flow.
* **User Profile:** Page for users to view their order history.
* **Admin Panel:** Dashboard for product (CRUD), order, and sales report management.
* **Responsive Design:** Optimized viewing across various devices.

## Technologies Used

* **React:** JavaScript library for building user interfaces.
* **React Router:** For client-side routing and navigation.
* **TypeScript:** Adds static typing for enhanced code quality and scalability.
* **Tailwind CSS:** A utility-first CSS framework for rapid and responsive styling.
* **Lucide Icons:** A consistent and beautiful icon library.
* **Vite:** A fast build tool and development server for modern web projects.

## Getting Started

To run this project locally, you will need **Node.js** and **npm** (Node Package Manager) installed on your machine.

### Prerequisites

* **Node.js & npm:** Download and install the latest LTS version from [nodejs.org](https://nodejs.org/).
    Verify installation by running:
    ```bash
    node -v
    npm -v
    ```

### Local Development Setup

1.  **Clone the Repository:**
    ```bash
    git clone [https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git](https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git)
    cd YOUR_REPO_NAME
    ```
    *(Replace `YOUR_USERNAME/YOUR_REPO_NAME` with your actual GitHub repository path.)*

2.  **Install Dependencies:**
    Navigate into the cloned project directory and install all required packages:
    ```bash
    npm install
    ```

3.  **Start the Development Server:**
    Once dependencies are installed, start the application:
    ```bash
    npm run dev
    ```
    The application will launch in development mode, typically opening automatically in your web browser at `http://localhost:5173`.

## Available Scripts

* `npm run dev`: Starts the development server with Vite.
* `npm run build`: Compiles the application for production into the `dist/` directory.
* `npm run preview`: Serves the production build locally for preview.
