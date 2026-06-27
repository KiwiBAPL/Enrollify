import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function ArticleEndCta() {
  const navigate = useNavigate()

  return (
    <div className="mt-12 space-y-4 rounded-card border-2 border-stroke-primary bg-accent-mint/30 p-8 text-center">
      <h2 className="font-display text-2xl font-semibold text-text-primary">
        Ready to improve your international recruitment?
      </h2>
      <p className="font-body text-text-muted">
        Get in touch to explore how EnRollifyEdu can help your institution attract
        better-qualified students and streamline admissions.
      </p>
      <Button variant="primary" size="md" type="button" onClick={() => navigate('/contact')}>
        Contact us
      </Button>
    </div>
  )
}
