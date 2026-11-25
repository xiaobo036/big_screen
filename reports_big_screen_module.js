import App from './reports_big_screen.js';

import BigScreenUtil from './reports_big_screen_utils.js';

const { createApp } = Vue;

const app = createApp(App);

const utils = new BigScreenUtil();

app.provide('utils', utils).mount('#app');
