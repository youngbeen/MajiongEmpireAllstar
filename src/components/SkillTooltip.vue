<template>
  <section class="bed-skill-tooltip" v-show="isShow" :style="{ 'left': left + 'px', 'top': top + 'px' }">
    <p class="skill-title">{{ title }}</p>
    <p class="skill-quote">{{ subTitle.join(' / ') }}</p>
    <p class="skill-def">{{ desc }}</p>
  </section>
</template>

<script>
import eventBus from '@/eventBus'

export default {
  name: 'skillTooltip',
  data () {
    return {
      isShow: false,
      left: 0,
      top: 0,
      title: '',
      subTitle: [],
      desc: ''
    }
  },

  mounted () {
    eventBus.$on('skillTooltip', params => {
      this.show(params)
    })
    eventBus.$on('hideSkillTooltip', () => {
      this.close()
    })
  },

  beforeDestroy () {
    eventBus.$off('skillTooltip')
    eventBus.$off('hideSkillTooltip')
  },

  methods: {
    show (params) {
      let originalLeft = params.left || 0
      let screenWidth = document.documentElement.clientWidth || document.body.clientWidth || 0
      if (originalLeft + 400 > screenWidth) {
        // 位置太贴近屏幕右边缘，信息可能会被遮挡
        this.left = originalLeft - 410
      } else {
        this.left = originalLeft
      }
      this.left = params.left || 0
      let originalTop = params.top || 0
      let screenHeight = document.documentElement.clientHeight || document.body.clientHeight || 0
      if (originalTop + 100 > screenHeight) {
        // 位置太贴近屏幕下边缘，信息可能会被遮挡
        this.top = originalTop - 100
      } else {
        this.top = originalTop
      }
      this.title = params.title || ''
      this.subTitle = params.subTitle || []
      this.desc = params.desc || ''
      this.isShow = true
    },
    close () {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/var.scss";

  .bed-skill-tooltip {
    position: fixed;
    max-width: 400px;
    border: 1px solid #000;
    border-radius: 2px;
    color: #fff;
    background: #000;
    box-shadow: 0 0 5px 2px rgba(0,0,0,.35);
    z-index: 5000;
    .skill-title {
      // margin-top: 8px;
      padding: 8px 15px 4px;
      font-size: 14px;
      font-weight: bold;
    }
    .skill-quote {
      padding: 0 15px;
      color: $DANGER-COLOR;
      font-size: 10px;
      font-style: italic;
    }
    .skill-def {
      padding: 4px 15px 8px;
      color: #dcdcdc;
      font-size: 12px;
    }
  }
</style>
