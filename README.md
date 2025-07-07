# 7 Days to Die Dashboard

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)

This project provides a real-time dashboard for 7 Days to Die dedicated servers, allowing server administrators and players to monitor server status, game settings, connected players, and raw log output. It offers a comprehensive overview of your server's activity in an intuitive and responsive web interface.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
  - [Backend](#backend)
  - [Frontend](#frontend)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-time Server Status:** Displays whether the server is online or offline.
- **Server Information:** Shows server name, public IP, map name, max players, Telnet port, and Web Dashboard port.
- **Game Settings:** Provides an overview of key game settings like XP multiplier, loot abundance, day/night length, and AI block damage.
- **Player List:** Lists connected players with their online/offline status.
- **Raw Log Viewer:** Displays the latest server log entries.
- **Responsive Design:** Built with React and Bootstrap for a modern and responsive user interface.

## Technologies Used

### Backend

- **Node.js:** JavaScript runtime environment.
- **Express.js:** Web application framework for Node.js.
- **Socket.IO:** Real-time bidirectional event-based communication.
- **Chokidar:** File system watcher for monitoring log file changes.
- **`dotenv`:** Loads environment variables from a `.env` file.

### Frontend

- **React:** JavaScript library for building user interfaces.
- **Bootstrap:** CSS framework for responsive and mobile-first front-end web development.
- **React Icons:** Popular icon library for React applications.
- **Socket.IO Client:** Client-side library for Socket.IO.

## Project Structure

```
7d2d-dashboard/
├── backend/                 # Node.js Express backend
│   ├── config.js            # Backend configuration
│   ├── server.js            # Main backend application file
│   ├── routes/              # API routes
│   │   └── api.js           # Server info API endpoint
│   ├── services/            # Backend services for log handling
│   │   ├── logFinder.js     # Finds the latest log file
│   │   ├── logParser.js     # Parses log file content
│   │   └── logWatcher.js    # Watches for log file changes
│   └── socket/              # Socket.IO setup
│       └── socketHandler.js # Handles Socket.IO connections
├── frontend/                # React frontend application
│   ├── public/              # Public assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable React components (e.g., cards)
│   │   ├── hooks/           # Custom React hooks
│   │   └── services/        # Frontend services (e.g., Socket.IO client)
│   └── .env                 # Frontend environment variables
└── README.md                # This file
```

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (Node Package Manager)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/7d2d-dashboard.git
    cd 7d2d-dashboard
    ```

2.  **Backend Setup:**

    Navigate to the `backend` directory and install dependencies:

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory with the following content:

    ```
    SERVER_PORT=3001
    CORS_ORIGIN=http://localhost:3000
    LOGS_DIR=C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die Dedicated Server\7DaysToDieServer_Data\output_log
    ```

    *Note: Adjust `LOGS_DIR` to the actual path of your 7 Days to Die dedicated server output logs.* If you are on Linux, the path might look like `/home/steam/.local/share/7DaysToDie/Saves/DedicatedServer/output_log`.

3.  **Frontend Setup:**

    Navigate to the `frontend` directory and install dependencies:

    ```bash
    cd ../frontend
    npm install
    ```

    Create a `.env` file in the `frontend` directory with the following content:

    ```
    REACT_APP_SOCKET_URL=http://localhost:3001
    ```

## Running the Application

1.  **Start the Backend Server:**

    From the `backend` directory:

    ```bash
    npm start
    # Or for development with hot-reloading:
    # npm run dev
    ```

2.  **Start the Frontend Development Server:**

    From the `frontend` directory:

    ```bash
    npm start
    ```

    The frontend application will open in your browser at `http://localhost:3000`.

## Usage

Ensure your 7 Days to Die dedicated server is running and generating log files in the configured `LOGS_DIR`. The dashboard will automatically update as new log entries are written.

## Contributing

Feel free to fork the repository, open issues, and submit pull requests.

## License

This project is licensed under the ISC License. See the `LICENSE` file for details. (Note: A `LICENSE` file is not included in the provided directory structure, you may want to add one.)