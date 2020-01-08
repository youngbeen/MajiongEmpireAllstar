import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import diceUtil from '@/utils/diceUtil'
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
    damage = commonCtrl.getReducedDamage(me, you, damage, {
      isMagicDamage: true
    })
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'light_magic',
        image: 'effdammagic'
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
  // 治疗术
  heal (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    you.flagFaint = false
    if (you.flagSlow) {
      you.flagSlow = false
      you.speed += config.magicShotMinusSpeed
    }
    you.lockOn = 0
    you.poison = 0
    you.confuse = 0
    you.flagDrunk = false
    let times = diceUtil.getHealTimes().times
    let healAmount = Math.round(you.maxhp * times)
    you = commonCtrl.changeHp(you, healAmount)
    setTimeout(() => {
      eventBus.$emit('animateHeal', {
        targets: [youIndex],
        value: healAmount
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位释放*治疗术*，清除其所有不良效果，并回复${healAmount}点生命值`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 复活
  revive (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    you.isDead = false
    you.hp = Math.round(you.maxhp * config.reviveHealPercent / 100)
    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'qsequal' // TODO 音效
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位释放*复活术*`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  }
}
