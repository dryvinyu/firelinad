## Context
The `agentRunners` page currently provides a dashboard for monitoring and launching runners. A chat interface will enhance operator productivity by allowing conversational interaction.

## Goals / Non-Goals
- Goals: Add a fixed entry point for chat on the `agentRunners` page.
- Goals: Implement a responsive chat modal that follows the "cyber" design system.
- Non-Goals: Integrating with a real LLM backend in this specific change (mock interaction for now).
- Non-Goals: Persistent chat history (for now).

## Decisions
- Use `framer-motion` for the modal entry/exit animations.
- Use `Lucide React` for icons (e.g., `MessageSquare` for the button).
- Position the button at `bottom-6 left-6` to avoid overlapping with common UI elements while remaining accessible.
- Create a reusable `ChatModal` component.

## Risks / Trade-offs
- Floating button might block some minor parts of the UI on small screens; we should ensure it's small enough.

## Migration Plan
1. Create `ChatButton` and `ChatModal` components.
2. Integrate `ChatButton` into `app/agentRunners/index.tsx`.
3. Implement basic state to open/close the modal.

## Open Questions
- Should the chat modal be persistent across page navigations? (Decided: No, scoped to `agentRunners` for now).
- What's the mock response logic for the chat?
