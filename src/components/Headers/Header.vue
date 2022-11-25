<template>
  <div class="Header-container">
    <div class="left">
      <router-link to="/" class="logo">
        <img src="@/assets/logo.png" alt="">
        <span style="font-weight: bolder">TeriTeri</span>
      </router-link>
      <div ref="searchBox" class="nav">
        <div class="control">
          <button @click="$router.back()"><i class="el-icon-arrow-left"></i></button>
          <button @click="$router.forward()"><i class="el-icon-arrow-right"></i></button>
        </div>
        <div  ref="inputBox" class="input-box" @click="searchBoxLive=true">
          <label for="searchMusic" class="el-icon-search"></label>
          <input @keyup.enter="toSearchPanel" v-model="searchKey" id="searchMusic" placeholder="搜索" type="text"/>
        </div>
        <SearchBox v-show="searchBoxLive" :keyword="searchKey" :hot-list="hotList" class="search-box"></SearchBox>
      </div>
    </div>
    <div ref="messageBox" class="message-box right" @click="boxShow=!boxShow">
      <div v-if="$store.state.islogin">
        <img :src="userInfo.avatarUrl" class="userImg">
        <a>{{userInfo.nickname}}
          <i v-if="!boxShow" class="iconfont icon-xiangxia"></i>
          <i v-if="boxShow" class="iconfont icon-xiangshang"></i>
        </a>
      </div>
      <div v-else>
        <img src="@/assets/default_user.jpg" class="userImg">
        <a href="#" @click="$store.state.logining=true">未登录, 请登录</a>
      </div>
      <div v-if="$store.state.islogin && boxShow" id="message-panel">
        <PersonalMessage></PersonalMessage>
      </div>
    </div>
  </div>
</template>

<script>
import SearchBox from '@/components/Headers/Search/SearchBox'
import PersonalMessage from '@/components/Headers/PersonalMessage'
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Header',
  data () {
    return {
      hotList: [],
      searchKey: '',
      searchBoxLive: false,
      boxShow: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    },
    queryKeyword () {
      return this.$route.query.keyword
    }
  },
  watch: {
    queryKeyword (newVal) {
      this.searchKey = newVal
    }
  },
  components: {
    SearchBox,
    PersonalMessage
  },
  methods: {
    // 热搜操作
    async getHotSearch () {
      if (this.hotList.length === 0) {
        const result = await this.$http.get('/search/hot/detail', {
          params: {
            cookie: localStorage.getItem('cookie')
          }
        })
        this.hotList = result.data.data
      }
    },
    toSearchPanel () {
      this.searchBoxLive = false
      location.href = `/#/SearchPanel?keyword=${this.searchKey}`
    },
    listener (e) {
      if (!this.$refs.searchBox.contains(e.target) && e.target.classList[0] !== 'iconfont') {
        this.searchBoxLive = false
      }
      if (!this.$refs.messageBox.contains(e.target)) {
        this.boxShow = false
      }
    }
  },
  created () {
    this.getHotSearch()
  },
  mounted () {
    window.addEventListener('click', this.listener)
  },
  beforeDestroy () {
    window.removeEventListener('click', this.listener)
  }
}
</script>

<style lang="less" scoped>
.Header-container {
  display: flex;
  flex: 1;
  background-color: orangered;
  justify-content: space-between;
  align-items: center;
  overflow: hidden;
  .logo {
    height: 60px;
    width: 200px;
    float: left;
    img {
      float: left;
      margin-top: 5px;
      width: 60px;
    }

    span {
      float: left;
      height: 60px;
      line-height: 60px;
      color: whitesmoke;
      font-family: SimSun;
      font-weight: 700;
      font-size: 20px;
    }
  }
  .icon-xiangxia{
    font-size: 13px;
    font-weight: lighter;
  }
  .icon-xiangshang{
    font-size: 13px;
    font-weight: lighter;
  }
  .nav {
    float: left;
    margin-top: 14px;
    margin-left: 30px;

    div {
      float: left;
    }

    .control {
      height: 30px;
      line-height: 30px;

      button {
        background-color: rgba(0, 0, 0, 0.10);
        border: none;
        border-radius: 50%;
        width: 25px;
        height: 25px;
        margin-right: 10px;
      }

      i {
        color: whitesmoke;
      }
    }

  }

  .message-box {
    width: 150px;
    height: 60px;
    line-height: 60px;
    text-align: center;
    cursor: pointer;
    >div {
      padding-left: 15px;
      width: 100%;
      height: 60px;

      .userImg {
        float: left;
        margin-top: 15px;
        width: 30px;
        height: 30px;
        border-radius: 50%;
      }

      a {
        padding-left: 10px;
        float: left;
        font-size: 12px;
        color: floralwhite;
      }
    }
  }

  .search-box{
    position: absolute;
    top: 50px;
    z-index: 2;
  }
}
#message-panel{
  position: absolute;
  top: 60px;
  z-index: 100;
  width: 100px;
  height: 50px;
}
</style>
