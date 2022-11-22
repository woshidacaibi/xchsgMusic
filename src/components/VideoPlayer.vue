<template>
  <div class="VideoPlayer-container">
    <d-player id="player" :options="dplayerOptions" class="player"></d-player>
  </div>
</template>

<script>
export default {
  name: 'VideoPlayer',
  props: ['videoUrl'],
  data () {
    return {
      // dplayerOptions: {
      //   theme: '#b7daff', // 风格颜色，例如播放条，音量条的颜色
      //   loop: false, // 是否自动循环
      //   lang: 'zh-cn', // 语言，'en', 'zh-cn', 'zh-tw'
      //   screenshot: true, // 是否允许截图（按钮），点击可以自动将截图下载到本地
      //   hotkey: true, // 是否支持热键，调节音量，播放，暂停等
      //   preload: 'auto', // 自动预加载
      //   volume: 0.7, // 初始化音量
      //   logo: require('@/assets/logo.png'), // 在视频左脚上打一个logo
      //   video: {
      //     url: this.videoUrl, // 播放视频的路径
      //     quality: [ // 设置多个质量的视频
      //       {
      //         name: 'HD',
      //         url: this.videoUrl,
      //         type: 'auto' // 'auto', 'hls', 'flv', 'dash', 'webtorrent', 'normal' 或 其他自定义类型
      //       }
      //     ],
      //     defaultQuality: 0, // 默认是HD
      //     pic: '' // 视频封面图片
      //     // thumbnails: require('@/assets/thumbnails.jpg') // 进度条上的缩略图,需要通过dplayer-thumbnails来生成
      //   },
      //   container: document.querySelector('.app-container')
      //   // subtitle: {
      //   //   // url: 'http://www.baidu.com',
      //   //   // fontSize: '20px',
      //   //   // bottom: '50%'
      //   // },
      //   // danmaku: { // 弹幕
      //   //   // id: '9E2E3368B56CDBB4',
      //   //   // api: 'https://api.prprpr.me/dplayer/',
      //   //   // token: 'tokendemo',
      //   //   // maximum: 1000,
      //   //   // addition: ['https://api.prprpr.me/dplayer/v3/bilibili?aid=4157142'],
      //   //   // user: 'DIYgod',
      //   //   // bottom: '15%',
      //   //   // unlimited: true
      //   // },
      //   // contextmenu: [ // 右键菜单
      //   //   // {
      //   //   //   text: 'custom1',
      //   //   //   link: 'https://www.bilibili.com'
      //   //   // },
      //   //   // {
      //   //   //   text: 'custom2',
      //   //   //   click: (player) => {
      //   //   //     console.log(player)
      //   //   //   }
      //   //   // }
      //   // ],
      //   // highlight: [ // 进度条时间点高亮
      //   //   // {
      //   //   //   text: '10M',
      //   //   //   time: 600
      //   //   // },
      //   //   // {
      //   //   //   text: '20M',
      //   //   //   time: 1200
      //   //   // }
      //   // ]
      // }
      dplayerOptions: {
        container: document.getElementById('player'),
        video: {
          url: this.videoUrl
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
*{box-sizing: border-box}
  .VideoPanel-container{
    width: 100%;
    .player{
      background-color: black;
      width: 625px;
      height: 370px;
    }
  }
  .dplayer-icon,.dplayer-full-in-icon{
    z-index: -1;
  }
</style>
