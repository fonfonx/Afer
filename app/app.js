const baseURL = 'https://www.afer.asso.fr/amcharts/'

const funds = [
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
  }
]

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

var afer = new Vue({
  el: '.afer',
  data: {
    message: 'Hello Afer!',
    funds: funds,
    values: [],
  },
  methods: {
    getData: function() {
      fundValues = [];
      for (fund of funds) {
        const reqURL = baseURL + fund.key + '_data.csv';
        this.$http.get(reqURL).then((response) => {
          // success callback
          const valueHistory = processCSV(response.body);
          fundValues.push({
            key: fund.key,
            history: valueHistory,
          })
        }, (response) => {
          // error callback
          console.log('Unable to fetch csv');
        });
      }
      this.values = fundValues;
    }
  },

})
