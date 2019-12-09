<template>
  <section class="bed-action-panel">
    <el-button size="mini" @click="startDraw" :disabled="system.step > 0">
      {{ firstHandText }}
    </el-button>
    <el-button size="mini" @click="startBattle" :disabled="system.step >= 2">
      {{ battleText }}
    </el-button>
    <el-button type="primary" size="mini" :disabled="system.step !== 2" @click="proceedTurn">行动</el-button>
    <el-button size="mini" @click="testLuck">试试手气</el-button>
    <el-button size="mini" @click="getDPS">查看实时伤害统计</el-button>
  </section>
</template>

<script>
import eventBus from '@/eventBus'
import system from '@/models/system'
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
        return '先后手'
      }
    },
    battleText () {
      if (this.system.step === 2) {
        return '战斗已开始'
      } else {
        return '战斗开始'
      }
    }
  },

  methods: {
    startDraw () {
      // TODO 执行校验（上下是否都有有效英雄）
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
    getDPS () {
      // TODO 待开发显示输出统计
    }
  }
}
</script>

<style scoped>
</style>
