<template>
  <section class="bar" :style="{ 'height': height + 'px', 'border-color': color }">
    <div class="label" :style="{ 'width': percent + '%', 'backgroundColor': color }">
      <div class="high-light">&nbsp;</div>
      <div class="shadow-light">&nbsp;</div>
    </div>
    <div class="box-text">
      <span class="value">{{ value }}/</span>
      <span class="max">{{ max }}</span>
    </div>
  </section>
</template>

<script>
export default {
  name: 'bar',
  props: [
    'value',
    'max',
    'height',
    'color'
  ],
  computed: {
    percent () {
      if (this.value && this.max) {
        let div = Math.round(this.value / this.max * 100)
        if (div > 100) {
          div = 100
        }
        return div
      } else {
        return '0'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .bar {
    position: relative;
    // height: 20px;
    padding: 3px;
    border-radius: 5px;
    background: #040601;
    .label {
      position: relative;
      height: 100%;
      // width: 99%;
      border-radius: 3px;
      overflow: hidden;
      // box-shadow: 1px 0 8px 1px #fff;
      transition: all 0.4s;
      .high-light {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1));
      }
      .shadow-light {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(rgba(100, 100, 100, 0.1), rgba(100, 100, 100, 0.8));
      }
    }
    .box-text {
      position: absolute;
      right: 4px;
      top: 3px;
      height: 100%;
      font-size: 14px;
      font-family: 'Slim DMG';
      opacity: 0.8;
      .value {
        color: #fff;
        font-weight: bold;
      }
      .max {
        color: #fff;
        font-size: 12px;
      }
    }
  }
</style>
