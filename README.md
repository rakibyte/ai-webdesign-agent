# Sleek - AI Web Design Agent

An intelligent web design agent application built with **Next.js 16**, **React 19**, **Tailwind CSS v4**, and **Base UI / shadcn**. Designed to create, preview, and iterate on modern, responsive web designs effortlessly.

---

## Features

- **AI-Powered Design Workflow**: Create modern, production-grade web interfaces dynamically.
- **Dark & Light Mode**: Seamless theme toggling powered by `next-themes` and Base UI dropdown menus.
- **Dynamic Project Routing**: Individual project workspaces accessible via `/project/[slugId]`.
- **Modern Component Architecture**: Built with accessible Base UI primitives and styled with Tailwind CSS v4.
- **Responsive & Clean UI**: Polished branding with custom micro-animations and typography.

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Component Primitives**: [@base-ui/react](https://base-ui.com/) & [shadcn](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes)

---

## Getting Started

### Prerequisites

Ensure you have **Node.js 18+** installed on your system.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rakibyte/ai-webdesign-agent.git
   cd ai-webdesign-agent
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Project Structure

```text
├── app/
│   ├── (routes)/
│   │   ├── layout.tsx         # Route group layout
│   │   ├── page.tsx           # Home landing page
│   │   └── project/[slugId]/  # Project dynamic workspace page
│   ├── globals.css            # Global Tailwind CSS v4 theme styles
│   └── layout.tsx             # Root layout with ThemeProvider
├── components/
│   ├── ui/                    # Reusable UI primitives (Button, DropdownMenu)
│   ├── dark-mode-toggle.tsx   # Theme switcher component
│   ├── header.tsx             # Global application header
│   ├── logo.tsx               # Brand logo component
│   └── theme-provider.tsx     # next-themes provider wrapper
└── lib/
    └── utils.ts               # Class merging utilities
```

---

## Scripts

- `npm run dev`: Starts the Next.js development server with Turbopack.
- `npm run build`: Compiles the application for production.
- `npm run start`: Starts the production server.
- `npm run lint`: Runs ESLint for code quality checks.

---

## License

MIT License.
