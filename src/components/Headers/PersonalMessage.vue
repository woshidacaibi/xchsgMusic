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
      this.$confirm('此操作将清空该账号于本网站的各种信息，请确认退出', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        localStorage.clear()
        this.$store.state.islogin = false
        this.$http.get('/register/anonimous').then(res => {
          localStorage.setItem('cookie', res.data.cookie)
          this.$router.push('/')
          location.reload()
          this.$message({
            type: 'success',
            message: '注销成功!'
          })
        })
      }).catch(() => {
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
