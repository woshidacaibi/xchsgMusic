<template>
  <div class="subscribe-container">
    <div style="margin-top: 10px"/>
    <div class="subscribers-message" v-if="isload">
        <div class="message-container" :key="item.userId" v-for="item in currentSubscribers">
          <router-link :to="{path:'/UserPanel',query:{UserId:item.userId}}" style="float:left;"><img :src="item.avatarUrl" alt=""></router-link>
          <div class="right-panel">
            <router-link :to="{path:'/UserPanel',query:{UserId:item.userId}}">
              <span class="name">{{item.nickname}}</span>
              <i v-if="item.gender === 1" class="iconfont icon-nanxing"></i>
              <i v-else class="iconfont icon-nvxing"></i>
            </router-link>
            <span v-if="item.signature" class="brief elipse">{{item.signature}}</span>
          </div>
        </div>
        <div class="no-subscriber" v-if="currentSubscribers.length === 0">暂无收藏者</div>
    </div>
      <el-pagination
        :page-size="60"
        :pager-count="7"
        layout="prev, pager, next"
        :total="subscribeNum"
        :hide-on-single-page="true"
        class="subscribe-footer"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
        >
      </el-pagination>
    <div style="margin-bottom: 15px"/>
  </div>
</template>

<script>
export default {
  // 2000收藏者
  name: 'SubscribePanel',
  props: ['playlistId', 'count'],
  data () {
    return {
      isload: false,
      subscribeNum: 0,
      currentSubscribers: [],
      currentPage: 1,
      load: {
        close () {}
      }
    }
  },
  methods: {
    getSubscribers (page) {
      this.$http.get('/playlist/subscribers',
        {
          params: {
            id: this.playlistId,
            limit: 60,
            offset: (page - 1) * 60,
            cookie: localStorage.getItem('cookie')
          }
        }).then((res) => {
        this.currentSubscribers = res.data.subscribers
        this.isload = true
      })
    },
    handleCurrentChange (val) {
      this.isload = false
      this.getSubscribers(val)
      this.toTop()
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      dc[2].scrollTop = 0
    }
  },
  watch: {
    playlistId () {
      if (this.count > 2000) { this.subscribeNum = 2000 } else { this.subscribeNum = this.count }
      this.currentPage = 1
      this.getSubscribers(this.currentPage)
    },
    isload (newVal) {
      if (!newVal) {
        this.load = this.$loading({
          lock: true,
          text: '加载中，请稍等',
          spinner: 'el-icon-loading',
          background: 'whitesmoke',
          target: document.querySelector('.subscribe-container')
        })
      } else {
        this.load.close()
      }
    }
  },
  created () {
    if (this.count > 2000) { this.subscribeNum = 2000 } else { this.subscribeNum = this.count }
    this.getSubscribers(this.currentPage)
  },
  mounted () {
    this.toTop()
  }
}
</script>

<style lang="less" scoped>
  .subscribe-container{
    width: 100%;
    min-height: 200px;
  }
  .subscribe-footer{
    width: 360px;
    margin: 0 auto;
  }
  .subscribers-message{
    display: flex;
    flex-wrap:wrap ;
    justify-content: space-between;
    .message-container{
      min-width: 300px;
      width: 400px;
      height: 100px;
      display: flex;
      margin: 10px 0;
      img{
        width:90px;
        height: 90px;
        margin: 5px 10px;
        flex-shrink: 0;
        border-radius: 50%;
      }
      .right-panel{
        height: 100%;
        flex:1;
        float: left;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .name{
          font-size: 15px;
          font-weight:lighter;
          margin-right: 5px;
        }
        .brief{
          width: 250px;
          font-size: 13px;
          height: 20px;
          overflow: hidden;
          color: rgba(60, 60, 60, 0.74);
        }
        .icon-nvxing{
          background-color: hotpink;
          border-radius: 50%;
        }
        .icon-nanxing{
          background-color: skyblue;
          border-radius: 50%;
        }
      }
    }
  }
  .no-subscriber{
    text-align: center;
    width: 100%;
    height: 300px;
    line-height: 300px;
  }
  .elipse{
    white-space: nowrap;
    display: inline-block;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .el-loading-mask{
    background-color: #343434;
  }
</style>
