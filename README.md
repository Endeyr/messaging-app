# React Messaging App

A real-time web messaging application built with React, allowing users to send messages, customize profiles, and securely authenticate. This project was developed as part of the Odin Project course.

## Features

- User Authentication: Secure login and registration system to protect user accounts and data.
- Real-time Messaging: Instantly send and receive messages with other users.
- Profile Customization: Update personal information and upload profile pictures to personalize your account.
- Responsive Design: Fully responsive interface that works seamlessly on desktop and mobile devices.

## Technologies Used

- Frontend: React, Vite, Material UI
- Backend: Express.js
- Testing: Vitest, Jest

## Prerequisites

- Node.js (v20.10.0 or later)
- npm (v10.8.1 or later)

## Setup

1. Clone the repository:

```node.js
git clone https://github.com/Endeyr/messaging-app.git
```

2. Install dependencies, need to install in both the client and server directory:

```
cd messaging-app/client
npm install

cd ../server
npm install
```

3. Set up environment variables:

- Create a .env file in the server directory
- Add necessary variables (e.g., DATABASE_URL, JWT_SECRET)

4. Run the development server, need to run both the client and server directory:

```
npm run dev
```

4. Open your browser and navigate to http://localhost:5173 to view the app.

## Usage

1. Register or log in to access the messaging platform.
2. Customize your profile by updating your information and uploading a profile picture.
3. Start sending messages to other users.

## Testing

To run tests, must be ran in either the server or client directory:

```
npm run test
```

## Demo

Check out the live [Demo](https://messaging-app-frontend-one.vercel.app/)

## License

This project is licensed under the MIT License.

## Acknowledgements

- The Odin Project
- React Documentation
- Material UI
