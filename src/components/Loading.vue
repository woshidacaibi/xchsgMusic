<template>
  <div v-show="!isload" :class="coverClassName" style="width: 100%;height: 200px"></div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/multi-word-component-names
  name: 'Loading',
  props: { coverName: { require: true, type: String }, isload: { require: true, type: Boolean }, text: {} },
  data () {
    return {
      load: {
        close () {}
      }
    }
  },
  methods: {
    loading () {
      this.load = this.$loading({
        lock: true,
        text: this.text ? this.text : '加载中，请稍等',
        spinner: 'el-icon-loading',
        background: 'whitesmoke',
        target: document.querySelector('.' + this.coverClassName)
      })
    }
  },
  watch: {
    isload: {
      handler (newVal) {
        if (!newVal) {
          this.loading()
        } else {
          if (this.load !== {}) { this.load.close() }
        }
      }
    }
  },
  computed: {
    coverClassName () {
      return this.coverName + '-cover'
    }
  },
  mounted () {
    if (!this.isload) {
      this.loading()
    }
  }
}
</script>

<style scoped>

</style>
