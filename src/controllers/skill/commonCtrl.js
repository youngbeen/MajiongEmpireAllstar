// 通用技能
import eventBus from '@/eventBus'
import skillDict from '@/models/skillDict'
import hero from '@/models/hero'
import system from '@/models/system'
import config from '@/models/config'
import diceUtil from '@/utils/diceUtil'

export default {
  // 获取伤害倍数
  getDamageTimes (me, target) {
    let times = config.normalTimes
    let timeDice = diceUtil.getDamageTimes()
    times = timeDice.times
    if (target.type === 'WS' && timeDice.dice === 3) {
      // 武僧被动技能，3点修正为偏斜攻击
      times = config.slightTimes
    } else if (me.type === 'DZ' && target.poison && timeDice.dice === 5) {
      // DZ对中毒的目标更容易造成暴击
      times = config.criticalTimes
    }
    return times
  },
  // 获取原始伤害
  getDamage (me, target, times) {
    return Math.ceil(diceUtil.getDamageFactor() * times)
  },
  // 获取减免伤后伤害
  getReducedDamage (me, target, damage, { isMagicDamage = false } = {}) {
    if (!isMagicDamage && target.iceblock) {
      // 寒冰屏障
      return 0
    } else if (target.flagBear) {
      // 熊形态
      let newDamage = damage - config.bearDamageReduce
      if (newDamage < 0) {
        newDamage = 0
      }
      return newDamage
    }
    return damage
  },
  // 守备
  guard () {
    let me = hero.units[system.unitIndex]
    me = this.act(me)

    let stackPlays = 0

    let heal = config.guardBaseHeal
    let spHeal = 0
    if (me.type === 'DK') {
      heal = config.guardDKHeal
    } else if (me.type === 'YD') {
      heal += config.guardYDPlusHeal
      spHeal = config.guardYDPlusSp
    } else if (me.iceblock) {
      heal += config.guardIceblockPlusHeal
    }
    this.changeHp(me, heal)
    if (spHeal) {
      this.changeSp(me, spHeal)
    }
    setTimeout(() => {
      eventBus.$emit('animateHeal', {
        targets: [system.unitIndex],
        value: heal
      })
      system.msg = [`${system.unitIndex + 1}号单位*守备*,回复${heal}点生命值`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    if (spHeal) {
      setTimeout(() => {
        eventBus.$emit('animateSpRecover', {
          targets: [system.unitIndex],
          value: spHeal
        })
        system.msg = [`${system.unitIndex + 1}号单位*守备*,回复${spHeal}点SP`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

    hero.units.splice(system.unitIndex, 1, me)
  },
  shouldAutoGainSpTrigger () {
    return diceUtil.rollDice(100) <= config.recoverSpPercent
  },
  shouldEarthReflectTrigger (me, target, times) {
    return target.flagEarth && times === config.criticalTimes
  },
  // 结算大地之力反伤
  earthReflect (me, stackPlays = 1, damage) {
    let reflectDamage = Math.round(damage / 3)
    me = this.changeHp(me, -1 * reflectDamage)
    setTimeout(() => {
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [system.unitIndex],
        value: reflectDamage
      })
      system.msg = [`*大地之力*效果使${system.unitIndex + 1}号单位受到${reflectDamage}点反馈伤害`, ...system.msg]
    }, config.animationTime * stackPlays)

    return me
  },
  shouldRogueGainBonusSp (me, target) {
    return me.hp && diceUtil.rollDice(100) <= config.rogueBonusSpPercent
  },
  shouldIceshotTrigger () {
    return diceUtil.rollDice(100) <= config.iceshotPercent
  },
  shouldMagicBoomTrigger (me) {
    return diceUtil.rollDice(100) <= (40 - me.actRounds)
  },
  shouldEnchantTrigger (me, target) {
    return me.hp && me.confuse && diceUtil.rollDice(100) <= config.confusePercent
  },
  // 结算蛊惑伤害
  enchant (me, stackPlays = 1, damage) {
    me = this.changeHp(me, -1 * damage)
    setTimeout(() => {
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [system.unitIndex],
        value: damage
      })
      system.msg = [`*蛊惑*使${system.unitIndex + 1}号单位受到了${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)

    return me
  },
  // 结算行动相关参数
  act (me, skillId = '') {
    me.isActed = true
    me.actRounds++
    if (skillId) {
      const skill = skillDict.list.find(item => item.id === skillId)
      me.sp -= skill.spCost
      if (me.sp < 0) {
        me.sp = 0
      }
    }
    return me
  },
  // 结算DPS
  drawDps (me, type = 'direct', damage) {
    me[`${type}DamageTotal`] += damage
    me.damageTotal += damage
    return me
  },
  // 结算HP变动
  changeHp (unit, change = 0) {
    unit.hp += change
    if (unit.hp <= 0) {
      unit.hp = 0
      unit.isDead = true
      // 清理其他buff
      unit.sp = 0
      unit.flagAnger = false
      unit.iceblock = 0
      unit.flagEnhance = false
      unit.flagTiger = false
      unit.flagBear = false
      unit.flagTree = false
      unit.spring = 0
      unit.yy = 0
      unit.flagTaunt = false
      unit.flagEarth = false
      unit.flagFaint = false
      unit.flagSlow = false
      unit.lockOn = 0
      unit.poison = 0
      unit.confuse = 0
      unit.flagBind = false
      unit.flagDrunk = false
    } else if (unit.hp > unit.maxhp) {
      unit.hp = unit.maxhp
    }
    return unit
  },
  // 结算SP变动
  changeSp (unit, change = 0) {
    unit.sp += change
    if (unit.sp < 0) {
      unit.sp = 0
    } else if (unit.sp > unit.maxsp) {
      unit.sp = unit.maxsp
    }
    return unit
  }
}
