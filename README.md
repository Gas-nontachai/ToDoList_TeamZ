# ToDoList Team Z

ToDoList app built with Next.js (App Router), React 19, MUI, Tailwind CSS, and IndexedDB for local persistence.

## Demo

- https://todolist-nontachai.netlify.app/

## Features

- Create, read, update, delete tasks
- Mark task status (done / not done)
- Search tasks by name
- Sort tasks by due date
- Filter tasks by category
- Persist data in IndexedDB (client-side/offline friendly)

## Tech Stack

- Next.js `15.5.10`
- React `19`
- TypeScript `5`
- MUI `7`
- Tailwind CSS `4`
- `idb` for IndexedDB access

## Prerequisites

- Node.js `20` or later
- npm `10` or later

## Getting Started

```bash
git clone https://github.com/Gas-nontachai/Skuberg_Test_Frontend_ToDoList_Nontachai.git
cd Skuberg_Test_Frontend_ToDoList_Nontachai
npm install
npm run dev
```

Open http://localhost:3000

## Available Scripts

- `npm run dev` - Start development server (Turbopack)
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run Next.js lint
- `npm run lint:fix` - Run ESLint with auto-fix

## CI

GitHub Actions workflow is configured at `.github/workflows/ci.yml`:

- Trigger: push to `main`/`deploy` and pull requests
- Runtime: Node.js 20
- Steps: install (`npm ci`), lint, build

## Security Note

Next.js has been upgraded to `15.5.10` to include fixes for known vulnerabilities affecting older `15.x` versions.

## Project Structure

```text
src/app/            # Next.js app router pages/components
public/             # Static assets
.github/workflows/  # CI workflows
```
