import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class AdminErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('[AdminErrorBoundary]', error, info.componentStack)
    }
  }

  render(): ReactNode {
    if (this.state.error) {
      return (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-800"
        >
          <h2 className="mb-2 font-display text-lg font-semibold">Something went wrong</h2>
          <p className="font-body">{this.state.error.message}</p>
          <button
            type="button"
            onClick={() => this.setState({ error: null })}
            className="mt-4 rounded border border-red-300 bg-white px-3 py-1.5 text-sm hover:bg-red-50"
          >
            Try again
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
