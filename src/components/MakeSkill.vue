<template>
  <section class="bed-make-skill" v-show="isShow">
    <div class="bg-layer"></div>
    <div class="box-main" :class="{ 'box-main-active': isShow && animateFlag }" :style="position">
      <img :src="avatarUrl" class="covered-avatar">
      <div class="box-info">
        <!-- 顶部名称及标记 -->
        <div class="head">
          <font-awesome-icon class="hp" icon="heart" />
          <div class="name">{{ heroCnName }}</div>
          <font-awesome-icon class="sp" icon="bolt" />
        </div>
        <!-- 条信息 -->
        <div class="box-bars">
          <div class="box-bar">
            <bar :value="hp" :max="maxhp" :height="20" :color="config.healthColor"></bar>
          </div>
          <div class="box-bar">
            <bar :value="sp" :max="maxsp" :height="20" :color="config.skillColor"></bar>
          </div>
        </div>
        <!-- 技能信息 -->
        <div class="box-skills">
          <div class="common-skills">
            <div class="label">
              通用
            </div>
            <div class="skills">
              <img class="icon-skill" v-for="item in commonSkills" :src="item.url" :alt="item.cnName" :key="item.id" @mouseover="handleSkillMouseover($event, item)" @mouseout="handleSkillMouseout" @click="handleSkillCast(item)">
            </div>
          </div>
          <div class="positive-skills">
            <div class="label">
              主动
            </div>
            <div class="skills">
              <img class="icon-skill" :class="[sp < item.spCost && 'disabled']" v-for="item in positiveSkills" :src="item.url" :alt="item.cnName" :key="item.id" @mouseover="handleSkillMouseover($event, item)" @mouseout="handleSkillMouseout" @click="handleSkillCast(item)">
            </div>
          </div>
          <div class="negative-skills">
            <div class="label">
              被动
            </div>
            <div class="skills">
              <img class="icon-skill" v-for="item in negativeSkills" :src="item.url" :alt="item.cnName" :key="item.id" @mouseover="handleSkillMouseover($event, item)" @mouseout="handleSkillMouseout">
            </div>
          </div>
        </div>
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
import Bar from '@/components/Bar'

