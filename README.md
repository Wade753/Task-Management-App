# 📌 Task Management App (SkillBrain Team Project)

> A collaborative **task management platform** built during the SkillBrain internship.  
> It enables users to create projects, assign tasks, and track progress in real time — powered by the **T3 stack** for end-to-end type safety.

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc)

---

## ✨ Features

- 🔑 **Authentication & Authorization** — secure login and protected routes  
- 📂 **Projects & Tasks** — create, assign, and manage tasks within projects  
- 👥 **Collaboration** — assign tasks to team members and track progress  
- 📊 **Real-time updates** — keep all users in sync when tasks change  
- 🎨 **Modern UI** — responsive interface built with **TailwindCSS + shadcn/ui**  

---

## 🛠 Tech Stack

**Frontend**  
- [Next.js](https://nextjs.org/) — React framework with SSR & routing  
- [TypeScript](https://www.typescriptlang.org/) — type-safe development  
- [TailwindCSS](https://tailwindcss.com/) — utility-first styling  
- [shadcn/ui](https://ui.shadcn.com/) — modern UI components  

**Backend**  
- [tRPC](https://trpc.io/) — type-safe APIs  
- [Node.js](https://nodejs.org/) — server runtime  

**Database**  
- [PostgreSQL](https://www.postgresql.org/) — relational DB  
- [Prisma ORM](https://www.prisma.io/) — type-safe database access  

**Deployment**  
- [Vercel](https://vercel.com/) (recommended)  

---

## 📂 Project Structure

```bash
/src
  /pages         # Next.js routes
  /components    # Reusable UI components (shadcn/ui + Tailwind)
  /server        # tRPC routers, context, and API logic
  /prisma        # Prisma schema and migrations


1. Clone the repository
git clone https://github.com/ToDy95/kind-of-wordpress-clone-v2.git
cd kind-of-wordpress-clone-v2

2. Install dependencies
npm install
# or
yarn install

3.Configure environment variables
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/taskapp
NEXTAUTH_SECRET=your-secret

4.Run Prisma migrations
npx prisma migrate dev

5.Start the development server
npm run dev
Visit: http://localhost:3000
