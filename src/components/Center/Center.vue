<template>
  <div class="center-container" :style="`height:${centerHeight}px`">
    <div class="aside-container container">
      <transition name="left" :appear="true">
        <div v-if="isLeftShow"  style="border-right:1px solid #e6e6e6 ;height: 100%">
          <vue-scroll  :ops="$store.state.ops" style="width:200px;height:98%">
            <div style="width: 200px;background: whitesmoke;">
              <el-row class="tac" >
                <el-col :span="12">
                  <el-menu
                    background-color="whitesmoke"
                    default-active="2"
                  >
                    <el-menu-item index="findMusic">
                      <span slot="title"><router-link :to="{path:'/MainIndex'}">发现音乐</router-link></span>
                    </el-menu-item>
                    <el-menu-item index="shipin">
                      <span slot="title"><router-link :to="{path:'/FoundVideoPanel'}">推荐视频</router-link></span>
                    </el-menu-item>
                    <el-menu-item index="friend">
                      <span slot="title"><router-link :to="{path:'/MySubscribePanel'}">我的收藏</router-link></span>
                    </el-menu-item>
                    <el-submenu v-if="islogin && haslistLoad" index="2">
                      <template slot="title">
                        <span class="border-title">我创建的歌单</span>
                      </template>
                      <el-menu-item-group>
                        <el-menu-item>
                          <router-link :to="{path:'/SongListPanel',query:{playlistId:Mysonglist[0].id}}">
                            <i class="iconfont icon-aixin"></i>
                            <span class="listName">{{'我喜欢的音乐'}}</span>
                          </router-link>
                        </el-menu-item>
                        <el-menu-item  v-for="item in Mysonglist.slice(1)"
                                       :key="item.id"
                                       >
                          <router-link :to="{path:'/SongListPanel',query:{playlistId:item.id}}">
                          <i class="iconfont icon-yinleliebiao"></i>
                          <span class="listName">{{item.name}}</span>
                          </router-link>>
                        </el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                    <el-submenu v-if="islogin && haslistLoad" index="3">
                      <template slot="title">
                        <span class="border-title">我收藏的歌单</span>
                      </template>
                      <el-menu-item-group>
                        <el-menu-item v-for="item in Likesonglist" :key="item.id.toString()">
                          <router-link :to="{path:'/SongListPanel',query:{playlistId:item.id}}">
                          <i class="iconfont icon-yinleliebiao"></i>
                          <span class="listName">{{item.name}}</span>
                          </router-link>
                        </el-menu-item>
                      </el-menu-item-group>
                    </el-submenu>
                    <p v-if="!islogin" class="pleaselogin" @click="$store.state.logining=true">请先登录，才能获取和收藏歌单</p>
                  </el-menu>
                </el-col>
              </el-row>
            </div>
          </vue-scroll>
        </div>
      </transition>
      <i v-show="!isLeftShow" class="iconfont icon-youjiantou show-button" @click="isLeftShow=true"></i>
      <i v-show="isLeftShow" class="iconfont icon-zuojiantou hide-button" @click="isLeftShow=false"></i>
    </div>
    <div class="main-container">
      <vue-scroll :ops="$store.state.ops" style="width:100%;height:98%">
        <router-view id="main"></router-view>
      </vue-scroll>
    </div>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Center',
  props: ['islogin'],
  // 这里默认使用了我自己的号id 注意解封后修改下交互式
  data () {
    return {
      Mysonglist: [],
      Likesonglist: [],
      isLeftShow: true,
      haslistLoad: false,
      clientHeight: 600,
      timer: null,
      noticeTimer: null
    }
  },
  methods: {
    async getSongLists () {
      if (!this.$store.state.islogin) {
        return
      }
      const result = await this.$http.get('/user/playlist', { params: { uid: this.$store.state.userInfo.userId, limit: 1000, timestamp: Date.now() } })
      this.$store.state.mylikeListid = result.data.playlist[0].id
      await this.getMylikeList()
      for (let i = 0; i < result.data.playlist.length; i++) {
        if (result.data.playlist[i].creator.userId === this.$store.state.userInfo.userId) {
          this.Mysonglist.push({
            id: result.data.playlist[i].id,
            name: result.data.playlist[i].name
          })
        } else {
          this.Likesonglist.push({
            id: result.data.playlist[i].id,
            name: result.data.playlist[i].name
          })
        }
      }
    },
    async getMylikeList () {
      const res = await this.$http.get('/playlist/detail', { params: { id: this.$store.state.mylikeListid, cookie: localStorage.getItem('cookie'), timestamp: Date.now() } })
      this.$store.state.mylikeList = { ...res.data.playlist }
    },
    notice () {
      if (!this.noticeTimer) {
        this.$notify({
          title: 'Warning',
          message: '警告！您在尝试访问神秘领域，请不要点我了',
          type: 'warning',
          duration: 1000,
          position: 'top-left'
        })
        this.noticeTimer = setTimeout(() => {
          this.noticeTimer = null
        }, 1000)
      }
    }
  },
  watch: {
    // 监听login状态，如果是登录 那就加载，否则显示登陆界面
    islogin (newVal) {
      if (newVal) {
        this.getSongLists().then(() => {
          this.haslistLoad = true
        })
      }
    },
    Mysonglist (newVal) {
      this.$store.state.MysonglistString = JSON.stringify(newVal)
    },
    Likesonglist (newVal) {
      this.$store.state.LikesonglistString = JSON.stringify(newVal)
    }
  },
  computed: {
    centerHeight () {
      return this.clientHeight - 120
    }
  },
  created () {
    if (this.islogin) {
      this.getSongLists().then(() => {
        this.haslistLoad = true
      })
    }
    if (localStorage.getItem('historySongList') && JSON.parse(localStorage.getItem('historySongList')).length > 0) {
      this.$store.state.playsongList = JSON.parse(localStorage.getItem('historySongList'))
      this.$store.state.currentIndex = Number(localStorage.getItem('historyListIndex'))
      this.$store.state.currentMusic = this.$store.state.playsongList[this.$store.state.currentIndex]
    }
    this.clientHeight = document.documentElement.clientHeight
  },
  mounted () {
    window.addEventListener('resize', () => {
      if (this.timer === null) {
        this.timer = setTimeout(() => {
          this.clientHeight = document.documentElement.clientHeight
          this.timer = null
        }, 50)
      }
    })
  }
}
</script>

