<!-- <p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p> -->

# E-commerce NestJS API

A robust E-commerce RESTful API built with the [NestJS](https://github.com/nestjs/nest) framework. This project provides comprehensive features for user authentication, user management, and category management.

## Prerequisites

Before running this project, ensure you have the following installed:

*   **Node.js**: (v16 or higher recommended)
*   **MongoDB**: Ensure a local MongoDB instance is running on port `27017`. The application connects to `mongodb://localhost:27017/eCommerce`.

## Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd e-commerce
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

## Environment Configuration

Create a `.env` file in the root directory and configure the following variables:

```env
PORT=3000
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_email_app_password
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

> **Note:** The MongoDB connection string is currently hardcoded to `mongodb://localhost:27017/eCommerce` in `src/app.module.ts`.

## Running the Application

### Development
```bash
npm run start
```

### Watch Mode (Recommended for Development)
```bash
npm run start:dev
```

### Production Mode
```bash
npm run start:prod
```

## API Endpoints

The base URL for all endpoints is `http://localhost:<PORT>/api`.

### Authentication (`/v1/auth`)

| Method | Endpoint | Description | Body / Params |
| :--- | :--- | :--- | :--- |
| `POST` | `/sign-up` | Register a new user | `SingUpDto` (email, password, etc.) |
| `POST` | `/sign-in` | Log in a user | `SingInDto` (email, password) |
| `POST` | `/reset-password` | Request password reset | `ResetPasswordDto` (email) |
| `POST` | `/verify-code` | Verify reset code | `VerifyDto` (email, code) |
| `POST` | `/change-password` | Change password | `ChangePasswordDto` (email, password) |

### User Management (`/v1/user`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a user | Public |
| `GET` | `/` | Get all users | **Admin** |
| `GET` | `/:id` | Get user by ID | Public |
| `PATCH` | `/:id` | Update user by ID | Public |
| `DELETE` | `/:id` | Delete user by ID | Public |

### User Profile (`/v1/userMe`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get current user profile | **Admin**, **User** |
| `PATCH` | `/` | Update current user profile | **Admin**, **User** |
| `DELETE` | `/` | Delete current user account | **User** |

### Category Management (`/v1/category`)

| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/` | Create a category | **Admin** |
| `GET` | `/` | Get all categories | **Admin** |
| `GET` | `/:id` | Get category by ID | **Admin** |
| `PATCH` | `/:id` | Update category | **Admin** |
| `DELETE` | `/:id` | Delete category | **Admin** |

## Scripts

*   `npm run build`: Build the application.
*   `npm run format`: Format code using Prettier.
*   `npm run lint`: Lint code using ESLint.
*   `npm run test`: Run unit tests.
*   `npm run test:e2e`: Run end-to-end tests.
*   `npm run test:cov`: Run test coverage.

## License

This project is [UNLICENSED](LICENSE).
