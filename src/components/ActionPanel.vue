<template>
  <section class="bed-action-panel">
    <el-button size="mini" v-show="system.step === 0" @click="randomPick()">
      <font-awesome-icon icon="dice" /> 随机英雄
    </el-button>
    <el-button size="mini" v-show="system.step === 0" @click="startDraw()">
      <font-awesome-icon icon="theater-masks" /> 先后手
    </el-button>
    <el-button size="mini" v-show="system.step === 1" @click="startBattle()">
      <font-awesome-icon icon="hand-rock" /> 战斗开始
    </el-button>
    <el-button type="primary" size="mini" v-show="system.step === 2" @click="proceedTurn()">
      <font-awesome-icon icon="crosshairs" /> 行 动
    </el-button>
    <el-button size="mini" @click="testLuck()">
      <font-awesome-icon icon="dice" /> 试试手气
    </el-button>
    <el-button size="mini" @click="getDPS()">
      <font-awesome-icon icon="list-ol" /> 实时统计
    </el-button>
    <el-button type="danger" size="mini" @click="reset()">
      <font-awesome-icon icon="sync-alt" /> 重置
    </el-button>

    <!-- 状态信息 -->
    <div class="box-info" v-show="system.step === 2">
      回合<span class="big"> {{ system.turns + 1 }}</span><span class="desc">（{{ firstHandText }}）</span>
    </div>
  </section>
</template>

<script>
import { numberUtil } from '@youngbeen/angle-util'
import eventBus from '@/eventBus'
import system from '@/models/system'
import hero from '@/models/hero'
import heroDict from '@/models/heroDict'
import diceUtil from '@/utils/diceUtil'
import gameCtrl from '@/controllers/gameCtrl'

export default {
  name: 'actionPanel',
  data () {
    return {
      system
    }
  },
  computed: {
    firstHandText () {
      if (this.system.firstHand === 'up') {
        return '上方先手'
      } else if (this.system.firstHand === 'down') {
        return '下方先手'
      } else {
        return '未决出先后手'
      }
    }
  },

  methods: {
    randomPick () {
      let upSeeds = numberUtil.multiRandom(5, heroDict.list.length - 1, 0)
      upSeeds.forEach((item, index) => {
        this.chooseHero(heroDict.list[item], index)
      })
      let downSeeds = numberUtil.multiRandom(5, heroDict.list.length - 1, 0)
      downSeeds.forEach((item, index) => {
        this.chooseHero(heroDict.list[item], index + 5)
      })
    },
    chooseHero (item, index) {
      let copy = hero.units[index]
      copy.type = item.name
      copy.url = item.url
      hero.units.splice(index, 1, copy)
    },
    startDraw () {
      // 执行校验（上下是否都有有效英雄）
      let upHeroValid = hero.units.some((unit, index) => index < 5 && unit.type)
      let downHeroValid = hero.units.some((unit, index) => index > 4 && unit.type)
      if (!upHeroValid || !downHeroValid) {
        this.$message({
          type: 'warning',
          message: `请先设置英雄单位！`
        })
        return
      }
      eventBus.$emit('playSound', {
        sound: 'dice'
      })
      let upRoll = diceUtil.rollDice()
      let downRoll = diceUtil.rollDice()
      if (upRoll > downRoll) {
        // 上方先手
        system.step = 1
        system.firstHand = 'up'
        system.turn = 'up'
        system.msg = ['上方先手', ...system.msg]
        this.$notify({
          // title: '提示',
          message: `上方先手！`
        })
      } else if (upRoll < downRoll) {
        // 下方先手
        system.step = 1
        system.firstHand = 'down'
        system.turn = 'down'
        system.msg = ['下方先手', ...system.msg]
        this.$notify({
          // title: '提示',
          message: `下方先手！`
        })
      } else {
        this.$notify({
          // title: '提示',
          message: `平 手！`
        })
      }
    },
    startBattle () {
      eventBus.$emit('playSound', {
        sound: 'start'
      })
      system.step = 2
      system.msg = ['战斗开始', ...system.msg]
      gameCtrl.setUnitData()
    },
    proceedTurn () {
      gameCtrl.proceedTurn()
    },
    testLuck () {
      eventBus.$emit('playSound', {
        sound: 'dice'
      })
      let dice = diceUtil.rollDice()
      this.$notify({
        // title: '提示',
        message: `你掷出了${dice}点`
      })
    },
    reset () {
      gameCtrl.reset()
    },
    getDPS () {
      eventBus.$emit('dpsReport')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/var.scss";

.bed-action-panel {
  position: relative;
  padding: 0 6px;
  .box-info {
    position: absolute;
    right: 0;
    top: 0;
    padding: 3px 8px;
    border-bottom-left-radius: 4px;
    background: #f6f6f6;
    font-size: 12px;
    .big {
      color: $DANGER-COLOR;
      font-size: 18px;
      font-weight: bold;
    }
    .desc {
      color: $DESC-TEXT-COLOR;
      font-size: 11px;
    }
  }
}
</style>
