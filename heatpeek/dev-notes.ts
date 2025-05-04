/*
  Project: Heatpeek (SaaS)

  Description:
  A lightweight, privacy-focused heatmap analytics tool. Users can embed a small script on their site (heatpeek.js) to track click positions, which are sent to a backend and visualized as heatmaps in a dashboard.

  Tech Stack:
  - Next.js 14 (App Router)
  - Tailwind CSS
  - Shadcn
  - Supabase (Auth, DB, Edge Functions)
  - TypeScript

  MVP Features:
  - Landing page ()
  - Authentication (Supabase Auth, GitHub login)
  - Tracker script that logs clicks to an API
  - API route (`/api/track`) to receive events and store in Supabase
  - Dashboard to view projects and their heatmaps
  - Public JS script hosted at /heatpeek.js (for MVP, from public folder)

  Style:
  - Clean and modern

  You are:
  My assistant in building this SaaS fast. Help me scaffold code, improve DX, write clean and secure endpoints, and help me iterate quickly on frontend features. Also help optimize queries and component performance.

  Goals:
  - Build the MVP in less than 2 weeks
  - Have a working private beta with tracking + click visualizations
  - Monetize early with simple pricing

  Start by:
  Ensuring supabase is initialized, auth works, and tracking API is functional.
*/
