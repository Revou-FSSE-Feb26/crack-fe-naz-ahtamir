# HAAMI — Hazard Analysis & Awareness Management Integrated

HAAMI is a web-based Occupational Health and Safety (OHS) management platform designed to help organizations manage SMK3 compliance, hazard identification, findings reporting, and safety performance monitoring in an integrated manner. Built with modern web technologies, HAAMI provides an end-to-end solution to meet **SMK3 (Occupational Health and Safety Management System)** requirements based on PP No. 50 of 2012.

---

## 🔗 Links

| | URL |
|---|---|
| **Frontend (Production)** | https://crack-fe-naz-ahtamir.vercel.app |
| **Backend API** | https://haami-demo.onrender.com |
| **API Docs** | https://haami-demo.onrender.com/api/docs |

---

## ✨ Key Features

### SMK3 Management
- **12 SMK3 Elements**: Complete implementation of 12 SMK3 elements according to PP 50/2012 regulations, covering commitment, OHS planning, document control, work safety, training, monitoring, and reporting.
- **Findings CRUD**: Recording, management, and tracking of non-conformity findings with approval workflow (OPEN → INPG → CLSD).
- **SMK3 Dashboard**: Summary of SMK3 element compliance status on a single page.

### Safety Compliance
- **OHS Policy**: Upload and management of OHS policy documents.
- **Legal Compliance**: Monitoring of OHS regulations and legislative compliance.
- **OHS Planning & Organization**: Management of OHS plans and organizational structure.
- **Worker Consultation**: Documentation of worker consultations.
- **Procurement & Contractor Control**: Control of procurement and contractors.
- **Documentation Records**: Management of OHS records and documentation.

### Safety Competency
- **Safety Induction**: Management of safety induction programs for new employees.
- **Training Management**: Planning and implementation of OHS training.
- **Training Needs Analysis**: Training needs analysis based on risk.
- **License & Certification**: Monitoring of employee OHS certifications and licenses.
- **Safety Briefing & Culture**: Safety culture programs and safety briefings.
- **Competency Management**: OHS competency management per position.

### Accident Prevention
- **Hazard Identification**: Hazard identification with risk level categorization (Low / Medium / High / Critical).
- **Risk Control**: Risk control based on hierarchy of controls.
- **Incident & Near Miss Reporting**: Reporting of accidents and near misses.
- **Safety Inspection**: Schedule and implementation of safety inspections.
- **Work Permit System**: Digital work permit system for high-risk work.
- **PPE Management**: Personal Protective Equipment management.
- **LOTO (Lockout/Tagout)**: LOTO procedures for hazardous energy work.
- **Chemical Safety**: Management of hazardous chemicals.
- **Equipment Safety**: Equipment safety monitoring.
- **Emergency Preparedness**: Emergency planning and preparedness.
- **Workplace Monitoring**: Workplace environment monitoring.
- **Safety Observation**: Safety observation programs.

### System Features
- **Authentication & RBAC**: Login, forgot/reset/change password, and role-based access control (Admin, Supervisor, User).
- **Real-time Notifications**: Automatic notification polling every 30 seconds for approvals and finding updates.
- **Data Export**: Export findings to **Excel (.xlsx)** and **PDF** formats with digital signatures.
- **Admin Panel**: User management (activation, deactivation, assign supervisor).
- **Profile & Settings**: User profile management.
- **Digital Signature**: Digital signature input on finding forms.

---

## 🛠 Tech Stack

### Frontend
| Technology | Version | Usage |
|-----------|-------|----------|
| Next.js | 16.2.6 | React framework with App Router & SSR |
| React | 19.2.4 | UI library |
| TypeScript | ^5 | Type-safe development |
| Tailwind CSS | ^4 | Utility-first CSS framework |
| NextAuth.js | ^4.24.14 | Authentication & session management |
| React Hook Form | ^7.82.0 | Form state & validation |
| Zod | ^4.4.3 | Schema validation |
| react-hot-toast | ^2.6.0 | Toast notifications |
| jsPDF | ^4.2.1 | Generate PDF reports |
| xlsx | ^0.18.5 | Export data to Excel |
| html2canvas | ^1.4.1 | Render page to canvas (PDF export) |
| react-signature-canvas | ^1.1.0-alpha.2 | Digital signature input |
| Bun | latest | JavaScript runtime & package manager |

### Backend & Database
| Technology | Usage |
|-----------|----------|
| Next.js API Routes | Integrated backend API (authentication, users, notifications, SMK3 data) |
| MongoDB + Mongoose | Main database via API routes |
| bcryptjs | Password hashing |
| NextAuth JWT | Token-based authentication |

