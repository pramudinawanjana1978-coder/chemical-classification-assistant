# Chemical Classification Assistant – Frontend

React + Vite frontend for the existing Flask backend.

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173 (the Flask backend must be running at http://127.0.0.1:5000).

## Backend URL

Set in `src/services/api.js` (fallback `http://127.0.0.1:5000`) or override with a `.env` file:

```
VITE_API_BASE_URL=https://your-deployed-backend
```

## Notes

- Flask-CORS must allow `http://localhost:5173` (default `CORS(app)` does).
- All results and classifications come from `/api/search`; React does no matching or classification.
- The Database page only shows values returned by `/api/status`.
- Background image: `src/assets/chemistry-background.png`.
