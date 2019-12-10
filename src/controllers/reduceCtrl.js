// 减伤控制

export default {
  getReducedDamage (damage = 0, type = '') {
    switch (type) {
      case 'iceblock': // 寒冰屏障减伤直接到0
        return 0
      case 'bear': // 熊形态，有效伤害-1
        let newDamage = damage - 1
        if (newDamage < 0) {
          newDamage = 0
        }
        return newDamage
      case 'earth': // 大地之力反伤 1/3伤害自己承受
        let reflectDamage = Math.round(damage / 3)
        return {
          reflectDamage
        }
      // TODO 补充其他减伤策略？
      default:
        return 0
    }
  }
}
