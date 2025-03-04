# Electron Vue To-Do App

A simple desktop to-do application built with Electron and Vue 3.

## Features

- Add new tasks
- Mark tasks as complete/incomplete
- Delete tasks
- Modern and clean UI
- Unit tests

## Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

## Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

## Development

To run the application in development mode:

```bash
npm run dev
```

This will start both the Vite dev server and the Electron application.

## Testing

To run the unit tests:

```bash
npm test
```

For test coverage report:

```bash
npm run test:coverage
```

## Project Structure

```
├── src/
│   ├── assets/
│   │   └── main.css
│   ├── App.vue
│   ├── App.test.js
│   └── main.js
├── index.html
├── main.js
├── package.json
├── vite.config.js
└── README.md
```

## Technologies Used

- Electron
- Vue 3
- Vite
- Vitest
- Vue Test Utils
