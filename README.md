# E-Commerce-Backend

Welcome to the e-commerce backend repository made with Node.js, MongoDB, JSON Web Token, Bcrypt.js for password hashing, Stripe for secure payment processing, Express, Express-validator for input validation, and Gravatar for globally unique avatars.

To get started, make sure you have the latest version of Node.js and MongoDB installed on your system. Then, clone this repository and run the following command to install the required dependencies:

```
npm install
```

You will also need to create a `.env` file in the root directory of the project with the following environment variables:

```
MONGO_URI=<your_mongo_uri>
JWT_SECRET=<your_jwt_secret>
STRIPE_SECRET_KEY=<your_stripe_secret_key>
```

Replace `<your_mongo_uri>` with the connection string for your MongoDB database, `<your_jwt_secret>` with a secret key for JWT, and `<your_stripe_secret_key>` with your Stripe secret key.

Once you have set up the environment variables, you can start the development server by running the following command:

```
npm run server
```

This will start the development server and connect to your MongoDB database. The API will be available on `http://localhost:5000`.

The project structure is organized in the following way:

- `config` directory contains configuration files for MongoDB and Stripe.
- `middleware` directory contains middleware functions for authentication and input validation.
- `models` directory contains Mongoose models for the MongoDB collections.
- `routes` directory contains the route handlers for the API endpoints.
- `utils` directory contains utility functions for password hashing and avatar generation.
The API provides the following endpoints:

- `/api/auth` for user authentication and registration
- `/api/profile` for updating and retrieving user profile information
- `/api/products` for creating, updating, and retrieving product information
- `/api/orders` for creating and retrieving order information
- `/api/payments` for processing payments using Stripe

The API uses JSON Web Token for authentication and `bcrypt.js` for password hashing. `express-validator` is used for input validation. `gravatar` is used for generating globally unique avatars for user profiles. Stripe is used for secure payment processing.

Thank you for using our e-commerce backend repository. If you have any questions or issues, please feel free to open an issue or pull request.
