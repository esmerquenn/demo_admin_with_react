import { AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorProps {
  className?: string
  title?: string
  message?: string
  onRetry?: () => void
}

export function Error({
  className,
  title = 'Xəta baş verdi',
  message = 'Məlumatlar yüklənərkən xəta baş verdi.',
  onRetry,
}: ErrorProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center gap-4 py-12', className)}>
      <div className="rounded-full bg-destructive/10 p-4">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
      </div>
      {onRetry && (
        <Button variant="outline" onClick={onRetry}>
          <RefreshCw className="mr-2 size-4" />
          Yenidən cəhd et
        </Button>
      )}
    </div>
  )
}

export function PageError({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <Error onRetry={onRetry} />
    </div>
  )
}
