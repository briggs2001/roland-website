# Briggs Roland Portfolio

A responsive single-page portfolio with project filtering, mobile navigation, and a working contact form backed by a dependency-free Node.js server.

## Requirements

- Node.js 20 or newer
- No npm packages are required

## Run locally

From this folder:

```sh
npm start
```

Open [http://localhost:3000](http://localhost:3000). Set `PORT` to use another port. For automatic restarts during development, use `npm run dev`.

## Contact backend

The server serves the site and accepts `POST /api/contact` with JSON in this shape:

```json
{
  "name": "Alex Example",
  "email": "alex@example.com",
  "message": "I would like to talk about a project."
}
```

The backend code is in `backend/server.js`. It validates the fields, limits the request body to 16 KB, applies a basic per-IP rate limit, and stores accepted messages in `backend/data/messages.json`. That data file is ignored by Git. The backend does not send email; review the stored messages or connect an email provider before deploying if inbox delivery is needed.

## Before publishing

Update the example email address and social links in `index.html`, replace the sample project descriptions with real work, and update the name and page description if needed. For production, use HTTPS and persistent storage, and configure rate limiting at the hosting layer if running multiple server instances.
