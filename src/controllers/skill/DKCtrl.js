import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
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
        sound: 'sword',
        image: 'effdam'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    if (commonCtrl.shouldEarthReflectTrigger(me, you, times)) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理邪恶斩击效果
    if (me.hp > 0 && damage > 0) {
      me = commonCtrl.changeHp(me, config.absorbHealAmount)
      setTimeout(() => {
        eventBus.$emit('animateHeal', {
          targets: [system.unitIndex],
          value: config.absorbHealAmount
        })
        system.msg = [`${system.unitIndex + 1}号单位的*邪恶斩击*使其回复了${config.absorbHealAmount}点生命值`, ...system.msg]
      }, config.animationTime * stackPlays)
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
  // 牺牲爪牙
  boom (skillId = '', targets = []) {
    const youIndex = targets[0]
    // let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // NOTE 提前回写数据
    hero.units.splice(system.unitIndex, 1, me)

    if (youIndex === 0 || youIndex === 5) {
      if (heroUtil.isTargetValid(youIndex + 1)) {
        this.drawBoomAtk(youIndex + 1, config.boomDamage, stackPlays)
      }
    } else if (youIndex === 4 || youIndex === 9) {
      if (heroUtil.isTargetValid(youIndex - 1)) {
        this.drawBoomAtk(youIndex - 1, config.boomDamage, stackPlays)
      }
    } else {
      if (heroUtil.isTargetValid(youIndex - 1)) {
        this.drawBoomAtk(youIndex - 1, config.boomDamage, stackPlays)
      }
      if (heroUtil.isTargetValid(youIndex + 1)) {
        this.drawBoomAtk(youIndex + 1, config.boomDamage, stackPlays)
      }
    }
    stackPlays++

    // 回写数据
    // hero.units.splice(system.unitIndex, 1, me)
    // hero.units.splice(youIndex, 1, you)
  },
  drawBoomAtk (index, damage, stackPlays) {
    let me = hero.units[system.unitIndex]
    let you = hero.units[index]

    damage = commonCtrl.getReducedDamage(me, you, damage, {
      isMagicDamage: true
    })
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'skill', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [index],
        value: damage,
        sound: 'boom',
        image: 'effdammagic'
      })
      system.msg = [`${system.unitIndex + 1}号的*牺牲爪牙*对${index + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)

    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(index, 1, you)
  },
  // 感染
  infect (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    targets = heroUtil.getAllTargets()
    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      if (you.poison) {
        you.poison = you.poison * 2
      } else {
        you.poison = config.infectTurns
      }

      setTimeout(() => {
        eventBus.$emit('playSound', {
          sound: 'arrow' // TODO 音效
        })
        system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位使用*感染*，使其中毒`, ...system.msg]
      }, config.animationTime * stackPlays)

      hero.units.splice(youIndex, 1, you)
    })
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
