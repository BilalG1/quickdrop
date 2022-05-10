<template>
  <div v-if="code" class="code">
    Code: {{code}}
    <button v-if="allowsScreenCapture" @click="toggleMediaDevice" class="btn-picture toggle-media">
      {{isRecordingScreen ? 'Record Camera' : 'Record Screen'}}
    </button>
  </div>
  <video id="camera-view" autoplay playsinline @mousedown="startCrop" @mousemove="moveCrop" @mouseup="endCrop"/>
  <div>
    <button @click="handleTakePicture" class="btn-picture">
      Take Picture
    </button>
  </div>
  <canvas id="canvas" />
  <div id="crop-mask" />
</template>

<script>

export default {
  name: 'Camera',
  props: ['code'],
  emits: ['sendImage'],
  data() {
    return {
      showLiveInterval: null,
      allowsScreenCapture: false,
      isRecordingScreen: false,

      crop: {
        active: false,
      }
    } 
  },
  mounted() {
    const constraints = { video: { facingMode: "environment" }, audio: false }
    const cameraView = document.getElementById('camera-view')
    navigator.mediaDevices
    .getUserMedia(constraints).then((stream => {
        cameraView.srcObject = stream
    }))
    .catch(e => console.log(e))

    if (navigator.mediaDevices?.getDisplayMedia)
      this.allowsScreenCapture = true

    window.addEventListener('mouseup', this.cancelCrop)
  },
  unmounted() {
    window.removeEventListener('mouseup', this.cancelCrop)
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

      this.$emit('sendImage', dataURL)
    },
    toggleMediaDevice() {
      const cameraView = document.getElementById('camera-view')
      const constraints = { video: { facingMode: "environment" }, audio: false }


      if (!this.isRecordingScreen) {
        navigator.mediaDevices
        .getDisplayMedia().then((stream => {
          cameraView.srcObject = stream
          this.isRecordingScreen = !this.isRecordingScreen

        }))
        .catch(e => console.log(e))
      }

      else {
        navigator.mediaDevices
        .getUserMedia(constraints).then((stream => {
          cameraView.srcObject = stream
          this.isRecordingScreen = !this.isRecordingScreen
        }))
        .catch(e => console.log(e))
      }
    },
    startCrop(e) {
      this.crop.startX = e.clientX + window.scrollX
      this.crop.startY = e.clientY + window.scrollY
      this.crop.active = true
    },
    moveCrop(e) {
      if (!this.crop.active)
        return
      this.crop.endX = e.clientX + window.scrollX
      this.crop.endY = e.clientY + window.scrollY
      // console.log(this.crop)

      const cropMask = document.getElementById('crop-mask')
      cropMask.style.top = Math.min(this.crop.startY, this.crop.endY) + 'px'
      cropMask.style.left = Math.min(this.crop.startX, this.crop.endX) + 'px'
      cropMask.style.height = Math.abs(this.crop.endY - this.crop.startY) + 'px'
      cropMask.style.width = Math.abs(this.crop.endX - this.crop.startX) + 'px'
      cropMask.style.display = 'initial'
    },
    endCrop(e) {
      if(!this.crop.active)
        return
      this.crop.endX = e.clientX + window.scrollX
      this.crop.endY = e.clientY + window.scrollY
      this.handleTakeCropPicture()
      this.cancelCrop()
    },
    cancelCrop(){
      if(!this.crop.active)
        return
      const cropMask = document.getElementById('crop-mask')
      cropMask.style.display = 'none'
      this.crop.active = false
    },
    handleTakeCropPicture() {
      // console.log(this.crop)
      const canvas = document.getElementById('canvas')
      canvas.width = Math.abs(this.crop.endX - this.crop.startX)
      canvas.height = Math.abs(this.crop.endY - this.crop.startY)

      const cameraView = document.getElementById('camera-view')
      const {x, y, width, height} = cameraView.getBoundingClientRect()

      const videoBasisSx = ((Math.min(this.crop.startX, this.crop.endX) - x - window.scrollX) * cameraView.videoWidth) / width
      const videoBasisSy = ((Math.min(this.crop.startY, this.crop.endY) - y - window.scrollY) * cameraView.videoHeight) / height
      const videoBasisWidth = (canvas.width * cameraView.videoWidth) / width
      const videoBasisHeight = (canvas.height * cameraView.videoHeight) / height
      canvas.getContext('2d')
        .drawImage(
          cameraView, 
          videoBasisSx, 
          videoBasisSy, 
          videoBasisWidth,
          videoBasisHeight,
          0,
          0,
          canvas.width, 
          canvas.height
        )
      const dataURL = canvas.toDataURL()

      this.$emit('sendImage', dataURL)
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
  padding: 10px;
  cursor: pointer;
  margin-bottom: 10px;
  transition: .25s all;
  font-size: 16px;
}

@media (hover: hover) and (pointer: fine) {
  .btn-picture:hover{
    background: lightgray;
  }
}

.btn-picture:active{
  background: white;
}

#camera-view, #canvas{
  max-width: calc(100vw - 20px);
  margin: 0 auto;
}

#camera-view{
  cursor: crosshair;
}

.code{
  font-size: 20px;
  margin: 10px;
  font-weight: 600;
}

.toggle-media{
  padding: 5px;
  border: 2px solid orange;
  margin-left: 20px;
  margin-bottom: 0;
}

#crop-mask{
  position: absolute;
  background: black;
  opacity: 0.3;
  display: none;
  pointer-events: none;
  background: transparent;
  box-shadow: 0 0 0 10000px white;
  border: 2px solid red;
  box-sizing: border-box;
}
</style>