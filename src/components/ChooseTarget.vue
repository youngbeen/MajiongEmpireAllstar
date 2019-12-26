<template>
  <section class="bed-choose-target" v-show="isShow">
    <div class="bg-layer"></div>
    <div class="box-main" :class="{ 'selected': selectedTarget.indexOf(index) > -1, 'highlight': item.flagTaunt }" v-show="item.isTarget" v-for="(item, index) in targets" :key="index" :style="position(index)" @click="handleTargetSelect(index)">
      <img :src="item.url" class="covered-avatar">
      <div class="box-info">
        <!-- 顶部名称及标记 -->
        <div class="head">
          <font-awesome-icon class="hp" icon="heart" />
          <div class="name"><font-awesome-icon icon="check-circle" v-show="selectedTarget.indexOf(index) > -1" /><font-awesome-icon class="taunt" icon="shield-alt" v-show="item.flagTaunt" />{{item.type | cnNameFix}}<font-awesome-icon icon="skull-crossbones" v-show="item.isDead" /><span v-if="!item.isDead && item.isActed">[已行动]</span><span v-if="item.isDead">[已死亡]</span></div>
          <font-awesome-icon class="sp" icon="bolt" />
        </div>
        <!-- 条信息 -->
        <div class="box-bars">
          <div class="box-bar">
            <bar :value="item.hp" :max="item.maxhp" :height="20" :color="config.healthColor"></bar>
          </div>
          <div class="box-bar">
            <bar :value="item.sp" :max="item.maxsp" :height="20" :color="config.skillColor"></bar>
          </div>
        </div>
        <!-- 技能信息 -->
        <div class="box-status">
          <div class="buffs">
            <div class="label">
              增益效果
            </div>
            <div class="content">
              <img class="icon" v-show="item.flagTaunt" src="../assets/img/taunt.png" title="嘲讽(必须优先攻击他)">
              <img class="icon" v-show="item.iceblock" src="../assets/img/iceblock.png" title="寒冰屏障(免疫直接伤害 / 无法驱散)">
              <img class="icon" v-show="item.flagAnger" src="../assets/img/anger.png" title="激怒(下次攻击必定暴击!)">
              <img class="icon" v-show="item.flagEnhance" src="../assets/img/enhance.png" title="强化(最大生命值提高)">
              <img class="icon" v-show="item.yy" src="../assets/img/yy.png" title="英勇(暂时提高全体生命值上限与速度)">
              <img class="icon" v-show="item.flagEarth" src="../assets/img/earth.png" title="大地之力(反伤)">
              <img class="icon" v-show="item.flagTiger" src="../assets/img/tiger.png" title="变形:虎形态(伤害提升)">
              <img class="icon" v-show="item.flagBear" src="../assets/img/bear.png" title="变形:熊形态(嘲讽，伤害减免)">
              <img class="icon" v-show="item.flagTree" src="../assets/img/tree.png" title="变形:树形态(全体回复)">
            </div>
          </div>
          <div class="debuffs">
            <div class="label">
              减益效果
            </div>
            <div class="content">
              <img class="icon" v-show="item.flagDrunk" src="../assets/img/drunk.png" title="醉酒(无法行动!)">
              <img class="icon" v-show="item.flagFaint" src="../assets/img/faint.png" title="眩晕(无法行动!)">
              <img class="icon" v-show="item.confuse" src="../assets/img/confuse.png" title="蛊惑">
              <img class="icon" v-show="item.poison" src="../assets/img/poison.png" title="中毒(受到持续自然伤害)">
              <img class="icon" v-show="item.flagSlow" src="../assets/img/slow.png" title="减速(行动迟缓)">
              <!-- TODO change icon -->
              <img class="icon" v-show="item.lockOn" src="../assets/img/slow.png" title="锁定(易伤)">
              <img class="icon" v-show="item.flagBind" src="../assets/img/bind.png" title="致命藤蔓(受到持续自然伤害)">
            </div>
          </div>
        </div>
        <!-- death cover -->
        <div class="cover-invalid" v-show="item.isDead"></div>
      </div>
    </div>

    <div class="btn-confirm" v-show="selectedTarget.length" :style="confirmStyle" @click="confirm()">{{ isTargetFriendly ? '🧚' : '⚔️' }}</div>

    <!-- source说明 -->
    <div class="box-side-info" :style="sideInfoStyle">
      <div class="box-unit">
        <img class="unit-avatar" :src="sourceUnit.url" :alt="sourceUnit.type">
      </div>
      <div class="tip-position">
        (位置{{ system.unitIndex + 1 }})
      </div>
      <div class="skill-info">
        <span>正在使用：</span>
        <img class="skill-image" :src="skillImg">
        <span class="skill-name">{{ skillName }}</span>
      </div>
      <div class="target-count">
        已选择 {{ selectedTarget.length }}/{{ skillTargets }} 个目标
      </div>
      <div class="right-box">
        <!-- <span class="tip">
          限定 {{ skillTargets }} 目标
        </span> -->
        <!-- <el-button type="primary" size="small" @click="confirm()" style="width: 100px;">确定</el-button> -->
      </div>
    </div>
  </section>
