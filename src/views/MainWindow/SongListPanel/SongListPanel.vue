<template>
  <div class="songlist-container">
      <template  v-if="isload">
        <div class="playlist-header">
          <img class="left" :src="playlistInfo.coverImgUrl+'?param=200y200'" :alt="playlistInfo.coverImgUrl">
          <div class="message-panel">
            <div style="display: flex;width: 480px;align-items: center">
              <span class="type">
                歌单
              </span>
              <h2>{{ playlistInfo.name }}</h2>
            </div>
            <div class="create-message">
              <router-link style="float:left; padding-right: 10px" :to="{path:'/UserPanel',query:{UserId:playlistInfo.creator.userId}}">
                <img :src="playlistInfo.creator.avatarUrl" class="userImg">
                <span class="creator-name">{{ playlistInfo.creator.nickname }}</span>
              </router-link>
              <span class="time">创建于{{ createTime }}</span>
            </div>
            <div class="operator-button">
              <button class="playAll" @click="updateSonglist"><i class="iconfont icon-bofang1"></i>播放全部</button>
              <button v-if="!canSubscribe" class="collection" disabled><i class="iconfont icon-yishoucang"></i>收藏({{collectionNum }})</button>
              <button v-else-if="isSubscribe" class="collection" @click="cancelSubscribe"><i class="iconfont icon-yishoucang" style="color: #ec4141"></i>已收藏({{collectionNum }})</button>
              <button v-else class="collection" @click="subscribe"><i class="iconfont icon-shoucang"></i>收藏({{collectionNum }})</button>
            </div>
            <div class="count-message"><span>歌曲：{{playlistInfo.trackCount}}</span><span>播放：{{playNum}}</span></div>
            <div v-if="playlistInfo.description" class="desc" :title="playlistInfo.description">简介：{{playlistInfo.description}}</div>
          </div>
        </div>
        <div class="playlist-body">
          <div class="message-choice">
            <el-menu :default-active="active"
                     class="choice-panel"
                     mode="horizontal"
                     text-color="black"
                     @select="handleSelect">
              <el-menu-item index="1">
                <span>歌单列表</span>
              </el-menu-item>
              <el-menu-item index="2">
                <span>评论({{playlistInfo.commentCount}})</span>
              </el-menu-item>
              <el-menu-item index="3">
                <span>收藏者</span>
              </el-menu-item>
                <div class="el-input-box">
                  <el-input
                    placeholder="搜索歌单音乐"
                    v-model="keyword"
                    maxlength="20"
                    size="small"
                    clearable>
                  </el-input>
                </div>
            </el-menu>
          </div>
          <div class="message-panel">
              <SongList v-if="active === '1' && !isMylikelist"
                        :type="'songList'"
                        :islistload = "islistload"
                        :tracks="playlistInfo.tracks"
                        :keyword="keyword"
              ></SongList>
              <SongList v-if="active === '1' && isMylikelist"
                        :type="'songList'"
                        :islistload = "islistload"
                        :tracks="playlistInfo.tracks"
                        :keyword="keyword"
              ></SongList>
              <CommentList :cid="playlistInfo.id"
                           v-show="active === '2'"
                           :count="playlistInfo.commentCount"
                           :limit="20"
                           :type="2"/>
              <SubscribePanel v-show="active === '3'"
                              :playlistId="playlistInfo.id"
                              :count="playlistInfo.subscribedCount">
              </SubscribePanel>
          </div>
        </div>
      </template>
  </div>
</template>

