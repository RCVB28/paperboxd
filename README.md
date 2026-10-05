#PaperBoxd

##A web-based book discovery and review platform where users can browse books and comics, search the library, rate and review titles, and save favorites — with a full admin interface for managing the catalog.

##Built as a final project for Hybrid Programming (CS404-Fuller).

#Features
##Email/password authentication with role-based access (User / Admin)
##Browse, search, and view detailed book/comic pages
##Star ratings and written reviews (one review per user per book)
##Favorites list per user
##User profile with review and favorite history
##Admin dashboard: add, edit, and delete books; moderate reviews
##Fully responsive, dark-mode-compatible UI

#Tech Stack
##Layer	Technology
##Frontend	Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Lucide React
##Backend	Next.js Server Actions
##Database	PostgreSQL + Prisma ORM
##Auth	Auth.js (NextAuth v5)
##Forms & Validation	React Hook Form + Zod

#Getting Started
##1. Clone and install
bash
git clone https://github.com/RCVB28/paperboxd.git
cd paperboxd
npm install

##2. Set up environment variables

Copy .env.example to .env and fill in:

DATABASE_URL=       # Pooled Postgres connection string (e.g. Neon)
DIRECT_URL=         # Direct (non-pooled) connection string, for migrations
AUTH_SECRET=        # Generate with: npx auth secret
AUTH_URL=http://localhost:3000

##3. Set up the database
bash
npx prisma generate
npx prisma db push

##4. Run the dev server
bash
npm run dev

#Visit http://localhost:3000.

#Project Structure
src/
├── app/                # Routes (App Router)
│   ├── admin/          # Admin-only pages
│   ├── books/          # Library / browse
│   ├── search/         # Book search
│   └── favorites/      # User's saved books
├── components/
│   ├── ui/             # Reusable primitives (Button, Card, Dialog, etc.)
│   ├── layout/         # Navbar, Footer
│   └── branding/       # Logo
├── features/
│   ├── auth/           # Auth components & actions
│   ├── books/          # Book components, actions, schemas
│   └── reviews/        # Review form, dialog, star rating
└── lib/                # Prisma client, Auth.js config, utils

#License
##Built for academic purposes as part of the Hybrid Programming course.
