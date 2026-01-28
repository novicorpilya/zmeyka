import { e as useRuntimeConfig } from './server.mjs';

const useAuthApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase || "http://localhost:3001";
  const register = async (data) => {
    return await $fetch(`${apiBase}/auth/register`, {
      method: "POST",
      body: data
    });
  };
  const login = async (data) => {
    return await $fetch(`${apiBase}/auth/login`, {
      method: "POST",
      body: data
    });
  };
  return {
    register,
    login
  };
};

export { useAuthApi as u };
//# sourceMappingURL=api-DlPk5Kem.mjs.map
