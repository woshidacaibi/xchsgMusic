import Vue from 'vue'
import VueRouter from 'vue-router'
import SongListPanel from '@/views/MainWindow/SongListPanel/SongListPanel'
import MainIndex from '@/views/MainWindow/mainindex/MainIndex'
import PersonRecommend from '@/views/MainWindow/mainindex/soncomponent/PersonRecommend'
import AlbumPanel from '@/views/MainWindow/AlbumPanel/AlbumPanel'
import EverydayListPanel from '@/views/MainWindow/SongListPanel/EverydayListPanel'
import VideoPanel from '@/views/SingleWindow/VideoPanel'
import PersonSongLists from '@/views/MainWindow/mainindex/soncomponent/PersonSongLists'
import RankingListPanel from '@/views/MainWindow/mainindex/soncomponent/RankingListPanel'
import SingerPanel from '@/views/MainWindow/SingerPanel/SingerPanel'
import ArtistsRecommendPanel from '@/views/MainWindow/mainindex/soncomponent/ArtistsRecommendPanel'
import UserPanel from '@/views/MainWindow/UserPanel/UserPanel'
import NewSongsRecommendPanel from '@/views/MainWindow/mainindex/soncomponent/NewSongsRecommendPanel'
import SearchPanel from '@/views/MainWindow/SearchPanel/SearchPanel'
import FoundVideoPanel from '@/views/MainWindow/FoundVideoPanel'
import FoundVideos from '@/components/FoundVideoComponets/FoundVideos'
import FoundMvs from '@/components/FoundVideoComponets/FoundMvs'
import MySubscribePanel from '@/views/MainWindow/MySubscribePanel'
import SubscribeAlbum from '@/components/MySubscribeComponents/SubscribeAlbum'
import SubscribeArtists from '@/components/MySubscribeComponents/SubscribeArtists'
import SubscribeVideos from '@/components/MySubscribeComponents/SubscribeVideos'
import axios from 'axios'
Vue.use(VueRouter)
const routes = [
  { path: '', redirect: '/MainIndex' },
  {
    path: '/SongListPanel',
    name: 'SongListPanel',
    component: SongListPanel,
    props ($route) {
      return {
        playlistId: $route.query.playlistId
      }
    }
  },
  { name: 'SingerPanel', path: '/SingerPanel', component: SingerPanel },
  {
    path: '/EverydayListPanel',
    name: 'EverydayListPanel',
    component: EverydayListPanel
  },
  {
    path: '/AlbumPanel',
    name: 'AlbumPanel',
    component: AlbumPanel,
    props ($route) {
      return {
        albumId: $route.query.albumId
      }
    }
  },
  {
    path: '/UserPanel',
    name: 'UserPanel',
    component: UserPanel,
    props ($route) {
      return {
        UserId: $route.query.UserId
      }
    }
  },
  {
    path: '/MainIndex',
    name: 'MainIndex',
    component: MainIndex,
    children: [{
      path: '',
      redirect: 'PersonRecommend'
    },
    {
      path: 'PersonRecommend',
      component: PersonRecommend,
      meta: {
        IndexNavActive: '1'
      }
    },
    {
      path: '/PersonSongLists',
      name: 'PersonSongLists',
      component: PersonSongLists,
      meta: {
        IndexNavActive: '2'
      }
    },
    {
      path: '/RankingListPanel',
      name: 'RankingListPanel',
      component: RankingListPanel,
      meta: {
        IndexNavActive: '3'
      }
    },
    {
      path: '/ArtistsRecommendPanel',
      name: 'ArtistsRecommendPanel',
      component: ArtistsRecommendPanel,
      meta: {
        IndexNavActive: '4'
      }
    },
    {
      path: '/NewSongsRecommendPanel',
      name: 'NewSongsRecommendPanel',
      component: NewSongsRecommendPanel,
      meta: {
        IndexNavActive: '5'
      }
    }
    ]
  },
  {
    name: 'VideoPanel',
    path: '/VideoPanel',
    component: VideoPanel,
    meta: {
      single: true
    }
  },
  { name: 'SeachPanel', path: '/SearchPanel', component: SearchPanel },
  {
    name: 'FoundVideoPanel',
    path: '/FoundVideoPanel',
    component: FoundVideoPanel,
    children: [
      { path: '', redirect: 'FoundVideos' },
      { path: 'FoundVideos', name: 'FoundVideos', component: FoundVideos },
      { path: 'FoundMvs', name: 'FoundMvs', component: FoundMvs }
    ]
  },
  {
    name: 'MySubscribePanel',
    path: '/MySubscribePanel',
    component: MySubscribePanel,
    children: [
      { path: '', redirect: 'Albums' },
      { path: 'Albums', component: SubscribeAlbum },
      { path: 'Artists', component: SubscribeArtists },
      { path: 'Videos', component: SubscribeVideos }
    ]
  }
]
const router = new VueRouter({
  routes
})
router.beforeEach((to, from, next) => {
  if (!localStorage.getItem('cookie')) {
    router.app.$options.store.state.islogin = false
    axios.get('/register/anonimous', { params: { timestamp: Date.now() } }).then(res => {
      localStorage.setItem('cookie', res.data.cookie)
    })
  }
  if (to.meta.single === true) {
    router.app.$options.store.state.hasAsideAndPlayer = false
  } else router.app.$options.store.state.hasAsideAndPlayer = true
  if (to.meta.IndexNavActive) {
    router.app.$options.store.state.indexNavActiveIndex = to.meta.IndexNavActive
  }
  next()
})
export default router
