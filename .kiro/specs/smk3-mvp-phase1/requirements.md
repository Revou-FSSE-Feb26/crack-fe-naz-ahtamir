# Requirements Document - SMK3 MVP Phase 1

## Introduction

SMK3 MVP Phase 1 adalah prototype working application untuk sistem Occupational Health & Safety (OHS) yang dapat didemonstrasikan dalam 1 bulan oleh 1 developer amatir. Fokus pada fitur-fitur **visible** dan **usable** yang menunjukkan bahwa sistem dapat berjalan end-to-end dari login, CRUD findings, approval workflow, notifications, export reports, sampai display data di dashboard.

Scope MVP ini adalah **proof of concept** yang realistis, menggunakan tech stack yang sudah ada (Next.js, NestJS, PostgreSQL, React Native), dengan 4 tabel database, dan mengimplementasikan workflow dasar: Login → Dashboard → Manage Findings → Approve/Reject → Notifications → Export Reports → Mobile App Access. 

Fitur tambahan yang diinclude: (1) **Notification System** untuk approval workflow dengan bell icon dan in-app notifications, (2) **PDF/Excel Export** untuk reporting compliance, (3) **Role-Based Access Control** dengan 3 roles (admin, supervisor, user), dan (4) **React Native Mobile App** untuk field inspection dengan camera integration dan offline mode.

## Glossary

- **System**: SMK3 MVP Phase 1 Application (frontend Next.js + backend NestJS)
- **User**: Person yang menggunakan aplikasi dengan salah satu dari 3 roles: admin, supervisor, user
- **Role**: User role yang menentukan permissions (admin, supervisor, user)
- **Finding**: Record temuan atau inspeksi K3 (keselamatan dan kesehatan kerja)
- **Finding_Form**: Form untuk create/edit finding dengan fields: tanggal, lokasi, deskripsi, foto, status
- **Dashboard**: Homepage setelah login yang menampilkan statistik dan recent findings
- **Finding_Status**: Status dari finding (OPEN, INPG, CLSD)
- **File_Upload**: Fitur upload foto untuk finding (disimpan di public/uploads/)
- **Database**: PostgreSQL database dengan 4 tabel: users, smk3_data, audit_logs, notifications
- **Backend_API**: NestJS API endpoints di port 3001
- **Frontend**: Next.js application di port 3000
- **Auth_System**: NextAuth.js dengan JWT untuk authentication
- **Navigation**: Sidebar atau navbar dengan menu Dashboard, Findings, Notifications, Logout
- **Notification**: In-app notification untuk approval workflow dengan bell icon
- **Export**: Fitur untuk download finding list sebagai Excel atau finding detail sebagai PDF
- **Mobile_App**: React Native mobile application untuk Android dan iOS
- **RBAC_Middleware**: Middleware untuk role-based access control di API endpoints

## Requirements

### Requirement 1: Database Setup

**User Story:** As a developer, I want a minimal database schema with 4 tables and seed data for 3 different user roles, so that the application has a working data layer that can be tested immediately with role-based scenarios.

#### Acceptance Criteria

1. THE Database SHALL contain a users table with columns: id, name, email, idKaryawan, password (hashed), role (enum: admin, supervisor, user), department, createdAt
2. THE Database SHALL contain a smk3_data table with columns: id, subSubElementId, title, findingStatus, data (JSONB), files (JSONB), createdBy, createdById, approvedBy, approvedById, approvedAt, createdAt, updatedAt, deletedAt
3. THE Database SHALL contain an audit_logs table with columns: id, tableName, recordId, action, userId, changes (JSONB), timestamp
4. THE Database SHALL contain a notifications table with columns: id, userId, type (enum: finding_submitted, approval_required, finding_approved, finding_rejected), title, message, findingId, isRead (boolean), createdAt
5. WHEN the database is initialized, THE System SHALL seed 3 users with different roles: admin user (email="admin@smk3.local", password="admin123", role="admin"), supervisor user (email="supervisor@smk3.local", password="super123", role="supervisor", department="Safety"), regular user (email="user@smk3.local", password="user123", role="user", department="Production")
6. WHEN the database is initialized, THE System SHALL seed 5-10 sample findings with realistic dummy data assigned to different users for demonstration purposes
7. THE users table SHALL store passwords using bcrypt hashing with salt rounds of 10
8. THE smk3_data table SHALL use JSONB columns for flexible schema (data and files) to avoid frequent schema migrations
9. THE audit_logs table SHALL record all CREATE, UPDATE, DELETE operations on smk3_data table
10. THE notifications table SHALL have a foreign key relationship with users table (userId) and smk3_data table (findingId)

