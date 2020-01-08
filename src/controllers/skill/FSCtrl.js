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
        sound: 'icehit',
        image: 'effdammagic'
      })
      system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // NOTE 因为后续触发冰枪术及法力爆炸需要再次结算，所以此处先回写一次数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)

    // 结算触发冰枪术
    if (commonCtrl.shouldIceshotTrigger()) {
      let iceshotDamage = Math.round(damage * config.iceshotDamagePercent / 100)
      if (iceshotDamage < 0) {
        iceshotDamage = 0
      }
      this.drawIceshotAtk(youIndex, iceshotDamage, stackPlays)
      if (youIndex === 0 || youIndex === 5) {
        if (heroUtil.isTargetValid(youIndex + 1)) {
          this.drawIceshotAtk(youIndex + 1, iceshotDamage, stackPlays)
        }
      } else if (youIndex === 4 || youIndex === 9) {
        if (heroUtil.isTargetValid(youIndex - 1)) {
          this.drawIceshotAtk(youIndex - 1, iceshotDamage, stackPlays)
        }
      } else {
        if (heroUtil.isTargetValid(youIndex + 1)) {
          this.drawIceshotAtk(youIndex + 1, iceshotDamage, stackPlays)
        }
        if (heroUtil.isTargetValid(youIndex - 1)) {
          this.drawIceshotAtk(youIndex - 1, iceshotDamage, stackPlays)
        }
      }
      stackPlays++

      // 触发法力爆炸
      if (commonCtrl.shouldMagicBoomTrigger(me)) {
        this.drawMagicBoom(stackPlays)
        stackPlays++
      }
    }

    you = hero.units[youIndex]
    me = hero.units[system.unitIndex]

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
  drawIceshotAtk (index, damage, stackPlays) {
    let you = hero.units[index]
    let me = hero.units[system.unitIndex]

    damage = commonCtrl.getReducedDamage(me, you, damage, {
      isMagicDamage: true
    })
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [index],
        value: damage,
        sound: 'iceshot',
        image: 'effdammagic'
      })
      system.msg = [`*冰枪术*对${index + 1}号单位额外造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)

    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(index, 1, you)
  },
  drawMagicBoom (stackPlays) {
    let me = hero.units[system.unitIndex]

    let targets = heroUtil.getAllTargets()
    let damage = Math.round(me.damageTotal / 10)
    if (damage < 0) {
      damage = 0
    }
    targets.forEach(target => {
      let youDamage = damage // 每个单位的最终伤害可能不同
      const youIndex = target
      let you = hero.units[youIndex]

      youDamage = commonCtrl.getReducedDamage(me, you, youDamage, {
        isMagicDamage: true
      })
      // 结算
      you = commonCtrl.changeHp(you, -1 * youDamage)
      me = commonCtrl.drawDps(me, 'skill', youDamage)
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
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    me.iceblock = config.iceblockTurns
    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'iceblock'
      })
      system.msg = [`${system.unitIndex + 1}号单位释放了*寒冰屏障*保护自己，免疫任何物理伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
