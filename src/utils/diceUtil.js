import config from '../models/config'

export default {
  // 获取普通直接伤害基数
  getDamageFactor () {
    return this.rollDice(10)
  },
  // 获取伤害倍数
  getDamageTimes () {
    let dice = this.rollDice()
    switch (dice) {
      case 1:
      case 2:
        return {
          times: config.slightTimes,
          dice
        }
      case 3:
      case 4:
      case 5:
        return {
          times: config.normalTimes,
          dice
        }
      case 6:
        return {
          times: config.criticalTimes,
          dice
        }
    }
  },
  // 获取治疗倍数
  getHealTimes () {
    let dice = this.rollDice()
    switch (dice) {
      case 1:
      case 2:
        return {
          times: 0.2,
          dice
        }
      case 3:
      case 4:
      case 5:
        return {
          times: 0.4,
          dice
        }
      case 6:
        return {
          times: 0.8,
          dice
        }
    }
  },
  // 从2枚骰子中挑选大的
  getBigIn2Dices () {
    let dice1 = this.rollDice()
    let dice2 = this.rollDice()
    return Math.max(dice1, dice2)
  },
  // 投骰子
  rollDice (diceLimit = 6) {
    return Math.floor(Math.random() * diceLimit) + 1
  }
}
