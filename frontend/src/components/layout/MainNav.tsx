import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isInternalRoute, mainNavTree, resolveNavHref, type NavLink } from '@/config/main-nav'
import { cn } from '@/lib/utils'

type MainNavProps = {
  isHome: boolean
  isHeroOverlay: boolean
}

function NavMenuItem({
  item,
  isHome,
  onNavigate,
}: {
  item: NavLink
  isHome: boolean
  onNavigate?: () => void
}) {
  const href = resolveNavHref(item.href, isHome)

  if (isInternalRoute(item.href)) {
    return (
      <DropdownMenuItem asChild>
        <Link to={item.href} onClick={onNavigate}>
          {item.label}
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem asChild>
      <a href={href} onClick={onNavigate}>
        {item.label}
      </a>
    </DropdownMenuItem>
  )
}

export function MainNav({ isHome, isHeroOverlay }: MainNavProps) {
  const triggerClass = cn(
    'group inline-flex h-11 shrink-0 items-center gap-1 rounded-lg border border-transparent px-3 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    'data-[state=open]:border-transparent',
    isHeroOverlay
      ? 'text-primary-foreground/90 hover:bg-primary-foreground/10 hover:text-primary-foreground data-[state=open]:bg-primary-foreground/15 data-[state=open]:text-primary-foreground'
      : 'text-muted-foreground hover:bg-accent hover:text-primary data-[state=open]:bg-accent data-[state=open]:text-primary',
  )

  return (
    <nav className="flex items-center gap-0.5" aria-label="Navigasi utama">
      {mainNavTree.map((group) => (
        <DropdownMenu key={group.label} modal={false}>
          <DropdownMenuTrigger className={triggerClass}>
            {group.label}
            <ChevronDown className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" sideOffset={8} className="min-w-[12rem]">
            {group.children.map((child) => (
              <NavMenuItem key={child.href} item={child} isHome={isHome} />
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ))}
    </nav>
  )
}