> **Note**: Architecture uses **Next.js fullstack** — API routes in `src/app/api/` handle backend logic, so no separate server is needed for basic deployment.

### DevOps & Tools
| Technology | Usage |
|-----------|----------|
| Vercel | Frontend deployment (recommended) |
| Docker Compose | Container orchestration for local development |
| GitHub Actions | CI/CD pipeline |
| pgAdmin 4 | Database management UI |

---

## 📁 Project Structure

```
crack-fe-naz-ahtamir/
├── apps/
│   └── backend/                    # Backend API (NestJS - optional, separate)
├── public/
│   ├── uploads/                    # Local file uploads (documents, PDF)
│   ├── videos/                     # Video assets
│   └── fonts/                      # Custom fonts
├── scripts/                        # Utility scripts (seed data, import employees)
│   ├── createAdmin.ts
│   ├── importKaryawan.ts
│   ├── generate-safety-competency.js
│   └── ...
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── page.tsx                # Public landing page
│   │   ├── login/                  # Login page
│   │   ├── forgot-password/        # Forgot password
│   │   ├── reset-password/         # Reset password
│   │   ├── change-password/        # Change password
│   │   ├── contact/                # Contact page
│   │   ├── (authenticated)/        # Route group (requires authentication)
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── findings/           # Findings management
│   │   │   ├── notifications/      # Notification center
│   │   │   ├── profile/            # User profile
│   │   │   └── settings/           # Account settings
│   │   ├── smk3/                   # 12 SMK3 Elements
│   │   │   ├── komitmen/
│   │   │   ├── rencana-k3/
│   │   │   ├── dokumen/
│   │   │   ├── pembelian/
│   │   │   ├── keamanan-kerja/
│   │   │   ├── pelatihan/
│   │   │   ├── pemantauan/
│   │   │   ├── pelaporan/
│   │   │   ├── material/
│   │   │   ├── pemeriksaan/
│   │   │   ├── perancangan-kontrak/
│   │   │   └── data/
│   │   ├── safety-compliance/      # OHS compliance module
│   │   ├── safety-competency/      # OHS competency module
│   │   ├── accident-prevention/    # Accident prevention module
│   │   ├── admin/                  # Admin panel
│   │   ├── dashboard-smk3/         # SMK3-specific dashboard
│   │   └── api/                    # Next.js API Routes (backend)
│   │       ├── auth/               # Authentication (NextAuth, forgot/reset password)
│   │       ├── users/              # User management
│   │       ├── notifications/      # Notification system
│   │       ├── smk3-data/          # SMK3 finding data
│   │       ├── kebijakan/          # OHS policies
│   │       └── konsultasi/         # OHS consultations
│   ├── components/                 # Reusable React components
│   │   ├── ui/                     # Button, Input, Modal, Badge, etc.
│   │   ├── layout/                 # Sidebar, Header, NotificationDropdown
│   │   ├── dashboard/              # StatCard, RecentFindings
│   │   ├── findings/               # FindingForm
│   │   ├── CrudPage.tsx            # Generic CRUD component
│   │   ├── SMK3DataList.tsx        # SMK3 data list
│   │   └── RecordTable.tsx         # Generic data table
│   ├── contexts/                   # React Context
│   │   ├── AuthContext.tsx         # Global authentication state
│   │   └── NotificationContext.tsx # Global notification state
│   ├── hooks/                      # Custom React hooks
│   │   └── useNotificationPolling.ts
│   ├── lib/                        # Utility & API clients
│   │   ├── api.ts                  # Main API client
│   │   ├── auth.ts                 # Auth utilities
│   │   ├── exportFindingToPDF.ts   # PDF export
│   │   └── exportFindingsToExcel.ts # Excel export
│   ├── data/                       # Static data (form configs, job descriptions)
│   ├── models/                     # Mongoose models
│   └── types/                      # TypeScript type definitions
├── .env.local                      # Environment variables
├── .env.local.example              # Example environment configuration
├── next.config.ts                  # Next.js configuration
├── package.json                    # Dependencies & scripts
└── tsconfig.json                   # TypeScript configuration
```

---

## 🚀 Installation & Usage

### Prerequisites

- **Node.js** 18.17 or newer
- **Bun** (recommended) or npm/yarn
- **MongoDB** (local or MongoDB Atlas)

### Installation Steps

**1. Clone repository**
```bash
git clone <repo-url>
cd crack-fe-naz-ahtamir
```

**2. Install dependencies**
```bash
bun install
# or
npm install
```

**3. Configure environment**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` according to your configuration:
```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/<dbname>

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>

