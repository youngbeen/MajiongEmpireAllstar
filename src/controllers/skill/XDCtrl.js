import eventBus from '@/eventBus'
import config from '@/models/config'
import hero from '@/models/hero'
import system from '@/models/system'
import commonCtrl from './commonCtrl'

export default {
  // 普攻
  atk (targets = []) {
    // 只有一目标
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let mySubtype = 'xd'
    if (me.flagTiger) {
      mySubtype = 'tiger'
    } else if (me.flagBear) {
      mySubtype = 'bear'
    } else if (me.flagTree) {
      mySubtype = 'tree'
    }
    let stackPlays = 0

    me = commonCtrl.act(me)

    // 计算伤害倍数
    let times = commonCtrl.getDamageTimes(me, you)
    // 计算伤害
    let damage = commonCtrl.getDamage(me, you, times)
    if (me.flagTiger) {
      damage += config.tigerPlusDamage
    }
    damage = commonCtrl.getReducedDamage(me, you, damage)
    // 结算
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'direct', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: `atk${mySubtype}`,
        image: `effdam${mySubtype}`
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
  // 变形
  transform (skillId = '', type = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    if (me.flagBear) {
      // 仅清除熊身上的嘲讽，避免错误清除其他buff的嘲讽
      me.flagTaunt = false
    }
    me.flagTiger = false
    me.flagBear = false
    me.flagTree = false
    let cnType = ''
    switch (type) {
      case 'tiger':
        me.flagTiger = true
        cnType = '虎'
        break
      case 'bear':
        me.flagBear = true
        me.flagTaunt = true
        cnType = '熊'
        break
      case 'tree':
        me.flagTree = true
        cnType = '树'
        break
    }
    me.url = `./img/unit${type}.png`
    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: type
      })
    }, config.animationTime * stackPlays)
    stackPlays++

    me = commonCtrl.changeHp(me, config.transformHealAmount)
    setTimeout(() => {
      eventBus.$emit('animateHeal', {
        targets: [system.unitIndex],
        value: config.transformHealAmount
      })
      system.msg = [`${system.unitIndex + 1}号单位变形为${cnType}形态，恢复${config.transformHealAmount}点生命值`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  },
  // 共生术
  symbiosis (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    let tempHp = you.hp
    you.hp = me.hp
    if (you.hp > you.maxhp) {
      you.hp = you.maxhp
    }
    me.hp = tempHp
    if (me.hp > me.maxhp) {
      me.hp = me.maxhp
    }

    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'xdgs'
      })
      system.msg = [`${system.unitIndex + 1}号单位释放*共生术*，与${youIndex + 1}号单位交换了生命值`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 回春术
  spring (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    let heal = Math.round(me.maxhp * config.springBaseHealPercent / 100)
    me = commonCtrl.changeHp(me, heal)
    setTimeout(() => {
      eventBus.$emit('animateHeal', {
        targets: [system.unitIndex],
        value: heal
      })
      system.msg = [`${system.unitIndex + 1}号单位释放*回春术*，立即回复${heal}点生命值，并获得回春状态`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
