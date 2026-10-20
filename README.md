# gk-design-frontend-test

React + Vite frontend configured to use `gk-design-backend-test` at `http://localhost:8081`.

```powershell
npm install
npm run dev
```

Open `http://localhost:5174`. API base URL is configured in `.env`. If you change it, restart the Vite server. The backend must allow this frontend origin in `application.yml` CORS settings.
