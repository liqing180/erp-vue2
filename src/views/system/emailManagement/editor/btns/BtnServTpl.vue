<template>
  <el-popover
    ref="popover"
    v-loading.fullscreen.lock="fullscreenLoading"
    placement="bottom"
    width="200"
    trigger="click"
    popper-class="serv-tpl-box"
    :disabled="popDisabled"
  >
    <el-scrollbar v-eidtorCmdPoper:5="`${options.length}`" class="scroll-bar-box">
      <ul>
        <li
          v-for="item in options"
          :key="item.id"
          class="cmd-item"
          @click="itemClick(item, $event)"
        >
          {{ item.variableDescription }}
        </li>
      </ul>
    </el-scrollbar>
    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1024 1024" class="btn-svg-box">
        <path
          fill="#444444"
          d="M233.155,830.885c-59.351,0-101.191-11.116-125.523-33.336c-24.338-22.226-36.502-59.165-36.502-110.811v-99.45
          c0-49.911-20.614-74.99-61.831-75.24v-71.143c41.217,0,61.831-25.944,61.831-77.847v-92.746c0-52.642,12.35-90.383,37.061-113.232
          c24.705-22.843,66.359-34.268,124.965-34.268v72.632c-42.712,0-64.065,23.715-64.065,71.142v89.394
          c0,63.321-20.614,103.175-61.831,119.564v1.862c41.217,16.389,61.831,56.744,61.831,121.054v86.414
          c0,26.568,4.964,45.441,14.899,56.616c9.929,11.174,26.318,16.761,49.167,16.761V830.885z"
        />
        <path
          fill="#444444"
          d="M1008.368,512.048c-40.972,0.501-61.458,25.95-61.458,76.357v95.726c0,52.391-11.919,89.952-35.758,112.673
          c-23.838,22.721-65.805,34.081-125.896,34.081v-72.632c22.844,0,39.296-5.529,49.353-16.575
          c10.057-11.051,15.085-29.74,15.085-56.057v-89.394c0-63.071,20.357-102.43,61.086-118.074v-1.49
          c-40.729-16.389-61.086-57.605-61.086-123.661v-86.414c0-47.427-21.48-71.142-64.438-71.142v-72.632
          c58.35,0,99.881,11.489,124.592,34.454c24.706,22.971,37.062,60.155,37.062,111.556v94.981c0,51.401,20.486,77.102,61.458,77.102
          V512.048z"
        />
        <path
          fill="#444444"
          d="M420.458,365.821l-85.547,216.016H296.24l-81.25-216.016h41.797l52.734,154.297c4.297,12.372,6.836,22.724,7.617,31.055
        h0.977c1.3-10.938,3.58-21.026,6.836-30.273l55.273-155.078H420.458z"
        />
        <path
          fill="#444444"
          d="M453.662,380.86c21.484-13.409,46.289-20.117,74.415-20.117c52.08,0,78.125,27.344,78.125,82.031v139.063h-37.891v-33.398
          h-0.977c-14.975,25.653-37.045,38.477-66.211,38.477c-20.966,0-37.631-5.664-50-16.992
          c-12.372-11.328-18.555-26.626-18.555-45.898c0-40.362,23.893-63.867,71.68-70.508l64.063-8.984
          c0-35.284-14.584-52.93-43.75-52.93c-25.913,0-49.545,8.725-70.899,26.172V380.86z M517.725,480.274
          c-17.709,2.344-29.917,6.772-36.622,13.281c-6.708,6.513-10.059,15.625-10.059,27.344c0,10.288,3.644,18.687,10.938,25.195
          c7.291,6.513,16.925,9.766,28.906,9.766c16.667,0,30.401-5.859,41.211-17.578c10.807-11.719,16.211-26.431,16.211-44.141v-20.703
          L517.725,480.274z"
        />
        <path
          fill="#444444"
          d="M785.498,403.712c-6.381-4.556-15.17-6.836-26.367-6.836c-14.844,0-27.084,6.934-36.719,20.801
        c-9.639,13.867-14.453,32.129-14.453,54.785v109.375h-38.281V365.821h38.281v43.945h0.781
        c10.938-31.769,29.814-47.656,56.641-47.656c8.721,0,15.43,0.977,20.117,2.93V403.712z"
        />
      </svg>
    </button>
  </el-popover>
</template>

<script>
import eidtorCmdPoper from '@/directive/eidtorCmdPoper'
import { querySysEmailTemplateVariableByTemplateFor } from '@/api/system/emailManagement'

