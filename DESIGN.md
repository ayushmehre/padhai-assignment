# Design Document: AI-Tutor Interactable Slide System

This document outlines the architectural and design decisions for the AI-Tutor Interactable Slide System.

## Core Requirements & Scope

The system is designed as a Proof-of-Concept for an AI-Tutor Geometry Board. The minimum viable demo includes:

1.  A mocked backend (`mock-server/server.js`) that emits a scripted dialog of tutor actions.
2.  The **`POINT`** feature: A visual cursor moves to a specified element on the slide.
3.  Additional implemented features:
    - **`AUDIO`**: Plays tutor audio.
    - **`HIGHLIGHT`**: Highlights text or elements.

## Architectural Decisions

### Provider-Based Modular Architecture (New)

The application is structured around **domain-specific React providers**, each responsible for a single concern:

- **WebSocketProvider**: Manages the WebSocket connection, message buffering (ring buffer), and exposes connection status and send methods via `useWebSocketCtx`.
- **EmitProvider**: Manages the event bus (using `mitt`), exposing `on`, `off`, and `emit` via `useEmitCtx`.
- **AudioProvider**: Manages the `AudioContext` and audio initialization, exposing `audioCtx` and `initAudio` via `useAudioCtx`.
- **SessionProvider**: Manages session state (e.g., latency, `startSession`), exposing these via `useSessionCtx`.
- **AppProviders**: Composes all the above providers for easy use in your app entry point.

**Key Benefits:**

- Single Responsibility: Each provider manages only one domain.
- Testability: Providers can be tested in isolation.
- Scalability: Easy to add/replace providers as features grow.
- Performance: Providers only re-render consumers when their specific state changes.
- Edge Case Handling: Each provider handles its own edge cases (e.g., WebSocket reconnection, audio errors, buffer overflow).
- Separation of Concerns: UI components only consume the context(s) they need.

### 1. WebSocket Handling & Buffering

- **Centralized Handling**: WebSocket connection, message parsing, event emission, and reconnection logic are managed centrally within `src/providers/WebSocketProvider.jsx`.
- **Custom Hook**: The `src/hooks/useWebSocket.js` hook encapsulates the raw WebSocket setup and lifecycle management (connect, onopen, onclose, onerror, reconnect attempts with backoff).
- **Message Buffering**: A ring buffer (`src/hooks/useRingBuffer.js`, instantiated in `WebSocketProvider.jsx`) stores recent messages received from the WebSocket. This allows components that mount after certain events have already been emitted to "replay" these events and sync their state (e.g., a slide loading after initial tutor messages). The buffer size is configurable via `src/config/socket.js`.

### 2. State Management / Event Bus

- **Primary Event Bus**: `EmitProvider.jsx` utilizes the `mitt` library to create an event emitter. This emitter serves as the internal event bus for tutor-initiated events.
- **Context API**: React's Context API is used via domain-specific providers (`WebSocketProvider`, `EmitProvider`, `AudioProvider`, `SessionProvider`) to expose their respective state and actions to the component tree.
- **Subscriber Hooks**:
  - `src/hooks/useTutorEvents.js`: Allows components to subscribe to specific tutor events (filtered by `slideId` if necessary) and receive replayed messages from the ring buffer upon mounting. This hook now uses `useEmitCtx` and `useWebSocketCtx` internally.
  - `useWebSocketCtx`, `useEmitCtx`, `useAudioCtx`, `useSessionCtx`: Custom hooks for accessing the respective provider's context.
- **Local Component State**: Standard React state management (`useState`, `useRef`) is used for component-level UI state and temporary data.
- **Prop-Drilling Avoidance**: This provider-based approach is preferred over prop-drilling for distributing tutor commands and WebSocket state across the application.

### 3. DOM vs. React Updates

- **React for Declarative UI**: React manages the overall component tree, renders the main UI structure (like `SlidePanel.jsx`, `InteractableSlide.jsx`, individual slide content), and handles declarative state updates.
- **Direct DOM Manipulation for Specific Interactions**:
  - **`POINT` cursor**: The `src/hooks/usePointerControl.js` hook directly manipulates the style (transform, opacity) of the cursor DOM element for precise and performant positioning based on target element bounding boxes. This avoids re-rendering large parts of the React tree for frequent cursor movements.
  - **`HIGHLIGHT`**: The `src/hooks/useHighlighter.js` hook can perform highlighting by adding/removing CSS classes to DOM elements (identified by ID) or by wrapping text nodes found via regex within new `<span>` elements. This is useful for highlighting arbitrary text content, including that rendered from Markdown via `ReactMarkdown`.
- **Rationale**: This hybrid approach leverages React's strengths for structural UI and state management, while allowing for efficient and precise control over dynamic, low-level interactions like the cursor and text highlighting where direct DOM manipulation can be more straightforward or performant.

### 4. Plugging in New Question Slides

New question slides are introduced by creating new React components, not by directly swapping HTML files. This approach provides better encapsulation, reusability, and allows for complex logic within slides if needed.

The process is as follows:

1.  **Create a New Slide Component**:

    - Develop a new React component (e.g., `MyNewQuestionSlide.jsx`) in the `src/slides/` directory.
    - This component will define the HTML structure, text content (often using `ReactMarkdown` for rich text), diagrams (which can be SVG components, HTML/CSS structures, or imported images), and any interactable elements (`data-role="interactable"`, `id`).
    - Example: `src/slides/QuestionSlide.jsx`.

2.  **Integrate into the Application**:
    - The `src/components/SlidePanel.jsx` component is responsible for managing which slide is currently active.
    - To display the new slide, `SlidePanel.jsx` would be modified to render `<InteractableSlide><MyNewQuestionSlide /></InteractableSlide>` when appropriate (e.g., based on application state or routing).
    - The `<InteractableSlide>` component acts as a wrapper, providing the necessary context and interaction capabilities (pointer, highlight, audio handling via its imperative ref methods, which are called by `useSlideInteraction` hook).

This component-based approach ensures that each slide is a self-contained unit that can be easily managed and swapped within the React application structure. The `<InteractableSlide>` component remains generic, handling the _interaction mechanics_ regardless of the specific _content_ provided by the child slide component.

## Session Start/Restart Safety Guard (2024 Update)

- The Start/Restart Session button now includes a built-in safety guard to prevent spamming:
  - After each click, the button is disabled for 1.5 seconds, ignoring further clicks during this period.
  - This ensures that multiple rapid session events are not sent to the backend, preventing race conditions or UI glitches.
- On each Start/Restart, the following are reset via imperative methods:
  - The pointer is hidden and reset to its default position.
  - All highlights are cleared from the slide.
  - Any currently playing audio is stopped.
- This logic is implemented in the `InteractableSlide` component, which manages the button state and calls the appropriate imperative methods on its child hooks.

## Pause/Stop Session Functionality

- As of this version, explicit Pause and Stop session features are **not implemented**.
- Rationale: These features would require both frontend state management and protocol/logic changes in the mock server. For the current POC, only Start/Restart (with safety guard) is supported for simplicity and robustness.
