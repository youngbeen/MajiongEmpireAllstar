<template>
  <el-dialog class="window-choose-hero" title="选择英雄" :visible.sync="isShow" width="84%" top="2vh" :before-close="handleClose">
    <div class="box-heros">
      <div class="box-hero" v-for="item in heros" :key="item.name" @click="choose(item)">
        <div class="box-avatar">
          <img :src="item.url" :alt="item.cnName">
        </div>
        <div class="title">
          {{ item.cnName }}
        </div>
        <div class="desc">
          {{ item.desc }}
        </div>
      </div>
      <div class="box-hero" @click="random()">
        <div class="box-avatar">
          <img src="../assets/img/bigbang.jpeg">
        </div>
        <div class="title">随机</div>
        <div class="desc"></div>
      </div>
      <div class="box-hero" v-if="currentHero.type" @click="choose()">
        <div class="box-avatar">
          <img src="../assets/img/nounit.png">
        </div>
        <div class="title">空置</div>
        <div class="desc">
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleCancel">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
import eventBus from '@/eventBus'
import hero from '@/models/hero'
import heroDict from '@/models/heroDict'
import diceUtil from '@/utils/diceUtil'

export default {
  name: 'chooseHero',
  data () {
    return {
      isShow: false,
      index: -1,
      heros: heroDict.list,
      hero
    }
  },
  computed: {
    currentHero () {
      if (this.index > -1 && this.hero.units[this.index].type) {
        return this.hero.units[this.index]
      } else {
        return {}
      }
    }
  },

  mounted () {
    eventBus.$on('chooseHero', () => {
      this.index = Number(window.sessionStorage.getItem('sourceIndex'))
      this.isShow = true
    })
  },

  beforeDestroy () {
    eventBus.$off('chooseHero')
  },

  methods: {
    random () {
      let dice = diceUtil.rollDice(this.heros.length)
      this.choose(this.heros[dice - 1])
    },
    choose (item) {
      let copy = hero.units[this.index]
      if (item) {
        // 选择了英雄
        copy.type = item.name
        copy.url = item.url
      } else {
        // 空置
        copy.type = ''
        copy.url = ''
      }
      hero.units.splice(this.index, 1, copy)
      this.handleCancel()
    },
    handleCancel () {
      this.isShow = false
      this.handleClose()
    },
    handleClose () {
      window.sessionStorage.removeItem('sourceIndex')
    }
  }
}
</script>

<style lang="scss" scoped>
  @import "../assets/css/var.scss";

  .box-heros {
    display: flex;
    // justify-content: space-between;
    flex-wrap: wrap;
    max-height: 350px;
    overflow-y: auto;
    .box-hero {
      margin: 8px 8px;
      border: 3px solid rgba(0,0,0,0);
      box-shadow: 1px 1px 8px rgba(0,0,0, .4);
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        border: 3px solid $FOCUS-COLOR;
        box-shadow: 1px 1px 4px rgba(0,0,0, .8);
      }
      .box-avatar {
        img {
          width: 130px;
          height: 150px;
          object-fit: cover;
        }
      }
      .title {
        text-align: center;
        font-size: 18px;
        font-weight: bold;
      }
      .desc {
        width: 130px;
        text-align: center;
        font-size: 12px;
      }
    }
  }
</style>
