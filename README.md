# DevPulse

DevPulse is a developer productivity dashboard with a React frontend, Spring Boot API, and MySQL persistence.

## Features

- User registration and JWT-based login
- Developer and Manager roles, with Admin access reserved for trusted assignment
- Repository, commit, issue, pull request, productivity, and report views

## Local setup

See [REGISTRATION_SETUP.md](REGISTRATION_SETUP.md) for the PowerShell environment configuration. Start MySQL, run the backend from `backend` with `mvn spring-boot:run`, then run the frontend from `frontend` with `npm start`.

## Checks

- Backend: `mvn test` (from `backend`)
- Frontend tests: `npm test -- --watchAll=false` (from `frontend`)
- Frontend production build: `npm run build` (from `frontend`)

Do not commit database credentials or JWT signing keys. Use environment variables as described in the setup guide.