### Requirement 2: Authentication System

**User Story:** As a user, I want to login with email and password, so that I can access the protected application features based on my assigned role.

#### Acceptance Criteria

1. THE System SHALL provide a login page at route "/login" with email and password input fields
2. WHEN valid credentials are submitted, THE Auth_System SHALL verify credentials against the users table using bcrypt comparison
3. WHEN credentials are valid, THE Auth_System SHALL generate a JWT token with user id, email, name, role, and department in the payload
4. WHEN credentials are valid, THE System SHALL redirect the user to the Dashboard page
5. WHEN credentials are invalid, THE System SHALL display an error message "Email atau password salah"
6. THE Auth_System SHALL set JWT token expiration to 7 days
7. WHEN a user is not authenticated, THE System SHALL redirect all protected routes to "/login"
8. THE System SHALL provide a logout button that clears the JWT token and redirects to "/login"
9. THE login page SHALL display a loading spinner during authentication request
10. THE Auth_System SHALL use NextAuth.js with credentials provider for authentication implementation
11. THE Auth_System SHALL include user role and department in the session object accessible throughout the application

### Requirement 3: Dashboard Homepage

**User Story:** As a user, I want to see a dashboard with statistics and recent findings after login, so that I can quickly understand the current status of findings.

#### Acceptance Criteria

1. THE Dashboard SHALL display 3 statistics cards showing: total findings count, open findings count, and closed findings count
2. THE Dashboard SHALL calculate statistics by querying smk3_data table grouped by findingStatus
3. THE Dashboard SHALL display a table showing the 5 most recent findings with columns: title, status, location, date, and action buttons
4. THE Dashboard SHALL display a visual badge for Finding_Status using colors: orange for OPEN, blue for INPG, green for CLSD
5. WHEN there are no findings in the database, THE Dashboard SHALL display an empty state message "Belum ada data finding"
6. THE Dashboard SHALL display a loading spinner WHILE fetching data from Backend_API
7. THE Dashboard SHALL display an error toast notification IF the API request fails
8. THE Dashboard SHALL provide a "Tambah Finding" button that navigates to the Finding_Form page
9. THE Dashboard SHALL update statistics automatically WHEN returning from creating or editing a finding

### Requirement 4: Finding List Page

**User Story:** As a user, I want to view a list of all findings with filtering by status, so that I can browse and manage findings effectively.

#### Acceptance Criteria

1. THE System SHALL provide a findings list page at route "/findings"
2. THE findings list page SHALL display all findings in a responsive table with columns: title, status, location, date, created by, and actions
3. THE findings list page SHALL provide filter buttons for status: All, OPEN, INPG, CLSD
4. WHEN a status filter is selected, THE System SHALL send a request to Backend_API with query parameter "findingStatus"
5. THE findings list page SHALL display action buttons for each row: View, Edit, Delete
6. THE findings list page SHALL display a loading spinner WHILE fetching findings from Backend_API
7. WHEN there are no findings matching the filter, THE System SHALL display empty state "Tidak ada finding dengan status ini"
8. THE findings list table SHALL be responsive and scrollable on mobile devices
9. THE findings list page SHALL display a "Tambah Finding Baru" button at the top

### Requirement 5: Finding Form (Create/Edit)

**User Story:** As a user, I want to create and edit findings with form validation and file upload, so that I can record inspection data with supporting photos.

#### Acceptance Criteria

1. THE System SHALL provide a finding form page at route "/findings/new" for creating new findings
2. THE System SHALL provide a finding form page at route "/findings/:id/edit" for editing existing findings
3. THE Finding_Form SHALL include input fields: title (text, required), tanggal (date, required), lokasi (text, required), deskripsi (textarea, required), kategori (select), levelHazard (select), status (select: OPEN/INPG/CLSD)
4. WHEN the form is submitted without required fields, THE System SHALL display validation error messages below the respective fields
5. WHEN the form is submitted with valid data, THE System SHALL send a POST request to "/api/smk3-data" for new findings
6. WHEN the form is submitted with valid data for editing, THE System SHALL send a PUT request to "/api/smk3-data" with the finding id
7. THE Finding_Form SHALL include a file upload button labeled "Upload Foto" that accepts image files (jpg, png, jpeg)
8. WHEN a file is selected, THE System SHALL display a preview thumbnail of the uploaded image
9. WHEN the form is successfully submitted, THE System SHALL display a success toast "Finding berhasil disimpan"
10. WHEN the form is successfully submitted, THE System SHALL navigate back to the findings list page
11. WHEN the API request fails, THE System SHALL display an error toast with the error message
12. THE Finding_Form SHALL display a loading spinner on the submit button WHILE the request is processing
13. THE Finding_Form SHALL auto-populate current user's name and id in createdBy and createdById fields

