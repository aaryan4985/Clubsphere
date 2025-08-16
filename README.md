# ClubSphere - Event & Club Management MVP

A minimal Event & Club Management system with Google Calendar integration and AI-generated event invites.

## Features

- **Club Management**: Create and manage clubs with member lists
- **Event Creation**: Club leaders can create events with automatic Google Calendar scheduling
- **Google Calendar Integration**: Auto-sync events and send calendar invites
- **AI-Generated Invites**: Personalized event invitations using Gemini API
- **Dashboard Views**:
  - Upcoming events
  - Club member lists
  - Calendar sync status
- **Clean UI**: Built with Tailwind CSS for modern design

## Tech Stack

### Frontend

- React 18
- Tailwind CSS
- Axios for API calls
- React Router for navigation

### Backend

- Node.js with Express
- SQLite database
- Google Calendar API integration
- Google Gemini AI API
- JWT authentication

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Cloud Platform account for Calendar API
- Google AI Studio account for Gemini API

### Installation

1. Clone and install dependencies:

```bash
npm run install-all
```

2. Set up environment variables:

   - Copy `.env.example` to `.env` in the backend directory
   - Add your Google Calendar API credentials
   - Add your Gemini API key

3. Initialize the database:

```bash
cd backend
npm run init-db
```

4. Start the development servers:

```bash
npm run dev
```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Project Structure

```
clubsphere/
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── utils/
├── backend/           # Node.js Express backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── middleware/
│   └── database/
└── docs/             # Documentation
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Clubs

- `GET /api/clubs` - Get all clubs
- `POST /api/clubs` - Create new club
- `GET /api/clubs/:id` - Get club details
- `PUT /api/clubs/:id` - Update club
- `DELETE /api/clubs/:id` - Delete club

### Events

- `GET /api/events` - Get all events
- `POST /api/events` - Create new event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event

### Members

- `GET /api/clubs/:id/members` - Get club members
- `POST /api/clubs/:id/members` - Add member to club
- `DELETE /api/clubs/:id/members/:memberId` - Remove member

## Development

### Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Building for Production

```bash
npm run build
```

## Environment Variables

### Backend (.env)

```
PORT=5000
JWT_SECRET=your_jwt_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=your_redirect_uri
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=./database/clubsphere.db
```

## License

MIT License - see LICENSE file for details.
