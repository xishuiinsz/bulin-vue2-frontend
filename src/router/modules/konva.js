/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

const konvaRouer = {
  path: '/konva',
  component: Layout,
  redirect: 'noRedirect',
  name: 'Konva',
  meta: {
    title: 'Konva',
    icon: 'qq'
  },
  children: [
    {
      path: 'keyboard',
      component: () => import('@/views/konva/keyboard'),
      name: 'KeyboardChart',
      meta: { title: 'Keyboard Chart', noCache: true }
    },
    {
      path: 'line',
      component: () => import('@/views/konva/line'),
      name: 'LineChart',
      meta: { title: 'Line Chart', noCache: true }
    },
    {
      path: 'mix-chart',
      component: () => import('@/views/konva/mix-chart'),
      name: 'MixChart',
      meta: { title: 'Mix Chart', noCache: true }
    }
  ]
}

export default konvaRouer