<script>
import SongList from '@/components/ListPanel/SongList'
import SubscribePanel from '@/components/ListPanel/SubscribePanel'
import CommentList from '@/components/ListPanel/commentList/CommentList'
export default {
  name: 'SongListPanel',
  props: ['playlistId'],
  data () {
    return {
      isload: false,
      playlistInfo: {},
      canSubscribe: false,
      isSubscribe: false,
      isMylikelist: false,
      active: '1',
      keyword: '',
      islistload: false,
      load: {
        close () {}
      }
    }
  },
  components: {
    SongList,
    SubscribePanel,
    CommentList
  },
  watch: {
    playlistId (newVal) {
      this.isload = false
      this.islistload = false
      this.getlistDetail()
      this.active = '1'
      this.keyword = ''
      this.playlistInfo = {}
      this.updatecanSubscribe()
      this.updateisSubscribe()
      this.toTop()
    },
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.load = this.$loading({
            lock: true, // 同v-loading的修饰符
            text: '歌单加载中，请稍等。。。\n(过长时间未响应请刷新)', // 加载文案
            background: 'whitesmoke', // 背景色
            spinner: 'el-icon-loading',
            target: document.querySelector('.main-container')// loading需要覆盖的DOM节点，默认为body
          })
        } else { this.load.close() }
      },
      immediate: true
    }
  },
  methods: {
    // 根据歌单id 将表单歌曲放到播放列表中
    updateSonglist () {
      // 加入播放清单
      if (!this.islistload) {
        this.$message({
          message: '请歌单歌曲加载后再试',
          type: 'warning'
        })
        return
      }
      this.$store.commit('UPDATESONGLIST', this.playlistInfo.tracks)
    },
    async getlistDetail () {
      if (this.$store.state.historyListMessage === null) {
        this.$store.state.historyListMessage = []
      }
      const now = Date.now()
      // 清空本地存储信息超过3min没更新的歌单信息
      this.$store.state.historyListMessage = this.$store.state.historyListMessage.filter(val => { return now - val.localUpdateTime < 180000 })
      const index = this.$store.state.historyListMessage.findIndex(value => {
        return value.id.toString() === this.playlistId.toString()
      })
      if (index === -1) {
        const res = await this.$http.get('/playlist/detail', { params: { id: this.playlistId, cookie: localStorage.getItem('cookie'), timestamp: now } })
        this.playlistInfo = { ...res.data.playlist, localUpdateTime: now }
      } else {
        this.playlistInfo = this.$store.state.historyListMessage[index]
      }
      if (this.playlistInfo.trackCount === this.playlistInfo.tracks.length) { this.islistload = true }
      this.isload = true
      if (this.playlistInfo.trackCount !== this.playlistInfo.tracks.length) {
        this.playlistInfo.tracks = []
        let offset = 0
        const songs = []
        while (this.playlistInfo.trackCount - offset > 0) {
          const res = await this.$http.get('/playlist/track/all', {
            params: {
              id: this.playlistInfo.id,
              limit: 1000,
              offset: offset,
              timestamp: Date.now(),
              cookie: localStorage.getItem('cookie')
            }
          })
          songs.push(...res.data.songs)
          offset += 1000
          if (this.playlistInfo.trackCount - offset <= 0) {
            this.islistload = true
          }
        }
        this.playlistInfo.tracks = [...songs]
        this.$store.commit('COMMITHISTORY', 'ok')
      }
      if (this.playlistInfo.creator.userId !== this.$store.state.userInfo.userId) {
        this.$store.state.historyListMessage.push(this.playlistInfo)
      }
      if (this.playlistInfo.id === this.$store.state.mylikeListid) {
        this.isMylikelist = true
      } else this.isMylikelist = false
      localStorage.setItem('historyListMessage', JSON.stringify(this.$store.state.historyListMessage))
    },
    subscribe () {
      this.$http.get('/playlist/subscribe', {
        params: {
          t: 1,
          id: this.playlistInfo.id,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '收藏成功',
          duration: 1000
        })
        this.isSubscribe = true
        this.playlistInfo.subscribedCount++
        this.$store.state.playsongList.push(this.playlistInfo)
      })
    },
    cancelSubscribe () {
      this.$http.get('/playlist/subscribe', {
        params: {
          t: 2,
          id: this.playlistInfo.id,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }).then((res) => {
        this.$message({
          type: 'success',
          message: '取消收藏成功',
          duration: 1000
        })
        this.isSubscribe = false
        this.playlistInfo.subscribedCount--
        const index = this.$store.state.playsongList.findIndex(val => {
          return val.id === this.playlistInfo.id
        })
        this.$store.state.playsongList.splice(index, 1)
      })
    },
    handleSelect (key, keypath) {
      this.active = key.toString()
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    },
    updatecanSubscribe () {
      if (this.$store.state.MysonglistString === '') {
        setTimeout(() => {
          this.updatecanSubscribe()
        }, 200)
        return
      }
      let res = true
      this.Mysonglist.forEach(value => {
        if (value.id.toString() === this.playlistId.toString()) {
          res = false
        }
      })
      this.canSubscribe = res
    },
    updateisSubscribe () {
      if (this.$store.state.LikesonglistString === '') {
        setTimeout(() => {
          this.updateisSubscribe()
        }, 200)
        return
      }
      let res = false
      this.Likesonglist.forEach(value => {
        if (value.id.toString() === this.playlistId.toString()) {
          res = true
        }
      })
      this.isSubscribe = res
    }
  },
  computed: {
    Mysonglist () {
      if (this.$store.state.MysonglistString === '') {
        return []
      }
      return JSON.parse(this.$store.state.MysonglistString)
    },
    Likesonglist () {
      if (this.$store.state.LikesonglistString === '') {
        return []
      }
      return JSON.parse(this.$store.state.LikesonglistString)
    },
    createTime () {
      return this.$time(this.playlistInfo.createTime).format('YYYY-MM-DD')
    },
    collectionNum () {
      return this.playlistInfo.subscribedCount > 10000 ? Math.floor(this.playlistInfo.subscribedCount / 10000) + '万' : this.playlistInfo.subscribedCount
    },
    // eslint-disable-next-line vue/return-in-computed-property
    playNum () {
      return this.playlistInfo.playCount > 10000 ? Math.floor(this.playlistInfo.playCount / 10000) + '万' : this.playlistInfo.playCount
    }
  },
  created () {
    this.isload = false
    this.keyword = ''
    this.getlistDetail()
    this.updatecanSubscribe()
    this.updateisSubscribe()
  },
  activated () {
    this.isload = false
    this.keyword = ''
    this.getlistDetail()
    this.updatecanSubscribe()
    this.updateisSubscribe()
  },
  beforeDestroy () {
    this.load.close()
  }
}
</script>

