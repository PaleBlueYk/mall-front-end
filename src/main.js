import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import VueRouter from 'vue-router';

import App from './App.vue';
import Login from './components/Login.vue';
import Home from './components/Home.vue';
import Product from './components/Product.vue';
import Cart from './components/Cart.vue';
import Registered from './components/Registered.vue';
import NotFound from './components/NotFund.vue';

Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.config.productionTip = false

// Router
const router = new VueRouter({
  routes: [
    {
      path: '/', component: Home, name: 'home', children: [
        { path: '', component: Product }, { path: 'cart', component: Cart }
      ]
    },
    { path: '/login', component: Login, name: 'login' },
    {path: '/registered',component: Registered, name: 'registered'},
    { path: '*', component: NotFound, name: 'error' }
  ],
  mode: "history"
})

//登录拦截器
router.beforeEach((to, from, next) => {
  if (from.path == '/login' || to.path == '/registered') {
    next();
    return;
  }
  fetch('/api/user/status?'+new Date().getTime() , {
    headers: { 'Token': window.sessionStorage.getItem('token') }
  }).then(rep => rep.json())
    .then(data => {
      if (data.code === 401 && to.path != '/login') {
        next('/login');
        return;
      } else {
        window.sessionStorage.setItem('nickname', data.object.nickname);
        window.sessionStorage.setItem('username', data.object.username);
        next();
      }
    })
})

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
