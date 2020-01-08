import hero from '../models/hero'
import system from '../models/system'

export default {
  // 检验目标是否是有效目标（开启slot，存活）
  isTargetValid (index) {
    return index >= 0 && index < 10 && hero.units[index].isOpen && !hero.units[index].isDead
  },
  hasDeadTarget () {
    let result = false
    hero.units.forEach((item, index) => {
      if (item.isOpen && item.type && item.isDead) {
        // 有效单位
        if (system.unitIndex > 4 && index < 5) {
          result = true
        } else if (system.unitIndex < 5 && index > 4) {
          result = true
        }
      }
    })
    return result
  },
  hasDeadFriend () {
    let result = false
    hero.units.forEach((item, index) => {
      if (item.isOpen && item.type && item.isDead) {
        // 有效单位
        console.log(index, system.unitIndex)
        if (system.unitIndex > 4 && index > 4) {
          result = true
        } else if (system.unitIndex < 5 && index < 5) {
          result = true
        }
      }
    })
    return result
  },
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
  },
  // 获取目标最低，最高HP单位索引
  getTargetBoundary () {
    let minIndex = -1
    let maxIndex = -1
    let minNum = null
    let maxNum = null
    hero.units.forEach((item, index) => {
      if (item.isOpen && item.type && !item.isDead && item.hp) {
        // 有效单位
        if ((system.unitIndex > 4 && index < 5) || (system.unitIndex < 5 && index > 4)) {
          if (minIndex === -1 || item.hp < minNum) {
            minIndex = index
            minNum = item.hp
          }
          if (maxIndex === -1 || item.hp > maxNum) {
            maxIndex = index
            maxNum = item.hp
          }
        }
      }
    })
    return {
      minIndex,
      maxIndex,
      minNum,
      maxNum
    }
  },
  // 获取己方最低，最高HP单位索引
  getFriendBoundary () {
    let minIndex = -1
    let maxIndex = -1
    let minNum = null
    let maxNum = null
    hero.units.forEach((item, index) => {
      if (item.isOpen && item.type && !item.isDead && item.hp) {
        // 有效单位
        if ((system.unitIndex > 4 && index > 4) || (system.unitIndex < 5 && index < 5)) {
          if (minIndex === -1 || item.hp < minNum) {
            minIndex = index
            minNum = item.hp
          }
          if (maxIndex === -1 || item.hp > maxNum) {
            maxIndex = index
            maxNum = item.hp
          }
        }
      }
    })
    return {
      minIndex,
      maxIndex,
      minNum,
      maxNum
    }
  }
}
