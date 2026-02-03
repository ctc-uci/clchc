import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../../../server/api.js'

export const useUsers = ({ user, status } = {}) => {
  return useQuery({
    queryKey: ['users', { user, status }],
    queryFn: async () => {
      console.log("Fetching users (react-query)", { user });

      const params = new URLSearchParams();
      if (user) params.append("user", user);
      if (status) params.append("status", status)

      return api.users.getAll({ params });
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
  });
}

export function useUsersStats() {
  return useQuery({
    queryKey: ['usersStats'],
    queryFn: async () => {
      console.log("Fetching users stats (react-query)");

      return api.users.getAllStats();
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
  });
}

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => {
      return api.users.update(id, data)
    },
    onSuccess: () => {
      // Refetch after mutation to update frontend data
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => {
      console.log("Deleting user ", id)
      return api.users.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["usersStats"] });
    },
  });
}