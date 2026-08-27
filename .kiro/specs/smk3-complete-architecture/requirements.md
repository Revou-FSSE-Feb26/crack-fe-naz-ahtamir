# Requirements Document

**System Name:** SMK3 Full Enterprise System

## Introduction

This document specifies the comprehensive requirements for the SMK3 (Sistem Manajemen Keselamatan dan Kesehatan Kerja) Full Enterprise System, a complete Occupational Health & Safety management platform for PT. QMB New Energy Materials Nickel Smelter. The system is a **full-scale enterprise solution** encompassing 8 integrated operational modules with 40-50 relational database tables, supporting end-to-end safety management from hazard identification through risk assessment, incident management, inspection execution, training administration, occupational health monitoring, meeting coordination, and comprehensive performance analytics.

The system manages the complete lifecycle of occupational safety operations including: master data management (employees, departments, locations, job positions, hazard libraries), incident reporting and investigation with root cause analysis, inspection planning and execution with corrective action tracking, hazard identification and risk assessment (HIRADC methodology), training program management with certification tracking, occupational health surveillance, K3 committee meetings and worker communication, KPI monitoring and trend analysis, and full audit trail compliance reporting.

The system addresses critical enterprise requirements including: comprehensive relational database schema with 40-50 normalized tables, RESTful API architecture with module-specific endpoints, role-based access control with approval workflows, mobile-first responsive design for field data collection, complex relational data flows linking incidents to hazards to risk assessments to corrective actions to inspection plans, automated notification and reminder systems, export capabilities (PDF/Excel) for all modules, phased implementation strategy prioritizing foundation then core modules then enhanced features, and scalability for 1000+ concurrent users with 100000+ records.

## Glossary

- **SMK3_System**: The complete Full Enterprise Occupational Health & Safety Management System with 8 integrated modules
- **Database_Schema**: PostgreSQL relational database with 40-50 normalized tables and JSONB columns for dynamic fields
- **API_Layer**: NestJS REST API backend on port 3001 with module-specific endpoints
- **Frontend_Layer**: Next.js 16 application on port 3000 with TypeScript and Tailwind CSS v4
- **Module**: One of 8 major functional areas (Incident, Inspection, Risk Assessment, Training, Health, Meeting, Performance, Master Data)
- **Element**: Top-level SMK3 category (e.g., Element 7: Monitoring)
- **Sub_Element**: Second-level category (e.g., 7.1: Inspection)
- **Sub_Sub_Element**: Specific inspection type with unique identifier (e.g., 7.1.1-inspeksi-ketidaksesuaian)
- **Finding**: A recorded safety issue with lifecycle OPEN → INPG → CLSD
- **Incident**: An unplanned event resulting in injury, property damage, or near miss
- **Hazard**: A potential source of harm identified during inspection or risk assessment
- **Risk_Assessment**: HIRADC (Hazard Identification, Risk Assessment, and Determining Control) methodology evaluation
- **Risk_Matrix**: 5x5 matrix mapping likelihood and severity to risk level (Low, Medium, High, Critical)
- **Control_Measure**: Mitigation action following hierarchy of controls (Elimination, Substitution, Engineering, Administrative, PPE)
- **Inspection**: Planned examination of workplace, equipment, or process with checklist
- **Corrective_Action**: Remedial task assigned to eliminate root cause of finding or incident
- **Training_Program**: Structured K3 education curriculum with sessions and certification
- **Certification**: Credential issued upon training completion with expiration and renewal tracking
- **Medical_Check_Up**: Periodic occupational health examination with results and recommendations
- **Health_Record**: Employee medical history relevant to occupational exposures
- **K3_Meeting**: Safety committee meeting with agenda, participants, minutes, and action items
- **Announcement**: Official K3 communication broadcast to employees
- **Suggestion**: Worker-submitted safety improvement idea with review workflow
- **KPI**: Key Performance Indicator measuring safety performance (LTIFR, incident rate, inspection completion)
- **Master_Data**: Reference data including employees, departments, locations, areas, job positions, hazard categories
- **Employee**: Worker with role, department, location, job position, certifications, and health records
- **Department**: Organizational unit (Production, Maintenance, HSE, Engineering, HR)
- **Location**: Physical site or facility (Plant 1, Plant 2, Warehouse, Office)
- **Area**: Sub-location within facility (Furnace Area, Crushing Area, Loading Bay)
- **Job_Position**: Role definition with associated hazard exposures and required certifications
- **Hazard_Library**: Standardized catalog of known hazards with default risk ratings and controls
- **Regulation**: External compliance requirement (Government regulation, ISO 45001, company policy)
- **JSONB_Data**: PostgreSQL JSONB column storing flexible dynamic fields
- **Type_Definition**: TypeScript interface ensuring compile-time type safety
- **Validation_Layer**: Input validation rules enforced at API and frontend boundaries
- **Authentication_Service**: NextAuth.js JWT-based authentication system
- **File_Storage**: Local filesystem storage for uploaded documents and photos
- **Role**: User permission level (admin, supervisor, hse_officer, user)
- **Workflow_State**: Status in approval process with allowed transitions
- **Notification_Service**: Automated email/SMS alerts for reminders and status changes
- **Audit_Trail**: Timestamped record of all create, update, and delete operations
- **ERD**: Entity Relationship Diagram documenting all 40-50 tables and relationships
- **API_Specification**: OpenAPI-compatible documentation of all REST endpoints
- **Workflow_Definition**: State machine diagram defining lifecycle transitions for each module
- **Component_Library**: Reusable React components following consistent patterns
- **Error_Handler**: Centralized error handling and logging mechanism
- **Test_Suite**: Automated test coverage for unit, integration, and end-to-end testing
- **Parser**: Code that converts structured text format into data objects
- **Pretty_Printer**: Code that formats data objects back into human-readable text
- **Round_Trip_Property**: Testing property where parsing then printing then parsing yields equivalent object
- **Mobile_First**: Design approach prioritizing touch interfaces for field data collection
- **Phased_Implementation**: Delivery strategy with Priority 1 (Foundation), Priority 2 (Core Modules), Priority 3 (Enhanced Features)

## Requirements

### Requirement 1: Enterprise Database Schema Design & ERD Documentation

**User Story:** As a database administrator, I want a comprehensive relational database schema with 40-50 normalized tables covering all 8 operational modules, so that I can manage complex enterprise data relationships with referential integrity and optimal performance.

#### Acceptance Criteria

