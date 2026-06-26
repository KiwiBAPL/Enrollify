interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div
      role="alert"
      className="mb-4 flex items-center justify-between rounded border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
    >
      <span>{message}</span>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="ml-4 font-medium underline focus:outline-none focus:ring-2 focus:ring-red-400"
        >
          Retry
        </button>
      )}
    </div>
  )
}
