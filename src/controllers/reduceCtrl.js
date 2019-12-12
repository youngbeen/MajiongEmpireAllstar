import config from '@/models/config'

// 减伤控制

export default {
  getReducedDamage (damage = 0, type = '') {
    switch (type) {
      case 'iceblock': // 寒冰屏障减伤直接到0
        return 0
      case 'bear': // 熊形态，减伤
        let newDamage = damage - config.bearDamageReduce
        if (newDamage < 0) {
          newDamage = 0
        }
        return newDamage
      case 'earth': // 大地之力反伤 1/3伤害自己承受
        let reflectDamage = Math.round(damage / 3)
        return {
          reflectDamage
        }
      default:
        return 0
    }
  }
}
