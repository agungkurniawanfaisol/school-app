import { ChevronRight } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { Separator } from '@/components/ui/separator'
import {
  isInternalRoute,
  isNavStandalone,
  mainNavTree,
  resolveNavHref,
  type NavGroup,
  type NavLink,
} from '@/config/main-nav'
import { cn } from '@/lib/utils'

type MobileNavTreeProps = {
  isHome: boolean
  onNavigate?: () => void
}

function MobileNavLink({
  item,
  isHome,
  isActive,
  onNavigate,
}: {
  item: NavLink
  isHome: boolean
  isActive: boolean
  onNavigate?: () => void
}) {
  const href = resolveNavHref(item.href, isHome)
  const Icon = item.icon

  const inner = (
    <>
      {Icon && (
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            isActive
              ? 'bg-primary/15 text-primary'
              : 'bg-muted text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      <ChevronRight
        className={cn(
          'h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5',
          isActive && 'text-primary/60',
        )}
      />
    </>
  )

  const className = cn(
    'group flex min-h-12 items-center gap-3 rounded-xl px-3 text-[0.9375rem] font-medium transition-all',
    isActive
      ? 'bg-primary/8 text-primary'
      : 'text-foreground/80 hover:bg-muted/80 hover:text-foreground active:scale-[0.98]',
  )

  if (isInternalRoute(item.href)) {
    return (
      <Link to={item.href} onClick={onNavigate} className={className}>
        {inner}
      </Link>
    )
  }

  return (
    <a href={href} onClick={onNavigate} className={className}>
      {inner}
    </a>
  )
}

function StandaloneNavLink({
  item,
  isHome,
  isActive,
  onNavigate,
}: {
  item: NavLink & { standalone: true }
  isHome: boolean
  isActive: boolean
  onNavigate?: () => void
}) {
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      onClick={onNavigate}
      className={cn(
        'group flex min-h-12 items-center gap-3 rounded-xl px-3 text-[0.9375rem] font-semibold transition-all',
        isActive
          ? 'bg-primary/10 text-primary'
          : 'text-foreground hover:bg-muted/80 active:scale-[0.98]',
      )}
    >
      {Icon && (
        <span
          className={cn(
            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
            isActive
              ? 'bg-primary text-primary-foreground'
              : 'bg-primary/10 text-primary group-hover:bg-primary/15',
          )}
        >
          <Icon className="h-4 w-4" />
        </span>
      )}
      <span className="flex-1 truncate">{item.label}</span>
      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
    </Link>
  )
}

function NavGroupSection({
  group,
  isHome,
  pathname,
  onNavigate,
}: {
  group: NavGroup
  isHome: boolean
  pathname: string
  onNavigate?: () => void
}) {
  const GroupIcon = group.icon
  const hasActiveChild = group.children.some((c) => pathname === c.href)

  return (
    <AccordionItem value={group.label} className="border-none">
      <AccordionTrigger
        className={cn(
          'min-h-12 gap-3 rounded-xl px-3 py-0 text-[0.9375rem] font-semibold hover:no-underline transition-colors',
          hasActiveChild
            ? 'text-primary hover:bg-primary/5'
            : 'text-foreground hover:bg-muted/60',
        )}
      >
        <span className="flex flex-1 items-center gap-3">
          {GroupIcon && (
            <span
              className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors',
                hasActiveChild
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              <GroupIcon className="h-4 w-4" />
            </span>
          )}
          <span className="truncate">{group.label}</span>
        </span>
      </AccordionTrigger>
      <AccordionContent className="space-y-0.5 pb-1 pl-2 pt-1">
        {group.children.map((child) => (
          <MobileNavLink
            key={child.href}
            item={child}
            isHome={isHome}
            isActive={pathname === child.href}
            onNavigate={onNavigate}
          />
        ))}
      </AccordionContent>
    </AccordionItem>
  )
}

export function MobileNavTree({ isHome, onNavigate }: MobileNavTreeProps) {
  const { pathname } = useLocation()
  const groups = mainNavTree.filter((e) => !isNavStandalone(e)) as NavGroup[]
  const standalones = mainNavTree.filter(isNavStandalone)

  return (
    <div className="w-full space-y-1">
      {standalones.length > 0 && (
        <div className="space-y-0.5">
          {standalones.map((item) => (
            <StandaloneNavLink
              key={item.href}
              item={item}
              isHome={isHome}
              isActive={pathname === item.href}
              onNavigate={onNavigate}
            />
          ))}
        </div>
      )}

      {standalones.length > 0 && groups.length > 0 && (
        <Separator className="my-2" />
      )}

      <Accordion
        type="multiple"
        className="w-full space-y-0.5"
        defaultValue={groups.map((g) => g.label)}
      >
        {groups.map((group) => (
          <NavGroupSection
            key={group.label}
            group={group}
            isHome={isHome}
            pathname={pathname}
            onNavigate={onNavigate}
          />
        ))}
      </Accordion>
    </div>
  )
}
