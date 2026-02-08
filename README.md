# Mockdock (Figma Clone Lite)

Mockdock is a modern, lightweight web-based design tool inspired by Figma. Built with React and a high-performance tech stack, it provides a canvas-based editing experience for creating and managing design elements.

## 🚀 Features

### 🎨 Canvas & Design
- **Interactive Canvas**: Zoom, pan, and select elements with ease.
- **Shape Tools**: Create rectangles, circles, frames, and text elements.
- **Image Support**: Upload and manage images within your design.
- **Advanced Properties**: Fine-tune dimensions, positions, colors (fills/strokes), and opacity.
- **Typography Control**: Adjust font size, weight, alignment, and line height.

### 🧩 Components & Instances
- **Master Components**: Create reusable design components.
- **Instances**: Deploy instances of master components that stay in sync with their source.
- **Layer Management**: Nested elements support with a dedicated layers panel for better organization.

### 📐 Constraints & Layout
- **Smart Constraints**: Define how elements should behave when their parent frames are resized (Left, Right, Center, Both, Scale).
- **Prototyping**: Basic prototyping support with a dedicated tab for interaction design.

### 🌍 Internationalization (i18n)
- **Multi-language Support**: Built-in support for English, Russian, and Uzbek (Latin and Cyrillic) using Lingui.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **State Management & Data Fetching**: [TanStack Query](https://tanstack.com/query)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) & [Shadcn/UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Internationalization**: [Lingui](https://lingui.js.org/)
- **Validation**: [Zod](https://zod.dev/)

## 🏁 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (Latest LTS recommended)
- [pnpm](https://pnpm.io/)

### Installation
```bash
# Install dependencies
pnpm install
```

### Development
```bash
# Start development server
pnpm dev

# Sync translations
pnpm sync
```

### Production Build
```bash
# Build for production
pnpm build

# Preview production build
pnpm preview
```

## 📁 Project Structure

```text
src/
├── components/     # Reusable UI and Layout components
│   ├── layout/     # App structure (Sidebar, Header, etc.)
│   └── ui/         # Shadcn-based UI elements
├── hooks/          # Custom React hooks
├── lib/            # Shared utilities and configurations
├── routes/         # File-based routing (TanStack Router)
│   └── figma/      # Core Figma Lite application route
├── utils/          # API helpers, Contexts, and i18n setup
└── types/          # Global TypeScript definitions
```
