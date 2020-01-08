import { numberUtil } from '@youngbeen/angle-util'
import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '@/utils/diceUtil'
import heroUtil from '@/utils/heroUtil'
import commonCtrl from './commonCtrl'

export default {
  // 普攻
  atk (targets = []) {
    // 只有一目标
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me)

    let triggerAnger = false
    // 计算伤害倍数
    let times = config.normalTimes
    if (me.flagAnger) {
      // 当有激怒状态时，攻击必定暴击，并消耗激怒
      me.flagAnger = false
      times = config.criticalTimes
    } else {
      // 正常情况
      times = commonCtrl.getDamageTimes(me, you)
      if (times === config.criticalTimes) {
        // 正常情况出现了暴击，触发激怒
        me.flagAnger = triggerAnger = true
      }
    }
    // 计算伤害
    let damage = commonCtrl.getDamage(me, you, times)
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'sword'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 处理激怒
    if (triggerAnger) {
      setTimeout(() => {
        eventBus.$emit('playSound', {
          sound: 'anger'
        })
        system.msg = [`${system.unitIndex + 1}号单位获得*激怒*效果`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

    if (commonCtrl.shouldEarthReflectTrigger(me, you, times)) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理伤害后的效果
    if (commonCtrl.shouldEnchantTrigger(me, you)) {
      // 蛊惑时概率自己遭受同等伤害
      me = commonCtrl.enchant(me, stackPlays, damage)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 冲锋
  charge (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // 计算伤害
      let damage = config.chargeFixedDamage
      if (me.flagAnger) {
        damage += config.angerPlusDamage
      }
      damage = commonCtrl.getReducedDamage(me, you, damage)
      // 结算
      you.flagFaint = true
      you = commonCtrl.changeHp(you, -1 * damage)
      me = commonCtrl.drawDps(me, 'skill', damage)
      setTimeout(() => {
        eventBus.$emit('animateDamage', {
          targets: [youIndex],
          value: damage,
          sound: 'sword'
        })
        system.msg = [`*冲锋*使${youIndex + 1}号单位眩晕，并对其造成了${damage}点伤害`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })
    stackPlays++

    me.flagAnger = false

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  },
  // 旋风斩
  rotateAtk (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // 1/3概率3目标，2/3概率2目标
    let targetIndexs = []
    let targetCount = diceUtil.rollDice(3) > 1 ? 2 : 3
    let validTargets = heroUtil.getAllTargets()
    if (validTargets.length <= targetCount) {
      // 有效目标不足，直接使用有效目标
      targetIndexs = validTargets
    } else {
      // 有效目标比较多，则随机选择
      let randomPicks = numberUtil.multiRandom(targetCount, validTargets.length - 1, 0)
      randomPicks.forEach(i => {
        targetIndexs.push(validTargets[i])
      })
    }
    targetIndexs.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // 计算倍数
      let times = commonCtrl.getDamageTimes(me, you)
      // 计算伤害
      let damage = commonCtrl.getDamage(me, you, times)
      if (me.flagAnger) {
        damage += config.angerPlusDamage
      }
      damage = commonCtrl.getReducedDamage(me, you, damage)
      // 结算
      you = commonCtrl.changeHp(you, -1 * damage)
      me = commonCtrl.drawDps(me, 'skill', damage)
      setTimeout(() => {
        eventBus.$emit('animateDamage', {
          targets: [youIndex],
          value: damage,
          sound: 'sword' // TODO 更换旋风音效
        })
        system.msg = [`${system.unitIndex + 1}号单位使用*旋风斩*对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })
    stackPlays++

    me.flagAnger = false

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
