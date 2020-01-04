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
    let damageFactor = diceUtil.getDamageFactor()
    let damage = Math.ceil(damageFactor * times)
    if (you.flagBear) {
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
      sound: 'icehit',
      image: 'effdammagic'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    // NOTE 因为后续触发冰枪术及法力爆炸需要再次结算，所以此处先回写一次数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)

    // 结算触发冰枪术
    if (diceUtil.rollDice(2) >= 2) {
      this.drawIceshotAtk(youIndex, damageFactor, stackPlays)
      if (youIndex === 0 || youIndex === 5) {
        if (heroUtil.isTargetValid(youIndex + 1)) {
          this.drawIceshotAtk(youIndex + 1, damageFactor, stackPlays)
        }
      } else if (youIndex === 4 || youIndex === 9) {
        if (heroUtil.isTargetValid(youIndex - 1)) {
          this.drawIceshotAtk(youIndex - 1, damageFactor, stackPlays)
        }
      } else {
        if (heroUtil.isTargetValid(youIndex + 1)) {
          this.drawIceshotAtk(youIndex + 1, damageFactor, stackPlays)
        }
        if (heroUtil.isTargetValid(youIndex - 1)) {
          this.drawIceshotAtk(youIndex - 1, damageFactor, stackPlays)
        }
      }
      stackPlays++

      // 触发法力爆炸
      if (diceUtil.rollDice(100) > (50 + me.actRounds)) {
        this.drawMagicBoom(stackPlays)
        stackPlays++
      }
    }

    me = hero.units[system.unitIndex]
    you = hero.units[youIndex]
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
  drawIceshotAtk (index, damageFactor, stackPlays = 1) {
    let me = hero.units[system.unitIndex]
    let you = hero.units[index]

    let damage = Math.ceil(damageFactor * config.slightTimes)
    if (you.flagBear) {
      // 熊形态
      damage = reduceCtrl.getReducedDamage(damage, 'bear')
    }
    me = commonCtrl.drawDps(me, 'direct', damage)
    you = commonCtrl.changeHp(you, -1 * damage)
    setTimeout(() => {
      // 显示伤害动效
      eventBus.$emit('animateDamage', {
        targets: [index],
        value: damage,
        sound: 'iceshot',
        image: 'effdammagic'
      })
      system.msg = [`*冰枪术*对${index + 1}号单位额外造成${damage}点偏斜伤害`, ...system.msg]
    }, config.animationTime * stackPlays)

    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(index, 1, you)
  },
  drawMagicBoom (stackPlays) {
    let me = hero.units[system.unitIndex]

    let targets = heroUtil.getAllTargets()
    let damage = Math.round(me.damageTotal / 10)
    if (damage < 1) {
      damage = 1
    }
    targets.forEach(target => {
      let youDamage = damage // 每个单位的最终伤害可能不同
      const youIndex = target
      let you = hero.units[youIndex]

      if (you.flagBear) {
        // 熊形态
        youDamage = reduceCtrl.getReducedDamage(youDamage, 'bear')
      }
      // STEP2 结算
      me = commonCtrl.drawDps(me, 'skill', youDamage)
      you = commonCtrl.changeHp(you, -1 * youDamage)
      // 显示伤害动效
      setTimeout(() => {
        eventBus.$emit('animateDamage', {
          targets: [youIndex],
          value: youDamage,
          sound: 'boom',
          image: 'effdammagic'
        })
        system.msg = [`*法力爆炸*对${youIndex + 1}号单位造成了${youDamage}点伤害`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })

    hero.units.splice(system.unitIndex, 1, me)
  },
  // 寒冰屏障
  iceblock (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    me = commonCtrl.act(me, skillId)

    me.iceblock = config.iceblockTurns
    eventBus.$emit('playSound', {
      sound: 'iceblock'
    })
    system.msg = [`${system.unitIndex + 1}号单位释放了*寒冰屏障*保护自己，免疫任何直接伤害`, ...system.msg]

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
