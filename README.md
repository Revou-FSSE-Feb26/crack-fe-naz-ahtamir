# Haami - Hazard Analysis & Awareness Management Integrated

Haami is a comprehensive Occupational Health and Safety (OHS) management platform designed to streamline safety compliance, hazard analysis, and risk management for organizations. Built with modern web technologies, Haami provides a robust solution for managing SMK3 (Sistem Manajemen Keselamatan dan Kesehatan Kerja) requirements and improving workplace safety culture.

## Key Features

### Core Safety Management
- **Hazard Identification & Analysis**: Systematic approach to identifying, assessing, and controlling workplace hazards
- **Risk Assessment Tools**: Quantitative and qualitative risk evaluation with customizable risk matrices
- **Incident Reporting & Management**: Complete incident tracking from reporting to investigation and resolution
- **Safety Compliance Monitoring**: Automated tracking of regulatory requirements and compliance deadlines

### SMK3 Implementation
- **Policy Development**: Tools for creating and managing safety policies and procedures
- **Document Control**: Centralized repository for safety documents, permits, and certifications
- **Safety Competency Management**: Tracking employee safety training, certifications, and competencies
- **Audit & Inspection Management**: Schedule and conduct safety audits with automated follow-up actions

### Operational Safety
- **Work Permit System**: Digital work permits for high-risk activities with approval workflows
- **Emergency Preparedness**: Emergency response planning, drills, and equipment tracking
- **Accident Prevention Programs**: Proactive safety initiatives and prevention measures
- **Safety Performance Metrics**: Real-time dashboards and analytics for safety KPIs

## Technology Stack

### Frontend
- **Next.js 14**: React framework with App Router and Server Components
- **TypeScript**: Type-safe development experience
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **React Hook Form**: Form validation and management
- **Zod**: Schema validation library
- **TanStack Query**: Data fetching and state management
- **Framer Motion**: Animation library for smooth UI interactions

### Backend
- **Node.js**: JavaScript runtime environment
- **Express.js**: Web application framework
- **Prisma ORM**: Database toolkit and ORM
- **PostgreSQL**: Primary relational database
- **Redis**: Caching and session management
- **JWT Authentication**: Secure authentication system

### Infrastructure & DevOps
- **Docker**: Containerization for consistent deployments
- **Vercel**: Deployment platform for frontend applications
- **GitHub Actions**: CI/CD pipeline automation
- **PostgreSQL**: Cloud database hosting
- **Cloudinary**: Media storage and optimization

## Project Structure

```
crack-fe-naz-ahtamir/
├── apps/
│   └── backend/           # Backend API services
├── public/                # Static assets
├── scripts/              # Utility and data generation scripts
├── src/
│   ├── app/              # Next.js App Router pages and layouts
│   ├── components/       # Reusable React components
│   ├── lib/              # Utility functions and configurations
│   ├── hooks/            # Custom React hooks
│   └── types/            # TypeScript type definitions
├── .env.local            # Environment variables (development)
├── .env.local.example    # Example environment configuration
├── package.json          # Dependencies and scripts
├── next.config.ts        # Next.js configuration
└── README.md             # Project documentation
```

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- Bun or npm/yarn package manager
- PostgreSQL database
- Redis instance (for caching and sessions)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-organization/haami.git
   cd haami
   ```

2. **Install dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   # Run database migrations
   bun run db:push
   # or
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

The application will be available at `http://localhost:3000`.

### Database Setup

1. Create a PostgreSQL database
2. Update the `DATABASE_URL` in your `.env.local` file
3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```
4. Seed the database with initial data (optional):
   ```bash
   bun run db:seed
   ```

## Development

### Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build the application for production
- `bun run start` - Start the production server
- `bun run lint` - Run ESLint for code quality
- `bun run type-check` - Run TypeScript compiler check
- `bun run db:push` - Push database schema changes
- `bun run db:seed` - Seed the database with sample data

### Code Quality

- **ESLint**: Code linting with custom configurations
- **Prettier**: Code formatting for consistent style
- **TypeScript**: Static type checking
- **Husky**: Git hooks for pre-commit checks

## Deployment

### Frontend Deployment (Vercel)

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Backend Deployment

The backend can be deployed to various platforms:
- **Railway**: Easy PostgreSQL and Redis integration
- **Render**: Full-stack deployment platform
- **AWS Elastic Beanstalk**: Scalable AWS deployment
- **Docker containers**: Containerized deployment to any platform

## API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user information

### Safety Management Endpoints
- `GET /api/hazards` - List all hazards
- `POST /api/hazards` - Create new hazard
- `GET /api/incidents` - List all incidents
- `POST /api/incidents` - Report new incident
- `GET /api/risk-assessments` - List risk assessments
- `POST /api/risk-assessments` - Create risk assessment

### Document Management Endpoints
- `GET /api/documents` - List safety documents
- `POST /api/documents` - Upload new document
- `GET /api/compliance` - Compliance status check
- `POST /api/audits` - Schedule safety audit

## Security Features

- **JWT-based Authentication**: Secure token-based authentication
- **Role-Based Access Control**: Fine-grained permissions for different user roles
- **Input Validation**: Server-side validation of all user inputs
- **SQL Injection Prevention**: ORM usage with parameterized queries
- **XSS Protection**: Automatic escaping of user-generated content
- **Rate Limiting**: Protection against brute-force attacks
- **HTTPS Enforcement**: All traffic forced to secure connections

## Performance Optimization

- **Image Optimization**: Automatic image resizing and format conversion
- **Code Splitting**: Dynamic imports for faster page loads
- **Server-Side Rendering**: Improved SEO and initial load performance
- **Client-Side Caching**: TanStack Query for efficient data fetching
- **CDN Integration**: Static assets served through CDN
- **Database Indexing**: Optimized queries with proper indexes

## Contributing

We welcome contributions to Haami. Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new functionality
- Update documentation as needed
- Ensure all tests pass before submitting PR

## License

This project is proprietary software. All rights reserved.

## Support

For technical support or questions:
- Create an issue in the GitHub repository
- Contact the development team at support@haami-safety.com
- Check the documentation at [docs.haami-safety.com](https://docs.haami-safety.com)

## Acknowledgments

- The development team for their dedication to workplace safety
- Safety professionals who provided valuable feedback during development
- Open-source communities for the amazing tools and libraries
- Organizations committed to improving occupational health and safety

---

**Haami - Making workplaces safer, one hazard at a time.**

*Last updated: September 18, 2026*