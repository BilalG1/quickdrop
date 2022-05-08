<template>
  <div v-if="!cameraActive && !receiverActive">
    <div class="title">
      QuickDrop
    </div>
    <div v-if="socketIsConnected">
      <div>
        <button @click="handleNewSession" class="btn">
          New Session
        </button>
      </div>
      <div class="or">OR</div>
      <div>
        <div>
          <button @click="handleJoinSession" class="btn">
            Join Session
          </button>
        </div>
        <input v-model="joinSessionCode" placeholder="ABC9" class="code-input" @keyup.enter="handleJoinSession"/>
        <div>
          {{joinSessionErr}}
        </div>
      </div>
    </div>
    <div v-else>
      <Loader />
    </div>
  </div>

  <div v-if="sessionCode" class="code">
    Code: {{sessionCode}}
  </div>
  <Camera v-if="cameraActive" @sendImage="handleSendImage"/>
  <Receiver v-else-if="receiverActive" :imgDataArray="imgDataArray"/>
</template>

<script>
import io from 'socket.io-client'
import Camera from './components/Camera.vue'
import Receiver from './components/Receiver.vue'
import Loader from './components/Loader.vue'
const socket = io(process.env.NODE_ENV === 'production' ? 'https://quick-drop.herokuapp.com' : 'http://localhost:3000')

export default {
  name: 'App',
  components: {
    Camera,
    Receiver,
    Loader,
  },
  data() {
    return {
      cameraActive: false,
      receiverActive: false,
      sessionCode: '',
      joinSessionCode: '',
      joinSessionErr: '',
      imgDataArray: [],

      socketIsConnected: false,
    }
  },
  mounted() {
    socket.on('sessionCode', code => this.sessionCode = code)
    socket.on('unknownSession', () => this.joinSessionErr = 'Invalid session code')
    socket.on('initReceiver', () => this.receiverActive = true)
    socket.on('receiveImage', this.handleReceiveImage)
    // setInterval(() => console.log(socket.connected), 1000)
    const serverCheck = setInterval(() => {
      if(socket.connected){
        clearInterval(serverCheck)
        this.socketIsConnected = true
      }
    }, 500)
  },
  methods: {
    handleNewSession() {
      socket.emit('newSession')
      this.cameraActive = true
    },
    handleJoinSession() {
      socket.emit('joinSession', this.joinSessionCode)
    },
    handleSendImage(imgData) {
      console.log(imgData)
      socket.emit('sendImage', imgData)
    },
    handleReceiveImage(imgDataSrc) {
      // console.log(imgData)
      console.log('received img')
      this.imgDataArray.push(imgDataSrc)
    }
  }
}
</script>

<style>
body, html{
  padding: 0;
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.title{
  color: black;
  font-weight: 800;
  font-size: 42px;
  padding-bottom: 25vh;
  padding-top: 60px;
}
.btn{
  background-color: orange;
  color: white;
  border: none;
  padding: 5px 10px;
  font-size: 24px;
  border-radius: 8px;
  cursor: pointer;
}
.btn:hover{
  background-color:red;
  transition: .5s all;
}
.or{
  margin: 20px;
}
.code-input{
  margin-top: 10px;
  width: 70px;
  font-size: 20px;
}
.code{
  font-size: 20px;
  margin: 10px;
}
</style>
