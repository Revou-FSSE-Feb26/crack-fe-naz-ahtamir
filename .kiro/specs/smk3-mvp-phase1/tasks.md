# Implementation Plan: SMK3 MVP Phase 1

## Overview

This implementation plan breaks down the SMK3 MVP Phase 1 feature into achievable tasks for a single developer over 1 month. The focus is on building a working proof-of-concept that demonstrates end-to-end functionality from authentication through CRUD operations, approval workflows, notifications, and reporting.

**Tech Stack**: Next.js 16 + TypeScript + Tailwind CSS v4 (Frontend), NestJS + PostgreSQL (Backend), React Native + Expo (Mobile)

**Implementation Language**: TypeScript for all components

**Key Principles**:
- Prioritize visible, demonstrable features
- Leverage existing code patterns and JSONB flexible schema
- Build incrementally with checkpoints
- Focus on manual testing over comprehensive test suites

## Tasks

- [x] 1. Setup Backend Infrastructure and Database
  - Initialize NestJS project with TypeScript and configure Bun runtime
  - Set up PostgreSQL database using Docker Compose with pgAdmin
  - Create TypeORM entities for 4 tables: users, smk3_data, audit_logs, notifications
  - Create and run database migrations for all tables with proper indexes
  - Create seed script with 3 users (admin, supervisor, user) and 5-10 sample findings
  - Configure environment variables for database connection and JWT secrets
  - Set up CORS to allow requests from localhost:3000
  - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 1.10, 12.1, 12.2, 12.3, 12.4_

- [x] 2. Implement Backend Authentication System
  - [x] 2.1 Create Auth module with JWT strategy using Passport
    - Implement AuthService with password hashing (bcrypt) and validation methods
    - Implement JWT token generation with 7-day expiration
    - Create POST /api/auth/login endpoint with credential verification
    - Return user data (without password) and JWT token on successful login
    - _Requirements: 2.2, 2.3, 2.4, 2.6, 2.10_

  - [x] 2.2 Create authentication guards and middleware
    - Implement JwtAuthGuard for protecting routes
    - Implement RolesGuard for role-based access control
    - Create @Roles decorator for controller methods
    - Add JWT verification middleware that checks token and attaches user to request
    - _Requirements: 2.7, 14.6, 14.7_

- [x] 3. Implement Backend Findings CRUD Endpoints
  - [x] 3.1 Create Findings module with TypeORM entity and service
    - Implement GET /api/smk3-data with filters (subSubElementId, findingStatus, createdById, department)
    - Implement POST /api/smk3-data with DTO validation using class-validator
    - Implement GET /api/smk3-data/:id for single finding retrieval
    - Implement PUT /api/smk3-data/:id with edit permission checks
    - Implement DELETE /api/smk3-data/:id with soft delete (set deletedAt timestamp)
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.6, 8.7, 8.8, 8.9, 8.11_


  - [x] 3.2 Implement approval workflow endpoint
    - Create PATCH /api/smk3-data/:id/status endpoint for status updates
    - Add RolesGuard to require supervisor or admin role
    - Update findingStatus, approvedBy, approvedById, and approvedAt fields
    - Return 403 Forbidden if user lacks required role
    - _Requirements: 8.5, 14.5, 14.7, 14.8, 14.9_

  - [x] 3.3 Implement audit logging for all CRUD operations
    - Create AuditService with log method
    - Create AuditInterceptor that logs CREATE, UPDATE, DELETE operations
    - Store before/after changes in audit_logs table JSONB column
    - Apply interceptor globally or to Findings controller
    - _Requirements: 1.9, 8.10_

