<template>
  <div class="SingerPanel-container">
    <div style="margin-top: 10px"></div>
      <div v-if="singerId" class="recommend-row">
        <div v-for="item in albums" :key="item.id" class="single-item-container">
          <AlbumSingleItem :album-info="item"></AlbumSingleItem>
        </div>
        <div v-if="albums.length === 0 && isload === true" class="none">暂无专辑，让我们期待一手</div>
      </div>
    <template v-if="type === 'newAlbum' && isload">
        <div class="recommend-row">
            <p class="area-tip">{{currentArea}}
              <br></p>
            <div v-for="item in weekData" :key="item.id" class="single-item-container">
              <AlbumSingleItem :show-name="true" :album-info="item"></AlbumSingleItem>
            </div>
        </div>
      <div v-for="items in eachMonthAlbums" :key="items.year+'Y'+items.month+'M'" class="recommend-row">
        <div v-for="item in items.albums.slice(0,items.lazy)" :key="item.id" class="single-item-container">
          <AlbumSingleItem :show-name="true" :album-info="item"></AlbumSingleItem>
        </div>
      </div>
      <Loading :cover-name="'SingerAlbum'" :isload="!isButtom"></Loading>
    </template>
    <Loading :cover-name="'SingerAlbum'" text="专辑加载较慢，见谅" :isload="isload"></Loading>
  </div>
</template>

<script>
import AlbumSingleItem from '@/components/RecommendSingleItem/AlbumSingleItem'
import Loading from '@/components/Loading'
export default {
  name: 'SingerAlbum',
  props: ['singerId', 'type', 'areaId'],
  components: { Loading, AlbumSingleItem },
  data () {
    return {
      albums: [],
      offset: 0,
      limit: 20,
      isButtom: false,
      isload: false,
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      eachMonthAlbums: [],
      weekData: [],
      currentArea: '本周新碟',
      timer: null,
      view_panel: ''
    }
  },
  watch: {
    areaId () {
      this.isButtom = false
      this.isload = false
      this.month = new Date().getMonth() + 1
      this.year = new Date().getFullYear()
      this.eachMonthAlbums = []
      this.weekData = []
      if (this.areaId !== 'ALL') { this.currentArea = this.year + '年' + this.month + '月' } else { this.currentArea = '本周新碟' }
      this.getNewAlbums()
    }
  },
  methods: {
    async getSingerAlbums () {
      console.log(7)
      const res = await this.$http.get('/artist/album', {
        params: {
          id: this.singerId,
          offset: this.offset,
          limit: this.limit
        }
      })
      console.log(res)
      this.albums.push(...res.data.hotAlbums)
      this.offset += this.limit
      this.isButtom = !res.data.more
      this.isload = true
    },
    async getNewAlbums () {
      this.isButtom = true
      const res = await this.$http.get('/top/album', {
        params: {
          year: this.year,
          month: this.month,
          area: this.areaId,
          limit: 30
        }
      })
      if (res.data.weekData) {
        this.weekData = [...res.data.weekData]
      }
      this.eachMonthAlbums.push({ year: this.year, month: this.month, albums: [...res.data.monthData], length: res.data.monthData.length, lazy: this.limit })
      this.month--
      if (this.month === 0) {
        this.year--
        this.month = 12
      }
      this.isButtom = false
      this.isload = true
    },
    bottomLoad () {
      if (this.type === 'newAlbum') {
        if (this.timer === null && !this.isButtom) {
          if (this.view_panel.clientHeight + this.view_panel.scrollTop + 30 >= this.view_panel.scrollHeight) {
            this.timer = setTimeout(() => {
              const temp = this.eachMonthAlbums[this.eachMonthAlbums.length - 1]
              if (temp.lazy >= temp.length) {
                this.getNewAlbums()
              } else {
                this.currentArea = this.year + '年' + (this.month + 1) + '月'
                this.eachMonthAlbums[this.eachMonthAlbums.length - 1].lazy += this.limit
              }
              this.timer = null
            }, 300)
          }
        }
      } else {
        if (this.isButtom) {
          this.view_panel.removeEventListener('scroll', this.bottomLoad)
          return
        }
        if (this.timer === null) {
          this.timer = setTimeout(() => {
            if (this.view_panel.clientHeight + this.view_panel.scrollTop + 30 >= this.view_panel.scrollHeight) {
              this.isload = false
              this.getSingerAlbums()
            }
            this.timer = null
          }, 500)
        }
      }
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    }
  },
  created () {
    if (this.type === 'singer') {
      this.getSingerAlbums()
    } else if (this.type === 'newAlbum') {
      if (this.areaId !== 'ALL') { this.currentArea = this.year + '年' + (this.month + 1) + '月' } else { this.currentArea = '本周新碟' }
      this.getNewAlbums()
    }
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    this.view_panel = dc[2]
    this.view_panel.addEventListener('scroll', this.bottomLoad)
    this.toTop()
  },
  activated () {
    this.view_panel.addEventListener('scroll', this.bottomLoad)
  },
  deactivated () {
    this.view_panel.removeEventListener('scroll', this.bottomLoad)
  },
  destroyed () {
    this.view_panel.removeEventListener('scroll', this.bottomLoad)
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
.single-item-container{
  flex: 0 0 20%;
  margin: 0 4% 0 0;
}
.none{
  margin: 0 auto;height: 300px;line-height:300px;width:600px;text-align: center;font-size: 14px;color:#9f9f9f;
}
.area-tip{
  position: fixed;
  top: 65px;
  right: 50px;
  z-index: 100;
}

.area-tip{

  line-height: 60px;

  text-align: center;

  font-size: 20px;

  font-weight: bolder;

  -webkit-text-fill-color: transparent;

  background-image: -webkit-linear-gradient(left, #f08080, #E6D205 25%, #f08080 50%, #E6D205 75%, #f08080);

  background-size: 200%,100%;

  -webkit-background-clip: text;

  -webkit-animation: word 0.5s linear infinite ;

}

@keyframes word {

  0%{background-position: 0 0}

  100%{background-position: -100% 0}

}

</style>
