# Hospital Management System

This is a **Hospital Management System** application built with a **PHP** backend and a **React** frontend. The system allows managing patients, doctors, and appointments while maintaining detailed records. It can handle online as well as offline appointments.

## Hospital Website Link
Visit our live hospital management system to book appointments with doctors, view available services, and more:
https://santhospital.com

---

## Table of Contents
- [Features](#features)
- [Images](#images)
- [Installation](#installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [License](#license)

## Features
- **Patient Management**: Add, update, and delete patient records.
- **Doctor Management**: Assign and manage doctor profiles and specializations.
- **Appointment Scheduling**: Create, view, and manage patient appointments with doctors.

## Images

![image](https://github.com/user-attachments/assets/e27b57ab-3c76-4b73-957d-a4ef66c16db3)

![image](https://github.com/user-attachments/assets/df354797-6c02-456a-ae63-c935a182bfba)

![image](https://github.com/user-attachments/assets/da4ef61b-f2ac-4f99-b494-6d1bb64124e9)

![image](https://github.com/user-attachments/assets/7ef28783-2be8-482a-90dc-c2a9c8949a3e)

![image](https://github.com/user-attachments/assets/18987405-7e0d-436a-a2d3-67f41bc78c7e)

![image](https://github.com/user-attachments/assets/8b8d88a1-8f5c-4818-a6e7-82bf0c5eec54)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/junaid77khan/Hostpital-Management-System.git
   ```
2. Navigate to rbac-frontend folder:
   ```bash
    cd rbac-frontend
    ```
3. Install dependencies:
    ```bash
    npm install
    ```

4. Set up environment variables:

   Create a .env file in the root of the project and add the following:
   ```bash
   REACT_APP_API_URL=(API for handling patients, appointments and all other things)
   REACT_APP_HOSPITAL_NAME=YOUR_HOSPITAL_NAME
   ```

5. Start the Frontend:

   You can start the server using:
    ```bash
    npm run start
    ```

This will run the frontend on http://localhost:3000.

## Usage
Once the frontend are up and running, navigate to http://localhost:3000 to access the Hospital Management System.

### Technologies Used
#### Backend:
- PHP with SQL Server

#### Frontend:
- React.js
- Fetch for API requests
- Tailwind CSS for custom styling
- React Router for navigation

## License
This project is licensed under the ISC License.

