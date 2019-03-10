import Vue from 'vue'
import Router from 'vue-router'
import FatherSlot from '@/demos/FatherSlot'
import Big from '@/demos/componentKeep/big'
import HelloMock from '@/demos/hellomock'
import Note from '@/views/note'
import Contact from '@/views/contact'
import Uploader from '@/views/uploader'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Uploader',
      component: Uploader
    },
    {
      path: '/fathertslot',
      name: 'FatherSlot',
      component: FatherSlot
    },
    {
      path: '/big',
      name: 'Big',
      component: Big
    },
    {
      path: '/mock',
      name: 'HelloMock',
      component: HelloMock
    },
    {
      path: '/note',
      name: 'Note',
      component: Note
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    }
  ]
})
