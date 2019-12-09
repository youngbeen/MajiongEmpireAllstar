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
      sound: 'atkdk',
      image: 'effdam'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    // 处理邪恶斩击效果
    if (me.hp > 0 && damage > 0) {
      me.hp += 2
      if (me.hp > me.maxhp) {
        me.hp = me.maxhp
      }
      setTimeout(() => {
        eventBus.$emit('animateHeal', {
          targets: [system.unitIndex],
          value: 2
        })
        system.msg = [`${system.unitIndex + 1}号单位的*邪恶斩击*使其回复了2点生命值`, ...system.msg]
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
  // 牺牲爪牙
  boom (skillId = '', targets = []) {
    const skill = skillDict.list.find(item => item.id === skillId)
    const youIndex = targets[0]
    // let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    me.isActed = true
    me.sp -= skill.spCost
    me.actRounds++

    // NOTE 提前回写数据
    hero.units.splice(system.unitIndex, 1, me)

    if (youIndex === 0 || youIndex === 5) {
      this.drawBoomAtk(youIndex + 1, 3)
    } else if (youIndex === 4 || youIndex === 9) {
      this.drawBoomAtk(youIndex - 1, 3)
    } else {
      this.drawBoomAtk(youIndex - 1, 3)
      this.drawBoomAtk(youIndex + 1, 3)
    }

    // 回写数据
    // hero.units.splice(system.unitIndex, 1, me)
    // hero.units.splice(youIndex, 1, you)
  },
  drawBoomAtk (index, damage) {
    let me = hero.units[system.unitIndex]
    let you = hero.units[index]

    if (you.flagBear) {
      // 熊形态
      damage = reduceCtrl.getReducedDamage(damage, 'bear')
    }
    me.skillDamageTotal += damage
    me.damageTotal += damage
    you.hp -= damage
    if (you.hp <= 0) {
      you.hp = 0
      you.isDead = true
    }
    setTimeout(() => {
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [index],
        value: damage,
        sound: 'dkboom',
        image: 'effdammagic'
      })
      system.msg = [`${system.unitIndex + 1}号的*牺牲爪牙*对${index + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, 1500)

    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(index, 1, you)
  }
}
