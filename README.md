# Parthkumar Patel Portfolio

A modern, responsive portfolio website built with Vite, React, TypeScript, Tailwind CSS, and shadcn/ui. This project showcases my education, experience, skills, projects, certifications, extracurricular activities, and resume in a clean, professional format.

## Features
- ⚡ Fast Vite + React + TypeScript setup
- 🎨 Beautiful UI with Tailwind CSS and shadcn/ui components
- 🌗 Dark mode support
- 🧭 Sidebar navigation and dynamic routing
- 📄 Resume PDF preview
- 🏆 Certifications, skills, and achievements
- 📚 Education, experience, and extracurriculars
- 📦 Organized assets and code structure

## Getting Started
1. **Install dependencies:**
  ```sh
  npm install
  ```
2. **Run the development server:**
  ```sh
  npm run dev
  ```
3. **Build for production:**
  ```sh
  npm run build
  ```

## Folder Structure
- `src/pages/` - All main pages (Home, About, Education, etc.)
- `src/components/` - Reusable UI components
- `src/data/siteData.json` - Portfolio data
- `public/images/` - Profile, logos, and project images

## Deployment
You can deploy this site to Vercel, Netlify, or GitHub Pages. For Vercel/Netlify, just import the repo and follow their instructions.

## License
MIT

---

> Built and maintained by Parthkumar Patel. Feel free to fork, contribute, or reach out for collaboration!
# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
