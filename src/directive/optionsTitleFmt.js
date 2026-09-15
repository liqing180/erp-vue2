/**
 * option group 自定义。
 */
function optionsTitleFmt(el) {
  const htmlLi = el.querySelector('li.el-select-group__title')
  const liTxt = (htmlLi.innerText).toString().split(',')
  let strHtml = ''

  // strHtml += `
  //   <div class="option-title-box">
  //   <div class="option-title-a">${liTxt[0]}</div>
  //   <div class="option-title-b">${liTxt[1]}</div>
  //   <div class="option-title-c">${liTxt[2]}</div>
  //   </div>
  //   `
  strHtml += `
    <div class="option-title-box">
    <div class="option-title-a">${liTxt[0]}</div>
    <div class="option-title-b">${liTxt[1]}</div>
    </div>
    `

  htmlLi.innerHTML = strHtml
}
const directive = {
  bind(el) {
    optionsTitleFmt(el)
  }
}

export default directive
