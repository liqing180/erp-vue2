<template>
  <el-dialog
    :close-on-click-modal="false"
    v-dialogDrag
    v-dialogDragWidth
    :visible.sync="open"
    width="1000px"
    style="padding-top: 20vh"
    top="5vh"
    append-to-body
    :title="$t('PRODUCT.productCategory1')"
    @closed="closed"
  >
    <el-form
      ref="form"
      class="mt20"
      :model="form"
      @submit.native.prevent
      :rules="rules"
      label-width="130px"
    >
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.parentCategory1')}`" prop="parentId">
            <el-cascader
              :show-all-levels="false"
              placeholder=""
              v-model="form.parentId"
              :options="selectData"
              :props="{
                multiple: false,
                value: 'id',
                label: 'categoryName',
                children: 'child',
                checkStrictly: true
              }"
              clearable
              :collapse-tags="false"
              class="cascader"
              popper-class="hide-cascader-scrollbar"
              style="width: 100%"
            >
              <template #default="{ node }">
                <span :title="node.label">{{ node.label }}</span>
              </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.categoryName')}`" prop="categoryName">
            <el-input v-model="form.categoryName" maxlength="200"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item :label="`${$t('PRODUCT.categoryCode')}`" prop="uniqueNo">
            <el-input v-model="form.uniqueNo" maxlength="5"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item :label="$t('ui.description')">
            <MyInput
              type="textarea"
              v-model="form.description"
              :autosize="{ minRows: 2, maxRows: 8 }"
              resize="none"
              show-word-limit
              :maxlength="3000"
            ></MyInput>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <el-form-item :label="`${$t('ui.isActive')}`">
            <el-switch v-model="form.isActive" active-value="1" inactive-value="0"></el-switch>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <div slot="footer" class="dialog-footer">
      <el-button @click="cancel">{{ $t('uiBtn.back') }}</el-button>
      <el-button type="primary" @click="submitForm" :disabled="fullscreenLoading"
        >{{ $t('uiBtn.submit') }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script>
import { save, queryActiveProductCategoryTreeList } from '@/api/productManagement/productCategory'

export default {
  props: {},
  data() {
    return {
      fullscreenLoading: false,
      activeNames: ['1'],
      form: {
        parentId: [],
        categoryName: '',
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      },
      rules: {
        categoryName: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('organization.departmentName')),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ],
        uniqueNo: [
          {
            required: true,
            message: this.$t('ui.reqMsg').replace('$1', this.$t('organization.departmentName')),
            trigger: ['blur', 'change'],
            // eslint-disable-next-line prefer-regex-literals
            pattern: new RegExp(/^(?!(\s+$))/g)
          }
        ]
      },
      selectData: [],
      open: false
    }
  },
  computed: {},
  methods: {
    reset() {
      this.form = {
        parentId: [],
        categoryName: '',
        isActive: '1',
        createdBy: this.$store.state.user.nickName
      }
      this.resetForm('form')
    },
    /** 修改按钮操作 */
    show() {
      this.open = true
      this.queryActiveProductCategoryTreeList()
    },
    // 取消按钮
    cancel() {
      this.open = false
    },
    closed() {
      this.reset()
    },
    queryActiveProductCategoryTreeList() {
      queryActiveProductCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.selectData = arr || []
      })
    },
    handle(data) {
      if (data && data.length > 0) {
        data.forEach((x) => {
          if (x.child && x.child.length > 0) {
            x.children = x.child
            this.handle(x.child)
          } else {
            x.child = undefined
          }
        })
      }
    },

    findParentIds(dataSource, nodeId) {
      const parentIds = [] // 用于存储所有父节点ID的数组
      // 定义一个递归函数，用于遍历整棵树并查找子节点的所有父节点
      function traverse(node, nodeId) {
        if (node.id === nodeId) {
          // 如果当前节点的ID等于子节点的ID，则表示已经找到了子节点，可以开始向上查找父节点
          return true // 返回true表示已经找到了子节点
        }
        if (node.children) {
          // 如果当前节点有子节点，则继续遍历子节点
          for (const childNode of node.children) {
            if (traverse(childNode, nodeId)) {
              // 如果在子节点中找到了子节点的父节点，则将当前节点的ID添加到父节点ID数组中，并返回true表示已经找到了子节点
              // parentIds.push(node.id)
              parentIds.unshift(node.id)
              return true
            }
          }
        }
        return false // 如果当前节点不是子节点的父节点，则返回false
      }
      // 从根节点开始遍历整棵树，并调用递归函数查找子节点的所有父节点
      for (const node of dataSource) {
        if (traverse(node, nodeId)) {
          // 如果在当前节点的子树中找到了子节点的父节点，则直接退出循环
          break
        }
      }
      parentIds.push(nodeId)
      return parentIds // 返回所有父节点ID的数组
    },
    save(param) {
      this.fullscreenLoading = true
      if (!param.parentId || param.parentId.length <= 0) {
        param.parentId = 0
      }

      save(param)
        .then((res) => {
          this.$message.success(
            `${this.$t('PRODUCT.productCategorySuccess').replace('$1', `${param.categoryName}`)}`
          )
          const { id } = res.data || {}
          this.$emit('onSuccess', [id])
          this.cancel()
          this.fullscreenLoading = false
        })
        .catch(() => {
          this.fullscreenLoading = false
        })
    },

    submitForm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$modal.confirm(this.$t('PRODUCT.productCategorySubmit')).then(() => {
            let param = JSON.parse(JSON.stringify(this.form))
            if (typeof param.parentId === 'object' && param.parentId.length > 0) {
              param.parentId = param.parentId[param.parentId.length - 1]
            }
            param = this.$trimOfObj(param)
            this.save(param)
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>
