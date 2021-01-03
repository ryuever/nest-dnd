import React, { useState, useEffect } from 'react'
import { Droppable, Draggable, Provider } from '../../../packages/react/src'
import { getGoods, ItemData } from './data-source'
import './style.css'

const Item = (props) => {
  const { data } = props
  const { id, description}  = data
  return (
    <Draggable draggableId={id}>
      <div className="item">
        {`${id} -- ${description}`}
      </div>
    </Draggable>
  )
}

export default () => {
  const [data, setData] = useState({
    first: [] as Array<ItemData>,
    second: [] as Array<ItemData>,
  })
  useEffect(() => {
    getGoods({ page: 0 }).then((data) => {
      setData({
        first: (data as Array<ItemData>).slice(0, 10),
        second: (data as Array<ItemData>).slice(10),
      })
    })
  }, [])

  const dropEndHandler = (dropResult) => {
    const { source, target, dropReason } = dropResult
    const {
      path: sourcePath
    } = source
    const {
      path: targetPath,
      isForwarding,
    } = target

    if (dropReason === 'CANCEL') {
      return
    }

    const nextData = { ...data }

    let removedItem = null

    sourcePath.reduce((next, cur, index, arr) => {
      if (index !== arr.length - 1) {
        return next[cur]
      }

      const itemIndex = next.findIndex((item) => item.id === cur)
      if (itemIndex !== -1) {
        removedItem = next.splice(itemIndex, 1)[0]
      }
    }, nextData)

    targetPath.reduce((next, cur, index, arr) => {
      if (index !== arr.length - 1) {
        return next[cur]
      }
      const itemIndex = next.findIndex((item) => item.id === cur)

      if (itemIndex !== -1) {
        if (isForwarding) next.splice(itemIndex + 1, 0, removedItem)
        else next.splice(itemIndex, 0, removedItem)
      }
    }, nextData)

    setData(nextData)
  }
  return(
    <Provider onDropEnd={dropEndHandler} >
      <div className="wrapper">
        <Droppable orientation="vertical" droppableId='first'>
          <div className="container">
            {data.first.map(item => <Item data={item} key={item.id} />)}
          </div>
        </Droppable>
        <Droppable orientation="vertical" key="second" droppableId='second'>
          <div className="container">
            {data.second.map(item => <Item data={item} key={item.id} />)}
          </div>
        </Droppable>
      </div>
    </Provider>
  )
}