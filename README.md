# 7 Days to Die - Real-Time Dashboard

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Socket.IO](https://img.shields.io/badge/Socket.IO-010101?style=for-the-badge&logo=socket.io&logoColor=white)
![Discord](https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white)

This project provides a real-time dashboard for "7 Days to Die" dedicated servers. It allows administrators to monitor server status, game settings, and player activity through a responsive web interface and receive instant notifications on Discord.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Real-Time Monitoring:** Displays live server status, player counts, and game settings.
- **Detailed Player List:** Shows players with three distinct statuses: `Online` (in-game), `Connected` (in the lobby), and `Offline`.
- **Discord Notifications:** Sends instant alerts to a Discord channel when a player's status changes (connects, joins, or disconnects).
- **Raw Log Viewer:** Provides a real-time stream of the server's raw log output.
- **Responsive Design:** A modern and intuitive interface built with React and Bootstrap.

## Technologies Used

#### Backend
- **Node.js & Express.js:** For the web server and API.
- **Socket.IO:** For real-time communication with the frontend.
- **Chokidar:** To watch for log file changes instantly.
- **Axios:** To send notifications to the Discord webhook.

#### Frontend
- **React:** For building the user interface.
- **Bootstrap & React Icons:** For styling and icons.
- **Socket.IO Client:** To receive real-time updates from the backend.

## Project Structure

```
7d2d-dashboard/
├── backend/
│   ├── services/
│   │   ├── logFinder.js         # Finds the latest log file
│   │   ├── logParser.js         # Parses log content
│   │   ├── logWatcher.js        # Watches for log changes and detects player status changes
│   │   └── discordNotifier.js   # Sends notifications to Discord
│   ├── .env.example           # Environment variable template
│   └── server.js              # Main backend application file
├── frontend/
│   ├── src/
│   │   ├── components/          # React components (PlayerListCard, etc.)
│   │   └── services/            # Frontend services (socketService)
│   └── .env                   # Frontend environment variables
└── README.md
```

## Getting Started

#### Prerequisites
- Node.js (LTS version)
- npm (Node Package Manager)

#### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/7d2d-dashboard.git
    cd 7d2d-dashboard
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

## Configuration

Before running the application, you need to configure the environment variables for both the backend and the frontend.

#### Backend Configuration

1.  In the `backend` directory, copy `.env.example` to a new file named `.env`.
2.  Open the `.env` file and fill in the variables:

    ```env
    # The port for the backend server
    SERVER_PORT=3001

    # The URL of your frontend application for CORS
    CORS_ORIGIN=http://localhost:3000

    # --- IMPORTANT --- #
    # Full path to the directory where your server logs are stored.
    # Example for Windows: C:\7d2d_server\7DaysToDieServer_Data\output_log
    # Example for Linux: /home/user/7d2d_server/7DaysToDieServer_Data/output_log
    LOGS_DIR=

    # --- OPTIONAL --- #
    # Your Discord channel's webhook URL for player status notifications.
    DISCORD_WEBHOOK_URL=
    ```

    **To get a Discord Webhook URL:**
    - In Discord, go to `Server Settings` > `Integrations` > `Webhooks`.
    - Click `New Webhook`, give it a name, select the channel, and copy the Webhook URL.

#### Frontend Configuration

1.  In the `frontend` directory, create a `.env` file.
2.  Add the following line, pointing to your backend server's URL:
    ```env
    REACT_APP_SOCKET_URL=http://localhost:3001
    ```

## Running the Application

1.  **Start the Backend:**
    ```bash
    # From the /backend directory
    npm start
    ```

2.  **Start the Frontend:**
    ```bash
    # From the /frontend directory
    npm start
    ```

The dashboard will be available at `http://localhost:3000`.

## Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

## License

This project is licensed under the ISC License.