### Requirement 6: Finding Detail View

**User Story:** As a user, I want to view detailed information of a finding including uploaded photos and approval actions, so that I can review inspection records completely and approve/reject findings if I have supervisor or admin role.

#### Acceptance Criteria

1. THE System SHALL provide a finding detail page at route "/findings/:id"
2. THE finding detail page SHALL display all finding information: title, date, location, description, category, hazard level, status, created by, approved by (if approved), and creation date
3. THE finding detail page SHALL display all uploaded photos in a grid layout with clickable thumbnails
4. WHEN a photo thumbnail is clicked, THE System SHALL display the photo in a larger modal view
5. THE finding detail page SHALL display a status badge with appropriate color based on Finding_Status
6. THE finding detail page SHALL provide action buttons based on user role: Edit, Delete, Back to List, and conditionally Approve/Reject buttons
7. WHEN the current user has role "supervisor" or "admin" AND finding status is "OPEN", THE System SHALL display "Approve" and "Reject" buttons
8. WHEN the Approve button is clicked, THE System SHALL send a PATCH request to "/api/smk3-data/:id/status" with status "INPG" and approvedBy/approvedById fields
9. WHEN the Reject button is clicked, THE System SHALL display a dialog to input rejection reason, then send a PATCH request with status remaining "OPEN" and rejection note
10. WHEN the Edit button is clicked, THE System SHALL navigate to the edit form for this finding
11. WHEN the Delete button is clicked, THE System SHALL display a confirmation dialog "Yakin ingin menghapus finding ini?"
12. WHEN delete is confirmed, THE System SHALL send a DELETE request to "/api/smk3-data?id=xxx"
13. WHEN delete is successful, THE System SHALL display a success toast and navigate to findings list
14. THE finding detail page SHALL display a loading spinner WHILE fetching finding data from Backend_API
15. WHEN the finding id is not found, THE System SHALL display an error message "Finding tidak ditemukan"
16. WHEN a finding is approved or rejected, THE System SHALL create a notification for the finding creator

### Requirement 7: File Upload System

**User Story:** As a user, I want to upload photos for findings and see them saved in the system, so that I can attach visual evidence to inspection records.

#### Acceptance Criteria

1. THE File_Upload SHALL accept image file types: .jpg, .jpeg, .png with maximum file size of 5MB
2. WHEN a file exceeds 5MB, THE System SHALL display an error message "Ukuran file maksimal 5MB"
3. WHEN a non-image file is selected, THE System SHALL display an error message "Hanya file gambar yang diperbolehkan"
4. WHEN a valid image is uploaded, THE System SHALL save the file to "public/uploads/smk3/{subSubElementId}/" directory
5. THE File_Upload SHALL generate a unique filename using timestamp and random string to avoid conflicts
6. WHEN file upload is successful, THE System SHALL store the file path in the finding's files JSONB array
7. THE File_Upload SHALL display an upload progress indicator WHILE uploading large files
8. WHEN file upload fails, THE System SHALL display an error toast "Gagal upload file" and allow retry
9. THE System SHALL allow multiple file uploads per finding (up to 5 files)
10. THE Finding_Form SHALL display a preview of uploaded files with a remove button for each file

### Requirement 8: Backend API Endpoints

**User Story:** As a frontend developer, I want RESTful API endpoints that follow standard conventions, so that I can integrate the frontend with the backend predictably.

#### Acceptance Criteria

