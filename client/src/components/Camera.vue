<template>
  <video id="camera-view" autoplay playsinline />
  <div>
    <button @click="handleShowLiveToggle" class="btn-picture">
      {{showLive ? 'Stop Show Live' : 'Show Live'}}
    </button>
    <button @click="handleTakePicture" :disabled="showLive" class="btn-picture">
      Take Picture
    </button>
  </div>
  <canvas id="canvas" />
</template>

<script>

export default {
  name: 'Camera',
  data() {
    return {
      showLive: false,
      showLiveInterval: null,
    } 
  },
  mounted() {
    const constraints = { video: { facingMode: "environment" }, audio: false }
    const cameraView = document.getElementById('camera-view')
    navigator.mediaDevices
    .getUserMedia(constraints).then((stream => {
        cameraView.srcObject = stream
    }))
  },
  methods: {
    handleTakePicture() {
      const cameraView = document.getElementById('camera-view')
      const canvas = document.getElementById('canvas')
      canvas.width = cameraView.videoWidth
      canvas.height = cameraView.videoHeight
      canvas.getContext('2d')
        .drawImage(cameraView, 0, 0, canvas.width, canvas.height)
      const dataURL = canvas.toDataURL()
      // console.log(dataURL)

      this.$emit('sendImage', dataURL)
    },
    handleShowLiveToggle() {
      this.showLive = !this.showLive
      if (this.showLive) {
        const delay = 100
        this.showLiveInterval = setInterval(this.handleTakePicture, delay)
      }
      else 
        clearInterval(this.showLiveInterval)
    }
  }
}
</script>

<style scoped>
.btn-picture{
  color: black;
  border-radius: 8px;
  border: 1px solid black;
  background: white;
  padding: 5px;
  cursor: pointer;
  margin-right: 10px;
  margin-bottom: 10px;
  transition: .25s all;
}
.btn-picture:hover{
  background: lightgray;
}
.btn-picture:disabled{
  background: gray;
  cursor: initial;
}
</style>