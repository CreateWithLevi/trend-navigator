# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run lint         # Run ESLint
npm run test         # Run tests once (Vitest)
npm run test:watch   # Run tests in watch mode
```

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite (SWC compiler)
- **Styling**: Tailwind CSS with custom CSS variables in `index.css`
- **UI Components**: shadcn/ui (components in `src/components/ui/`)
- **State**: React Context (`TicketContext`) + local component state
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Zod validation
- **Drag & Drop**: @dnd-kit
- **Maps**: react-simple-maps
- **Charts**: Recharts
- **Animations**: Framer Motion

## Architecture

This is a global event monitoring dashboard ("Trend Navigator" / "Opportunity Radar") that tracks market trends and opportunities. Users input their business domain, view events on an interactive world map, and convert prioritized actions into trackable tickets.

### Key Screens

- **DomainInputScreen**: Initial domain entry form
- **GlobalEventHeatmapScreen**: Main dashboard with map, filters, event details, and AI-prioritized actions
- **ActionBoardScreen**: Kanban board for managing action tickets

### Component Organization

```
src/
├── components/
│   ├── ui/              # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   ├── tickets/         # Kanban board components (ColumnContainer, TicketCard)
│   └── *.tsx            # Feature components (WorldMap, Header, filters, panels)
├── contexts/            # TicketContext for ticket state management
├── types/               # TypeScript types (event.ts, ticket.ts, prioritization.ts)
├── data/                # Mock data (mockEvents.ts)
├── utils/               # Utilities including mockPrioritization.ts
└── hooks/               # Custom React hooks
```

### Data Flow

1. Mock events loaded from `src/data/mockEvents.ts`
2. `mockPrioritization.ts` generates AI-style prioritized actions from events
3. `TicketContext` manages ticket CRUD operations and action-to-ticket conversion
4. All data is in-memory only (no backend/persistence)

### Path Alias

Use `@/*` to import from `src/*` (configured in tsconfig.json).

## Key Patterns

- **Functional components only** with hooks-based state
- **Container pattern**: Screen components orchestrate, feature components display
- **Custom context hook**: `useTickets()` for type-safe ticket context access
- **Form handling**: React Hook Form with Zod schemas in modal/form components
- **Styling**: Glass-panel effects, gradient text, category-based glow effects via Tailwind classes

## Testing

Tests use Vitest with React Testing Library. Test files are in `src/test/`.

```bash
npm run test              # Run all tests
npm run test:watch        # Watch mode
npx vitest path/to/test   # Run specific test file
```
