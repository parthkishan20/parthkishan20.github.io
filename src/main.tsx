import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './styles/print.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Re-apply the URL fragment once React has actually put the sections in
// the DOM.
//
// The browser performs its fragment scroll when parsing finishes. This
// is a module script, so it runs at that point and `root.render()` only
// *schedules* the first render - #background and friends do not exist
// yet, the browser finds no target, and the scroll silently no-ops.
// Every legacy deep link (#education, #certifications, #extracurricular,
// #resume) and every shared section link landed the reader at the top of
// the page instead.
//
// Two frames: one for React to commit, one for layout to settle against
// it. `behavior: "auto"` because an initial jump should never animate,
// and `scroll-padding-top` (index.css) supplies the sticky-bar offset.
// Guarded on scrollY so this never fights a browser that did handle the
// fragment itself, or a restored scroll position.
const initialHash = window.location.hash.slice(1)
if (initialHash) {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (window.scrollY > 4) return
      const target = document.getElementById(initialHash)
      if (!target) return
      target.scrollIntoView({ behavior: 'auto' })
      target.focus({ preventScroll: true })
    })
  })
}
