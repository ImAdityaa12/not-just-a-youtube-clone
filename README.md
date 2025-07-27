# YouTube Clone - Modern Video Streaming Platform

A feature-rich YouTube clone built with modern web technologies, offering video streaming, user authentication, subscriptions, comments, and more.

## 🚀 Features

### Core Features

-   **Video Upload & Streaming**: Upload and stream videos with Mux integration
-   **User Authentication**: Secure authentication with Clerk
-   **Video Management**: Full CRUD operations for videos
-   **Categories**: Organize videos by categories
-   **Search**: Advanced search functionality
-   **Subscriptions**: Subscribe to channels and creators
-   **Comments System**: Nested comments with reactions
-   **Video Reactions**: Like/dislike videos
-   **Playlists**: Create and manage video playlists
-   **Studio Dashboard**: Creator dashboard for content management
-   **Responsive Design**: Mobile-first responsive UI

### Technical Features

-   **Real-time Updates**: Live data synchronization
-   **Infinite Scrolling**: Smooth content loading
-   **Video Processing**: Automatic video processing with Mux
-   **AI Integration**: Google Gemini AI integration
-   **Rate Limiting**: API rate limiting with Redis
-   **Database**: PostgreSQL with Drizzle ORM
-   **Type Safety**: Full TypeScript implementation

## 🛠️ Tech Stack

### Frontend

-   **Framework**: Next.js 15 (App Router)
-   **Styling**: Tailwind CSS
-   **UI Components**: Radix UI + shadcn/ui
-   **State Management**: TanStack Query (React Query)
-   **Forms**: React Hook Form + Zod validation

### Backend

-   **API**: tRPC for type-safe APIs
-   **Database**: PostgreSQL with Neon
-   **ORM**: Drizzle ORM
-   **Authentication**: Clerk
-   **File Upload**: UploadThing
-   **Video Processing**: Mux

### Infrastructure

-   **Deployment**: Vercel
-   **Database**: Neon PostgreSQL
-   **CDN**: Mux for video delivery
-   **Caching**: Redis (Upstash)
-   **AI**: Google Gemini

## 📁 Project Structure

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## 🚀 Getting Started

### Prerequisites

-   Node.js 18+
-   PostgreSQL database
-   Clerk account
-   Mux account
-   UploadThing account

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd not-just-a-youtube-clone
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your-clerk-publishable-key"
CLERK_SECRET_KEY="your-clerk-secret-key"

# Mux Video Processing
MUX_TOKEN_ID="your-mux-token-id"
MUX_TOKEN_SECRET="your-mux-token-secret"

# UploadThing
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Google Gemini AI
GEMINI_API_KEY="your-gemini-api-key"

# Redis (Optional)
REDIS_URL="your-redis-url"

# App Configuration
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

4. **Database Setup**

```bash
# Generate database migrations
npx drizzle-kit generate

# Run migrations
npx drizzle-kit migrate

# Seed categories (optional)
npm run seed:categories
```

5. **Start Development Server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## 📊 Database Schema

The application uses a PostgreSQL database with the following main entities:

-   **Users**: User profiles with Clerk integration
-   **Videos**: Video metadata and Mux integration
-   **Categories**: Video categorization
-   **Comments**: Nested comment system
-   **Subscriptions**: User-to-creator relationships
-   **Playlists**: User-created video collections
-   **Reactions**: Like/dislike system for videos and comments
-   **Video Views**: View tracking and analytics

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:studio    # Open Drizzle Studio

# Linting & Formatting
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues
```

## 🏗️ Architecture

### Module-Based Architecture

The application follows a modular architecture where each feature is organized into modules containing:

-   **Server**: tRPC procedures and database operations
-   **UI**: React components and views
-   **Types**: TypeScript type definitions

### Authentication Flow

1. Users sign up/in through Clerk
2. User data is synced to the database
3. Protected routes require authentication
4. Studio access is restricted to authenticated users

### Video Upload Flow

1. User uploads video through UploadThing
2. Video is processed by Mux
3. Metadata is stored in database
4. Thumbnails and previews are generated
5. Video becomes available for streaming

## 🔐 Security Features

-   **Authentication**: Clerk-based secure authentication
-   **Authorization**: Route-level protection
-   **Rate Limiting**: API rate limiting with Redis
-   **Input Validation**: Zod schema validation
-   **CSRF Protection**: Built-in Next.js protection
-   **Content Security Policy**: Configured for media sources

## 🚀 Deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on push to main branch

### Environment Variables for Production

Ensure all environment variables are configured in your deployment platform:

-   Database connection string
-   Clerk keys
-   Mux credentials
-   UploadThing configuration
-   Gemini API key
-   Redis URL (if using)

## Learn More

To learn more about the technologies used in this project:

-   [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
-   [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
-   [tRPC Documentation](https://trpc.io/docs) - learn about type-safe APIs.
-   [Drizzle ORM](https://orm.drizzle.team/) - learn about the database ORM.
-   [Clerk Documentation](https://clerk.com/docs) - learn about authentication.
-   [Mux Documentation](https://docs.mux.com/) - learn about video infrastructure.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

-   [Next.js](https://nextjs.org/) - React framework
-   [Clerk](https://clerk.com/) - Authentication
-   [Mux](https://mux.com/) - Video infrastructure
-   [Drizzle ORM](https://orm.drizzle.team/) - Database ORM
-   [tRPC](https://trpc.io/) - Type-safe APIs
-   [Tailwind CSS](https://tailwindcss.com/) - Styling
-   [shadcn/ui](https://ui.shadcn.com/) - UI components

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## 📞 Support

For support, please open an issue in the GitHub repository or contact the development team.

---

**Built with ❤️ using modern web technologies**
