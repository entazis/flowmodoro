# Flowmodoro Timer

A productivity timer application implementing the Flowmodoro technique - work for any period, then take a break proportional to your work time.

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Built With

- **Vite** - Fast build tool and development server
- **React 18** - UI library with modern hooks
- **TypeScript** - Type safety and better developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Beautiful and accessible component library
- **Lucide React** - Icon library

## 🎯 Flowmodoro Technique

The Flowmodoro technique combines the flexibility of flow state with structured breaks:

1. **Work**: Start the timer and work on your task for any duration
2. **Break**: When you stop, take a break equal to your work time divided by 5
3. **Repeat**: After the break, start a new work session

Example: Work for 50 minutes → Take a 10-minute break

## 🚀 Features

- ⏱️ **Flexible work sessions** - No fixed 25-minute blocks
- 🧮 **Automatic break calculation** - Break time = work time ÷ 5
- 🎨 **Beautiful UI** - Clean, modern interface with dark mode
- 📱 **Responsive design** - Works on desktop, tablet, and mobile
- 🔊 **Audio notifications** - Optional sound alerts
- 💾 **Local storage** - Remembers your settings

## 📁 Repository Structure

```
flowmodoro/
├── src/                    # Main application source
│   ├── components/         # React components
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Application pages
│   └── lib/               # Utilities and helpers
├── versions/              # Alternative implementations
│   └── nextjs-flowmodoro/ # Next.js version (backup)
├── shared/                # Shared logic between versions
└── scripts/               # Management scripts
```

## 🔄 Version Management

This repository contains multiple implementations:

- **Main App** (current): Vite + React implementation
- **Next.js Version**: Available in `versions/nextjs-flowmodoro/`

### Running Different Versions

```bash
# Main Vite version (current)
npm run dev

# Next.js version
cd versions/nextjs-flowmodoro
npm install
npm run dev
```

## 🛠️ Development

### Prerequisites

- Node.js (v18 or higher)
- npm, yarn, or pnpm

### Commands

```bash
# Development
npm run dev              # Start dev server with HMR

# Building
npm run build           # Build for production
npm run build:dev       # Build in development mode

# Code Quality
npm run lint            # Run ESLint
npm run preview         # Preview production build
```

### Project Structure

```
src/
├── App.tsx             # Main application component
├── main.tsx           # Application entry point
├── pages/
│   ├── Index.tsx      # Main timer page
│   └── NotFound.tsx   # 404 page
├── components/
│   └── ui/            # shadcn/ui components
├── hooks/             # Custom React hooks
├── lib/
│   └── utils.ts       # Utility functions
└── index.css          # Global styles and Tailwind imports
```

## 🚀 Deployment

The application can be deployed to various platforms:

### Vercel

```bash
npm run build
# Upload dist/ folder to Vercel
```

### Netlify

```bash
npm run build
# Upload dist/ folder to Netlify
```

### GitHub Pages

```bash
npm run build
# Deploy dist/ folder to gh-pages branch
```

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

> **Flowmodoro** - Work in flow, rest in balance ⚖️
