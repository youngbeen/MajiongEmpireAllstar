import eventBus from '../eventBus'
import heroDict from '../models/heroDict'
import hero from '../models/hero'
import system from '../models/system'
import config from '../models/config'
import commonCtrl from './skill/commonCtrl'
import ZSCtrl from './skill/ZSCtrl'
import LRCtrl from './skill/LRCtrl'
import SMCtrl from './skill/SMCtrl'
import WSCtrl from './skill/WSCtrl'
import DZCtrl from './skill/DZCtrl'
import FSCtrl from './skill/FSCtrl'
import XDCtrl from './skill/XDCtrl'
import DKCtrl from './skill/DKCtrl'
import QSCtrl from './skill/QSCtrl'
import MSCtrl from './skill/MSCtrl'
import SRCtrl from './skill/SRCtrl'
import PCCtrl from './skill/PCCtrl'
import JBCtrl from './skill/JBCtrl'
import YDCtrl from './skill/YDCtrl'
import YXCtrl from './skill/YXCtrl'
import TFCtrl from './skill/TFCtrl'
import MOCtrl from './skill/MOCtrl'
import diceUtil from '../utils/diceUtil'

export default {
  // 设置角色数据
  setUnitData () {
    let isMSUpside = hero.units.some((item, index) => index < 5 && item.type === 'MS')
    let isMSDownside = hero.units.some((item, index) => index >= 5 && index < 10 && item.type === 'MS')
    let isSMUpside = hero.units.some((item, index) => index < 5 && item.type === 'SM')
    let isSMDownside = hero.units.some((item, index) => index >= 5 && index < 10 && item.type === 'SM')
    let isYDUpside = hero.units.some((item, index) => index < 5 && item.type === 'YD')
    let isYDDownside = hero.units.some((item, index) => index >= 5 && index < 10 && item.type === 'YD')
    hero.units = hero.units.map((item, index) => {
      if (item.type) {
        // 选择了英雄，进行初始化
        item.isOpen = true
        item.isActed = false
        item.isDead = false
        // 从字典中搜索匹配项，获取对应信息
        let truth = heroDict.list.find(citem => {
          return citem.name === item.type
        })
        item.hp = item.maxhp = truth.maxhp
        item.maxsp = truth.maxsp
        item.sp = config.initSp
        if (item.sp > item.maxsp) {
          item.sp = item.maxsp
        }
        item.speed = truth.speed
        item.directDamageTotal = 0
        item.skillDamageTotal = 0
        item.damageTotal = 0
        item.actRounds = 0
        item.flagAnger = false
        item.iceblock = 0
        item.flagEnhance = false
        item.flagTiger = false
        item.flagBear = false
        item.flagTree = false
        item.yy = 0
        item.flagTaunt = false
        item.flagEarth = false
        item.flagFaint = false
        item.flagSlow = false
        item.lockOn = 0
        item.poison = 0
        item.confuse = 0
        item.flagBind = false
        item.flagDrunk = false
        if (index < 5) {
          // 上方
          if (isMSUpside) {
            item.maxhp += config.enhancePlusHp
            item.hp += config.enhancePlusHp
            item.flagEnhance = true
          }
          if (isSMUpside) {
            item.flagEarth = true
          }
          if (isYDDownside) {
            // 敌方有园丁
            item.flagBind = true
          }
        } else if (index < 10) {
          // 下方
          if (isMSDownside) {
            item.maxhp += config.enhancePlusHp
            item.hp += config.enhancePlusHp
            item.flagEnhance = true
          }
          if (isSMDownside) {
            item.flagEarth = true
          }
          if (isYDUpside) {
            // 敌方有园丁
            item.flagBind = true
          }
        }
      }
      return item
    })

    // 处理木偶的血量
    let upsideMOIndex = ''
    let downsideMOIndex = ''
    let upsideHeroCount = 0
    let downsideHeroCount = 0
    hero.units.forEach((item, index) => {
      if (index < 5) {
        if (item.type) {
          upsideHeroCount++
          if (item.type === 'MO') {
            upsideMOIndex = index
          }
        }
      } else if (index < 10) {
        if (item.type) {
          downsideHeroCount++
          if (item.type === 'MO') {
            downsideMOIndex = index
          }
        }
      }
    })
    if (upsideMOIndex !== '') {
      let copy = hero.units[upsideMOIndex]
      copy.maxhp = 20
      copy.maxhp += 15 * downsideHeroCount - 5 * upsideHeroCount
      if (copy.maxhp < 20) {
        copy.maxhp = 20
      }
      copy.hp = copy.maxhp
      hero.units.splice(upsideMOIndex, 1, copy)
    }
    if (downsideMOIndex !== '') {
      let copy = hero.units[downsideMOIndex]
      copy.maxhp = 20
      copy.maxhp += 15 * upsideHeroCount - 5 * downsideHeroCount
      if (copy.maxhp < 20) {
        copy.maxhp = 20
      }
      copy.hp = copy.maxhp
      hero.units.splice(downsideMOIndex, 1, copy)
    }
  },
  // 寻找下一个动作单位
  proceedTurn () {
    // 先检查获取胜利
    if (this.checkWin()) {
      return
    }
    let slotUp = 0
    let slotDown = 0
    let speedUp = -99 // 初始速度设置为-99
    let speedDown = -99 // 初始速度设置为-99
    // 选出上，下方速度最高的有效单位
    for (let i = 0; i < 5; i++) {
      if (hero.units[i].type && hero.units[i].isOpen && !hero.units[i].isActed && !hero.units[i].isDead) {
        if (hero.units[i].speed > speedUp) {
          slotUp = i
          speedUp = hero.units[i].speed
        }
      }
      if (hero.units[i + 5].type && hero.units[i + 5].isOpen && !hero.units[i + 5].isActed && !hero.units[i + 5].isDead) {
        if (hero.units[i + 5].speed > speedDown) {
          slotDown = i
          speedDown = hero.units[i + 5].speed
        }
      }
    }

    if (speedUp === -99 && speedDown === -99) {
      // 无可行动角色，回合结束，重新开始新回合
      this.refreshActionFlag()
      // 处理buff，清除debuff
      let stackPlays = this.runBuffs()
      stackPlays = this.gainSp(stackPlays)

      system.turn = system.firstHand
      system.turns++

      setTimeout(() => {
        // eventBus.$emit('playSound', {
        //   sound: 'reset'
        // })
        system.msg = ['所有单位已重置！', ...system.msg]
      }, config.animationTime * stackPlays)
    } else if (speedUp !== -99 && speedDown !== -99) {
      // 都存在未动作单位，比较速度大小及先后手
      if (speedUp > speedDown) {
        // 上方
        system.unitIndex = slotUp
        this.makeSkill()
      } else if (speedUp === speedDown) {
        // 速度相同，开始看轮番turn
        if (system.turn === 'up') {
          // 上方
          system.turn = 'down'
          system.unitIndex = slotUp
          this.makeSkill()
        } else {
          // 下方
          system.turn = 'up'
          system.unitIndex = slotDown + 5
          this.makeSkill()
        }
      } else {
        system.unitIndex = slotDown + 5
        this.makeSkill()
      }
    } else {
      // 只有一方存在未动作单位
      if (speedUp === -99) {
        // 下方
        system.unitIndex = slotDown + 5
        this.makeSkill()
      } else {
        // 上方
        system.unitIndex = slotUp
        this.makeSkill()
      }
    }
  },
  // 选择技能
  makeSkill () {
    if (hero.units[system.unitIndex].flagFaint) {
      // 准备行动的角色已被眩晕
      hero.units[system.unitIndex].isActed = true
      eventBus.$emit('playSound', {
        sound: 'faint'
      })
    } else if (hero.units[system.unitIndex].flagDrunk) {
      // 准备行动的角色已被醉酒
      hero.units[system.unitIndex].isActed = true
      eventBus.$emit('playSound', {
        sound: 'drunk'
      })
    } else {
      // 可以行动
      eventBus.$emit('makeSkill')
    }
  },
  // 处理技能
  proceedSkill (skillId = '', targets = []) {
    switch (skillId) {
      case 'C1': // ZS普攻
        ZSCtrl.atk(targets)
        break
      case 'ZS1': // ZS冲锋
        eventBus.$emit('playSound', {
          sound: 'charge'
        })
        setTimeout(() => {
          ZSCtrl.charge(skillId, targets)
        }, config.preCastingTime)
        break
      case 'ZS3': // ZS旋风斩
        eventBus.$emit('playSound', {
          sound: 'charge'
        })
        setTimeout(() => {
          ZSCtrl.rotateAtk(skillId)
        }, config.preCastingTime)
        break
      case 'C3': // LR普攻
        eventBus.$emit('playSound', {
          sound: 'castmultishot'
        })
        setTimeout(() => {
          LRCtrl.atk(targets)
        }, config.preCastingTime)
        break
      case 'LR1': // LR箭雨
        eventBus.$emit('playSound', {
          sound: 'castmultishot'
        })
        setTimeout(() => {
          LRCtrl.rain(skillId)
        }, config.preCastingTime)
        break
      case 'LR2': // LR奥术射击
        eventBus.$emit('playSound', {
          sound: 'castmultishot'
        })
        setTimeout(() => {
          LRCtrl.magicShoot(skillId, targets)
        }, config.preCastingTime)
        break
      case 'C5': // SM普攻
        SMCtrl.atk(targets)
        break
      case 'SM1': // SM英勇
        SMCtrl.brave(skillId)
        break
      case 'SM3': // SM治疗链
        eventBus.$emit('playSound', {
          sound: 'castmultishot' // TODO change pre sound
        })
        setTimeout(() => {
          SMCtrl.healLink(skillId, targets)
        }, config.preCastingTime)
        break
      case 'C7': // WS普攻
        WSCtrl.atk(targets)
        break
      case 'WS1': // WS死亡一指
        WSCtrl.deathFinger(skillId, targets)
        break
      case 'WS3': // WS禅坐
        WSCtrl.zen(skillId)
        break
      case 'C9': // DZ普攻
        DZCtrl.atk(targets)
        break
      case 'DZ1': // DZ毒刃
        DZCtrl.poisonAtk(skillId, targets)
        break
      case 'C11': // FS普攻
        FSCtrl.atk(targets)
        break
      case 'FS1': // FS寒冰屏障
        FSCtrl.iceblock(skillId)
        break
      case 'C13': // XD普攻
      case 'C14': // XD普攻
      case 'C15': // XD普攻
      case 'C16': // XD普攻
        XDCtrl.atk(targets)
        break
      case 'XD1': // XD变形虎
        XDCtrl.transform(skillId, 'tiger')
        break
      case 'XD2': // XD变形熊
        XDCtrl.transform(skillId, 'bear')
        break
      case 'XD3': // XD变形树
        XDCtrl.transform(skillId, 'tree')
        break
      case 'XD4': // XD共生术
        XDCtrl.symbiosis(skillId, targets)
        break
      case 'C18': // DK普攻
        DKCtrl.atk(targets)
        break
      case 'DK1': // DK牺牲爪牙
        DKCtrl.boom(skillId, targets)
        break
      case 'C20': // QS普攻
        QSCtrl.atk(targets)
        break
      case 'QS1': // QS生而平等
        QSCtrl.equal(skillId)
        break
      case 'QS2': // QS圣疗术
        QSCtrl.reborn(skillId)
        break
      case 'C22': // MS普攻
        MSCtrl.atk(targets)
        break
      case 'MS1': // MS治疗
        MSCtrl.heal(skillId, targets)
        break
      case 'C24': // SR普攻
        SRCtrl.atk(targets)
        break
      case 'SR1': // SR鼓舞
        SRCtrl.inspire(skillId, targets)
        break
      case 'SR2': // SR蛊惑曲
        SRCtrl.enchant(skillId)
        break
      case 'C26': // PC普攻
        PCCtrl.atk(targets)
        break
      case 'C28': // JB普攻
        JBCtrl.atk(targets)
        break
      case 'JB1': // JB醉酒
        JBCtrl.drunk(skillId, targets)
        break
      case 'C30': // YD普攻
        YDCtrl.atk(targets)
        break
      case 'C32': // YX普攻
        YXCtrl.atk(targets)
        break
      case 'YX1': // YX幻影打击
        YXCtrl.shadowAtk(skillId, targets)
        break
      case 'C34': // TF普攻
        TFCtrl.atk(targets)
        break
      case 'TF1': // TF行刑
        TFCtrl.excute(skillId, targets)
        break
      case 'C36': // MO普攻
        MOCtrl.atk(targets)
        break
      case 'C2': // ZS守备
      case 'C4': // LR守备
      case 'C6': // SM守备
      case 'C8': // WS守备
      case 'C10': // DZ守备
      case 'C12': // FS守备
      case 'C17': // XD守备
      case 'C19': // DK守备
      case 'C21': // QS守备
      case 'C23': // MS守备
      case 'C25': // SR守备
      case 'C27': // PC守备
      case 'C29': // JB守备
      case 'C31': // YD守备
      case 'C33': // YX守备
      case 'C35': // TF守备
      case 'C37': // MO守备
        commonCtrl.guard()
        break
      default:
    }
  },
  // 刷新action
  refreshActionFlag () {
    hero.units = hero.units.map(item => {
      item.isActed = false
      return item
    })
  },
  // 获取sp
  gainSp (stackPlays) {
    hero.units = hero.units.map((item, index) => {
      if (item.isOpen && item.type && !item.isDead) {
        // 存活的有效单位，每回合2/5的概率获得sp
        if (diceUtil.rollDice(5) > 3) {
          item.sp += config.recoverSpAmount
          if (item.sp > item.maxsp) {
            item.sp = item.maxsp
          }
          setTimeout(() => {
            eventBus.$emit('animateSpRecover', {
              targets: [index],
              value: config.recoverSpAmount
            })
          }, config.animationTime * stackPlays)
        }
      }
      return item
    })
    stackPlays++
    return stackPlays
  },
  // 结算回合结束时的技能，buff等
  runBuffs () {
    let upMSDead = false
    let downMSDead = false
    let upTreeAlive = false
    let downTreeAlive = false
    let upYDDead = false
    let downYDDead = false
    let delayCauses = [] // 每一类结算因素会造成下一个效果的延迟播放
    hero.units = hero.units.map((item, index) => {
      if (item.isOpen && item.type && !item.isDead) {
        // 清除眩晕
        item.flagFaint = false
        // 清除减速
        if (item.flagSlow) {
          item.speed += config.magicShotMinusSpeed
          item.flagSlow = false
        }
        // 清除锁定效果
        if (item.lockOn > 0) {
          item.lockOn--
        }
        // 清除YY效果
        if (item.yy > 0) {
          item.yy--
          if (item.yy === 0) {
            item.maxhp -= config.yyPlusMaxhp
            if (item.hp > item.maxhp) {
              item.hp = item.maxhp
            }
            item.speed -= config.yyPlusSpeed
          }
        }
        // 清除寒冰屏障
        if (item.iceblock > 0) {
          item.iceblock--
        }
        // 清除蛊惑效果
        if (item.confuse > 0) {
          item.confuse--
        }
        // 清除醉酒
        if (item.flagDrunk && diceUtil.rollDice(5) === 5) {
          item.flagDrunk = false
        }
        // 结算中毒
        if (item.poison > 0) {
          if (delayCauses.indexOf('poison') === -1) {
            delayCauses.push('poison')
          }
          item.poison--
          let poisonDamage = config.poisonDamage
          item.hp -= poisonDamage
          if (item.hp <= 0) {
            item.hp = 0
            item.isDead = true
            // 清除buff
            item = this.clearHeroState(item)
          }
          // 显示伤害动效
          eventBus.$emit('animateDamage', {
            targets: [index],
            value: poisonDamage,
            sound: 'poison',
            image: 'effdampoison'
          })
          system.msg = [`${index + 1}号单位受到了${poisonDamage}点毒药伤害`, ...system.msg]
        }
      }
      // 判断MS死亡情况
      if (item.type === 'MS' && item.isDead) {
        if (index < 5) {
          upMSDead = true
        } else {
          downMSDead = true
        }
      }
      // 判断树形态
      if (item.flagTree) {
        if (delayCauses.indexOf('tree') === -1) {
          delayCauses.push('tree')
        }
        if (index < 5) {
          upTreeAlive = true
        } else {
          downTreeAlive = true
        }
      }
      // 执行YD藤蔓
      if (item.flagBind && diceUtil.rollDice(2) === 2) {
        if (delayCauses.indexOf('bind') === -1) {
          delayCauses.push('bind')
        }
        item.hp -= config.bindDamage
        if (item.hp <= 0) {
          item.hp = 0
          item.isDead = true
          // 清除buff
          item = this.clearHeroState(item)
        }
        setTimeout(() => {
          // 显示伤害动效
          eventBus.$emit('animateDamage', {
            targets: [index],
            value: config.bindDamage,
            sound: 'bind',
            image: 'effdamtree'
          })
        }, config.animationTime * (delayCauses.length - 1))
        system.msg = [`致命藤蔓对${index + 1}号单位造成${config.bindDamage}点自然伤害`, ...system.msg]
      }
      // 判断YD死亡情况
      if (item.type === 'YD' && item.isDead) {
        if (index < 5) {
          upYDDead = true
        } else {
          downYDDead = true
        }
      }
      return item
    })

    hero.units = hero.units.map((item, index) => {
      if (item.isOpen && item.type && !item.isDead) {
        // 清除ms强化效果
        if ((index < 5 && upMSDead) || (index > 4 && downMSDead)) {
          item.flagEnhance = false
          item.maxhp -= config.enhancePlusHp
          if (item.hp > item.maxhp) {
            item.hp = item.maxhp
          }
        }
        // 结算树回复效果
        if ((index < 5 && upTreeAlive) || (index > 4 && downTreeAlive)) {
          item.hp += config.treeHealAmount
          if (item.hp > item.maxhp) {
            item.hp = item.maxhp
          }
          setTimeout(() => {
            eventBus.$emit('animateHeal', {
              targets: [index],
              value: config.treeHealAmount
            })
          }, config.animationTime * (delayCauses.length - 1))
        }
        // 清除YD藤蔓
        if (item.flagBind && ((index < 5 && downYDDead) || (index > 4 && upYDDead))) {
          item.flagBind = false
        }
      }
      return item
    })

    // 返回造成延迟的因素个数，用于其他后续流程延迟播放
    return delayCauses.length
  },
  // 检查胜利
  checkWin () {
    let isUpsideWin = true
    let isDownsideWin = true
    hero.units.forEach((item, index) => {
      if (index < 5) {
        // 检查上方
        if (item.isOpen && item.type && !item.isDead) {
          isDownsideWin = false
        }
      } else if (index < 10) {
        // 检查下方
        if (item.isOpen && item.type && !item.isDead) {
          isUpsideWin = false
        }
      }
    })

    if (isUpsideWin && isDownsideWin) {
      // 罕见的同归于尽结局...
      system.msg = [`平局未分胜负`, ...system.msg]
      window.alert(`平局未分胜负`)
    } else if (isUpsideWin) {
      // 上方胜利
      eventBus.$emit('playSound', {
        sound: 'win'
      })
      system.msg = [`上方获得了最终的胜利！`, ...system.msg]
      window.alert(`上方获得了最终的胜利！`)
    } else if (isDownsideWin) {
      // 下方胜利
      eventBus.$emit('playSound', {
        sound: 'win'
      })
      system.msg = [`下方获得了最终的胜利！`, ...system.msg]
      window.alert(`下方获得了最终的胜利！`)
    } else {
      // 还未结束
    }
    return isUpsideWin || isDownsideWin
  },
  reset () {
    system.step = 0
    system.firstHand = ''
    system.turn = ''
    system.turns = 0
    system.unitIndex = -1
    system.msg = []
    hero.units = []
    for (let i = 0; i < 10; i++) {
      hero.units.push({
        isOpen: false, // 是否启用slot，是否有激活的英雄
        isActed: false, // 当前回合是否已经使用过行动
        isDead: false, // 角色是否处于已死亡状态
        type: '', // ZS/LR/SM/WS/DZ/FS/XD/DK/QS/MS/SR - 吟游诗人/PC - 破城者/JB - 酒保/YD - 园丁/YX - 夜行者/TF - 屠夫/MO - 木偶
        url: '', // 头像url
        maxhp: 0,
        hp: 0,
        maxsp: 0,
        sp: 0,
        speed: 0,
        flagAnger: false, // 是否激怒
        iceblock: 0, // 寒冰屏障剩余层数
        flagEnhance: false, // 是否激活了ms提供的强化
        flagTiger: false, // 是否激活了虎形态
        flagBear: false, // 是否激活了熊形态
        flagTree: false, // 是否激活了树形态
        yy: 0, // 英勇效果剩余层数
        flagTaunt: false, // 是否激活了护盾状态（只能优先被指定攻击）
        flagEarth: false, // 是否激活了大地之力
        flagFaint: false, // 是否激活了眩晕
        flagSlow: false, // 是否激活了减速
        lockOn: 0, // 锁定状态剩余层数
        poison: 0, // 中毒状态剩余层数
        confuse: 0, // 蛊惑状态剩余层数
        flagBind: false, // 是否激活了捆绑
        flagDrunk: false, // 是否激活了醉酒
        directDamageTotal: 0, // 累计直接伤害
        skillDamageTotal: 0, // 累计技能伤害
        damageTotal: 0, // 累计总伤害
        actRounds: 0 // 行动回合
      })
    }
  },
  clearHeroState (unit) {
    unit.flagAnger = false
    unit.iceblock = 0
    unit.flagEnhance = false
    unit.flagTiger = false
    unit.flagBear = false
    unit.flagTree = false
    unit.yy = 0
    unit.flagTaunt = false
    unit.flagEarth = false
    unit.flagFaint = false
    unit.flagSlow = false
    unit.lockOn = 0
    unit.poison = 0
    unit.confuse = 0
    unit.flagBind = false
    unit.flagDrunk = false
    return unit
  }
}
