import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
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
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'dagger',
        image: 'effdamdagger'
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

    // 处理奖励SP
    if (commonCtrl.shouldRogueGainBonusSp(me, you)) {
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
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // 计算伤害倍数
    let times = commonCtrl.getDamageTimes(me, you)
    // 计算伤害
    let damage = commonCtrl.getDamage(me, you, times)
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you.poison += config.poisonDamageTurns
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'skill', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'quick_dagger',
        image: 'effdamdagger'
      })
      system.msg = [`${system.unitIndex + 1}发动*毒刃*使${youIndex + 1}号单位中毒，并对其造成${damage}点伤害`, ...system.msg]
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

    // 处理奖励SP
    if (commonCtrl.shouldRogueGainBonusSp(me, you)) {
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
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // 计算伤害倍数
      let times = commonCtrl.getDamageTimes(me, you)
      // 计算伤害
      let damage = commonCtrl.getDamage(me, you, times)
      damage = commonCtrl.getReducedDamage(me, you, damage)
      // 结算
      you = commonCtrl.changeHp(you, -1 * damage)
      me = commonCtrl.drawDps(me, 'skill', damage)
      setTimeout(() => {
        eventBus.$emit('animateDamage', {
          targets: [youIndex],
          value: damage,
          sound: 'dagger',
          image: 'effdamdagger'
        })
        system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })
    stackPlays++

    // 处理奖励SP
    if (commonCtrl.shouldRogueGainBonusSp(me)) {
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
