import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { AdminNavGroup } from '@/config/admin-nav'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface DashboardModuleGridProps {
  groups: AdminNavGroup[]
}

function ModuleLink({ item }: { item: AdminNavGroup['children'][number] }) {
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      className={cn(
        'group flex min-h-11 items-center gap-3 rounded-lg border border-transparent px-3 py-2.5',
        'transition-colors hover:border-primary/15 hover:bg-secondary/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
      )}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium">{item.label}</span>
      <ChevronRight
        className="h-4 w-4 shrink-0 text-muted-foreground/40 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
        aria-hidden
      />
    </Link>
  )
}

export function DashboardModuleGrid({ groups }: DashboardModuleGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {groups.map((group) => {
        const GroupIcon = group.icon
        return (
          <Card key={group.label} className="admin-card border-primary/10">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <GroupIcon className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">{group.label}</CardTitle>
                  <CardDescription>{group.children.length} modul tersedia</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-0.5 pt-0">
              {group.children.map((item) => (
                <ModuleLink key={`${group.label}-${item.label}`} item={item} />
              ))}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
