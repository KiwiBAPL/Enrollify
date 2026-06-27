import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function ArticleGoBack() {
  const navigate = useNavigate()

  return (
    <Button variant="secondary" size="sm" type="button" className="mb-8" onClick={() => navigate('/blog')}>
      ← Go back
    </Button>
  )
}
