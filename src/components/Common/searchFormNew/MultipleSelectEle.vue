<template>
  <div class="input-switch-box">
    <div class="con-left">
      <el-select
        size="small"
        style="width: 100%"
        :value="value"
        :filterable="filterable"
        :placeholder="placeholder || ''"
        multiple
        collapse-tags
        clearable
        @change="$emit('updateForm', { value: $event, type })"
        :class="filterable ? 'log-msg-ellipsis-filterable' : 'log-msg-ellipsis'"
        :filter-method="filterMethod ? filterOption : undefined"
      >
        <el-option
          v-for="child in selectOption"
          :key="child[selectValue]"
          :label="child[selectLabel]"
          :value="child[selectValue]"
        >
          <span :class="[rightLabel ? 'select-left-text' : '']">{{ child[selectLabel] }}</span>
          <span class="select-right-text">{{ child[rightLabel] || '' }}</span>
        </el-option>
      </el-select>
    </div>
    <div class="con-right" v-if="openDialogSelect">
      <svg-icon
        icon-class="list2"
        class="primary-pointer"
        style="font-size: 26px"
        @click.stop="clickFn"
      />
      <!-- @click="$emit('handleOpen')" -->
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultipleSelectEle',
  components: {},
  props: {
    placeholder: {
      type: String
    },
    selectValue: {
      type: String
    },
    selectLabel: {
      type: String
    },
    width: {
      type: String
    },
    selectData: {
      type: Array,
      default: () => []
    },
    value: {
      type: Array,
      default: () => []
    },
    filterable: {
      type: Boolean,
      default() {
        return true
      }
    },
    type: {
      type: String,
      default: ''
    },
    rightLabel: {
      type: [String, Number],
      default: ''
    },
    openDialogSelect: {
      type: Boolean,
      default: false
    },
    callback: {
      type: Function
    },
    filterMethod: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    selectData: {
      handler(newVal, oldVal) {
        this.selectOption = newVal || []
      },
      immediate: true
    }
  },
  data() {
    return {
      selectOption: []
    }
  },
  methods: {
    clickFn() {
      // if (this.disabled) {
      //   return
      // }
      this.callback()
    },
    filterOption(str) {
      const list = this.selectData
      if ((str + '').trim() !== '') {
        const res = []
        list.forEach((item) => {
          if (
            item[this.selectLabel].toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >= 0
          ) {
            res.push(item)
          } else if (
            this.rightLabel &&
            item[this.rightLabel].toLocaleLowerCase().indexOf(str.trim().toLocaleLowerCase()) >= 0
          ) {
            res.push(item)
          }
        })
        this.selectOption = res
      } else {
        this.selectOption = list
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.select ::v-deep .el-select__tags > span {
  display: flex;
  max-width: 120px;
}
</style>
