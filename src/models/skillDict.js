import config from './config'

const atkSuffixDesc = '发动一次攻击'
const guardPrefixDesc = '采用防守戒备的行动'

export default {
  // NOTE id: C - common, ZS or other hero name - hero skill
  // cat: C - common, P - positive, N - negative
  // type: DA - direct attack, DEF - defence, SK - skill with multiple effects, SA - pure skill attack, SC - pure skill control, BF - buff, DB - debuff
  list: [
    {
      id: 'C1',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `手持宽阔的剑刃斩击敌人，${atkSuffixDesc}`,
      url: './img/sword.png'
    },
    {
      id: 'C2',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C3',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `挽起弓箭射击敌人，${atkSuffixDesc}`,
      url: './img/arrow_atk.png'
    },
    {
      id: 'C4',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C5',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `挥舞附带元素力量的武器，${atkSuffixDesc}`,
      url: './img/hammer_sm.png'
    },
    {
      id: 'C6',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C7',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `舞动手中的五步棍，${atkSuffixDesc}`,
      url: './img/stick.png'
    },
    {
      id: 'C8',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C9',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `使用锋利的匕首攻击敌人，${atkSuffixDesc}`,
      url: './img/dagger_atk.png'
    },
    {
      id: 'C10',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C11',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['魔法伤害'],
      detail: `吟唱寒冷刺骨的魔法，${atkSuffixDesc}`,
      url: './img/ice_atk.png'
    },
    {
      id: 'C12',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C13',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `借助你的特殊能力，${atkSuffixDesc}`,
      url: './img/stick2.png'
    },
    {
      id: 'C14',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `借助你的特殊能力，${atkSuffixDesc}`,
      url: './img/cat_atk.png'
    },
    {
      id: 'C15',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `借助你的特殊能力，${atkSuffixDesc}`,
      url: './img/bear_atk.png'
    },
    {
      id: 'C16',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `借助你的特殊能力，${atkSuffixDesc}`,
      url: './img/tree_atk.png'
    },
    {
      id: 'C17',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C18',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `手持你的符文剑，${atkSuffixDesc}`,
      url: './img/dk_atk.png'
    },
    {
      id: 'C19',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}`,
      url: './img/defend.png'
    },
    {
      id: 'C20',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `使用正义力量惩戒敌人，${atkSuffixDesc}`,
      url: './img/hammer.png'
    },
    {
      id: 'C21',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C22',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['魔法伤害'],
      detail: `使用神圣法术惩戒敌人，${atkSuffixDesc}`,
      url: './img/magic_atk.png'
    },
    {
      id: 'C23',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C24',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['魔法伤害'],
      detail: `演奏摄人心魄的乐曲，${atkSuffixDesc}`,
      url: './img/magic2.png'
    },
    {
      id: 'C25',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C26',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `挥舞手中沉重的武器，${atkSuffixDesc}`,
      url: './img/axe_atk.png'
    },
    {
      id: 'C27',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C28',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `使用手中的戒备棒，${atkSuffixDesc}`,
      url: './img/stick_atk.png'
    },
    {
      id: 'C29',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C30',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `挥舞手中的花园锄头，${atkSuffixDesc}`,
      url: './img/pick.png'
    },
    {
      id: 'C31',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal + config.guardYDPlusHeal})生命值和少量(${config.guardYDPlusSp})SP`,
      url: './img/defend.png'
    },
    {
      id: 'C32',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `手持利刃从阴影中打击敌人，${atkSuffixDesc}`,
      url: './img/dagger_blood.png'
    },
    {
      id: 'C33',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C34',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `高举手中的屠刀，${atkSuffixDesc}`,
      url: './img/axe.png'
    },
    {
      id: 'C35',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'C36',
      cat: 'C',
      type: 'DA',
      spCost: 0,
      targetLimit: 1,
      cnName: '攻击',
      desc: ['物理伤害'],
      detail: `${atkSuffixDesc}`,
      url: './img/punch_atk.png'
    },
    {
      id: 'C37',
      cat: 'C',
      type: 'DEF',
      spCost: 0,
      targetLimit: 0,
      cnName: '守备',
      desc: [],
      detail: `${guardPrefixDesc}，可以恢复少量(${config.guardBaseHeal})生命值`,
      url: './img/defend.png'
    },
    {
      id: 'ZS1',
      cat: 'P',
      type: 'SK',
      spCost: 4,
      targetLimit: 2,
      cnName: '冲锋',
      desc: ['物理伤害', '可以驱散'],
      detail: `对最多2个相邻敌方单位发起冲锋，造成${config.chargeFixedDamage}点伤害，激怒状态时伤害额外增加(${config.angerPlusDamage})。被冲锋的单位会被眩晕，眩晕目标将跳过其行动回合`,
      url: './img/charge.png'
    },
    {
      id: 'ZS3',
      cat: 'P',
      type: 'SA',
      spCost: 3,
      targetLimit: 3,
      cnName: '旋风斩',
      desc: ['物理伤害'],
      detail: `随机对2~3个敌方单位发动一次旋风般的攻击，激怒状态时伤害额外增加(${config.angerPlusDamage})`,
      url: './img/rotate_atk.png'
    },
    {
      id: 'ZS2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '激怒',
      desc: ['有益效果', '可以驱散'],
      detail: `普通攻击造成暴击时，获得激怒效果，任何攻击会消耗激怒。激怒状态下普通攻击必定暴击，技能攻击伤害额外提升(${config.angerPlusDamage})`,
      url: './img/anger.png'
    },
    {
      id: 'LR1',
      cat: 'P',
      type: 'DA',
      spCost: 3,
      targetLimit: 5,
      cnName: '箭雨',
      desc: ['物理伤害'],
      detail: '对所有敌方单位造成伤害(不进行攻击程度判定，6点-6伤害/4~5点-4伤害/1~3点-2伤害)',
      url: './img/arrow_rain.png'
    },
    {
      id: 'LR2',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 1,
      cnName: '奥术射击',
      desc: ['物理伤害', '可以驱散'],
      detail: `对1个敌方单位发动一次射击，使目标速度降低(速度-${config.magicShotMinusSpeed}，不叠加)，并能驱散目标身上的激怒和英勇效果`,
      url: './img/arrow_ice.png'
    },
    {
      id: 'LR3',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '瞄准锁定',
      desc: ['可以驱散'],
      detail: `每次攻击的目标会被锁定，持续${config.lockOnTurns}回合(不叠加)。你对锁定的目标造成的伤害增加(${config.lockOnPlusDamage})`,
      url: './img/lock_on.png'
    },
    {
      id: 'SM1',
      cat: 'P',
      type: 'BF',
      spCost: 3,
      targetLimit: 0,
      cnName: '英勇',
      desc: ['有益效果', '可以驱散'],
      detail: `全体友方单位生命值上限提高(${config.yyPlusMaxhp})，速度上升(${config.yyPlusSpeed})，持续${config.yyMaxTurns}回合，英勇效果不叠加`,
      url: './img/yy.png'
    },
    {
      id: 'SM3',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 1,
      cnName: '治疗链',
      desc: [],
      detail: `为1个友方单位回复${config.healLinkMinHeal}~${config.healLinkMaxHeal}点生命值。治疗链会再跳动2次，每跳对随机友方目标回复上次回复量的一半`,
      url: './img/heal_link.png'
    },
    {
      id: 'SM2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '大地之力',
      desc: ['有益效果', '无法驱散'],
      detail: '召唤大地母亲护佑全体友方单位，持续整场战斗。当敌方对友方单位造成暴击时，攻击方会受到此次伤害的1/3反馈伤害',
      url: './img/earth.png'
    },
    {
      id: 'WS1',
      cat: 'P',
      type: 'DA',
      spCost: 3,
      targetLimit: 1,
      cnName: '死亡一指',
      desc: ['魔法伤害'],
      detail: `指定1个敌方单位，若目标生命值<=${config.deathFingerMaxDamage}则立即击杀该目标，否则对其造成${config.deathFingerMinDamage}点伤害。该伤害不受伤害减免效果影响`,
      url: './img/elec_atk.png'
    },
    {
      id: 'WS3',
      cat: 'P',
      type: 'SK',
      spCost: 0,
      targetLimit: 0,
      cnName: '禅坐',
      desc: [],
      detail: `消耗当前所有SP，每消耗1点SP，回复${config.zenHealTimes}点生命值`,
      url: './img/zen.png'
    },
    {
      id: 'WS2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '醉拳',
      desc: ['有益效果', '无法驱散'],
      detail: '对你的攻击更难击中你(1~3-偏斜，4~5-正常，6-暴击)',
      url: './img/wine.png'
    },
    {
      id: 'DZ1',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 1,
      cnName: '毒刃',
      desc: ['物理伤害', '毒（自然伤害）', '可以驱散'],
      detail: `对1个敌方单位发动一次攻击，并附带中毒效果(持续${config.poisonDamageTurns}回合，可叠加)。中毒目标每回合结束会受到毒药伤害(${config.poisonDamage})，毒药伤害不受伤害减免效果影响。你对中毒目标进行攻击时更容易暴击(5~6-暴击)`,
      url: './img/dagger1.png'
    },
    {
      id: 'DZ3',
      cat: 'P',
      type: 'SA',
      spCost: 4,
      targetLimit: 2,
      cnName: '左右开弓',
      desc: ['物理伤害'],
      detail: `对最多2个敌方单位同时发动攻击。你对中毒目标进行攻击时更容易暴击(5~6-暴击)`,
      url: './img/swing_dagger.png'
    },
    {
      id: 'DZ2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '能量控制',
      desc: ['有益效果', '无法驱散'],
      detail: `最大技能点数上限提高，你每次攻击结束之后有一定几率(${config.rogueBonusSpPercent}%)回复${config.rogueBonusSp}点SP值`,
      url: './img/melt_clock.png'
    },
    {
      id: 'FS1',
      cat: 'P',
      type: 'BF',
      spCost: 5,
      targetLimit: 0,
      cnName: '寒冰屏障',
      desc: ['有益效果', '无法驱散'],
      detail: `释放保护自己的寒冰屏障，持续${config.iceblockTurns}回合，寒冰屏障持续时你免疫任何物理伤害。此外在寒冰屏障持续时，使用*守 备*技能额外回复${config.guardIceblockPlusHeal}点生命值`,
      url: './img/iceblock.png'
    },
    {
      id: 'FS2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '冰枪术',
      desc: ['魔法伤害', '有益效果', '无法驱散'],
      detail: `每次普通攻击有一定几率(${config.iceshotPercent}%)触发冰枪术，对当前敌方单位及其左右相邻单位再次造成普通攻击伤害的${config.iceshotDamagePercent}%伤害`,
      url: './img/iceshot.png'
    },
    {
      id: 'FS3',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '法力爆炸',
      desc: ['魔法伤害', '有益效果', '无法驱散'],
      detail: `冰枪术触发后有一定几率(（40-回合数）%)）触发法力爆炸，对所有敌方目标造成你当前伤害总量${config.magicBoomDamagePercent}%的伤害`,
      url: './img/magic_boom.png'
    },
    {
      id: 'XD1',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 0,
      cnName: '变形术:虎形态',
      desc: ['有益效果', '无法驱散'],
      detail: `回复${config.transformHealAmount}点生命值并变形成尖牙利齿的虎形态，在该形态下你所有攻击将额外造成${config.tigerPlusDamage}点伤害`,
      url: './img/tiger.png'
    },
    {
      id: 'XD2',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 0,
      cnName: '变形术:熊形态',
      desc: ['有益效果', '无法驱散'],
      detail: `回复${config.transformHealAmount}点生命值并变形成厚实坚硬的熊形态，在该形态下受到的伤害减少(${config.bearDamageReduce})。并拥有嘲讽技能，强迫敌方单位必须先攻击你`,
      url: './img/bear.png'
    },
    {
      id: 'XD3',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 0,
      cnName: '变形术:树形态',
      desc: ['有益效果', '无法驱散'],
      detail: `回复${config.transformHealAmount}点生命值并变形成自然和谐的树形态，在该形态下每回合结束所有友方单位回复${config.treeHealAmount}点生命值`,
      url: './img/tree.png'
    },
    {
      id: 'XD4',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 1,
      cnName: '共生术',
      desc: [],
      detail: '指定1个友方单位，与其交换彼此的当前生命值。交换后的生命值不会超过生命值上限',
      url: './img/nature.png'
    },
    {
      id: 'XD5',
      cat: 'P',
      type: 'SK',
      spCost: 5,
      targetLimit: 0,
      cnName: '回春术',
      desc: ['有益效果', '无法驱散'],
      detail: `立即回复${config.springBaseHealPercent}%生命值，并获得回春(持续${config.springTurns}回合，不叠加)。回春状态下，回合结束时回复${config.springHealPercent}%生命值`,
      url: './img/leaf.png'
    },
    {
      id: 'DK1',
      cat: 'P',
      type: 'SA',
      spCost: 3,
      targetLimit: 1,
      cnName: '牺牲爪牙',
      desc: ['魔法伤害'],
      detail: `指定1个已死亡敌方单位变化为食尸鬼，并牺牲它使其爆炸。食尸鬼爆炸对相邻单位造成${config.boomDamage}点伤害`,
      url: './img/infect.png'
    },
    {
      id: 'DK3',
      cat: 'P',
      type: 'SK',
      spCost: 4,
      targetLimit: 5,
      cnName: '感染',
      desc: ['毒（自然伤害）', '可以驱散'],
      detail: `所有敌方目标中毒，持续${config.infectTurns}回合，可叠加。如果目标身上已有毒状态，则毒状态层数翻倍`,
      url: './img/bug.png'
    },
    {
      id: 'DK2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '邪恶斩击',
      desc: ['有益效果', '无法驱散'],
      detail: `普通攻击造成有效伤害(>0)时，回复${config.absorbHealAmount}点生命值，但*守 备*不能回复生命值`,
      url: './img/axe_blood.png'
    },
    {
      id: 'QS1',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 0,
      cnName: '生而平等',
      desc: [],
      detail: `生命值最低的友方单位与生命值最高的敌方单位均分生命值，但不超过各自生命值上限`,
      url: './img/justice.png'
    },
    {
      id: 'QS2',
      cat: 'P',
      type: 'SK',
      spCost: 6,
      targetLimit: 0,
      cnName: '圣疗术',
      desc: [],
      detail: '你的生命值完全回复',
      url: './img/recover.png'
    },
    {
      id: 'MS1',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 1,
      cnName: '治疗术',
      desc: [],
      detail: '对1个友方单位进行治疗，并清除目标身上的所有不良效果',
      url: './img/heal.png'
    },
    {
      id: 'MS2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '强化',
      desc: ['有益效果', '无法驱散'],
      detail: `你存活的情况下，所有友方单位最大生命值增加(${config.enhancePlusHp})。死亡时，回合结束该增益效果自动消失`,
      url: './img/enhance.png'
    },
    {
      id: 'SR1',
      cat: 'P',
      type: 'SK',
      spCost: 4,
      targetLimit: 1,
      cnName: '鼓舞',
      desc: ['有益效果', '无法驱散'],
      detail: `使1个友方单位在该场战斗中生命值及上限永久增加(${config.inspirePlusHp})，并获得嘲讽技能，强迫敌方单位必须优先攻击他。可以对同一友方单位重复释放该技能`,
      url: './img/inspire.png'
    },
    {
      id: 'SR2',
      cat: 'P',
      type: 'DB',
      spCost: 3,
      targetLimit: 0,
      cnName: '蛊惑曲',
      desc: ['可以驱散'],
      detail: `所有敌方单位获得蛊惑，蛊惑持续${config.confuseTurns}回合（不叠加）。被蛊惑的敌方单位有一定几率(${config.confusePercent}%)遭受其造成的攻击伤害的同等伤害`,
      url: './img/confuse.png'
    },
    {
      id: 'PC1',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      cnName: '横扫',
      targetLimit: 5,
      desc: ['有益效果', '无法驱散'],
      detail: '普通攻击会攻击所有敌方单位，无需指定目标',
      url: './img/swing_sword.png'
    },
    {
      id: 'PC2',
      cat: 'N',
      type: 'DB',
      spCost: 0,
      targetLimit: 0,
      cnName: '力量的代价',
      desc: ['有害效果', '无法驱散'],
      detail: '攻击不会暴击，只会造成偏斜攻击(1~3)或正常攻击(4~6)',
      url: './img/back_atk.png'
    },
    {
      id: 'JB1',
      cat: 'P',
      type: 'DB',
      spCost: 6,
      targetLimit: 1,
      cnName: '醉酒',
      desc: ['可以驱散'],
      detail: `指定1个敌方单位，目标获得醉酒。醉酒状态单位始终跳过其行动回合，醉酒状态在每回合结束有一定几率(${config.drunkClearPercent}%)解除`,
      url: './img/sleep.png'
    },
    {
      id: 'JB2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '酒壮人胆',
      desc: ['有益效果', '无法驱散'],
      detail: '你的攻击伤害值会随着你的生命值的降低而增加(生命值每降低10点，伤害值额外增加1点)',
      url: './img/snake_eye.png'
    },
    {
      id: 'YD1',
      cat: 'N',
      type: 'DB',
      spCost: 0,
      targetLimit: 0,
      cnName: '致命藤蔓',
      desc: ['有害效果', '无法驱散', '自然伤害'],
      detail: `你存活的回合结束阶段，会召唤出致命的藤蔓攻击所有敌方单位，致命藤蔓每次有一定几率(${config.bindPercent}%)对目标造成${config.bindDamage}点伤害。该伤害不受伤害减免效果影响`,
      url: './img/bind.png'
    },
    {
      id: 'YD2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '平和主义',
      desc: ['无法驱散'],
      detail: `*守 备*行动回复的生命值额外增加${config.guardYDPlusHeal}点，此外还回复${config.guardYDPlusSp}点SP，但你的普通攻击始终造成偏斜伤害`,
      url: './img/peace.png'
    },
    {
      id: 'YX1',
      cat: 'P',
      type: 'DA',
      spCost: 4,
      targetLimit: 1,
      cnName: '幻影打击',
      desc: ['物理伤害'],
      detail: '发动一次攻击，且不消耗行动回合',
      url: './img/fast_pace.png'
    },
    {
      id: 'YX2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '要害痛击',
      desc: ['有益效果', '无法驱散'],
      detail: '战斗中速度增加，你的攻击造成暴击的时候，可以额外奖励一个行动回合。幻影打击不触发额外行动回合奖励',
      url: './img/sharp_atk.png'
    },
    {
      id: 'TF1',
      cat: 'P',
      type: 'SK',
      spCost: 3,
      targetLimit: 1,
      cnName: '行刑',
      desc: ['物理伤害'],
      detail: '对1个敌方单位发动一次攻击。若行刑后该目标死亡，则其他所有敌方单位都将受到该次伤害的50%顺带伤害。顺带伤害不受免/减伤效果影响',
      url: './img/sword_blood.png'
    },
    {
      id: 'TF2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '恃强凌弱',
      desc: ['无法驱散'],
      detail: `对生命值<${config.tfRudeHpLine}的敌方单位进行攻击时，额外造成${config.tfBonusDamage}点伤害。但对生命值>=${config.tfRudeHpLine}的敌方单位进行攻击时，造成的伤害降低${config.tfDamageReduce}点`,
      url: './img/owl.png'
    },
    {
      id: 'MO1',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '小不点也有大作为',
      desc: ['有益效果', '无法驱散'],
      detail: '普通攻击不进行攻击判定，初始伤害固定为1。伤害值每个回合后增加(1)',
      url: './img/cute_animal.png'
    },
    {
      id: 'MO2',
      cat: 'N',
      type: 'BF',
      spCost: 0,
      targetLimit: 0,
      cnName: '玩偶之心',
      desc: ['有益效果', '无法驱散'],
      detail: '初始生命值为20，战斗刚开始时，场上每有1个敌方单位，你的最大生命值增加15；场上每有1个友方单位，你的最大生命值减少5 。你的最大生命值不会低于20点',
      url: './img/doll.png'
    }
  ]
}
