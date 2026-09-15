<template>
  <el-popover ref="popover" placement="bottom" width="200" trigger="click" popper-class="font-box">
    <el-scrollbar class="scroll-bar-box" style="height:200px;">
      <ul>
        <li style="font-family: Arial, Helvetica, sans-serif;" @click="fontItemClick($event)">Arial</li>
        <li style="font-family:Arial Black, Arial, sans-serif;" @click="fontItemClick($event)">Arial Black</li>
        <li style="font-family: Calibri, Helvetica, sans-serif;" @click="fontItemClick($event)">Calibri</li>
        <li style="font-family:Calibri Light,Helvetica Light, sans-serif;" @click="fontItemClick($event)">Calibri Light</li>
        <li style="font-family: Cambria, Georgia, serif;" @click="fontItemClick($event)">Cambria</li>
        <li style="font-family: Candara, Optima, sans-serif;" @click="fontItemClick($event)">Candara</li>
        <li style="font-family:Century Gothic, sans-serif;" @click="fontItemClick($event)">Century Gothic</li>
        <li style="font-family:Comic Sans MS, Chalkboard, cursive;" @click="fontItemClick($event)">Comic Sans MS</li>
        <li style="font-family: Consolas, Courier, monospace;" @click="fontItemClick($event)">Consolas</li>
        <li style="font-family: Constantia,Hoefler Text, serif;" @click="fontItemClick($event)">Constantia</li>
        <li style="font-family: Corbel, Skia, sans-serif;" @click="fontItemClick($event)">Corbel</li>
        <li style="font-family:Courier New, monospace;" @click="fontItemClick($event)">Courier New</li>
        <li
          style="font-family:Franklin Gothic Book,Avenir Next Condensed, sans-serif;"
          @click="fontItemClick($event)"
        >Franklin Gothic Book</li>
        <li
          style="font-family:Franklin Gothic Demi,Avenir Next Condensed Demi Bold, sans-serif;"
          @click="fontItemClick($event)"
        >Franklin Gothic Demi</li>
        <li
          style="font-family:Franklin Gothic Medium,Avenir Next Condensed Medium, sans-serif;"
          @click="fontItemClick($event)"
        >Franklin Gothic Medium</li>
        <li style="font-family: Garamond, Georgia, serif;" @click="fontItemClick($event)">Garamond</li>
        <li style="font-family: Georgia, serif;" @click="fontItemClick($event)">Georgia</li>
        <li style="font-family: Impact, Charcoal, sans-serif;" @click="fontItemClick($event)">Impact</li>
        <li style="font-family:Lucida Console, Monaco, monospace;" @click="fontItemClick($event)">Lucida Console</li>
        <li style="font-family:Lucida Handwriting,Apple Chancery, cursive;" @click="fontItemClick($event)">Lucida Handwriting</li>
        <li style="font-family:Lucida Sans Unicode,Lucida Grande, sans-serif;" @click="fontItemClick($event)">Lucida Sans Unicode</li>
        <li style="font-family:Palatino Linotype,Book Antiqua, Palatino, serif;" @click="fontItemClick($event)">Palatino Linotype</li>
        <li style="font-family:Segoe UI,Helvetica Neue, sans-serif;" @click="fontItemClick($event)">Segoe UI</li>
        <li style="font-family:Sitka Heading, Cochin, serif;" @click="fontItemClick($event)">Sitka Heading</li>
        <li style="font-family:Sitka Text, Cochin, serif;" @click="fontItemClick($event)">Sitka Text</li>
        <li style="font-family: Tahoma, Geneva, sans-serif;" @click="fontItemClick($event)">Tahoma</li>
        <li style="font-family: Times,Times New Roman, serif;" @click="fontItemClick($event)">Times</li>
        <li style="font-family:Times New Roman, Times, serif;" @click="fontItemClick($event)">Times New Roman</li>
        <li style="font-family:Trebuchet MS, Trebuchet, sans-serif;" @click="fontItemClick($event)">Trebuchet MS</li>
        <li style="font-family:TW Cen MT,Century Gothic, sans-serif;" @click="fontItemClick($event)">TW Cen MT</li>
        <li style="font-family: Verdana, Geneva, sans-serif;" @click="fontItemClick($event)">Verdana</li>
        <!-- //splite -->
        <li style="font-family:Microsoft YaHei, 微软雅黑, STHeiti, sans-serif;" @click="fontItemClick($event)">微软雅黑</li>
        <li style="font-family: SimHei, 黑体, STHeiti, sans-serif;" @click="fontItemClick($event)">黑体</li>
        <li style="font-family: NSimSun, 新宋体, SimSun, 宋体, SimSun-ExtB, 宋体-ExtB, STSong, serif;" @click="fontItemClick($event)">新宋体</li>
        <li style="font-family: FangSong, 仿宋, STFangsong, serif;" @click="fontItemClick($event)">仿宋</li>
        <li style="font-family: SimLi, 隶书,Baoli SC, serif;" @click="fontItemClick($event)">隶书</li>
        <li style="font-family: KaiTi, 楷体, STKaiti, serif;" @click="fontItemClick($event)">楷体</li>
        <!-- //splite -->
        <li style="font-family:Microsoft JhengHei, 微軟正黑體,Apple LiGothic, sans-serif;" @click="fontItemClick($event)">微軟正黑體</li>
        <li style="font-family: PMingLiU, 新細明體, PMingLiU-ExtB, 新細明體-ExtB,Apple LiSung, serif;" @click="fontItemClick($event)">新細明體</li>
        <li style="font-family: DFKai-SB, 標楷體, BiauKai, serif;" @click="fontItemClick($event)">標楷體</li>
        <!-- //split -->
        <li style="font-family: Meiryo, メイリオ,Hiragino Sans, sans-serif;" @click="fontItemClick($event)">メイリオ</li>
        <li
          style="font-family:MS PGothic,ＭＳ Ｐゴシック,MS Gothic,ＭＳ ゴシック,Hiragino Kaku Gothic ProN, sans-serif;"
          @click="fontItemClick($event)"
        >ＭＳ Ｐゴシック</li>
        <li
          style="font-family:MS PMincho,ＭＳ Ｐ明朝,MS Mincho,ＭＳ 明朝,Hiragino Mincho ProN, serif;"
          @click="fontItemClick($event)"
        >ＭＳ Ｐ明朝</li>
        <li style="font-family:Yu Gothic, 游ゴシック, YuGothic, sans-serif;" @click="fontItemClick($event)">游ゴシック</li>
        <li style="font-family:Yu Mincho, 游明朝, YuMincho, serif;" @click="fontItemClick($event)">游明朝</li>
        <li role="separator" class="ms-ContextualMenu-divider divider-158" @click="fontItemClick($event)"></li>
        <li style="font-family:Malgun Gothic,맑은 고딕, AppleGothic, sans-serif;" @click="fontItemClick($event)">맑은 고딕</li>
        <li style="font-family: Gulim, 굴림,Nanum Gothic, sans-serif;" @click="fontItemClick($event)">굴림</li>
        <li style="font-family: Dotum, 돋움, AppleGothic, sans-serif;" @click="fontItemClick($event)">돋움</li>
        <li style="font-family: Batang, 바탕, AppleMyungjo, serif;" @click="fontItemClick($event)">바탕</li>
        <li style="font-family: BatangChe, 바탕체, AppleMyungjo, serif;" @click="fontItemClick($event)">바탕체</li>
        <li style="font-family: Gungsuh, 궁서, GungSeo, serif;" @click="fontItemClick($event)">궁서</li>
        <li role="separator" class="ms-ContextualMenu-divider divider-158" @click="fontItemClick($event)"></li>
        <li style="font-family:Leelawadee UI, Thonburi, sans-serif;" @click="fontItemClick($event)">Leelawadee UI</li>
        <li style="font-family:Angsana New,Leelawadee UI, Sathu, serif;" @click="fontItemClick($event)">Angsana New</li>
        <li style="font-family:Cordia New,Leelawadee UI, Silom, sans-serif;" @click="fontItemClick($event)">Cordia New</li>
        <li style="font-family: DaunPenh,Leelawadee UI,Khmer MN, sans-serif;" @click="fontItemClick($event)">DaunPenh</li>
        <li role="separator" class="ms-ContextualMenu-divider divider-158" @click="fontItemClick($event)"></li>
        <li style="font-family:Nirmala UI, sans-serif;" @click="fontItemClick($event)">Nirmala UI</li>
        <li style="font-family: Gautami,Nirmala UI,Telugu MN, sans-serif;" @click="fontItemClick($event)">Gautami</li>
        <li style="font-family:Iskoola Pota,Nirmala UI,Sinhala MN, sans-serif;" @click="fontItemClick($event)">Iskoola Pota</li>
        <li style="font-family: Kalinga,Nirmala UI,Oriya MN, sans-serif;" @click="fontItemClick($event)">Kalinga</li>
        <li style="font-family: Kartika,Nirmala UI,Malayalam MN, sans-serif;" @click="fontItemClick($event)">Kartika</li>
        <li style="font-family: Latha,Nirmala UI,Tamil MN, sans-serif;" @click="fontItemClick($event)">Latha</li>
        <li style="font-family: Mangal,Nirmala UI,Devanagari Sangam MN, sans-serif;" @click="fontItemClick($event)">Mangal</li>
        <li style="font-family: Raavi,Nirmala UI,Gurmukhi MN, sans-serif;" @click="fontItemClick($event)">Raavi</li>
        <li style="font-family: Shruti,Nirmala UI,Gujarati Sangam MN, sans-serif;" @click="fontItemClick($event)">Shruti</li>
        <li style="font-family: Tunga,Nirmala UI,Kannada MN, sans-serif;" @click="fontItemClick($event)">Tunga</li>
        <li style="font-family: Vrinda,Nirmala UI,Bangla MN, sans-serif;" @click="fontItemClick($event)">Vrinda</li>
        <li role="separator" class="ms-ContextualMenu-divider divider-158" @click="fontItemClick($event)"></li>
        <li style="font-family: Nyala, Kefa, sans-serif;" @click="fontItemClick($event)">Nyala</li>
        <li style="font-family: Sylfaen, Mshtakan, Menlo, serif;" @click="fontItemClick($event)">Sylfaen</li>
      </ul>
    </el-scrollbar>
    <!-- <button slot="reference" @click="btnClick($event)" :title="title" class="editor-btn"> -->
    <button slot="reference" :title="title" class="editor-btn" @click="btnClick($event)">
      <svg viewBox="0 0 1024 1024" class="btn-svg-box">
        <path
          d="M454.125714 808.868571h115.419429l-213.76-601.234285H234.971429L21.632 808.850286H130.377143l51.657143-155.410286h221.257143l50.834285 155.428571z m-164.571428-488.32h7.076571l81.664 249.965715h-171.245714l82.486857-249.984zM760.685714 816.384c59.593143 0 109.586286-25.837714 135.003429-70.016h7.076571v62.500571h99.584V497.627429c0-96.256-65.828571-152.923429-182.912-152.923429-108.324571 0-183.753143 50.834286-192.073143 130.413714h97.499429c9.581714-31.250286 42.075429-48.329143 89.581714-48.329143 55.826286 0 85.833143 25.417143 85.833143 70.838858v39.168l-117.504 7.076571c-110.829714 6.253714-172.909714 54.162286-172.909714 135.844571 0 83.328 62.902857 136.667429 150.820571 136.667429z m30.427429-79.597714c-45.842286 0-78.756571-22.912-78.756572-62.08 0-37.906286 27.081143-59.172571 84.992-62.902857l102.930286-7.094858v37.083429c0 54.162286-46.665143 94.994286-109.165714 94.994286z"
        />
      </svg>
    </button>
  </el-popover>
</template>

<script>
export default {
  name: 'BtnFontNameList',
  props: {
    title: {
      type: [String, Number],
      default: ''
    }
  },
  methods: {
    // btnClick(e) {
    // this.$emit("click", e);
    // },
    btnClick(e) {
      e.stopPropagation()
      e.preventDefault()
      return false
    },

    fontItemClick(e) {
      this.$emit('click', e)
      this.$refs.popover.showPopper = false
    }
  }
}
</script>
<style>
.font-box .scroll-bar-box .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.font-box .scroll-bar-box ul {
  margin: 0;
  padding: 0;
  list-style: none;
}
.font-box .scroll-bar-box ul li {
  box-sizing: border-box;
  padding:0 5px;
  line-height: 1.5em;
  cursor: pointer;
  -moz-user-select: none;
  user-select: none;
}
.font-box .scroll-bar-box ul li:hover {
  background-color: #0066cc;
  color: #ffffff;
}
</style>
<style scoped lang='scss'>
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
    fill: "#000000";
    overflow: hidden;
    stroke-width: 1px;
  }

  &:hover {
    fill: #0066cc;
    background-color: #ffffff;
  }
}
</style>
