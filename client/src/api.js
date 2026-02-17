import { useBackendContext } from "@/contexts/hooks/useBackendContext";

export const useApi = () => {
  const { backend } = useBackendContext();

  return {
    providers: {
      getAll: async ({ params }) => {
        const res = await backend.get("/providers", { params });
        return res.data;
      },
      getSummary: async () => {
        const res = await backend.get("/providers/summary");
        return res.data;
      },
    },
    directoryCategories: {
      getAll: async () => {
        const res = await backend.get("/directoryCategories");
        return res.data;
      },
      create: async (data) => {
        const res = await backend.post("/directoryCategories", data);
        return res.data;
      },
    },
    tags: {
      getAll: async () => {
        const res = await backend.get("/tags");
        return res.data;
      },
    },
    quotas: {
      getAll: async ({ params }) => {
        const res = await backend.get("/quota/details", { params });
        return res.data;
      },
      getById: async (id) => {
        const res = await backend.get(`/quota/${id}`);
        return res.data;
      },
      update: async (id, data) => {
        const res = await backend.put(`/quota/${id}`, data);
        return res.data;
      },
      create: async (data) => {
        const res = await backend.post("/quota", data);
        return res.data;
      },
    },
    users: {
      getAll: async ({ params }) => {
        const res = await backend.get("/users", { params });
        return res.data;
      },
      getAllStats: async () => {
        const res = await backend.get("/users/stats");
        return res.data;
      },
      getByFirebaseUid: async(uid) => {
        const res = await backend.get(`/users/firebase/${uid}`);
        return res.data;
      },
      delete: async (id) => {
        const res = await backend.delete(`/users/${id}`);
        return res.data;
      },
      update: async (id, data) => {
        const res = await backend.put(`/users/${id}`, data);
        return res.data;
      },
    },
    locations: {
      getAll: async () => {
        const res = await backend.get("/location");
        return res.data;
      },
    },
    versionLogs: {
      getAll: async ({ params }) => {
        const res = await backend.get("/versionLog/details", { params });
        return res.data;
      }
    },
  };
};
