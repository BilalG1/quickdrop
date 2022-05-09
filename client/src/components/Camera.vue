<template>
  <video id="camera-view" autoplay playsinline />
  <div>
    <button @click="handleTakePicture" class="btn-picture">
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

      this.$emit('sendImage', dataURL)
    },
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

#camera-view, #canvas{
  max-width: 100vw;
}
</style>