1. THE Database_Schema SHALL define Master Data tables: employees (id, name, email, idKaryawan, password, role, departmentId, locationId, jobPositionId, hireDate, status, createdAt, updatedAt), departments (id, name, code, managerId, parentDepartmentId, createdAt), locations (id, name, code, address, type, managerId, createdAt), areas (id, name, code, locationId, supervisorId, createdAt), job_positions (id, title, code, departmentId, hazardExposureLevel, requiredCertifications, createdAt)
2. THE Database_Schema SHALL define Hazard Library tables: hazard_categories (id, name, code, description, parentCategoryId, createdAt), hazard_libraries (id, name, categoryId, description, defaultLikelihood, defaultSeverity, defaultControls, regulationReferences, createdAt), regulations (id, name, code, issuingBody, effectiveDate, description, documentUrl, createdAt)
3. THE Database_Schema SHALL define Risk Assessment tables: hazards (id, hazardLibraryId, locationId, areaId, jobPositionId, identifiedBy, identifiedDate, status, createdAt), risk_assessments (id, hazardId, assessmentDate, assessedBy, likelihood, severity, riskLevel, riskScore, existingControls, createdAt), controls (id, riskAssessmentId, controlType, description, implementationDate, responsiblePersonId, effectivenessRating, verificationDate, createdAt)
4. THE Database_Schema SHALL define Inspection & Audit tables: inspection_schedules (id, name, frequency, locationId, areaId, responsiblePersonId, nextDueDate, status, createdAt), inspection_items (id, categoryId, description, complianceStandard, createdAt), inspection_checklists (id, scheduleId, templateName, items, createdBy, createdAt), inspections (id, scheduleId, checklistId, inspectionDate, inspectorId, locationId, areaId, status, completedAt, createdAt), inspection_results (id, inspectionId, itemId, result, observations, photos, createdAt), findings (id, inspectionId, incidentId, riskAssessmentId, title, description, severity, status, identifiedBy, identifiedDate, createdAt)
5. THE Database_Schema SHALL define Corrective Actions table: corrective_actions (id, findingId, incidentId, actionType, description, assignedTo, assignedBy, assignedDate, dueDate, completedDate, status, verificationBy, verificationDate, effectivenessRating, createdAt, updatedAt)
6. THE Database_Schema SHALL define Incident Management tables: incident_types (id, name, code, category, severity, reportingTimeframe, investigationRequired, createdAt), incident_severity (id, level, name, description, responseTime, notificationRequired, createdAt), incidents (id, incidentNumber, incidentTypeId, severityId, incidentDate, reportedDate, reportedBy, locationId, areaId, description, injuries, propertyDamage, environmentalImpact, status, createdAt), incident_investigations (id, incidentId, investigationDate, leadInvestigator, teamMembers, rootCauses, contributingFactors, findings, recommendations, completedDate, approvedBy, approvedDate, createdAt), incident_actions (id, incidentId, investigationId, correctiveActionId, createdAt)
7. THE Database_Schema SHALL define Training & Competence tables: training_programs (id, name, code, type, category, duration, validityPeriod, issuingBody, isMandatory, targetRoles, description, createdAt), training_sessions (id, programId, sessionDate, startTime, endTime, locationId, instructorId, capacity, registeredCount, status, createdAt), training_participants (id, sessionId, employeeId, attendanceStatus, assessmentScore, passStatus, certificateNumber, issueDate, expiryDate, createdAt), certifications (id, employeeId, programId, certificateNumber, issueDate, expiryDate, renewalReminderDate, status, verifiedBy, verifiedDate, documentUrl, createdAt)
8. THE Database_Schema SHALL define Occupational Health tables: medical_check_ups (id, employeeId, checkupDate, checkupType, facilityName, doctorName, bloodPressure, heartRate, visionTest, hearingTest, lungFunction, fitForDuty, restrictions, recommendations, nextCheckupDate, documentUrl, createdAt), health_records (id, employeeId, recordDate, recordType, diagnosis, treatment, exposureRelated, followUpRequired, followUpDate, recordedBy, createdAt), occupational_diseases (id, employeeId, diseaseType, diagnosisDate, relatedExposures, severity, treatmentPlan, workRestrictions, reportedToAuthority, reportDate, createdAt)
9. THE Database_Schema SHALL define Meeting & Communication tables: meetings (id, meetingType, title, meetingDate, startTime, endTime, locationId, organizerId, agenda, minutes, decisions, actionItems, nextMeetingDate, status, createdAt), meeting_participants (id, meetingId, employeeId, role, attendanceStatus, createdAt), announcements (id, title, content, category, priority, publishDate, expiryDate, targetRoles, targetDepartments, createdBy, viewCount, createdAt), suggestions (id, employeeId, title, description, category, submittedDate, reviewedBy, reviewedDate, reviewNotes, status, implementationDate, createdAt)
10. THE Database_Schema SHALL define Performance Monitoring tables: kpis (id, name, code, category, description, formula, targetValue, unit, frequency, dataSource, ownerId, createdAt), kpi_values (id, kpiId, periodStart, periodEnd, actualValue, targetValue, variance, status, calculatedDate, dataSource, notes, createdAt), reports (id, reportType, title, periodStart, periodEnd, generatedBy, generatedDate, parameters, format, fileUrl, status, createdAt)
11. THE Database_Schema SHALL define System tables: audit_logs (id, tableName, recordId, action, userId, userName, changes, ipAddress, userAgent, timestamp), system_settings (id, category, key, value, dataType, description, updatedBy, updatedAt), notifications (id, recipientId, notificationType, title, message, relatedTable, relatedRecordId, sentDate, readDate, status, createdAt)
12. THE Database_Schema SHALL create composite indexes: (employees.departmentId, employees.status), (hazards.locationId, hazards.status), (inspections.scheduleId, inspections.status), (incidents.locationId, incidents.incidentDate), (corrective_actions.assignedTo, corrective_actions.status), (certifications.employeeId, certifications.expiryDate), (findings.status, findings.identifiedDate)
13. THE Database_Schema SHALL implement foreign key constraints with ON DELETE RESTRICT for master data references and ON DELETE CASCADE for dependent records
14. THE Database_Schema SHALL implement check constraints: (risk_assessments.likelihood BETWEEN 1 AND 5), (risk_assessments.severity BETWEEN 1 AND 5), (corrective_actions.dueDate >= corrective_actions.assignedDate), (training_sessions.endTime > training_sessions.startTime)
15. THE ERD SHALL document all 40-50 tables with visual diagram showing primary keys, foreign keys, indexes, and cardinality relationships (one-to-many, many-to-many) in separate module-specific diagrams and one comprehensive system diagram

### Requirement 2: Comprehensive API Specification for All 8 Modules

**User Story:** As a frontend developer, I want well-documented RESTful API endpoints for all 8 operational modules with clear request/response schemas, so that I can integrate each module predictably with consistent error handling.

#### Acceptance Criteria

1. THE API_Layer SHALL expose Master Data endpoints: GET/POST/PUT/DELETE /api/employees, /api/departments, /api/locations, /api/areas, /api/job-positions, /api/hazard-categories, /api/hazard-libraries, /api/regulations with query filters for search, department, location, status
2. THE API_Layer SHALL expose Risk Assessment endpoints: GET/POST/PUT/DELETE /api/hazards, /api/risk-assessments, /api/controls with query filters for locationId, areaId, status, riskLevel, assessmentDateFrom, assessmentDateTo
3. THE API_Layer SHALL expose Inspection & Audit endpoints: GET/POST/PUT/DELETE /api/inspection-schedules, /api/inspection-checklists, /api/inspections, /api/inspection-results, /api/findings with query filters for scheduleId, status, inspectorId, locationId, dueDateFrom, dueDateTo
4. THE API_Layer SHALL expose Corrective Action endpoints: GET/POST/PUT/PATCH /api/corrective-actions with query filters for assignedTo, status, dueDate, findingId, incidentId and PATCH action for status transitions (assign, complete, verify, reject)
5. THE API_Layer SHALL expose Incident Management endpoints: GET/POST/PUT/DELETE /api/incident-types, /api/incidents, /api/incident-investigations with query filters for incidentTypeId, severityId, status, locationId, incidentDateFrom, incidentDateTo, reportedBy
6. THE API_Layer SHALL expose Training & Competence endpoints: GET/POST/PUT/DELETE /api/training-programs, /api/training-sessions, /api/training-participants, /api/certifications with query filters for programId, employeeId, status, expiryDateFrom, expiryDateTo, isExpiringSoon (30 days)
7. THE API_Layer SHALL expose Occupational Health endpoints: GET/POST/PUT/DELETE /api/medical-check-ups, /api/health-records, /api/occupational-diseases with query filters for employeeId, checkupType, fitForDuty, nextCheckupDateFrom, nextCheckupDateTo
8. THE API_Layer SHALL expose Meeting & Communication endpoints: GET/POST/PUT/DELETE /api/meetings, /api/meeting-participants, /api/announcements, /api/suggestions with query filters for meetingType, meetingDateFrom, meetingDateTo, organizerId, category, status
9. THE API_Layer SHALL expose Performance Monitoring endpoints: GET/POST/PUT /api/kpis, /api/kpi-values, /api/reports with query filters for category, periodStart, periodEnd, ownerId and GET /api/kpis/{id}/trend for time-series data
10. THE API_Layer SHALL expose System endpoints: GET /api/audit-logs, GET /api/notifications, PATCH /api/notifications/{id}/read, GET /api/system-settings, PUT /api/system-settings with appropriate admin-only access controls
11. THE API_Layer SHALL implement pagination for all list endpoints with query parameters: page (default 1), limit (default 50, max 100), sortBy, sortOrder (asc|desc)
12. THE API_Layer SHALL implement search functionality with query parameter: search (full-text search across relevant text fields)
13. THE API_Layer SHALL return consistent response format for all endpoints: { success: boolean, data: T | T[], pagination?: { page, limit, total, totalPages }, error?: { code, message, field, details }, timestamp: ISO8601 }
14. WHEN an API request fails validation, THE API_Layer SHALL return HTTP 400 with JSON error object containing field-specific messages array
15. WHEN an API request is unauthorized, THE API_Layer SHALL return HTTP 401 with JSON error object
16. WHEN an API request lacks required permissions, THE API_Layer SHALL return HTTP 403 with JSON error object including required role
17. WHEN an API request references nonexistent resource, THE API_Layer SHALL return HTTP 404 with JSON error object including resource type and ID
18. WHEN an API request causes server error, THE API_Layer SHALL return HTTP 500 with JSON error object and log stack trace
19. THE API_Specification SHALL document all endpoints in OpenAPI 3.0 format with request schemas, response schemas, status codes, query parameters, and examples for each module
20. THE API_Specification SHALL include authentication requirements (Bearer JWT token) and required roles for each endpoint

