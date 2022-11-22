<template>
  <div class="UserPanel-container">
    <template v-if="isload">
      <div class="user-message-header">
        <div class="img-left">
          <el-image class="cover-img" :src="userInfo.profile.avatarUrl+'?param=160y160'">
            <div slot="placeholder" class="image-slot">
              加载中<span class="dot">...</span>
            </div>
          </el-image>
        </div>
        <div class="message-right">
          <h3>{{userInfo.profile.nickname}}</h3>
          <div class="basic-message">
            <div class="identify" v-if="userInfo.identify">
              <img :src="userInfo.identify.imageUrl" alt="">
              <span>{{userInfo.identify.imageDesc}}</span>
            </div>
            <div class="user-level">Lv{{userInfo.level}}</div>
            <div class="user-gender">
              <i v-if="userInfo.profile.gender === 1" class="iconfont icon-nanxing"></i>
              <i v-else-if="userInfo.profile.gender === 2" class="iconfont icon-nvxing"></i>
            </div>
            <div class="operate-button">
              <router-link v-if="userInfo.profile.artistId" class="link" :to="{path:'/SingerPanel',query:{singerId:userInfo.profile.artistId}}">
                <i class="iconfont icon-maikefeng"></i>歌手页
              </router-link>
              <div class="link" @click="followUser(1)" v-show="!userInfo.profile.followed && userInfo.profile.userId !== $store.state.userInfo.userId">+关注</div>
              <div class="link" @click="followUser(2)" v-show="userInfo.profile.followed">√已关注</div>
            </div>
          </div>
          <div class="active-message">
            <div class="message" @click="showMessage">
              <div class="head">{{userInfo.profile.eventCount}}</div>
              <div class="name">动态</div>
            </div>
            <div class="message" @click="showMessage">
              <div class="head">{{userInfo.profile.follows}}</div>
              <div class="name">关注</div>
            </div>
            <div class="message" @click="showMessage">
              <div class="head">{{userInfo.profile.followeds}}</div>
              <div class="name">粉丝</div>
            </div>
          </div>
          <div class="signature">
            个人介绍：
            <template v-if="userInfo.profile.signature">{{userInfo.profile.signature}}</template>
            <template v-else>无</template>
          </div>
        </div>
      </div>
      <div class="playlist">
        <h3>歌单<span>({{userInfo.profile.playlistCount}})</span></h3>
        <RecommendList :type="'singerPlayList'" :count="userInfo.profile.playlistCount" :uid="UserId"></RecommendList>
      </div>
      <div class="playlist">
        <h3>收藏歌单</h3>
        <RecommendList :type="'singerLikeList'" :count="userInfo.profile.playlistCount" :uid="UserId"></RecommendList>
      </div>
    </template>
    <Loading :isload="isload" cover-name="UserPanel-container"/>
  </div>
</template>

<script>
import RecommendList from '@/components/RecommendRow/RecommendList'
import Loading from '@/components/Loading'
export default {
  name: 'UserPanel',
  props: ['UserId'],
  components: { Loading, RecommendList },
  data () {
    return {
      isload: false,
      userInfo: []
    }
  },
  methods: {
    async getUserInfo () {
      const res = await this.$http.get('/user/detail', {
        params: {
          uid: this.UserId,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }
      )
      this.userInfo = { ...res.data }
      this.isload = true
    },
    showMessage () {
      this.$notify({
        title: '抱歉',
        message: '动态等互动功能还在开发中，也许下个版本会更新，建议使用QQ空间'
      })
    },
    followUser (t) {
      this.$http.get('/follow', {
        params: {
          id: this.UserId,
          t: t,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      }).then((res) => {
        if (t === 1) {
          this.$message({
            type: 'success',
            message: '关注成功',
            duration: 1000
          })
          this.userInfo.profile.followed = true
        } else {
          this.$message({
            type: 'success',
            message: '取消关注成功',
            duration: 1000
          })
          this.userInfo.profile.followed = false
        }
      })
    }
  },
  created () {
    this.getUserInfo()
  },
  mounted () {
    const dc = document.getElementsByClassName('__panel')
    dc[2].scrollTop = 0
  }
}
</script>

<style lang="less" scoped>
.UserPanel-container{
  margin: 30px 25px 0;
  .user-message-header{
    display: flex;
    width: 700px;
    padding-bottom: 40px;
    .img-left{
      width: 200px;
      height: 200px;
      margin-right: 20px;
      flex-shrink: 0;
      .cover-img{
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }
    .message-right{
      flex: 1;
      h3{
        font-size: 23px;
        padding-bottom: 10px;
      }
      .basic-message{
        overflow: hidden;
        height: 40px;
        line-height: 40px;
        .identify{
          float: left;
          height: 20px;
          font-size: 13px;
          margin-top: 10px;
          line-height: 20px;
          vertical-align: center;
          display: inline-block;
          background-color: rgba(236, 65, 65, 0.2);
          border-radius: 10px;
          img{
            float: left;
            padding-top: 2.5px;
            width: 15px;
            height: 15px;
          }
          span{
            float: left;
            display: inline-block;
            margin:0 5px;
            display: inline-block;
            line-height: 20px;
            max-width: 150px;
            height: 20px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
        .user-level{
          float: left;
          display: inline-block;
          margin-left: 10px;
          margin-top: 10px;
          height: 20px;
          padding: 0 5px;
          line-height: 20px;
          border-radius: 10px;
          font-size: 13px;
          background-color: rgba(204, 204, 204, 0.6);
        }
        .user-gender{
          margin-left: 10px;
          float: left;
        }
        .operate-button{
          float: left;
          margin-left: 50px;
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
      .active-message{
        overflow: hidden;
        .message{
          display: inline-block;
          text-align: center;
          border-right: 1px solid #cccccc;
          padding: 0 15px;
          float: left;
          cursor: pointer;
        }
        .message:last-child{
          border: none;
        }
      }
      .signature{
        padding-top: 5px;
        font-size: 13px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        word-break: break-all; // 注意这个文字多行很重要
        -webkit-box-orient: vertical;
      }
      .link{
        display: inline-block;
        background-color: white;
        height: 30px;
        padding: 0 10px;
        line-height: 30px;
        border-radius: 20px;
        border: 1px solid #DCDFE6;
        font-size: 14px;
        font-weight: 500;
        margin-left: 20px;
        cursor: pointer;
      }
    }
  }
  .playlist{
    h3{
      margin: 10px;
      span{
        font-size: 15px;
        color: #9f9f9f;
        font-weight: normal;
      }
    }
  }
}
</style>
