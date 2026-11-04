# Registration configuration

The backend is Spring Boot and MySQL; the frontend is Create React App. Do not commit real database credentials or a JWT signing key.

## Backend environment

Set these variables in the shell that starts Spring Boot:

- `DB_URL`: JDBC URL (defaults to local `devpulse_db` on port 3306).
- `DB_USERNAME` and `DB_PASSWORD`: a MySQL account permitted to create/use the database and tables.
- `JWT_SECRET`: a private random secret of at least 64 bytes for HS512 signing. Generate a fresh key; do not reuse the old value from the prior properties file.
- `APP_CORS_ALLOWED_ORIGIN`: frontend origin; defaults to `http://localhost:3000`.

On PowerShell, set each variable for the current terminal with `$env:NAME = 'value'`. Then start the backend from `backend` with `mvn spring-boot:run`.

## Frontend

During local development, the React dev server proxies same-origin `/api` requests to Spring Boot at `http://localhost:8080` (configured in `frontend/package.json`). Restart the frontend after changing the proxy. For production, set `REACT_APP_API_URL` to the publicly reachable backend URL ending in `/api` before building.

New registrations can select `ROLE_DEVELOPER` or `ROLE_MANAGER`; the backend validates this allowlist and never permits public registration as `ROLE_ADMIN`. Successful registration returns HTTP 201 and the frontend routes to `/login`. Admin access must be assigned through a trusted administrative process.

## Checks

From `backend`, run `mvn test`. From `frontend`, run `npm test -- --watchAll=false` and `npm run build`. A live end-to-end database check also requires MySQL to be running with the configured database account.
