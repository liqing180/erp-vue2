<template>
  <FormPageLayout v-loading="submitLoading">
    <template v-slot:btn>
      <el-button type="primary" size="mini" @click="submitForm"
        >{{ $t('uiBtn.submit') }}
      </el-button>
      <el-button type="primary" @click="cancel" size="mini">{{ $t('uiBtn.back') }}</el-button>
    </template>
    <template v-slot:content>
      <el-collapse v-model="activeNames">
        <div class="form-card">
          <el-collapse-item name="1">
            <FormCollapseItemTitle
              slot="title"
              :title="$t('ui.basicInfo')"
              :warning="collapseWarningForBasicInfo"
            >
            </FormCollapseItemTitle>
            <el-form
              ref="form"
              :model="form"
              @submit.native.prevent
              :rules="rules"
              label-width="180px"
              :disabled="comDisFrom"
            >
              <el-row>
                <el-col :span="16">
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
                      :disabled="!!id"
                    ></el-cascader>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('PRODUCT.categoryCode')}`" prop="uniqueNo">
                    <el-input v-model="form.uniqueNo" maxlength="5"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="16">
                  <el-form-item :label="`${$t('PRODUCT.categoryName')}`" prop="categoryName">
                    <el-input v-model="form.categoryName" maxlength="200"></el-input>
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
                  <el-form-item :label="`${$t('ui.createdBy')}`">
                    <el-input :value="form.createdBy" disabled class="form-wd"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.createdTime')}`">
                    <el-date-picker
                      :value="form.createdTime"
                      :editable="false"
                      disabled
                      type="date"
                      :format="fmtForYmdhms"
                      :style="{ width: '100%' }"
                      placeholder
                    ></el-date-picker>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="8">
                  <el-form-item :label="`${$t('ui.isActive')}`">
                    <el-switch
                      v-model="form.isActive"
                      active-value="1"
                      inactive-value="0"
                    ></el-switch>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
          </el-collapse-item>
        </div>
      </el-collapse>
    </template>
  </FormPageLayout>
</template>

<script>
import locale from '@/views/productManagement/lang/index'
import { save, queryAllCategoryTreeList } from '@/api/productManagement/productCategory'

export default {
  name: 'AddProductCategory',
  components: {},
  data() {
    return {
      submitLoading: false,
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
      id: '',
      collapseWarningForBasicInfo: false
    }
  },

  computed: {
    fmtForYmd() {
      return this.$store.getters.fmtForYmd
    },
    fmtForYmdhms() {
      return this.$store.getters.fmtForYmdhms
    },
    editAuth() {
      return this.checkPermi(['productManagement:productCategory:edit'])
    },
    comDisFrom() {
      if (this.rowId) {
        return !this.editAuth
      }
      return false
    }
  },
  beforeCreate() {
    this.$i18n.mergeLocaleMessage('zh', locale.zh)
    this.$i18n.mergeLocaleMessage('en', locale.en)
  },
  created() {
    this.id = this.$route.query.id || ''
    if (this.$route.query.isActive !== undefined) {
      this.$set(this.form, 'isActive', this.$route.query.isActive)
    }
    this.queryAllCategoryTreeList()
  },
  methods: {
    queryAllCategoryTreeList() {
      queryAllCategoryTreeList().then((res) => {
        const arr = res.data
        this.handle(arr)
        this.selectData = arr || []
        if (this.id) {
          const ids = this.findParentIds(this.selectData, this.id) || []
          // console.log(ids, '===')
          // ids.reverse()
          // ids.push(this.id)
          this.$set(this.form, 'parentId', ids)
        }
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
      this.submitLoading = true
      if (!param.parentId || param.parentId.length <= 0) {
        param.parentId = 0
      }

      save(param)
        .then(() => {
          this.$message.success(
            `${this.$t('PRODUCT.productCategorySuccess').replace('$1', `${param.categoryName}`)}`
          )
          this.cancel()
          this.submitLoading = false
        })
        .catch(() => {
          this.submitLoading = false
        })
    },

    submitForm() {
      this.$refs.form.validate((valid) => {
        this.collapseWarningForBasicInfo = !valid
        if (!valid) {
          this.$modal.msgError(this.$t('ui.fromIncomplete').replace('$1', this.$t('ui.basicInfo')))
        }
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
    },
    // 取消按钮
    cancel() {
      this.$store.dispatch('tagsView/delView', this.$route)
      this.$router.push({ path: '/productManagement/productCategory' })
    }
  }
}
</script>
