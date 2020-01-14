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
    if (you.hp < config.tfRudeHpLine) {
      damage += config.tfBonusDamage
    } else {
      damage -= config.tfDamageReduce
      if (damage < 0) {
        damage = 0
      }
    }
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

    if (you.isDead) {
      // 击杀目标，结算嗜血
      me.maxhp += config.tfKillPlusHp
      me.hp += config.tfKillPlusHp
      setTimeout(() => {
        eventBus.$emit('playSound', {
          sound: 'sound_reflect'
        })
        system.msg = [`${system.unitIndex + 1}号单位击杀${youIndex + 1}号单位，触发*嗜血*效果，生命值及上限提高${config.tfKillPlusHp}`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++
    }

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
  // 行刑
  excute (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // 计算伤害倍数
    let times = commonCtrl.getDamageTimes(me, you)
    // 计算伤害
    let damage = commonCtrl.getDamage(me, you, times)
    if (you.hp < config.tfRudeHpLine) {
      damage += config.tfBonusDamage
    } else {
      damage -= config.tfDamageReduce
      if (damage < 0) {
        damage = 0
      }
    }
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'skill', damage)
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

    if (you.isDead) {
      // 击杀目标，结算嗜血
      me.maxhp += config.tfKillPlusHp
      me.hp += config.tfKillPlusHp
      setTimeout(() => {
        eventBus.$emit('playSound', {
          sound: 'sound_reflect'
        })
        system.msg = [`${system.unitIndex + 1}号单位击杀${youIndex + 1}号单位，触发*嗜血*效果，生命值及上限提高${config.tfKillPlusHp}`, ...system.msg]
      }, config.animationTime * stackPlays)
      stackPlays++

      // 击杀目标，触发顺带伤害
      let attachedDamage = Math.round(damage / 2)
      let isAttachDamageKilled = false
      targets = heroUtil.getAllTargets()
      targets.forEach(target => {
        const targetIndex = target
        let enemy = hero.units[targetIndex]

        enemy = commonCtrl.changeHp(enemy, -1 * attachedDamage)
        me = commonCtrl.drawDps(me, 'skill', attachedDamage)

        setTimeout(() => {
          eventBus.$emit('animateDamage', {
            targets: [targetIndex],
            value: attachedDamage,
            sound: 'sword',
            image: 'effdam'
          })
          system.msg = [`${system.unitIndex + 1}号单位对${targetIndex + 1}号单位造成${attachedDamage}点顺带伤害`, ...system.msg]
        }, config.animationTime * stackPlays)

        hero.units.splice(targetIndex, 1, enemy)

        if (enemy.isDead) {
          isAttachDamageKilled = true
          me.maxhp += config.tfKillPlusHp
          me.hp += config.tfKillPlusHp
          system.msg = [`${system.unitIndex + 1}号单位击杀${targetIndex + 1}号单位，触发*嗜血*效果，生命值及上限提高${config.tfKillPlusHp}`, ...system.msg]
        }
      })
      stackPlays++

      if (isAttachDamageKilled) {
        setTimeout(() => {
          eventBus.$emit('playSound', {
            sound: 'sound_reflect'
          })
        }, config.animationTime * stackPlays)
        stackPlays++
      }
    }

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
  }
}
