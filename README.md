# TenderDox

Enterprise RFP automation — frontend product experience.

## Stack
Next.js 15 · React 19 · TypeScript · TailwindCSS · shadcn/ui · Framer Motion · TanStack Table · Recharts · React Hook Form + Zod · Zustand · Sonner · React Dropzone · Lucide.

## Run
```bash
pnpm install   # or npm / bun / yarn
pnpm dev
```
Open http://localhost:3000

## Structure
- `app/` — App Router routes. `(auth)` and `(app)` are route groups.
- `components/ui/` — shadcn primitives.
- `components/{shell,dashboard,rfp,kb,charts,common}/` — feature components.
- `lib/` — mock data, utilities, stores.
- `types/` — shared TS types.

All data is mocked in `lib/mock.ts`. No backend.
