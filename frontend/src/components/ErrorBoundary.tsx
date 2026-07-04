import { Component, type ErrorInfo, type ReactNode } from 'react'
import i18n from '@/lib/i18n'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="flex min-h-svh items-center justify-center bg-background p-6 text-center">
          <div className="max-w-md space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              {i18n.t('common.errorTitle', { ns: 'pages', defaultValue: 'An Error Occurred' })}
            </h1>
            <p className="text-muted-foreground">
              {i18n.t('common.errorDesc', { ns: 'pages', defaultValue: 'Page failed to load. Please reload.' })}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex h-10 items-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {i18n.t('common.reload', { ns: 'pages', defaultValue: 'Reload' })}
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
