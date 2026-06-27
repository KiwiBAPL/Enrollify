import { useCallback, useEffect, useId, useState } from 'react'
import { createPortal } from 'react-dom'

type ImageLightboxProps = {
  src: string
  alt: string
  className?: string
  hint?: string
}

export function ImageLightbox({ src, alt, className = '', hint }: ImageLightboxProps) {
  const [open, setOpen] = useState(false)
  const dialogId = useId()

  const close = useCallback(() => setOpen(false), [])

  useEffect(() => {
    if (!open) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [close, open])

  const overlay = open ? (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <button
        type="button"
        className="fixed inset-0 bg-stroke-primary/60"
        aria-label="Close enlarged image"
        onClick={close}
      />
      <button
        type="button"
        onClick={close}
        className="fixed z-[60] inline-flex h-10 w-10 items-center justify-center rounded-pill border-2 border-stroke-primary bg-background-secondary font-body text-xl leading-none text-stroke-primary top-[max(1rem,env(safe-area-inset-top))] right-[max(1rem,env(safe-area-inset-right))]"
        aria-label="Close"
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <div
        id={dialogId}
        role="dialog"
        aria-modal="true"
        aria-label={alt}
        className="relative z-10 flex min-h-min justify-center px-4 pb-4 pt-[max(3.5rem,env(safe-area-inset-top))]"
      >
        <img
          src={src}
          alt={alt}
          className="max-h-[calc(100dvh-4.5rem)] w-full max-w-[min(100%,56rem)] object-contain"
        />
      </div>
    </div>
  ) : null

  return (
    <figure className="m-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in border-0 bg-transparent p-0 text-left"
        aria-haspopup="dialog"
        aria-controls={dialogId}
        aria-label={`View larger: ${alt}`}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={`w-full rounded-card border-2 border-accent-primary shadow-hard-accent object-contain ${className}`}
        />
      </button>
      {hint ? <figcaption className="mt-2 text-sm text-text-muted lg:hidden">{hint}</figcaption> : null}
      {overlay ? createPortal(overlay, document.body) : null}
    </figure>
  )
}
