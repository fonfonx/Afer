/* Functions related to highcharts and to change of dates in graphs */
var _ = require('lodash')
var numbro = require('numbro')

import { processCSV } from './format-funds'

// Format value history to fit the format needed by highcharts
function formatValueHistory(valueHistory, beginDate, endDate) {
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
function createHighchartsOptions (fundName, categories, data) {
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

function formatDate(date) {
  const tab = date.split('-')
  return tab[2]+'-'+tab[1]+'-'+tab[0]
}

// set the options field with respect to the begin and end date and computes the perf
function setOptions(fund) {
  const valueHistoryObject = formatValueHistory(fund.values, fund.beginDate, fund.endDate)
  fund.options = createHighchartsOptions(fund.name, valueHistoryObject.categories, valueHistoryObject.data)
  const nbValuations = valueHistoryObject.data.length
  fund.perf = numbro(valueHistoryObject.data[nbValuations - 1] / valueHistoryObject.data[0] - 1).format('0.00%')
}

function success(fund, response) {
  const valueHistory = processCSV(response.body)
  fund.values = valueHistory
  const nbValuations = valueHistory.length
  fund.beginDate = formatDate(fund.values[0].date)
  fund.endDate = formatDate(fund.values[nbValuations - 2].date)
  setOptions(fund)
}

module.exports = {
  setOptions: setOptions,
  success: success,
}
