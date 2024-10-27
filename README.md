# remotejobs4palestine

A monorepo project that aggregates remote job opportunities using [SerpAPI](https://serpapi.com) and provides a user-friendly interface to browse them.

## Features

- 🔍 Job search powered by Google through SerpAPI
- 🔐 Optional JWT authentication for users
- 👑 Admin panel for job moderation
- ⚡ Modern tech stack
- 📱 Responsive design

## Tech Stack

### Backend
- Node.js + Express
- TypeScript
- Mongoose
- JWT Authentication

### Frontend
- Vite + React
- TypeScript
- Redux
- Ant Design

## Prerequisites

- Node.js
- Yarn
- MongoDB
- [SerpAPI](https://serpapi.com) API key

## Environment Variables

### Backend
```bash
SERPAPI_API_KEY=your_serpapi_key
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
JOBS_NORMAL_USER_PASSWORD=user_password
JOBS_ADMIN_PASSWORD=admin_password
```

### Frontend
```bash
VITE_API_URL=your_api_url
```

## Installation

```bash
# Clone the repository
git clone https://github.com/jobs4palestine/jobs4palestine.git

# Install dependencies
cd remotejobs4palestine
yarn install
```

## Development

```bash
# Start both frontend and backend in development mode
yarn dev
```

> **Note:** When modifying shared types, run `yarn build` in the types package to update changes. Hot reload is not supported for shared types.

## Contributing

Feel free to open issues and submit pull requests. All contributions are welcome!

## License

This project is licensed under the [GNU General Public License v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html) (GPL-3.0).

