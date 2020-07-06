function summaryRanges(arr){
  let _arr = []
  const resultArr = []
  arr.forEach((val, idx) => {
    const len = _arr.length
    if (len) {
      const lastVal = _arr[len - 1]
      if (val - lastVal === 1) {
        _arr[1] = val
      } else {
        resultArr.push(_arr.join('->'))
        _arr = [val]
      }
    } else {
      _arr[0] = val
    }
    if (idx === arr.length - 1) {
      resultArr.push(_arr.join('->'))
    }
  })
  console.log(resultArr)
  return resultArr
}
summaryRanges([0])
