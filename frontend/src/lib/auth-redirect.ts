import type { User, UserRole } from '@/types'

function isSafeRedirectPath(path: string): boolean {
  return path.startsWith('/') && !path.startsWith('//')
}

export function resolvePostLoginPath(user: User, redirect?: string | null): string {
  if (redirect && isSafeRedirectPath(redirect)) {
    if (user.role === 'pendaftar' && redirect.startsWith('/pmb')) {
      return redirect
    }

    if (user.role !== 'pendaftar' && redirect.startsWith('/admin')) {
      return redirect
    }
  }

  return getAuthHomePath(user.role)
}

export function getAuthHomePath(role: UserRole): string {
  switch (role) {
    case 'pendaftar':
      return '/pmb/daftar'
    case 'admin_pmb':
      return '/admin/pmb-registrations'
    case 'guru':
      return '/admin/profile'
    default:
      return '/admin'
  }
}

export function getAuthHomePathForUser(user: User | null | undefined): string {
  if (!user) {
    return '/admin/login'
  }

  return getAuthHomePath(user.role)
}
