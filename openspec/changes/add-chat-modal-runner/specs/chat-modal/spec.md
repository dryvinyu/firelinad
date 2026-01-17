# chat-modal Specification

## Purpose
The chat-modal capability provides a conversational interface for operators on the agent runners page. It allows for contextual assistance and potentially triggering actions via natural language.

## ADDED Requirements
### Requirement: Fixed chat entry point
The agent runners page SHALL have a fixed button at the bottom-left corner to open the chat interface.

#### Scenario: User sees the chat button
- **WHEN** the user navigates to the agent runners page
- **THEN** a floating button with a chat icon is visible at the bottom-left of the viewport

### Requirement: Modal-based chat interface
Clicking the chat button SHALL open a modal-based chat interface.

#### Scenario: User clicks the chat button
- **WHEN** the user clicks the floating chat button
- **THEN** a chat modal appears with an overlay

### Requirement: Message interaction
The chat interface SHALL allow users to input messages and display a history of interaction.

#### Scenario: User sends a message
- **WHEN** the user types a message in the chat input and presses Enter or clicks Send
- **THEN** the message is added to the chat history and a response is displayed

### Requirement: Visual consistency
The chat button and modal SHALL follow the existing "cyber" design system of the monad-base project.

#### Scenario: Visual style inspection
- **WHEN** the chat interface is rendered
- **THEN** it uses the project's color palette, typography (Inter/JetBrains Mono), and "scanline" or "cyber-grid" effects where appropriate
