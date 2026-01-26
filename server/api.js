const API_BASE = 'http://localhost:3001';  // in production, will need to supply an alternate API_BASE for our backend

export const api = {
  providers: {
    getAll: async () => {
      const res = await fetch(`${API_BASE}/providers`);
      if (!res.ok) {
        throw new Error(`Failed to fetch providers: ${res.status}`);
      }
      return res.json();
    },
    create: async(data) => {
        const res = await fetch(`${API_BASE}/providers`, {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error(`Failed to create provider: ${res.status}`);
        }
        return res.json()
    }
  },
  directoryCategories: {
    getAll: async() => {
        const res = await fetch(`${API_BASE}/directoryCategories`);
        if (!res.ok) {
            throw new Error(`Failed to get directory categories: ${res.status}`)
        }
        return res.json()
    }
  },
  tags: {
    getAll: async() => {
        const res = await fetch(`${API_BASE}/tags`);
        if (!res.ok) {
            throw new Error(`Failed to get tags: ${res.status}`)
        }
        return res.json()
    }
  },
  quotas: {
    getAll: async() => {
        const res = await fetch(`${API_BASE}/quota/details`);
        if (!res.ok) {
            throw new Error(`Failed to getch quotas: ${res.status}`);
        }
        return res.json();
    },
    getById: async(id) => {
        const res = await fetch(`${API_BASE}/quota/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to fetch quota ${id}: ${res.status}`);
        }
        return res.json();
    },
    update: async(id, data) => {
        const res = await fetch(`${API_BASE}/quota/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" }, 
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error(`Failed to update quota ${id}: ${res.status}`);
        }
        return res.json()
    },
    create: async(data) => {
        const res = await fetch(`${API_BASE}/quota`, {
            method: "POST",
            headers: {"Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!res.ok) {
            throw new Error(`Failed to create quota: ${res.status}`);
        }
        return res.json()
    }
  },
  users: {
    getAll: async() => {
        const res = await fetch(`${API_BASE}/users-js`);
        if (!res.ok) {
            throw new Error(`Failed to get users: ${res.status}`);
        }
        return res.json()
    },
    delete: async(id) => {
        const res = await fetch(`${API_BASE}/users-js/${id}`);
        if (!res.ok) {
            throw new Error(`Failed to delete user ${id}: ${res.status}`);
        }
        return res.json()
    }
  }
};