import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '@/utils/diceUtil'
import heroUtil from '@/utils/heroUtil'
import reduceCtrl from '../reduceCtrl'
import commonCtrl from './commonCtrl'

export default {
  // 普攻
  atk (targets = []) {
    let me = hero.units[system.unitIndex]
    // let stackPlays = 1

    me = commonCtrl.act(me)

    targets = heroUtil.getAllTargets()

    // STEP1 计算伤害倍数
    let times = config.normalTimes // 伤害倍数
    switch (diceUtil.rollDice()) {
      case 1:
      case 2:
      case 3:
        times = 0.5
        break
      case 4:
      case 5:
      case 6:
        times = 1
        break
    }
    // STEP2 计算原始伤害
    let damage = Math.ceil(diceUtil.getDamageFactor() * times)
    targets.forEach(target => {
      let youDamage = damage // 每个单位的最终伤害可能不同
      const youIndex = target
      let you = hero.units[youIndex]

      if (you.iceblock) {
        // 寒冰屏障
        youDamage = reduceCtrl.getReducedDamage(youDamage, 'iceblock')
      } else if (you.flagBear) {
        // 熊形态
        youDamage = reduceCtrl.getReducedDamage(youDamage, 'bear')
      }

      // STEP3 结算
      me = commonCtrl.drawDps(me, 'direct', youDamage)
      you = commonCtrl.changeHp(you, -1 * youDamage)
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: youDamage,
        sound: 'atkpc',
        image: 'effdamheavy'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

      hero.units.splice(youIndex, 1, you)
    })

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    // hero.units.splice(youIndex, 1, you)
  }
}
