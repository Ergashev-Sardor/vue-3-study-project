import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      // path: "*",
      path: '/:catchAll(.*)',
      redirect: '/'
    },
    {
      path: '/',
      name: 'home',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/Dashboard.vue')
    },
    {
      path: '/comments',
      name: 'Comments',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/Comments.vue')
    },
    {
      path: '/albums',
      name: 'Albums',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/Albums.vue')
    },
    {
      path: '/photos',
      name: 'Photos',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/Photos.vue')
    },
    {
      path: '/users',
      name: 'Users',
      meta: {
        requiresAuth: true
      },
      component: () => import('@/views/Users.vue')
    },
    {
      path: '/auth',
      name: 'auth',
      meta: {
        requiresAuth: false
      },
      component: () => import('@/views/Auth.vue')
    }
  ]
})

router.beforeEach((to) => {
  const isUserRegistered = localStorage.getItem('token')

  if (to.meta.requiresAuth && !isUserRegistered) {
    return {
      path: '/auth',
      query: { redirect: to.fullPath }
    }
  }
})

export default router
