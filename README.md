# Hirebot AI App

The Candidate Assessment System is a web application designed to help recruiters evaluate candidates' skills and knowledge through online tests. The application is built with Next.js, React, and uses Mock Service Worker (MSW) to simulate APIs during development.

## System Requirements

- Node.js (version 16.x or higher)
- npm (version 8.x or higher)

## Installation

1. Clone the repository from GitHub:
   ```bash
   git clone <repository-url>
   cd hirebot-ai-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize Mock Service Worker:
   ```bash
   npx msw init public
   ```

4. Run the application in development mode:
   ```bash
   npm run dev
   ```

5. Access the application at: http://localhost:3000

## Project Structure

```
hirebot-ai-app/
├── public/                  # Static resources
│   └── mockServiceWorker.js # Service Worker for MSW
├── src/
│   ├── components/          # React components
│   ├── mock/                # API mocking with MSW
│   │   ├── data/            # Sample data
│   │   ├── browser.ts       # MSW browser configuration
│   │   └── handlers.ts      # API endpoint definitions
│   ├── pages/               # Application pages (Pages Router)
│   │   ├── admin/           # Admin pages
│   │   ├── quiz/            # Quiz pages
│   │   └── index.tsx        # Home page
│   ├── app/                 # App directory (App Router)
│   ├── styles/              # CSS and styles
│   └── utils/               # Utility functions
├── package.json
└── next.config.ts
```

## Key Features

### 1. For Candidates

- **Home Page**: Candidates enter personal information and session code to start the test.
- **Quiz Page**: Displays multiple-choice questions and allows candidates to answer within the time limit.
- **Results Page**: Shows scores and evaluation after completing the test.

### 2. For Administrators

- **Login**: Administrators log in to the system.
- **Candidate Management**: View list, details, and results of candidates.
- **Question Management**: Add, edit, delete multiple-choice questions.
- **Test Session Creation**: Create new test sessions with parameters such as language, level, number of questions, and time limit.

## User Guide

### For Candidates

1. Access the home page at http://localhost:3000
2. Enter your name, email, and session code (provided by the recruiter)
3. Click "Start Test" to enter the quiz page
4. Answer the questions within the time limit
5. Click "Submit" when finished
6. View your results and evaluation

### For Administrators

1. Access the login page at http://localhost:3000/admin/login
2. Log in with the following credentials:
   - Username: admin
   - Password: password
3. After logging in, you can:
   - View the list of candidates and their results
   - Manage multiple-choice questions
   - Create new test sessions and share session codes with candidates

## API Endpoints (Mock)

The application uses Mock Service Worker to simulate the following API endpoints:

### Authentication
- `POST /api/login`: Administrator login

### Candidates
- `GET /api/candidates`: Get list of candidates (supports filtering and pagination)
- `GET /api/candidates/:id`: Get candidate details
- `GET /api/candidates/:id/results`: Get candidate test results

### Questions
- `GET /api/questions`: Get list of questions (supports filtering and pagination)
- `POST /api/questions`: Create new question
- `PUT /api/questions/:id`: Update question
- `DELETE /api/questions/:id`: Delete question

### Test Sessions
- `POST /api/sessions`: Create new test session
- `GET /api/sessions/:token`: Get session information by token
- `GET /api/sessions/:token/questions`: Get list of questions for a session
- `POST /api/sessions/:token/submit`: Submit test

## Deployment Environments

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Production
```bash
npm run start
```

### Using Docker
This project can be deployed using Docker and Docker Compose:

1. Build and run containers:
```bash
docker-compose up -d
```

2. Stop containers:
```bash
docker-compose down
```

3. Rebuild containers after changes:
```bash
docker-compose up -d --build
```

The application will run at http://localhost:3000

## Technologies Used

- **Next.js**: React framework for web application development
- **React**: JavaScript library for building user interfaces
- **TypeScript**: JavaScript extension with static typing
- **Tailwind CSS**: Utility-first CSS framework
- **Mock Service Worker (MSW)**: API mocking library for development and testing

## Notes

- This is a development version using sample data and mock APIs.
- In a production environment, you should replace MSW with actual APIs.
- Security features such as JWT authentication, password encryption, and CSRF protection should be fully implemented before actual use.

## Support

If you encounter issues or have questions, please create an issue on the GitHub repository or contact the development team.
