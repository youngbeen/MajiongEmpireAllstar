<template>
  <section class="bed-battle-field">
    <div class="box-upside" style="margin-bottom: 50px;">
      <div class="box-hero" v-for="(item, index) in upHeros" :key="index">
        <!-- 顶部特殊状态栏 -->
        <div class="head-states">
          <!-- 显示iceblock图标 -->
          <div class="buff-icon" v-show="item.iceblock">
            <img class="buff-icontext" src="../assets/img/iceblock.png" title="寒冰屏障(免疫直接伤害 / 无法驱散)" />
            <p class="buff-num" title="寒冰屏障(免疫直接伤害 / 无法驱散)">{{ item.iceblock }}</p>
          </div>
          <!-- 显示taunt图标 -->
          <img class="buff-icon" v-show="item.flagTaunt" src="../assets/img/taunt.png" title="嘲讽(必须优先攻击他)" />
          <!-- 显示anger图标 -->
          <img class="buff-icon" v-show="item.flagAnger" src="../assets/img/anger.png" title="激怒(下次攻击必定暴击!)" />
        </div>
        <!-- 主区域 -->
        <div class="main">
          <!-- 左侧buff栏 -->
          <div class="box-buffs">
            <!-- 显示enhance -->
            <img class="buff-icon" v-show="item.flagEnhance" src="../assets/img/enhance.png" title="强化(最大生命值提高)" />
            <!-- 显示YY -->
            <div class="buff-icon" v-show="item.yy">
              <img class="buff-icontext" src="../assets/img/yy.png" title="英勇(暂时提高全体生命值上限与速度)" />
              <p class="buff-num" title="英勇(暂时提高全体生命值上限与速度)">{{ item.yy }}</p>
            </div>
            <!-- 显示earth -->
            <img class="buff-icon" v-show="item.flagEarth" src="../assets/img/earth.png" title="大地之力(反伤)" />
            <!-- 显示tiger -->
            <img class="buff-icon" v-show="item.flagTiger" src="../assets/img/tiger.png" title="变形:虎形态(伤害提升)" />
            <!-- 显示bear -->
            <img class="buff-icon" v-show="item.flagBear" src="../assets/img/bear.png" title="变形:熊形态(嘲讽，伤害减免)" />
            <!-- 显示tree -->
            <img class="buff-icon" v-show="item.flagTree" src="../assets/img/tree.png" title="变形:树形态(全体回复)" />
          </div>
          <!-- 显示栏 -->
          <div class="box-unit">
            <!-- 显示背景 -->
            <img class="unit-bg" v-show="item.yy" src="../assets/img/bgyy.png" />
            <img class="unit-bg" v-show="item.flagAnger" src="../assets/img/bganger.png" />
            <img class="unit-bg" v-show="item.flagEnhance" src="../assets/img/bgenhance.png" />
            <img class="unit-bg" v-show="item.flagTaunt" src="../assets/img/bgtaunt.png" />
            <img class="unit-bg" v-show="item.flagTree" src="../assets/img/bgtree.png" />
            <!-- 显示本体 -->
            <img class="unit-avatar" :class="[system.step === 0 && 'enable']" v-show="!item.type" src="../assets/img/nounit.png" @click="chooseHero(index, 'up')" />
            <img class="unit-avatar" :class="[system.step === 0 && 'enable', damageFloating[index] && 'floating-up']" v-show="item.type" :src="item.url" @click="chooseHero(index, 'up')" />
            <!-- 显示其他覆盖状态 -->
            <!-- 显示ICEBLOCK -->
            <img class="unit-cover" v-show="item.iceblock" src="../assets/img/bgiceblock.png" style="opacity: 0.65;" />
            <!-- 显示已行动，死亡 -->
            <p class="unit-cover acted-cover" v-show="!item.isDead && item.isActed">- 已行动 -</p>
            <p class="unit-cover death-cover" v-show="item.isDead">- 死 亡 -</p>
            <!-- 显示伤害效果 -->
            <img class="cover-effect" v-show="animates[index].isShowEffect" :src="animates[index].effectUrl" />
            <!-- 显示扣血/治疗效果 -->
            <p class="unit-cover cover-effect-hpminus" :class="{ 'cover-heal': animates[index].textType === 'heal', 'cover-sp-recover': animates[index].textType === 'sp', 'active': animates[index].isTextAnimateStart }" v-show="animates[index].isShowText">{{ animates[index].textType === 'damage' ? '-' : '+' }}{{ animates[index].textValue }}</p>
          </div>
          <!-- 右侧debuff栏 -->
          <div class="box-debuffs">
            <!-- 显示drunk -->
            <img class="buff-icon" v-show="item.flagDrunk" src="../assets/img/drunk.png" title="醉酒(无法行动!)" />
            <!-- 显示faint -->
            <img class="buff-icon" v-show="item.flagFaint" src="../assets/img/faint.png" title="眩晕(无法行动!)" />
            <!-- 显示confuse -->
            <div class="buff-icon" v-show="item.confuse">
              <img class="buff-icontext" src="../assets/img/confuse.png" title="蛊惑" />
              <p class="buff-num" title="蛊惑">{{ item.confuse }}</p>
            </div>
            <!-- 显示poison -->
            <div class="buff-icon" v-show="item.poison">
              <img class="buff-icontext" src="../assets/img/poison.png" title="中毒(受到持续自然伤害)" />
              <p class="buff-num" title="中毒(受到持续自然伤害)">{{ item.poison }}</p>
            </div>
            <!-- 显示slow -->
            <img class="buff-icon" v-show="item.flagSlow" src="../assets/img/slow.png" title="减速(行动迟缓)" />
            <!-- TODO change icon 显示锁定 -->
            <div class="buff-icon" v-show="item.lockOn">
              <img class="buff-icontext" src="../assets/img/poison.png" title="锁定(易伤)" />
              <p class="buff-num" title="锁定(易伤)">{{ item.lockOn }}</p>
            </div>
            <!-- 显示bind -->
            <img class="buff-icon" v-show="item.flagBind" src="../assets/img/bind.png" title="致命藤蔓(受到持续自然伤害)" />
          </div>
        </div>
        <!-- 底部信息栏 -->
        <div class="foot-states">
          <div class="box-hp" v-show="item.isOpen">
            <div class="box-text">
              <font-awesome-icon icon="heart" />
            </div>
            <div class="box-bar">
              <bar :value="item.hp" :max="item.maxhp" :height="20" :color="config.healthColor"></bar>
            </div>
          </div>
          <div class="box-sp" v-show="item.isOpen">
            <div class="box-text">
              <font-awesome-icon icon="bolt" />
            </div>
            <div class="box-bar">
              <bar :value="item.sp" :max="item.maxsp" :height="20" :color="config.skillColor"></bar>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="box-downside">
      <div class="box-hero" v-for="(item, index) in downHeros" :key="index">
        <!-- 顶部特殊状态栏 -->
        <div class="head-states">
          <!-- 显示iceblock图标 -->
          <div class="buff-icon" v-show="item.iceblock">
            <img class="buff-icontext" src="../assets/img/iceblock.png" title="寒冰屏障(免疫直接伤害 / 无法驱散)" />
            <p class="buff-num" title="寒冰屏障(免疫直接伤害 / 无法驱散)">{{ item.iceblock }}</p>
          </div>
          <!-- 显示taunt图标 -->
          <img class="buff-icon" v-show="item.flagTaunt" src="../assets/img/taunt.png" title="嘲讽(必须优先攻击他)" />
          <!-- 显示anger图标 -->
          <img class="buff-icon" v-show="item.flagAnger" src="../assets/img/anger.png" title="激怒(下次攻击必定暴击!)" />
        </div>
        <!-- 主区域 -->
        <div class="main">
          <!-- 左侧buff栏 -->
          <div class="box-buffs">
            <!-- 显示enhance -->
            <img class="buff-icon" v-show="item.flagEnhance" src="../assets/img/enhance.png" title="强化(最大生命值提高)" />
            <!-- 显示YY -->
            <div class="buff-icon" v-show="item.yy">
              <img class="buff-icontext" src="../assets/img/yy.png" title="英勇(暂时提高全体生命值上限与速度)" />
              <p class="buff-num" title="英勇(暂时提高全体生命值上限与速度)">{{ item.yy }}</p>
            </div>
            <!-- 显示earth -->
            <img class="buff-icon" v-show="item.flagEarth" src="../assets/img/earth.png" title="大地之力(反伤)" />
            <!-- 显示tiger -->
            <img class="buff-icon" v-show="item.flagTiger" src="../assets/img/tiger.png" title="变形:虎形态(伤害提升)" />
            <!-- 显示bear -->
            <img class="buff-icon" v-show="item.flagBear" src="../assets/img/bear.png" title="变形:熊形态(嘲讽，伤害减免)" />
            <!-- 显示tree -->
            <img class="buff-icon" v-show="item.flagTree" src="../assets/img/tree.png" title="变形:树形态(全体回复)" />
          </div>
          <!-- 显示栏 -->
          <div class="box-unit">
            <!-- 显示背景 -->
            <img class="unit-bg" v-show="item.yy" src="../assets/img/bgyy.png" />
            <img class="unit-bg" v-show="item.flagAnger" src="../assets/img/bganger.png" />
            <img class="unit-bg" v-show="item.flagEnhance" src="../assets/img/bgenhance.png" />
            <img class="unit-bg" v-show="item.flagTaunt" src="../assets/img/bgtaunt.png" />
            <img class="unit-bg" v-show="item.flagTree" src="../assets/img/bgtree.png" />
            <!-- 显示本体 -->
            <img class="unit-avatar" :class="[system.step === 0 && 'enable']" v-show="!item.type" src="../assets/img/nounit.png" @click="chooseHero(index, 'down')" />
            <img class="unit-avatar" :class="[system.step === 0 && 'enable', damageFloating[index + 5] && 'floating-down']" v-show="item.type" :src="item.url" @click="chooseHero(index, 'down')" />
            <!-- 显示其他覆盖状态 -->
            <!-- 显示ICEBLOCK -->
            <img class="unit-cover" v-show="item.iceblock" src="../assets/img/bgiceblock.png" style="opacity: 0.65;" />
            <!-- 显示已行动，死亡 -->
            <p class="unit-cover acted-cover" v-show="!item.isDead && item.isActed">- 已行动 -</p>
            <p class="unit-cover death-cover" v-show="item.isDead">- 死 亡 -</p>
            <!-- 显示伤害效果 -->
            <img class="cover-effect" v-show="animates[index + 5].isShowEffect" :src="animates[index + 5].effectUrl" />
            <!-- 显示扣血效果 -->
            <p class="unit-cover cover-effect-hpminus" :class="{ 'cover-heal': animates[index + 5].textType === 'heal', 'cover-sp-recover': animates[index + 5].textType === 'sp', 'active': animates[index + 5].isTextAnimateStart }" v-show="animates[index + 5].isShowText">{{ animates[index + 5].textType === 'damage' ? '-' : '+' }}{{ animates[index + 5].textValue }}</p>
          </div>
          <!-- 右侧debuff栏 -->
          <div class="box-debuffs">
            <!-- 显示drunk -->
            <img class="buff-icon" v-show="item.flagDrunk" src="../assets/img/drunk.png" title="醉酒(无法行动!)" />
            <!-- 显示faint -->
            <img class="buff-icon" v-show="item.flagFaint" src="../assets/img/faint.png" title="眩晕(无法行动!)" />
            <!-- 显示confuse -->
            <div class="buff-icon" v-show="item.confuse">
              <img class="buff-icontext" src="../assets/img/confuse.png" title="蛊惑" />
              <p class="buff-num" title="蛊惑">{{ item.confuse }}</p>
            </div>
            <!-- 显示poison -->
            <div class="buff-icon" v-show="item.poison">
              <img class="buff-icontext" src="../assets/img/poison.png" title="中毒(受到持续自然伤害)" />
              <p class="buff-num" title="中毒(受到持续自然伤害)">{{ item.poison }}</p>
            </div>
            <!-- 显示slow -->
            <img class="buff-icon" v-show="item.flagSlow" src="../assets/img/slow.png" title="减速(行动迟缓)" />
            <!-- TODO change icon 显示锁定 -->
            <div class="buff-icon" v-show="item.lockOn">
              <img class="buff-icontext" src="../assets/img/poison.png" title="锁定(易伤)" />
              <p class="buff-num" title="锁定(易伤)">{{ item.lockOn }}</p>
            </div>
            <!-- 显示bind -->
            <img class="buff-icon" v-show="item.flagBind" src="../assets/img/bind.png" title="致命藤蔓(受到持续自然伤害)" />
          </div>
        </div>
        <!-- 底部信息栏 -->
        <div class="foot-states">
          <div class="box-hp" v-show="item.isOpen">
            <div class="box-text">
              <font-awesome-icon icon="heart" />
            </div>
            <div class="box-bar">
              <bar :value="item.hp" :max="item.maxhp" :height="20" :color="config.healthColor"></bar>
            </div>
          </div>
          <div class="box-sp" v-show="item.isOpen">
            <div class="box-text">
              <font-awesome-icon icon="bolt" />
            </div>
            <div class="box-bar">
              <bar :value="item.sp" :max="item.maxsp" :height="20" :color="config.skillColor"></bar>
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
import Bar from '@/components/Bar'

