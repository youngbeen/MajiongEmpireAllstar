import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '../../utils/diceUtil'
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
    damage += Math.floor((me.maxhp - me.hp) / 10)
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'stick',
        image: 'effdamstick'
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
  // 醉酒
  drunk (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    you.flagDrunk = true

    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'glass_broke'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位释放了*醉酒*`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 调和鸡尾酒
  cocktail (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    if (diceUtil.rollDice(2) === 2) {
      // 更改HP
      let factor = diceUtil.rollDice(you.maxhp)
      let offset = diceUtil.rollDice(Math.round(you.maxhp / 3))
      let change = factor - offset
      you = commonCtrl.changeHp(you, change)
      setTimeout(() => {
        eventBus.$emit('playSound', {
          sound: 'glass_broke' // TODO 音效
        })
        system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位使用*调和鸡尾酒*，其生命值发生了变化`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    } else {
      // 更改SP
      let factor = diceUtil.rollDice(6)
      let offset = diceUtil.rollDice(2)
      let change = factor - offset
      you = commonCtrl.changeSp(you, change)
      setTimeout(() => {
        eventBus.$emit('playSound', {
          sound: 'glass_broke' // TODO 音效
        })
        system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位使用*调和鸡尾酒*，其SP值发生了变化`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  }
}
