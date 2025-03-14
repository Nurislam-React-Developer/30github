# 30-Day Next.js Migration

This is a migration of the original React project to Next.js 15 with React 19 and Tailwind CSS.

## Features

- Modern Next.js 15 App Router architecture
- React 19 with latest features
- Tailwind CSS for styling (replacing Material UI)
- TypeScript for type safety
- Dark mode support
- Responsive design

## Getting Started

```bash
# Install dependencies
npm install

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Migration Notes

This project is a migration from a React/Vite/Material UI application to Next.js with Tailwind CSS. The migration includes:

1. Converting MUI components to Tailwind CSS equivalents
2. Restructuring the project to follow Next.js App Router conventions
3. Adding TypeScript support
4. Preserving all existing functionality including dark mode, authentication, and social features

## Project Structure

- `/app` - Next.js App Router pages and layouts
- `/app/components` - UI components
- `/app/store` - Redux store configuration
- `/app/theme` - Theme context for dark mode
- `/app/utils` - Utility functions
- `/public` - Static assets
