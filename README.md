# Blog App API
 
## Overview
This is a simple CRUD based API for blog-app(A blogging application made with Next.js, Editor.js and Material UI). The API is built with [Node.js](https://nodejs.org/en/), [Express.js](https://expressjs.com/), [MongoDB](https://www.mongodb.com/), and [Cloudinary](https://cloudinary.com/) for asset hosting.

The API allows users to signup through Email verification using nodemailer and sendgrid, login through JWT token based authentication, perform CRUD operations in a MongoDB database to create, edit, view and delete blogs, and upload profile image using multer and cloudinary. The API is accessed using a web app built with Next.js, Editor.js and Material UI.<br>
### [Web APP repo link](https://github.com/shucoll/blog-app--webapp)<br><br>

## Installation and Usage

Clone the repo

```sh
git clone https://github.com/shucoll/blog-app--api
```

Install the dependencies

```sh
npm install
```

Setup a .env file in root and add

```sh
NODE_ENV=development
PORT=5000
DATABASE=mongodb://localhost:27017/blogapp
DATABASE_PASSWORD=database-password

JWT_SECRET=some-secret-kay
JWT_EXPIRES_IN=1d
JWT_COOKIE_EXPIRES_IN=30

EMAIL_USERNAME=email-username-for-nodemailer
EMAIL_PASSWORD=email-password-for-nodemailer
EMAIL_HOST=email-host-for-nodemailer
EMAIL_PORT=email-port-for-nodemailer

EMAIL_FROM=host-email-to-send-email-from

SENDGRID_USERNAME=sendgrid-username
SENDGRID_PASSWORD=sendgrid-password

CLOUDINARY_NAME=cloudinary-username
CLOUDINARY_API_KEY=cloudinary-api-key
CLOUDINARY_API_SECRET=cloudinary-api-secret

CLIENT_URL=http://localhost:3000
```

Run the app in the development mode.
Send requests http://localhost:5000 to access the API

```sh
npm start
```