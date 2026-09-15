<!--
* <p>Title:dashbord</p>
* <p>Description: </p>
* <p>Copyright: Copyright (c) 2
* <p>Company: IMG LOGICS
* @author Song Jiang - Alter
* @version v1.0 2019-1-16
*-->
<template>
  <div class="notification">
    <div class="content">
      <div class="title">
        <el-row type="flex">
          <el-col>
            <el-tabs v-model="tabActiveName" type="card" @tab-click="handleClick">
              <el-tab-pane :label="$t('notification.allNotifications')" name="first"> </el-tab-pane>
              <el-tab-pane name="second">
                <span slot="label">
                  {{ $t('notification.unreadNotifications') }}
                  <el-badge
                    v-if="unReadNum > 0"
                    class="mark"
                    :value="unReadNum"
                    :max="99"
                  ></el-badge>
                </span>
              </el-tab-pane>
            </el-tabs>
          </el-col>
          <el-col :span="6" v-if="tableData.length > 0">
            <el-button type="primary" size="small" class="fr" @click="handleSetPageRead">{{
              $t('notification.markRead')
            }}</el-button>
          </el-col>
        </el-row>
      </div>
      <div v-loading="table_loading" class="scoll-wrapper" :key="tableKey">
        <div
          v-if="tableData.length <= 0"
          style="text-align: center; color: #909399; font-size: 14px"
        >
          <el-divider></el-divider>
          <span>{{ $t('ui.noData') }}</span>
          <el-divider></el-divider>
          <!-- No Data / 暂无数据 -->
        </div>

        <el-collapse v-else v-model="activeName" accordion>
          <el-collapse-item
            v-for="item in tableData"
            :key="`${item.id}`"
            class="bg-wihte"
            :name="item.id"
            @click.native="handleChange(item)"
          >
            <template slot="title">
              <div class="read" :class="{ active: item.status === 1 }">
                <div class="ellipsis"><i class="read-status"></i> {{ item.content }}</div>
                <p>{{ parseTime(item.sendTime) }}</p>
              </div>
            </template>
            <div class="read-content">{{ item.content }}</div>
          </el-collapse-item>
        </el-collapse>
      </div>

      <!-- :saveKey="saveKey" -->
      <pagination
        :saveKey="saveKey"
        v-show="total > 0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapState } from 'vuex'
import locale from './locale'
import { queryMessage, markRead } from '@/api/notice/notice'
import pageMixin from '@/mixins/tableMinx'

export default {
  mixins: [pageMixin],
  data() {
    return {
      saveKey: '1',
      tabActiveName: 'first',
      selectTitle: 'All Notifications',
      activeName: -1,
      table_loading: false,
      curPage: 1,
      pages: 2,
      total: 0,
      pageSize: 25,
      pageSizes: [10, 20, 50],
      tableData: [],
      showPaination: false,
      pageSizeChange: false,
      tableKey: '0',
      queryParams: {
        pageNum: 1,
        pageSize: 25
      }
    }
  },
  computed: {
    ...mapGetters(['fmtForYmdhms']),
    ...mapState({ unReadNum: (state) => state.user.unReadNum })
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.queryParams.pageSize = this.$$initPageSize(this.saveKey)
    this.getList()
    this.showPaination = true
  },
  methods: {
    handleClick() {
      this.queryParams.pageNum = 1
      this.getList()
    },

    async handleSetPageRead() {
      try {
        const ids = this.tableData
          .map((item) => {
            this.$set(item, 'status', 1)
            return item.id
          })
          .join(',')
        const res = await this.markRead(ids)
        if (res !== undefined) {
          this.getList()
          this.$store.commit('setUnReadNum', res)
        }
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    async handleChange(item) {
      const { id, status } = item
      if (status === 1) return
      const res = await this.markRead(id + '')
      if (res !== undefined) {
        item.status = 1
        this.$store.commit('setUnReadNum', res)
      }
    },

    markRead(ids) {
      const vm = this

      const param = {
        ids
      }
      return new Promise((resolve) => {
        markRead(param)
          .then((res) => {
            if (res.code === 200) {
              resolve(res.data)
            } else {
              vm.$modal.msgError(res.message)
            }
          })
          .catch(() => {})
      })
    },
    getList(isRefresh) {
      const vm = this
      vm.table_loading = true
      this.activeName = -1
      this.queryParams.status = this.tabActiveName === 'first' ? undefined : 0
      queryMessage(this.queryParams).then((response) => {
        vm.tableData = response.rows.map((item) => {
          return item
        })
        this.tableKey = Math.random()

        vm.total = response.total
        vm.table_loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.bg-wihte /deep/.el-collapse-item__header {
  background: #fff;
  color: #000;
  font-weight: 500;
}
.bg-wihte /deep/.el-collapse-item__content {
  background: #f3f6f8;
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.notification {
  display: flex;
  flex-flow: row;
  height: calc(100vh - 140px);
  padding: 0 20px;
  margin-top: 20px;
  background: #fff;

  > .content {
    flex: 1;
    height: inherit;
    box-sizing: border-box;
    padding-bottom: 34px;

    .read-content {
      text-indent: 40px;
      padding: 10px 0 10px 10px;
    }
    > .title {
      height: 75px;
      // font-size: 1.17em;
      // line-height: 75px;
      // text-indent: 20px;
      // border-bottom: 1px solid #dcdfe6;
      // font-weight: bold;
    }
    > .scoll-wrapper {
      max-height: calc(100% - 100px);
      overflow: auto;
    }
    .read {
      display: flex;
      flex-flow: row;
      width: 100%;
      overflow: hidden;
      height: 100%;
      align-items: center;
      > div {
        flex: 1;
      }
      > p {
        width: 180px;
        font-size: 12px;
        margin: 0;
        padding: 0;
      }
      .read-status {
        display: inline-block;
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: #f56c6c;
        margin: 0 10px;
      }
      &.active {
        // color: #ccc;
        .read-status {
          background: #ccc;
        }
      }
    }
  }
}
.bqt-Timer {
  color: #000 !important;
  position: relative;
  top: 1px;
  right: 2px;
}
</style>
