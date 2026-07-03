import { Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface VisionMissionPreviewProps {
  vision?: string | null
  mission?: string | null
}

function PreviewBlock({
  title,
  content,
  emptyHint,
}: {
  title: string
  content?: string | null
  emptyHint: string
}) {
  const trimmed = content?.trim()

  return (
    <Card className="border-primary/10 bg-secondary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          {title === 'Visi' && <Target className="h-5 w-5 text-[var(--gold-accent)]" aria-hidden />}
          {title}
        </CardTitle>
        <CardDescription>Pratinjau tampilan di beranda</CardDescription>
      </CardHeader>
      <CardContent>
        {trimmed ? (
          <p className={title === 'Misi' ? 'whitespace-pre-line leading-relaxed text-muted-foreground' : 'leading-relaxed text-muted-foreground'}>
            {trimmed}
          </p>
        ) : (
          <p className="text-sm italic text-muted-foreground">{emptyHint}</p>
        )}
      </CardContent>
    </Card>
  )
}

export function VisionMissionPreview({ vision, mission }: VisionMissionPreviewProps) {
  return (
    <div className="space-y-4" role="region" aria-live="polite" aria-label="Pratinjau visi dan misi">
      <PreviewBlock title="Visi" content={vision} emptyHint="Visi belum diisi — akan disembunyikan di beranda." />
      <PreviewBlock title="Misi" content={mission} emptyHint="Misi belum diisi — akan disembunyikan di beranda." />
    </div>
  )
}
