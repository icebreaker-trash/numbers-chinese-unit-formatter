import {
  curryN,
  __,
  compose,
  prop,
  values,
  join,

} from 'ramda'
import {
  Decimal
} from 'decimal.js'
const unitMap = {
  0: '',
  1: '十',
  2: '百',
  3: '千',
  4: '万',
  8: '亿',
  12: '兆',
}

const parseInt10 = curryN(2, parseInt)(__, 10)
const unitIdxArray = Object.keys(unitMap).map(parseInt10).reverse()

/**
 * 根据idx获得中文单位
 * @param {Number} idx 单位的位数,如 7为千万, 14为百兆
 */
export function getUnitText(idx) {
  const _compose = []
  /**
   * 递归组合各种各样的中文单位
   * @param {Number} factor 
   */
  function _findCompose(factor) {
    const bigUnitIdx = unitIdxArray.find(x => x <= factor) || 0
    const smallUnitIdx = Math.max(factor - bigUnitIdx, 0)
    if (unitIdxArray.includes(smallUnitIdx)) {
      _compose.push(bigUnitIdx, smallUnitIdx, )
    } else {
      _compose.push(bigUnitIdx)
      _findCompose(smallUnitIdx)
    }
  }
  _findCompose.call(this,idx)
  return _compose.reduceRight((acc, cur) => {
    acc.push(unitMap[cur])
    return acc
  }, []).join('')
}


/**
 * 
 * @param {import('decimal.js').Decimal} orignValue 
 * @param {Array} unitArray 
 * @param {Number} digits 
 * @param {Number} sbs 
 */
function getNumberByUnit(orignValue, unitArray, digits, sbs) {
  let num, unit = ''
  const il = orignValue.floor().toString().length
  let _unitIdx = il > sbs ? unitArray.findIndex(x => x < il) : -1
  if (_unitIdx > -1) {
    num = orignValue.div(Math.pow(10, unitArray[_unitIdx]))
    unit = getUnitText(unitArray[_unitIdx])
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

const curriedWrapper = curryN(
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

    return getNumberByUnit(orignValue, _unitArray, _digits, bounds)

  }

)



const defaultIndenter = curriedWrapper(__, 7, [8, 4], 2)

const getFullText = compose(join(''), values)

export const filters = {
  defaultIndenter,
  defaultFullText: compose(getFullText, defaultIndenter),
  defaultNumText: compose(prop('num'), defaultIndenter),
  defaultUnitText: compose(prop('unit'), defaultIndenter),
  customIndenter: curriedWrapper,
  customFullText: compose(getFullText, curriedWrapper),
  customNumText: compose(prop('num'), curriedWrapper),
  customUnitText: compose(prop('unit'), curriedWrapper)
}

export default filters.defaultFullText