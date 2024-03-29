# Guru Guide

Web App aimed at university students aiding in planning their next course/faculty of choice, getting answers about their queries, engaging in discussion forums.

<img src="https://raw.githubusercontent.com/ayonshafiul/faculty_review/fcreview/demo/demo.png" width="400" height="200" alt="Screenshot of the running project">

## Built Using

- NodeJS
- Express
- MySQL
- React JS
- React Query
- axios
- Redis
- Google Authentication

# Folder Structure

- backend - contains the entire backend nodejs server built with express js and uses mysql database

  - controllers
  - middlewares
  - routes
  - server.js - main entry file (run with node server.js)
  - sql_tables.txt - sql commands to initialize database with all the required tables with all the necessary indexes
  - dbPool.js - database pooling connection handler

- frontend - contains frontend website built with React JS, React Query for caching, axios for fetching requests
  - assets - imgs assets folder
  - components
    - App
    - Navbar
    - ....
    - Home
    - Logout
  - contexts - sitewide context provider for current authenticated user
  - Queries.js - contains all the frontend calls with rest api endpoints
  - useAxios - custom hooks for axios
  - useLocalStorage - custom hook for accessing local storage

## .env file config

```
NODE_ENV=
PORT=
DB_HOST=
DB=
DB_USER=
DB_PASS=
JWT_SECRET=
CLIENT_ID=
JWT_EXPIRES_IN=
JWT_COOKIE_EXPIRES=
REDIS_HOST=
REDIS_PORT=
```
