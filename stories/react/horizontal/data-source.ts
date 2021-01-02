const batchCount = 20

export type ItemData = {
  id: number;
  title: string;
  count: number;
  description: string;
}

export const goodsDataGenerator = ({ page }): Array<ItemData> => {
  const results = []

  for (let i = 0; i < batchCount; i++) {
    const index = page * batchCount + i
    results.push({
      id: index,
      title: `goods-${index}`,
      count: Math.floor(Math.random() * 10) + 1,
      description: `category-${index}`,
    })
  }

  return results
}

export const getGoods = ({ page }) => new Promise(resolve => {
  setTimeout(() => {
    resolve(goodsDataGenerator({ page }))
  }, 300)
})
