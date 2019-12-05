// 通用技能
import eventBus from '@/eventBus'
import hero from '../../models/hero'
import system from '../../models/system'
import config from '../../models/config'

export default {
  // 守备
  guard () {
    let me = hero.units[system.unitIndex]
    me.isActed = true
    me.actRounds++

    let heal = config.guardBaseHeal
    if (me.type === 'DK') {
      heal = config.guardDKHeal
    } else if (me.type === 'YD') {
      heal += config.guardYDPlusHeal
    } else if (me.iceblock) {
      heal += config.guardIceblockPlusHeal
    }
    me.hp += heal
    if (me.hp > me.maxhp) {
      me.hp = me.maxhp
    }
    // 显示治疗特效
    eventBus.$emit('animateHeal', {
      targets: [system.unitIndex],
      value: heal
    })
    system.msg = [`${system.unitIndex + 1}号单位*守备*,回复${heal}点生命值`, ...system.msg]
  }
}
