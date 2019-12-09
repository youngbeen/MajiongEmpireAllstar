import eventBus from '@/eventBus'
import skillDict from '@/models/skillDict'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '@/utils/diceUtil'
// import heroUtil from '@/utils/heroUtil'
import reduceCtrl from '../reduceCtrl'

export default {
  // 普攻
  atk (targets = []) {
    // 只有一目标
    const youIndex = targets[0]
    let me = hero.units[system.unitIndex]
    let you = hero.units[youIndex]

    me.isActed = true
    me.actRounds++

    let stackPlays = 1
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
    let damage = Math.ceil(diceUtil.rollDice(10) * times)
    if (you.iceblock) {
      // 寒冰屏障
      damage = reduceCtrl.getReducedDamage(damage, 'iceblock')
    } else if (you.flagBear) {
      // 熊形态
      damage = reduceCtrl.getReducedDamage(damage, 'bear')
    }
    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      let newDamage = reduceCtrl.getReducedDamage(damage, 'earth')
      let reflectDamage = newDamage.reflectDamage
      damage = newDamage.leftDamage
      me.hp -= reflectDamage
      if (me.hp <= 0) {
        me.hp = 0
        me.isDead = true
      }
      setTimeout(() => {
        // 显示伤害动效
        eventBus.$emit('animateDamage', {
          targets: [system.unitIndex],
          value: reflectDamage
        })
        system.msg = [`*大地之力*效果使${system.unitIndex + 1}号单位受到${reflectDamage}点反馈伤害`, ...system.msg]
      }, 1500 * stackPlays)
      stackPlays++
    }
    // STEP3 结算
    me.directDamageTotal += damage
    me.damageTotal += damage
    you.hp -= damage
    if (you.hp <= 0) {
      you.hp = 0
      you.isDead = true
    }
    // 显示伤害动效
    eventBus.$emit('animateDamage', {
      targets: [youIndex],
      value: damage,
      sound: 'atkdz',
      image: 'effdamdagger'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    // 处理奖励SP
    if (diceUtil.rollDice(6) === 6) {
      // 1/6概率获取1点SP
      me.sp++
      if (me.sp > me.maxsp) {
        me.sp = me.maxsp
      }
      setTimeout(() => {
        eventBus.$emit('animateSpRecover', {
          targets: [system.unitIndex],
          value: 1
        })
        system.msg = [`*能量控制*使${system.unitIndex + 1}号单位回复了1点SP`, ...system.msg]
      }, 1500 * stackPlays)
      stackPlays++
    }

    // 处理伤害后的效果
    if (me.confuse && diceUtil.rollDice(3) === 3) {
      // 蛊惑时1/3的概率自己遭受同等伤害
      me.hp -= damage
      if (me.hp <= 0) {
        me.hp = 0
        me.isDead = true
      }
      setTimeout(() => {
        // 显示伤害动效
        eventBus.$emit('animateDamage', {
          targets: [system.unitIndex],
          value: damage
        })
        system.msg = [`*蛊惑*使${system.unitIndex + 1}号单位受到了${damage}点伤害`, ...system.msg]
      }, 1500 * stackPlays)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 毒刃
  poisonAtk (skillId = '', targets = []) {
    const skill = skillDict.list.find(item => item.id === skillId)
    // 只有一目标
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    me.isActed = true
    me.sp -= skill.spCost
    me.actRounds++

    let stackPlays = 1
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
    let damage = Math.ceil(diceUtil.rollDice(10) * times)
    if (you.iceblock) {
      // 寒冰屏障
      damage = reduceCtrl.getReducedDamage(damage, 'iceblock')
    } else if (you.flagBear) {
      // 熊形态
      damage = reduceCtrl.getReducedDamage(damage, 'bear')
    }
    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      let newDamage = reduceCtrl.getReducedDamage(damage, 'earth')
      let reflectDamage = newDamage.reflectDamage
      damage = newDamage.leftDamage
      me.hp -= reflectDamage
      if (me.hp <= 0) {
        me.hp = 0
        me.isDead = true
      }
      setTimeout(() => {
        // 显示伤害动效
        eventBus.$emit('animateDamage', {
          targets: [system.unitIndex],
          value: reflectDamage
        })
        system.msg = [`*大地之力*效果使${system.unitIndex + 1}号单位受到${reflectDamage}点反馈伤害`, ...system.msg]
      }, 1500 * stackPlays)
      stackPlays++
    }
    // STEP3 结算
    you.poison = config.poisonAtkTurns
    me.skillDamageTotal += damage
    me.damageTotal += damage
    you.hp -= damage
    if (you.hp <= 0) {
      you.hp = 0
      you.isDead = true
    }
    // 显示伤害动效
    eventBus.$emit('animateDamage', {
      targets: [youIndex],
      value: damage,
      sound: 'dzpoison',
      image: 'effdamdagger'
    })
    system.msg = [`*毒刃*使${youIndex + 1}号单位中毒，并对其造成${damage}点伤害`, ...system.msg]

    // 处理奖励SP
    if (diceUtil.rollDice(6) === 6) {
      // 1/6概率获取1点SP
      me.sp++
      if (me.sp > me.maxsp) {
        me.sp = me.maxsp
      }
      setTimeout(() => {
        eventBus.$emit('animateSpRecover', {
          targets: [system.unitIndex],
          value: 1
        })
        system.msg = [`*能量控制*使${system.unitIndex + 1}号单位回复了1点SP`, ...system.msg]
      }, 1500 * stackPlays)
      stackPlays++
    }

    // 处理伤害后的效果
    if (me.confuse && diceUtil.rollDice(3) === 3) {
      // 蛊惑时1/3的概率自己遭受同等伤害
      me.hp -= damage
      if (me.hp <= 0) {
        me.hp = 0
        me.isDead = true
      }
      setTimeout(() => {
        // 显示伤害动效
        eventBus.$emit('animateDamage', {
          targets: [system.unitIndex],
          value: damage
        })
        system.msg = [`*蛊惑*使${system.unitIndex + 1}号单位受到了${damage}点伤害`, ...system.msg]
      }, 1500 * stackPlays)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  }
}
