<template>
  <div class="login-panel-container">
    <div class="container">
      <span class="close"><i @click="$store.state.logining = false" class="iconfont icon-guanbi"></i></span>
      <div ref="form-box" class="form-box">
        <!-- 注册 -->
        <div ref="QR-box" class="QR-box hidden">
          <h1>二维码登录</h1>
          <div style="position: relative;">
            <img v-if="isQRLoad" :src="keyImg" alt="">
            <div v-if="keyStatus === 800" class="qr-hide-cover" @click="getKey"><span>二维码失效了捏，点我重新刷新</span></div>
          </div>
          <span class="tip">{{keyTips}}</span>
          <span class="tip-bottom">(推荐，安全捏)</span>
        </div>
        <!-- 登录 -->
        <div ref="phone-box" class="phone-box">
          <h1>手机登录</h1>
          <input type="text" v-model="phone" placeholder="手机号">
          <input type="password" v-model="captcha" placeholder="验证码">
          <button @click="login">登录</button>
        </div>
      </div>
      <div class="con-box left">
        <h2>欢迎来<span>德丽傻音乐</span></h2>
        <p>快点<span>TeRiRi</span>吧</p>
        <img src="@/assets/login.gif" alt="">
        <p>没下载客户端？手机号登录👇</p>
        <button @click="toPhone">去登录</button>
      </div>
      <div class="con-box right">
        <h2>欢迎来<span>德丽傻音乐</span></h2>
        <p>快点<span>TeRiRi</span>吧</p>
        <img style="margin: 20px 0" v-if="status===0" src="@/assets/start.png" alt="">
        <img style="margin: 20px 0" v-if="status===1" src="@/assets/active.gif" alt="">
        <img style="margin: 20px 0" v-if="status===2" src="@/assets/end.png" alt="">
        <button ref="sendCode" style="margin-bottom: 3%" @click="getCaptcha">
          <template v-if="internal && status === 2">发送成功({{internal}})</template>
          <template v-else-if="status===1">发送中</template>
          <template v-else>发送验证码</template>
        </button>
        <p>未绑定手机号？使用二维码登录</p>
        <button @click="toQR">二维码登录</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'loginPanel',
  data () {
    return {
      phone: '',
      captcha: '',
      key: '',
      keyImg: '',
      internal: 0,
      status: 0,
      keyTimer: null,
      keyStatus: 801,
      keyTips: '等待扫码',
      isQRLoad: false
    }
  },
  created () {
    this.getKey()
  },
  methods: {
    // 获得验证码
    getCaptcha () {
      const ref = /^1((34[0-8])|(8\d{2})|(([35][0-35-9]|4[579]|66|7[35678]|9[1389])\d{1}))\d{7}$/
      if (!ref.test(this.phone)) {
        this.$message({
          message: '手机号格式错误',
          type: 'error',
          duration: 3000,
          offset: 30
        })
        return
      }
      this.$http.get('/captcha/sent', { params: { phone: this.phone, cookie: localStorage.getItem('cookie') } }).then((res) => {
        if (res.status === 200) {
          this.status = 1
          this.internal = 60
          setTimeout(() => {
            this.status = 2
          }, 1360)
          const timer = setInterval(() => {
            this.internal--
            if (this.internal <= 0) { clearInterval(timer) }
          }, 1000)
        } else {
          this.internal = res.data.message
        }
      }).catch(() => {
        this.$message({ message: '发送失败请稍后重试', type: 'error' })
      })
    },
    // 登录验证（手机+ 验证码）
    login () {
      if (this.phone === '' || this.captcha === '') {
        this.$message({
          message: '你是不是忘填手机号或者验证码了，(lll￢ω￢)',
          type: 'error',
          duration: 3000,
          offset: 30
        })
        return
      }
      this.$http.get('/login/cellphone', { params: { phone: this.phone, captcha: this.captcha, cookie: localStorage.getItem('cookie') } }).then((result) => {
        if (result.status === 200) {
          this.$store.state.logining = false
          this.$store.state.userId = result.data.id
          localStorage.setItem('cookie', result.data.cookie)
          this.$store.state.islogin = true
          location.reload()
        }
      }, () => {
        this.$message({ message: '验证码错误', type: 'error' })
      })
    },
    async getKey () {
      await this.$http.get('/login/qr/key').then(res => {
        this.key = res.data.data.unikey
        this.$http.get(`/login/qr/create?key=${this.key}&qrimg=base64&timestamp=${Date.now()}`, {
          params: {
            cookie: localStorage.getItem('cookie')
          }
        }).then(res => {
          this.keyImg = res.data.data.qrimg
          this.isQRLoad = true
          if (this.keyTimer === null) {
            this.keyTimer = setInterval(() => {
              this.keyCheck()
            }, 1500)
          }
        })
      }).catch(() => {
        this.$message({ message: '获取二维码失败', type: 'error' })
      })
    },
    async keyCheck () {
      const res = await this.$http.get(`/login/qr/check?key=${this.key}&timestamp=${Date.now()}`, {
        params: {
          cookie: localStorage.getItem('cookie')
        }
      })
      this.keyStatus = res.data.code
      this.keyTips = res.data.message
      if (res.data.code === 803) {
        localStorage.setItem('cookie', res.data.cookie)
        location.reload()
      } else if (res.data.code === 800) { this.keyTimer = null }
    },
    toQR () {
      this.$refs['form-box'].style.transform = 'translateX(80%)'
      this.$refs['phone-box'].classList.add('hidden')
      this.$refs['QR-box'].classList.remove('hidden')
    },
    toPhone () {
      this.$refs['form-box'].style.transform = 'translateX(0%)'
      this.$refs['QR-box'].classList.add('hidden')
      this.$refs['phone-box'].classList.remove('hidden')
    }
  },
  watch: {
    internal: {
      handler (newVal) {
        if (newVal > 0) {
          this.$refs.sendCode.disabled = true
          this.$refs.sendCode.classList.add('disabled')
        }
        if (newVal === 0) {
          this.$refs.sendCode.disabled = false
          this.$refs.sendCode.classList.remove('disabled')
        }
      }
    }
  },
  beforeDestroy () {
    clearInterval(this.keyTimer)
  }
}
</script>

