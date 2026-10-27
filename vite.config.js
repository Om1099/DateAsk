import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  // Relative asset paths: the build works at a domain root *and* in a sub-folder
  // (e.g. https://<user>.github.io/DateAsk/). Safe here because there is no client-side routing.
  base: './',
  plugins: [react(), tailwindcss()],
})
