window._ = require('lodash');

Vue.use(require('../node_modules/vue-highcharts/dist/vue-highcharts.js'));

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
]

addKeysInFunds = function(funds) {
  for (fund of funds) {
    fund.options = {}
    fund.values = []
    fund.beginDate = ''
    fund.endDate = ''
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
formatValueHistory = function(valueHistory) {
  const dates = _
  .chain(valueHistory)
  .map(function(obj) {
    return obj.date
  })
  .value();
  const values = _
  .chain(valueHistory)
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
    subtitle: {
      text: 'Source: afer.asso.fr',
      x: -20
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

success = function(fund, response) {
  const valueHistory = processCSV(response.body)
  fund.values = valueHistory
  const nbValuations = valueHistory.length
  const valueHistoryObject = formatValueHistory(fund.values)
  fund.options = createHighchartsOptions(fund.name, valueHistoryObject.categories, valueHistoryObject.data)
  fund.beginDate = formatDate(fund.values[0].date)
  fund.endDate = formatDate(fund.values[nbValuations - 2].date)
}

var afer = new Vue({
  el: '.afer',
  data: {
    message: 'Hello Afer!',
    funds: funds,
  },
  mounted:function() {
    this.getData()
  },
  methods: {
    getData: function() {
      for (fund of funds) {
        const reqURL = baseURL + fund.key + '_data.csv';
        this.$http.get(reqURL)
        .then(
          // success callback
          success.bind(null, fund)
        )
        .catch((response) => {
          // error callback
          console.log('Unable to fetch csv');
        })
      }
    }
  },
})
