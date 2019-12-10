<template>
  <section class="bed-choose-target" v-show="isShow">
    <div class="bg-layer"></div>
    <div class="box-main" :class="{ 'selected': selectedTarget.indexOf(index) > -1, 'highlight': item.flagTaunt }" v-show="item.isTarget && item.isOpen && item.type" v-for="(item, index) in targets" :key="index" :style="position(index)" @click="handleTargetSelect(index)">
      <img :src="item.url" class="covered-avatar">
      <div class="box-info">
        <!-- 顶部名称及标记 -->
        <div class="head">
          <font-awesome-icon class="hp" icon="heart" />
          <div class="name"><span v-show="selectedTarget.indexOf(index) > -1"><font-awesome-icon icon="check-circle" /></span><span v-show="item.flagTaunt"><font-awesome-icon icon="shield-alt" /></span>目标{{ index + 1 }}<span v-if="!item.isDead && item.isActed">[已行动]</span><span v-if="item.isDead">[已死亡]</span></div>
          <font-awesome-icon class="sp" icon="bolt" />
        </div>
        <!-- 条信息 -->
        <div class="box-bars">
          <div class="box-bar">
            <bar :value="item.hp" :max="item.maxhp" :height="20" :color="'#558c08'"></bar>
          </div>
          <div class="box-bar">
            <bar :value="item.sp" :max="item.maxsp" :height="20" :color="'#ddd71b'"></bar>
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
              <img class="icon" v-show="item.flagBind" src="../assets/img/bind.png" title="致命藤蔓(受到持续自然伤害)">
            </div>
          </div>
        </div>
        <!-- death cover -->
        <div class="cover-invalid" v-show="item.isDead"></div>
      </div>
    </div>

    <!-- 上方source说明 -->
    <div class="box-side-info" v-show="sourceSide === 'up'" style="top: 0;">
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
        已选择 {{ selectedTarget.length }} 个目标
      </div>
      <div class="right-box">
        <span class="tip">
          限定 {{ skillTargets }} 目标
        </span>
        <el-button type="primary" size="small" @click="confirm" style="width: 100px;">确 定</el-button>
      </div>
    </div>

    <!-- 下方source说明 -->
    <div class="box-side-info" v-show="sourceSide === 'down'" style="bottom: 0;">
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
        已选择 {{ selectedTarget.length }} 个目标
      </div>
      <div class="right-box">
        <span class="tip">
          限定 {{ skillTargets }} 目标
        </span>
        <el-button type="primary" size="small" @click="confirm" style="width: 100px;">确 定</el-button>
      </div>
    </div>
  </section>
</template>

<script>
import eventBus from '@/eventBus'
import system from '@/models/system'
import hero from '@/models/hero'
// import heroDict from '@/models/heroDict'
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
      units: hero.units
    }
  },
  computed: {
    // 技能来源单位所处的方位
    sourceSide () {
      if (this.system.unitIndex >= 5) {
        return 'down'
      } else {
        return 'up'
      }
    },
    sourceUnit () {
      let result = this.units.find((item, index) => {
        return index === this.system.unitIndex
      })
      if (result) {
        return result
      } else {
        return {
          url: '',
          type: ''
        }
      }
    },
    targets () {
      let result = this.units.map((item, index) => {
        if (this.system.unitIndex >= 5) {
          // 下方source
          if (index < 5) {
            item.isTarget = true
          } else {
            item.isTarget = false
          }
        } else {
          // 上方source
          if (index >= 5) {
            item.isTarget = true
          } else {
            item.isTarget = false
          }
        }
        return item
      })
      return result
    }
  },

  mounted () {
    this.units = hero.units
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
      if (['LR1', 'SM1', 'FS1', 'XD1', 'XD2', 'XD3', 'QS1', 'QS2', 'MS1', 'SR2', 'C2', 'C4', 'C6', 'C8', 'C10', 'C12', 'C17', 'C19', 'C21', 'C23', 'C25', 'C26', 'C27', 'C29', 'C31', 'C33', 'C35', 'C37'].indexOf(this.skillId) > -1) {
        // LR箭雨,SM英勇,FS寒冰屏障,XD变形虎,XD变形熊，XD变形树，QS生而平等，QS圣疗，MS治疗，SR蛊惑，ZS守备,LR守备,SM守备,WS守备,DZ守备,FS守备，XD守备，DK守备，QS守备，MS守备，SR守备，PC普攻，PC守备，JB守备，YD守备，YX守备，TF守备，MO守备
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
  .bed-choose-target {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 4000;
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
        border: 4px solid rgb(235, 52, 28);
        background: #fff;
        box-shadow: 1px 1px 12px 4px rgba(205, 238, 15, 0.6);
        transform: scale(1);
      }
      .covered-avatar {
        width: 100%;
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
          font-size: 16px;
          .hp {
            color: #62a108;
          }
          .name {
            font-weight: bold;
          }
          .sp {
            color: #ddd71b;
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
    .highlight {
      border: 4px solid rgb(37, 92, 209);
    }
    .selected {
      border: 4px solid rgb(235, 52, 28);
      background: #fff;
      box-shadow: 1px 1px 12px 4px rgba(205, 238, 15, 0.6);
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
        color: red;
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
          color: rgb(236, 31, 31);
          // background: #62a108;
          font-size: 12px;
        }
      }
    }
  }
</style>
