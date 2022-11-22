<template>
  <div class="search-item-container">
    <router-link :to="{path:'/AlbumPanel',query:{albumId:data.id}}" v-if="type === 'album'">
      <div class="left-img">
        <el-image class="cover-img" :src="data.picUrl+'?param=100y100'" lazy>
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <div class="flex-area">
        <div style="flex: 0 0 40%"  class="data-name elipse">{{data.name}}
          <span v-if="data.alias.length>0" class="alias">(<span :key="alia" v-for="alia in data.alias">{{alia}}</span>)</span>
        </div>
        <div style="flex: 0 0 40%" class="data-artists elipse">
          <router-link :to="{path:'/SingerPanel',query:{singerId:data.artists[0].id}}">{{data.artists[0].name}}
            <span v-if="data.artists[0].alias.length>0" class="alias">(<span v-if="data.artists[0].alias.length>0">{{data.artists.alias[0]}}</span>)</span>
          </router-link>
        </div>
      </div>
    </router-link>
    <router-link :to="{path:'/SingerPanel',query:{singerId:data.id}}" v-if="type === 'singer'">
      <div class="left-img">
        <el-image class="cover-img" :src="data.picUrl+'?param=100y100'" lazy>
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <div class="flex-area">
        <div style="flex: 0 0 90%"  class="data-name elipse">{{data.name}}
          <span v-if="data.alias.length>0" class="alias"><template>(<span>{{data.alias[0]}}</span>)</template></span>
        </div>
      </div>
    </router-link>
    <router-link :to="{path:'/AlbumPanel',query:{albumId:data.id}}" v-if="type === 'playlist'">
      <div class="left-img">
        <el-image class="cover-img" :src="data.coverImgUrl+'?param=100y100'" lazy>
          <div slot="placeholder" class="image-slot">
            加载中<span class="dot">...</span>
          </div>
        </el-image>
      </div>
      <div class="flex-area">
        <div style="flex: 0 0 40%"  class="data-name elipse">{{data.name}}
        </div>
        <div style="flex: 0 0 20%; color: #9f9f9f" class="data-name">{{data.trackCount}} 首</div>
        <div style="flex: 0 0 30%" class="data-artists elipse">
          <router-link :to="{path:'/UserPanel',query:{UserId:data.creator.userId}}"><b style="color:#9f9f9f;">by </b>{{data.creator.nickname}}
          </router-link>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'SearchItem',
  props: ['type', 'data']
}
</script>

<style lang="less" scoped>
.search-item-container{
  height: 100px;
  >a{
    display: flex;
  }
  .left-img{
    width: 100px;
    height: 100px;
    flex-shrink: 0;
    box-sizing: border-box;
    margin: 10px;
    .cover-img{
      width: 80px;
      height: 80px;
      border-radius: 5px;
    }
  }
  .flex-area{
    flex: 1;
    display: flex;
    justify-content: space-around;
    box-sizing: border-box;
    margin-left: 10px;
    font-size: 14px;
    .data-name{
      height: 100px;
      line-height: 100px;
    }
    .data-artists{
      height: 100px;
      line-height: 100px;
      >a{
        display: inline-block;
      }
    }
  }
  .alias{
    color: #9f9f9f;
  }
  .elipse {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    word-break: break-all; // 注意这个文字多行很重要
    -webkit-box-orient: vertical;
    vertical-align: middle;
  }
}
.search-item-container:hover{
  background-color: rgba(231, 229, 229, 0.99);
}
.search-item-container:nth-child(even){
  background-color: rgba(215, 215, 215, 0.29);
}
.search-item-container:nth-child(even):hover{
  background-color: rgba(231, 229, 229, 0.99);
}
</style>
