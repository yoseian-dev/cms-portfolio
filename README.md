# CMS Portfolio

A small CMS portfolio project built for a frontend engineer job search in Japan.

This project is intended to show practical experience with Nuxt 4, Vue, TypeScript, Nuxt UI, Prisma 7, PostgreSQL, Vercel deployment, and the basic foundation of CMS development.

Live demo: https://yoseian.vercel.app

## Project Overview

This is a Nuxt 4 minimal application using the `app/` directory structure. The backend side currently focuses on database connectivity and CMS-ready data modeling with Prisma and PostgreSQL.

The current deployed version includes a health check API that verifies the database connection and returns record counts for the main CMS tables.

## Tech Stack

* Nuxt 4
* Vue
* TypeScript
* Nuxt UI
* Prisma 7
* `@prisma/adapter-pg`
* `pg`
* Neon PostgreSQL
* Vercel

## Features / Current Status

* Nuxt 4 minimal project setup
* `app/` directory structure
* Nuxt UI installed and configured
* Prisma 7 configured with generated client output under `app/generated/prisma`
* PostgreSQL connection through `@prisma/adapter-pg` and `pg`
* Neon PostgreSQL used as the database
* Prisma migration completed
* Seed data created
* `/api/health` endpoint implemented for database connection testing
* Deployed on Vercel

Current health check:

```text
https://yoseian.vercel.app/api/health
```

The endpoint currently returns database connection status and record counts for users, posts, and categories.

## Not Yet Implemented

* Public post list page
* Public post detail page
* Admin CRUD screens
* Login / authentication flow
* Markdown editor
* Image upload

## Planned Features

* Display published posts on the public website
* Show individual post detail pages by slug
* Add admin login
* Add post create, edit, delete functionality
* Add category management
* Support Markdown content rendering
* Improve README and project documentation
* Polish UI for portfolio presentation

## Database Models

The Prisma schema currently defines three main CMS models:

* `User`: represents an author or admin user. It stores email, optional name, password hash, and timestamps.
* `Category`: represents a post category with a unique slug.
* `Post`: represents CMS article data. It includes title, slug, excerpt, content, status, timestamps, author relation, and optional category relation.

The `Post` model also uses a `PostStatus` enum:

* `DRAFT`
* `PUBLISHED`

For security reasons, sensitive fields such as `passwordHash` should not be returned from public API endpoints.

## Environment Variables

Create a `.env` file in the project root and provide the database connection string:

```env
DATABASE_URL="your_neon_postgresql_connection_string"
```

Do not commit real database credentials.

## Local Development

Install dependencies:

```bash
npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev --name init
```

Seed the database:

```bash
npx prisma db seed
```

Start the development server:

```bash
npm run dev
```

The local app runs at:

```text
http://localhost:3000
```

Health check endpoint:

```text
http://localhost:3000/api/health
```

## Prisma Commands

Generate Prisma client:

```bash
npx prisma generate
```

Create and apply a development migration:

```bash
npx prisma migrate dev --name init
```

Run seed data:

```bash
npx prisma db seed
```

## Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment

This project is deployed on Vercel.

Production URL:

```text
https://yoseian.vercel.app
```

The Vercel environment must include `DATABASE_URL` so the server API can connect to Neon PostgreSQL.
