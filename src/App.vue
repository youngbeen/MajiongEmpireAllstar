<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import hero from '@/models/hero'

export default {
  name: 'app',
  created () {
    // 初始化
    this.init()
  },

  methods: {
    init () {
      this.initHeros()
    },
    initHeros () {
      for (let i = 0; i < 10; i++) {
        hero.units.push({
          isOpen: false, // 是否启用slot，是否有激活的英雄
          isActed: false, // 当前回合是否已经使用过行动
          isDead: false, // 角色是否处于已死亡状态
          type: '', // ZS/LR/SM/WS/DZ/FS/XD/DK/QS/MS/SR - 吟游诗人/PC - 破城者/JB - 酒保/YD - 园丁/YX - 夜行者/TF - 屠夫/MO - 木偶
          url: '', // 头像url
          maxhp: 0,
          hp: 0,
          maxsp: 0,
          sp: 0,
          speed: 0,
          flagAnger: false, // 是否激怒
          iceblock: 0, // 寒冰屏障剩余层数
          flagEnhance: false, // 是否激活了ms提供的强化
          flagTiger: false, // 是否激活了虎形态
          flagBear: false, // 是否激活了熊形态
          flagTree: false, // 是否激活了树形态
          spring: 0, // 回春术剩余层数
          yy: 0, // 英勇效果剩余层数
          flagTaunt: false, // 是否激活了护盾状态（只能优先被指定攻击）
          flagEarth: false, // 是否激活了大地之力
          flagFaint: false, // 是否激活了眩晕
          flagSlow: false, // 是否激活了减速
          lockOn: 0, // 锁定状态剩余层数
          poison: 0, // 中毒状态剩余层数
          confuse: 0, // 蛊惑状态剩余层数
          flagBind: false, // 是否激活了捆绑
          flagDrunk: false, // 是否激活了醉酒
          directDamageTotal: 0, // 累计直接伤害
          skillDamageTotal: 0, // 累计技能伤害
          damageTotal: 0, // 累计总伤害
          actRounds: 0 // 行动回合
        })
      }
    }
  }
}
</script>

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
