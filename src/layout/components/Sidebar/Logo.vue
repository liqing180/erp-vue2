<template>
  <div
    class="sidebar-logo-container"
    :class="{ collapse: collapse }"
    :style="{
      backgroundColor:
        sideTheme === 'theme-dark' ? variables.menuBackground : variables.menuLightBackground
    }"
  >
    <transition name="sidebarLogoFade">
      <div v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
      </div>
      <div v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo" />
        <h1
          class="sidebar-title"
          :style="{
            color:
              sideTheme === 'theme-dark' ? variables.logoTitleColor : variables.logoLightTitleColor
          }"
        >
          <span>{{ tenantTypeStr }}</span>
        </h1>
      </div>
    </transition>
  </div>
</template>

<script>
import logoImg from '@/assets/logo/logo.png'
import variables from '@/assets/styles/variables.scss'

export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  computed: {
    variables() {
      return variables
    },
    sideTheme() {
      return this.$store.state.settings.sideTheme
    },
    corporateName() {
      return this.$store.state.user.corporateName
    },
    tenantType() {
      return Number(this.$store.getters.tenantType)
    },
    tenantTypeStr() {
      return 'BATCHTEC'
    }
  },
  data() {
    // carrier consignor operationCenter
    return {
      logo: logoImg
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 40px;
  // line-height: 50px;
  background: #2b2f3a;
  // text-align: center;
  padding-left: 20px;
  overflow: hidden;
  margin-top: 5px;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;

    & .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px;
    }

    & .sidebar-title {
      display: inline-block;
      margin: 0;
      color: #fff;
      font-weight: 600;
      // line-height: 50px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
    & .sidebar-sub-title {
      display: block;
      width: 100%;
      height: 20px;
      color: #fff;
      font-weight: 600;
      // line-height: 50px;
      white-space: nowrap;
      min-width: 50px;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 12px;
    }
  }

  &.collapse {
    padding-left: 0px;
    text-align: center;
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
</style>
