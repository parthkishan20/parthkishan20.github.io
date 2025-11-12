# Portfolio Website Explanation

This document explains how this portfolio website works, designed for total beginners to understand the project structure, technologies, and deployment process.

## Table of Contents
1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Project Structure](#project-structure)
4. [How It Works](#how-it-works)
5. [Key Components](#key-components)
6. [Routing System](#routing-system)
7. [Styling and Theming](#styling-and-theming)
8. [Deployment](#deployment)

## Project Overview

This is a modern, responsive portfolio website built to showcase professional experience, projects, skills, and education. The website is:
- **Single Page Application (SPA)**: Despite having multiple pages, it loads once and dynamically updates content without full page reloads
- **Mobile-Responsive**: Works seamlessly on phones, tablets, and desktops
- **Dark/Light Mode**: Users can toggle between themes
- **Fast and Optimized**: Built with modern tools for optimal performance

## Technologies Used

### Core Technologies

**React**: A JavaScript library for building user interfaces. Think of React as building blocks - you create small reusable pieces (components) and combine them to build your website.

**TypeScript**: JavaScript with type safety. It helps catch errors before your code runs, making development more reliable.

**Vite**: A modern build tool that makes development fast. It serves your code during development and bundles it for production.

### UI and Styling

**Tailwind CSS**: A utility-first CSS framework. Instead of writing custom CSS, you apply pre-built classes directly to HTML elements (e.g., `className="text-blue-500 p-4"`).

**shadcn/ui**: Pre-built, accessible UI components (buttons, cards, dialogs) that follow best practices and are customizable.

**Lucide React**: A library of beautiful, consistent icons used throughout the site.

### Routing

**React Router**: Manages navigation between different pages (/home, /about, /projects, etc.) without reloading the entire page.

### Deployment

**GitHub Pages**: Free hosting service from GitHub that serves your website directly from your repository.

**gh-pages**: A tool that automates deploying your built website to GitHub Pages.

## Project Structure

```
my-app/
├── public/               # Static files (images, CNAME)
│   ├── images/          # All website images
│   └── CNAME            # Custom domain configuration
├── src/                 # Source code
│   ├── components/      # Reusable UI components
│   │   ├── ui/         # Base UI components (buttons, cards)
│   │   ├── layout.tsx  # Main page layout wrapper
│   │   ├── app-sidebar.tsx  # Navigation sidebar
│   │   └── ...
│   ├── pages/          # Individual page components
│   │   ├── home.tsx
│   │   ├── about.tsx
│   │   ├── projects.tsx
│   │   └── ...
│   ├── data/           # Website content
│   │   └── siteData.json  # All text, links, project info
│   ├── App.tsx         # Main application component
│   └── main.tsx        # Application entry point
├── package.json        # Project dependencies and scripts
├── vite.config.ts      # Vite configuration
└── tsconfig.json       # TypeScript configuration
```

## How It Works

### 1. Development Workflow

**Starting Development**:
```bash
npm run dev
```
This command starts a local development server. Vite watches your files and instantly updates the browser when you make changes.

**Building for Production**:
```bash
npm run build
```
This compiles TypeScript to JavaScript, bundles all files, optimizes images, and creates a `dist/` folder with production-ready files.

**Deploying**:
```bash
npm run deploy
```
This builds the project and pushes the `dist/` folder to the `gh-pages` branch on GitHub, which GitHub Pages then serves.

### 2. Application Flow

**Entry Point** (`main.tsx`):
- Loads the root App component
- Wraps it with ThemeProvider for dark/light mode
- Renders it into the HTML `#root` element

**Main App** (`App.tsx`):
- Sets up the BrowserRouter for navigation
- Defines all routes (/, /about, /projects, etc.)
- Wraps routes with Layout component for consistent structure

**Layout** (`layout.tsx`):
- Provides the sidebar navigation
- Shows the current page title
- Includes the dark mode toggle
- Renders child pages via `<Outlet />`

**Pages** (`pages/`):
- Individual page components (Home, About, Projects, etc.)
- Pull data from `siteData.json`
- Use UI components to display content

### 3. Data Management

All website content lives in `src/data/siteData.json`. This separation of content from code makes it easy to update your portfolio without touching component files.

**Example**:
```json
{
  "profile": {
    "name": "Parthkumar Patel",
    "email": "parthkishan20@gmail.com",
    "location": "Rochelle Park, NJ"
  },
  "projects": [
    {
      "title": "Project Name",
      "description": "What it does",
      "tech": ["React", "Node.js"]
    }
  ]
}
```

Pages import this data and display it dynamically:
```tsx
import siteData from "@/data/siteData.json";

// Use in component
<h1>{siteData.profile.name}</h1>
```

## Key Components

### Layout Component
The Layout component provides consistent structure across all pages:
- **Sidebar**: Navigation menu with links to all sections
- **Header**: Shows current page name and dark mode toggle
- **Main Content Area**: Where page content renders

### App Sidebar
The sidebar contains:
- Profile avatar and name
- Navigation links (Home, About, Projects, etc.)
- Active page highlighting
- Responsive design (collapsible on mobile)

### Theme Provider
Manages dark/light mode:
- Stores user preference in localStorage
- Applies appropriate CSS classes to the root element
- Provides theme context to all components

### Page Components
Each page follows a similar pattern:
1. Import data from `siteData.json`
2. Import UI components needed
3. Structure content using Tailwind classes
4. Export the component

**Example** (simplified):
```tsx
export default function About() {
  return (
    <section className="py-16">
      <h2 className="text-3xl font-bold">About Me</h2>
      <p>{siteData.about.bio}</p>
    </section>
  );
}
```

## Routing System

React Router manages navigation without full page reloads.

### How Routing Works

**Route Definition** (in App.tsx):
```tsx
<Routes>
  <Route element={<Layout />}>
    <Route path="/" element={<Home />} />
    <Route path="/about" element={<About />} />
    <Route path="/projects" element={<Projects />} />
  </Route>
</Routes>
```

**Navigation Links** (in sidebar):
```tsx
<Link to="/about">About</Link>
```

When a user clicks a link:
1. React Router intercepts the click
2. Updates the browser URL without reloading
3. Matches the path to a route
4. Renders the corresponding component

### Base Path Configuration

For GitHub Pages deployment at a subpath (e.g., `/my-portfolio-website/`):
- `vite.config.ts`: `base: "/my-portfolio-website/"`
- `App.tsx`: `<Router basename="/my-portfolio-website/">`
- `package.json`: `homepage: "https://parthkishan20.github.io/my-portfolio-website/"`

All three must match for proper routing and asset loading.

## Styling and Theming

### Tailwind CSS

Tailwind uses utility classes for styling:
```tsx
<div className="flex items-center gap-4 p-6 bg-gray-100 rounded-lg">
```

This translates to:
- `flex`: Display as flexbox
- `items-center`: Align items vertically centered
- `gap-4`: 1rem gap between items
- `p-6`: 1.5rem padding on all sides
- `bg-gray-100`: Light gray background
- `rounded-lg`: Large border radius

### Dark Mode Implementation

Dark mode works through CSS classes and context:

**Theme Provider** stores the current theme (light/dark/system) and applies the appropriate class to the `<html>` element.

**Tailwind Dark Mode**: Use `dark:` prefix for dark mode styles:
```tsx
className="bg-white dark:bg-gray-900 text-black dark:text-white"
```

**Mode Toggle**: Button that switches between themes by calling `setTheme()` from the theme context.

### Responsive Design

Tailwind's responsive prefixes make mobile-first design easy:
```tsx
className="text-sm md:text-base lg:text-lg"
```
- Default: small text
- md (768px+): base text
- lg (1024px+): large text

## Deployment

### GitHub Pages Setup

**1. Install gh-pages**:
```bash
npm install --save-dev gh-pages
```

**2. Add scripts to package.json**:
```json
"scripts": {
  "predeploy": "npm run build",
  "deploy": "gh-pages -d dist"
}
```

**3. Configure base paths** (as mentioned in Routing section)

**4. Deploy**:
```bash
npm run deploy
```

This creates a `gh-pages` branch with your built files, which GitHub serves.

### Custom Domain

To use a custom domain (e.g., parthkumar.me):

**1. Create CNAME file** in `public/` folder:
```
parthkumar.me
```

**2. Configure DNS** at your domain provider:
- Add CNAME record: `www` → `parthkishan20.github.io`
- Add A records for root domain → GitHub Pages IPs

**3. Wait for DNS propagation** (5 minutes to 48 hours)

**4. Enable HTTPS** in GitHub repository settings

### Build Process

When you run `npm run build`:

1. **TypeScript Compilation**: Converts `.tsx` files to JavaScript
2. **Bundling**: Combines all JavaScript into optimized bundles
3. **Asset Processing**: Optimizes images, copies public files
4. **Minification**: Removes whitespace, shortens variable names
5. **Output**: Creates `dist/` folder with production files

The `dist/` folder contains everything needed to run your site.

## Summary

This portfolio website demonstrates modern web development practices:
- **Component-based architecture**: Reusable, maintainable code
- **Type safety**: TypeScript catches errors early
- **Responsive design**: Works on all devices
- **Performance optimization**: Fast load times and smooth interactions
- **Easy deployment**: Automated GitHub Pages deployment
- **Content separation**: JSON-based content management

The project is designed to be easily customizable - just update `siteData.json` for content changes, and modify components for structural changes. The modular architecture means you can update one section without affecting others, making maintenance simple and efficient.
