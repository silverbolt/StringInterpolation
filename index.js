/**
 * 插值模板字符串的解析
 * eg:
 *   |parseTemplate(tmpString, contenxt) // => top：23，B部：44
 *   |--tmpString = 'top：@{a.b}，B部：@{b.c}'，
 *   |--context = { a: {b:1}, b: {c:2}  }
 */
const STATS = {
  START: 0,
  TEXT: 1,
  VAR_START: 2
}

function moveCursorTo(s, cursor, targetChar) {
  let value = ''
  while (s[cursor] !== targetChar && cursor < s.length) {
    value += s[cursor]
    cursor++
  }
  return { value, nextCursor: cursor }
}

/**
 * extra tokens, a token like：{ type: 'var', value: 'a.b' }
 * @param {*} tmpStr
 * @param {*} signChar
 * @returns
 */
function extraTokens(tmpStr, signChar = '$') {
  const strSegments = []
  const size = tmpStr.length

  let state = STATS.BEFORE,
    cursor = 0

  while (cursor < size) {
    const c = tmpStr[cursor]
    switch (state) {
      case STATS.TEXT:
        const txtInfo = moveCursorTo(tmpStr, cursor, signChar)
        strSegments.push({ type: 'text', value: txtInfo.value })
        cursor = txtInfo.nextCursor + 1
        state = STATS.VAR_START
        break
      case STATS.BEFORE:
        if (c === signChar) {
          state = STATS.VAR_START
          cursor++
        } else {
          state = STATS.TEXT
        }
        break
      case STATS.VAR_START:
        if (c === '{') {
          cursor++
          const varInfo = moveCursorTo(tmpStr, cursor, '}')
          if (varInfo.nextCursor < size) {
            strSegments.push({ type: 'var', value: varInfo.value })
            cursor = varInfo.nextCursor + 1
            state = STATS.BEFORE
          } else {
            strSegments.push({ type: 'text', value: '${' + varInfo.value })
            cursor = varInfo.nextCursor
            break
          }
        } else {
          state = STATS.TEXT
        }
        break
      default:
        break
    }
  }
  return strSegments
}

/**
 * do interpolations
 * @param {String} keyChain
 * @param {Object} context
 * @returns String
 */
function doInterpolations(keyChain, context) {
  const keys = keyChain.split('.')
  let val = context
  for (let i = 0; i < keys.length; i++) {
    if (val[keys[i]] !== undefined) {
      val = val[keys[i]]
    } else {
      val = ''
      break
    }
  }
  return val
}

/**
 * string interpolation replacement
 * @param {String} s
 * @param {Object} context
 * @returns String
 */
function parseTemplate(s, context) {
  const strSegments = extraTokens(s)

  return strSegments
    .map((tag) => {
      if (tag.type === 'var') {
        return doInterpolations(tag.value, context)
      }
      return tag.value
    })
    .join('')
}

module.exports = {
  extraTokens,
  doInterpolations,
  parseTemplate
}