<style lang="less" scoped>
.songlist-container {
  height: 100%;
  position: relative;
  margin: 0 25px 0 0;
}
.playlist-header {
  height: 300px;
  width: 750px;

  .left {
    width: 200px;
    height: 200px;
    float: left;
    margin: 30px;
    border-radius: 10px;
  }

  .message-panel {
    margin-top: 30px;
    float: left;

    .type {
      flex-shrink: 0;
      display: inline-block;
      border: 1px solid #ec4141;
      color: #ec4141;
      height: 20px;
      padding: 2px;
      line-height: 20px;
      text-align: center;
      border-radius: 3px;
    }

    h2 {
      flex: 1;
      margin-left: 10px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      word-break: break-all; // 注意这个文字多行很重要
      -webkit-box-orient: vertical;
    }
    .elipse{
      white-space: nowrap;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      a{
        display: inline-block;
      }
    }
    .create-message {
      margin-top: 10px;
      font-size: 13px;
      height: 25px;
      line-height: 20px;
    }

    img {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      float: left;
      margin-right: 10px;
    }

    .creator-name {
      float: left;
      color: #507daf;
    }

    .time {
      float: left;
      color: #676767;
    }
  }

  .operator-button{
    margin-top: 10px;
    i{
      font-size: 15px;
      padding-right: 5px;
    }
    button{
      border: 1px solid #ccc;
      height: 40px;
      line-height: 20px;
      cursor: pointer;
      padding: 5px;
      margin-right: 10px;
      border-radius: 20px;
      min-width: 100px;
      background-color: whitesmoke;
    }
    button:hover{
      background-color: rgba(204, 204, 204, 0.36);
    }
    button[disabled]:hover{
      background-color: whitesmoke;
  }
    button:first-child:hover{
      background-color: #cc3232;
    }
    .playAll{
      background-color: #ec4141;
      color: ghostwhite;
      width: 120px;
    }
  }
  .count-message{
    margin-top: 10px;
    span{
      margin-right: 10px;
      font-size: 13px;
      color: #676767;
    }
  }
}
.playlist-body{
  width: 100%;
  .message-choice{
    .choice-panel{
      margin-left: 30px;
    }
  }
}
.desc{
  width: 400px;
  font-size: 13px;
  margin-top:20px ;
  color:#9f9f9f;
  height: 85px;
  display: -webkit-box;
  text-overflow: ellipsis;
  overflow: hidden;
  -webkit-line-clamp: 5;
  word-break: break-all;  // 注意这个文字多行很重要
  -webkit-box-orient: vertical;
  vertical-align: middle;
}
.el-input-box{
  width: 200px;
  float: right;
  height: 35px;
  margin-right: 20px;
}
.el-menu--horizontal>.el-menu-item.is-active{
  border-bottom: 3px solid #ec4141;
}
.el-menu{
  background-color: whitesmoke;
  height:30px ;
}
.el-menu.el-menu--horizontal{
  border: none;
}
.el-menu--horizontal>.el-menu-item {
  height: 35px;
  padding: 0;
  margin: 0 20px;
  line-height: 35px;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus, .el-menu--horizontal>.el-menu-item:not(.is-disabled):hover, .el-menu--horizontal>.el-submenu .el-submenu__title:hover {
  background-color: whitesmoke;
}
</style>