### Requirement 3: Frontend Component Library & Wireframe Patterns

**User Story:** As a frontend developer, I want standardized CRUD page layouts and reusable components, so that I can build consistent user interfaces efficiently across all SMK3 modules.

#### Acceptance Criteria

1. THE Component_Library SHALL provide a DataTable component with props: columns, data, onRowClick, loading, empty state
2. THE Component_Library SHALL provide a FormPanel component with props: mode (new|edit|detail), fields, values, onChange, onSubmit, onCancel
3. THE Component_Library SHALL provide a StatusBadge component with props: status, variant (OPEN|INPG|CLSD)
4. THE Component_Library SHALL provide a LevelBadge component with props: level, variant (Low|Medium|High|Critical)
5. THE Component_Library SHALL provide a FileUpload component with props: accept, maxSize, onUpload, preview
6. THE Component_Library SHALL provide a SearchFilter component with props: placeholder, value, onChange, onClear
7. THE Component_Library SHALL provide a FilterButtonGroup component with props: options, selected, onChange
8. THE Component_Library SHALL provide a ConfirmDialog component with props: title, message, onConfirm, onCancel
9. THE Component_Library SHALL provide a KeyboardHints component displaying available keyboard shortcuts
10. THE Frontend_Layer SHALL implement a standard two-panel CRUD layout with 40% list panel and 60% detail/form panel on desktop
11. THE Frontend_Layer SHALL implement a single-panel mobile layout with navigation between list and detail views
12. THE Frontend_Layer SHALL implement keyboard shortcuts: N (new), Esc (close), ↑↓ (navigate), / (search focus), Ctrl+S (save)
13. THE Frontend_Layer SHALL implement responsive breakpoints at 768px (tablet) and 1024px (desktop)
14. THE Frontend_Layer SHALL implement loading skeletons for async data fetching
15. THE Frontend_Layer SHALL implement empty states with actionable call-to-action buttons

### Requirement 4: Type Safety & Validation Strategy

**User Story:** As a developer, I want comprehensive TypeScript types and validation rules, so that I can catch errors at compile-time and runtime, ensuring data integrity.

#### Acceptance Criteria

