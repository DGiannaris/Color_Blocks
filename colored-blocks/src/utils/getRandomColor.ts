import { Color } from '../common/types.ts'

export const getRandomColor = (currentColor: number, colors: Color[]) => {
  const colorPool = colors.reduce((acc, next) => {
    if ((next.name || next.hex) !== currentColor) {
      acc.push(next.name || next.hex)
    }
    return acc;
  }, [])

  return colorPool[Math.floor(Math.random() * colorPool.length)];
}
