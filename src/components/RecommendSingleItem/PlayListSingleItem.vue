<template>
  <div class="playlist-single-container" v-if="isload">
    <template v-if="type === 'common'">
      <div class="content-box">
        <router-link :to="{path:'/SongListPanel',query:{playlistId:playlistInfo.id}}">
          <div class="cover" @mouseenter="iconshow=true" @mouseleave="iconshow=false">
            <el-image class="cover-img" :src="playlistInfo.picUrl?playlistInfo.picUrl:playlistInfo.coverImgUrl+'?param=400y400'" lazy>
              <div slot="placeholder" class="image-slot">
                加载中<span class="dot">...</span>
              </div>
            </el-image>
            <div class="play-time">
              <span>{{ playTimes }}</span>
              <i class="iconfont icon-24gl-play"></i>
            </div>
            <transition name="icon">
              <div class="play-icon" @click.prevent="pushTracks" v-show="iconshow">
                <i class="iconfont icon-bofang1"></i>
              </div>
            </transition>
          </div>
        </router-link>
        <span class="name">
          <router-link :to="{path:'/SongListPanel',query:{playlistId:playlistInfo.id}}">
            {{ playlistInfo.name }}
          </router-link></span>
      </div>
    </template>
    <template v-if="type === 'everyday'">
      <div class="content-box">
        <router-link :to="{name:'EverydayListPanel',query:{songs:JSON.stringify(playlistInfo)}}">
          <div class="cover" @mouseenter="iconshow=true" @mouseleave="iconshow=false">
            <img :src="playlistInfo[0].al.picUrl">
            <div class="everyday-cover">
              <i :class="`iconfont icon-rili${new Date().getDate()} date`"></i>
            </div>
            <transition name="everyday">
              <span v-if="iconshow" class="everyday-tip">根据您的音乐口味生成每日更新</span>
            </transition>
            <transition name="icon">
              <div class="play-icon" @click.prevent="pushsongs" v-show="iconshow">
                <i class="iconfont icon-bofang1"></i>
              </div>
            </transition>
          </div>
        </router-link>
        <span class="name">
            <router-link :to="{path:'/EverydayListPanel',query:{songs:JSON.stringify(playlistInfo)}}">
            每日歌曲推荐
          </router-link></span>
      </div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'PlayListSingleItem',
  props: ['playlistInfo', 'type'],
  data () {
    return {
      iconshow: false,
      isload: false
    }
  },
  computed: {
    playTimes () {
      if (this.playlistInfo.playcount) { return this.playlistInfo.playcount > 10000 ? Math.floor(this.playlistInfo.playcount % 10000) + '万' : this.playlistInfo.playcount } else { return this.playlistInfo.playCount > 10000 ? Math.floor(this.playlistInfo.playCount % 10000) + '万' : this.playlistInfo.playCount }
    }
  },
  methods: {
    async pushTracks () {
      let offset = 0
      const songs = []
      while (this.playlistInfo.trackCount - offset > 0) {
        const res = await this.$http.get('/playlist/track/all', {
          params: {
            id: this.playlistInfo.id,
            limit: 1000,
            offset: offset
          }
        })
        songs.push(...res.data.songs)
        console.log(songs)
        offset += 1000
      }
      this.$store.commit('UPDATESONGLIST', songs)
    },
    pushsongs () {
      this.$store.commit('UPDATESONGLIST', this.playlistInfo)
    }
  },
  watch: {
    playlistInfo: {
      handler (newVal) {
        if (newVal.length === 0) { this.isload = false } else this.isload = true
      },
      immediate: true
    }
  }
}
</script>

<style lang="less" scoped>
.playlist-single-container {
  width: 100%;
  position: relative;
  margin-bottom: 50px;
}

.playlist-single-container:before {
  content: "";
  padding-top: 100%;
  display: block;
}

.content-box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
  position: absolute;
  top: 0;
  left: 0;

  .cover {
    width: 100%;
    height: 100%;
    position: relative;

    .play-icon {
      position: absolute;
      color: #ec4141;
      background-color: rgba(255, 255, 255, 0.68);
      border-radius: 50%;
      width: 30px;
      height: 30px;
      bottom: 10px;
      right: 10px;

      i {
        font-size: 15px;
        padding-left: 2px;
        line-height: 30px;
      }
    }
  }

  img {
    width: 100%;
    height: 100%;
  }

  .everyday-cover {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    /* 模糊大小就是靠的blur这个函数中的数值大小 */
    backdrop-filter: blur(5px);
    text-align: center;
  }
  .cover-img{
    width: 100%;
    height: 100%;
  }
  .everyday-tip {
    position: absolute;
    top: 0;
    left: 0;
    font-size: 13px;
    color: white;
    background-color: rgba(0, 0, 0, 0.38);
  }

  .name {
    font-size: 15px;
    text-align: left;
    height: 40px;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    word-break: break-all; // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
  }

  .play-time {
    position: absolute;
    background: -webkit-linear-gradient(rgba(0, 0, 0, 0.41), rgba(255, 255, 255, 0.02));
    height: 20%;
    width: 100%;
    margin-right: 10px;
    top: 0;
    font-size: 13px;
    color: white;

    i {
      margin-top: 2.5px;
      float: right;
      font-size: 13px;
    }

    span {
      margin-right: 10px;
      margin-left: 3px;
      float: right;
    }
  }
}

.icon-enter-active {
  animation: fadeIn 0.3s linear;
}

.icon-leave-active {
  animation: fadeIn 0.3s linear reverse;
}

.date {
  position: absolute;
  display: block;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100px;
  height: 100px;
  color: white;
  font-size: 100px;
}

.everyday-enter-active {
  animation: fadeIn 0.8s linear;
}

.everyday-active {
  animation: fadeIn 0.8s linear reverse;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    opacity: 1;
  }
}
</style>