<style lang="less" scoped>
  .center-container{
    display: flex;
    z-index: 0;
  }
  .main-container{
    width: 100%;
    padding-left:5px ;
    overflow: hidden;
    position: relative;
    z-index: 0;
    flex: 1;
  }
  .aside-container{
    overflow-y:auto ;
    flex-shrink:0 ;
    background-color: whitesmoke;
    .show-button{
      position: absolute;
      border-radius: 5px;
      background-color: whitesmoke;
      border:1px solid #ccc;
      font-size: 20px;
      left: -5px;
      top: 300px;
      z-index: 30;
      animation: fadeIn 0.5s;
    }
    .hide-button{
      position: absolute;
      border-radius: 5px;
      background-color: whitesmoke;
      border:1px solid #ccc;
      font-size: 20px;
      left: 190px;
      top: 300px;
      z-index: 20;
      animation: fadeIn 0.5s;
    }
  }
  .border-title{
    color: #3C3C3C;
    font-size: 13px;
    height: 25px;
    line-height: 25px;
  }
  .listName{
    display: inline-block;
    max-width: 9em;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    color: black;
  }
  .pleaselogin{
    text-align: center;
    color: #c5c5c5;
    cursor:pointer;
    font-size: 15px;
    width: 140px;
    margin: 100px auto;
  }
  .el-col-12{
    width: 100%;
  }
  .el-menu-item{
    height: 40px;
    line-height: 40px;
  }
  .el-menu{
    border:none;
  }
  .el-menu-item.is-active{
    color: #63666c
  }
  .left-enter-active{
    animation: fadeIn 0.5s linear;
  }
  .left-leave-active{
    animation: fadeIn 0.5s linear reverse;
  }
  @keyframes fadeIn {
    0% {
      transform: translateX(-200px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
</style>