- [x] 4. Implement Backend Notifications System
  - [x] 4.1 Create Notifications module with service and endpoints
    - Implement GET /api/notifications with filters (isRead) and pagination
    - Implement PATCH /api/notifications/:id/read to mark single notification as read
    - Implement PATCH /api/notifications/read-all to mark all user notifications as read
    - Filter notifications by authenticated user's ID
    - _Requirements: 16.10, 16.11, 16.12_

  - [x] 4.2 Integrate notification creation into findings workflow
    - Create notification of type "finding_submitted" for creator when finding is created
    - Create notifications of type "approval_required" for supervisors in same department when finding is created
    - Create notification of type "finding_approved" for creator when finding is approved
    - Create notification of type "finding_rejected" for creator when finding is rejected
    - _Requirements: 16.4, 16.5, 16.6, 16.7, 6.16_

- [x] 5. Implement File Upload System
  - [x] 5.1 Create Uploads module with file validation
    - Create POST /api/uploads endpoint with multer middleware
    - Validate file type (jpg, jpeg, png) and size (max 5MB)
    - Sanitize filename using timestamp and random string
    - Save file to public/uploads/smk3/{subSubElementId}/ directory
    - Return file path, filename, size, and mimetype
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.8_


  - [x] 5.2 Add error handling for file upload edge cases
    - Handle disk space errors (ENOSPC) with proper error message
    - Handle permission errors (EACCES) with proper error message
    - Display error for file size exceeding 5MB
    - Display error for invalid file types
    - _Requirements: 7.2, 7.3, 7.7, 7.8, 11.7_

- [x] 6. Checkpoint - Backend API Testing
  - Ensure all backend tests pass (if implemented)
  - Test all API endpoints manually using Postman or curl
  - Verify authentication works with valid and invalid credentials
  - Verify role-based access control blocks unauthorized requests
  - Verify audit logs are created for all CRUD operations
  - Ask the user if questions arise.

