import {
  curryN,
  __,
  compose,
  prop,
  values,
  join,
  mergeRight
} from 'ramda'
import {
  Decimal
} from 'decimal.js'
import defaultConfig from '../defaults'


const parseInt10 = curryN(2, parseInt)(__, 10)
const getFullText = compose(join(''), values)

function Formatter(instanceConfig = {}) {
  this.defaults = instanceConfig


  Object.entries(mergeRight(defaultConfig, instanceConfig))
    .forEach(([k, v]) => {
      this[k] = v
    })
  this.unitIdxArray = Object.keys(this.unitMap).map(parseInt10).reverse()
  // forEach(([k, v]) => set(lensProp(k), v, this)), toPairs(mergeRight(defaultConfig, instanceConfig))
}

Formatter.prototype.getUnitText = function (idx) {
  const _compose = []
  /**
   * 递归组合各种各样的中文单位
   * @param {Number} factor 
   */
  function _findCompose(factor) {
    const bigUnitIdx = this.unitIdxArray.find(x => x <= factor) || 0
    const smallUnitIdx = Math.max(factor - bigUnitIdx, 0)
    if (this.unitIdxArray.includes(smallUnitIdx)) {
      _compose.push(bigUnitIdx, smallUnitIdx, )
    } else {
      _compose.push(bigUnitIdx)
      _findCompose.call(this, smallUnitIdx)
    }
  }
  _findCompose.call(this, idx)
  return _compose.reduceRight((acc, cur) => {
    acc.push(this.unitMap[cur])
    return acc
  }, []).join('')
}

Formatter.prototype.getNumberByUnit = function (orignValue, unitArray, digits, sbs) {
  let num, unit = ''
  const il = orignValue.floor().toString().length
  let _unitIdx = il > sbs ? unitArray.findIndex(x => x < il) : -1
  if (_unitIdx > -1) {
    num = orignValue.div(Math.pow(10, unitArray[_unitIdx]))
    unit = this.getUnitText(unitArray[_unitIdx])
  } else {
    num = orignValue
    unit = ''
  }
  //下面那行代码会在转小数时默认抹0
  //如不需要可以加直接toFixed(digits)
  return {
    num: num.toFixed(Math.min(num.dp(), digits)),
    unit
  }
}

Formatter.prototype.curriedWrapper = curryN(
  4, //curried次数
  /**
   * 
   * @param {Number|String} value 格式化值，须满足Decimal格式
   * @param {Number} bounds 开始格式化边界索引
   * @param {Array|Number} unitArr 单位或单位数组，可以上进到的
   * @param {Number} digits 缩进后的小数位
   */
  function (value, bounds, unitArr, digits) {
    const orignValue = new Decimal(value)
    let _digits = Math.max(digits, 0)
    let _unitArray = Array.isArray(unitArr) ? unitArr : [unitArr]
    return this.getNumberByUnit(orignValue, _unitArray, _digits, bounds)
  }

)

Formatter.prototype.createFilters = function () {
  const defaultIndenter = this.curriedWrapper(__, 7, [8, 4], 2)
  return {
    defaultIndenter,
    defaultFullText: compose(getFullText, defaultIndenter),
    defaultNumText: compose(prop('num'), defaultIndenter),
    defaultUnitText: compose(prop('unit'), defaultIndenter),
    customIndenter: this.curriedWrapper,
    customFullText: compose(getFullText, this.curriedWrapper),
    customNumText: compose(prop('num'), this.curriedWrapper),
    customUnitText: compose(prop('unit'), this.curriedWrapper)
  }
}

export default Formatter