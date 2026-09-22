# Express.js Authentication Template

A modular Express.js application template with authentication, PostgreSQL, Redis, and Docker support.

The project follows a modular architecture inspired by NestJS while keeping the flexibility of Express.js. It uses **tsyringe** for dependency injection, **Drizzle ORM** for database access, and Redis for user session management.

## Features

* Express.js web framework
* TypeScript
* Modular application architecture inspired by NestJS
* Dependency injection using **tsyringe**
* PostgreSQL database
* Drizzle ORM for database access
* Redis for user session storage
* Access and refresh token authentication
* HTTP-only cookies for secure tokens storage
* User registration and authentication
* Session management
* Health checks for application dependencies
* Docker and Docker Compose support
* pnpm as node package manager

## Tech Stack

* **TypeScript**
* **Express.js** — Web framework
* **PostgreSQL** — Primary database
* **Drizzle ORM** — Database ORM
* **Redis** — Session storage
* **tsyringe** — Dependency injection
* **Docker** — Containerization

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Configure environment variables

Rename the `.env.example` file to `.env` and configure the application, database, Redis, and authentication settings.

> Make sure to use secure and unique secrets in production.

### 3. Install dependencies

```bash
pnpm install
```

### 4. Start PostgreSQL and Redis (you can skip it if you run them by youself)

You can start the required services using Docker Compose:

```bash
docker compose up -d postgres redis
```

### 5. Run database migrations

Apply the database migrations:

```bash
pnpm db:migrate
```

### 6. Run the application

Development mode:

```bash
pnpm dev
```

Production mode:

```bash
pnpm build
pnpm start:prod
```

The application will be available at:

```text
http://localhost:4000
```

## Running with Docker

The project includes a `Dockerfile` and `docker-compose.yml` for running the complete application stack.
You should use container name to connect containers to each other.

The Docker Compose configuration starts:

* Express.js application
* PostgreSQL
* Redis

Start all services:

```bash
docker compose up -d
```

Build the application container:

```bash
docker compose up -d --build
```

Migrate database (you should run in backend container or use right DATABASE_URL to migrate database out from container)

```bash
pnpm db:migrate
```

Stop all services:

```bash
docker compose down
```

View container logs:

```bash
docker compose logs -f
```

## Authentication

The application uses access and refresh tokens for authentication.

Both tokens are stored in **HTTP-only cookies**, which prevents JavaScript running in the browser from directly accessing them.

### Access Token

The access token is used to authenticate API requests.

It typically has a shorter lifetime.

### Refresh Token

The refresh token is used to obtain a new access token when the current access token expires.

Refresh tokens are associated with user sessions stored in Redis.

### Authentication Flow

1. The user registers or logs in.
2. The application creates a user session.
3. Session information is stored in Redis.
4. Access and refresh tokens are generated.
5. Tokens are returned as HTTP-only cookies.
6. The client sends cookies automatically with authenticated requests.
7. When the access token expires, the refresh token can be used to obtain a new access token.
8. Logging out removes the session and clears authentication cookies.

## API Examples

### Authentication

#### Register

```text
POST /auth/register
```

Example request body:

```json
{
  "name": "Billy Herrington",
  "email": "billy@herrington.com",
  "password": "billyherrington",
  "confirmPassword": "billyherrington"
}
```

#### Login

```text
POST /auth/login
```

Example request body:

```json
{
  "email": "billy@herrington.com",
  "password": "billyherrington"
}
```

On successful authentication, the server sets access and refresh token cookies.

#### Refresh Access Token

```text
POST /auth/refresh
```

Uses the refresh token stored in the HTTP-only cookie to generate a new access token.

#### Logout

```text
POST /auth/logout
```

Removes the current user session and clears authentication cookies.

---

### Users

#### Get Current User

```text
GET /users/me
```

Example response:

```json
{
  "id": 1,
  "name": "Billy Herrington",
  "email": "billy@herrington.com",
  "createdAt": "2026-09-22T16:45:02.291Z"
}
```

This endpoint requires authentication.

#### Get User

```text
GET /users/:id
```

Returns information about a user.

---

### Sessions

#### Get Active Sessions

```text
GET /sessions
```

Returns the active sessions for the authenticated user.

#### Delete Session

```text
DELETE /sessions/:id
```

Removes a specific user session.

#### Logout From All Devices

```text
DELETE /sessions
```

Removes all active sessions for the authenticated user.

## Health Check

The application includes a health module for checking the availability of application dependencies.

Example endpoint:

```text
GET /health/ready
```

The health check verifies that the application can connect to services such as:

* PostgreSQL
* Redis

Example response:

```json
{
  "status": "ok",
  "services": {
    "database": "ok",
    "redis": "ok"
  }
}
```

If one of the required services is unavailable, the health endpoint can return an error status indicating which dependency failed.