# Backend API (if using separate NestJS)
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_FRONTEND_URL=http://localhost:3000
```

**4. Create first admin account**
```bash
bun run create-admin
```

**5. Run development server**
```bash
bun run dev
```

The application will run at **http://localhost:3000**

---

### Available Scripts

| Script | Command | Description |
|--------|----------|------------|
| Development | `bun run dev` | Run dev server with hot reload |
| Build | `bun run build` | Build for production |
| Start | `bun run start` | Run production server |
| Lint | `bun run lint` | Run ESLint |
| Create Admin | `bun run create-admin` | Create first admin account |
| Import Employees | `bun run import-karyawan` | Import employee data from CSV |

---

### Default Accounts (after setup)

| Role | Email | Access |
|------|-------|-------|
| Admin | Created via `bun run create-admin` | Full — user management, all modules |
| Supervisor | Created by admin | Finding approvals, view all data |
| User | Created by admin | Create & view own findings |

---

## 📊 ERD (Entity Relationship Diagram)

![ERD](public/screenshots/ERD.png)

### Relationship Explanation

| Relation | Description |
|--------|------------|
| `USERS` → `SMK3_DATA` (creates) | One user can create many findings |
| `USERS` → `SMK3_DATA` (approves) | One supervisor/admin can approve many findings |
| `USERS` → `NOTIFICATIONS` | One user receives many notifications |
| `SMK3_DATA` → `NOTIFICATIONS` | One finding can trigger many notifications (to creator & supervisors) |
| `USERS` → `AUDIT_LOGS` | Every user action is recorded in audit logs |
| `SMK3_DATA` → `AUDIT_LOGS` | Every finding change is tracked in audit logs |

### Finding Status Flow

```
OPEN  ──► INPG (In Progress)  ──► CLSD (Closed)
  │                                     ▲
  └─────────────────────────────────────┘
         (direct approval to CLSD)
```

---

## 📸 Screenshots

### Landing Page
![Landing Page](public/screenshots/landing-page.png)
> HAAMI public page with product information, features, and login CTA.

### Main Dashboard
![Dashboard](public/screenshots/dashboard.png)
> Dashboard showing finding statistics (OPEN/INPG/CLSD), trend charts, and recent findings.

### Findings Management
![Findings List](public/screenshots/findings-list.png)
> List of all findings with status filters, categories, and export to Excel/PDF features.

### Create New Finding Form
![Create Finding](public/screenshots/create-finding.png)
> Form for recording new findings with photo upload, digital signature input, and validation.

### SMK3 Module
![SMK3 Modules](public/screenshots/smk3-modules.png)
> 12 SMK3 elements that can be managed, each with sub-elements and data forms.

### Admin Panel
![Admin Panel](public/screenshots/admin-panel.png)
> Administration panel for user management — activation, deactivation, and assign supervisor.

### Notifications
![Notifications](public/screenshots/notifications.png)
> Notification center for finding approvals, status updates, and system messages.

---

## 🔒 Security Features

- **JWT Authentication** via NextAuth.js — token-based session management
- **Role-Based Access Control (RBAC)** — Admin, Supervisor, User with different access rights
- **Password Hashing** — bcryptjs with salt rounds
- **Forgot/Reset Password** — Password reset flow via token
- **Protected Routes** — Next.js middleware blocks access without authentication
- **Input Validation** — Zod schema validation on every form and API endpoint
- **Audit Logging** — Every data change recorded with user and timestamp
- **Soft Delete** — Finding data not permanently deleted (deletedAt)

---

## 🚢 Deployment

### Frontend — Vercel (Recommended)

1. Push code to GitHub repository
2. Connect repository to [Vercel]
3. Add environment variables in Vercel dashboard:
   - `MONGODB_URI`
   - `NEXTAUTH_URL` (production URL)
   - `NEXTAUTH_SECRET`
   - `NEXT_PUBLIC_API_URL`
4. Automatic deployment on every push to `main` branch

### Separate Backend (Optional)

If using separate NestJS backend:

| Platform | Notes |
|----------|---------|
| Railway | Recommended — easy PostgreSQL & Redis setup |
| Render | Free tier available |
| AWS Elastic Beanstalk | For enterprise scale |
| Docker | `docker-compose up` for local development |

---

## 🤝 Contribution

1. Fork this repository
2. Create new branch: `git checkout -b feature/feature-name`
3. Commit changes: `git commit -m 'feat: add feature X'`
4. Push branch: `git push origin feature/feature-name`
5. Create Pull Request

### Commit Conventions
- `feat:` — New feature
- `fix:` — Bug fix
- `docs:` — Documentation changes
- `style:` — Formatting (no logic changes)
- `refactor:` — Code refactoring
- `chore:` — Maintenance (update deps, config, etc.)

---

## 📄 License

This project is proprietary and confidential. Unauthorized distribution or reproduction is prohibited.
