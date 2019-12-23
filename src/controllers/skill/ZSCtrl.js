import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '@/utils/diceUtil'
import reduceCtrl from '../reduceCtrl'
import commonCtrl from './commonCtrl'

export default {
  // 普攻
  atk (targets = []) {
    // 只有一目标
    const youIndex = targets[0]
    let me = hero.units[system.unitIndex]
    let you = hero.units[youIndex]
    let stackPlays = 1

    me = commonCtrl.act(me)

    // STEP1 计算伤害倍数
    let times = config.normalTimes // 伤害倍数
    if (me.flagAnger) {
      // 当有激怒状态时，攻击必定暴击，并消耗激怒
      me.flagAnger = false
      times = config.criticalTimes
    } else {
      // 正常情况
      let timeDice = diceUtil.getDamageTimes()
      times = timeDice.times
      if (times === config.criticalTimes) {
        // 正常情况出现了暴击，触发激怒
        me.flagAnger = true
        setTimeout(() => {
          eventBus.$emit('playSound', {
            sound: 'anger'
          })
          system.msg = ['战士获得*激怒*效果', ...system.msg]
        }, config.animationTime * stackPlays)
        stackPlays++
      }
      if (you.type === 'WS' && timeDice.dice === 3) {
        // 武僧被动技能，3点修正为偏斜攻击
        times = config.slightTimes
      }
    }
    // STEP2 计算原始伤害
    let damage = Math.ceil(diceUtil.getDamageFactor() * times)
    if (you.iceblock) {
      // 寒冰屏障
      damage = reduceCtrl.getReducedDamage(damage, 'iceblock')
    } else if (you.flagBear) {
      // 熊形态
      damage = reduceCtrl.getReducedDamage(damage, 'bear')
    }
    // STEP3 结算
    me = commonCtrl.drawDps(me, 'direct', damage)
    you = commonCtrl.changeHp(you, -1 * damage)
    // 显示伤害动效
    eventBus.$emit('animateDamage', {
      targets: [youIndex],
      value: damage,
      sound: 'sword'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理伤害后的效果
    if (me.hp && me.confuse && diceUtil.rollDice(3) === 3) {
      // 蛊惑时1/3的概率自己遭受同等伤害
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
    me = commonCtrl.act(me, skillId)

    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // STEP1 计算伤害
      let damage = config.chargeFixedDamage
      if (you.iceblock) {
        // 寒冰屏障
        damage = reduceCtrl.getReducedDamage(damage, 'iceblock')
      } else if (you.flagBear) {
        // 熊形态
        damage = reduceCtrl.getReducedDamage(damage, 'bear')
      }
      // STEP2 结算
      me = commonCtrl.drawDps(me, 'skill', damage)
      you.flagFaint = true
      you = commonCtrl.changeHp(you, -1 * damage)
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'sword'
      })
      system.msg = [`*冲锋*使${youIndex + 1}号单位眩晕，并对其造成了${damage}点伤害`, ...system.msg]

      hero.units.splice(youIndex, 1, you)
    })

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
