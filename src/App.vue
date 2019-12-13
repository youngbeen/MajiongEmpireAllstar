<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">
@font-face {
  font-family: 'DMG Regular';
  src: url('./assets/fonts/chunkfive/ChunkFive-Regular.otf');
}
@font-face {
  font-family: 'DMG Print';
  src: url('./assets/fonts/chunkfive/ChunkFive-Print.otf');
}
@font-face {
  font-family: 'Slim DMG';
  src: url('./assets/fonts/BebasNeue-Regular.otf');
}
html, body {
  margin: 0;
  width: 100%;
  height: 100%;
}
#app {
  font-size: 14px;
  cursor: default;
  // font-family: 'Avenir', Helvetica, Arial, sans-serif;
  // -webkit-font-smoothing: antialiased;
  // -moz-osx-font-smoothing: grayscale;
  // text-align: center;
}
// 公共样式
</style>
