## وبلاگ

<MarkdownCard v-for="post in $site.themeConfig.sidebar.home" :image="post.thumbnail">
  <sub>{{post.date}}</sub>\
  <router-link :to="{path: post.link}"> {{post.title}} </router-link>
  
  {{post.description}}
  

</MarkdownCard>

