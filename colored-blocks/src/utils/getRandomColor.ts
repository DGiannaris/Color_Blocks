import { Color } from '../common/types.ts'

export const getRandomColor = (currentColor: number, colors: Color[]) => {
  const colorPool = colors.reduce((acc, next) => {
    if (next.name !== currentColor) {
      acc.push(next.name)
    }
    return acc;
  }, [])

  return colorPool[Math.floor(Math.random() * colorPool.length)];
}
