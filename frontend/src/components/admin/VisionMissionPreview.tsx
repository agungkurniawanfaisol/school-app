import { useTranslation } from 'react-i18next'
import { CheckCircle2, Target } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface VisionMissionPreviewProps {
  aboutImage?: string
  schoolName?: string
  schoolTagline?: string | null
  vision?: string | null
  mission?: string | null
}

function parseMissionLines(mission: string): string[] {
  return mission
    .split('\n')
    .map((line) => line.replace(/^\d+\.\s*/, '').trim())
    .filter(Boolean)
}

export function VisionMissionPreview({
  aboutImage,
  schoolName,
  schoolTagline,
  vision,
  mission,
}: VisionMissionPreviewProps) {
  const { t } = useTranslation('admin')
  const visionTrimmed = vision?.trim()
  const missionTrimmed = mission?.trim()
  const missionItems = missionTrimmed ? parseMissionLines(missionTrimmed) : []

  return (
    <div className="space-y-4" role="region" aria-live="polite" aria-label={t('components.visionMission.previewRegion')}>
      {aboutImage ? (
        <div className="overflow-hidden rounded-2xl border border-primary/15 shadow-sm">
          <div className="relative">
            <img src={aboutImage} alt="" className="aspect-[4/3] w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
              <p className="text-base font-bold">{schoolName}</p>
              {schoolTagline ? <p className="text-sm text-white/80">{schoolTagline}</p> : null}
            </div>
          </div>
        </div>
      ) : null}

      <Card className="border-primary/10 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">
            <Target className="h-5 w-5 text-[var(--gold-accent)]" aria-hidden />
            {t('form.vision')}
          </CardTitle>
          <CardDescription>{t('components.visionMission.homePreviewDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          {visionTrimmed ? (
            <p className="leading-relaxed text-muted-foreground">{visionTrimmed}</p>
          ) : (
            <p className="text-sm italic text-muted-foreground">{t('components.visionMission.visionEmpty')}</p>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/10 bg-secondary/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-primary">{t('form.mission')}</CardTitle>
          <CardDescription>{t('components.visionMission.homePreviewDesc')}</CardDescription>
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
            <p className="text-sm italic text-muted-foreground">{t('components.visionMission.missionEmpty')}</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
