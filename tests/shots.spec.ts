import { test } from '@playwright/test'
import path from 'node:path'

const WIDTHS = [320, 375, 390, 768, 1024, 1160, 1280, 1440]
const THEMES = ['light', 'dark'] as const

for (const width of WIDTHS) {
  for (const theme of THEMES) {
    test(`${width}-${theme}`, async ({ page }, testInfo) => {
      await page.addInitScript((t) => {
        window.localStorage.setItem('vite-ui-theme', t)
      }, theme)

      await page.setViewportSize({ width, height: 900 })
      await page.goto('/', { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)

      const outPath = path.join(
        'docs',
        'shots',
        testInfo.project.name,
        `${width}-${theme}.png`,
      )
      await page.screenshot({ path: outPath, fullPage: true })
    })
  }
}