</template>

<script>
import eventBus from '@/eventBus'
import system from '@/models/system'
import config from '@/models/config'
import hero from '@/models/hero'
import heroDict from '@/models/heroDict'
import skillDict from '@/models/skillDict'
import gameCtrl from '@/controllers/gameCtrl'
import Bar from '@/components/Bar'

export default {
  name: 'chooseTarget',
  data () {
    return {
      isShow: false,
      skillId: '',
      skillTargets: 0,
      skillName: '',
      skillImg: '',
      selectedTarget: [], // 保存的是目标索引
      system,
      config,
      hero
    }
  },
  computed: {
    sourceUnit () {
      let result = this.hero.units.find((item, index) => index === this.system.unitIndex)
      if (result) {
        return result
      } else {
        return {
          url: '',
          type: ''
        }
      }
    },
    sideInfoStyle () {
      if (this.system.unitIndex >= 5) {
        if (this.isTargetFriendly) {
          return {
            top: '0'
          }
        } else {
          return {
            bottom: '0'
          }
        }
      } else {
        if (this.isTargetFriendly) {
          return {
            bottom: '0'
          }
        } else {
          return {
            top: '0'
          }
        }
      }
    },
    confirmStyle () {
      let top = ''
      if (this.system.unitIndex >= 5) {
        if (this.isTargetFriendly) {
          top = '30%'
        } else {
          top = '55%'
        }
      } else {
        if (this.isTargetFriendly) {
          top = '55%'
        } else {
          top = '30%'
        }
      }
      return {
        top
      }
    },
    isTargetFriendly () {
      return ['SM3', 'XD4', 'MS1', 'SR1'].includes(this.skillId)
    },
    targets () {
      if (this.skillId === 'DK1') {
        // NOTE DK的牺牲爪牙技能比较特殊，需要选取死亡的敌对目标
        let deads = this.hero.units.map((item, index) => {
          if (this.system.unitIndex >= 5) {
            // 下方source
            if (index < 5 && item.isOpen && item.isDead) {
              item.isTarget = true
            } else {
              item.isTarget = false
            }
          } else {
            // 上方source
            if (index >= 5 && item.isOpen && item.isDead) {
              item.isTarget = true
            } else {
              item.isTarget = false
            }
          }
          return item
        })
        return deads
      } else if (this.skillId === 'XD4') {
        // NOTE XD共生术比较特殊，需要选择除自己的友方目标
        let friends = this.hero.units.map((item, index) => {
          if (this.system.unitIndex >= 5) {
            // 下方source
            if (index >= 5 && item.isOpen && !item.isDead && index !== this.system.unitIndex) {
              item.isTarget = true
            } else {
              item.isTarget = false
            }
          } else {
            // 上方source
            if (index < 5 && item.isOpen && !item.isDead && index !== this.system.unitIndex) {
              item.isTarget = true
            } else {
              item.isTarget = false
            }
          }
          return item
        })
        return friends
      } else if (['SM3', 'MS1', 'SR1'].includes(this.skillId)) {
        // NOTE 比较特殊，需要选择友方目标
        let friends = this.hero.units.map((item, index) => {
          if (this.system.unitIndex >= 5) {
            // 下方source
            if (index >= 5 && item.isOpen && !item.isDead) {
              item.isTarget = true
            } else {
              item.isTarget = false
            }
          } else {
            // 上方source
            if (index < 5 && item.isOpen && !item.isDead) {
              item.isTarget = true
            } else {
              item.isTarget = false
            }
          }
          return item
        })
        return friends
      } else {
        // 正常情况
        let upTaunt = this.hero.units.some((item, index) => index < 5 && item.isOpen && !item.isDead && item.flagTaunt)
        let downTaunt = this.hero.units.some((item, index) => index >= 5 && item.isOpen && !item.isDead && item.flagTaunt)

        let result = this.hero.units.map((item, index) => {
          if (this.system.unitIndex >= 5) {
            // 下方source
            if (index < 5 && item.isOpen && !item.isDead) {
              if (upTaunt && item.flagTaunt) {
                item.isTarget = true
              } else if (!upTaunt) {
                item.isTarget = true
              } else {
                item.isTarget = false
              }
            } else {
              item.isTarget = false
            }
          } else {
            // 上方source
            if (index >= 5 && item.isOpen && !item.isDead) {
              if (downTaunt && item.flagTaunt) {
                item.isTarget = true
              } else if (!downTaunt) {
                item.isTarget = true
              } else {
                item.isTarget = false
              }
            } else {
              item.isTarget = false
            }
          }
          return item
        })
        return result
      }
    }
  },
  filters: {
    cnNameFix (val) {
      let target = heroDict.list.find(item => item.name === val)
      if (target) {
        return target.cnName
      } else {
        return val
      }
    }
  },

  mounted () {
    eventBus.$on('chooseTarget', (params) => {
      if (params && params.skillId) {
        this.show(params)
      }
    })
  },

  beforeDestroy () {
    eventBus.$off('chooseTarget')
  },

  methods: {
    confirm () {
      // console.log(this.selectedTarget)
      if (this.selectedTarget.length) {
        if (this.skillId === 'ZS1' && this.selectedTarget.length >= 2 && Math.abs(this.selectedTarget[0] - this.selectedTarget[1]) > 1) {
          // NOTE ZS的冲锋技能比较特殊，选择的2个目标必须是相邻单位
          this.$message({
            type: 'warning',
            message: '*冲锋*技能的目标必须是相邻单位！'
          })
          return
        }
        gameCtrl.proceedSkill(this.skillId, this.selectedTarget)
        this.close()
      }
    },
    handleTargetSelect (index) {
      if (index || index === 0) {
        let existIndex = this.selectedTarget.indexOf(index)
        if (existIndex > -1) {
          // 已有的目标，此时移除
          this.selectedTarget.splice(existIndex, 1)
        } else {
          // 未选择的目标，新增目标
          if (this.selectedTarget.length < this.skillTargets) {
            // 还可以再选择新目标
            this.selectedTarget.push(index)
          }
        }
      }
    },
    position (index) {
      let result = {}
      if (index >= 5) {
        // 处于下方
        result.bottom = '0px'
        result.left = 20 * (index - 5) + '%'
      } else {
        // 处于上方
        result.top = '0px'
        result.left = 20 * index + '%'
      }
      return result
    },
    show (params) {
      this.skillId = params.skillId || ''
      if (['ZS3', 'LR1', 'SM1', 'WS3', 'FS1', 'XD1', 'XD2', 'XD3', 'QS1', 'QS2', 'SR2', 'C2', 'C4', 'C6', 'C8', 'C10', 'C12', 'C17', 'C19', 'C21', 'C23', 'C25', 'C26', 'C27', 'C29', 'C31', 'C33', 'C35', 'C37'].indexOf(this.skillId) > -1) {
        // ZS旋风斩，LR箭雨,SM英勇,WS禅坐，FS寒冰屏障,XD变形虎,XD变形熊，XD变形树，QS生而平等，QS圣疗，MS治疗，SR蛊惑，ZS守备,LR守备,SM守备,WS守备,DZ守备,FS守备，XD守备，DK守备，QS守备，MS守备，SR守备，PC普攻，PC守备，JB守备，YD守备，YX守备，TF守备，MO守备
        // 处理不需要选择目标的技能
        gameCtrl.proceedSkill(this.skillId)
        this.close()
      } else {
        // 根据id匹配技能，获取信息
        let skillDetail = skillDict.list.find(item => {
          return item.id === this.skillId
        })
        this.skillTargets = skillDetail.targetLimit || 0
        this.skillName = skillDetail.cnName || ''
        this.skillImg = skillDetail.url || ''
        this.isShow = true
      }
    },
    close () {
      this.isShow = false
      this.skillId = ''
      this.skillTargets = 0
      this.skillName = ''
      this.skillImg = ''
      this.selectedTarget = []
    }
  },

  components: {
    Bar
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/var.scss";

  .bed-choose-target {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 40;
    .bg-layer {
      position: absolute;
      left: 0;
      top: 0;
      right: 0;
      bottom: 0;
      background: rgba(0,0,0, .4);
    }
    .box-main {
      position: absolute;
      // left: 0;
      // top: 0;
      width: 20%;
      height: 312px;
      border: 4px solid rgba(0,0,0, 0);
      border-top-left-radius: 14px;
      border-bottom-right-radius: 14px;
      // border-radius: 6px;
      // height: 280px;
      background: #fff;
      // box-shadow: 1px 1px 8px rgba(0,0,0, .5);
      overflow: hidden;
      user-select: none;
      transform: scale(0.9);
      transition: all 0.2s;
      &:hover {
        border: 4px solid $DANGER-COLOR;
        background: #fff;
        box-shadow: 1px 1px 12px 4px rgba(205, 238, 15, 0.6);
        transform: scale(1);
      }
      &.highlight {
        border: 4px solid $FOCUS-COLOR;
      }
      &.selected {
        border: 4px solid $DANGER-COLOR;
        background: #fff;
        box-shadow: 1px 1px 12px 4px rgba(205, 238, 15, 0.6);
        transform: scale(1);
      }
      .covered-avatar {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .box-info {
        position: absolute;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        padding: 4px;
        background: rgba(255, 255, 255, .6);
        .head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: $PRIMARY-TEXT-COLOR;
          font-size: 16px;
          .hp {
            color: $HEALTH-COLOR;
          }
          .name {
            font-weight: bold;
            .taunt {
              color: $FOCUS-COLOR;
            }
          }
          .sp {
            color: $SKILL-COLOR;
          }
        }
        .box-bars {
          display: flex;
          .box-bar {
            width: 50%;
          }
        }
        .box-status {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 250px;
          .buffs {
            display: flex;
            height: 120px;
            border: 2px solid rgba(53, 194, 18, 0.6);
            .label {
              margin-right: 4px;
              width: 14px;
              padding-top: 26px;
              color: #000;
              background: rgba(53, 194, 18, 0.6);
              font-size: 10px;
            }
            .content {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              .icon {
                margin: 4px;
                width: 32px;
                height: 32px;
                border-radius: 4px;
              }
            }
          }
          .debuffs {
            display: flex;
            height: 120px;
            border: 2px solid rgba(216, 69, 32, 0.6);
            .label {
              margin-right: 4px;
              width: 14px;
              padding-top: 26px;
              color: #000;
              background: rgba(216, 69, 32, 0.6);
              font-size: 10px;
            }
            .content {
              display: flex;
              flex-wrap: wrap;
              align-items: center;
              .icon {
                margin: 4px;
                width: 32px;
                height: 32px;
                border-radius: 4px;
              }
            }
          }
        }
        .cover-invalid {
          position: absolute;
          left: 0;
          top: 0;
          right: 0;
          bottom: 0;
          background: rgba(51, 51, 51, .6);
        }
      }
    }
    .btn-confirm {
      position: absolute;
      left: 47%;
      // top: 45%;
      font-size: 60px;
      cursor: pointer;
      animation: 1s linear infinite heartbeat;
      &:hover {
        animation: none;
      }
    }
    .box-side-info {
      display: flex;
      align-items: center;
      position: absolute;
      left: 0;
      width: 100%;
      height: 60px;
      background: #fff;
      .box-unit {
        // display: inline-block;
        height: 100%;
        .unit-avatar {
          height: 100%;
        }
      }
      .tip-position {
        padding: 0 4px;
        color: #919191;
        font-size: 10px;
      }
      .target-count {
        margin-left: 20px;
        color: $DANGER-COLOR;
        font-size: 14px;
      }
      .skill-info {
        display: flex;
        align-items: center;
        margin-left: 10px;
        font-size: 14px;
        .skill-image {
          margin-right: 4px;
          width: 20px;
          height: 20px;
          border-radius: 4px;
        }
        .skill-name {
          font-weight: bold;
        }
      }
      .right-box {
        position: absolute;
        right: 0;
        top: 0;
        height: 60px;
        padding: 0 10px;
        .tip {
          padding: 0 10px;
          line-height: 60px;
          color: $DANGER-COLOR;
          font-size: 12px;
        }
      }
    }
  }
  @keyframes heartbeat {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.5);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
