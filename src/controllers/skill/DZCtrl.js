import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '@/utils/diceUtil'
// import heroUtil from '@/utils/heroUtil'
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
    // 正常情况
    let timeDice = diceUtil.getDamageTimes()
    times = timeDice.times
    if (you.type === 'WS' && timeDice.dice === 3) {
      // 武僧被动技能，3点修正为偏斜攻击
      times = config.slightTimes
    } else if (you.poison > 0 && timeDice.dice === 5) {
      // DZ对中毒的目标更容易造成暴击
      times = config.criticalTimes
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
      sound: 'dagger',
      image: 'effdamdagger'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理伤害后的效果
    if (me.hp && me.confuse && diceUtil.rollDice(100) <= config.confusePercent) {
      // 蛊惑时概率自己遭受同等伤害
      me = commonCtrl.enchant(me, stackPlays, damage)
      stackPlays++
    }

    // 处理奖励SP
    if (me.hp && diceUtil.rollDice(100) <= config.rogueBonusSpPercent) {
      // 概率获取奖励SP
      me = commonCtrl.changeSp(me, config.rogueBonusSp)
      setTimeout(() => {
        eventBus.$emit('animateSpRecover', {
          targets: [system.unitIndex],
          value: config.rogueBonusSp
        })
        system.msg = [`*能量控制*使${system.unitIndex + 1}号单位回复了${config.rogueBonusSp}点SP`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 毒刃
  poisonAtk (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 1

    me = commonCtrl.act(me, skillId)

    // STEP1 计算伤害倍数
    let times = config.normalTimes // 伤害倍数
    // 正常情况
    let timeDice = diceUtil.getDamageTimes()
    times = timeDice.times
    if (you.type === 'WS' && timeDice.dice === 3) {
      // 武僧被动技能，3点修正为偏斜攻击
      times = config.slightTimes
    } else if (you.poison > 0 && timeDice.dice === 5) {
      // DZ对中毒的目标更容易造成暴击
      times = config.criticalTimes
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
    you.poison += config.poisonDamageTurns
    me = commonCtrl.drawDps(me, 'skill', damage)
    you = commonCtrl.changeHp(you, -1 * damage)
    // 显示伤害动效
    eventBus.$emit('animateDamage', {
      targets: [youIndex],
      value: damage,
      sound: 'quick_dagger',
      image: 'effdamdagger'
    })
    system.msg = [`${system.unitIndex + 1}发动*毒刃*使${youIndex + 1}号单位中毒，并对其造成${damage}点伤害`, ...system.msg]

    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理伤害后的效果
    if (me.hp && me.confuse && diceUtil.rollDice(100) <= config.confusePercent) {
      // 蛊惑时概率自己遭受同等伤害
      me = commonCtrl.enchant(me, stackPlays, damage)
      stackPlays++
    }

    // 处理奖励SP
    if (me.hp && diceUtil.rollDice(100) <= config.rogueBonusSpPercent) {
      // 概率获取1点SP
      me = commonCtrl.changeSp(me, config.rogueBonusSp)
      setTimeout(() => {
        eventBus.$emit('animateSpRecover', {
          targets: [system.unitIndex],
          value: config.rogueBonusSp
        })
        system.msg = [`*能量控制*使${system.unitIndex + 1}号单位回复了${config.rogueBonusSp}点SP`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 左右开弓
  dualAtk (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    me = commonCtrl.act(me, skillId)
    let stackPlays = 1

    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // STEP1 计算伤害
      let times = config.normalTimes // 伤害倍数
      let timeDice = diceUtil.getDamageTimes()
      times = timeDice.times
      if (you.type === 'WS' && timeDice.dice === 3) {
        // 武僧被动技能，3点修正为偏斜攻击
        times = config.slightTimes
      } else if (you.poison > 0 && timeDice.dice === 5) {
        // DZ对中毒的目标更容易造成暴击
        times = config.criticalTimes
      }
      let damage = Math.ceil(diceUtil.getDamageFactor() * times)
      if (you.iceblock) {
        // 寒冰屏障
        damage = reduceCtrl.getReducedDamage(damage, 'iceblock')
      } else if (you.flagBear) {
        // 熊形态
        damage = reduceCtrl.getReducedDamage(damage, 'bear')
      }
      // STEP2 结算
      me = commonCtrl.drawDps(me, 'skill', damage)
      you = commonCtrl.changeHp(you, -1 * damage)
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'dagger',
        image: 'effdamdagger'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

      hero.units.splice(youIndex, 1, you)
    })

    // 处理奖励SP
    if (me.hp && diceUtil.rollDice(100) <= config.rogueBonusSpPercent) {
      // 概率获取奖励SP
      me = commonCtrl.changeSp(me, config.rogueBonusSp)
      setTimeout(() => {
        eventBus.$emit('animateSpRecover', {
          targets: [system.unitIndex],
          value: config.rogueBonusSp
        })
        system.msg = [`*能量控制*使${system.unitIndex + 1}号单位回复了${config.rogueBonusSp}点SP`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
