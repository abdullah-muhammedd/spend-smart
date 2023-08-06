# Spend Smart - Personal Budget Tracker

![Banner](https://github.com/abdullah-muhammedd/banners/blob/master/Blue%20Purple%20Gradient%20Grand%20Opening%20Medium%20Banner.gif?raw=true)

## Overview

Spend Smart is a web application designed to help users manage their personal finances effectively. It allows users to track their incomes, expenses, and budgets, enabling them to make informed financial decisions. The application follows the Model-View-Controller (MVC) architecture and utilizes MySQL as the database and Sequelize as the Object-Relational Mapping (ORM) tool for data management.

## Features

### User Authentication

- **Signup**: Users can create an account with a unique email and password. The system validates the user's information and ensures that the user is not already registered.
- **Email Verification**: After signup, users receive a verification email. They can verify their email by clicking the link in the email to activate their account.
- **Login**: Registered users can log in securely using their credentials. The application uses session and cookie-based authentication to keep users logged in.

  - Users with non-verified emails will be redirected to a page where they are asked to verify their emails to be able to use the app. This process ensures that all registered emails are real so that users can reset their password if they forget it.
  - A database script scans the user's data every 3 hours and cleans up unused tokens to ensure it stays clean. While not ideal for larger apps, it is sufficient for smaller ones.

- **Logout**: Logged-in users can log out from the system to end their session and invalidate the session cookie.

### Password Reset

- **Ask to Reset Password**: Users can request a password reset by providing their email address. Upon request, the system sends an email with a unique token that expires after a certain period.
- **Resetting Email Sent**: Users are redirected to a page confirming that the email with the reset link has been sent.
- **Reset Password**: Users can click the link in the email to access the password reset page.
- **Password Validation**: The system validates the token and ensures its expiration before allowing users to reset their password.
- **Post Reset Password**: Users can set a new password after verifying the token's validity. The new password is then updated in the database.

### Dashboard and Statistics

- **Home Page**: Upon logging in, users are directed to the dashboard displaying an overview of their financial data, such as total income, total expenses in the last seven days, and recent budgets, incomes, and expenses.
- **CSRF Token**: The application provides a route to fetch a CSRF token, which ensures secure form submissions.
  - CSRF tokens are injected with all forms but only on submit, ensuring users will never see or access these tokens.

### Budget Management

- **View Budgets**: Users can view a list of their budgets, showing details like the budget name, allocated amount, and current status.
- **Add Budgets**: Users can add new budgets with an allocated amount for specific purposes or timeframes.
- **Edit Budgets**: Users can modify existing budgets, updating the allocated amount or budget details. Only the user who created the budget can edit it.
- **Delete Budgets**: Users can delete unwanted budgets that are no longer needed. Only the user who created the budget can delete it.
- **Activate Budgets**: Users can activate/deactivate budgets based on their financial planning.
  - Users can't add any transactions [income or expense] to an inactivated budget.

### Categories

- **View Categories**: Users can view a list of categories that they have defined. Categories represent where users spend or receive their money, such as "Work" as income resource or "Entertainment" as an expense target.
- **Add Categories**: Users can add new categories to classify their expenses and incomes efficiently.
- **Edit Categories**: Users can edit existing categories, updating the category name or making other changes. Only the user who created the category can edit it.
- **Delete Categories**: Users can delete unwanted categories that are no longer relevant. Only the user who created the category can delete it.
- **Filter Categories**: Users can filter their categories by creation date.

### Expenses

- **View Expenses**: Users can view a list of their recorded expenses, showing details such as the date, category, amount, and description.
- **Add Expenses**: Users can add new expenses, specifying the date, category, amount, and description.
- **Edit Expenses**: Users can edit existing expenses, updating any of the expense details. Only the user who created the expense can edit it.
- **Delete Expenses**: Users can delete unwanted expenses from their records. Only the user who created the expense can delete it.
- **Filter Expenses**: Users can filter their expenses based on selected criteria, such as date or category or related budget.

### Incomes

- **View Incomes**: Users can view a list of their recorded incomes, displaying details like the date, source, amount, and description.
- **Add Incomes**: Users can add new income entries, specifying the date, source, amount, and description.
- **Edit Incomes**: Users can edit existing income entries, updating any of the income details. Only the user who created the income can edit it.
- **Delete Incomes**: Users can delete unwanted income entries from their records. Only the user who created the income can delete it.
- **Filter Incomes**: Users can filter their incomes based on selected criteria, such as date or source.

## Technologies Used

The application is built using the following technologies and frameworks:

- Node.js with Express.js for the server-side development
- MySQL for database management
- Sequelize as the ORM (Object-Relational Mapping) tool for interacting with the database
- Session and cookie-based authentication for user authentication and authorization
- EJS (Embedded JavaScript) for server-side templating
- HTML, CSS, and JavaScript for the front-end design and interactivity
- Emails sent using [Brevo](https://www.brevo.com/) Transactional Email API

## Installation

To install and run the application, follow these steps:

```bash
git clone [repository_url]
cd Project-Directory
npm install
```

## Usage

To use this application, you need to create a **".env"** file in the root directory of the project and add the required environment variables to it. The **".env"** file will store sensitive data such as database credentials, email configuration, and session secret.

Follow these steps to set up the **".env"** file:

1. Create a new file in the root directory of the project and name it **".env"**.

2. Open the **".env"** file using a text editor.

3. Add the following environment variables to the **".env"** file:

```bash
DB_HOST=your_database_host
DB_PORT=your_database_port
DB_USERNAME=your_database_username
DB_PASSWORD=your_database_password
DB_DATABASE=your_database_name

EMAIL_USERNAME=your_email_username
EMAIL_KEY=your_email_key_or_password

SESSION_SECRET=your_session_secret_key
```

Explanation:

- `DB_HOST`: Replace this with the hostname or IP address of your MySQL database server.
- `DB_PORT`: Replace this with the port number on which your MySQL database is running.
- `DB_USERNAME`: Replace this with the username for connecting to your MySQL database.
- `DB_PASSWORD`: Replace this with the password for the corresponding database user.
- `DB_DATABASE`: Replace this with the name of the MySQL database you want to use for the application.
- `EMAIL_USERNAME`: Replace this with the username or email address of the email account used for sending emails.
- `EMAIL_KEY`: Replace this with the API key, password, or access token required to authenticate with your email service provider.
- `SESSION_SECRET`: Replace this with a secure and random string used as a secret key to sign and encrypt session data.

After setting up the **".env"** file, run the following command to start the server in development mode:

```bash
npm run dev
```

**Note:** This command uses **nodemon** to start the server; make sure it is installed.

## Demo

<video width="640" height="360" controls>
  <source src="https://github.com/abdullah-muhammedd/banners/blob/master/Untitled%20video%20-%20Made%20with%20Clipchamp%20(1).mkv" type="video/mp4">
  Your browser does not support the video tag.
</video>


## Cloning And Feedback

- You are welcome to clone this repository and use it as a reference or as a starting point for your own projects.
- If you find any areas that could be improved or have suggestions for enhancements, feel free to share your opinions. I am open to receiving feedback and advice as I am always eager to learn and grow as a developer. Your input is valuable and will contribute to the continued improvement of this project and any future projects I undertake. Together, we can build better solutions and create a positive impact.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

## Contact

For any questions or feedback, you can reach me at [dev.abdullah.muhammed@gmail.com](mailto:dev.abdullah.muhammed@gmail.com).
