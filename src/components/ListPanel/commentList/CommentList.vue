<template>
  <div class="comment-container">
    <div style="margin-top: 10px"></div>
    <div v-if="!isTypeUseful">
      <h1> Type Error</h1>
    </div>
    <template v-else-if="isload">
        <div class="input-comment">
          <el-input
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 4}"
            :maxlength="140"
            :placeholder="commentTip"
            v-model="commentContent"
            :show-word-limit="true"
            resize="none"
            @keyup.enter="sendComment"
          >
          </el-input>
          <el-button @click="sendComment" style="float:right;" round size="small">评论</el-button>
          <el-button v-show="commentObj" @click="commentObj=null" style="float:left;" round size="small">取消回复</el-button>
        </div>
        <div class="hot-comments" v-if="hotCommentList && hotCommentList.length>0">
          <h5 style="font-size: 15px; color: #373737">精彩评论</h5>
          <SingleComment v-for="item in hotCommentList.slice(0,10)"
                         :key="item.commentId"
                         :comment="item"
                         :sid="cid"
                         :type="type"
                         @reply="replyComment"
          ></SingleComment>
        </div>
        <div class="new-comments" v-if="currentCommentList && currentCommentList.length>0">
          <h5 style="font-size: 15px; color: #373737">最近评论({{ count }})</h5>
          <SingleComment
            v-for="item in currentCommentList"
            :key="item.commentId"
            :comment="item"
            :sid="cid"
            :type="type"
            @reply="replyComment"
          ></SingleComment>
        </div>
        <div class="no-comments" v-if="hotCommentList && currentCommentList && hotCommentList.length===0 && currentCommentList.length===0">还没有评论，来个社牛讲两句。。。</div>
        <el-pagination
          :page-size="limit"
          :pager-count="7"
          layout="prev, pager, next, jumper"
          :total="count"
          :hide-on-single-page="true"
          class="comment-footer"
          :current-page.sync="currentPage"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
    </template>
    <div class="comment-cover" v-show="!isload" style="width: 100%;height: 200px"></div>
  </div>
</template>

<script>
import SingleComment from '@/components/ListPanel/commentList/SingleComment'

export default {
  name: 'CommentList',
  props: ['cid', 'type', 'count', 'limit'],
  components: {
    SingleComment
  },
  data () {
    return {
      typeName: '',
      isTypeUseful: false,
      isload: false,
      currentPage: 1,
      currentCommentList: [],
      hotCommentList: [],
      offset: 0,
      before: '',
      commentTip: '请输入内容',
      commentObj: null,
      commentContent: '',
      load: {
        close () {
        }
      }
    }
  },
  watch: {
    cid () {
      this.offset = 0
      this.currentPage = 1
      this.getComments(this.cid, this.limit, this.offset, this.before)
    },
    isload (newVal) {
      if (!newVal) {
        this.loading()
      } else {
        if (this.load !== {}) {
          this.load.close()
        }
      }
    },
    commentObj (newVal) {
      if (newVal) {
        this.toTop()
        this.commentTip = '回复' + newVal.name + ':'
      } else {
        this.commentTip = '请输入内容'
      }
    }
  },
  methods: {
    async getComments (id, limit, offset, before) {
      this.isload = false
      const res = await this.$http.get(`/comment/${this.typeName}`, {
        params: {
          id: id,
          limit: limit,
          offset: offset,
          before: before,
          cookie: localStorage.getItem('cookie'),
          timestamp: Date.now()
        }
      })
      this.hotCommentList = res.data.hotComments
      this.currentCommentList = res.data.comments
      if (this.currentCommentList && this.currentCommentList.length > 0) {
        this.before = this.currentCommentList[this.currentCommentList.length - 1].time
      }
      this.isload = true
    },
    handleCurrentChange (val) {
      this.isload = false
      this.getComments(this.cid, this.limit, (val - 1) * this.limit, this.before)
      this.toTop()
    },
    async sendComment () {
      if (this.commentContent === '') {
        this.$message({
          message: '内容不能为空',
          type: 'warning'
        })
        return
      }
      if (this.$store.state.islogin === false) {
        this.$message({
          message: '请登录后评论',
          type: 'warning'
        })
        return
      }
      const t = this.commentObj ? 2 : 1
      if (t === 1) {
        const res = await this.$http.get('/comment', {
          params: {
            t,
            type: this.type,
            id: this.cid,
            content: this.commentContent,
            cookie: localStorage.getItem('cookie'),
            timestamp: Date.now()
          }
        })
        if (res.data.code === 200) {
          this.$message({
            message: '评论成功',
            type: 'success'
          })
          this.offset = 0
          this.currentPage = 1
          this.before = ''
          this.getComments(this.cid, this.limit, this.offset, this.before)
        } else {
          this.$message({
            message: '发送失败',
            type: 'warning'
          })
        }
      } else {
        const res = await this.$http.get('/comment', {
          params: {
            t,
            type: this.type,
            id: this.cid,
            content: this.commentContent,
            commentId: this.commentObj.commentId,
            cookie: localStorage.getItem('cookie'),
            timestamp: Date.now()
          }
        })
        if (res.data.code === 200) {
          this.$message({
            message: '评论成功',
            type: 'success'
          })
          this.offset = 0
          this.currentPage = 1
          this.before = ''
          this.getComments(this.cid, this.limit, this.offset, this.before)
        } else {
          this.$message({
            message: '发送失败',
            type: 'warning'
          })
        }
      }
      this.commentContent = ''
    },
    replyComment (val) {
      this.commentObj = val
    },
    toTop () {
      const dc = document.getElementsByClassName('__panel')
      const arrDc = Array.from(dc)
      arrDc.forEach(val => {
        val.scrollTop = 400
      })
    },
    loading () {
      this.load = this.$loading({
        lock: true,
        text: '加载中，请稍等',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.comment-cover')
      })
    }
  },
  created () {
    switch (this.type) {
      case (0) : {
        this.typeName = 'music'
        break
      }
      case (1) : {
        this.typeName = 'mv'
        break
      }
      case (2) : {
        this.typeName = 'playlist'
        break
      }
      case (3) : {
        this.typeName = 'album'
        break
      }
      case (4) : {
        this.typeName = 'dj'
        break
      }
      case (5) : {
        this.typeName = 'video'
        break
      }
    }
    if (this.typeName !== '') {
      this.isTypeUseful = true
    }
    this.isload = false
    this.getComments(this.cid, this.limit, this.offset, this.before)
  },
  mounted () {
    if (!this.isload) {
      this.loading()
    }
  }
}
</script>

<style lang="less" scoped>
.comment-container {
  margin-left: 20px;
  min-height: 200px;
}
.input-comment{
  width: 100%;
  height: 150px;
}
.new-comments {
  margin-top: 50px;
}

.comment-footer {
  width: 400px;
  margin: 50px auto;
}
.no-comments{
  margin-top: 50px;
  text-align: center;
  color: #343434;
}
</style>
