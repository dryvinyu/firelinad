# Change: Add chat modal to agent runners page

## Why
Operators need a way to interact with an AI assistant specifically within the context of agent runners to ask questions, get help with configurations, or trigger actions via natural language.

## What Changes
- Add a fixed floating button at the bottom-left of the `agentRunners` page.
- Implement a chat modal that opens when the button is clicked.
- The chat modal should support basic message interaction (input and display).
- Use Lucide icons for the button and chat interface.

## Impact
- Affected specs: new capability `chat-modal`
- Affected code: `app/agentRunners/index.tsx`, new components in `app/agentRunners/components/`
