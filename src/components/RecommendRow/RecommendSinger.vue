<template>
  <div class="Recommend-singer-container recommend-row">
    <div class="singer-container" v-for="item in artists" :key="item.id" >
      <ArtistsSingleItem :artist="item"></ArtistsSingleItem>
    </div>
  </div>
</template>

<script>
import ArtistsSingleItem from '@/components/RecommendSingleItem/ArtistsSingleItem'
export default {
  name: 'RecommendSinger',
  props: ['singers'],
  components: { ArtistsSingleItem },
  computed: {
    artists () {
      return this.singers
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

.singer-container{
  flex: 0 0 20%;
}
</style>
