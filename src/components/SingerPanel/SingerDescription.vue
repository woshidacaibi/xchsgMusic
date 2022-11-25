<template>
  <div v-if="isload" class="singer-description-container">
    <div style="margin-top: 10px"></div>
    <div :key="index" v-for="(item,index) in descInfo.introduction" class="message-container">
      <h4 style="padding-bottom: 10px">{{item.ti}}</h4>
      <p v-html="item.txt.replace(/\n+/g, '<br />')" style="font-size: 15px;font-weight: lighter;margin-bottom: 5px"></p>
    </div>
    <div v-if="descInfo.introduction.length === 0">
      <h4 style="padding-bottom: 10px">简介</h4>
      <p v-html="descInfo.briefDesc.replace(/\n+/g, '<br />')" style="font-size: 15px;font-weight: lighter;margin-bottom: 5px"></p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SingerDescription',
  props: ['singerId'],
  data () {
    return {
      descInfo: {},
      isload: false
    }
  },
  methods: {
    async getSingerDesc () {
      const res = await this.$http.get('/artist/desc', {
        params: {
          id: this.singerId,
          cookie: localStorage.getItem('cookie')
        }
      })
      this.descInfo = { ...res.data }
      this.isload = true
    }
  },
  created () {
    this.getSingerDesc()
  }
}
</script>

<style scoped>
.singer-description-container{
  margin: 0 20px;
}
</style>
