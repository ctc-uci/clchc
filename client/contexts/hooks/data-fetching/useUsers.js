import { useQuery } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: api.users.getAll,
    refetchInterval: 60 * 1000, // 1 min
  });
}