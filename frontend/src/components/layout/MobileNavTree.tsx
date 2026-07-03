import { Link } from 'react-router-dom'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { isInternalRoute, mainNavTree, resolveNavHref, type NavLink } from '@/config/main-nav'
import { cn } from '@/lib/utils'

type MobileNavTreeProps = {
  isHome: boolean
  onNavigate?: () => void
}

function MobileNavLink({
  item,
  isHome,
  onNavigate,
}: {
  item: NavLink
  isHome: boolean
  onNavigate?: () => void
}) {
  const href = resolveNavHref(item.href, isHome)
  const className =
    'flex min-h-11 items-center rounded-lg px-4 pl-6 text-base font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-primary'

  if (isInternalRoute(item.href)) {
    return (
      <Link to={item.href} onClick={onNavigate} className={className}>
        {item.label}
      </Link>
    )
  }

  return (
    <a href={href} onClick={onNavigate} className={className}>
      {item.label}
    </a>
  )
}

export function MobileNavTree({ isHome, onNavigate }: MobileNavTreeProps) {
  return (
    <Accordion type="multiple" className="w-full" defaultValue={mainNavTree.map((g) => g.label)}>
      {mainNavTree.map((group) => (
        <AccordionItem key={group.label} value={group.label} className="border-border/60">
          <AccordionTrigger
            className={cn(
              'min-h-11 rounded-lg px-4 py-3 text-base font-semibold text-foreground hover:no-underline hover:bg-secondary/60',
            )}
          >
            {group.label}
          </AccordionTrigger>
          <AccordionContent className="space-y-0.5 pb-2">
            {group.children.map((child) => (
              <MobileNavLink
                key={child.href}
                item={child}
                isHome={isHome}
                onNavigate={onNavigate}
              />
            ))}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  )
}
