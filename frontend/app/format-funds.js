/* Functions related to formatting the funds array */

// Format funds list
function addKeysInFunds(funds) {
  for (let fund of funds) {
    fund.options = {}
    fund.values = []
    fund.beginDate = ''
    fund.endDate = ''
    fund.perf = ''
  }
  return funds
}

// Process the CSV file to format it in order to get only the dates and the value of the funds
function processCSV(data) {
  const arr = data.split(/;|\r/);
  const valueHistory = arr.reduce(function(acc, current, index, arr) {
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

module.exports = {
  addKeysInFunds: addKeysInFunds,
  processCSV: processCSV,
}
