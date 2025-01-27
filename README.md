# Hospital Management System

This is a **Hospital Management System** application built with a **Node.js** backend and a **React** frontend. The system allows managing patients, doctors, and appointments while tracking recent activities and maintaining detailed records.

## Note For Testing
### Email - admin@gmail.com
### Password - 12345678
### Deployed Link - https://junaid77khan-hospital-management-system.vercel.app

---

## Table of Contents
- [Features](#features)
- [Images](#images)
- [Installation](#installation)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features
- **Patient Management**: Add, update, and delete patient records.
- **Doctor Management**: Assign and manage doctor profiles and specializations.
- **Appointment Scheduling**: Create, view, and manage patient appointments with doctors.
- **Track Activity**: Monitor recent activity and updates in the system.
- **Role-based Authentication**: Protect endpoints based on roles like `Admin`, `Doctor`, and `Receptionist`.

## Images

![image](https://github.com/user-attachments/assets/68ce178d-cb59-4399-abb3-288efdbe8319)

![image](https://github.com/user-attachments/assets/e6e69f69-e49f-4a74-bce6-dd2fcf5ffc5f)

![image](https://github.com/user-attachments/assets/9c726175-c686-40b1-8752-789ec1975194)

## Installation

Clone the repository:
   ```bash
   git clone https://github.com/junaid77khan/junaid77khan-Hospital-Management-System.git
   ```

### Backend Setup
To set up the backend (API server), follow these steps:

1. Go to Backend Directory:
   ```bash
   cd hospital-backend
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a .env file in the root of the project and add the following:
   ```bash
   PORT=5000
   MONGO_URI=<your-mongodb-uri>
   JWT_SECRET=<your-secret-key>
   ```

4. Start the backend server:

   You can start the server using:
    ```bash
    npm run server
    ```

### Frontend Setup
To set up the frontend, follow these steps:

1. Go to Frontend Directory:
   ```bash
   cd hospital-frontend
   ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up environment variables:

   Create a .env file in the root of the project and add the following:
   ```bash
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the frontend server:

   You can start using:
   ```bash
   npm start
   ```

This will run the frontend on http://localhost:3000.

## Usage
Once both the frontend and backend servers are up and running, navigate to http://localhost:3000 to access the Hospital Management System.

### API Endpoints:
- GET /patients: Get all patients.
- GET /doctors: Get all doctors.
- POST /login: User login (JWT authentication).
- POST /register: Register a new user (Admin only).
- POST /appointments: Schedule a new appointment.

### Technologies Used
#### Backend:
- Node.js with Express
- MongoDB with Mongoose
- JWT for Authentication
- bcryptjs for password hashing
- dotenv for environment variable management

#### Frontend:
- React.js
- Axios for API requests
- Tailwind CSS for custom styling
- React Router for navigation

## License
This project is licensed under the ISC License.

### Explanation:
- **Project Description**: The initial description explains what your project does (Hospital Management System).
- **Table of Contents**: Helps users quickly navigate to relevant sections.
- **Features**: Highlights the core functionalities of your Hospital Management System.
- **Installation**: Provides step-by-step instructions to set up the backend and frontend.
- **Usage**: Explains how to run the application and access it in the browser.
- **Technologies Used**: Lists the key technologies used in both the backend and frontend.
- **License**: Standard licensing information (adjust if you use a different license).

