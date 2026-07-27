import '@testing-library/jest-dom/vitest'
import '@/lib/i18n'
import * as React from 'react'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

;(globalThis as typeof globalThis & { React: typeof React }).React = React

afterEach(() => {
  cleanup()
  localStorage.clear()
  sessionStorage.clear()
})
