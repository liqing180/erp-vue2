
 <!-- 编辑页面 只上传-->
<el-col :span="24">
  <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
    <myUpload ref="uploadRef" />
  </el-form-item>
</el-col>
<!-- 编辑页面上传下载 -->
<el-col
  :class="{'my-hidden': !(isShowUpload || isShowDownload)}"
  :span="24"
>
  <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
    <myUpload ref="uploadRef" :disabled="!isShowUpload" />
  </el-form-item>
</el-col>
<!-- 编辑页面 只下载-->
<el-col 
  :class="{'my-hidden': !(commonFileList)}"
  :span="24"
 >
  <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
    <myUpload ref="myUploadCancelle" :disabled="true" />
  </el-form-item>
 </el-col>

 setTimeout(() => {
  vm.$refs.myUploadCancelle.initFileList(commonFileList)
}, 100)



<script>
  // 初始化文件列表 myUploadCancelle myUploadAcknowledged
setTimeout(() => {
  vm.$refs.uploadRef.initFileList(commonFileList)
}, 100)

 // 非必填获取
  let myFileIds = vm.$refs.uploadRef.getFileIds()
  if (myFileIds === false) {
    return
  }

  param.fileIds = vm.$refs.uploadRef.getFileIds()

  // 必填获取
  let myFileIds = vm.$refs.uploadRef.getFileIds({ required: true })
  if (myFileIds === false) {
    return
  }
  </script>


 <!--*** 编辑页面 只上传-->
 <el-col :span="24">
  <el-form-item 
    :label="`${$t('ui.attachment')}`"
    v-addStar="addStarForLabel" 
    prop="fileIds"
  >
    <myUpload ref="uploadRef" />
  </el-form-item>
</el-col>
<!--*** 编辑页面上传下载 -->
 <el-col
  :class="{'my-hidden': !(isShowUpload || isShowDownload)}"
  :span="24"
>
  <el-form-item 
    :label="`${$t('ui.attachment')}`"
    v-addStar="addStarForLabel"
    prop="fileIds"
   >
    <myUpload ref="uploadRef" :disabled="!isShowUpload" />
  </el-form-item>
</el-col>
<!--*** 编辑页面 只下载-->
<el-col 
  :class="{'my-hidden': !(commonFileList)}"
  v-addStar="addStarForLabel"
  :span="24"
 >
  <el-form-item :label="`${$t('ui.attachment')}`" prop="fileIds">
    <myUpload ref="myUploadCancelle" :disabled="true" />
  </el-form-item>
 </el-col>

<script>



// import addStar from '@/directives/addStar'
  directives: {
    addStar
  }
  addStarForLabel() {
    const vm = this
    const lableStr = `${vm.$t('ui.attachment')}`
    return lableStr
  }
  
 </script>
