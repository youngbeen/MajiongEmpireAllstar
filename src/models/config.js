// 系统配置

export default {
  slightTimes: 0.8, // 偏斜攻击倍数
  normalTimes: 1, // 正常攻击倍数
  criticalTimes: 1.4, // 会心攻击倍数
  preCastingTime: 1000, // 技能释放前摇时长，单位ms
  animationTime: 1500, // 每个动效播放的时长，单位ms
  initSp: 3, // 初始SP
  guardBaseHeal: 1, // 守备基本恢复治疗量
  guardIceblockPlusHeal: 1, // 守备iceblock效果增加的治疗量
  guardDKHeal: 0, // 守备DK恢复量
  guardYDPlusHeal: 1, // 守备YD增加的治疗量
  guardYDPlusSp: 1, // 守备YD增加的SP
  recoverSpAmount: 2, // 每回合自动SP回复量
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
  poisonDamageTurns: 2, // 毒刃效果持续层数
  poisonDamage: 4, // 中毒dot伤害值
  rogueBonusSp: 1, // DZ奖励SP点数
  iceblockTurns: 3, // 寒冰屏障持续层数
  transformHealAmount: 5, // 变形术回血量
  tigerPlusDamage: 3, // 虎形态增加伤害
  bearDamageReduce: 2, // 熊形态减免伤害
  treeHealAmount: 3, // 树形态回血量
  absorbHealAmount: 2, // DK邪恶斩击吸血量
  boomDamage: 5, // DK牺牲爪牙伤害
  enhancePlusHp: 5, // MS强化提升的HP上限
  inspirePlusHp: 2, // SR鼓舞提升的HP上限
  confuseTurns: 2, // SR蛊惑持续层数
  bindDamage: 3, // YD藤蔓伤害
  tfRudeHpLine: 15, // TF恃强凌弱触发血线
  tfBonusDamage: 3, // TF恃强凌弱提升伤害
  tfDamageReduce: 1, // TF恃强凌弱削减伤害
  // 系统配置
  healthColor: '#62a108', // HP使用色
  skillColor: '#ddd71b' // 技能使用色
}
