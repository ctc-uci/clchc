import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/api.js'

export const useUsers = ({ user, status } = {}) => {
  const { users } = useApi()

  return useQuery({
    queryKey: ['users', { user, status }],
    queryFn: async () => {
      // console.log("Fetching users (react-query)", user, status );

      const params = new URLSearchParams();
      if (user) params.append("user", user);
      if (status) params.append("status", status)

      return users.getAll({ params });
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
    suspense: false,
  });
}

export const useUserByFirebaseUid = (uid) => {
  const { users } = useApi()

  return useQuery({
    queryKey: ["user", uid],
    queryFn: async () => {
      // console.log("Fetching user by firebase uid (react-query)", uid);
      return users.getByFirebaseUid(uid);
    },
    enabled: !!uid,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 60 * 1000
  });
};

export function useUsersStats() {
  const { users } = useApi()

  return useQuery({
    queryKey: ['usersStats'],
    queryFn: async () => {
      // console.log("Fetching users stats (react-query)");

      return users.getAllStats();
    },
    staleTime: 60 * 1000, // 1 min
    refetchInterval: 60 * 1000, // 1 min
  });
}

export const useUpdateUser = () => {
  const { users } = useApi()
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => {
      return users.update(id, data)
    },
    onSuccess: () => {
      // Refetch after mutation to update frontend data
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
    },
  });
};

export const useUpdateUserByFirebaseUid = () => {
  const { users } = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ uid, data }) => {
      return users.updateByFirebaseUid(uid, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });

      if (variables?.uid) {
        queryClient.invalidateQueries({ queryKey: ["user", variables.uid] });
      }

    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  const { users } = useApi()

  return useMutation({
    mutationFn: (id) => {
      // console.log("Deleting user ", id)
      return users.delete(id)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["usersStats"] });
    },
  });
}

export const useDeleteUserByFirebaseUid = () => {
  const queryClient = useQueryClient();
  const { users } = useApi();

  return useMutation({
    mutationFn: (uid) => users.deleteByFirebaseUid(uid),
    onSuccess: (_, uid) => {
      queryClient.invalidateQueries({ queryKey: ["users"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["user"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["usersStats"] });

      if (uid) {
        queryClient.invalidateQueries({ queryKey: ["user", uid] });
      }
    },
  });
};