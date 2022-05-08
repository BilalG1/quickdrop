<template>
  <div class="container">
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
    <div class="block"></div>
  </div>
</template>

<style scoped>

.container {
  width: 160px;
  height: 200px;
  margin: 0 auto;
}

.block {
  position: relative;
  box-sizing: border-box;
  float: left;
  margin: 0 20px 20px 0;
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: orange;
}

.block:nth-child(4n+1) { animation: wave 2s ease .0s infinite; }
.block:nth-child(4n+2) { animation: wave 2s ease .2s infinite; }
.block:nth-child(4n+3) { animation: wave 2s ease .4s infinite; }
.block:nth-child(4n+4) { animation: wave 2s ease .6s infinite; margin-right: 0; }

@keyframes wave {
  0%   { top: 0;     opacity: 1; }
  50%  { top: 30px;  opacity: .2; }
  100% { top: 0;     opacity: 1; }
}
</style>