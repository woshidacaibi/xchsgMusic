<template>
  <div class="RankingListPanel-container">
    <template v-if="isload">
      <h3>官方榜</h3>
      <div class="official-rank">
        <OfficialRankListSingleItem :key="item.id" v-for="item in RankMessage.slice(0,4)" :playlist-info="item"></OfficialRankListSingleItem>
      </div>
      <h3>全球榜</h3>
      <div class="global-rank">
        <RecommendList type="rank" :rank-list-info="RankMessage.slice(4)"></RecommendList>
      </div>
    </template>
    <div v-if="!isload" class="RankingListPanel-cover"></div>
  </div>
</template>

<script>
import OfficialRankListSingleItem from '@/components/RecommendSingleItem/OfficialRankListSingleItem'
import RecommendList from '@/components/RecommendRow/RecommendList'
export default {
  name: 'RankingListPanel',
  components: {
    OfficialRankListSingleItem,
    RecommendList
  },
  data () {
    return {
      RankMessage: [],
      isload: false,
      load: {
        close () {}
      }
    }
  },
  methods: {
    async getRankListMessage () {
      const res = await this.$http.get('/toplist')
      this.RankMessage = [...res.data.list]
      this.isload = true
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.RankingListPanel-cover')
      })
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
    }
  },
  created () {
    this.getRankListMessage()
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    dc[2].scrollTop = 0
    if (!this.isload) {
      this.loading()
    }
  }
}
</script>

<style lang="less" scoped>
.RankingListPanel-container{
  padding-top: 5px;
  padding-left: 25px;
}
.RankingListPanel-cover{
  height: 200px;
}
</style>
