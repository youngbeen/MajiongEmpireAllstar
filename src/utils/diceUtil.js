import config from '../models/config'

export default {
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
  // 从2枚骰子中挑选大的（用于生成原始伤害）
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
