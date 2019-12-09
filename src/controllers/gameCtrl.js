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
import diceUtil from '../utils/diceUtil'

export default {
  // 设置角色数据
  setUnitData () {
    let isMSUpside = hero.units.some((item, index) => {
      return index < 5 && item.type === 'MS'
    })
    let isMSDownside = hero.units.some((item, index) => {
      return index >= 5 && index < 10 && item.type === 'MS'
    })
    let isSMUpside = hero.units.some((item, index) => {
      return index < 5 && item.type === 'SM'
    })
    let isSMDownside = hero.units.some((item, index) => {
      return index >= 5 && index < 10 && item.type === 'SM'
    })
    let isYDUpside = hero.units.some((item, index) => {
      return index < 5 && item.type === 'YD'
    })
    let isYDDownside = hero.units.some((item, index) => {
      return index >= 5 && index < 10 && item.type === 'YD'
    })
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
        item.sp = 0
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
        item.poison = 0
        item.confuse = 0
        item.flagBind = false
        item.flagDrunk = false
        if (index < 5) {
          // 上方
          if (isMSUpside) {
            item.maxhp += 3
            item.hp += 3
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
            item.maxhp += 3
            item.hp += 3
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
      copy.maxhp = 10
      copy.maxhp += 15 * downsideHeroCount - 5 * upsideHeroCount
      copy.hp = copy.maxhp
      hero.units.splice(upsideMOIndex, 1, copy)
    }
    if (downsideMOIndex !== '') {
      let copy = hero.units[downsideMOIndex]
      copy.maxhp = 10
      copy.maxhp += 15 * upsideHeroCount - 5 * downsideHeroCount
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
      this.runBuffs()
      system.turn = system.firstHand

      // eventBus.$emit('playSound', {
      //   sound: 'reset'
      // })
      system.msg = ['所有单位已重置！', ...system.msg]
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
      case 'ZS1': // 冲锋
        eventBus.$emit('playSound', {
          sound: 'charge'
        })
        setTimeout(() => {
          ZSCtrl.charge(skillId, targets)
        }, 1000)
        break
      case 'C3': // LR普攻
        eventBus.$emit('playSound', {
          sound: 'castmultishot'
        })
        setTimeout(() => {
          LRCtrl.atk(targets)
        }, 1000)
        break
      case 'LR1': // LR箭雨
        eventBus.$emit('playSound', {
          sound: 'castmultishot'
        })
        setTimeout(() => {
          LRCtrl.rain(skillId)
        }, 1000)
        break
      case 'LR2': // LR奥术射击
        eventBus.$emit('playSound', {
          sound: 'castmultishot'
        })
        setTimeout(() => {
          LRCtrl.magicShoot(skillId, targets)
        }, 1000)
        break
      case 'C5': // SM普攻
        SMCtrl.atk(targets)
        break
      case 'SM1': // SM英勇
        SMCtrl.brave(skillId)
        break
      case 'C7': // WS普攻
        WSCtrl.atk(targets)
        break
      case 'WS1': // WS死亡一指
        WSCtrl.deathFinger(skillId, targets)
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
      case 'C2': // ZS守备
      case 'C4': // LR守备
      case 'C6': // SM守备
      case 'C8': // WS守备
      case 'C10': // DZ守备
      case 'C12': // FS守备
      case 'C17': // XD守备
      case 'C19': // DK守备
        commonCtrl.guard()
        break
      default:
        // TODO 补全技能
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
  gainSp (delayCausesLength) {
    hero.units = hero.units.map((item, index) => {
      if (item.isOpen && item.type && !item.isDead) {
        // 存活的有效单位，每回合2/5的概率获得2 sp
        if (diceUtil.rollDice(5) > 3) {
          item.sp += 2
          if (item.sp > item.maxsp) {
            item.sp = item.maxsp
          }
          setTimeout(() => {
            eventBus.$emit('animateSpRecover', {
              targets: [index],
              value: 2
            })
          }, 1500 * delayCausesLength)
        }
      }
      return item
    })
  },
  // 结算回合结束时的技能，buff等
  runBuffs () {
    let delayCauses = []
    hero.units = hero.units.map((item, index) => {
      if (item.isOpen && item.type && !item.isDead) {
        // 有效单位
        // let tc = ''
        // 清除眩晕
        item.flagFaint = false
        // 清除减速
        if (item.flagSlow) {
          item.speed += config.magicShotMinusSpeed
          item.flagSlow = false
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
      // //清除ms强化效果
      // if (data.unit[i].cat == 10 && data.unit[i].hp == 0) {
      //   for (j = 0; j < 10; j++) {
      //     if (data.unit[j].enhanceflag == true && data.unit[j].hp > 0) {
      //       data.unit[j].enhanceflag = false;
      //       data.unit[j].hp -= 3;
      //       data.unit[j].hp < 1 ? data.unit[j].hp = 1 : data.unit[j].hp;
      //     };
      //   };
      //   $("div.history-content").prepend("<p class='history-item'>强化效果消失</p>");
      // };
      // //树形态回血
      // if (data.unit[i].treeflag == true && data.unit[i].hp > 0) {
      //   var x;
      //   i > 4 ? x = 5 : x = 0;
      //   for (j = 0; j < 5; j++) {
      //     if (data.unit[j + x].hp > 0) {
      //       data.unit[j + x].hp++;
      //       data.unit[j + x].hp > data.unit[j + x].maxhp ? data.unit[j + x].hp = data.unit[j + x].maxhp : data.unit[j + x].hp;
      //       // painter.makeHeal(j+x, 1, "static/audio/heal.wav");
      //     };
      //   };
      //   $("div.history-content").prepend("<p class='history-item'>德鲁伊树形态为所有队友回复了生命值</p>");
      // };
      // //清除蛊惑效果
      // data.unit[i].confuse > 0 ? data.unit[i].confuse-- : data.unit[i].confuse;
      // //清除醉酒效果
      // data.unit[i].drunkflag == true && controller.rollDice(5) == 5 ? data.unit[i].drunkflag = false : data.unit[i].drunkflag;
      // //清除园丁 致命藤蔓
      // if (data.unit[i].cat == 14 && data.unit[i].hp == 0) {
      //   for (j = 0; j < 10; j++) {
      //     data.unit[j].bindflag = false;
      //   };
      //   $("div.history-content").prepend("<p class='history-item'>致命藤蔓效果消失了</p>");
      // };
      return item
    })

    // //执行 致命藤蔓
    // for (i = 0; i < 10; i++) {
    //   if (data.unit[i].bindflag == true && data.unit[i].hp > 0) {
    //     if (controller.rollDice(2) == 2) {
    //       data.unit[i].hp -= 2;
    //       data.unit[i].hp < 0 ? data.unit[i].hp = 0 : data.unit[i].hp;
    //       var t = setTimeout('painter.makeAttack(' + i + ', 2, "static/audio/bind.wav", "static/img/effdamtree.png");', 100);
    //       $("div.history-content").prepend("<p class='history-item'>致命藤蔓对" + (i + 1) + "号单位造成2点自然伤害</p>");
    //     };
    //   };
    // };

    // //清除寒冰屏障
    // if (controller.ibNum > 0) {
    //   controller.ibNum++;
    //   if (controller.ibNum > 3) {
    //     controller.ibNum = 0;
    //     for (i = 0; i < 10; i++) {
    //       data.unit[i].iceblockflag = false;
    //     };
    //     $("div.history-content").prepend("<p class='history-item'>寒冰屏障效果消失了</p>");
    //   };
    // };

    this.gainSp(delayCauses.length)
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
      system.msg = [`上方获得了最终的胜利！`, ...system.msg]
      window.alert(`上方获得了最终的胜利！`)
    } else if (isDownsideWin) {
      // 下方胜利
      system.msg = [`下方获得了最终的胜利！`, ...system.msg]
      window.alert(`下方获得了最终的胜利！`)
    } else {
      // 还未结束
    }
    return isUpsideWin || isDownsideWin
  }
}
