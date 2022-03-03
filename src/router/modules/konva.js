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
      path: 'designWorkbench',
      component: () => import('@/views/konva/designWorkbench'),
      name: 'DesignWorkbench',
      meta: { title: 'Design Workbench', noCache: true }
    },
    {
      path: 'keyboard',
      component: () => import('@/views/konva/group'),
      name: 'konvaGroupUngroup',
      meta: { title: 'Konva Group', noCache: true }
    },
    {
      path: 'clipWorkbench',
      component: () => import('@/views/konva/clipWorkbench'),
      name: 'ClipWorkbench',
      meta: { title: 'Clip Workbench', noCache: true }
    }
  ]
}

export default konvaRouer
