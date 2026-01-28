import { e as useRuntimeConfig } from "../server.mjs";
const useApi = () => {
  const config = useRuntimeConfig();
  const apiBase = config.public.apiBase;
  const fetchApi = async (endpoint, options = {}) => {
    return await $fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      }
    });
  };
  return {
    fetchApi
  };
};
const useCourseApi = () => {
  const { fetchApi } = useApi();
  return {
    getCourses: () => fetchApi("/courses"),
    getCourse: (id) => fetchApi(`/courses/${id}`),
    createCourse: (data) => fetchApi("/courses", { method: "POST", body: data }),
    updateCourse: (id, data) => fetchApi(`/courses/${id}`, { method: "PATCH", body: data }),
    deleteCourse: (id) => fetchApi(`/courses/${id}`, { method: "DELETE" })
  };
};
export {
  useCourseApi as u
};
//# sourceMappingURL=index-DbT3jZut.js.map
