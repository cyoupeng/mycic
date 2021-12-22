<template class="overhid">
  <div class="content">
    <van-row type="flex" justify="center">
      <van-col span="19">
        <div id="d1"></div>
        <div class="loginTitle">欢迎来到审批流DEMO</div>
        <div>
          <van-field
            class="formField"
            v-model="restForm.restReason"
            :error="restReasonError"
            :error-message="restReasonErrorMessage"
            clearable
            label="请假原因"
            placeholder="请输入请假原因"
            @input="restReasonInput"
          />
          <van-field
            readonly
            clickable
            label="请假类型"
            :value="restForm.restType"
            :error-message="restTypeErrorMessage"
            placeholder="选择请假类型"
            @click="showPicker = true"
          />

        </div>
      </van-col>
    </van-row>
    <van-row type="flex" justify="center">
      <van-col span="24" style="text-align:center;margin-top: 30px;">
        <van-button @click="onSendCode" class="conformButton" color="#169bd5">提 交 申 请</van-button>
      </van-col>
    </van-row>

    <van-popup v-model="showPicker" round position="bottom">
      <van-picker
        show-toolbar
        :columns="columns"
        @cancel="showPicker = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </div>
</template>

<script >
import Vue from 'vue'
import { Toast } from 'vant'
import { nanoid } from 'nanoid'
Vue.use(Toast)
export default {
  data () {
    return {

      restForm: {
        restType: '',
        restReason: ''
      },
      restReasonError: false,
      restReasonErrorMessage: '',
      restTypeErrorMessage: '',
      showPicker: false,
      columns: ['事假', '病假', '产假', '育儿假', '生育假', '年假']

    }
  },
  methods: {

    onSendCode () {
      if (!this.restForm.restReason) {
        this.restReasonErrorMessage = '请输入请假原因'
        return
      } else {
        this.restReasonErrorMessage = ''
      }
      if (!this.restForm.restType) {
        this.restTypeErrorMessage = '请选择请假类型'
        return
      } else {
        this.restTypeErrorMessage = ''
      }
      const wx = window.wx
      const that = this
      const orderno = nanoid()
      wx.invoke('thirdPartyOpenPage', {
        'oaType': '10001', // String
        'templateId': '7f732c80bc35cff948daac0aab107d70_189713740', // String
        'thirdNo': orderno, // String  这里使用订单号当做审批单号，以此关联业务数据，后面的回调函数可以获取到审批单号
        'extData': {
          'fieldList': [{
            'title': '请假类型',
            'type': 'text',
            'value': that.restForm.restType
          },
          {
            'title': '请假原因',
            'type': 'text',
            'value': that.restForm.restReason
          }]
        }
      },
      function (res) {
        // 输出接口的回调信息
        Toast(JSON.stringify(res))
      })
    },
    waitNextCode () {
      var that = this
      if (that.time > 0) {
        return
      }
      that.time = 60
      var interval = setInterval(function () {
        that.sendCode = '等待' + that.time + '秒'
        that.time--
        if (that.time === 0) {
          that.sendCode = '重新获取'
          clearInterval(interval)
        }
      }, 1000)
    },

    onConfirm (value, index) {
      this.restForm.restType = value
      this.showPicker = false
    },
    onCancel () {
      this.showPicker = false
    },
    restReasonInput (val) {
      if (!val) {
        this.restReasonError = true
        this.restReasonErrorMessage = '请输入请假原因'
      } else {
        this.restReasonError = false
        this.restReasonErrorMessage = ''
      }
    },
    init () {
      let url = ''
      if (document.URL.indexOf('#') > -1) {
        url = document.URL.split('#')[0]
      } else {
        url = document.URL
      }
      const wx = window.wx
      this.apiw.agentSignature({url: url}).then((res) => {
        const {data} = res
        wx.agentConfig({
          corpid: data.corpid,
          agentid: data.agentid,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['thirdPartyOpenPage'],
          success: function (res) {
            Toast.success('审批流获取成功')
          },
          fail: function (res) {
            console.log('res', res)
            document.getElementById('d1').innerText = JSON.stringify(res)
            Toast.fail('审批流获取失败')
          }
        })
      }).catch(_ => {
        Toast.fail('agentSignature接口调用失败')
      })
      // this.apiw.agentSignature({url: url}).then((agentRes) => {
      //   const data = agentRes.data
      //   data.success = (res) => {
      //     Toast.success('审批流获取成功')
      //   }
      //   data.fail = () => {
      //     Toast.fail('审批流获取失败')
      //   }
      //   data.jsApiList.push('thirdPartyOpenPage')
      //   wx.agentConfig(data)
      // }).catch(_ => {
      //   // document.getElementById('d1').innerText = JSON.stringify(err)
      // })
    }
  },
  mounted () {
    this.init()
  }

}
</script>

<style scoped>
.loginTitle {
  margin: 30px 0;
  text-align: center;
  font-size: 24px;
}
/* html,
.conformButton {
  border-radius: 8px;
  margin-top: 150px;
  width: 100%;
}
.formField {
  line-height: 35px;
  font-size: 18px;
}
.loginTitle {
  margin-bottom: 50px;
  font-size: 30px;
  font-weight: bold;
}
.content {
  padding-top: 25%;
}
body {
  height: 100%;
  width: 100%;
} */
</style>
