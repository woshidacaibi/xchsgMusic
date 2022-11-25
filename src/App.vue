<template>
  <div class="app-container">
    <div class="header">
      <MyHeader/>
    </div>
      <div v-show="isCenter" class="center">
        <Center :islogin="$store.state.islogin"/>
      </div>
    <keep-alive>
      <div v-show="isCenter" class="footer">
        <AudioPlayer/>
      </div>
    </keep-alive>
    <vue-scroll v-if="!isCenter" :ops="$store.state.ops" class="wrapper">
      <router-view></router-view>
    </vue-scroll>
    <login-panel v-if="$store.state.logining"/>
  </div>
</template>

<script>
import MyHeader from '@/components/Headers/Header'
import loginPanel from '@/components/loginPanel'
import Center from '@/components/Center/Center'
import AudioPlayer from '@/components/footer/AudioPlayer'

export default {
  name: 'App',
  components: {
    AudioPlayer,
    MyHeader,
    loginPanel,
    Center
  },
  data () {
    return {
      isLeftShow: true
    }
  },
  watch: {
    islogin () {
      this.checkisLogin()
    }
  },
  methods: {
    async checkisLogin () {
      if (!localStorage.getItem('cookie')) {
        this.$store.state.islogin = false
        this.$http.get('/register/anonimous').then(res => {
          localStorage.setItem('cookie', res.data.cookie)
        })
      } else {
        this.$http.get('/login/status', {
          params: {
            cookie: localStorage.getItem('cookie')
          }
        }).then((res) => {
          if (res.data.data.account.status === 0) {
            this.$store.state.islogin = true
            this.$store.state.userInfo = { ...res.data.data.profile }
            this.getLikeIds()
          } else {
            this.$http.get('/register/anonimous').then(res => {
              localStorage.setItem('cookie', res.data.cookie)
            })
            this.$store.state.islogin = false
          }
        })
      }
    },
    getLikeIds () {
      this.$http.get('/likelist', {
        params: {
          uid: this.$store.state.userInfo.userId,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }).then((res) => {
        this.$store.state.likesongids = res.data.ids
      })
    }
  },
  computed: {
    isCenter () {
      return this.$store.state.hasAsideAndPlayer
    },
    islogin () {
      return this.$store.state.islogin
    }
  },
  created () {
    this.checkisLogin()
  }
}
</script>

<style lang="less">
.app-container {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  min-width: 740px;
  min-height: 400px;
}

.header {
  flex-shrink: 0;
  height: 60px;
}

.center {
  flex: 1;
  background-color: whitesmoke;
  margin-bottom: 65px;
  position: relative;

  .left {
    height: 100%;
    background: whitesmoke;
  }
}

.footer {
  height: 60px;
  flex-shrink: 0;
  position: fixed;
  left: 0;
  top: 630px;
  width: 100%;
}
.wrapper{
  width: 1000px;
  height: 100%;
  margin: 0 auto;
}
</style>
