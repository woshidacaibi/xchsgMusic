<template>
  <div ref="songlist-row" class="recommend-row">
    <template v-if="isload || isMouted">
      <template v-if="type === 'simple'">
        <div class="list-container simpleItem" :key="item.id" v-for="item in recolist.slice(1)">
          <PlayListSingleItem :playlist-info="item" :type="'common'"></PlayListSingleItem>
        </div>
        <div v-if="isBottom" class="load-bottom">到底啦悲</div>
      </template>
      <template v-if="type === 'daily'">
        <div class="list-container">
          <PlayListSingleItem :playlist-info="recosongs" :type="'everyday'"></PlayListSingleItem>
        </div>
        <div class="list-container" :key="item.id" v-for="item in recolist.slice(0,9)">
          <PlayListSingleItem :playlist-info="item" :type="'common'"></PlayListSingleItem>
        </div>
      </template>
      <template v-if="type === 'rank'">
        <div class="list-container" :key="item.id" v-for="item in recolist">
          <PlayListSingleItem :playlist-info="item" :type="'common'"></PlayListSingleItem>
        </div>
      </template>
      <template v-if="type === 'singerPlayList'">
        <div class="small simpleItem" :key="item.id" v-for="item in recolist.slice(currentPage*8-8,currentPage*8)">
          <PlayListSingleItem :playlist-info="item" :type="'common'"></PlayListSingleItem>
        </div>
        <div v-if="recolist.slice(currentPage*8-8,currentPage*8).length === 0" style="height: 60px;line-height: 60px;text-align: center">没有更多了。。。</div>
        <el-pagination
          :page-size="8"
          :pager-count="7"
          layout="prev, pager, next"
          :total="count"
          :hide-on-single-page="true"
          class="subscribe-footer"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </template>
      <template v-if="type === 'singerLikeList'">
        <div class="small simpleItem" :key="item.id" v-for="item in recolist.slice(currentPage*8-8,currentPage*8)">
          <PlayListSingleItem :playlist-info="item" :type="'common'"></PlayListSingleItem>
        </div>
        <div v-if="recolist.slice(currentPage*8-8,currentPage*8).length === 0" style="height: 60px;line-height: 60px;text-align: center">没有更多了。。。</div>
        <el-pagination
          :page-size="8"
          :pager-count="7"
          layout="prev, pager, next"
          :total="recolist.length"
          :hide-on-single-page="true"
          class="subscribe-footer"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </template>
    </template>
    <div class="RecommendList-cover" v-show="!isload" style="height: 100px; width: 100%"></div>
  </div>
</template>

