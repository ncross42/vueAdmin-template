import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 표시줄
import 'nprogress/nprogress.css'// Progress 표시줄스타일
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 확인 권한

const whiteList = ['/login'] // 허용 목록을 리디렉션하지 않습니다.
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 사용자 정보 가져 오기
          next()
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
