# Marketplace Platform

A comprehensive multi-sided marketplace platform connecting users with service providers, featuring real-time communication, project matching, and complete admin management.

## Features

### User Features (A)
- ✅ Authentication (Email/Password, Google OAuth)
- ✅ User Profile Management
- ✅ Project Registration with Image Upload
- ✅ Proposal Management
- ✅ Real-time Chat (Socket.io)
- ⏳ Contract Management
- ⏳ Payment Integration
- ⏳ Review System
- ⏳ Notification Center

### Business Features (B)
- ✅ Business Profile
- ✅ Project Browser with Filters
- ⏳ Proposal Submission
- ✅ Real-time Chat
- ⏳ Contract Management
- ⏳ Settlement System

### Admin Features (C)
- ⏳ User/Business Management
- ⏳ Project Moderation
- ⏳ Analytics Dashboard
- ⏳ Content Management

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Socket.io
- **File Upload**: Local storage (upgradeable to S3/Cloudinary)

## Prerequisites

- Node.js 18+ 
- PostgreSQL database
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

Due to PowerShell execution policy restrictions, you may need to run npm commands in an administrator PowerShell or use Command Prompt:

```bash
# Option 1: Use Command Prompt (cmd)
npm install

# Option 2: Or temporarily allow scripts in PowerShell (Admin)
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Required variables:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/marketplace"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

Optional (for full functionality):
```env
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### 3. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# (Optional) Seed database
npx prisma db seed
```

### 4. Run Development Server

The project uses a custom server with Socket.io:

```bash
# Start the development server with Socket.io
node server.js

# Or use npm script
npm run socket
```

The application will be available at `http://localhost:3000`

## Project Structure

```
appdemo/
├── app/
│   ├── (auth)/
│   │   ├── login/          # Login page
│   │   └── register/       # Registration page
│   ├── dashboard/          # User dashboard
│   │   ├── projects/       # Project management
│   │   └── contracts/      # Contract management
│   ├── business/           # Business dashboard
│   │   ├── projects/       # Browse projects
│   │   └── proposals/      # Manage proposals
│   ├── admin/              # Admin dashboard
│   ├── chat/               # Real-time chat
│   ├── api/                # API routes
│   │   ├── auth/           # Authentication endpoints
│   │   ├── projects/       # Project CRUD
│   │   └── upload/         # File upload
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Landing page
├── components/             # Reusable components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   └── prisma.ts          # Prisma client
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── uploads/           # Uploaded files
├── server.js              # Custom Next.js + Socket.io server
└── package.json

```

## Key Features Implementation

### Authentication
- Email/password with bcrypt hashing
- Google OAuth integration
- Session management with NextAuth.js
- Role-based access control (USER, BUSINESS, ADMIN)

### Project Management
- Multi-step project creation form
- Image upload with preview
- Category and location selection
- Budget range specification

### Real-time Chat
- Socket.io for instant messaging
- Room-based conversations
- Typing indicators
- Message history

### File Upload
- Local file storage
- Image optimization
- Multiple file support
- Secure file handling

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth handlers

### Projects
- `GET /api/projects` - List projects
- `POST /api/projects` - Create project
- `GET /api/projects/[id]` - Get project details

### File Upload
- `POST /api/upload` - Upload files

## Database Schema

Key models:
- **User**: User accounts with role-based access
- **UserProfile**: User personal information
- **BusinessProfile**: Business information and verification
- **Project**: Service requests from users
- **Proposal**: Business proposals for projects
- **Contract**: Confirmed agreements
- **Message**: Chat messages
- **Review**: Ratings and feedback

See `prisma/schema.prisma` for complete schema.

## Development Notes

### PowerShell Issues
If you encounter PowerShell execution policy errors:

1. Use Command Prompt (cmd) instead
2. Or run PowerShell as Administrator and execute:
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Database Migrations
When modifying the Prisma schema:
```bash
npx prisma migrate dev --name your_migration_name
npx prisma generate
```

### Socket.io Development
The custom server (`server.js`) is required for Socket.io functionality. Always use `node server.js` instead of `next dev`.

## Next Steps

1. **Complete Core Features**:
   - Proposal submission and management
   - Contract workflow
   - Review system
   - Notification system

2. **Add Advanced Features**:
   - Email verification
   - SMS authentication
   - Payment integration (Stripe)
   - PDF contract generation
   - Map integration for location

3. **Admin Dashboard**:
   - User management
   - Project moderation
   - Analytics and reporting
   - Content management

4. **Testing & Deployment**:
   - Unit tests
   - Integration tests
   - Production deployment
   - CI/CD pipeline

## Contributing

This is a demonstration project. For production use, consider:
- Adding comprehensive error handling
- Implementing rate limiting
- Adding input validation
- Setting up monitoring
- Configuring CDN for file uploads
- Adding automated tests

## License

MIT