export default {
  name: 'battleField',
  data () {
    return {
      animates: [
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal' | 'sp'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        },
        {
          isShowEffect: false, // 是否显示伤害效果图
          effectUrl: '', // 效果图url
          isShowText: false, // 是否展示文字
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage', // 文字种类，'damage' | 'heal'
          textValue: '0' // 文字数字内容
        }
      ], // 控制伤害及数字动效
      damageFloating: [false, false, false, false, false, false, false, false, false, false], // 控制伤害浮动动效
      system,
      config,
      hero
    }
  },
  computed: {
    upHeros () {
      return this.hero.units.slice(0, 5)
    },
    downHeros () {
      return this.hero.units.slice(5, 10)
    }
  },

  mounted () {
    eventBus.$on('animateDamage', params => {
      this.handleDamageAnimate(params)
    })
    eventBus.$on('animateHeal', params => {
      this.handleHealAnimate(params)
    })
    eventBus.$on('animateSpRecover', params => {
      this.handleSpRecoverAnimate(params)
    })
  },

  beforeDestroy () {
    eventBus.$off('animateDamage')
    eventBus.$off('animateHeal')
    eventBus.$off('animateSpRecover')
  },

  methods: {
    chooseHero (index, position = 'up') {
      if (system.step === 0 && index >= 0 && index < 5) {
        if (position === 'down') {
          index += 5
        }
        window.sessionStorage.setItem('sourceIndex', index)
        eventBus.$emit('chooseHero')
      }
    },
    handleDamageAnimate (params) {
      if (params && params.targets && params.targets.length) {
        let value = params.value || 0
        let sound = params.sound || 'atk'
        let image = params.image || 'effdam'

        eventBus.$emit('playSound', {
          sound
        })
        let effect = {
          isShowEffect: true,
          effectUrl: `./img/${image}.png`,
          isShowText: true,
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'damage',
          textValue: value
        }
        this.animates.splice(params.targets[0], 1, effect)
        setTimeout(() => {
          // 文字动效
          let copy = this.animates[params.targets[0]]
          copy.isTextAnimateStart = true
          this.animates.splice(params.targets[0], 1, copy)
        }, 10)
        setTimeout(() => {
          // 清除效果图相关
          let copy = this.animates[params.targets[0]]
          copy.isShowEffect = false
          copy.effectUrl = ''
          this.animates.splice(params.targets[0], 1, copy)
        }, 1000)
        setTimeout(() => {
          // 清除文字
          let copy = this.animates[params.targets[0]]
          copy.isShowText = false
          copy.isTextAnimateStart = false
          this.animates.splice(params.targets[0], 1, copy)
        }, 1200)

        // 处理伤害floating动效
        this.damageFloating[params.targets[0]] = true
        setTimeout(() => {
          // 清除伤害floating
          this.damageFloating[params.targets[0]] = false
        }, 600)
      }
    },
    handleHealAnimate (params) {
      if (params && params.targets && params.targets.length) {
        let value = params.value || 0
        let sound = params.sound || 'heal'

        eventBus.$emit('playSound', {
          sound
        })
        let effect = {
          isShowEffect: false,
          effectUrl: '',
          isShowText: true,
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'heal',
          textValue: value
        }
        this.animates.splice(params.targets[0], 1, effect)
        // 文字动效
        setTimeout(() => {
          let copy = this.animates[params.targets[0]]
          copy.isTextAnimateStart = true
          this.animates.splice(params.targets[0], 1, copy)
        }, 10)
        // 清除文字
        setTimeout(() => {
          let copy = this.animates[params.targets[0]]
          copy.isShowText = false
          copy.isTextAnimateStart = false
          this.animates.splice(params.targets[0], 1, copy)
        }, 1200)
      }
    },
    handleSpRecoverAnimate (params) {
      if (params && params.targets && params.targets.length) {
        let value = params.value || 0
        let sound = params.sound || 'sprecover'

        eventBus.$emit('playSound', {
          sound
        })
        let effect = {
          isShowEffect: false,
          effectUrl: '',
          isShowText: true,
          isTextAnimateStart: false, // 是否开始文字动效
          textType: 'sp',
          textValue: value
        }
        this.animates.splice(params.targets[0], 1, effect)
        // 文字动效
        setTimeout(() => {
          let copy = this.animates[params.targets[0]]
          copy.isTextAnimateStart = true
          this.animates.splice(params.targets[0], 1, copy)
        }, 10)
        // 清除文字
        setTimeout(() => {
          let copy = this.animates[params.targets[0]]
          copy.isShowText = false
          copy.isTextAnimateStart = false
          this.animates.splice(params.targets[0], 1, copy)
        }, 1200)
      }
    }
  },

  components: {
    Bar
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/var.scss";

  .buff-icon {
    width: 25px;
    height: 25px;
    border-radius: 4px;
  }
  .bed-battle-field {
    // border: 1px solid #000;
    .box-upside, .box-downside {
      display: flex;
      justify-content: space-around;
      .box-hero {
        width: 220px;
        // border: 1px solid #000;
        .head-states {
          display: flex;
          justify-content: center;
          height: 30px;
          padding: 2px 35px;
          .buff-icon {
            position: relative;
            margin-right: 2px;
            &:last-child {
              margin-right: 0;
            }
            .buff-icontext {
              width: 25px;
              height: 25px;
            }
            .buff-num {
              position: absolute;
              left: 0;
              top: 0;
              width: 25px;
              height: 25px;
              line-height: 25px;
              color: #fff;
              text-align: center;
              font-size: 14px;
              // font-weight: bold;
              font-family: 'DMG Regular';
              text-shadow: 1px 1px 1px rgba(0,0,0,1);
              cursor: default;
            }
          }
        }
        .main {
          display: flex;
          justify-content: space-around;
          margin-bottom: 10px;
          height: 150px;
          .box-buffs, .box-debuffs {
            display: flex;
            flex-direction: column;
            width: 25px;
            .buff-icon {
              position: relative;
              margin-bottom: 2px;
              &:last-child {
                margin-bottom: 0;
              }
              .buff-icontext {
                width: 25px;
                height: 25px;
              }
              .buff-num {
                position: absolute;
                left: 0;
                top: 0;
                width: 25px;
                height: 25px;
                line-height: 25px;
                color: #fff;
                text-align: center;
                font-size: 14px;
                // font-weight: bold;
                font-family: 'DMG Regular';
                text-shadow: 1px 1px 1px rgba(0,0,0,1);
                cursor: default;
              }
            }
          }
          .box-unit {
            position: relative;
            top: 0;
            width: 130px;
            height: 150px;
            border-radius: 4px;
            // overflow: hidden;
            .unit-bg {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              object-fit: cover;
              opacity: 0.7;
              z-index: -1;
            }
            .unit-avatar {
              position: relative;
              top: 0;
              margin: 10px;
              width: 110px;
              height: 130px;
              border-radius: 4px;
              object-fit: cover;
              transition: all 0.2s;
              &.enable {
                cursor: pointer;
              }
              &.floating-up {
                top: -10px;
              }
              &.floating-down {
                top: 10px;
              }
            }
            .unit-cover {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              z-index: 1;
            }
            .cover-effect {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              z-index: 1;
            }
            .acted-cover {
              line-height: 150px;
              border-radius: 3px;
              color: #fff;
              background-color: rgba(160,160,160,0.5);
              text-align: center;
              font-size: 18px;
              // font-weight: bold;
              text-shadow: 2px 2px 3px rgba(0,0,0,1)
            }
            .death-cover {
              line-height: 150px;
              border-radius: 3px;
              color: #fff;
              background-color: rgba(0, 0, 0, 0.8);
              text-align: center;
              font-size: 18px;
              // font-weight: bold;
              text-shadow: 2px 2px 3px rgba(0,0,0,1);
            }
            .cover-effect-hpminus {
              // width: 110px;
              top: 0;
              color: $DANGER-COLOR;
              font-family: 'DMG Regular';
              font-size: 40px;
              // font-weight: bold;
              text-align: center;
              text-shadow: 1px 2px 1px rgba(10,10,10,0.4);
              transition: top .7s;
              &.cover-heal {
                color: $HEALTH-COLOR;
              }
              &.cover-sp-recover {
                color: $SKILL-COLOR;
              }
              &.active {
                top: -46px;
              }
            }
          }
        }
        .foot-states {
          min-height: 48px;
          .box-hp {
            position: relative;
            padding: 2px 4px;
            .box-text {
              position: absolute;
              left: 4px;
              top: 2px;
              width: 20px;
              color: $HEALTH-COLOR;
              text-align: center;
              font-size: 14px;
            }
            .box-bar {
              margin-left: 20px;
            }
          }
          .box-sp {
            position: relative;
            padding: 2px 4px;
            .box-text {
              position: absolute;
              left: 4px;
              top: 2px;
              width: 20px;
              color: $SKILL-COLOR;
              text-align: center;
              font-size: 14px;
            }
            .box-bar {
              margin-left: 20px;
            }
          }
        }
      }
    }
  }
</style>
