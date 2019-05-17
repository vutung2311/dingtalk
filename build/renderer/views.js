const views = [
  {
    key: 'errorWin',
    title: 'Network Error'
  },
  {
    key: 'settingWin',
    title: 'Setting'
  },
  {
    key: 'aboutWin',
    title: 'About'
  }
]

module.exports = {
  entries (entry) {
    return views.reduce((entries, view) => ({ ...entries, [view.key]: entry(view) }), {})
  },
  htmlWebpackPlugins (pligin) {
    return views.reduce((plugins, view) => ([...plugins, pligin(view)]), [])
  }
}
