// 系统配置

export default {
  slightTimes: 0.8, // 偏斜攻击倍数
  normalTimes: 1, // 正常攻击倍数
  criticalTimes: 1.4, // 会心攻击倍数
  preCastingTime: 1000, // 技能释放前摇时长，单位ms
  animationTime: 1500, // 每个动效播放的时长，单位ms
  initSp: 3, // 初始设定SP
  guardBaseHeal: 1, // 守备基本恢复治疗量
  guardIceblockPlusHeal: 1, // 守备iceblock效果增加的治疗量
  guardDKHeal: 0, // 守备DK恢复量
  guardYDPlusHeal: 1, // 守备YD增加的治疗量
  guardYDPlusSp: 1, // 守备YD增加的SP
  recoverSpAmount: 2, // 每回合自动SP回复量
  recoverSpPercent: 40, // 每回合自动SP回复触发百分比
  chargeFixedDamage: 2, // 冲锋技能造成的固定伤害
  angerPlusDamage: 2, // 激怒状态提升的伤害
  magicShotMinusSpeed: 2, // 奥术射击技能减少的speed值
  lockOnTurns: 2, // 瞄准锁定技能持续层数
  lockOnPlusDamage: 2, // 瞄准锁定增加的伤害
  yyMaxTurns: 2, // yy 技能持续层数
  yyPlusMaxhp: 4, // yy 技能增加的maxhp值
  yyPlusSpeed: 2, // yy 技能增加的speed值
  healLinkMinHeal: 5, // 治疗链首跳最低治疗量（含）
  healLinkMaxHeal: 10, // 治疗链首跳最高治疗量（含）
  deathFingerMinDamage: 8, // 死亡一指最低伤害
  deathFingerMaxDamage: 15, // 死亡一指必杀血线 <= 该值则触发
  zenHealTimes: 2, // 禅坐消耗每单位SP回复HP的倍数
  poisonDamageTurns: 2, // 毒刃效果持续层数
  poisonDamage: 4, // 中毒dot伤害值
  rogueBonusSp: 1, // DZ奖励SP点数
  rogueBonusSpPercent: 17, // DZ奖励SP触发百分比
  iceblockTurns: 3, // 寒冰屏障持续层数
  iceshotPercent: 30, // 冰枪术触发百分比
  iceshotDamagePercent: 50, // 冰枪术占普通伤害的百分比
  magicBoomDamagePercent: 10, // 法力爆炸占总体伤害的百分比
  transformHealAmount: 5, // 变形术回血量
  tigerPlusDamage: 3, // 虎形态增加伤害
  bearDamageReduce: 2, // 熊形态减免伤害
  treeHealAmount: 3, // 树形态回血量
  springTurns: 2, // 回春持续层数
  springBaseHealPercent: 5, // 回春立即回血量百分比
  springHealPercent: 10, // 回春持续状态回血量百分比
  absorbHealAmount: 2, // DK邪恶斩击吸血量
  boomDamage: 5, // DK牺牲爪牙伤害
  infectTurns: 2, // DK感染中毒层数
  sacrificeMinusPercent: 50, // QS牺牲扣减自身当前生命值百分比
  sacrificeTransformPercent: 60, // QS牺牲生命值转化伤害值百分比
  enhancePlusHp: 5, // MS强化提升的HP上限
  reviveHealPercent: 15, // MS复活术回复最大生命值百分比
  inspirePlusHp: 2, // SR鼓舞提升的HP上限
  confuseTurns: 2, // SR蛊惑持续层数
  confusePercent: 33, // SR蛊惑反伤触发百分比
  praiseSpAmount: 2, // SR赞美诗回复SP值
  breakDamagePercent: 50, // PC击破伤害对敌方最大生命值的百分比
  bindDamage: 3, // YD藤蔓伤害
  bindPercent: 50, // YD藤蔓触发百分比
  drunkClearPercent: 20, // 醉酒自动解除百分比
  vanishDodgePercent: 50, // 隐匿状态闪避物理攻击百分比
  vanishSpAmount: 1, // 隐匿状态每回合结束回复SP
  tfRudeHpLine: 15, // TF恃强凌弱触发血线
  tfBonusDamage: 3, // TF恃强凌弱提升伤害
  tfDamageReduce: 1, // TF恃强凌弱削减伤害
  tfKillPlusHp: 2, // TF嗜血击杀后提升的生命值及上限
  // 系统配置
  healthColor: '#62a108', // HP使用色
  skillColor: '#ddd71b' // 技能使用色
}
