import { useEffect } from 'react'

interface PageMetaProps {
  title: string
  description?: string
}

export function PageMeta({ title, description }: PageMetaProps) {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title.includes('Nurul Hikmah') ? title : `${title} | Nurul Hikmah`

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    const created = !meta
    if (!meta) {
      meta = document.createElement('meta')
      meta.name = 'description'
      document.head.appendChild(meta)
    }
    const prevDescription = meta.content
    if (description) meta.content = description

    return () => {
      document.title = prevTitle
      if (description) meta!.content = prevDescription
      if (created && meta?.parentNode) meta.parentNode.removeChild(meta)
    }
  }, [title, description])

  return null
}