export default {
  name: 'makeSkill',
  data () {
    return {
      isShow: false,
      animateFlag: false, // 控制动效用
      slotIndex: 0, // 英雄所在位置索引0~9
      heroName: '', // 英雄ID
      heroCnName: '', // 英雄中文名称
      avatarUrl: '', // 英雄头像url
      hp: 0,
      maxhp: 0,
      sp: 0,
      maxsp: 0,
      commonSkills: [
        // {
        //   id: 'MO1',
        //   cat: 'N',
        //   type: 'BF',
        //   spCost: 0,
        //   targetLimit: 0,
        //   cnName: '小不点也有大作为',
        //   desc: ['有益效果', '无法驱散'],
        //   detail: '初始伤害固定为1，不进行攻击判定。你的伤害值会随着你的每次攻击而微量增加(1)',
        //   url: './img/skill_5_mo.png'
        // },
      ],
      positiveSkills: [],
      negativeSkills: [],
      config
    }
  },
  computed: {
    position () {
      let result = {}
      if (this.slotIndex >= 5) {
        // 处于下方
        result.bottom = '0px'
        result.left = 20 * (this.slotIndex - 5) + '%'
      } else {
        // 处于上方
        result.top = '0px'
        result.left = 20 * this.slotIndex + '%'
      }
      return result
    }
  },

  mounted () {
    eventBus.$on('makeSkill', () => {
      this.show()
    })
  },

  beforeDestroy () {
    eventBus.$off('makeSkill')
  },

  methods: {
    handleSkillCast (item) {
      if (this.sp < item.spCost) {
        this.$message({
          // title: '警告',
          type: 'warning',
          message: `SP值不足！`
        })
        return
      }
      eventBus.$emit('chooseTarget', {
        skillId: item.id
      })
      this.close()
    },
    handleSkillMouseover (event, item) {
      // console.log(event)
      let subTitle = [`需要 ${item.spCost} SP`]
      if (item.desc && item.desc.length) {
        subTitle = [...subTitle, ...item.desc]
      }
      eventBus.$emit('skillTooltip', {
        left: event.clientX + 5,
        top: event.clientY,
        title: item.cnName,
        subTitle,
        desc: item.detail
      })
    },
    handleSkillMouseout () {
      // console.log('out')
      eventBus.$emit('hideSkillTooltip')
    },
    show () {
      const index = system.unitIndex
      this.slotIndex = index
      this.heroName = hero.units[index].type
      this.maxhp = hero.units[index].maxhp
      this.hp = hero.units[index].hp
      this.maxsp = hero.units[index].maxsp
      this.sp = hero.units[index].sp
      let heroDetail = heroDict.list.find(item => {
        return item.name === this.heroName
      })
      this.heroCnName = heroDetail.cnName
      this.avatarUrl = heroDetail.url
      let commonSkillIds = heroDetail.commonSkills || []
      let positiveSkillIds = heroDetail.positiveSkills || []
      // 针对XD特殊的多技能，做特殊处理
      if (this.heroName === 'XD') {
        if (hero.units[index].flagTiger) {
          commonSkillIds = ['C14', 'C17']
        } else if (hero.units[index].flagBear) {
          commonSkillIds = ['C15', 'C17']
        } else if (hero.units[index].flagTree) {
          commonSkillIds = ['C16', 'C17']
        } else {
          commonSkillIds = ['C13', 'C17']
        }
      }
      let negativeSkillIds = heroDetail.negativeSkills || []
      if (commonSkillIds.length) {
        this.commonSkills = skillDict.list.filter(item => {
          return commonSkillIds.indexOf(item.id) > -1
        })
      } else {
        this.commonSkills = []
      }
      if (positiveSkillIds.length) {
        this.positiveSkills = skillDict.list.filter(item => {
          return positiveSkillIds.indexOf(item.id) > -1
        })
      } else {
        this.positiveSkills = []
      }
      if (negativeSkillIds.length) {
        this.negativeSkills = skillDict.list.filter(item => {
          return negativeSkillIds.indexOf(item.id) > -1
        })
      } else {
        this.negativeSkills = []
      }
      this.isShow = true
      setTimeout(() => {
        this.animateFlag = true
      }, 10)
    },
    close () {
      eventBus.$emit('hideSkillTooltip')
      this.animateFlag = false
      this.isShow = false
      this.heroName = ''
      this.heroCnName = ''
      this.avatarUrl = ''
      this.hp = 0
      this.maxhp = 0
      this.sp = 0
      this.maxsp = 0
      this.commonSkills = []
      this.positiveSkills = []
      this.negativeSkills = []
    }
  },

  components: {
    Bar
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/var.scss";

  .bed-make-skill {
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
      height: 260px;
      border: 4px solid rgba(0,0,0, 0);
      border-top-left-radius: 14px;
      border-bottom-right-radius: 14px;
      // border-radius: 14px;
      background: #fff;
      box-shadow: 1px 1px 8px rgba(0,0,0, .5);
      overflow: hidden;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.2s;
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
          font-size: 16px;
          .hp {
            color: $HEALTH-COLOR;
          }
          .name {
            font-weight: bold;
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
        .box-skills {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          height: 210px;
          .common-skills {
            display: flex;
            height: 64px;
            border: 2px solid rgba(53, 194, 18, 0.6);
            .label {
              margin-right: 4px;
              width: 14px;
              padding-top: 14px;
              color: #000;
              background: rgba(53, 194, 18, 0.6);
              font-size: 10px;
            }
            .skills {
              display: flex;
              align-items: center;
              overflow-x: auto;
              .icon-skill {
                margin: 0 4px;
                width: 40px;
                border-radius: 4px;
                cursor: pointer;
                &.disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
                }
              }
            }
          }
          .positive-skills {
            display: flex;
            height: 64px;
            border: 2px solid rgba(207, 224, 52, 0.6);
            .label {
              margin-right: 4px;
              width: 14px;
              padding-top: 14px;
              color: #000;
              background: rgba(207, 224, 52, 0.6);
              font-size: 10px;
            }
            .skills {
              display: flex;
              align-items: center;
              overflow-x: auto;
              .icon-skill {
                margin: 0 4px;
                width: 40px;
                border-radius: 4px;
                cursor: pointer;
                &.disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
                }
              }
            }
          }
          .negative-skills {
            display: flex;
            height: 40px;
            border: 2px solid rgba(123, 123, 123, 0.6);
            .label {
              margin-right: 4px;
              width: 14px;
              padding-top: 3px;
              color: #fff;
              background: rgba(123, 123, 123, 0.6);
              font-size: 10px;
            }
            .skills {
              display: flex;
              align-items: center;
              .icon-skill {
                margin: 0 4px;
                width: 30px;
                border-radius: 4px;
                &.disabled {
                  opacity: 0.6;
                  cursor: not-allowed;
                }
              }
            }
          }
        }
      }
    }
    .box-main-active {
      opacity: 1;
      transform: scale(1);
    }
  }
</style>