export default {
  name: 'BtnServTpl',
  directives: { eidtorCmdPoper },
  props: {
    title: {
      type: [String, Number],
      default: ''
    },
    templateFor: {
      type: [String, Number],
      //  默认参数是测试用
      default: ''
    }
    // apiUrl: {
    //   type: [Object],
    //   default: function() {
    //     return null
    //   }
    // }
  },
  data() {
    return {
      //   templateFor: "",
      options: [],
      fullscreenLoading: false
    }
  },
  computed: {
    popDisabled() {
      const vm = this
      if (!Array.isArray(vm.options)) {
        return true
      } else {
        const len = vm.options.length
        if (len <= 0) {
          return true
        } else {
          return false
        }
      }
    }
  },
  watch: {
    templateFor: function (newVal, oldVal) {
      if (newVal !== oldVal) {
        this.$refs.popover.showPopper = false
        this.querySysEmailTemplateVariableByTemplateFor(newVal)
      }
    }
  },
  mounted() {
    const vm = this
    vm.$nextTick(() => {
      vm.querySysEmailTemplateVariableByTemplateFor(vm.templateFor)
    })
  },
  methods: {
    btnClick(e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },

    itemClick(item, e) {
      this.$emit('click', { event: e, templateFor: item.variableName })
      this.$refs.popover.showPopper = false
    },

    querySysEmailTemplateVariableByTemplateFor(templateFor) {
      const vm = this
      if (!templateFor) {
        return
      }
      if (templateFor === 'payment_term') {
        vm.options = []
        vm.options.push({
          id: '999',
          templateFor: 'payment_term',
          variableDescription: vm.$t('menu.paymentTerm'),
          // eslint-disable-next-line no-template-curly-in-string
          variableName: '${payment_term}'
        })
        vm.options.push({
          id: '998',
          templateFor: 'leadTimeDays',
          variableDescription: vm.$t('ui.leadTimeDays'),
          // eslint-disable-next-line no-template-curly-in-string
          variableName: '${lead_time}'
        })
        return
      }
      if (templateFor === 'SQ-Conditions') {
        vm.options = []
        vm.options.push({
          id: '998',
          templateFor: 'scheduled_delivery_date',
          variableDescription: vm.$t('SALES.scheduledDeliveryDate'),
          // eslint-disable-next-line no-template-curly-in-string
          variableName: '${scheduled_delivery_date}'
        })
        vm.options.push({
          id: '999',
          templateFor: 'payment_term',
          variableDescription: vm.$t('menu.paymentTerm'),
          // eslint-disable-next-line no-template-curly-in-string
          variableName: '${payment_term}'
        })
        vm.options.push({
          id: '997',
          templateFor: 'validity',
          variableDescription: vm.$t('SALES.validityDays'),
          // eslint-disable-next-line no-template-curly-in-string
          variableName: '${validity}'
        })
        return
      }

      vm.fullscreenLoading = true
      querySysEmailTemplateVariableByTemplateFor(templateFor).then((res) => {
        vm.fullscreenLoading = false
        const results = res.data
        vm.options = []
        // eslint-disable-next-line array-callback-return
        results.map((item) => {
          vm.options.push(item)
        })

        // const { data } = res
        // if (data.status === 200) {
        //   vm.fullscreenLoading = false
        //   const results = data.msg

        //   vm.options = []
        //   // eslint-disable-next-line array-callback-return
        //   results.map((item) => {
        //     vm.options.push(item)
        //   })
        // } else {
        //   console.log('???')
        //   vm.fullscreenLoading = false
        //   vm.$modal.msgError(data.message)
        // }
      })
    }
  }
}
</script>
<style>
.serv-tpl-box .scroll-bar-box .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.serv-tpl-box .scroll-bar-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.serv-tpl-box .scroll-bar-box ul li {
  box-sizing: border-box;
  padding: 0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.serv-tpl-box .scroll-bar-box ul li:hover {
  background-color: #0066cc;
  color: #ffffff;
}
</style>
<style scoped lang="scss">
.editor-btn {
  margin: 0 5px;
  padding: 3px;
  cursor: pointer;
  box-sizing: border-box;
  width: 24px;
  height: 24px;
  font-size: 14px;
  border: transparent;
  border-radius: 4px;
  background-color: transparent;
  line-height: 24px;
  vertical-align: middle;
  text-align: center;
  outline: none;

  .btn-svg-box {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    vertical-align: -0.15em;
    text-align: center;
    fill: '#000000';
    overflow: hidden;
    stroke-width: 1px;
  }

  &:hover {
    fill: #0066cc;
    background-color: #ffffff;
  }
}
</style>
