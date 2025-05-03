# Quote Management System - Comprehensive Documentation

## Table of Contents
1. [Original System vs. Refactored System](#original-system-vs-refactored-system)
2. [Detailed Requirements Coverage](#detailed-requirements-coverage)
3. [Architecture Overview](#architecture-overview)
4. [File Structure](#file-structure)
5. [Database Design](#database-design)
6. [API Endpoints](#api-endpoints)
7. [Authentication & Authorization](#authentication--authorization)
8. [Error Handling](#error-handling)
9. [Validation](#validation)
10. [Versioning System](#versioning-system)
11. [Logging & Observability](#logging--observability)
12. [Running the Application](#running-the-application)
13. [Testing](#testing)
14. [Deployment](#deployment)
15. [Future Enhancements](#future-enhancements)

## Original System vs. Refactored System

### Original System
The original quote management system had several limitations:

- **Flat structure**: All logic was embedded directly in route handlers
- **In-memory storage**: Quotes were stored in a JavaScript array, lost on server restart
- **No versioning**: Quote updates overwrote previous data with no history
- **Hardcoded expiry**: 14-day expiry was hardcoded with no extension capability
- **Minimal validation**: Basic validation with no structured approach
- **No proper error handling**: Inconsistent error responses
- **No separation of concerns**: Business logic mixed with HTTP handling
- **Stub authentication**: Basic auth middleware with no real implementation
- **No production readiness**: Missing logging, observability, and proper configuration

### Refactored System
The refactored system addresses all these limitations with a production-ready implementation:

- **Clean architecture**: Proper separation between controllers, services, repositories, and models
- **MongoDB persistence**: Database-backed storage with Mongoose ODM
- **Comprehensive versioning**: Full audit trail of all quote changes
- **Configurable expiry**: Environment-based configuration with extension capability
- **Joi validation**: Structured validation with detailed error messages
- **Centralized error handling**: Consistent error responses with proper logging
- **Authentication middleware**: JWT-based authentication with role-based authorization
- **Production-ready features**: Logging, observability, configuration, and deployment options

## Detailed Requirements Coverage

### Business Requirements

#### 1. Quote Management Operations
**Requirement**: Buyers can save, retrieve, update, and delete quotes containing products, quantities, and notes.

**Implementation**:
- **File**: `src/controllers/quote.controller.js`
  - `createQuote()`: Creates new quotes with products and notes
  - `getAllQuotes()`: Retrieves all quotes for a buyer
  - `getQuoteById()`: Retrieves a specific quote
  - `updateQuote()`: Updates an existing quote
  - `deleteQuote()`: Soft deletes a quote

- **File**: `src/models/quote.model.js`
  - Defines the Quote schema with products array, notes, and other fields
  - ProductSchema includes productId, name, quantity, and price

- **File**: `src/routes/quote.routes.js`
  - Defines RESTful endpoints for all CRUD operations

**Status**: ✅ Fully implemented with proper validation and error handling

#### 2. Quote Expiry
**Requirement**: Quotes expire after 14 days unless extended.

**Implementation**:
- **File**: `src/models/quote.model.js`
  - `expiresAt` field tracks expiration date
  - `isExpired` virtual property checks if a quote is expired
  - `extendExpiry()` method allows extending the expiry date

- **File**: `src/.env`
  - `QUOTE_EXPIRY_DAYS=14` configurable expiry period

- **File**: `src/controllers/quote.controller.js`
  - `extendQuoteExpiry()` endpoint for extending quote expiry

- **File**: `src/services/quote.service.js`
  - Enforces maximum extension limit (90 days)
  - Prevents extending already expired quotes

**Status**: ✅ Fully implemented with configuration options and validation

#### 3. Versioning and Audit Trail
**Requirement**: All quote changes must be auditable (history must be kept).

**Implementation**:
- **File**: `src/models/quoteVersion.model.js`
  - Tracks all versions of a quote with version numbers
  - Records who made changes and why
  - Stores complete state at each version

- **File**: `src/repositories/quote.repository.js`
  - Creates a new version on each quote update
  - Links versions to the original quote

- **File**: `src/controllers/quote.controller.js`
  - `getQuoteVersionHistory()` endpoint to retrieve version history

**Status**: ✅ Fully implemented with comprehensive version tracking

#### 4. High Scale Readiness
**Requirement**: System must be ready for eventual high scale (high volume of users and data).

**Implementation**:
- **File**: `src/models/quote.model.js` and `src/models/quoteVersion.model.js`
  - Proper indexing for efficient queries
  - Optimized schema design

- **File**: `src/config/database.js`
  - Configurable database connection
  - Connection pooling for high throughput

- **File**: `src/index.js`
  - Error handling for unhandled rejections
  - Graceful shutdown

- **File**: `src/utils/errorHandler.js`
  - Centralized error handling for stability

**Status**: ✅ Implemented with scalability considerations

#### 5. Clean, Modular, Maintainable Code
**Requirement**: Code must be clean, modular, maintainable.

**Implementation**:
- **Directory Structure**: Organized by responsibility
  - `/controllers`: HTTP request handling
  - `/services`: Business logic
  - `/repositories`: Data access
  - `/models`: Data structure definitions
  - `/middlewares`: Cross-cutting concerns
  - `/validators`: Input validation
  - `/utils`: Utility functions
  - `/config`: Configuration

- **Code Style**:
  - Consistent error handling
  - Comprehensive comments
  - Clear function and variable naming
  - Single responsibility principle

**Status**: ✅ Implemented with clean architecture principles

### Technical Refactoring Requirements

#### 1. Clean Architecture
**Requirement**: Set up a clean architecture with separation between Controllers, Services, Repositories, and Models.

**Implementation**:
- **Controllers** (`src/controllers/quote.controller.js`):
  - Handle HTTP requests and responses
  - Parse request data
  - Call appropriate services
  - Format responses

- **Services** (`src/services/quote.service.js`):
  - Contain business logic
  - Orchestrate operations
  - Call repositories for data access
  - Enforce business rules

- **Repositories** (`src/repositories/quote.repository.js`):
  - Handle data access
  - Interact with database models
  - Abstract database operations

- **Models** (`src/models/quote.model.js`, `src/models/quoteVersion.model.js`):
  - Define data structures
  - Implement data validation
  - Define relationships

**Status**: ✅ Fully implemented with clear separation of concerns

#### 2. Database-backed Persistence
**Requirement**: Implement database-backed persistence (MongoDB).

**Implementation**:
- **File**: `src/config/database.js`
  - MongoDB connection setup
  - Error handling for connection issues

- **File**: `src/.env`
  - `MONGODB_URI` configuration

- **File**: `package.json`
  - Mongoose and related dependencies

- **File**: `src/models/quote.model.js` and `src/models/quoteVersion.model.js`
  - Mongoose schemas for data modeling

**Status**: ✅ Fully implemented with proper configuration

#### 3. Data Models
**Requirement**: Design proper data models for Quote, QuoteVersion/History.

**Implementation**:
- **File**: `src/models/quote.model.js`
  - Main Quote schema with all required fields
  - Embedded ProductSchema for product details
  - Virtual properties for derived data
  - Instance methods for operations
  - Static methods for queries
  - Indexes for performance

- **File**: `src/models/quoteVersion.model.js`
  - Version history schema
  - Relationship to parent quote
  - Version numbering
  - Change tracking

**Status**: ✅ Fully implemented with comprehensive schemas

#### 4. Validation
**Requirement**: Implement validation using a validation library like Joi.

**Implementation**:
- **File**: `src/validators/quote.validator.js`
  - Joi validation schemas for all operations
  - Detailed error messages
  - Validation middleware factory

- **File**: `src/routes/quote.routes.js`
  - Integration of validation middleware with routes

**Status**: ✅ Fully implemented with comprehensive validation

#### 5. Authentication Middleware
**Requirement**: Add basic authentication middleware.

**Implementation**:
- **File**: `src/middlewares/auth.middleware.js`
  - JWT verification
  - User extraction
  - Role-based authorization

- **File**: `src/routes/quote.routes.js`
  - Application of auth middleware to all routes

- **File**: `src/.env`
  - JWT configuration options

**Status**: ✅ Fully implemented with JWT-based authentication

#### 6. Error Handling
**Requirement**: Implement proper error handling.

**Implementation**:
- **File**: `src/utils/errorHandler.js`
  - Custom AppError class
  - Global error handler middleware
  - Environment-specific error responses
  - Integration with logging

- **File**: `src/index.js`
  - Application of error middleware
  - Handling of uncaught exceptions and unhandled rejections

**Status**: ✅ Fully implemented with centralized error handling

#### 7. Soft Deletion
**Requirement**: Implement soft deletion if appropriate.

**Implementation**:
- **File**: `src/models/quote.model.js`
  - `isDeleted` flag
  - `softDelete()` method
  - `findActive()` static method to filter deleted quotes

- **File**: `src/repositories/quote.repository.js`
  - Implementation of soft delete in repository layer

**Status**: ✅ Fully implemented with proper filtering

#### 8. Modularized Expiry Logic
**Requirement**: Modularize the expiry logic.

**Implementation**:
- **File**: `src/models/quote.model.js`
  - `expiresAt` field
  - `isExpired` virtual property
  - `extendExpiry()` method

- **File**: `src/services/quote.service.js`
  - Business rules for expiry extension

- **File**: `src/.env`
  - Configurable expiry period

**Status**: ✅ Fully implemented with configuration options

## Architecture Overview

The refactored Quote Management System follows a clean architecture pattern with clear separation of concerns:

```
Client Request → Routes → Controllers → Services → Repositories → Models → Database
                  ↑          ↑            ↑           ↑
                  |          |            |           |
              Validators  Middleware    Utils       Config
```

- **Routes**: Define API endpoints and apply middleware
- **Controllers**: Handle HTTP requests/responses
- **Services**: Implement business logic
- **Repositories**: Handle data access
- **Models**: Define data structures and validation
- **Middleware**: Handle cross-cutting concerns
- **Utils**: Provide utility functions
- **Config**: Manage application configuration

## File Structure

```
server/
├── src/
│   ├── config/
│   │   └── database.js         # Database configuration
│   ├── controllers/
│   │   └── quote.controller.js # Quote HTTP controllers
│   ├── middlewares/
│   │   └── auth.middleware.js  # Authentication middleware
│   ├── models/
│   │   ├── quote.model.js      # Quote data model
│   │   └── quoteVersion.model.js # Version history model
│   ├── repositories/
│   │   └── quote.repository.js # Data access layer
│   ├── routes/
│   │   └── quote.routes.js     # API routes
│   ├── services/
│   │   └── quote.service.js    # Business logic
│   ├── tests/
│   │   └── quote.test.js       # Unit/integration tests
│   ├── utils/
│   │   ├── errorHandler.js     # Error handling utilities
│   │   └── logger.js           # Logging utilities
│   ├── validators/
│   │   └── quote.validator.js  # Input validation
│   └── index.js                # Application entry point
├── .env                        # Environment variables
├── Dockerfile                  # Docker configuration
├── package.json                # Dependencies and scripts
└── README.md                   # Decision Making Document
```

## Database Design

### Quote Collection
- **_id**: ObjectId (Primary Key)
- **buyerId**: String (Indexed)
- **products**: Array of Product objects
  - **productId**: String
  - **name**: String
  - **quantity**: Number
  - **price**: Number
- **notes**: String
- **createdAt**: Date
- **updatedAt**: Date
- **expiresAt**: Date (Indexed)
- **isDeleted**: Boolean (Indexed)
- **currentVersionId**: ObjectId (Reference to QuoteVersion)

### QuoteVersion Collection
- **_id**: ObjectId (Primary Key)
- **quoteId**: ObjectId (Reference to Quote, Indexed)
- **versionNumber**: Number
- **products**: Array of Product objects
- **notes**: String
- **createdBy**: String
- **reason**: String
- **createdAt**: Date

## API Endpoints

### Quote Management
- **GET /api/quotes**
  - Get all quotes for the authenticated buyer
  - Protected by authentication

- **GET /api/quotes/:id**
  - Get a specific quote by ID
  - Protected by authentication

- **POST /api/quotes**
  - Create a new quote
  - Requires products array and optional notes
  - Protected by authentication
  - Validated with Joi

- **PUT /api/quotes/:id**
  - Update an existing quote
  - Requires products array and optional notes
  - Protected by authentication
  - Validated with Joi

- **DELETE /api/quotes/:id**
  - Soft delete a quote
  - Protected by authentication

### Version History
- **GET /api/quotes/:id/versions**
  - Get version history for a quote
  - Protected by authentication

### Quote Expiry
- **PATCH /api/quotes/:id/extend**
  - Extend the expiry date of a quote
  - Requires days parameter
  - Protected by authentication
  - Validated with Joi

## Authentication & Authorization

The system uses JWT (JSON Web Token) based authentication:

- Tokens are verified via the `authMiddleware` in `src/middlewares/auth.middleware.js`
- User information is extracted from the token and added to the request object
- Role-based authorization is implemented via the `restrictTo` middleware
- All quote endpoints are protected by authentication
- Environment variables control JWT secret and expiry

## Error Handling

The system implements a centralized error handling approach:

- Custom `AppError` class for operational errors
- Global error middleware in `src/utils/errorHandler.js`
- Environment-specific error responses:
  - Development: Detailed error information including stack traces
  - Production: Clean, user-friendly error messages
- Integration with the logging system
- Handling of common error types (validation, cast, JWT)

## Validation

Input validation is implemented using Joi:

- Validation schemas in `src/validators/quote.validator.js`
- Middleware factory for applying validation to routes
- Detailed error messages for validation failures
- Validation for:
  - Quote creation
  - Quote updates
  - Expiry extension

## Versioning System

The system implements a comprehensive versioning system:

- Each quote modification creates a new version
- Versions are stored in a separate collection
- Versions track:
  - Complete state at time of change
  - Who made the change
  - Reason for the change
  - Version number
  - Timestamp
- API endpoint for retrieving version history

## Logging & Observability

The system includes comprehensive logging and observability features:

- Winston logger for structured logging
- Morgan for HTTP request logging
- Log levels based on environment
- Error logging with stack traces
- Health check endpoint for monitoring
- Graceful handling of uncaught exceptions and unhandled rejections

## Running the Application

### Prerequisites
- Node.js (v14+)
- MongoDB (v4+)

### Installation
1. Clone the repository
2. Navigate to the server directory
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file based on the provided template
5. Start MongoDB

### Starting the Application
Development mode:
```
npm run dev
```

Production mode:
```
npm start
```

### Environment Variables
- `NODE_ENV`: Environment (development/production)
- `PORT`: Server port (default: 3001)
- `MONGODB_URI`: MongoDB connection string
- `JWT_SECRET`: Secret key for JWT signing
- `JWT_EXPIRY`: JWT token expiry time
- `QUOTE_EXPIRY_DAYS`: Default quote expiry period in days

## Testing

The application includes a test setup using Jest and Supertest:

- Unit tests for models and utilities
- Integration tests for API endpoints
- Test database configuration

To run tests:
```
npm test
```

## Deployment

### Docker Deployment
The application includes a Dockerfile for containerized deployment:

1. Build the Docker image:
   ```
   docker build -t quote-management-api .
   ```

2. Run the container:
   ```
   docker run -p 3001:3001 --env-file .env quote-management-api
   ```

### Production Considerations
- Set `NODE_ENV=production`
- Use a strong, unique `JWT_SECRET`
- Configure proper MongoDB authentication
- Set up monitoring and alerting
- Implement proper backup strategies
- Consider using a process manager like PM2

## Future Enhancements

### Performance Optimization
- Implement caching for frequently accessed quotes
- Add pagination for large result sets
- Consider read replicas for scaling read operations

### Enhanced Security
- Add rate limiting to prevent abuse
- Implement more sophisticated authentication
- Add API key management for B2B integrations

### Scalability Improvements
- Implement message queues for asynchronous processing
- Consider event sourcing for complex operations
- Add database sharding for horizontal scaling

### Observability Enhancements
- Add distributed tracing
- Implement metrics collection
- Add real-time monitoring dashboards

### Business Features
- Implement quote approval workflows
- Add support for quote templates
- Implement quote analytics and reporting
