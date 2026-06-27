import { useQuery } from '@tanstack/react-query'
import { getStaffProfile } from '@/lib/admin/profile'

export const staffProfileKeys = {
  all: ['staffProfile'] as const,
  current: () => [...staffProfileKeys.all, 'current'] as const,
}

export function useStaffProfile() {
  return useQuery({
    queryKey: staffProfileKeys.current(),
    queryFn: getStaffProfile,
  })
}
