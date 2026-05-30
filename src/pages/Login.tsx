import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function Component() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-4">
        <h1 className="text-center text-2xl font-bold">Giriş</h1>
        <Input type="email" placeholder="Email" />
        <Input type="password" placeholder="Şifrə" />
        <Button className="w-full">Daxil ol</Button>
      </div>
    </div>
  )
}