<style lang="less" scoped>
  .login-panel-container{
    position: absolute;
    left: 0;
    top: 0;
    background-color: rgba(3, 3, 3, 0.43);
    z-index: 100;
    width: 100%;
    height: 100%;
  }
  .close{
    float: right;
    margin-top: 5px;
    margin-right: 10px;
    .iconfont{
      font-size: 20px;
    }
  }
  .container {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translateX(-50%) translateY(-50%);
    background-color: #fff;
    width: 650px;
    height: 415px;
    border-radius: 5px;
    box-shadow: 5px 5px 5px rgba(0, 0, 0, 0, 1);
  }
  .form-box {
    position: absolute;
    top: -10%;
    left: 5%;
    background-color: #d3b7d8;
    width: 320px;
    height: 500px;
    border-radius: 5px;
    box-shadow: 2px 0 10px rgba(0, 0, 0, 0, 1);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2;
    transition: 0.5s ease-in-out;
  }
  .QR-box,
  .phone-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    animation: fadeIn 0.75s linear;
    img{
      width: 300px;
      height: 300px;
    }
    .tip{
      width: 200px;
      color: white;
      text-align: center;
    }
    .tip-bottom{
      width: 200px;
      color: blanchedalmond;
      font-size: 13px;
      text-align: center;
    }
  }
  .qr-hide-cover{
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(3, 3, 3, 0.43);
    width: 300px;
    height: 300px;
    span{
      color: white;
      display: block;
      text-align: center;
      line-height: 300px;
    }
  }
  .hidden {
    display: none;
    transition: 0.5s;
  }

  h1 {
    text-align: center;
    margin-bottom: 25px;
    /* 大写 */
    text-transform: uppercase;
    color: #fff;
    /* 字间距 */
    letter-spacing: 5px;
  }

  input {
    background-color: transparent;
    width: 70%;
    color: #fff;
    border: none;
    /* 下边框样式 */
    border-bottom: 1px solid rgba(255, 255, 255, 0, 4);
    padding: 10px 0;
    text-indent: 10px;
    margin: 8px 0;
    font-size: 14px;
    letter-spacing: 2px;
  }
  .con-box .disabled{
    background-color: #fff;
    border: 1px solid #cccccc;
    color: #9f9f9f;
  }
  .con-box .disabled:hover{
    background-color: #fff;
    border: 1px solid #cccccc;
    color: #9f9f9f;
    cursor: default;
  }
  input::placeholder {
    color: #fff;
  }

  input:focus {
    color: #a262ad;
    outline: none;
    border-bottom: 1px solid #a262ad80;
    transition: 0.5s;
  }

  input:focus::placeholder {
    opacity: 0;
  }

  .form-box button {
    width: 70%;
    margin-top: 35px;
    background-color: #f6f6f6;
    outline: none;
    border-radius: 8px;
    padding: 13px;
    color: #a262ad;
    letter-spacing: 2px;
    border: none;
    cursor: pointer;
  }

  .form-box button:hover {
    background-color: #a262ad;
    color: #f6f6f6;
    transition: background-color 0.5s ease;
  }

  .con-box {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  .con-box.left {
    left: -2%;
  }

  .con-box.right {
    right: -2%;
    img{
      height: 100px;
    }
  }

  .con-box h2 {
    color: #8e9aaf;
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 3px;
    text-align: center;
    margin-bottom: 4px;
  }

  .con-box p {
    font-size: 12px;
    letter-spacing: 2px;
    color: #8e9aaf;
    text-align: center;
  }

  .con-box span {
    color: #d3b7d8;
  }

  .con-box img {
    width: 150px;
    height: 150px;
    opacity: 0.9;
    margin: 40px 0;
  }

  .con-box button {
    margin-top: 3%;
    background-color: #fff;
    color: #a262ad;
    border: 1px solid #d3b7d8;
    padding: 6px 10px;
    border-radius: 5px;
    letter-spacing: 1px;
    outline: none;
    cursor: pointer;
  }

  .con-box button:hover {
    background-color: #d3b7d8;
    color: #fff;
  }
  @keyframes fadeIn {
    0%{
      opacity: 0;
    }
    50%{
      opacity: 0.5;
    }
    100%{
      opacity: 1;
    }
  }
</style>
