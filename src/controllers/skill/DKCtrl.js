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
      sound: 'atkdk',
      image: 'effdam'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理邪恶斩击效果
    if (me.hp > 0 && damage > 0) {
      me = commonCtrl.changeHp(me, 2)
      setTimeout(() => {
        eventBus.$emit('animateHeal', {
          targets: [system.unitIndex],
          value: 2
        })
        system.msg = [`${system.unitIndex + 1}号单位的*邪恶斩击*使其回复了2点生命值`, ...system.msg]
      }, config.animationTime * stackPlays)
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
  // 牺牲爪牙
  boom (skillId = '', targets = []) {
    const youIndex = targets[0]
    // let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    me = commonCtrl.act(me, skillId)

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
    me = commonCtrl.drawDps(me, 'skill', damage)
    you = commonCtrl.changeHp(you, -1 * damage)
    // 显示伤害动效
    eventBus.$emit('animateDamage', {
      targets: [index],
      value: damage,
      sound: 'dkboom',
      image: 'effdammagic'
    })
    system.msg = [`${system.unitIndex + 1}号的*牺牲爪牙*对${index + 1}号单位造成${damage}点伤害`, ...system.msg]

    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(index, 1, you)
  }
}
