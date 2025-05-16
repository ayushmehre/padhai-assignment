# AI-Tutor Geometry Board - Interactable Slide System

This project is a Proof-of-Concept Interactable Slide system designed to function as an AI-Tutor Geometry Board. The core of the application is a reusable React component, `<InteractableSlide>`, which dynamically handles and interacts with educational content.

## Core Features

The `<InteractableSlide>` component is responsible for:

1.  **Content Display**: Accepting and rendering arbitrary HTML fragments or React children that represent a tutoring slide (e.g., problem text, diagrams).
2.  **Interactable Element Detection**: Identifying all sub-elements within the slide marked as interactable via `data-*` attributes (e.g., `data-role="interactable"`) or stable `id`s.
3.  **Metadata Emission**: Generating and emitting a structured JSON object that describes these interactable elements. This object includes details like `id`, `boundingBox`, `elementType`, and any other custom metadata, enabling a backend or LLM to reason about possible actions.
4.  **Tutor Action Subscription**: Subscribing to actions sent from a tutor (via WebSockets) and performing the corresponding DOM or SVG manipulations on the slide.
    - **`POINT`**: Mandatory feature to move a visual cursor to an element.
    - **`AUDIO`**: Optional feature to play tutor audio.
    - **`HIGHLIGHT`**: Optional feature to highlight text.
    - **`SPEECH`**: Optional feature for learner voice input.
5.  **Versatile Diagram Support**: Working seamlessly whether diagrams are authored in SVG or plain HTML/CSS, and manipulating either the real DOM or React's virtual DOM as appropriate.

## Project Architecture

### Frontend

- **Component Structure**: The primary component is `<InteractableSlide>`, which encapsulates the logic for displaying slides, detecting interactables, and handling tutor commands.
  - `SlidePanel.jsx`: Hosts the `InteractableSlide` and manages the current slide content (e.g., `QuestionSlide.jsx`).
  - `QuestionSlide.jsx`: An example slide demonstrating how problem text and diagrams are structured.
- **State Management & Event Bus**:
  - A `TutorProvider.jsx` establishes a WebSocket connection and uses the `mitt` library to create an event emitter. This serves as an internal event bus.
  - Hooks like `useTutorEvents` and `useTutorCtx` are provided for components to subscribe to tutor events and send messages.
  - A ring buffer (`createRingBuffer`) is used to store and replay recent messages, which can be useful for components mounting after events have been emitted.
- **Interactable Detection**:
  - The `useInteractables.js` hook is responsible for querying the DOM for elements with `data-role="interactable"`. It extracts metadata such as `id`, `type` (from `data-type` or tag name), and `boundingBox`.
- **DOM Manipulation**:
  - For features like `POINT`, direct DOM manipulation is used (e.g., `usePointerControl.js` updates cursor position).
  - React handles the rendering of components and overall UI structure.
- **WebSocket Handling**:
  - Managed within `TutorProvider.jsx`. It handles connection, message parsing, event emission, and reconnection logic.
- **Slide Content**: New question slides can be introduced by creating new React components (like `QuestionSlide.jsx`) and passing them as children to `<InteractableSlide>`.

### Backend (Mock Server)

- A mock backend is provided in `mock-server/server.js`.
- It uses `ws` (a WebSocket library for Node.js).
- Upon a `START_SESSION` message from the client, it emits a scripted sequence of `AUDIO`, `POINT`, and `HIGHLIGHT` events.
- It accepts `SPEECH` messages from the frontend but currently ignores their content, advancing the script regardless.

## Implemented Features

- **`START_SESSION`**: Initiates the WebSocket connection and starts the scripted dialog from the mock server.
- **`POINT` (Mandatory)**: A visual cursor moves to the center of the specified element's bounding box. Implemented in `usePointerControl.js`.
- **`AUDIO`**: Streams tutor audio. Basic playback is handled by `useAudioPlayer.js`.
- **`HIGHLIGHT`**: Visually emphasizes text within the problem panel. Implemented in `useHighlighter.js`.
- **`SPEECH`**: Captures learner audio via the microphone and sends it as a `SPEECH` message to the backend. Implemented in `useVoiceRecorder.js`.

### UI Elements

The application includes the following UI elements as per the requirements:

