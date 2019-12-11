<template>
  <section class="bed-dps-report">
    <el-dialog class="window-dps-report" title="伤害统计" :visible.sync="isShow" width="84%" top="2vh">
    <div class="box-report">
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
          result.push(Object.assign({}, item, {
            index,
            dpt: Number((item.damageTotal / item.actRounds).toFixed(2))
          }))
        }
      })
      return result
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
  .box-report {
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
          color: #999;
          font-size: 12px;
          font-weight: normal;
        }
      }
    }
  }
</style>
