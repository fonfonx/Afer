var Vue = require('vue')
Vue.use(require('vue-resource'))
Vue.use(require('vue-highcharts'))

var moment = require('moment')

import { fundsList } from './constants'
import { addKeysInFunds } from './format-funds'
import { setOptions, success} from './highcharts-utils'

var afer = new Vue({
  el: '.afer',
  data: {
    funds: addKeysInFunds(fundsList),
    globalBeginDate: '1990-01-01',
    globalEndDate: moment().format('YYYY-MM-DD'),
  },
  mounted:function() {
    this.getData()
  },
  methods: {
    changeFundDate: function(fund) {
      setOptions(fund)
    },
    changeGlobalDate: function() {
      for (let fund of this.funds) {
        fund.beginDate = this.globalBeginDate
        fund.endDate = this.globalEndDate
        this.changeFundDate(fund)
      }
    },
    getData: function() {
      const baseURL = 'https://www.afer.asso.fr/amcharts/'
      for (let fund of this.funds) {
        const reqURL = baseURL + fund.key + '_data.csv'
        // let us make a request to a server we control
        // const reqURL = 'http://localhost:8000/fund?code=' + fund.key
        this.$http.get(reqURL)
        .then(
          // success callback
          success.bind(null, fund)
        )
        .catch((response) => {
          // error callback
          console.log('Unable to fetch csv')
        })
      }
    }
  },
})
