import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login.vue'
import Home from '@/components/Home.vue'
import Users from '@/components/users/Users.vue'
import Right from '@/components/rights/Right.vue'
import Roles from '@/components/rights/Roles.vue'
import Categories from '@/components/product/Categories.vue'
import Goods from '@/components/product/Goods.vue'
import Add from '@/components/product/Add.vue'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: 'home',
      component: Home,
      children: [
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/rights',
          name: 'rights',
          component: Right
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/categories',
          name: 'categories',
          component: Categories
        },
        {
          path: '/goods',
          name: 'goods',
          component: Goods
        },
        {
          path: '/goods-add',
          name: 'goods-add',
          component: Add
        }
      ]
    }
  ]
})
router.beforeEach((to, from, next) => {
  // 获取token
  let token = localStorage.getItem('token')
  // 判断token是否有值
  if (to.path === '/login' || token) {
    next()
  } else {
    next('/login')
  }
})
export default router
