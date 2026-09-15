<template>
  <div>
    <ul class="card" v-if="list.length > 0">
      <li class="item" v-for="(item, index) in list" :key="index">
        <div class="info">
          <div class="line-card">
            <div class="tag"></div>
            <div class="line"></div>
          </div>
          <div class="content">
            <div>{{ item.createTimeShow }}</div>
            <el-card class="mt20">
              <div class="flex mt10">
                <div class="flex" style="font-weight: 700; white-space: nowrap">
                  {{ item.orderStatusShow }}
                </div>
              </div>
              <el-divider></el-divider>
              <div>
                <div class="flex">
                  <div class="label fs-0">{{ $t('login.handler') }}:</div>
                  <div>{{ item.createdBy }}</div>
                </div>
                <div class="flex mt10">
                  <div class="label fs-0">{{ $t('login.role') }}:</div>
                  <div>{{ item.roleName }}</div>
                </div>
              </div>
            </el-card>
          </div>
        </div>
      </li>
    </ul>
    <el-empty :image-size="200" :description="$t('login.noData')" v-else></el-empty>
  </div>
</template>

<script>
import { queryOrderTrackingNodeMsg } from '@/api/login'
export default {
  name: 'orderNode',
  props: {
    orderId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  methods: {
    init() {
      this.list = []
      queryOrderTrackingNodeMsg({
        orderId: this.orderId
      }).then((res) => {
        this.list = res.data.orderTrackingNodeList
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].fileIds) {
            this.$nextTick(() => {
              this.getFiles(i)
            })
          }
        }
      })
    },
    getFiles(i) {
      if (this.$refs['uploadRef_' + i]) {
        this.$refs['uploadRef_' + i][0].initFileList(this.list[i].commonFileList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
ul,
li {
  margin: 0;
  padding: 0;
  text-decoration: none;
  list-style: none;
}
.flex {
  display: flex;
  line-height: 20px;
}
.fs-0 {
  flex-shrink: 0;
}
.label {
  // width: 150px;
  // text-align: right;
  margin-right: 10px;
}
.card {
  display: flex;
  flex-direction: column;
  margin-top: 30px;
  padding-right: 20px;
  height: 100%;
  .item {
    display: flex;
    align-items: center;
    .info {
      flex: 1;
      display: flex;
      margin: 0 20px;
      .content {
        flex: 1;
        padding-bottom: 30px;
      }
      .date {
        display: flex;
      }
    }
    .line-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-shrink: 0;
      width: 50px;
      .tag {
        width: 15px;
        height: 15px;
        border-radius: 50%;
        // background-color: #ccc;
        background-color: #fff;
        border: 3px solid #1890ff;
      }
      .line {
        flex: 1;
        width: 2px;
        background-color: #ccc;
      }
    }
    .time {
      width: 180px;
      flex-shrink: 0;
      text-align: right;
    }
  }
}
.card::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background-color: initial;
}

.card::-webkit-scrollbar-thumb {
  border-radius: 4px;
  background-color: rgba(127, 135, 146, 0.5);
}

.card::-webkit-scrollbar-track {
  width: 10px;
  box-shadow: none;
  border-radius: 0;
  background-color: initial;
}
</style>
