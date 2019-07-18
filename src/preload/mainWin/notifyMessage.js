import notify from './notify'
import { ipcRenderer } from 'electron'

export default injector => {
  let oldCount = 0
  injector.setTimer(() => {
    let count = 0
    const $mainMenus = document.querySelector('#menu-pannel>.main-menus')
    if ($mainMenus) {
      const $menuItems = $mainMenus.querySelectorAll('li.menu-item')
      $menuItems.forEach($item => {
        const $unread = $item.querySelector('all-conv-unread-count em.ng-binding')
        if ($unread) {
          const badge = parseInt($unread.innerText)
          count += isNaN(badge) ? 0 : badge
        }
      })
    }
    if (oldCount !== count) {
      // 当有新消息来时才发送提示信息
      if (count !== 0 && oldCount < count) {
        const msg = `You have ${count} unread message(s)！`
        /**
         * 尝试修复linux消息导致系统崩溃问题
         * https://github.com/nashaofu/dingtalk/issues/176
         */
        if (process.platform === 'linux') {
          notify(msg)
        } else {
          ipcRenderer.send('notify', msg)
        }
      }
      oldCount = count
      ipcRenderer.send('MAINWIN:badge', count)
    }
  })
}
