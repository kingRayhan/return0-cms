import { createApp } from "vue";
import Root from "./Root.vue";
import naive from "naive-ui";
import router from "./routes";
import "./assets/app.scss";

import { VueQueryPlugin } from "vue-query";

const app = createApp(Root);
const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

app.use(router);
app.use(naive);
app.use(VueQueryPlugin);
app.mount("#app");
