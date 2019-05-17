import {
  app,
  dialog,
  shell
} from 'electron'
import axios from 'axios'
import { autoUpdater } from 'electron-updater'

export default dingtalk => () => {
  autoUpdater.on('update-downloaded', info => {
    dialog.showMessageBox(dingtalk.$mainWin, {
      type: 'question',
      title: 'Update ready',
      message: `Version ${info.version} is already downloaded. Update now?`,
      noLink: true,
      buttons: ['是', '否']
    }, index => {
      if (index === 0) {
        autoUpdater.quitAndInstall()
      }
    })
  })

  autoUpdater.on('error', e => {
    axios.get('https://api.github.com/repos/nashaofu/dingtalk/releases/latest')
      .then(({ data }) => {
        // 检查版本号
        // 如果本地版本小于远程版本则更新
        if (data.tag_name.slice(1) > app.getVersion()) {
          dialog.showMessageBox(dingtalk.$mainWin, {
            type: 'question',
            title: 'Update available',
            message: 'There is a new version update, do you want to go to download the latest installation package immediately?',
            noLink: true,
            buttons: ['Yes', 'No']
          }, index => {
            if (index === 0) {
              shell.openExternal('https://github.com/nashaofu/dingtalk/releases/latest')
            }
          })
        }
      })
  })

  if (dingtalk.setting.autoupdate) {
    autoUpdater.checkForUpdates()
  }
}