<script>
import PlayListSingleItem from '@/components/RecommendSingleItem/PlayListSingleItem'
export default {
  name: 'RecommendList',
  props: ['type', 'tag', 'rankListInfo', 'count', 'uid'],
  components: {
    PlayListSingleItem
  },
  data () {
    return {
      recosongs: [],
      recolist: [],
      isload: false,
      isMouted: false,
      isBottom: false,
      currentPage: 1,
      load: {
        close () {}
      },
      offset: 0,
      limit: 8,
      view_panel: '',
      timer: null,
      before: ''
    }
  },
  watch: {
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        } else {
          this.load.close()
        }
      }
    },
    tagName () {
      this.isload = false
      this.isBottom = false
      this.recolist = []
      this.getRecommendList()
    }
  },
  computed: {
    tagName () {
      return this.$route.query.tagName
    }
  },
  methods: {
    async getEverydayData () {
      const recosongs = await this.$http.get('/recommend/songs', {
        params: {
          cookie: localStorage.getItem('cookie')
        }
      })
      this.recosongs = [...recosongs.data.data.dailySongs]
      const recolist = await this.$http.get('/recommend/resource', {
        params: {
          cookie: localStorage.getItem('cookie'),
          limit: 20
        }
      })
      this.recolist = [...recolist.data.recommend]
      this.isload = true
    },
    async getRecommendList (before) {
      const recolist = await this.$http.get('/top/playlist/highquality', {
        params: {
          cookie: localStorage.getItem('cookie'),
          limit: 30,
          before: before,
          cat: this.tagName
        }
      })
      if (recolist.data.playlists.length === 0) {
        this.view_panel.removeEventListener('scroll', this.bottomLoad)
        this.isload = true
        this.isBottom = true
        return
      }
      this.recolist.push(...recolist.data.playlists)
      this.before = this.recolist[this.recolist.length - 1].updateTime
      this.isload = true
      this.$nextTick(() => {
        const items = document.getElementsByClassName('simpleItem')
        if (this.$refs['songlist-row'].clientWidth > 750) {
          Object.values(items).forEach(val => {
            val.classList.remove('small')
          })
        } else {
          Object.values(items).forEach(val => {
            val.classList.add('small')
          })
        }
      })
    },
    async getSingerPlayList () {
      const res = await this.$http.get('/user/playlist', {
        params: {
          uid: this.uid,
          limit: 100,
          offset: this.offset,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.offset += 100
      this.recolist.push(...res.data.playlist)
      if (this.recolist.length < this.count && res.data.more) { await this.getSingerPlayList() }
      this.recolist = this.recolist.slice(0, this.count)
      this.isload = true
    },
    async getSingerLikeList () {
      const res = await this.$http.get('/user/playlist', {
        params: {
          uid: this.uid,
          limit: 100,
          offset: this.offset,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.offset += 100
      this.recolist.push(...res.data.playlist)
      if (res.data.more) { await this.getSingerLikeList() }
      this.isload = true
    },
    handleCurrentChange (val) {
      this.isload = false
      if
      (this.type === 'singerPlayList') {
        this.offset = (val - 1) * this.limit
        this.getSingerPlayList()
      }
      // } else if
      // (this.type === 'singerLikeList') {
      //   this.currentPage = val
      // }
    },
    resizeWindow () {
      if (!this.timer) {
        this.timer = setTimeout(() => {
          const items = document.getElementsByClassName('simpleItem')
          if (this.$refs['songlist-row'].clientWidth > 750) {
            Object.values(items).forEach(val => {
              val.classList.remove('small')
            })
          } else {
            Object.values(items).forEach(val => {
              val.classList.add('small')
            })
          }
          this.timer = null
        }, 100)
      }
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.RecommendList-cover')
      })
    },
    bottomLoad () {
      if (this.timer === null) {
        this.timer = setTimeout(() => {
          if (this.view_panel.clientHeight + this.view_panel.scrollTop + 10 >= this.view_panel.scrollHeight) {
            this.isload = false
            this.getRecommendList(this.before)
          }
          this.timer = null
        }, 1000)
      }
    }
  },
  created () {
    if (this.type === 'daily') {
      if (!localStorage.getItem('cookie')) {
        this.isload = true
        return
      }
      this.getEverydayData()
    } else if
    (this.type === 'simple') { this.getRecommendList('') } else if
    (this.type === 'rank') {
      this.recolist = this.rankListInfo
      this.isload = true
    } else if
    (this.type === 'singerPlayList') {
      this.getSingerPlayList()
    } else if
    (this.type === 'singerLikeList') {
      this.offset = this.count - 1
      this.getSingerLikeList()
    }
  },
  mounted () {
    if (!this.isload) {
      this.loading()
    }
    if (this.type === 'simple') {
      this.resizeWindow()
      window.addEventListener('resize', this.resizeWindow)
      const dc = document.getElementsByClassName('__panel')
      this.view_panel = dc[2]
      this.view_panel.addEventListener('scroll', this.bottomLoad)
    }
    this.isMouted = true
  },
  beforeDestroy () {
    if (this.type === 'simple') {
      window.removeEventListener('resize', this.resizeWindow)
      this.view_panel.removeEventListener('scroll', this.bottomLoad)
    }
  }
}
</script>

<style lang="less" scoped>
.recommend-row {
  width: 100%;
  text-align: center;
  display: flex;
  align-content: flex-start;
  flex-flow: row wrap;
}
.list-container{
  flex: 0 0 20%;
}
.small{
  flex: 0 0 25%;
}
.load-bottom{
  width: 100%;
  height: 50px;
  line-height: 50px;
  text-align: center;
  font-size: 13px;
  color: #9f9f9f;
}
.el-pagination{
  width: 100%;
}
</style>
