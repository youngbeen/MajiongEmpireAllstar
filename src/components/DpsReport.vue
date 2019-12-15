<template>
  <section class="bed-dps-report">
    <el-dialog class="window-dps-report" title="伤害统计" :visible.sync="isShow" width="84%" top="2vh">
    <div class="box-report">
      <!-- MVP栏 -->
      <div class="box-mvp">
        <div class="box-cat">
          <div class="title">伤害总量MVP</div>
          <div class="list">
            <div class="box-item" v-for="(mvp, index) in totalMvps" :key="index">
              <div class="item">
                <img :src="mvp.url" alt="">
                <div class="corner-tip">
                  <span v-if="index !== 0">{{ index + 1 }}</span>
                  <font-awesome-icon class="bg-icon" icon="award" v-if="index === 0" />
                </div>
              </div>
              <div class="desc">位置{{ mvp.index + 1 }}</div>
            </div>
          </div>
        </div>
        <div class="box-cat">
          <div class="title">平均伤害MVP</div>
          <div class="list">
            <div class="box-item" v-for="(mvp, index) in dptMvps" :key="index">
              <div class="item">
                <img :src="mvp.url" alt="">
                <div class="corner-tip">
                  <span v-if="index !== 0">{{ index + 1 }}</span>
                  <font-awesome-icon class="bg-icon" icon="award" v-if="index === 0" />
                </div>
              </div>
              <div class="desc">位置{{ mvp.index + 1 }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 详细列表 -->
      <el-table :data="list" style="width: 100%">
        <el-table-column label="" width="180">
          <template slot-scope="scope">
            <div class="unit-info">
              <img :src="scope.row.url" alt="">
              <span class="info">{{ scope.row.type | cnNameFix }} <span class="desc">(位置{{ scope.row.index + 1 }})</span></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="dpt" label="平均每回合伤害(DPT)" width="180" sortable></el-table-column>
        <el-table-column prop="damageTotal" label="伤害总量" sortable></el-table-column>
        <el-table-column prop="directDamageTotal" label="直接伤害总量" sortable></el-table-column>
        <el-table-column prop="skillDamageTotal" label="技能伤害总量" sortable></el-table-column>
      </el-table>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="close()">关闭</el-button>
    </span>
  </el-dialog>
  </section>
</template>

<script>
import { numberUtil } from '@youngbeen/angle-util'
import eventBus from '@/eventBus'
import hero from '@/models/hero'
import heroDict from '@/models/heroDict'

export default {
  name: 'dpsReport',
  data () {
    return {
      isShow: false,
      tab: 'dps', // dps | total
      hero
    }
  },
  computed: {
    list () {
      let result = []
      this.hero.units.forEach((item, index) => {
        if (item.isOpen) {
          let dpt = item.actRounds ? numberUtil.round(item.damageTotal / item.actRounds, 2) : 0
          result.push(Object.assign({}, item, {
            index,
            dpt
          }))
        }
      })
      return result
    },
    dptMvps () {
      let raw = [...this.list]
      raw.sort((a, b) => b.dpt - a.dpt)
      return raw.slice(0, 3)
    },
    totalMvps () {
      let raw = [...this.list]
      raw.sort((a, b) => b.damageTotal - a.damageTotal)
      return raw.slice(0, 3)
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
    eventBus.$on('dpsReport', () => {
      this.isShow = true
    })
  },

  beforeDestroy () {
    eventBus.$off('dpsReport')
  },

  methods: {
    close () {
      this.isShow = false
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../assets/css/var.scss";

.box-report {
  .box-mvp {
    display: flex;
    justify-content: space-between;
    .box-cat {
      width: 46%;
      .title {
        margin-bottom: 10px;
        padding-bottom: 4px;
        color: $PRIMARY-TEXT-COLOR;
        border-bottom: 1px solid #ccc;
        font-size: 14px;
        // font-weight: bold;
      }
      .list {
        .box-item {
          display: inline-block;
          margin-right: 6px;
          .item {
            position: relative;
            // overflow: hidden;
            img {
              width: 34px;
              height: 34px;
              border: 2px solid #ddd;
              border-radius: 4px;
              object-fit: cover;
              box-shadow: 0 0 2px 1px rgba(210, 210, 210, .5);
            }
            .corner-tip {
              position: absolute;
              right: 0;
              bottom: 0;
              width: 14px;
              height: 14px;
              color: #fff;
              text-align: center;
              font-size: 10px;
              z-index: 1;
              .bg-icon {
                position: absolute;
                left: 0;
                top: 0;
                z-index: -1
              }
              &:after {
                position: absolute;
                left: 0;
                top: 0;
                right: 0;
                bottom: 0;
                content: ' ';
                border-radius: 50%;
                background: $DANGER-COLOR;
                z-index: -1;
              }
            }
          }
          .desc {
            height: 24px;
            line-height: 24px;
            text-align: center;
            font-size: 10px;
          }
          &:first-child {
            .item {
              img {
                width: 50px;
                height: 50px;
              }
              .corner-tip {
                right: -1px;
                bottom: -5px;
                height: 20px;
                // color: #e7f70b;
                color: #fd6d2a;
                // background: #fff;
                font-size: 18px;
                // text-shadow: 2px 1px 2px black;
                &:after {
                  opacity: 0;
                }
              }
            }
          }
        }
      }
    }
  }
  .unit-info {
    display: flex;
    align-items: center;
    img {
      width: 30px;
      height: 30px;
      border: 2px solid #ddd;
      border-radius: 4px;
      // border-top-left-radius: 4px;
      // border-bottom-right-radius: 4px;
      object-fit: cover;
      box-shadow: 0 0 2px 1px rgba(210, 210, 210, .5);
    }
    .info {
      padding: 0 4px;
      font-weight: bold;
      .desc {
        color: $DESC-TEXT-COLOR;
        font-size: 12px;
        font-weight: normal;
      }
    }
  }
}
</style>
