import { Color } from '../common/types.ts'

/**
 * A util function that returns a random color from the available
 * color pool, excluding the current one
 * @param {string} currentColor  The current color name/hex
 * @param {Color[]} colors  An array of the available Color objects AKA the color pool
 * @returns {string} The random color
 */
export const getRandomColor = (currentColor: number, colors: Color[]) => {
  const colorPool = colors.reduce((acc, next) => {
    if ((next.name || next.hex) !== currentColor) {
      acc.push(next.name || next.hex)
    }
    return acc;
  }, [])

  return colorPool[Math.floor(Math.random() * colorPool.length)];
}
