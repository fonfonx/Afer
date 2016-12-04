Vue.use(require('../node_modules/vue-highcharts/dist/vue-highcharts.js'))
window._ = require('lodash')
var numbro = require('numbro')
var moment = require('moment')

const baseURL = 'https://www.afer.asso.fr/amcharts/'

let funds = [
  {
    key: 'DIVDUR',
    name: 'Afer Diversifié Durable',
  },
  {
    key: 'SFER',
    name: 'Afer Sfer',
  },
  {
    key: 'ACEURO',
    name: 'Afer Actions Euro',
  },
  {
    key: 'ACMOND',
    name: 'Afer Actions Monde',
  },
  {
    key: 'AMERIQ',
    name: 'Afer Actions Amérique',
  },
  {
    key: 'EMERGE',
    name: 'Afer Marchés Emergents',
  },
  {
    key: 'PATRIM',
    name: 'Afer Patrimoine',
  },
  {
    key: 'ACPME',
    name: 'Afer Actions PME',
  },
  {
    key: 'CONVER',
    name: 'Afer Convertibles',
  },
  {
    key: 'MONDEN',
    name: 'Afer Obligations Monde Entreprises',
  },
  {
    key: 'IMMO',
    name: 'Afer Immo',
  },
  {
    key: 'AO2017',
    name: 'Afer Objectif 2017',
  },
]

// Format funds list
addKeysInFunds = function(funds) {
  for (fund of funds) {
    fund.options = {}
    fund.values = []
    fund.beginDate = ''
    fund.endDate = ''
    fund.perf = ''
  }
  return funds
}

funds = addKeysInFunds(funds)

// Process the CSV file to format it in order to get only the dates and the value of the funds
processCSV = function(data) {
  arr = data.split(/;|\r/);
  valueHistory = arr.reduce(function(acc, current, index, arr) {
    if (index % 2 === 0)
    {
      acc.push({
        date: arr[index],
        value: parseFloat(arr[index + 1]),
      })
      return acc;
    }
    else {
      return acc;
    }
  }, [])
  return valueHistory
}

// Format value history to fit the format needed by highcharts
formatValueHistory = function(valueHistory, beginDate, endDate) {
  const dates = _
  .chain(valueHistory)
  .filter(function(obj) {
    return formatDate(obj.date) >= beginDate && formatDate(obj.date) <= endDate
  })
  .map(function(obj) {
    return obj.date
  })
  .value();
  const values = _
  .chain(valueHistory)
  .filter(function(obj) {
    return formatDate(obj.date) >= beginDate && formatDate(obj.date) <= endDate
  })
  .map(function(obj) {
    return obj.value
  })
  .value();
  return {
    categories: dates,
    data: values,
  }
}

// return an options object that fit the Highcharts format
createHighchartsOptions = function(fundName, categories, data) {
  const options = {
    title: {
      text: 'Evolution de ' + fundName,
      x: -20 //center
    },
    xAxis: {
      categories: categories,
    },
    yAxis: {
      title: {
        text: 'Valeur de la part (€)'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    tooltip: {
      valueSuffix: '€'
    },
    legend: {
      layout: 'vertical',
      align: 'right',
      verticalAlign: 'middle',
      borderWidth: 0
    },
    series: [{
      name: fundName,
      data: data,
    }]
  }
  return options
}

formatDate = function(date) {
  const tab = date.split('-')
  return tab[2]+'-'+tab[1]+'-'+tab[0]
}

// set the options field with respect to the begin and end date and computes the perf
setOptions = function(fund) {
  const valueHistoryObject = formatValueHistory(fund.values, fund.beginDate, fund.endDate)
  fund.options = createHighchartsOptions(fund.name, valueHistoryObject.categories, valueHistoryObject.data)
  const nbValuations = valueHistoryObject.data.length
  fund.perf = numbro(valueHistoryObject.data[nbValuations - 1] / valueHistoryObject.data[0] - 1).format('0.00%')
}

success = function(fund, response) {
  const valueHistory = processCSV(response.body)
  fund.values = valueHistory
  const nbValuations = valueHistory.length
  fund.beginDate = formatDate(fund.values[0].date)
  fund.endDate = formatDate(fund.values[nbValuations - 2].date)
  setOptions(fund)
}

var afer = new Vue({
  el: '.afer',
  data: {
    funds: funds,
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
      for (fund of funds) {
        fund.beginDate = this.globalBeginDate
        fund.endDate = this.globalEndDate
        this.changeFundDate(fund)
      }
    },
    getData: function() {
      for (fund of funds) {
        const reqURL = baseURL + fund.key + '_data.csv'
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
