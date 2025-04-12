# News Bulletin

A modern news website built with React, Express, and PostgreSQL.

## Features

- Responsive design
- Category-based article browsing
- Pagination
- Real-time article updates
- Clean and modern UI

## Tech Stack

- Frontend: React, TypeScript, TailwindCSS
- Backend: Express.js, Node.js
- Database: PostgreSQL
- ORM: Drizzle ORM

## Local Development Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your database credentials:
   ```
   DATABASE_URL=your_database_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

This project is configured for deployment on Render. To deploy:

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Add your environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NODE_ENV`: Set to "production"
4. Deploy!

## Environment Variables

- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment (development/production)

## License

MIT 