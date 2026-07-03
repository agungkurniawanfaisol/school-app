import { GraduationCap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function PmbCtaSection() {
  return (
    <section className="section-padding bg-primary text-primary-foreground">
      <div className="container-page text-center">
        <GraduationCap className="mx-auto mb-4 h-12 w-12 opacity-90" />
        <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Pendaftaran Siswa Baru</h2>
        <p className="mx-auto mb-8 max-w-2xl text-lg opacity-90">
          Bergabunglah bersama kami! Pendaftaran PMB tahun ajaran baru telah dibuka. Daftarkan putra-putri Anda sekarang.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg" variant="secondary">
            <Link to="/pmb/daftar">Daftar Sekarang</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10">
            <Link to="/pmb">Info PMB</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
