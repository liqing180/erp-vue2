<template>
  <div class="navbar">
    <hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" v-if="!topNav" />
    <top-nav id="topmenu-container" class="topmenu-container" v-if="topNav" />

    <div class="right-menu">
      <div v-show="device !== 'mobile'" style="display: inline-block">
        <search id="header-search" class="right-menu-item" />

        <LegalEntity />

        <NavWMS class="right-menu-item" />

        <screenfull id="screenfull" class="right-menu-item hover-effect" />

        <QrCode v-if="false" class="right-menu-item hover-effect" />

        <lang-select class="right-menu-item hover-effect" />

        <!-- <el-tooltip :content="`${$t('settings.layoutSize')}`" placement="bottom"> -->
        <!-- <Abnormalities class="right-menu-item hover-effect" /> -->
        <!-- </el-tooltip> -->

        <smallBell class="right-menu-item hover-effect" />

        <el-tooltip :content="`${$t('settings.layoutSize')}`" placement="bottom">
          <size-select id="size-select" class="right-menu-item hover-effect" />
        </el-tooltip>
      </div>

      <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
        <div class="avatar-wrapper">
          <el-avatar :size="34" fit="scale-down" :src="avatar"></el-avatar>
          <!-- <img :src="avatar" class="user-avatar" /> -->
          <span :title="nickName" class="user-name ml5">{{ nickName }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <router-link to="/user/profile">
            <el-dropdown-item>{{ $t('menu.userInfo') }}</el-dropdown-item>
          </router-link>
          <el-dropdown-item @click.native="setting = true">
            <span>{{ $t('settings.layoutSetting') }}</span>
          </el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">
            <span>{{ $t('settings.logout') }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import TopNav from '@/components/TopNav'
import Hamburger from '@/components/Hamburger'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import RuoYiGit from '@/components/RuoYi/Git'
import RuoYiDoc from '@/components/RuoYi/Doc'
import LangSelect from '@/components/LangSelect'

import smallBell from './notifications/smallBell'
import QrCode from './QrCode'
import LegalEntity from './LegalEntity'
import NavWMS from './NavWMS'

export default {
  components: {
    Breadcrumb,
    TopNav,
    Hamburger,
    Screenfull,
    SizeSelect,
    Search,
    // eslint-disable-next-line vue/no-unused-components
    RuoYiGit,
    // eslint-disable-next-line vue/no-unused-components
    RuoYiDoc,
    LangSelect,
    smallBell,
    QrCode,
    LegalEntity,
    NavWMS
  },
  created() {
    this.$store.dispatch('getBPMTaskCount')
    this.$store.dispatch('getInventoryTaskCount')
    this.$store.dispatch('getSalesTaskCount')
    this.$store.dispatch('getPurchaseTaskCount')
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'device', 'nickName']),
    setting: {
      get() {
        return this.$store.state.settings.showSettings
      },
      set(val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    },
    topNav: {
      get() {
        return this.$store.state.settings.topNav
      }
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm(this.$t('ui.logoutConfirm'), '', {
        confirmButtonText: this.$t('uiBtn.yes'),
        cancelButtonText: this.$t('uiBtn.no'),
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            location.href = '/index'
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .topmenu-container {
    position: absolute;
    left: 50px;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;
      .avatar-wrapper /deep/ .el-avatar {
        background-color: #fff;
      }

      .avatar-wrapper {
        // margin-top: 5px;
        cursor: pointer;
        position: relative;
        display: flex;
        align-items: center;

        .user-name {
          font-size: 14px;
          min-width: 50px;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 20px;
          font-size: 12px;
        }
      }
    }
  }

  .avatar-wrapper .el-avatar {
    /deep/ img {
      width: 100%;
    }
  }
}
</style>
