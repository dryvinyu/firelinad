# Project Context

## Purpose
Monad Fireline is a safety management console for a protocol on the Monad network. it allows operators to monitor runner status, manage automated rule parameters, and execute manual emergency actions (like pausing pools or freezing oracles) to protect the protocol.

## Tech Stack
- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4, Framer Motion, Lucide React
- **State Management**: Zustand (for wallet and global state)
- **Blockchain**: ethers.js v6 (for wallet interaction and chain data)
- **Validation**: Zod
- **UI Components**: Radix UI (Primitives), Shadcn UI (patterns), Sonner (Toasts)
- **Linting/Formatting**: Biome

## Project Conventions

### Code Style
- **Linter/Formatter**: Biome (configured in `biome.json`)
- **Indentation**: 2 spaces
- **Semicolons**: Omitted (unless required)
- **Quotes**: Single quotes for JS/TS, double quotes for JSX/TSX
- **Imports**: Use `@/` alias for absolute imports from the project root
- **Naming**: 
  - Components: PascalCase (e.g., `ExecutionLog.tsx`)
  - Hooks: camelCase starting with `use` (e.g., `useWallet.ts`)
  - Files/Folders: camelCase or kebab-case as per standard Next.js patterns

### Architecture Patterns
- **Directory Structure**:
  - `app/`: Next.js pages and layouts (App Router)
  - `components/business/`: Complex, domain-specific components
  - `components/ui/`: Reusable, generic UI components
  - `lib/`: Shared utilities, hooks, and type definitions
  - `stores/`: State management (Zustand)
  - `openspec/`: Specification-driven development files
- **State Management**: Prefer local React state for component-specific logic and Zustand for shared global state (like wallet connections).

### Testing Strategy
- [TBD] - Currently focusing on specification-driven development via OpenSpec.

### Git Workflow
- **Branching**: Feature branches merged into `main` via PRs.
- **Commits**: Conventional Commits (enforced by `commitlint` and `husky`).
- **Pre-commit**: Biome check and format via `lint-staged`.

## Domain Context
- **Monad**: A high-performance Ethereum-compatible Layer 1 blockchain.
- **Runner**: An automated system that executes safety rules based on protocol state.
- **Manual Actions**: Emergency interventions available to protocol operators (pause, freeze, isolate, etc.).

## Important Constraints
- **Foreign Keys**: Omit foreign key constraints when generating SQL schemas [[memory:6679832]].
- **Environment**: Client-side heavy interactions for the console dashboard.

## External Dependencies
- Monad Network RPCs
- Browser Wallet (MetaMask, Rabby, etc.)
