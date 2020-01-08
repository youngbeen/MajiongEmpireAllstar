import { numberUtil } from '@youngbeen/angle-util'
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
        sound: 'hammer',
        image: 'effdamham'
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
  // 英勇
  brave (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // 回写数据 NOTE 这里有些特殊，之所以要先回写SM单位的数据是因为后续的英勇效果结算也会变动SM自身的数据，所以需要提前把数据先写入一次
    hero.units.splice(system.unitIndex, 1, me)

    // 寻找所有己方有效单位
    targets = heroUtil.getAllFriends()
    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // 结算
      if (you.yy > 0) {
        // 已有英勇效果，刷新层数
        you.yy = config.yyMaxTurns
      } else {
        // 没有英勇效果
        you.yy = config.yyMaxTurns
        you.maxhp += config.yyPlusMaxhp
        you.hp += config.yyPlusMaxhp
        you.speed += config.yyPlusSpeed
      }

      hero.units.splice(youIndex, 1, you)
    })

    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'yy'
      })
      system.msg = [`${system.unitIndex + 1}号单位释放了*英勇*，所有友方单位最大生命值，速度增加`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++
  },
  // 治疗链
  healLink (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    let healAmount = numberUtil.random(config.healLinkMaxHeal, config.healLinkMinHeal)
    you = commonCtrl.changeHp(you, healAmount)
    setTimeout(() => {
      eventBus.$emit('animateHeal', {
        targets: [youIndex],
        value: healAmount
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位释放*治疗链*，回复${healAmount}点生命值`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)

    // 寻找后续两跳的目标
    let friends = heroUtil.getAllFriends()
    let followTargets = []
    followTargets.push(friends[diceUtil.rollDice(friends.length) - 1]) // 随机第一个友方目标
    followTargets.push(friends[diceUtil.rollDice(friends.length) - 1]) // 随机第二个友方目标
    followTargets.forEach(target => {
      const friendIndex = target
      let friend = hero.units[friendIndex]

      let heal = Math.round(healAmount / 2)
      if (heal <= 0) {
        heal = 1
      }
      healAmount = heal
      friend = commonCtrl.changeHp(friend, heal)
      hero.units.splice(friendIndex, 1, friend)

      setTimeout(() => {
        eventBus.$emit('animateHeal', {
          targets: [friendIndex],
          value: heal
        })
        system.msg = [`治疗链跳动对${friendIndex + 1}号单位回复${heal}点生命值`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    })
  }
}
