import { Link } from 'react-router-dom'
import { FileQuestion, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Component() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="rounded-full bg-muted p-6">
          <FileQuestion className="size-12 text-muted-foreground" />
        </div>
        <div>
          <h1 className="text-6xl font-bold text-primary">404</h1>
          <h2 className="mt-2 text-xl font-semibold">Səhifə tapılmadı</h2>
          <p className="mt-2 text-muted-foreground">
            Axtardığınız səhifə mövcud deyil və ya silinib.
          </p>
        </div>
        <Button>
          <Link to="/" className="flex items-center gap-2">
            <Home className="size-4" />
            Ana səhifəyə qayıt
          </Link>
        </Button>
      </div>
    </div>
  )
}
