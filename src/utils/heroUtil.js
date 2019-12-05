import hero from '../models/hero'
import system from '../models/system'

export default {
  // 获取所有有效敌方单位索引
  getAllTargets () {
    let result = []
    hero.units.forEach((item, index) => {
      if (item.isOpen && item.type && !item.isDead && item.hp) {
        // 有效单位
        if (system.unitIndex > 4 && index < 5) {
          result.push(index)
        } else if (system.unitIndex < 5 && index > 4) {
          result.push(index)
        }
      }
    })
    return result
  },
  // 获取所有有效己方单位索引
  getAllFriends () {
    let result = []
    hero.units.forEach((item, index) => {
      if (item.isOpen && item.type && !item.isDead && item.hp) {
        // 有效单位
        if (system.unitIndex > 4 && index > 4) {
          result.push(index)
        } else if (system.unitIndex < 5 && index < 5) {
          result.push(index)
        }
      }
    })
    return result
  }
}