- [x] 7. Setup Frontend Project Structure
  - [x] 7.1 Configure Next.js with App Router and TypeScript
    - Set up Tailwind CSS v4 with custom colors (orange #f15a22, dark #231f20)
    - Configure NextAuth.js with credentials provider
    - Create root layout with global providers (AuthContext, NotificationContext)
    - Set up react-hot-toast for notifications
    - Install and configure react-hook-form and zod for form validation
    - _Requirements: 2.10, 9.2, 10.9, 12.2_

  - [x] 7.2 Create shared UI component library
    - Create Button component with variants (primary, secondary, danger)
    - Create Input, Select, and Textarea components with validation error display
    - Create Card, Badge, Modal, Spinner, and EmptyState components
    - Create StatusBadge component with color mapping (OPEN=orange, INPG=blue, CLSD=green)
    - Style all components using Tailwind CSS with consistent design system
    - _Requirements: 9.4, 9.7, 9.8, 9.9_

- [x] 8. Implement Frontend Authentication
  - [x] 8.1 Create login page and authentication flow
    - Create /login page with email and password input fields
    - Integrate with NextAuth.js to call /api/auth/login endpoint
    - Display loading spinner during authentication
    - Display error toast for invalid credentials
    - Redirect to /dashboard on successful login
    - _Requirements: 2.1, 2.4, 2.5, 2.9_

  - [x] 8.2 Create authentication context and protected routes
    - Create AuthContext with user state and login/logout functions
    - Create ProtectedRoute wrapper component that redirects to /login if not authenticated
    - Store JWT token in httpOnly cookie or session storage
    - Implement logout function that clears token and redirects to /login
    - _Requirements: 2.7, 2.8, 2.11_


- [x] 9. Implement Dashboard Page
  - [x] 9.1 Create dashboard layout with statistics cards
    - Create /dashboard route as protected page
    - Fetch statistics from GET /api/smk3-data endpoint and calculate totals
    - Display 3 statistics cards: total findings, open findings, closed findings
    - Apply loading state with spinner while fetching data
    - Display error toast if API request fails
    - _Requirements: 3.1, 3.2, 3.6, 3.7_

  - [x] 9.2 Create recent findings widget
    - Display table of 5 most recent findings with columns: title, status, location, date, actions
    - Use StatusBadge component for status display
    - Add "Tambah Finding" button that navigates to /findings/new
    - Display empty state "Belum ada data finding" when no findings exist
    - _Requirements: 3.3, 3.4, 3.5, 3.8, 3.9_

- [x] 10. Implement Findings List Page
  - [x] 10.1 Create findings list with filtering
    - Create /findings route with responsive table layout
    - Fetch findings from GET /api/smk3-data endpoint
    - Display columns: title, status, location, date, created by, actions
    - Add filter buttons for status: All, OPEN, INPG, CLSD
    - Apply filter by sending query parameter to API
    - _Requirements: 4.1, 4.2, 4.3, 4.4_

  - [x] 10.2 Add action buttons and loading states
    - Add View, Edit, Delete action buttons for each finding row
    - Display loading spinner while fetching findings
    - Display empty state "Tidak ada finding dengan status ini" when no results
    - Add "Tambah Finding Baru" button at the top
    - Make table responsive and scrollable on mobile devices
    - _Requirements: 4.5, 4.6, 4.7, 4.8, 4.9_

- [x] 11. Implement Finding Form (Create/Edit)
  - [x] 11.1 Create finding form with validation
    - Create /findings/new and /findings/:id/edit routes with form
    - Add form fields: title, tanggal, lokasi, deskripsi, kategori, levelHazard, status
    - Implement client-side validation using react-hook-form and zod
    - Display validation errors below respective fields
    - Auto-populate createdBy and createdById from current user session
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.13_

  - [x] 11.2 Integrate file upload functionality
    - Add "Upload Foto" button that opens file picker
    - Display preview thumbnail of selected images
    - Upload files to POST /api/uploads endpoint
    - Store returned file paths in finding's files array
    - Allow multiple file uploads (up to 5 files)
    - _Requirements: 5.7, 5.8, 7.6, 7.9, 7.10_


  - [x] 11.3 Handle form submission and navigation
    - Submit form data to POST /api/smk3-data for new findings
    - Submit form data to PUT /api/smk3-data/:id for editing existing findings
    - Display success toast "Finding berhasil disimpan" on success
    - Navigate back to /findings after successful submission
    - Display loading spinner on submit button during API request
    - Display error toast with error message if API request fails
    - _Requirements: 5.5, 5.6, 5.9, 5.10, 5.11, 5.12_

- [x] 12. Implement Finding Detail View
  - [x] 12.1 Create finding detail page with full information display
    - Create /findings/:id route showing all finding details
    - Display all fields: title, date, location, description, category, hazard level, status, created by, approved by
    - Display uploaded photos in grid layout with clickable thumbnails
    - Open photo in larger modal view when thumbnail is clicked
    - Display loading spinner while fetching finding data
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 6.14_

  - [x] 12.2 Add action buttons based on user role
    - Show Edit, Delete, and Back to List buttons for all users
    - Show Approve and Reject buttons conditionally for supervisors/admins on OPEN findings
    - Implement Edit button navigation to /findings/:id/edit
    - Implement Delete button with confirmation dialog "Yakin ingin menghapus finding ini?"
    - Send DELETE request to /api/smk3-data/:id on confirmation
    - _Requirements: 6.6, 6.7, 6.10, 6.11, 6.12_

  - [x] 12.3 Implement approval/rejection workflow
    - Send PATCH request to /api/smk3-data/:id/status with status "INPG" when Approve is clicked
    - Show dialog to input rejection reason when Reject is clicked
    - Include approvedBy and approvedById in status update request
    - Display success toast and refresh finding data after approval/rejection
    - Create notifications for finding creator after approval/rejection
    - _Requirements: 6.8, 6.9, 6.13, 6.16, 14.5_

- [x] 13. Implement Navigation and Layout
  - [x] 13.1 Create sidebar navigation with menu items
    - Create Sidebar component with Dashboard, Findings, Logout menu items
    - Highlight currently active menu item with orange background
    - Make sidebar collapsible on mobile with hamburger menu icon
    - Display current user's name and role in navigation header
    - Display application logo and title "SMK3 System" in header
    - _Requirements: 10.1, 10.3, 10.5, 10.6, 10.7, 10.9_


  - [x] 13.2 Add notification bell icon and dropdown
    - Add bell icon in header with unread notification count badge
    - Create NotificationDropdown component that fetches from GET /api/notifications
    - Display up to 10 recent notifications with icon, title, message, and timestamp
    - Mark notification as read when clicked and navigate to related finding detail page
    - Add "Mark All as Read" button that calls PATCH /api/notifications/read-all
    - _Requirements: 10.2, 16.1, 16.2, 16.3, 16.8, 16.9, 16.15_

  - [x] 13.3 Implement notification polling and context
    - Create NotificationContext with notifications state and refresh function
    - Implement polling mechanism that fetches notifications every 30 seconds
    - Update unread count badge automatically without page refresh
    - Display relative timestamps for notifications (e.g., "5 menit yang lalu")
    - Display empty state "Tidak ada notifikasi" when no notifications exist
    - _Requirements: 16.13, 16.14, 16.16_

- [ ] 14. Checkpoint - Frontend Core Features Testing
  - Test login flow with all 3 user roles (admin, supervisor, user)
  - Test dashboard displays correct statistics
  - Test creating, editing, viewing, and deleting findings
  - Test file upload works with valid images and shows errors for invalid files
  - Test approval workflow for supervisor approving user's finding
  - Test notifications appear and can be marked as read
  - Ask the user if questions arise.

- [ ] 15. Implement Export Functionality
  - [x] 15.1 Add Excel export for findings list
    - Create exportFindingsToExcel utility function using xlsx library
    - Add "Export to Excel" button on findings list page
    - Generate Excel file with columns: title, status, location, date, category, hazard level, created by, approved by
    - Apply header styling with orange background and bold text
    - Set column widths for readability
    - Download file with filename format "findings-export-YYYY-MM-DD.xlsx"
    - _Requirements: 13.1, 13.2, 13.3, 13.8, 13.12_

  - [ ] 15.2 Add PDF export for finding detail
    - Create exportFindingToPDF utility function using jsPDF and jspdf-autotable
    - Add "Export to PDF" button on finding detail page
    - Generate PDF with company header and title "SMK3 Finding Report"
    - Include all finding details in formatted table
    - Embed uploaded photos in PDF with appropriate sizing
    - Add page numbers and footer with company name
    - Download file with filename format "finding-{id}-{title}-YYYY-MM-DD.pdf"
    - _Requirements: 13.4, 13.5, 13.6, 13.7, 13.11_


  - [ ] 15.3 Add error handling and loading states for exports
    - Display loading spinner on export button during file generation
    - Display success toast "Excel/PDF file generated successfully" after download
    - Display error toast "Gagal membuat export file" if generation fails
    - Respect active filters when exporting findings list to Excel
    - _Requirements: 13.9, 13.10_

- [ ] 16. Implement Role-Based Access Control (RBAC)
  - [ ] 16.1 Add role checks to frontend UI components
    - Hide Approve/Reject buttons for users with role "user"
    - Hide "Manage Users" menu item for non-admin roles
    - Display user's current role in navigation header next to name
    - Filter findings by department for supervisors on initial load
    - Show all findings for admins without department filter
    - _Requirements: 14.10, 14.11, 14.12, 14.13_

  - [ ] 16.2 Verify backend RBAC enforcement
    - Confirm PATCH /api/smk3-data/:id/status requires supervisor or admin role
    - Confirm GET /api/users, POST /api/users, DELETE /api/users/:id require admin role
    - Return 403 Forbidden for unauthorized role access attempts
    - Display error toast "Anda tidak memiliki akses untuk melakukan operasi ini" for 403 errors
    - _Requirements: 14.4, 14.7, 14.8, 14.9, 11.3_

- [ ] 17. Implement Error Handling and Edge Cases
  - [ ] 17.1 Add global error handling for API requests
    - Create apiErrorHandler utility that maps status codes to user-friendly messages
    - Handle 401 Unauthorized by clearing token and redirecting to /login
    - Handle 403 Forbidden with "Anda tidak memiliki akses" message
    - Handle 404 Not Found with "Data tidak ditemukan" message
    - Handle 500 Internal Server Error with "Terjadi kesalahan server" message
    - Handle network errors with "Tidak dapat terhubung ke server" message
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.9_

  - [ ] 17.2 Add error handling for edge cases
    - Create 404 error page for non-existent findings with "Data tidak ditemukan" message
    - Handle database connection failures with 503 Service Unavailable response
    - Handle file upload disk space errors with proper error message
    - Catch all unhandled JavaScript errors and display generic error message
    - Log all errors to browser console in development mode
    - _Requirements: 11.5, 11.6, 11.7, 11.8_

  - [ ] 17.3 Add input sanitization and validation
    - Implement class-validator DTOs for all backend POST/PUT endpoints
    - Sanitize user input on backend to prevent SQL injection and XSS attacks
    - Use TypeORM parameterized queries (automatic protection)
    - Validate file types and sizes before processing uploads
    - _Requirements: 11.10_


- [ ] 18. Checkpoint - Complete Web Application Testing
  - Perform end-to-end testing of all features with all 3 user roles
  - Test error handling for invalid inputs, network failures, and unauthorized access
  - Test export functionality generates correct Excel and PDF files
  - Verify RBAC prevents unauthorized actions
  - Test responsive design on mobile, tablet, and desktop screen sizes
  - Ask the user if questions arise.

- [ ] 19. Setup React Native Mobile App (Optional - If Time Permits)
  - [ ] 19.1 Initialize React Native project with Expo
    - Create new Expo project with TypeScript template
    - Install React Native Paper for UI components
    - Set up Expo Router for navigation with bottom tabs
    - Configure AsyncStorage for local data caching
    - Share TypeScript type definitions with web frontend
    - _Requirements: 15.1, 15.2, 15.13_

  - [ ] 19.2 Implement mobile authentication and API client
    - Create shared API client that works with both web and mobile
    - Implement login screen with email and password inputs
    - Store JWT token in AsyncStorage after successful login
    - Add Authorization header to all API requests using interceptor
    - Handle 401 errors by clearing AsyncStorage and redirecting to login
    - _Requirements: 15.3, 15.14_

  - [ ] 19.3 Create mobile dashboard and findings list
    - Create Dashboard screen with same statistics cards as web
    - Create Findings List screen with filtering by status
    - Implement pull-to-refresh for data updates
    - Cache findings data in AsyncStorage for offline viewing
    - Display loading indicators and empty states
    - _Requirements: 15.4, 15.5, 15.9_

  - [ ] 19.4 Implement camera integration for photo capture
    - Install and configure expo-camera
    - Request camera permissions from user
    - Create Camera screen with capture button
    - Display photo preview with retake and confirm options
    - Upload captured photo to backend API
    - _Requirements: 15.6, 15.7, 15.8_

  - [ ] 19.5 Add offline mode and sync functionality
    - Implement offline mode that caches findings in AsyncStorage
    - Queue pending CREATE/UPDATE/DELETE operations when offline
    - Sync pending operations to backend when network is restored
    - Display sync status indicator to user
    - _Requirements: 15.10_

- [ ] 20. Documentation and Deployment Setup
  - [ ] 20.1 Create comprehensive README.md
    - Document all prerequisites (Node.js, Bun, PostgreSQL, Docker)
    - Write step-by-step setup instructions for local development
    - Document environment variables for both frontend and backend
    - Include instructions for starting PostgreSQL using docker-compose
    - Add instructions for running migrations and seed data
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_


  - [ ] 20.2 Add troubleshooting guide and screenshots
    - Write troubleshooting section for common issues (database errors, CORS, port conflicts)
    - Create example .env.example files for frontend and backend
    - Add screenshots of login page, dashboard, and findings list
    - Document test user credentials (admin@smk3.local / admin123, etc.)
    - _Requirements: 12.7, 12.9, 12.10_

  - [ ] 20.3 Verify Docker Compose setup works
    - Test docker-compose.yml starts PostgreSQL and pgAdmin successfully
    - Verify database connection from backend application
    - Document how to access pgAdmin (http://localhost:5050)
    - Test seed data script creates users and sample findings
    - _Requirements: 12.3, 12.4_

- [ ] 21. Final Checkpoint - Complete System Validation
  - Run complete manual testing checklist for all features
  - Verify all 3 user roles work correctly with proper permissions
  - Test entire workflow: login → create finding → approve → notification → export
  - Ensure documentation is complete and accurate
  - Test setup instructions by following README on fresh environment
  - Ask the user if questions arise.

## Notes

- **No Property-Based Testing**: This MVP focuses on infrastructure, CRUD operations, and UI rendering. Property-based testing is not applicable. Use manual testing and example-based integration tests instead.

- **Pragmatic Approach**: Focus on building working features over perfect code. The goal is a demonstrable proof-of-concept in 1 month by 1 developer.

- **Existing Codebase**: Build on top of existing project structure and patterns. Leverage BACKEND_SETUP.md flexible JSONB schema approach.

- **Mobile App (Optional)**: Tasks 19.x are optional depending on available time. Prioritize web application completion first.

- **Manual Testing Priority**: Manual end-to-end testing is the primary validation method. Integration tests are secondary and minimal unit tests only for critical business logic.

- **Checkpoints**: Regular checkpoints (tasks 6, 14, 18, 21) ensure incremental validation and opportunities to ask questions or adjust approach.

- **Tech Stack Alignment**: All tasks use TypeScript for type safety. Frontend uses Next.js 16 with Tailwind CSS v4. Backend uses NestJS with PostgreSQL and TypeORM.

- **Color Scheme**: Use consistent orange theme (#f15a22) for primary actions and branding throughout the application.

- **Realistic Timeline**: This task breakdown assumes 1 amateur developer working full-time for approximately 1 month (~160 hours). Tasks are ordered by dependency and priority.

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1", "7.1"] },
    { "id": 1, "tasks": ["2.1", "7.2"] },
    { "id": 2, "tasks": ["2.2", "3.1", "8.1"] },
    { "id": 3, "tasks": ["3.2", "3.3", "4.1", "8.2", "9.1"] },
    { "id": 4, "tasks": ["4.2", "5.1", "9.2", "10.1"] },
    { "id": 5, "tasks": ["5.2", "10.2", "11.1"] },
    { "id": 6, "tasks": ["6", "11.2"] },
    { "id": 7, "tasks": ["11.3", "12.1"] },
    { "id": 8, "tasks": ["12.2", "13.1"] },
    { "id": 9, "tasks": ["12.3", "13.2"] },
    { "id": 10, "tasks": ["13.3", "15.1"] },
    { "id": 11, "tasks": ["14", "15.2"] },
    { "id": 12, "tasks": ["15.3", "16.1"] },
    { "id": 13, "tasks": ["16.2", "17.1"] },
    { "id": 14, "tasks": ["17.2", "17.3"] },
    { "id": 15, "tasks": ["18"] },
    { "id": 16, "tasks": ["19.1", "20.1"] },
    { "id": 17, "tasks": ["19.2", "20.2"] },
    { "id": 18, "tasks": ["19.3", "20.3"] },
    { "id": 19, "tasks": ["19.4"] },
    { "id": 20, "tasks": ["19.5"] },
    { "id": 21, "tasks": ["21"] }
  ]
}
```
