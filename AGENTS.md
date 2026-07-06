# AGENTS.md

## Project Overview

This is a Nuxt 4 CMS portfolio project for frontend job hunting in Japan.

## Tech Stack

- Nuxt 4
- Vue
- TypeScript
- Nuxt UI
- Prisma 7
- Neon PostgreSQL
- Vercel

## Project Structure

- `app/`: Nuxt app directory
- `server/api/`: Nuxt server API routes
- `server/utils/prisma.ts`: Prisma Client setup
- `prisma/schema.prisma`: Prisma schema
- `prisma/seed.ts`: seed data

## Prisma Notes

This project uses Prisma 7.
Do not instantiate PrismaClient without an adapter.
Use `@prisma/adapter-pg` and `pg`.

## Commands

- `npm run dev`
- `npm run build`
- `npx prisma generate`
- `npx prisma migrate dev`
- `npx prisma db seed`

## Rules

- Do not commit `.env`.
- Do not expose `passwordHash`.
- Do not return unnecessary fields from API routes.
- Do not modify unrelated files.
- Run `npm run build` after code changes when possible.