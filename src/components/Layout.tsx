import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import { Menu, LayoutDashboard, FolderTree, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const nav = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/categories', label: 'Kateqoriyalar', icon: FolderTree },
]

function SidebarNav({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const { pathname } = useLocation()

  return (
    <nav className="flex-1 space-y-1 p-2">
      {nav.map((item) => {
        const isActive = pathname === item.to || (item.to !== '/' && pathname.startsWith(item.to))
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            title={collapsed ? item.label : undefined}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
              collapsed && 'justify-center px-2',
              isActive
                ? 'bg-white/10 text-white'
                : 'text-white/70 hover:bg-white/5 hover:text-white'
            )}
          >
            <item.icon size={20} />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        )
      })}
    </nav>
  )
}

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          'hidden flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 lg:flex',
          collapsed ? 'w-16' : 'w-64'
        )}
      >
        <div className={cn(
          'flex h-16 items-center border-b border-white/10 px-4',
          collapsed && 'justify-center px-2'
        )}>
          {!collapsed && <span className="text-lg font-semibold">Admin</span>}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setCollapsed(!collapsed)}
            className={cn('text-white/70 hover:bg-white/10 hover:text-white', !collapsed && 'ml-auto')}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>
        <SidebarNav collapsed={collapsed} />
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex h-16 items-center gap-4 border-b bg-card px-4 lg:px-6">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon-sm" className="lg:hidden" />}>
              <Menu size={20} />
            </SheetTrigger>
            <SheetContent side="left" className="w-64 bg-sidebar p-0 text-sidebar-foreground" showCloseButton={false}>
              <SheetHeader className="h-16 justify-center border-b border-white/10 px-4">
                <SheetTitle className="text-white">Admin Panel</SheetTitle>
              </SheetHeader>
              <SidebarNav />
            </SheetContent>
          </Sheet>
          <div className="flex-1" />
        </header>

        {/* Content */}
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
