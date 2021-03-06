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

    // 计算伤害倍数
    let times = commonCtrl.getDamageTimes(me, you)
    // 计算伤害
    let damage = commonCtrl.getDamage(me, you, times)
    if (you.lockOn) {
      damage += config.lockOnPlusDamage
    }
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you.lockOn = config.lockOnTurns
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'arrow',
        image: 'effdamarrow'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

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
  // 箭雨
  rain (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // 寻找所有对方有效单位
    targets = heroUtil.getAllTargets()

    // 计算伤害
    let damage = 2
    let dice = diceUtil.rollDice()
    if (dice === 6) {
      damage = 6
    } else if (dice === 4 || dice === 5) {
      damage = 4
    }
    targets.forEach(target => {
      let youDamage = damage // 每个单位的最终伤害可能不同
      const youIndex = target
      let you = hero.units[youIndex]

      if (you.lockOn) {
        youDamage += config.lockOnPlusDamage
      }
      youDamage = commonCtrl.getReducedDamage(me, you, youDamage)
      // 结算
      you.lockOn = config.lockOnTurns
      you = commonCtrl.changeHp(you, -1 * youDamage)
      me = commonCtrl.drawDps(me, 'skill', youDamage)
      setTimeout(() => {
        eventBus.$emit('animateDamage', {
          targets: [youIndex],
          value: youDamage,
          sound: 'arrow',
          image: 'effdamarrow'
        })
        system.msg = [`*箭雨*对${youIndex + 1}号单位造成了${youDamage}点伤害`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  },
  // 奥术射击
  magicShoot (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // 计算伤害倍数
    let times = commonCtrl.getDamageTimes(me, you)
    // 计算伤害
    let damage = commonCtrl.getDamage(me, you, times)
    if (you.lockOn) {
      damage += config.lockOnPlusDamage
    }
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    // 清除yy效果
    if (you.yy) {
      you.yy = 0
      you.maxhp -= config.yyPlusMaxhp
      if (you.hp > you.maxhp) {
        you.hp = you.maxhp
      }
      you.speed -= config.yyPlusSpeed
    }
    // 清除激怒效果
    you.flagAnger = false
    you.lockOn = config.lockOnTurns
    // 减速效果（不叠加）
    if (!you.flagSlow) {
      you.flagSlow = true
      you.speed -= config.magicShotMinusSpeed
    }
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'skill', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'arrow',
        image: 'effdamarrow'
      })
      system.msg = [`*奥术射击*使${youIndex + 1}号单位减速，并对其造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

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
  }
}
