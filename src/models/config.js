// 系统配置

export default {
  slightTimes: 0.8, // 偏斜攻击倍数
  normalTimes: 1, // 正常攻击倍数
  criticalTimes: 1.4, // 会心攻击倍数
  guardBaseHeal: 1, // 守备基本恢复治疗量
  guardDKHeal: 0, // 守备DK恢复量
  guardYDPlusHeal: 2, // 守备YD增加的治疗量
  guardIceblockPlusHeal: 1, // 守备iceblock效果增加的治疗量
  yyMaxTurns: 2, // yy 技能持续层数
  yyPlusMaxhp: 2, // yy 技能增加的maxhp值
  yyPlusSpeed: 2, // yy 技能增加的speed值
  magicShotMinusSpeed: 2, // 奥术射击技能减少的speed值
  treeHealAmount: 2, // 树形态回血量
  deathFingerMinDamage: 5, // 死亡一指最低伤害
  deathFingerMaxDamage: 10, // 死亡一指必杀血线 <= 该值则触发
  poisonAtkTurns: 2, // 毒刃效果持续层数
  poisonDamage: 3, // 中毒dot伤害值
  enhancePlusHp: 3, // MS强化提升的HP上限
  inspirePlusHp: 2, // SR鼓舞提升的HP上限
  confuseTurns: 2, // SR蛊惑持续层数
  bindDamage: 2, // YD藤蔓伤害
  // 系统配置
  healthColor: '#62a108', // HP使用色
  skillColor: '#ddd71b' // 技能使用色
}
