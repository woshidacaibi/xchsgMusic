import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    hasAsideAndPlayer: true, // true为包含aside和底部播放器的版本； false为单页面不包含播放器和aside参考MV界面
    logining: false,
    userInfo: {},
    islogin: false,
    // 滚动条属性
    ops: {
      bar: {
        hoverStyle: true,
        onlyShowBarOnScroll: true, // 是否只有滚动的时候才显示滚动条
        showDelay: 1, // 在鼠标离开容器后多长时间隐藏滚动条。
        keepShow: true, // 滚动条是否保持显示。
        background: 'rgba(0, 0, 0, 0.10)', // 滚动条背景色。
        'overflow-x': 'hidden'
      }
    },
    // 播放列表
    playsongList: [],
    likesongids: [],
    mylikeListid: 0,
    mylikeList: [],
    MysonglistString: '',
    LikesonglistString: '',
    // 专辑
    myLikeAlbum: [],
    AlbumCheck: false,
    currentIndex: 0,
    // 播放器
    isReadyPlay: false,
    currentMusic: {
      id: -1,
      name: '请选择歌曲',
      al: {
        id: 151495625,
        name: '',
        picUrl: '',
        tns: [],
        pic_str: '109951167873380388',
        pic: 109951167873380380
      },
      ar: [{ id: 35796201, name: '未知', tns: [], alias: [] }],
      alia: [''],
      dt: 0
    },
    errorMusic: {
      id: -1,
      name: '请选择歌曲',
      al: {
        id: 151495625,
        name: '',
        picUrl: '',
        tns: [],
        pic_str: '109951167873380388',
        pic: 109951167873380380
      },
      ar: [{ id: 35796201, name: '未知', tns: [], alias: [] }],
      alia: [''],
      dt: 0
    },
    playMethod: localStorage.getItem('playMethod') ? Number(localStorage.getItem('playMethod')) : 0,
    // 主页
    indexNavActiveIndex: '1',
    BannerIndex: 0,
    subArtist: [],
    historyListMessage: JSON.parse(localStorage.getItem('historyListMessage')),
    // 歌曲详情
    songStatus: false,
    currentLyrics: '',
    showSongDetail: false,
    currentLyricsContent: '暂无歌词'
  },
  mutations: {
    COMMITHISTORY (state, value) {
      localStorage.setItem('historyListMessage', JSON.stringify(state.historyListMessage))
    },
    CLOSELOGIN (state, value) {
      state.logining = value
    },
    PUSHSONGTOLIST (state, value) {
      state.playsongList.splice(state.currentIndex, 0, value)
      state.currentMusic = state.playsongList[state.currentIndex]
      localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
      localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
    },
    LASTSONG (state, value) {
      if (value === 1) {
        state.currentIndex = Math.floor(Math.random() * state.playsongList.length)
        state.currentMusic = state.playsongList[state.currentIndex]
        localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
        localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
      } else {
        state.currentIndex--
        if (state.currentIndex < 0) {
          state.currentIndex = state.playsongList.length - 1
        }
        state.currentMusic = state.playsongList[state.currentIndex]
        localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
        localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
      }
    },
    NEXTSONG (state, value) {
      if (value === 1) {
        state.currentIndex = Math.floor(Math.random() * state.playsongList.length)
        state.currentMusic = state.playsongList[state.currentIndex]
        localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
        localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
      } else {
        state.currentIndex++
        if (state.currentIndex >= state.playsongList.length) {
          state.currentIndex = 0
        }
        state.currentMusic = state.playsongList[state.currentIndex]
        localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
        localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
      }
    },
    // 把得到的表单细节中的歌曲信息添加到播放列表  /playlist/detail?id=871533137
    UPDATESONGLIST (state, value) {
      if (state.playMethod === 2) {
        state.playMethod = 0
      }
      state.playsongList = []
      state.currentIndex = 0
      value.forEach(item => {
        state.playsongList.push({
          // id: item.id,
          // name: item.name,
          // picmsg: item.al,
          // artist: item.ar,
          alia: item.alia ? item.alia : [],
          // dt: item.dt,
          ...item
        })
      })
      state.isReadyPlay = true
      state.currentMusic = state.playsongList[0]
      localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
      localStorage.setItem('normalHistoryList', JSON.stringify(state.playsongList))
      localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
    },
    PUSHXINDONGLIST (state, value) {
      state.playsongList = []
      state.currentIndex = 0
      value.forEach(item => {
        state.playsongList.push({
          // id: item.id,
          // name: item.name,
          // picmsg: item.al,
          // artist: item.ar,
          alia: item.alia ? item.alia : [],
          // dt: item.dt,
          ...item
        })
      })
      state.isReadyPlay = true
      state.currentMusic = state.playsongList[0]
      localStorage.setItem('historySongList', JSON.stringify(state.playsongList))
      localStorage.setItem('historyListIndex', JSON.stringify(state.currentIndex))
    }
  },
  actions: {
    pushsongtolist (context, value) {
      const index = context.state.playsongList.findIndex(val => {
        return val.id === value.id
      })
      if (index === -1) { context.commit('PUSHSONGTOLIST', value) } else {
        context.state.currentIndex = index
        context.state.currentMusic = context.state.playsongList[context.state.currentIndex]
        localStorage.setItem('historySongList', JSON.stringify(context.state.playsongList))
        localStorage.setItem('historyListIndex', JSON.stringify(context.state.currentIndex))
      }
    }
  },
  modules: {
  }
})
