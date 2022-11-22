<template>
  <div class="albumn-container">
    <div v-if="isload">
      <div class="playlist-header">
        <img class="left" :src="albumInfo.album.picUrl+'?param=200y200'" alt="">
        <div class="message-panel">
          <div style="display: flex;width: 480px;align-items: center">
              <span class="type">
                专辑
              </span>
            <h2 style="height: 100%">
              {{ albumInfo.album.name }}
              <span v-for="(item,index) in albumInfo.album.alias" :key="index" style="color: #9f9f9f">
              ({{ item }})
            </span></h2>
          </div>
          <div class="operator-button">
            <button class="playAll" @click="updateSonglist"><i class="iconfont icon-bofang1"></i>播放全部</button>
            <button v-if="isSubscribe" class="collection" @click="cancelSubscribe"><i
              class="iconfont icon-yishoucang" style="color: #ec4141"></i>已收藏({{ albumInfo.album.info.commentCount }})
            </button>
            <button v-else class="collection" @click="subscribe"><i
              class="iconfont icon-shoucang"></i>收藏({{ albumInfo.album.info.commentCount }})
            </button>
          </div>
          <div class="create-message">
            <router-link style="display: block; padding-right: 10px" :to="{path:'/SingerPanel',query:{singerId:albumInfo.album.artist.id}}">
              <span class="creator-name">
                <span style="color: #343434">歌手：</span>{{ albumInfo.album.artist.name }}
                <span v-for="(item,index) in albumInfo.album.artist.alias" :key="index" style="color: #9f9f9f">
                ({{ item }})
                </span>
              </span>
            </router-link>
            <span class="time">创建于{{ createTime }}</span>
          </div>
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
                    <span>评论({{detailInfo.subCount}})</span>
                  </el-menu-item>
                  <el-menu-item index="3">
                    <span>专辑详情</span>
                  </el-menu-item>
                </el-menu>
              </div>
              <div class="message-panel">
                <keep-alive>
                  <SongList v-show="active === '1'"
                            :type="'albumList'"
                            :tracks="albumInfo.songs"></SongList>
                </keep-alive>
                <keep-alive>
                  <CommentList :cid="albumId"
                               v-show="active === '2'"
                               :count="albumInfo.album.info.commentCount"
                               :limit="60"
                               :type="3"/>
                </keep-alive>
                <div style="padding:0 20px" v-show="active === '3'">
                  <div style="margin-top: 10px"></div>
                  <h4 style="padding-bottom: 10px">专辑介绍</h4>
                  <p v-html="description" style="font-size: 15px;font-weight: lighter"></p>
                </div>
              </div>
            </div>
    </div>
  </div>
</template>