1. THE Backend_API SHALL provide GET "/api/smk3-data" endpoint that returns all findings with optional query filters: subSubElementId, findingStatus, createdById
2. THE Backend_API SHALL provide POST "/api/smk3-data" endpoint that creates a new finding with request body: subSubElementId, title, findingStatus, createdBy, createdById, data (JSONB), files (JSONB array)
3. THE Backend_API SHALL provide GET "/api/smk3-data/:id" endpoint that returns a single finding by id
4. THE Backend_API SHALL provide PUT "/api/smk3-data/:id" endpoint that updates an existing finding with the same fields as POST
5. THE Backend_API SHALL provide PATCH "/api/smk3-data/:id/status" endpoint that updates only the findingStatus field
6. THE Backend_API SHALL provide DELETE "/api/smk3-data/:id" endpoint that performs soft delete by setting deletedAt timestamp
7. WHEN a POST or PUT request is received, THE Backend_API SHALL validate that required fields (title, subSubElementId, createdBy, createdById) are present
8. WHEN required fields are missing, THE Backend_API SHALL return 400 Bad Request with error message indicating which fields are missing
9. WHEN a GET request with filters is received, THE Backend_API SHALL return only findings matching all provided filters
10. WHEN a DELETE request is received, THE Backend_API SHALL record the deletion in audit_logs table before soft deleting
11. THE Backend_API SHALL return proper HTTP status codes: 200 for success, 201 for created, 400 for bad request, 404 for not found, 500 for server error
12. THE Backend_API SHALL enable CORS for origin "http://localhost:3000" to allow frontend API calls

### Requirement 9: UI Components and User Feedback

**User Story:** As a user, I want clear visual feedback for all interactions, so that I know when operations are loading, successful, or failed.

#### Acceptance Criteria

