<template>
  <div class="personal-message-container">
    <router-link :to="{path:'/UserPanel',query:{UserId:$store.state.userInfo.userId}}">
      <i class="iconfont icon-zhuye"></i>个人主页
    </router-link>
    <div @click="logout" style="cursor:pointer;"><i class="iconfont icon-guanji"></i>退出登录</div>
  </div>
</template>

<script>
export default {
  name: 'PersonalMessage',
  methods: {
    async logout () {
      localStorage.removeItem('cookie')
      this.$store.state.islogin = false
      this.$http.get('/register/anonimous').then(res => {
        localStorage.setItem('cookie', res.data.cookie)
        location.reload()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .personal-message-container{
    background-color: navajowhite;
    border-radius: 15px;
    height: 100px;
    line-height: 50px;
    width: 100px;
    .icon-zhuye{
      font-weight: bold;
    }
    animation: fadeIn 0.5s linear;
  }
  @keyframes fadeIn {
    0%{
      opacity: 0;
    }
    100%{
      opacity: 1;
    }
  }
</style>
