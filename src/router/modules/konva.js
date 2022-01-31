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
      path: 'workbench',
      component: () => import('@/views/konva/workbench'),
      name: 'Workbench',
      meta: { title: 'Konva Workbench', noCache: true }
    },
    {
      path: 'keyboard',
      component: () => import('@/views/konva/group'),
      name: 'konvaGroupUngroup',
      meta: { title: 'Konva Group', noCache: true }
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