<script>
import SongList from '@/components/ListPanel/SongList'
import CommentList from '@/components/ListPanel/commentList/CommentList'
export default {
  name: 'AlbumListPanel',
  props: ['albumId'],
  data () {
    return {
      isload: false,
      albumInfo: {},
      detailInfo: {},
      isSubscribe: false,
      active: '1',
      load: {
        close () {
        }
      }
    }
  },
  components: {
    SongList,
    CommentList
  },
  watch: {
    albumId (newVal) {
      this.isload = false
      this.getalbumDetail()
      this.updateisSubscribe()
      this.active = '1'
      this.toTop()
    },
    isload (newVal) {
      if (!newVal) {
        this.load = this.$loading({
          lock: true, // 同v-loading的修饰符
          text: '专辑加载中，请稍等', // 加载文案
          background: 'whitesmoke', // 背景色
          spinner: 'el-icon-loading',
          target: document.querySelector('.main-container')// loading需要覆盖的DOM节点，默认为body
        })
      } else {
        this.load.close()
      }
    }
  },
  methods: {
    // 根据歌单id 将表单歌曲放到播放列表中
    updateSonglist () {
      // 加入播放清单
      this.$store.commit('UPDATESONGLIST', this.albumInfo.songs)
    },
    async getalbumDetail () {
      const res = await this.$http.get('/album', {
        params: {
          id: this.albumId,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.albumInfo = { ...res.data }
      if (this.$store.state.AlbumCheck === false && this.$store.state.islogin) {
        let hasmore = true
        let offset = 0
        while (hasmore) {
          const res1 = await this.$http.get('/album/sublist', {
            params: {
              cookie: localStorage.getItem('cookie'),
              offset: offset * 25,
              timestamp: Date.now()
            }
          })
          offset++
          hasmore = res1.data.hasMore
          this.$store.state.myLikeAlbum.push(...res1.data.data)
        }
        this.$store.state.AlbumCheck = true
      }
      const res2 = await this.$http.get('/album/detail/dynamic', {
        params: {
          id: this.albumId,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.detailInfo = { ...res2.data }
      this.isload = true
      console.log(this.albumInfo)
    },
    subscribe () {
      this.$http.get('/album/sub', {
        params: {
          t: 1,
          id: this.albumId,
          cookie: localStorage.getItem('cookie')
        }
      }).then((res) => {
        console.log(res)
        this.$store.state.myLikeAlbum.push({ ...this.albumInfo.album })
        this.isSubscribe = true
      })
    },
    cancelSubscribe () {
      this.$http.get('/album/sub', {
        params: {
          t: 2,
          id: this.albumId,
          cookie: localStorage.getItem('cookie')
        }
      }).then((res) => {
        console.log(res)
        const index = this.$store.state.myLikeAlbum.findIndex(value => {
          return value.id === this.albumId
        })
        this.$store.state.myLikeAlbum.splice(index, 1)
        this.isSubscribe = false
      })
    },
    handleSelect (key, keypath) {
      this.active = key.toString()
    },
    toTop () {
      document.getElementById('main').scrollIntoView(true)
    },
    updateisSubscribe () {
      let res = false
      this.$store.state.myLikeAlbum.forEach(value => {
        if (value.id.toString() === this.albumId.toString()) {
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
      return this.$time(this.albumInfo.album.publishTime).format('YYYY-MM-DD')
    },
    collectionNum () {
      return this.playlistInfo.subscribedCount > 10000 ? Math.floor(this.playlistInfo.subscribedCount / 10000) + '万' : this.playlistInfo.subscribedCount
    },
    playNum () {
      return this.playlistInfo.playCount > 10000 ? Math.floor(this.playlistInfo.playCount / 10000) + '万' : this.playlistInfo.playCount
    },
    description () {
      return this.albumInfo.album.description.replace(/\n+/g, '<br />')
    }
  },
  created () {
    this.isload = false
    this.getalbumDetail()
    this.updateisSubscribe()
  },
  mounted () {
  }
}
</script>

<style lang="less" scoped>
.albumn-container {
  height: 100%;
  position: relative;
}

.playlist-header {
  height: 400px;
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
      display: inline-block;
      flex-shrink: 0;
      border: 1px solid #ec4141;
      color: #ec4141;
      height: 20px;
      padding: 2px;
      line-height: 20px;
      text-align: center;
      border-radius: 3px;
    }

    h2 {
      display: inline-block;
      margin-left: 10px;
      flex: 1;
    }

    .create-message {
      margin-top: 10px;
      font-size: 13px;
      height: 50px;
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
      color: #507daf;
    }

    .time {
      float: left;
      color: #676767;
    }
  }

  .operator-button {
    margin-top: 10px;

    i {
      font-size: 15px;
      padding-right: 5px;
    }

    button {
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

    button:hover {
      background-color: rgba(204, 204, 204, 0.36);
    }

    button[disabled]:hover {
      background-color: whitesmoke;
    }

    button:first-child:hover {
      background-color: #cc3232;
    }

    .playAll {
      background-color: #ec4141;
      color: ghostwhite;
      width: 120px;
    }
  }

  .count-message {
    margin-top: 10px;

    span {
      margin-right: 10px;
      font-size: 13px;
      color: #676767;
    }
  }
}

.playlist-body {
  width: 100%;

  .message-choice {
    .choice-panel {
      margin-left: 30px;
    }
  }
}

.el-menu--horizontal > .el-menu-item.is-active {
  border-bottom: 3px solid #ec4141;
}

.el-menu {
  background-color: whitesmoke;
  height: 30px;
}

.el-menu.el-menu--horizontal {
  border: none;
}

.el-menu--horizontal > .el-menu-item {
  height: 35px;
  padding: 0;
  margin: 0 20px;
  line-height: 35px;
}

.el-menu--horizontal > .el-menu-item:not(.is-disabled):focus, .el-menu--horizontal > .el-menu-item:not(.is-disabled):hover, .el-menu--horizontal > .el-submenu .el-submenu__title:hover {
  background-color: whitesmoke;
}

</style>
