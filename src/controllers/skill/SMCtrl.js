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
    if (you.iceblock) {
      // 寒冰屏障
      damage = reduceCtrl.getReducedDamage(damage, 'iceblock')
    } else if (you.flagBear) {
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
      sound: 'atksm',
      image: 'effdamham'
    })
    system.msg = [`${system.unitIndex + 1}号单位对${youIndex + 1}号单位造成${damage}点伤害`, ...system.msg]

    if (you.flagEarth && times === config.criticalTimes) {
      // 大地之力反伤
      me = commonCtrl.earthReflect(me, stackPlays, damage)
      stackPlays++
    }

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
  // 英勇
  brave (skillId = '', targets = []) {
    let me = hero.units[system.unitIndex]
    me = commonCtrl.act(me, skillId)

    // 回写数据 NOTE 这里有些特殊，之所以要先回写SM单位的数据是因为后续的英勇效果结算也会变动SM自身的数据，所以需要提前把数据先写入一次
    hero.units.splice(system.unitIndex, 1, me)

    // 寻找所有己方有效单位
    targets = heroUtil.getAllFriends()
    targets.forEach(target => {
      const youIndex = target
      let you = hero.units[youIndex]

      // STEP1 结算
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

    eventBus.$emit('playSound', {
      sound: 'yy'
    })
    system.msg = [`萨满释放了*英勇*，所有友方单位最大生命值，速度增加`, ...system.msg]
  }
}
