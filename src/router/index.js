import {createRouter, createWebHashHistory} from "vue-router"

const routes = [
  { name: 'Login', path: '/login', component: () => import("../views/login/index.vue") },
  {
    name: 'Home',
    path: '/',
    component: () => import("../views/home/index.vue"),
    children: [
      {
        name: 'Index',
        path: '',
        component: () => import("../views/home/views/index/index.vue")
      },
      {
        name: 'Post',
        path: 'post',
        component: () => import("../views/home/views/post/index.vue")
      },
      {
        name: 'User',
        path: 'user',
        component: () => import("../views/home/views/user/index.vue")
      },
      {
        name: 'Report',
        path: 'report',
        component: () => import("../views/home/views/report/index.vue")
      }
    ]
  },
]

const router = createRouter({
  // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
  history: createWebHashHistory(),
  routes, // `routes: routes` 的缩写
})

export default router