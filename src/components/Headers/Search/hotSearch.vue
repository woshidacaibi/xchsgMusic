<template>
  <div>
    <div class="history-search" v-show="historySearch.length>0">
      <h3>搜索历史 <i @click="removeAll" class="iconfont icon-icon1"></i></h3>
      <span class="history-search-item" v-for="(item,index) in historySearch" :key="index">
        <router-link :to="{path:'/SearchPanel',query:{keyword:item}}"  class="detail">
          {{item}}<span @click.prevent="removeHistory(item)"> <i class="iconfont icon-guanbi1"></i></span>
        </router-link>
      </span>
    </div>
    <div class="hot-search">
      <h3>热搜榜</h3>
      <ul>
        <li v-for="(item,index) in hotList" :key="item.searchWord">
          <p v-if="index<3" class="order in-third">{{index+1}}</p>
          <p v-else class="order">{{index+1}}</p>
          <router-link :to="{path:'/SearchPanel',query:{keyword:item.searchWord}}"  class="detail"  v-if="item.content">
            <div class="song-messsage">
              <span v-if="index<3" class="name big">{{item.searchWord}}</span>
              <span v-else class="name">{{item.searchWord}}</span>
              <img v-if="item.iconUrl" :src="item.iconUrl" alt="">
              <span class="times">{{item.score}}</span>
            </div>
            <p class="comment">{{item.content}}</p>
          </router-link>
          <router-link :to="{path:'/SearchPanel',query:{keyword:item.searchWord}}"  class="detail"  v-else>
            <div class="song-messsage" style="height: 60px;line-height: 40px">
              <span class="name">{{item.searchWord}}</span>
              <img :src="item.iconUrl">
              <span class="times">{{item.score}}</span>
            </div>
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'hotSearch',
  props: ['hotList'],
  data () {
    return {
      historySearch: JSON.parse(localStorage.getItem('historySearch')) ? JSON.parse(localStorage.getItem('historySearch')) : []
    }
  },
  methods: {
    removeHistory (item) {
      if (item) {
        const index = this.historySearch.findIndex(val => {
          return val === item
        })
        this.historySearch.splice(index, 1)
      } else {
        this.historySearch = []
      }
      localStorage.setItem('historySearch', JSON.stringify(this.historySearch))
    },
    removeAll () {
      this.$confirm('此操作将删除历史记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
.hot-search{
  h3{
    padding-left: 10px;
    font-weight: lighter;
  }
  .big{
    font-weight: bolder;
  }
  li{
    display: flex;
    height: 60px;
    cursor: pointer;
    .order{
      width: 60px;
      height: 60px;
      float: left;
      text-align: center;
      line-height: 60px;
    }
    .in-third{
      color: red;
      font-weight: 700;
    }
    .detail{
      float: left;
      flex: 1;
      align-items: center;
      .song-messsage{
        height: 30px;
        line-height: 30px;
        padding-top: 5px;
        span{
          display: inline-block;
          margin-right: 10px;
        }
        .times{
          font-size: 13px;
          color: #cdcdcd;
        }
        img{
          height: 15px;
          margin-right: 10px;
        }
      }
      .comment{
        padding-bottom: 5px;
        display: inline-block;
        max-width: 20em;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        height: 30px;
        line-height: 30px;
        color: #ccc;
        font-size: 12px;
      }
    }
  }
  li:hover{
    background-color: rgba(205, 205, 205, 0.15);
  }
}
h3{
  padding-left: 10px;
  font-weight: lighter;
}
.history-search-item{
  display: inline-block;
  padding: 0 10px;
  margin: 3px 10px;
  border-radius: 15px;
  border: 1px solid #cccccc;
  a{
    font-size: 13px;
    height: 20px;
    line-height: 20px;
  }
  a>span{
    display: inline-block;
    width: 10px;
    text-align: center;
    i{
      display: none;
      font-size: 12px;
      height: 10px;
      line-height: 20px;
    }
  }
}
.history-search-item:hover{
  background-color: whitesmoke;
  a>span>i{
    display: inline;
  }
}
</style>
