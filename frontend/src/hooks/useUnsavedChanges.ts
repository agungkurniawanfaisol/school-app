import { useEffect } from 'react'
import { useBlocker } from 'react-router-dom'

export function useUnsavedChanges(isDirty: boolean, message = 'Perubahan belum disimpan. Yakin ingin meninggalkan halaman?') {
  useEffect(() => {
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }
    window.addEventListener('beforeunload', onBeforeUnload)
    return () => window.removeEventListener('beforeunload', onBeforeUnload)
  }, [isDirty])

  const blocker = useBlocker(isDirty)

  useEffect(() => {
    if (blocker.state !== 'blocked') return
    const leave = window.confirm(message)
    if (leave) blocker.proceed()
    else blocker.reset()
  }, [blocker, message])
}
