import { CheckCircle2, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface VisionMissionPreviewProps {
  vision?: string | null
  mission?: string | null
}

function parseMissionLines(mission: string): string[] {
  return mission
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
}

export function VisionMissionPreview({ vision, mission }: VisionMissionPreviewProps) {
  const visionTrimmed = vision?.trim()
  const missionTrimmed = mission?.trim()
  const missionItems = missionTrimmed ? parseMissionLines(missionTrimmed) : []

  return (
    <div className="space-y-4" role="region" aria-live="polite" aria-label="Pratinjau visi dan misi">
      <Card className="border-primary/10 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5 text-[var(--gold-accent)]" aria-hidden />
            Visi
          </CardTitle>
          <CardDescription>Pratinjau tampilan di beranda</CardDescription>
        </CardHeader>
        <CardContent>
          {visionTrimmed ? (
            <p className="leading-relaxed text-muted-foreground">{visionTrimmed}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">Visi belum diisi — akan disembunyikan di beranda.</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/10 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            Misi
          </CardTitle>
          <CardDescription>Pratinjau tampilan di beranda</CardDescription>
        </CardHeader>
        <CardContent>
          {missionItems.length > 0 ? (
            <ol className="space-y-2.5">
              {missionItems.map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden />
                  <span className="leading-relaxed text-muted-foreground">{item}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm italic text-muted-foreground">Misi belum diisi — akan disembunyikan di beranda.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