1. THE Type_Definition SHALL define SubSubElementData interface matching database schema exactly
2. THE Type_Definition SHALL define FormField interface with properties: name, label, type, required, placeholder, options, validation rules
3. THE Type_Definition SHALL define FindingStatus as literal union type "OPEN" | "INPG" | "CLSD"
4. THE Type_Definition SHALL define UserRole as literal union type "admin" | "supervisor" | "user"
5. THE Type_Definition SHALL define APIResponse<T> generic interface with properties: success, data, error, timestamp
6. THE Type_Definition SHALL define APIError interface with properties: code, message, field, details
7. THE Validation_Layer SHALL validate required fields at API boundary before database operations
8. THE Validation_Layer SHALL validate email format using RFC 5322 regex pattern
9. THE Validation_Layer SHALL validate file uploads with maximum size 5MB per file
10. THE Validation_Layer SHALL validate file uploads with allowed MIME types: image/*, application/pdf
11. THE Validation_Layer SHALL validate date fields in ISO 8601 format (YYYY-MM-DD)
12. THE Validation_Layer SHALL validate enum fields against allowed values from Type_Definition
13. THE Validation_Layer SHALL sanitize text inputs to prevent XSS attacks
14. THE Validation_Layer SHALL validate idKaryawan format as alphanumeric string 3-20 characters
15. WHEN validation fails, THE Validation_Layer SHALL return all field errors in single response

### Requirement 5: Enterprise Workflow State Machines & Complex Data Flows

**User Story:** As a safety officer, I want clear workflow transitions and data flow mappings across all 8 modules, so that I can understand how incidents link to hazards, risk assessments generate corrective actions, actions trigger inspections, and all data feeds into KPI dashboards.

#### Acceptance Criteria

1. THE Workflow_Definition SHALL document Finding Lifecycle workflow: OPEN (created) → INPG (submitted for action) → CLSD (verified complete) with role-based transitions
2. THE Workflow_Definition SHALL document Incident Lifecycle workflow: REPORTED → UNDER_INVESTIGATION → INVESTIGATION_COMPLETE → ACTIONS_ASSIGNED → ACTIONS_VERIFIED → CLOSED with investigation gate
3. THE Workflow_Definition SHALL document Corrective Action Lifecycle workflow: ASSIGNED → IN_PROGRESS → COMPLETED → UNDER_VERIFICATION → VERIFIED → CLOSED with assignee and verifier roles
4. THE Workflow_Definition SHALL document Inspection Lifecycle workflow: SCHEDULED → IN_PROGRESS → COMPLETED → REVIEWED → CLOSED with automatic finding generation
5. THE Workflow_Definition SHALL document Risk Assessment Lifecycle workflow: IDENTIFIED → ASSESSED → CONTROLS_PLANNED → CONTROLS_IMPLEMENTED → VERIFIED → CLOSED with control effectiveness verification
6. THE Workflow_Definition SHALL document Training Session Lifecycle workflow: PLANNED → REGISTRATION_OPEN → REGISTRATION_CLOSED → CONDUCTED → ASSESSMENT_COMPLETE → CERTIFICATES_ISSUED
7. THE Workflow_Definition SHALL document Certification Lifecycle workflow: ACTIVE → EXPIRING_SOON (30 days before expiry) → EXPIRED → RENEWED with automatic notification triggers
8. THE Workflow_Definition SHALL document Suggestion Lifecycle workflow: SUBMITTED → UNDER_REVIEW → APPROVED → IMPLEMENTATION_PLANNED → IMPLEMENTED → CLOSED or REJECTED
9. THE Workflow_Definition SHALL document Complex Data Flow: Incident Detection → Root Cause Analysis → Hazard Identification → Risk Assessment → Control Definition → Corrective Action Assignment → Inspection Plan Creation → KPI Dashboard Update with diagram showing table relationships
10. THE Workflow_Definition SHALL document Training Flow: Employee Role Assignment → Required Certification Identification → Training Session Registration → Attendance Tracking → Assessment Completion → Certificate Issuance → Expiry Monitoring → Renewal Reminder with diagram showing table relationships
11. THE Workflow_Definition SHALL document Meeting Flow: Meeting Creation → Participant Invitation → Agenda Setting → Meeting Execution → Minutes Recording → Action Item Assignment (linked to Corrective Actions table) → Follow-up Tracking with diagram showing table relationships
12. WHEN an Incident is investigated and root cause identified, THE SMK3_System SHALL create or link Hazard record in hazards table
13. WHEN a Hazard is identified, THE SMK3_System SHALL trigger Risk Assessment creation in risk_assessments table
14. WHEN a Risk Assessment determines High or Critical risk level, THE SMK3_System SHALL automatically create Corrective Action with priority assignment
15. WHEN a Corrective Action is verified complete, THE SMK3_System SHALL optionally create Inspection Schedule for ongoing monitoring
16. WHEN an Inspection Result identifies non-conformance, THE SMK3_System SHALL create Finding record automatically
17. WHEN Finding, Incident, or Corrective Action status changes, THE SMK3_System SHALL recalculate relevant KPI values and update kpi_values table
18. WHEN a Training Session is completed, THE SMK3_System SHALL automatically create Certification records for participants with pass status
19. WHEN a Certification expiry date approaches within 30 days, THE SMK3_System SHALL create Notification record for employee and supervisor
20. WHEN a Meeting action item is created, THE SMK3_System SHALL create corresponding Corrective Action record with meeting reference

### Requirement 6: Enterprise Authentication & Role-Based Authorization

**User Story:** As a system administrator, I want comprehensive role-based access control with JWT authentication supporting multiple permission levels, so that I can secure sensitive operations across all 8 modules and enforce granular permission boundaries.

#### Acceptance Criteria

1. THE Authentication_Service SHALL generate JWT tokens with expiration 7 days for successful login
2. THE Authentication_Service SHALL hash passwords using bcrypt with salt rounds 10 before storage
3. THE Authentication_Service SHALL validate JWT tokens on every protected API request
4. THE Authentication_Service SHALL support roles: admin (full system access), hse_officer (HSE department management), supervisor (department oversight), user (basic employee access)
5. WHEN a user has role "user", THE SMK3_System SHALL allow read access to own records only (incidents, findings, training, health records)
6. WHEN a user has role "user", THE SMK3_System SHALL allow create access for suggestions, incident reports (as reporter), and own training registration
7. WHEN a user has role "supervisor", THE SMK3_System SHALL allow read access to all records in assigned department and location
8. WHEN a user has role "supervisor", THE SMK3_System SHALL allow approve access to corrective actions and findings within department
9. WHEN a user has role "supervisor", THE SMK3_System SHALL allow update access to meeting minutes and action items for meetings they organize
10. WHEN a user has role "hse_officer", THE SMK3_System SHALL allow full CRUD access to all operational modules: incidents, inspections, risk assessments, training, findings, corrective actions
11. WHEN a user has role "hse_officer", THE SMK3_System SHALL allow approve access for incident investigations and risk assessment closures
12. WHEN a user has role "hse_officer", THE SMK3_System SHALL allow create access for inspection schedules, training programs, and announcements
13. WHEN a user has role "admin", THE SMK3_System SHALL allow full CRUD access to all records including master data, system settings, and user management
14. WHEN a user has role "admin", THE SMK3_System SHALL allow access to audit logs and system configuration
15. WHEN an API request lacks valid JWT token, THE API_Layer SHALL return HTTP 401 Unauthorized with error message "Authentication required"
16. WHEN an API request JWT token is expired, THE API_Layer SHALL return HTTP 401 with error message "Token expired, please login again"
17. WHEN an API request lacks required role permission, THE API_Layer SHALL return HTTP 403 Forbidden with error message specifying required role
18. THE Authentication_Service SHALL enforce password minimum length 8 characters
19. THE Authentication_Service SHALL enforce password complexity: at least 1 uppercase, 1 lowercase, 1 digit
20. THE Authentication_Service SHALL implement rate limiting: maximum 5 failed login attempts per email per 15 minutes with temporary account lock

### Requirement 7: File Upload & Storage Management

**User Story:** As a safety officer, I want to upload photos and documents for findings, so that I can provide visual evidence and supporting documentation.

#### Acceptance Criteria

1. THE File_Storage SHALL store uploaded files in directory structure: public/uploads/smk3/{subSubElementId}/{timestamp}-{filename}
2. THE File_Storage SHALL generate unique filenames using timestamp prefix to prevent collisions
3. THE File_Storage SHALL sanitize filenames by replacing non-alphanumeric characters with underscores
4. THE File_Storage SHALL create directory structure recursively if not exists
5. WHEN a file upload exceeds 5MB, THE API_Layer SHALL reject with HTTP 400 and error message "File size exceeds 5MB limit"
6. WHEN a file upload has disallowed MIME type, THE API_Layer SHALL reject with HTTP 400 and error message "File type not allowed"
7. THE File_Storage SHALL store file metadata in database JSONB column: fieldName, fileName, fileUrl, fileSize, uploadedAt
8. THE File_Storage SHALL serve uploaded files via static file server at /uploads/* URL path
9. WHEN a finding is deleted, THE File_Storage SHALL retain files for audit purposes (soft delete)
10. THE Frontend_Layer SHALL display image previews for uploaded photos with max height 200px

### Requirement 8: Error Handling & Logging Strategy

**User Story:** As a system administrator, I want centralized error handling and comprehensive logging, so that I can diagnose issues quickly and maintain system health.

#### Acceptance Criteria

1. THE Error_Handler SHALL catch all unhandled exceptions at API layer and return HTTP 500 with generic error message
2. THE Error_Handler SHALL log full stack traces to server console for HTTP 500 errors
3. THE Error_Handler SHALL log API request details: method, path, query parameters, user ID, timestamp
4. THE Error_Handler SHALL log API response details: status code, response time, error messages
5. WHEN an API operation fails, THE Error_Handler SHALL return consistent error JSON format with properties: code, message, timestamp, requestId
6. THE Frontend_Layer SHALL display user-friendly error messages in toast notifications
7. THE Frontend_Layer SHALL display field-specific validation errors inline below form inputs
8. THE Frontend_Layer SHALL implement global error boundary to catch React component errors
9. WHEN Frontend_Layer encounters network error, THE Frontend_Layer SHALL display retry button with automatic exponential backoff
10. THE Error_Handler SHALL implement error categorization: validation_error, authentication_error, authorization_error, not_found_error, server_error

### Requirement 9: Testing Strategy & Coverage Requirements

**User Story:** As a developer, I want comprehensive automated tests with property-based testing for parsers and serializers, so that I can ensure system reliability and catch regressions early.

#### Acceptance Criteria

1. THE Test_Suite SHALL achieve minimum 80% code coverage for API_Layer business logic
2. THE Test_Suite SHALL achieve minimum 70% code coverage for Frontend_Layer components
3. THE Test_Suite SHALL implement unit tests for all validation functions with valid and invalid inputs
4. THE Test_Suite SHALL implement integration tests for all API endpoints with authentication scenarios
5. THE Test_Suite SHALL implement end-to-end tests for critical user flows: login, create finding, submit finding, approve finding
6. THE Test_Suite SHALL implement property-based tests for all parsers with 100 random inputs
7. THE Test_Suite SHALL implement property-based tests for all serializers with 100 random inputs
8. THE Test_Suite SHALL implement round-trip property tests for parser-printer pairs ensuring parse(print(x)) equals x
9. THE Test_Suite SHALL run automatically on git pre-commit hook
10. THE Test_Suite SHALL run automatically on CI/CD pipeline with test report generation
11. WHEN a test fails, THE Test_Suite SHALL provide clear failure message with input that caused failure
12. THE Test_Suite SHALL implement test fixtures for common data scenarios: typical findings, edge case inputs, boundary values
13. THE Test_Suite SHALL mock external dependencies (filesystem, database) in unit tests
14. THE Test_Suite SHALL use test database with cleanup between test runs for integration tests
15. THE Test_Suite SHALL measure and report test execution time with performance budget 60 seconds for full suite

### Requirement 10: JSON Configuration Parser & Pretty Printer

**User Story:** As a developer, I want to parse JSON configuration files into TypeScript objects and format them back, so that I can manage form field configurations programmatically with guaranteed round-trip integrity.

#### Acceptance Criteria

1. THE Parser SHALL parse JSON configuration files containing SubSubElementFormConfig objects
2. THE Parser SHALL validate JSON structure against SubSubElementFormConfig interface schema
3. WHEN a configuration file has invalid JSON syntax, THE Parser SHALL return descriptive error with line and column number
4. WHEN a configuration file has invalid schema, THE Parser SHALL return error listing missing required fields
5. THE Pretty_Printer SHALL format SubSubElementFormConfig objects into valid JSON with 2-space indentation
6. THE Pretty_Printer SHALL preserve field order: subSubElementId, fields
7. THE Pretty_Printer SHALL format arrays with one element per line when array length exceeds 3
8. THE Pretty_Printer SHALL escape special characters in string values
9. FOR ALL valid SubSubElementFormConfig objects, parsing then printing then parsing SHALL produce equivalent object (round-trip property)
10. THE Test_Suite SHALL implement property-based round-trip tests for Parser and Pretty_Printer with 100 random SubSubElementFormConfig inputs

### Requirement 11: Documentation & Knowledge Transfer

**User Story:** As a new developer, I want comprehensive technical documentation with architecture diagrams and code examples, so that I can onboard quickly and contribute effectively.

#### Acceptance Criteria

1. THE SMK3_System SHALL provide README.md with sections: Introduction, Features, Tech Stack, Installation, Development, Deployment
2. THE SMK3_System SHALL provide ARCHITECTURE.md with sections: System Overview, Component Diagram, Data Flow, Technology Choices
3. THE SMK3_System SHALL provide DATABASE.md with ERD diagram, table descriptions, index strategies, migration guide
4. THE SMK3_System SHALL provide API.md with OpenAPI specification, authentication guide, request/response examples, error codes
5. THE SMK3_System SHALL provide FRONTEND.md with component library documentation, wireframe patterns, state management, styling conventions
6. THE SMK3_System SHALL provide DEPLOYMENT.md with environment setup, Docker configuration, database migration steps, monitoring setup
7. THE SMK3_System SHALL provide TESTING.md with test strategy, running tests, writing new tests, coverage requirements
8. THE SMK3_System SHALL include inline code comments for complex business logic with minimum one comment per 10 lines
9. THE SMK3_System SHALL include JSDoc comments for all exported functions with parameter descriptions and return types
10. THE SMK3_System SHALL include Storybook documentation for all Component_Library components with usage examples and props table

### Requirement 12: Performance & Scalability

**User Story:** As a system administrator, I want the system to handle 1000 concurrent users and 100000 findings records efficiently, so that performance remains acceptable as usage grows.

#### Acceptance Criteria

1. WHEN Database_Schema contains 100000 records, THE API_Layer SHALL return GET /api/smk3-data filtered by subSubElementId within 500ms at 95th percentile
2. WHEN Database_Schema contains 100000 records, THE API_Layer SHALL return GET /api/smk3-data with pagination (50 records per page) within 200ms at 95th percentile
3. THE API_Layer SHALL implement response caching with 60 second TTL for frequently accessed data
4. THE API_Layer SHALL implement database query optimization using EXPLAIN ANALYZE for slow queries (>100ms)
5. THE Frontend_Layer SHALL implement virtual scrolling for lists exceeding 100 items
6. THE Frontend_Layer SHALL implement lazy loading for images below viewport fold
7. THE Frontend_Layer SHALL implement code splitting with dynamic imports for route components
8. THE Frontend_Layer SHALL achieve Lighthouse performance score minimum 90 for desktop
9. THE Frontend_Layer SHALL achieve Lighthouse performance score minimum 80 for mobile
10. THE Database_Schema SHALL implement connection pooling with maximum 20 connections

### Requirement 13: JSONB Flexible Schema Strategy

**User Story:** As a product manager, I want to add new form fields without requiring backend code changes, so that I can iterate quickly on user feedback and adapt to changing requirements.

#### Acceptance Criteria

1. THE Database_Schema SHALL store all dynamic form fields in JSONB column "data"
2. WHEN Frontend_Layer adds a new field to form configuration, THE API_Layer SHALL store the field in JSONB without validation changes
3. WHEN Frontend_Layer removes a field from form configuration, THE API_Layer SHALL ignore the field in existing records
4. WHEN Frontend_Layer renames a field in form configuration, THE Frontend_Layer SHALL handle backward compatibility by checking both old and new field names
5. THE JSONB_Data SHALL support nested objects with maximum depth 3 levels
6. THE JSONB_Data SHALL support arrays of strings and objects
7. THE API_Layer SHALL provide GET /api/smk3-data with JSONB field filtering using PostgreSQL JSONB operators
8. THE API_Layer SHALL index frequently queried JSONB fields using GIN index for performance
9. THE Frontend_Layer SHALL provide formConfigs.ts defining field metadata: name, label, type, validation rules
10. THE Frontend_Layer SHALL render form fields dynamically from formConfigs.ts without hardcoding field names in components

### Requirement 14: Mobile-First Design & Field Data Collection Optimization

**User Story:** As a field safety officer, I want to use the system on mobile devices with touch-friendly interfaces optimized for field data collection, so that I can record incidents, complete inspections, and capture photos on-site without returning to desktop.

#### Acceptance Criteria

1. THE Frontend_Layer SHALL implement responsive layout adapting to viewport width: 320px (mobile), 768px (tablet), 1024px (desktop)
2. THE Frontend_Layer SHALL increase touch target size to minimum 44x44 pixels for buttons on mobile
3. THE Frontend_Layer SHALL implement swipe gestures for mobile: swipe left to delete, swipe right to approve, pull down to refresh
4. THE Frontend_Layer SHALL implement pull-to-refresh gesture for data lists on mobile
5. THE Frontend_Layer SHALL implement bottom sheet UI pattern for forms on mobile instead of side panels for easier thumb reach
6. THE Frontend_Layer SHALL disable hover effects on touch devices to prevent sticky hover states
7. THE Frontend_Layer SHALL implement native file picker with camera access on mobile devices for instant photo capture during inspections
8. THE Frontend_Layer SHALL compress uploaded photos to maximum 1920px width before upload on mobile to reduce bandwidth consumption
9. THE Frontend_Layer SHALL implement offline support with service worker caching static assets and local storage for draft forms
10. THE Frontend_Layer SHALL display network status indicator when connection is lost and queue API requests for retry when online
11. THE Frontend_Layer SHALL prioritize mobile-first for Inspection Module (checklist execution), Incident Module (incident reporting), and Finding Module (hazard identification)
12. THE Frontend_Layer SHALL implement voice-to-text input for description fields on mobile to enable hands-free data entry
13. THE Frontend_Layer SHALL implement GPS location capture for incident and inspection records to automatically populate location fields
14. THE Frontend_Layer SHALL implement barcode/QR code scanning for equipment identification during inspections
15. THE Frontend_Layer SHALL implement offline checklist completion with background sync when connectivity restored

### Requirement 15: Audit Trail & Compliance Reporting

**User Story:** As a compliance officer, I want detailed audit logs of all system changes with tamper-proof timestamps, so that I can demonstrate regulatory compliance during audits.

#### Acceptance Criteria

1. THE Audit_Trail SHALL record CREATE operations with full record snapshot in JSONB format
2. THE Audit_Trail SHALL record UPDATE operations with before and after values in JSONB format showing field-level changes
3. THE Audit_Trail SHALL record DELETE operations with full record snapshot before deletion
4. THE Audit_Trail SHALL record user identification (userId, name, role) for all operations
5. THE Audit_Trail SHALL record timestamp in UTC timezone with microsecond precision
6. THE Audit_Trail SHALL record IP address and user agent for all operations
7. THE API_Layer SHALL provide GET /api/audit-logs with filtering by: tableName, recordId, userId, action, dateFrom, dateTo
8. THE API_Layer SHALL provide GET /api/audit-logs/{recordId}/history returning chronological list of all changes for a specific record
9. THE Frontend_Layer SHALL display audit history timeline for findings with expand/collapse details
10. THE Audit_Trail SHALL be immutable with no UPDATE or DELETE operations allowed on audit_logs table
11. THE Database_Schema SHALL implement trigger-based audit logging to ensure all database changes are captured
12. THE SMK3_System SHALL generate compliance reports in PDF format with audit log summaries for date ranges
13. THE SMK3_System SHALL generate CSV exports of audit logs for external analysis
14. THE Audit_Trail SHALL retain records for minimum 7 years for regulatory compliance
15. THE Audit_Trail SHALL implement table partitioning by year for performance optimization on large audit datasets

### Requirement 16: Master Data Management Module

**User Story:** As an HR administrator, I want to manage employee records, organizational structure, locations, and hazard libraries, so that I have accurate reference data for all operational modules.

#### Acceptance Criteria

1. THE Master_Data SHALL manage Employee records with fields: personal info (name, email, idKaryawan), organizational assignment (departmentId, locationId, jobPositionId), employment details (hireDate, status), and system access (role, password)
2. THE Master_Data SHALL manage Department records with hierarchical structure supporting parent-child relationships and assigned managers
3. THE Master_Data SHALL manage Location records with fields: name, code, address, type (plant, warehouse, office, field), managerId
4. THE Master_Data SHALL manage Area records as sub-locations within facilities with assigned supervisors
5. THE Master_Data SHALL manage Job Position records with associated hazard exposure levels and required certification lists
6. THE Master_Data SHALL manage Hazard Category records with hierarchical parent-child structure for organizing hazard libraries
7. THE Master_Data SHALL manage Hazard Library records with standardized hazard definitions, default risk ratings (likelihood, severity), default controls, and regulation references
8. THE Master_Data SHALL manage Regulation records with fields: name, code, issuing body, effective date, description, document URL
9. WHEN a Department is deleted, THE Master_Data SHALL prevent deletion if employees or sub-departments are assigned and return HTTP 400 error
10. WHEN an Employee is assigned to Job Position, THE Master_Data SHALL automatically identify required certifications based on job position definition
11. WHEN a Hazard Library entry is updated with new default risk rating, THE Master_Data SHALL optionally cascade update to existing unmodified risk assessments
12. THE Frontend_Layer SHALL provide hierarchical tree view for Department navigation with expand/collapse
13. THE Frontend_Layer SHALL provide autocomplete search for Employee, Department, and Location selectors
14. THE Frontend_Layer SHALL provide Hazard Library browser with filter by category, risk level, and regulation reference
15. THE API_Layer SHALL provide GET /api/employees/search with query parameter for autocomplete with minimum 2 characters

### Requirement 17: Incident Management Module

**User Story:** As a safety officer, I want to report incidents, conduct investigations, identify root causes, and assign corrective actions, so that I can prevent recurrence and maintain incident statistics.

#### Acceptance Criteria

1. THE Incident_Management SHALL create Incident records with fields: incidentNumber (auto-generated), incidentTypeId, severityId, incidentDate, reportedDate, reportedBy, locationId, areaId, description, injuries (count, severity), propertyDamage (estimated cost), environmentalImpact, status
2. THE Incident_Management SHALL support Incident Types with categories: injury, near miss, property damage, environmental, security, fire, chemical spill
3. THE Incident_Management SHALL support Incident Severity levels: minor, moderate, serious, major, catastrophic with defined response times and notification requirements
4. THE Incident_Management SHALL create Investigation records linked to incidents with fields: investigationDate, leadInvestigator, teamMembers (array of employee IDs), rootCauses (text array), contributingFactors, findings, recommendations, completedDate, approvedBy, approvedDate
5. THE Incident_Management SHALL link Investigation root causes to Hazard records creating bi-directional traceability
6. THE Incident_Management SHALL automatically create Corrective Action records from Investigation recommendations with assignment workflow
7. WHEN Incident severity is serious or higher, THE Incident_Management SHALL require Investigation record before incident can be closed
8. WHEN Incident is reported, THE Incident_Management SHALL send automatic notification to supervisor and HSE officer based on severity level
9. WHEN Investigation is completed, THE Incident_Management SHALL transition Incident status to INVESTIGATION_COMPLETE and trigger corrective action assignment
10. WHEN all related Corrective Actions are verified, THE Incident_Management SHALL allow Incident closure
11. THE Frontend_Layer SHALL provide incident reporting form with photo upload, witness information, and immediate action taken fields
12. THE Frontend_Layer SHALL provide investigation workspace with root cause analysis template (5 Whys, Fishbone diagram options)
13. THE Frontend_Layer SHALL display incident timeline showing: report → investigation → actions → verification → closure with dates and responsible persons
14. THE API_Layer SHALL provide GET /api/incidents/statistics with aggregations by type, severity, location, month for dashboard analytics
15. THE Incident_Management SHALL calculate incident rate metrics: TRIR (Total Recordable Incident Rate), LTIFR (Lost Time Injury Frequency Rate), and update kpi_values table

### Requirement 18: Inspection & Audit Module

**User Story:** As an HSE officer, I want to schedule inspections, execute checklists, record findings, and assign corrective actions, so that I can maintain compliance and identify hazards proactively.

#### Acceptance Criteria

1. THE Inspection_Module SHALL create Inspection Schedule records with fields: name, frequency (daily, weekly, monthly, quarterly, annual), locationId, areaId, responsiblePersonId, nextDueDate, status
2. THE Inspection_Module SHALL create Inspection Checklist templates with reusable inspection items grouped by categories
3. THE Inspection_Module SHALL create Inspection Checklist Item records with fields: categoryId, description, complianceStandard (reference to regulation), expectedEvidence
4. THE Inspection_Module SHALL create Inspection execution records linked to schedules with fields: checklistId, inspectionDate, inspectorId, locationId, areaId, status, completedAt
5. THE Inspection_Module SHALL create Inspection Result records for each checklist item with fields: result (pass, fail, NA, observation), observations (text), photos (array)
6. THE Inspection_Module SHALL automatically create Finding records when Inspection Result is "fail" with severity based on compliance standard
7. THE Inspection_Module SHALL automatically calculate next due date based on frequency when inspection is completed
8. WHEN Inspection Schedule next due date is within 7 days, THE Inspection_Module SHALL create Notification for responsible person
9. WHEN Inspection is overdue (current date > next due date), THE Inspection_Module SHALL mark schedule as overdue and escalate notification to supervisor
10. WHEN Finding is created from inspection, THE Inspection_Module SHALL automatically link finding to inspection and create Corrective Action with due date based on severity
11. THE Frontend_Layer SHALL provide mobile-optimized inspection execution interface with offline support
12. THE Frontend_Layer SHALL provide checklist progress indicator showing completed items count and percentage
13. THE Frontend_Layer SHALL provide bulk photo upload with automatic tagging to specific checklist items
14. THE API_Layer SHALL provide GET /api/inspection-schedules/overdue returning all overdue inspections with responsible person details
15. THE Inspection_Module SHALL generate inspection completion rate KPI and update kpi_values table monthly

### Requirement 19: Risk Assessment (HIRADC) Module

**User Story:** As a risk assessor, I want to identify hazards, assess risks using 5x5 matrix methodology, define controls following hierarchy of controls, and verify control effectiveness, so that I can reduce workplace risks systematically.

#### Acceptance Criteria

1. THE Risk_Assessment SHALL create Hazard records with fields: hazardLibraryId (optional link to library), locationId, areaId, jobPositionId, description, identifiedBy, identifiedDate, status
2. THE Risk_Assessment SHALL create Risk Assessment records linked to hazards with fields: assessmentDate, assessedBy, likelihood (1-5), severity (1-5), riskLevel (Low/Medium/High/Critical), riskScore (likelihood × severity), existingControls (text)
3. THE Risk_Assessment SHALL calculate risk level automatically: score 1-4 = Low, 5-9 = Medium, 10-15 = High, 16-25 = Critical
4. THE Risk_Assessment SHALL create Control records linked to risk assessments with fields: controlType (elimination, substitution, engineering, administrative, PPE), description, implementationDate, responsiblePersonId, effectivenessRating (1-5), verificationDate
5. THE Risk_Assessment SHALL enforce hierarchy of controls priority ordering: elimination first, PPE last
6. WHEN Risk Assessment determines High or Critical risk level, THE Risk_Assessment SHALL require minimum 2 control measures before closing assessment
7. WHEN Control is implemented, THE Risk_Assessment SHALL require effectiveness verification within 30 days and create notification reminder
8. WHEN Control effectiveness rating is below 3, THE Risk_Assessment SHALL create Corrective Action to improve control
9. WHEN all Controls are verified effective (rating >= 3), THE Risk_Assessment SHALL allow closure of risk assessment and update residual risk score
10. WHEN Risk Assessment is closed, THE Risk_Assessment SHALL optionally create Inspection Schedule for periodic control verification
11. THE Frontend_Layer SHALL provide 5x5 risk matrix visual selector for likelihood and severity with color-coded risk levels
12. THE Frontend_Layer SHALL provide hierarchy of controls template wizard guiding control selection in priority order
13. THE Frontend_Layer SHALL display hazard register view with filtering by location, risk level, control status, assessment age
14. THE API_Layer SHALL provide GET /api/risk-assessments/matrix returning count of assessments by risk level for heat map visualization
15. THE Risk_Assessment SHALL calculate high-risk count KPI and risk reduction rate KPI updating kpi_values table monthly

### Requirement 20: Training & Competence Module

**User Story:** As a training coordinator, I want to manage training programs, schedule sessions, track attendance, issue certifications, and monitor expiry dates, so that I ensure workforce competency compliance.

#### Acceptance Criteria

1. THE Training_Module SHALL create Training Program records with fields: name, code, type (safety induction, technical, regulatory, refresher), category, duration (hours), validityPeriod (months), issuingBody, isMandatory, targetRoles (array), description
2. THE Training_Module SHALL create Training Session records linked to programs with fields: sessionDate, startTime, endTime, locationId, instructorId, capacity, registeredCount, status (planned, registration open, full, conducted, cancelled)
3. THE Training_Module SHALL create Training Participant records linking sessions and employees with fields: attendanceStatus (registered, attended, absent, cancelled), assessmentScore, passStatus (pass, fail), certificateNumber, issueDate, expiryDate
4. THE Training_Module SHALL create Certification records for employees with fields: programId, certificateNumber (auto-generated), issueDate, expiryDate, renewalReminderDate (30 days before expiry), status (active, expired, revoked), documentUrl
5. WHEN Training Session reaches capacity, THE Training_Module SHALL automatically change status to "full" and prevent new registrations
6. WHEN Training Session is conducted, THE Training_Module SHALL allow instructor to mark attendance and enter assessment scores
7. WHEN Training Participant achieves pass status (score >= passing grade), THE Training_Module SHALL automatically issue Certification with validity period
8. WHEN Certification expiry date approaches within 30 days, THE Training_Module SHALL create Notification for employee and supervisor
9. WHEN Certification expires, THE Training_Module SHALL automatically change status to "expired" and flag employee record as non-compliant
10. WHEN Employee is assigned to Job Position with required certifications, THE Training_Module SHALL check employee certifications and create training enrollment recommendations if missing
11. THE Frontend_Layer SHALL provide training calendar view showing all scheduled sessions with registration status
12. THE Frontend_Layer SHALL provide employee training matrix showing required vs obtained certifications with expiry dates
13. THE Frontend_Layer SHALL provide training compliance dashboard showing percentage of employees with current certifications by department
14. THE API_Layer SHALL provide GET /api/certifications/expiring with query parameter days (default 30) returning certifications expiring within period
15. THE Training_Module SHALL calculate training compliance rate KPI and average training hours per employee KPI updating kpi_values table monthly

### Requirement 21: Occupational Health Module

**User Story:** As an occupational health nurse, I want to schedule medical check-ups, record health examination results, track fitness for duty status, and monitor occupational disease cases, so that I protect worker health and maintain medical surveillance.

#### Acceptance Criteria

1. THE Health_Module SHALL create Medical Check-Up records with fields: employeeId, checkupDate, checkupType (pre-employment, periodic, fitness-to-return, exit), facilityName, doctorName, vitalSigns (bloodPressure, heartRate), testResults (visionTest, hearingTest, lungFunction, bloodTest), fitForDuty (yes, no, restricted), restrictions (text), recommendations, nextCheckupDate, documentUrl
2. THE Health_Module SHALL create Health Record entries for medical events with fields: employeeId, recordDate, recordType (injury, illness, first aid, consultation), diagnosis, treatment, exposureRelated (boolean), followUpRequired, followUpDate, recordedBy
3. THE Health_Module SHALL create Occupational Disease records with fields: employeeId, diseaseType, diagnosisDate, relatedExposures (array of hazard references), severity, treatmentPlan, workRestrictions, reportedToAuthority, reportDate
4. WHEN Medical Check-Up determines employee is not fit for duty, THE Health_Module SHALL create notification to supervisor and HR with restrictions details
5. WHEN Medical Check-Up specifies next checkup date, THE Health_Module SHALL automatically create notification reminder 14 days before due date
6. WHEN Health Record indicates exposure-related illness, THE Health_Module SHALL suggest linking to Hazard record for root cause investigation
7. WHEN Occupational Disease is diagnosed, THE Health_Module SHALL require reporting to authority and create task for compliance officer
8. WHEN Employee has work restrictions, THE Health_Module SHALL flag employee record and display warning when assigning to high-risk tasks
9. WHEN Medical Check-Up is overdue by 30 days, THE Health_Module SHALL escalate notification to department manager and HSE officer
10. THE Frontend_Layer SHALL provide confidential medical records interface with restricted access to health personnel only
11. THE Frontend_Layer SHALL provide health surveillance dashboard showing checkup compliance rate by department and overdue checkups
12. THE Frontend_Layer SHALL provide occupational disease trend chart showing cases by type and exposure over time
13. THE API_Layer SHALL provide GET /api/medical-check-ups/due returning employees due for checkups within specified days with privacy controls
14. THE Health_Module SHALL enforce privacy controls: only health personnel and employee self can view detailed medical records, supervisors see only fitness status
15. THE Health_Module SHALL calculate medical checkup compliance rate KPI and occupational disease incidence rate KPI updating kpi_values table monthly

### Requirement 22: Meeting & Communication Module

**User Story:** As a K3 committee secretary, I want to schedule safety meetings, track attendance, record minutes and decisions, assign action items, and broadcast announcements, so that I facilitate effective safety communication.

#### Acceptance Criteria

1. THE Meeting_Module SHALL create Meeting records with fields: meetingType (K3 committee, toolbox talk, management review, emergency drill, investigation), title, meetingDate, startTime, endTime, locationId, organizerId, agenda (text), minutes (text), decisions (text array), actionItems (text array with assigned person), nextMeetingDate, status (scheduled, completed, cancelled)
2. THE Meeting_Module SHALL create Meeting Participant records linking meetings and employees with fields: role (chair, secretary, member, observer), attendanceStatus (invited, confirmed, attended, absent)
3. THE Meeting_Module SHALL create Announcement records with fields: title, content (rich text), category (safety alert, policy update, training notice, event), priority (low, normal, high, urgent), publishDate, expiryDate, targetRoles (array), targetDepartments (array), createdBy, viewCount
4. THE Meeting_Module SHALL create Suggestion records for worker safety input with fields: employeeId, title, description, category (hazard report, improvement idea, near miss, unsafe condition), submittedDate, reviewedBy, reviewedDate, reviewNotes, status (submitted, under review, approved, rejected, implemented), implementationDate
5. WHEN Meeting is created, THE Meeting_Module SHALL automatically invite participants based on meeting type default attendee list
6. WHEN Meeting minutes include action items, THE Meeting_Module SHALL automatically create Corrective Action records linked to meeting with assigned persons and due dates
7. WHEN Meeting is completed, THE Meeting_Module SHALL send minutes summary to all participants with action items highlighted
8. WHEN Announcement is published, THE Meeting_Module SHALL send notification to all employees matching target roles and departments
9. WHEN Announcement is marked as urgent priority, THE Meeting_Module SHALL send immediate push notification and email
10. WHEN Suggestion is submitted, THE Meeting_Module SHALL assign to HSE officer for review and create notification
11. WHEN Suggestion is approved, THE Meeting_Module SHALL create Corrective Action or Investigation based on suggestion category
12. THE Frontend_Layer SHALL provide meeting calendar view with color coding by meeting type
13. THE Frontend_Layer SHALL provide announcement board with pinned urgent announcements and read/unread status
14. THE Frontend_Layer SHALL provide suggestion submission form accessible to all employees with anonymous option
15. THE Meeting_Module SHALL calculate meeting attendance rate KPI and employee suggestion participation rate KPI updating kpi_values table monthly

### Requirement 23: Performance Monitoring Module

**User Story:** As an HSE manager, I want to track safety KPIs, visualize trends, compare against targets, generate automated reports, and analyze performance by department and location, so that I make data-driven safety decisions.

#### Acceptance Criteria

1. THE Performance_Module SHALL create KPI definition records with fields: name, code, category (lagging indicator, leading indicator), description, formula (text), targetValue, unit, frequency (daily, weekly, monthly, quarterly, annual), dataSource (manual, auto-calculated), ownerId
2. THE Performance_Module SHALL support standard safety KPIs: TRIR (Total Recordable Incident Rate), LTIFR (Lost Time Injury Frequency Rate), Incident Severity Rate, Near Miss Reporting Rate, Inspection Completion Rate, Corrective Action Closure Rate, Training Compliance Rate, High Risk Count, Risk Reduction Rate, Safety Meeting Attendance Rate
3. THE Performance_Module SHALL create KPI Value records with fields: kpiId, periodStart, periodEnd, actualValue, targetValue, variance (actualValue - targetValue), status (below target, on target, above target), calculatedDate, dataSource, notes
4. THE Performance_Module SHALL automatically calculate KPI values for auto-calculated KPIs on schedule frequency based on source data from operational modules
5. THE Performance_Module SHALL create Report definition records with fields: reportType (incident summary, inspection report, training report, risk register, KPI dashboard, compliance audit), title, periodStart, periodEnd, generatedBy, generatedDate, parameters (JSON), format (PDF, Excel, CSV), fileUrl, status
6. WHEN KPI actual value deviates from target by more than 20%, THE Performance_Module SHALL create notification for KPI owner and management
7. WHEN KPI value is entered or calculated, THE Performance_Module SHALL automatically determine status based on target comparison
8. WHEN Report is generated, THE Performance_Module SHALL aggregate data from relevant module tables based on report type and parameters
9. THE Performance_Module SHALL provide trend analysis calculating period-over-period change percentage and direction (improving, declining, stable)
10. THE Performance_Module SHALL provide benchmark comparison allowing comparison across departments, locations, and time periods
11. THE Frontend_Layer SHALL provide KPI dashboard with visual charts (line charts for trends, gauge charts for targets, bar charts for comparisons)
12. THE Frontend_Layer SHALL provide drill-down capability from KPI summary to underlying detailed records
13. THE Frontend_Layer SHALL provide report builder interface allowing custom date ranges, filters, and export formats
14. THE API_Layer SHALL provide GET /api/kpis/{id}/trend with query parameters: periodStart, periodEnd, groupBy (day, week, month) returning time-series data
15. THE Performance_Module SHALL generate scheduled reports automatically (weekly incident summary, monthly KPI report) and send to distribution list via email

### Requirement 24: Phased Implementation Strategy & Delivery Plan

**User Story:** As a project manager, I want a clear phased implementation roadmap with priority tiers and timeline estimates, so that I can plan resource allocation and deliver value incrementally.

#### Acceptance Criteria

1. THE Implementation_Strategy SHALL define Priority 1 (Foundation Phase) including: Database schema creation for all 40-50 tables, PostgreSQL setup with indexes and constraints, NestJS backend API framework setup, Authentication service with JWT and role-based access, Master Data Management module (employees, departments, locations, job positions), Audit Trail infrastructure, Base frontend layout and component library, API documentation framework
2. THE Implementation_Strategy SHALL define Priority 2 (Core Modules Phase) including: Incident Management module with investigation and actions, Inspection & Audit module with schedules and checklists, Risk Assessment (HIRADC) module with hazard register and controls, Training & Competence module with certification tracking, Basic notification system, File upload and storage, Basic reporting (PDF export)
3. THE Implementation_Strategy SHALL define Priority 3 (Enhanced Features Phase) including: Occupational Health module, Meeting & Communication module, Performance Monitoring module with KPI dashboard, Advanced analytics and trend visualization, Mobile app development (React Native), Advanced workflow automation, Email notification service, Scheduled report generation, Offline mode support, Integration APIs for external systems
4. THE Implementation_Strategy SHALL estimate Priority 1 duration as 8-10 weeks with deliverables: working database, authenticated API, master data CRUD interfaces, basic user management
5. THE Implementation_Strategy SHALL estimate Priority 2 duration as 12-16 weeks with deliverables: fully functional Incident, Inspection, Risk Assessment, and Training modules with complete workflows
6. THE Implementation_Strategy SHALL estimate Priority 3 duration as 8-12 weeks with deliverables: remaining modules, mobile app, advanced analytics, production deployment
7. THE Implementation_Strategy SHALL define milestone gates: Priority 1 completion requires successful database migration, API smoke tests passing, and admin user creation; Priority 2 completion requires end-to-end testing of all 4 core modules and user acceptance testing; Priority 3 completion requires performance testing at scale, security audit, and production deployment
8. THE Implementation_Strategy SHALL specify technology stack: PostgreSQL 15+ for database, NestJS for backend API, Next.js 16 for frontend, TypeScript for type safety, Tailwind CSS v4 for styling, NextAuth.js for authentication, React Native for mobile (Priority 3)
9. THE Implementation_Strategy SHALL define success criteria: Priority 1 success = 100% master data CRUD working; Priority 2 success = 90% core module workflows complete with <500ms API response time; Priority 3 success = 80% total test coverage, <2s page load time, support for 1000 concurrent users
10. THE Implementation_Strategy SHALL define rollout plan: Priority 1 = internal IT testing; Priority 2 = pilot deployment with HSE department (20 users) for 4 weeks; Priority 3 = phased rollout by department (Production → Maintenance → Engineering → All) over 8 weeks
11. THE Implementation_Strategy SHALL define training plan: Administrator training (2 days), Power user training for HSE officers (3 days), End user training by department (1 day), Train-the-trainer program for ongoing support
12. THE Implementation_Strategy SHALL define data migration strategy: Export existing MongoDB data to CSV, Transform and validate data against new schema, Incremental load by module during Priority 2 implementation, Parallel run period of 2 weeks before cutover
13. THE Implementation_Strategy SHALL define testing strategy: Unit tests for all services (80% coverage target), Integration tests for all API endpoints, End-to-end tests for critical user flows, Performance testing with JMeter simulating 1000 concurrent users, Security testing with OWASP Top 10 checklist, User acceptance testing with HSE department stakeholders
14. THE Implementation_Strategy SHALL define deployment architecture: Development environment on local/Docker, Staging environment on cloud VM with production-like data, Production environment with database replication, load balancer, and backup strategy
15. THE Implementation_Strategy SHALL define support model: Priority 1-2 = dedicated development team support; Priority 3 onward = transition to operations team with SLA (P1 incidents: 4 hour response, P2 incidents: 1 business day response, P3 requests: 3 business day response)

### Requirement 25: Automated Notification & Reminder System

**User Story:** As a system user, I want automated email and in-app notifications for important events, due dates, and status changes, so that I never miss critical safety tasks and deadlines.

#### Acceptance Criteria

1. THE Notification_Service SHALL create Notification records with fields: recipientId, notificationType, title, message, relatedTable, relatedRecordId, sentDate, readDate, status (pending, sent, read, failed), deliveryChannel (in-app, email, SMS)
2. THE Notification_Service SHALL support notification types: incident_reported, investigation_assigned, corrective_action_assigned, corrective_action_due, inspection_due, inspection_overdue, certification_expiring, certification_expired, medical_checkup_due, meeting_invitation, meeting_reminder, announcement_published, suggestion_reviewed, kpi_target_missed, workflow_approval_required
3. WHEN Incident is created with severity serious or higher, THE Notification_Service SHALL send immediate notification to HSE officer and department supervisor
4. WHEN Corrective Action is assigned, THE Notification_Service SHALL send notification to assignee with due date and priority
5. WHEN Corrective Action due date is within 3 days, THE Notification_Service SHALL send reminder notification to assignee and supervisor
6. WHEN Corrective Action is overdue, THE Notification_Service SHALL send escalation notification to department manager and HSE manager
7. WHEN Inspection Schedule next due date is within 7 days, THE Notification_Service SHALL send reminder notification to responsible person
8. WHEN Certification expiry date is within 30 days, THE Notification_Service SHALL send reminder notification to employee and training coordinator
9. WHEN Certification expires, THE Notification_Service SHALL send alert notification to employee, supervisor, and HR
10. WHEN Medical Check-Up is due within 14 days, THE Notification_Service SHALL send reminder notification to employee and health nurse
11. WHEN Meeting is scheduled, THE Notification_Service SHALL send invitation notification to all participants 48 hours before meeting
12. WHEN Announcement is published with high or urgent priority, THE Notification_Service SHALL send immediate notification to all target recipients
13. WHEN Suggestion is reviewed, THE Notification_Service SHALL send notification to submitter with review outcome
14. THE Notification_Service SHALL implement batching for non-urgent notifications sending daily digest email at configurable time
15. THE Notification_Service SHALL provide unread notification count in frontend header with dropdown list of recent notifications
16. THE Notification_Service SHALL provide notification preferences interface allowing users to enable/disable specific notification types and delivery channels
17. THE Frontend_Layer SHALL display in-app notification popup for critical notifications (incident alerts, urgent announcements) with sound alert
18. THE API_Layer SHALL provide GET /api/notifications with query parameters: status (unread, read, all), type, dateFrom, dateTo
19. THE API_Layer SHALL provide PATCH /api/notifications/{id}/read to mark notification as read
20. THE Notification_Service SHALL implement retry logic for failed email delivery with exponential backoff up to 3 attempts

### Requirement 26: Comprehensive Export & Reporting Capabilities

**User Story:** As an HSE manager, I want to export data and generate formatted reports in PDF and Excel for all modules, so that I can share information with management and regulatory authorities.

#### Acceptance Criteria

1. THE Export_Service SHALL provide PDF export for Incident Reports including: incident details, investigation findings, root cause analysis, photos, corrective actions, and timeline
2. THE Export_Service SHALL provide PDF export for Inspection Reports including: checklist items, results, findings, photos, responsible persons, and completion status
3. THE Export_Service SHALL provide PDF export for Risk Assessment Reports including: hazard register, risk matrix visualization, control measures, and effectiveness ratings
4. THE Export_Service SHALL provide PDF export for Training Reports including: program details, session attendance, assessment scores, certification list, and compliance statistics
5. THE Export_Service SHALL provide PDF export for Meeting Minutes including: agenda, attendees, discussions, decisions, action items with assignments
6. THE Export_Service SHALL provide Excel export for all list views with current filters applied including: incidents list, findings list, corrective actions list, inspections list, employees list, certifications list
7. THE Export_Service SHALL provide Excel export for KPI data with time-series values, targets, variances, and trend calculations
8. THE Export_Service SHALL provide CSV export for audit logs with all fields for external analysis
9. THE Export_Service SHALL provide Excel export for Hazard Register with risk scores, controls, and verification status
10. THE Export_Service SHALL provide PDF export for Compliance Audit Reports with checklist items, evidence, gaps, and recommendations
11. WHEN user initiates export, THE Export_Service SHALL generate file asynchronously and provide download link when ready
12. WHEN export file size exceeds 10MB, THE Export_Service SHALL compress to ZIP format before download
13. THE Export_Service SHALL apply company branding (logo, colors, footer) to all PDF reports
14. THE Export_Service SHALL include metadata in exported files: export date, exported by, date range, filters applied
15. THE Export_Service SHALL implement export permissions: users can export own data, supervisors can export department data, hse_officers and admins can export all data
16. THE Frontend_Layer SHALL provide export button on all list views with format selection dropdown (PDF, Excel, CSV)
17. THE Frontend_Layer SHALL provide report builder interface for custom reports with parameter selection: date range, location, department, status filters
18. THE API_Layer SHALL provide GET /api/reports/generate with body parameters: reportType, format, filters, dateRange returning job ID for async processing
19. THE API_Layer SHALL provide GET /api/reports/status/{jobId} returning generation progress and download URL when complete
20. THE Export_Service SHALL retain generated report files for 7 days before automatic deletion
