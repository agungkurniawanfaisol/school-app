import { ChevronDown } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { isInternalRoute, isNavStandalone, mainNavTree, resolveNavHref, type NavLink } from '@/config/main-nav'
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

  const { t } = useTranslation('layout')

  if (isInternalRoute(item.href)) {
    return (
      <DropdownMenuItem asChild>
        <Link to={item.href} onClick={onNavigate}>
          {t(item.label)}
        </Link>
      </DropdownMenuItem>
    )
  }

  return (
    <DropdownMenuItem asChild>
      <a href={href} onClick={onNavigate}>
        {t(item.label)}
      </a>
    </DropdownMenuItem>
  )
}

export function MainNav({ isHome, isHeroOverlay }: MainNavProps) {
  const { t } = useTranslation('layout')
  const triggerClass = cn(
    'group inline-flex h-11 shrink-0 items-center gap-1 rounded-lg border border-transparent px-3 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    'data-[state=open]:border-transparent',
    isHeroOverlay
      ? 'text-white/90 hover:bg-white/10 hover:text-white data-[state=open]:bg-white/15 data-[state=open]:text-white'
      : 'text-muted-foreground hover:bg-accent hover:text-primary data-[state=open]:bg-accent data-[state=open]:text-primary',
  )

  const linkClass = cn(
    'inline-flex h-11 shrink-0 items-center rounded-lg border border-transparent px-3 text-sm font-medium transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
    isHeroOverlay
      ? 'text-white/90 hover:bg-white/10 hover:text-white'
      : 'text-muted-foreground hover:bg-accent hover:text-primary',
  )

  return (
    <nav className="flex items-center gap-0.5" aria-label={t('nav.mainNav')}>
      {mainNavTree.map((entry) => {
        if (isNavStandalone(entry)) {
          return (
            <Link key={entry.label} to={entry.href} className={linkClass}>
              {t(entry.label)}
            </Link>
          )
        }

        return (
          <DropdownMenu key={entry.label} modal={false}>
            <DropdownMenuTrigger className={triggerClass}>
              {t(entry.label)}
              <ChevronDown className="h-4 w-4 shrink-0 opacity-70 transition-transform duration-200 group-data-[state=open]:rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" sideOffset={8} className="min-w-[12rem]">
              {entry.children.map((child) => (
                <NavMenuItem key={child.href} item={child} isHome={isHome} />
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      })}
    </nav>
  )
}
