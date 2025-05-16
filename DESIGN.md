# Design Document: AI-Tutor Interactable Slide System

This document outlines the architectural and design decisions for the AI-Tutor Interactable Slide System.

## Core Requirements & Scope

The system is designed as a Proof-of-Concept for an AI-Tutor Geometry Board. The minimum viable demo includes:

1.  A mocked backend (`mock-server/server.js`) that emits a scripted dialog of tutor actions.
2.  The **`POINT`** feature: A visual cursor moves to a specified element on the slide.
3.  Additional implemented features:
    - **`AUDIO`**: Plays tutor audio.
    - **`HIGHLIGHT`**: Highlights text or elements.
    - **`SPEECH`**: Captures learner voice input.

## Architectural Decisions

### 1. WebSocket Handling & Buffering

- **Centralized Handling**: WebSocket connection, message parsing, event emission, and reconnection logic are managed centrally within `src/providers/TutorProvider.jsx`.
- **Custom Hook**: The `src/hooks/useWebSocket.js` hook encapsulates the raw WebSocket setup and lifecycle management (connect, onopen, onclose, onerror, reconnect attempts with backoff).
- **Message Buffering**: A ring buffer (`src/hooks/useRingBuffer.js`, instantiated in `TutorProvider.jsx`) stores recent messages received from the WebSocket. This allows components that mount after certain events have already been emitted to "replay" these events and sync their state (e.g., a slide loading after initial tutor messages). The buffer size is configurable via `src/config/socket.js`.

### 2. State Management / Event Bus

- **Primary Event Bus**: `TutorProvider.jsx` utilizes the `mitt` library to create an event emitter. This emitter serves as the internal event bus for tutor-initiated events.
- **Context API**: React's Context API (`src/context/TutorContext.js`) is used to expose the event bus, WebSocket sending capabilities, and other shared states (like latency settings) to the component tree.
- **Subscriber Hooks**:
  - `src/hooks/useTutorEvents.js`: Allows components to subscribe to specific tutor events (filtered by `slideId` if necessary) and receive replayed messages from the ring buffer upon mounting.
  - `src/hooks/useTutorCtx.js`: Provides convenient access to the `TutorContext` values (e.g., `send` function to send messages to WebSocket, `socketRef`, `startSession`).
- **Local Component State**: Standard React state management (`useState`, `useRef`) is used for component-level UI state and temporary data.
- **Prop-Drilling Avoidance**: This event bus and context approach is preferred over prop-drilling for distributing tutor commands and WebSocket state across the application.

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
