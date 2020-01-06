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
    let damage = Math.ceil(diceUtil.getDamageFactor() * times)
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
      sound: 'music_cast',
      image: 'effdammagic'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

    // 处理伤害后的效果
    if (me.hp && me.confuse && diceUtil.rollDice(100) <= config.confusePercent) {
      // 蛊惑时概率自己遭受同等伤害
      me = commonCtrl.enchant(me, stackPlays, damage)
      stackPlays++
    }

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 鼓舞
  inspire (skillId = '', targets = []) {
    const youIndex = targets[0]
    let you = hero.units[youIndex]
    let me = hero.units[system.unitIndex]
    // let stackPlays = 1

    me = commonCtrl.act(me, skillId)

    you.maxhp += config.inspirePlusHp
    you.hp += config.inspirePlusHp
    you.flagTaunt = true

    eventBus.$emit('playSound', {
      sound: 'srcheer'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}单位释放*鼓舞*，使其最大生命值增加${config.inspirePlusHp}，并获得嘲讽`, ...system.msg]

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
    hero.units.splice(youIndex, 1, you)
  },
  // 蛊惑曲
  enchant (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    me = commonCtrl.act(me, skillId)

    // 寻找所有对方有效单位
    targets = heroUtil.getAllTargets()
    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      you.confuse = config.confuseTurns

      hero.units.splice(youIndex, 1, you)
    })

    eventBus.$emit('playSound', {
      sound: 'srconfuse'
    })
    system.msg = [`${system.unitIndex + 1}号单位释放了*蛊惑曲*，敌方所有单位被蛊惑`, ...system.msg]

    // 回写数据
    hero.units.splice(system.unitIndex, 1, me)
  }
}
