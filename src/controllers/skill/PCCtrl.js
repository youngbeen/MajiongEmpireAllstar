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
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me)

    targets = heroUtil.getAllTargets()

    // 计算伤害倍数
    let times = config.normalTimes // 伤害倍数
    switch (diceUtil.rollDice()) {
      case 1:
      case 2:
      case 3:
        times = config.slightTimes
        break
      case 4:
      case 5:
      case 6:
        times = config.normalTimes
        break
    }
    // 计算伤害
    let damage = commonCtrl.getDamage(me, null, times)
    targets.forEach(target => {
      let youDamage = damage // 每个单位的最终伤害可能不同
      const youIndex = target
      let you = hero.units[youIndex]

      youDamage = commonCtrl.getReducedDamage(me, you, youDamage)
      // 结算
      you = commonCtrl.changeHp(you, -1 * youDamage)
      me = commonCtrl.drawDps(me, 'direct', youDamage)
      setTimeout(() => {
        eventBus.$emit('animateDamage', {
          targets: [youIndex],
          value: youDamage,
          sound: 'heavy_sword',
          image: 'effdamheavy'
        })
        system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  },
  // 击破
  breaking (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    let damage = Math.round(you.hp * config.breakDamagePercent / 100)
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'skill', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'heavy_sword',
        image: 'effdammagic'
      })
      system.msg = [`${system.unitIndex + 1}号单位使用*击破*对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  }
}
