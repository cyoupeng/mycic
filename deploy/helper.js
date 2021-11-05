const inquirer = require('inquirer')
new inquirer.Separator() 
const selectTip = 'project name:'
const options = [
  {
    type: 'checkbox',
    name: selectTip,
    message: `您希望把项目部署到哪个环境？`,
    choices: []
  }
]

// 显示选择提示窗
function showHelper (config) {
  return new Promise((resolve, reject) => {
    initHelper(config) // 初始化helper
    inquirer.prompt(options).then(answers => {
      resolve({ value: findInfoByName(config, answers[selectTip]) }) // 查找所选配置项
    }).catch((err) => {
      reject(console.error(' helper显示或选择出错！', err))
    })
  })
}

// 初始化helper
function initHelper (config) {

  for (let item of config) {
    options[0].choices.push(item.name)
  }
  console.log('正在检查全局配置信息...')
  // 检查是否存在相同name
  if (new Set(options[0].choices).size !== options[0].choices.length) {
    console.error('请检查配置信息，存在相同name！')
    process.exit()
  }
}

// 查找符合条件的配置项
function findInfoByName (config, nameArr) {
  const arrInfo = []
  for (let item of config) {
    for(let name of nameArr) {
      if(item.name === name) {
        arrInfo.push(item)
      }
    }
  }
  return arrInfo
}

module.exports = showHelper