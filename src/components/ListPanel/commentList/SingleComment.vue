<template>
  <div class="single-comment-container">
    <router-link :to="{path:'/UserPanel',query:{UserId:comment.user.userId}}" class="left">
      <img :src="copy_comment.user.avatarUrl" alt="">
    </router-link>
    <div class="right">
      <div class="right-top">
        <router-link :to="{path:'/UserPanel',query:{UserId:comment.user.userId}}" class="name">{{ comment.user.nickname }}:</router-link>
        <span class="content">
          {{copy_comment.content}}
        </span>
      </div>
      <div class="right-medium" v-if="copy_comment.beReplied.length>0">
        <div :key="item.user.beRepliedCommentId" v-for="item in copy_comment.beReplied">
          <router-link :to="{path:'/UserPanel',query:{UserId:item.user.userId}}" class="name">@{{item.user.nickname}}:</router-link>
          <span class="content">
            {{item.content}}
          </span>
        </div>
      </div>
      <div class="right-bottom">
        <span class="time">{{timeFormat(copy_comment.time)}}</span>
        <span class="icon">
          <span class="count">
            <i class="iconfont icon-dianzan1" v-if="!copy_comment.liked" @click="like"></i>
            <i class="iconfont icon-dianzan1" @click="dislike" style="color: red" v-else></i>
            <span>{{copy_comment.likedCount}}</span>
          </span>
          <i @click="reply" class="iconfont icon-pinglun"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingleComment',
  props: ['comment', 'sid', 'type'],
  data () {
    return {
      liked: this.comment.liked,
      copy_comment: this.comment
    }
  },
  created () {
    // console.log(this.comment)
  },
  methods: {
    timeFormat (timer) {
      return this.$time(timer).format('YYYY年MM月DD日 HH:mm:ss')
    },
    like () {
      this.$http.get('/comment/like', {
        params: {
          id: this.sid,
          cid: this.comment.commentId,
          type: this.type,
          t: 1,
          cookie: localStorage.getItem('cookie')
        }
      }).then((res) => {
        this.copy_comment.liked = true
        this.copy_comment.likedCount++
      })
    },
    dislike () {
      this.$http.get('/comment/like', {
        params: {
          id: this.sid,
          cid: this.comment.commentId,
          type: this.type,
          t: 0,
          cookie: localStorage.getItem('cookie')
        }
      }).then((res) => {
        this.copy_comment.liked = false
        this.copy_comment.likedCount--
      })
    },
    reply () {
      const val = { name: this.comment.user.nickname, commentId: this.comment.commentId }
      this.$emit('reply', val)
    }
  }
}
</script>

<style lang="less" scoped>
  .single-comment-container{
    display: flex;
    border-bottom: 1px solid #ccc;
    padding: 10px 0 10px 0;
    .left{
      flex-shrink: 0;
      margin: 10px;
      img{
        width: 35px;
        border-radius: 50%;
      }
    }
    .right{
      clear: both;
      margin-right: 5px;
      flex: 1;
      .name{
        color: #507daf;
        font-size: 13px;
      }
      .content{
        width: 100px;
        color: #373737;
        font-size: 13px;
      }
      .right-bottom{
        margin-top: 10px;
      }
      .right-medium{
        margin-top: 5px;
        padding: 0 5px 5px 5px;
        background-color: rgba(190, 190, 190, 0.4);
        border-radius: 5px;
      }
      .time{
        float: left;
        color: #9f9f9f;
        font-size: 13px;
      }
      .icon{
        float: right;
        .count{
          cursor: pointer;
          padding: 0 10px;
          border-right: 1px solid #9f9f9f;
          span{
            font-size: 14px;
          }
        }
        .icon-pinglun{
          margin: 10px;
        }
      }
    }
  }
</style>
