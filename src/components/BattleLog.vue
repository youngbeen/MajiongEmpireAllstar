<template>
  <section class="bed-battle-log" :class="[isExtend && 'extend']">
    <div class="box-head">
      <div class="log">{{ lastLog }}</div>
      <el-button class="btn" size="mini" @click="toggle()">
        <font-awesome-icon icon="angle-double-up" v-show="!isExtend" /><font-awesome-icon icon="angle-double-down" v-show="isExtend" /> 战斗信息
      </el-button>
    </div>

    <!-- 常规log -->
    <div class="box-logs">
      <div class="log" v-for="(log, index) in arcLogs" :key="index">{{ log }}</div>
    </div>
  </section>
</template>

<script>
import system from '@/models/system'

export default {
  name: 'battleLog',
  data () {
    return {
      isExtend: false,
      system
    }
  },
  computed: {
    lastLog () {
      if (this.system.msg.length) {
        return this.system.msg[0]
      } else {
        return ''
      }
    },
    arcLogs () {
      return this.system.msg.filter((item, index) => index > 0)
    }
  },

  methods: {
    toggle () {
      this.isExtend = !this.isExtend
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/var.scss";

.bed-battle-log {
  position: fixed;
  left: 0;
  right: 0;
  bottom: -72px;
  height: 100px;
  background: #fff;
  box-shadow: 0 -1px 6px 1px rgba(180, 180, 180, .5);
  z-index: 1000;
  transition: all 0.2s;
  &.extend {
    bottom: 0;
  }
  .box-head {
    position: relative;
    height: 28px;
    // border-bottom: 1px solid #eee;
    background: #eee;
    .log {
      height: 28px;
      line-height: 28px;
      padding: 0 6px;
      color: $SUB-TEXT-COLOR;
      font-size: 12px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .btn {
      position: absolute;
      right: 0;
      top: 0;
    }
  }
  .box-logs {
    height: 74px;
    overflow-y: auto;
    .log {
      height: 20px;
      padding: 0 6px;
      color: $SUBNODE-TEXT-COLOR;
      font-size: 11px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
