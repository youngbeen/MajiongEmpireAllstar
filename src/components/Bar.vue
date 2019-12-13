<template>
  <section class="bar" :style="{ 'height': height + 'px', 'border-color': color }">
    <div class="label" :style="{ 'width': percent + '%', 'backgroundColor': color }"></div>
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
    border-width: 1px;
    border-style: solid;
    border-radius: 4px;
    background: #fff;
    .label {
      height: 100%;
      // width: 99%;
      transition: all 0.2s;
    }
    .box-text {
      position: absolute;
      right: 4px;
      top: 0;
      height: 100%;
      font-size: 14px;
      font-family: 'Slim DMG';
      opacity: 0.7;
      .value {
        color: #000;
        font-weight: bold;
      }
      .max {
        color: #333;
        font-size: 12px;
      }
    }
  }
</style>
