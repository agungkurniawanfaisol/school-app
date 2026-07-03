import { BookOpen, Newspaper, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthMe } from '@/hooks/useAuth'

const quickLinks = [
  { href: '/admin/news', label: 'Kelola Berita', description: 'Tambah dan edit berita sekolah', icon: Newspaper },
  { href: '/admin/teachers', label: 'Kelola Guru', description: 'Kelola data guru dan pengajar', icon: Users },
  { href: '/admin/curriculums', label: 'Kelola Kurikulum', description: 'Kelola program kurikulum', icon: BookOpen },
]

export function DashboardPage() {
  const { data: user } = useAuthMe()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Selamat datang, {user?.name ?? 'Admin'}!</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quickLinks.map((link) => {
          const Icon = link.icon
          return (
            <Link key={link.href} to={link.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="flex flex-row items-center gap-4 space-y-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{link.label}</CardTitle>
                    <CardDescription>{link.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-primary">Buka →</p>
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
