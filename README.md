# Thmaina Content Management System (CMS)

## Overview

Thmaina is a modular Content Management System (CMS) project built with NestJS, designed to manage content, files, and programs efficiently using a microservices architecture. The project contains two main applications:

- **CMS**: The main content management service.
- **Discovery**: A service for content discovery and related features.

The project is structured for scalability, maintainability, and ease of extension.

## Key Features
- Modular architecture with shared code in the `shared` directory for reusability.
- Microservices-based for flexibility and scalability.
- File upload and management support.
- Easily extensible to add new services or modules.

## Requirements
- Node.js (v18 or higher recommended)
- PostgreSQL (or your preferred database)

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Configure environment variables:**
   - Copy `.env.example` to `.env` and update the database and other settings as needed.
3. **Run the services:**
   ```bash
   npm run start:dev
   ```

## Project Structure
- `apps/` : Main services (e.g., cms, discovery)
- `shared/` : Shared code (entities, database config, DTOs, etc.)
- `uploads/` : Directory for uploaded files

## API Documentation

After running the project, you can access the Swagger API documentation for each service at:

- **CMS Service:** [http://localhost:3001/api](http://localhost:3001/api)
- **Discovery Service:** [http://localhost:3002/api](http://localhost:3002/api)