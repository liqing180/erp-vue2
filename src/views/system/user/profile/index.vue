<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="8" :xs="24">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>{{ $t('menu.userInfo') }}</span>
          </div>
          <div>
            <div class="text-center">
              <userAvatar :user="user" />
            </div>
            <ul class="list-group list-group-striped">
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="user" class="mr5" />{{ $t('ui.userId') }}
                </span>
                <div class="ellipsis-text" style="text-align: right" :title="user.userName">
                  {{ user.userName }}
                </div>
              </li>
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="user" class="mr5" />{{ $t('ui.userName') }}
                </span>
                <div class="ellipsis-text" style="text-align: right" :title="user.nickName">
                  {{ user.nickName }}
                </div>
              </li>
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="phone" class="mr5" />{{ $t('ui.mobilePhone') }}
                </span>
                <div class="ellipsis-text" style="text-align: right" :title="user.mobilePhone">
                  {{ user.mobilePhone }}
                </div>
              </li>
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="email" class="mr5" />{{ $t('ui.email') }}
                </span>
                <div class="ellipsis-text" style="text-align: right" :title="user.email">
                  {{ user.email }}
                </div>
              </li>
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="tree" class="mr5" />{{ $t('ui.dept') }}
                </span>
                <div
                  class="ellipsis-text"
                  style="text-align: right"
                  :title="user.departmentNameListShowStr"
                >
                  {{ user.departmentNameListShowStr }}
                </div>
              </li>
              <!-- <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="peoples" class="mr5" />{{ $t('ui.role') }}
                </span>
                <div
                  class="ellipsis-text"
                  style="text-align: right"
                  :title="user.roleNameListShowStr"
                >
                  {{ user.roleNameListShowStr }}
                </div>
              </li> -->
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="peoples" class="mr5" />{{ $t('ui.position') }}
                </span>
                <div
                  class="ellipsis-text"
                  style="text-align: right"
                  :title="user.positionNameListShowStr"
                >
                  {{ user.positionNameListShowStr }}
                </div>
              </li>
              <li class="list-group-item flexSb">
                <span class="mr20 fs-0">
                  <svg-icon icon-class="date" class="mr5" />{{ $t('ui.createdTime') }}
                </span>
                <div
                  class="ellipsis-text"
                  style="text-align: right"
                  :title="parseTime(user.createdTime, fmtForYmdhms)"
                >
                  {{ parseTime(user.createdTime, fmtForYmdhms) }}
                </div>
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col :span="16" :xs="24">
        <el-card>
          <div slot="header" class="clearfix">
            <span>{{ $t('ui.basicInfo') }}</span>
          </div>
          <el-tabs v-model="activeTab">
            <el-tab-pane :label="$t('ui.basicInfo')" name="userinfo">
              <userInfo :user="user" />
            </el-tab-pane>
            <el-tab-pane :label="$t('ui.resetPwd')" name="resetPwd">
              <resetPwd :user="user" />
            </el-tab-pane>
          </el-tabs>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import userAvatar from './userAvatar'
import userInfo from './userInfo'
import resetPwd from './resetPwd'
import { getUserProfile } from '@/api/system/user'

export default {
  name: 'Profile',
  components: { userAvatar, userInfo, resetPwd },
  data() {
    return {
      user: {},
      roleGroup: {},
      postGroup: {},
      activeTab: 'userinfo'
    }
  },
  created() {
    this.getUser()
  },
  computed: {
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    }
  },
  methods: {
    getUser() {
      getUserProfile().then((response) => {
        this.user = response.data
        this.roleGroup = response.roleGroup
        this.postGroup = response.postGroup
      })
    }
  }
}
</script>
