import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'loginStart',
      meta: {
        hideNavbar: true
      },
      component: () => import('../views/login.vue')
    },
    {
      path: '/mobile/Dashboard',
      name: 'mDashboard',

      component: () => import('../views/mobile/MobileDashboard.vue')
    },
    {
      path: '/sensorsOverview',
      name: 'sensorsOverview',

      component: () => import('../views/sensorsOverview.vue')
    },
    {
      path: '/documentation',
      name: 'Documentation',

      component: () => import('../views/Documentation.vue')
    },
    {
      path: '/cleaning_agents',
      name: 'cleaning_agents',

      component: () => import('../views/cleaning_agents.vue')
    },
    {
      path: '/CompanySettings',
      name: 'CompanySettings',

      component: () => import('../views/CompanySettings.vue')
    },

    {
      path: '/newUser',
      name: 'newUser',
      component: () => import('../views/newUser.vue')
    },
    {
      path: '/UserSettings',
      name: 'UserSettings',
      component: () => import('../views/UserSettings.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        hideNavbar: true
      },
      component: () => import('../views/login.vue')
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/qrcode',
      name: 'QR-Code',
      component: () => import('../views/QrCodesView.vue')
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      component: () => import('../views/Dashboard.vue')
    },
    {
      path: '/oilChange',
      name: 'OilChange',
      component: () => import('../views/OilChangeView.vue')
    },
    {
      path: '/history',
      name: 'History',
      component: () => import('../views/History.vue')
    },
    {
      path: '/company',
      name: 'Company Settings',
      component: () => import('../views/CompanySettings.vue')
    },
    {
      path: '/QrCodeGenerator',
      name: 'QrCodeGenerator',
      component: () => import('../views/QrCodeGenerator.vue')
    }
  ]
})

export default router
