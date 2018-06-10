import VueAnalytics from 'vue-analytics'
export default ({
  Vue,
  options,
  router,
  siteData
}) => {
  Vue.use(VueAnalytics, {
    id: 'UA-120059029-1',
    router
  })
}