- **Start Button** (`id="btnStart"`): Begins the scripted session.
- **Problem Panel** (`id="problemText"`): Displays the static markdown problem statement.
- **Diagram Canvas** (`id="diagramCanvas"`): Area for the geometry diagram (supports SVG and HTML/CSS).
- **Workspace / Notes** (`id="workspace"`): A textarea for learner notes.
- **Mic Button** (Record/Stop Recording): Toggles recording of learner speech.

## Getting Started

### Prerequisites

- Node.js (version compatible with project dependencies, e.g., v18+ or v20+)
- npm (comes with Node.js)

### Installation

1.  Clone the repository:
    ```bash
    git clone <repository-url>
    cd <repository-directory>
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

You need to run two separate processes: the mock backend server and the frontend development server.

1.  **Start the Mock Backend Server**:
    Open a terminal and run:

    ```bash
    npm run mock:server
    ```

    This will typically start the server on `ws://localhost:8080`. Check the console output for the exact address.

2.  **Start the Frontend Development Server**:
    Open another terminal and run:
    ```bash
    npm run dev
    ```
    This will start the Vite development server, usually on `http://localhost:5173`. Your browser should open to this address automatically, or you can navigate to it manually.

## Project Structure Highlights

- `src/components/InteractableSlide.jsx`: The core reusable component.
- `src/components/SlidePanel.jsx`: Manages the display of slides.
- `src/slides/QuestionSlide.jsx`: An example of a question slide.
- `src/hooks/`: Contains custom React hooks for features like interactable detection (`useInteractables.js`), pointer control (`usePointerControl.js`), audio playback (`useAudioPlayer.js`), highlighting (`useHighlighter.js`), and voice recording (`useVoiceRecorder.js`).
- `src/providers/TutorProvider.jsx`: Handles WebSocket communication and event bus logic.
- `mock-server/server.js`: The mock backend implementation.
- `public/`: Static assets.
- `src/assets/`: Frontend assets like images or CSS specific to components.

## Design Decisions (DESIGN.md Summary)

While a separate `DESIGN.md` was suggested, key architectural decisions are reflected in the codebase:

- **WebSocket Handling & Buffering**: Centralized in `TutorProvider.jsx`, using `mitt` for event emission and a custom ring buffer for replaying messages to late-joining subscribers. Reconnection logic with exponential backoff is implemented.
- **State Management / Event Bus**: `TutorProvider.jsx` and its associated context/hooks (`useTutorEvents`, `useTutorCtx`) form the primary event bus, preferring this over prop-drilling for tutor events. Local component state is managed by React's `useState` and `useRef`.
- **DOM vs React Updates**:
  - React manages the overall component tree and declarative UI updates.
  - Direct DOM manipulation is employed for specific, imperative actions like moving the `POINT` cursor (`usePointerControl.js` directly styles the cursor element) and potentially for `HIGHLIGHT` if it needs to interact with raw HTML content within `ReactMarkdown`. This approach is chosen for performance and precision in these specific interactive features.
- **Plugging in New Slides**: Achieved by creating a new React component representing the slide content (HTML structure, text, diagrams) and rendering it as a child of the `<InteractableSlide>` component, typically managed by a parent component like `SlidePanel.jsx`. This allows for easy swapping of slide content by changing the child component.

## Design Overview

For a detailed explanation of the architectural and design decisions, please see the [DESIGN.md](DESIGN.md) file.

## Optional Features Implemented

- **Latency Slider**: A slider in the `SettingsPanel.jsx` allows simulating network latency for messages sent to the mock server.
- **Dark/Light Mode Toggle**: A switch in `SettingsPanel.jsx` allows toggling between dark and light themes for the UI.

## Evaluation Criteria Considerations

- **Architecture & Abstractions**: Clear separation of concerns with hooks for specific functionalities (pointer, audio, highlight, interactables), a provider for WebSocket and event bus, and distinct presentational components.
- **Audio Streaming & Capture**: Basic audio playback and microphone capture are implemented.
- **Network Robustness**: WebSocket provider includes reconnection logic and a message buffer.
- **Backend Mock Quality**: The mock server provides a scripted dialog with `POINT`, `HIGHLIGHT`, and `AUDIO` events.
- **Point & Highlight Accuracy**: `POINT` uses `getBoundingClientRect` for positioning. `HIGHLIGHT` in `QuestionSlide.jsx` uses `<span>` tags with IDs for direct targeting, and the mock server provides regex-based highlighting for the problem text.
- **UI / UX Polish**: The application uses Tailwind CSS for styling and provides smooth transitions for the pointer. Dark/light mode and a latency simulator are included as UI polish.
