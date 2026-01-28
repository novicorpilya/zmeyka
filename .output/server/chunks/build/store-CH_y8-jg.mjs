import { a as buildAssetsURL } from '../routes/renderer.mjs';
import { defineStore } from 'pinia';

const _imports_0 = "" + buildAssetsURL("logo.BdsHJAFn.png");
const useUserStore = defineStore("user", {
  state: () => ({
    user: null,
    token: null,
    isLoggedIn: false
  }),
  actions: {
    init() {
    },
    setUser(user, token) {
      this.user = user;
      this.token = token;
      this.isLoggedIn = !!user;
    },
    logout() {
      this.user = null;
      this.token = null;
      this.isLoggedIn = false;
    }
  }
});

export { _imports_0 as _, useUserStore as u };
//# sourceMappingURL=store-CH_y8-jg.mjs.map
