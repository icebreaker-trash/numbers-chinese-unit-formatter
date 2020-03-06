import {
  curryN,
  __,
  compose,
  prop,
  values,
  join
} from 'ramda'
import {
  Decimal
} from 'decimal.js';
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
      _compose.unshift(smallUnitIdx, bigUnitIdx)
    } else {
      _compose.unshift(bigUnitIdx)
      _findCompose(smallUnitIdx)
    }
  }
  _findCompose(idx)
  return _compose.map(x => unitMap[x]).join('')
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

const _internal = curryN(
  4, //curried次数
  /**
   * 
   * @param {Number|String} value 
   * @param {Number} startbounds 
   * @param {Array|Number} unitArr 单位或单位数组，可以上进到的
   * @param {Number} digits 缩进后的小数位
   */
  function (value, startbounds = 7, unitArr = [8, 4], digits = 2) {

    const orignValue = new Decimal(value)
    let _digits = Math.max(digits, 0)
    let _unitArray = Array.isArray(unitArr) ? unitArr : [unitArr]

    return getNumberByUnit(orignValue, _unitArray, _digits, startbounds)

  }

)

const defaultIndenter = _internal(__, undefined, undefined, undefined)

const getFullText = compose(join(''), values)

export const getNumberFullText = compose(getFullText, defaultIndenter)

export const getNumberNumText = compose(prop('num'), defaultIndenter)

export const getNumberUnitText = compose(prop('unit'), defaultIndenter)

export default getNumberFullText

export const getNumberCustomFullText = compose(getFullText, _internal)