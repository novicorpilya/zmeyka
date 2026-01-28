import { e as useRuntimeConfig } from "../server.mjs";
import "vue";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/klona/dist/index.mjs";
import "#internal/nuxt/paths";
import "C:/Users/novik/OneDrive/Рабочий стол/zmeyka/node_modules/defu/dist/defu.mjs";
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
export {
  useAuthApi as u
};
//# sourceMappingURL=api-DlPk5Kem.js.map