1. THE System SHALL display a loading spinner component with animation WHILE any API request is in progress
2. THE System SHALL use react-hot-toast library to display toast notifications for success and error messages
3. WHEN an operation succeeds, THE System SHALL display a green success toast for 3 seconds
4. WHEN an operation fails, THE System SHALL display a red error toast for 5 seconds with the error message
5. THE System SHALL display empty state components with icons and messages WHEN lists or tables have no data
6. THE System SHALL display form validation error messages in red text below input fields WHEN validation fails
7. THE System SHALL provide status badges with colors: orange (#f15a22) for OPEN, blue (#3b82f6) for INPG, green (#10b981) for CLSD
8. THE System SHALL ensure all interactive buttons have hover states with color changes
9. THE System SHALL ensure all pages are responsive and usable on mobile devices (min width 320px)
10. THE System SHALL use consistent color scheme: orange (#f15a22) for primary actions, dark (#231f20) for text, white (#ffffff) for backgrounds

### Requirement 10: Navigation and Layout

**User Story:** As a user, I want a consistent navigation menu on all pages with notification access, so that I can easily move between different sections of the application and stay informed of approval status updates.

#### Acceptance Criteria

1. THE System SHALL provide a sidebar navigation menu on all authenticated pages with menu items: Dashboard, Findings, Logout
2. THE Navigation SHALL display a bell icon in the header for accessing notifications with unread count badge
3. THE Navigation SHALL highlight the currently active menu item with orange background color
4. WHEN the Logout menu item is clicked, THE System SHALL call the logout function and redirect to "/login"
5. THE Navigation sidebar SHALL be collapsible on mobile devices with a hamburger menu icon
6. THE System SHALL display the current user's name and role in the navigation header (e.g., "John Doe (Supervisor)")
7. THE System SHALL display the application logo and title "SMK3 System" in the navigation header
8. THE Navigation SHALL remain fixed on the left side of the screen on desktop devices
9. THE System SHALL provide a consistent page layout with navigation, header, and content area on all pages
10. THE System SHALL display breadcrumb navigation showing the current page path on all pages except Dashboard

### Requirement 11: Error Handling and Edge Cases

**User Story:** As a user, I want the application to handle errors gracefully without crashing, so that I can continue using the application even when issues occur.

#### Acceptance Criteria

1. WHEN the Backend_API is unreachable, THE System SHALL display an error toast "Tidak dapat terhubung ke server"
2. WHEN a network timeout occurs (>30 seconds), THE System SHALL display an error toast "Request timeout, silakan coba lagi"
3. WHEN the Backend_API returns 401 Unauthorized, THE System SHALL automatically redirect to "/login" and clear the JWT token
4. WHEN the Backend_API returns 500 Internal Server Error, THE System SHALL display an error toast "Terjadi kesalahan server"
5. WHEN a user tries to access a finding that doesn't exist, THE System SHALL display a 404 error page with "Data tidak ditemukan" message
6. WHEN the database connection fails, THE Backend_API SHALL log the error and return 503 Service Unavailable
7. WHEN a file upload fails due to disk space issues, THE System SHALL display an error toast "Gagal menyimpan file"
8. THE System SHALL catch all unhandled JavaScript errors and display a generic error message instead of crashing
9. THE System SHALL log all errors to browser console for debugging purposes in development mode
10. THE Backend_API SHALL validate all input data and sanitize to prevent SQL injection and XSS attacks

### Requirement 12: Deployment and Setup Guide

**User Story:** As a developer, I want clear documentation on how to run the application locally, so that I can set up the development environment quickly.

#### Acceptance Criteria

1. THE System SHALL provide a README.md file with step-by-step setup instructions including prerequisites, installation, and running the application
2. THE README.md SHALL document all required environment variables for both frontend (.env.local) and backend (.env)
3. THE README.md SHALL include instructions for starting PostgreSQL using docker-compose
4. THE README.md SHALL include instructions for running database migrations and seed data
5. THE README.md SHALL include instructions for starting the backend server on port 3001
6. THE README.md SHALL include instructions for starting the frontend server on port 3000
7. THE README.md SHALL include troubleshooting section for common issues: database connection errors, CORS errors, port conflicts
8. THE System SHALL provide a DEPLOYMENT.md file with instructions for deploying to production environment
9. THE System SHALL include example .env.example files for both frontend and backend with all required variables documented
10. THE README.md SHALL include screenshots of the login page, dashboard, and findings list for visual reference

### Requirement 13: Export and Reporting

**User Story:** As a user, I want to export finding lists to Excel and finding details to PDF, so that I can generate reports for management and compliance documentation.

#### Acceptance Criteria

1. THE findings list page SHALL display an "Export to Excel" button at the top of the table
2. WHEN the "Export to Excel" button is clicked, THE System SHALL generate an Excel file using the xlsx library containing all findings with columns: title, status, location, date, category, hazard level, created by
3. WHEN the Excel export is generated, THE System SHALL download the file with filename format "findings-export-YYYY-MM-DD.xlsx"
4. THE finding detail page SHALL display an "Export to PDF" button next to other action buttons
5. WHEN the "Export to PDF" button is clicked, THE System SHALL generate a PDF document using jsPDF library containing all finding details: title, date, location, description, category, hazard level, status, created by, approved by
6. THE PDF export SHALL include all uploaded photos embedded in the document with appropriate sizing
7. WHEN the PDF export is generated, THE System SHALL download the file with filename format "finding-{id}-{title}-YYYY-MM-DD.pdf"
8. THE Excel export SHALL apply filters if any status filter is active on the findings list page
9. WHEN export generation fails, THE System SHALL display an error toast "Gagal membuat export file"
10. THE System SHALL display a loading spinner on the export button WHILE generating the export file
11. THE PDF export SHALL include company logo and header with title "SMK3 Finding Report"
12. THE Excel export SHALL use proper formatting with header row in bold and alternating row colors for readability

### Requirement 14: Role-Based Access Control

**User Story:** As a system administrator, I want different user roles with specific permissions, so that users can only access features appropriate to their responsibilities.

#### Acceptance Criteria

1. THE Auth_System SHALL include user role in the JWT token payload after successful login
2. THE System SHALL implement 3 user roles with different permissions: "user" (can create findings and view own findings), "supervisor" (can view all findings in department, approve/reject findings, assign corrective actions), "admin" (full access to all features, manage users, view audit logs)
3. WHEN a user with role "user" submits a finding, THE System SHALL set finding status to "OPEN" and create a notification for supervisors in the same department
4. WHEN a user with role "user" tries to approve a finding, THE System SHALL hide the Approve/Reject buttons and deny API requests with 403 Forbidden
5. WHEN a user with role "supervisor" or "admin" approves a finding, THE System SHALL update status from "OPEN" to "INPG" and record approvedBy and approvedById
6. THE Backend_API SHALL implement RBAC_Middleware that validates user role before processing requests to protected endpoints
7. THE Backend_API endpoints SHALL require role "supervisor" or "admin" for: PATCH /api/smk3-data/:id/status (approve/reject), GET /api/smk3-data (view all findings)
8. THE Backend_API endpoints SHALL require role "admin" for: GET /api/users (list users), POST /api/users (create user), DELETE /api/users/:id (delete user), GET /api/audit-logs (view logs)
9. WHEN a user without required role tries to access a protected endpoint, THE Backend_API SHALL return 403 Forbidden with error message "Insufficient permissions"
10. THE Frontend SHALL hide UI elements based on user role: "Approve/Reject" buttons hidden for role "user", "Manage Users" menu hidden for non-admin
11. THE System SHALL display user's current role in the navigation header next to the user's name
12. WHEN a supervisor views findings list, THE System SHALL filter to show only findings from their department by default
13. THE System SHALL allow admins to view findings from all departments without department filter

### Requirement 15: React Native Mobile App

**User Story:** As a field inspector, I want a mobile app to create findings with instant photo capture, so that I can record safety issues on-site using my smartphone.

#### Acceptance Criteria

1. THE System SHALL provide a React Native mobile application that works on Android and iOS devices
2. THE Mobile_App SHALL share TypeScript type definitions and API client code with the web frontend
3. THE Mobile_App SHALL implement authentication using the same Backend_API endpoint "/api/auth/login" with JWT token storage in AsyncStorage
4. THE Mobile_App SHALL provide screens for: Login, Dashboard, Finding List, Create Finding, Finding Detail, Notifications
5. THE Mobile_App dashboard SHALL display the same statistics cards as the web dashboard: total findings, open findings, closed findings
6. THE Mobile_App create finding form SHALL integrate with device camera using react-native-camera or expo-camera for instant photo capture
7. WHEN the "Take Photo" button is clicked, THE Mobile_App SHALL open the device camera and allow user to capture a photo
8. WHEN a photo is captured, THE Mobile_App SHALL display a preview thumbnail and allow user to retake or confirm the photo
9. THE Mobile_App SHALL implement offline mode using AsyncStorage to cache findings list and allow viewing when network is unavailable
10. WHEN the device regains network connectivity, THE Mobile_App SHALL sync any pending changes to the Backend_API
11. THE Mobile_App SHALL implement push notifications for approval workflow using Firebase Cloud Messaging (FCM) for Android and Apple Push Notification Service (APNS) for iOS
12. WHEN a finding requires approval, THE System SHALL send a push notification to supervisor's mobile device with title "New Finding Requires Approval"
13. THE Mobile_App SHALL use React Native Paper or NativeBase UI library for consistent, touch-optimized components
14. THE Mobile_App SHALL handle loading states, error messages, and empty states consistent with the web application
15. THE Mobile_App SHALL allow users to logout and clear AsyncStorage including cached data and JWT token

### Requirement 16: Notification System for Approval Workflow

**User Story:** As a supervisor, I want to receive in-app notifications when findings require my approval, so that I can respond promptly to safety issues.

#### Acceptance Criteria

1. THE Navigation SHALL display a bell icon with an unread notification count badge in the header
2. WHEN the bell icon is clicked, THE System SHALL display a dropdown list of recent notifications (max 10 notifications)
3. THE notification dropdown SHALL display notifications with: type icon, title, message, timestamp, and read/unread indicator
4. WHEN a regular user submits a new finding, THE System SHALL create a notification of type "finding_submitted" for the finding creator with message "Finding {title} telah disubmit"
5. WHEN a regular user submits a new finding, THE System SHALL create notifications of type "approval_required" for all supervisors in the same department with message "Finding baru memerlukan approval: {title}"
6. WHEN a supervisor approves a finding, THE System SHALL create a notification of type "finding_approved" for the finding creator with message "Finding {title} telah diapprove oleh {approverName}"
7. WHEN a supervisor rejects a finding, THE System SHALL create a notification of type "finding_rejected" for the finding creator with message "Finding {title} ditolak: {rejectionReason}"
8. WHEN a notification is clicked in the dropdown, THE System SHALL mark the notification as read (isRead = true) and navigate to the related finding detail page
9. THE notification dropdown SHALL provide a "Mark All as Read" button that marks all notifications as read
10. THE Backend_API SHALL provide GET "/api/notifications" endpoint that returns notifications for the authenticated user sorted by createdAt DESC
11. THE Backend_API SHALL provide PATCH "/api/notifications/:id/read" endpoint that marks a single notification as read
12. THE Backend_API SHALL provide PATCH "/api/notifications/read-all" endpoint that marks all user's notifications as read
13. THE System SHALL poll for new notifications every 30 seconds WHILE the user is on any authenticated page
14. WHEN new unread notifications are fetched, THE System SHALL update the notification count badge without page refresh
15. THE notification dropdown SHALL display an empty state message "Tidak ada notifikasi" WHEN there are no notifications
16. THE notification dropdown SHALL display relative timestamps for notifications (e.g., "5 menit yang lalu", "2 jam yang lalu", "kemarin")

