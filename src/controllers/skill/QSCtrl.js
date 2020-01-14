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
        sound: 'heavy_hammer',
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
  // 生而平等
  equal (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    // NOTE 因为接下来的结算目标可能涉及自己，所以先回写数据
    hero.units.splice(system.unitIndex, 1, me)

    // 寻找己方最低HP，对方最高HP单位
    let friendIndex = heroUtil.getFriendBoundary().minIndex
    let targetIndex = heroUtil.getTargetBoundary().maxIndex
    let friend = hero.units[friendIndex]
    let you = hero.units[targetIndex]
    let newHp = Math.floor((friend.hp + you.hp) / 2)
    if (newHp < 1) {
      newHp = 1
    }
    friend.hp = newHp
    if (friend.hp > friend.maxhp) {
      friend.hp = friend.maxhp
    }
    you.hp = newHp
    if (you.hp > you.maxhp) {
      you.hp = you.maxhp
    }

    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'qsequal'
      })
      system.msg = [`${system.unitIndex + 1}号单位释放了*生而平等*，${friendIndex + 1}号单位与${targetIndex + 1}号单位均分生命值`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    hero.units.splice(friendIndex, 1, friend)
    hero.units.splice(targetIndex, 1, you)
  },
  // 圣疗术
  reborn (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    me.hp = me.maxhp

    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'qsreborn'
      })
      system.msg = [`${system.unitIndex + 1}号单位释放了*圣疗术*，生命值完全恢复`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  },
  // 牺牲
  sacrifice (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    let stackPlays = 0

    me = commonCtrl.act(me, skillId)

    let selfDamage = Math.floor(me.hp * config.sacrificeMinusPercent / 100)
    me = commonCtrl.changeHp(me, -1 * selfDamage)
    setTimeout(() => {
      eventBus.$emit('playSound', {
        sound: 'eff_fireball_b'
      })
      system.msg = [`${system.unitIndex + 1}号单位*牺牲*，生命值减少${selfDamage}`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    let damage = Math.round(selfDamage * config.sacrificeTransformPercent / 100)
    you = commonCtrl.changeHp(you, -1 * damage)
    me = commonCtrl.drawDps(me, 'skill', damage)
    setTimeout(() => {
      eventBus.$emit('animateDamage', {
        targets: [youIndex],
        value: damage,
        sound: 'boom',
        image: 'effdammagic'
      })
      system.msg = [`${system.unitIndex + 1}号单位的*牺牲*对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]
    }, config.animationTime * stackPlays)
    stackPlays++

    // 处理伤害后的效果
    if (commonCtrl.shouldEnchantTrigger(me, you)) {
      // 蛊惑时概率自己遭受同等伤害
      me = commonCtrl.enchant(me, stackPlays, damage)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  }
}
