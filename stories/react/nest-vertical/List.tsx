import React, { useState, useEffect } from 'react'
import { Droppable, Draggable, Provider } from '../../../packages/react/src'
import { getGoods, ItemData } from './data-source'
import './style.css'

const Item = (props) => {
  const { value } = props
  const { id, description}  = value
  return (
    <Draggable draggableId={id}>
      <div className="nest-item">
        {`${id} -- ${description}`}
      </div>
    </Draggable>
  )
}

const Group = props => {
  const { value } = props
  const { id, data } = value
  return (
    <Droppable droppableId={id} draggable groupId="list">
      <div className="nest-group">
        <span className="nest-group-title">{id}</span>
        {data.map(value => <Item value={value} key={value.id}/>)}
      </div>
    </Droppable>
  )
}

export default () => {
  const [data, setData] = useState([])
  useEffect(() => {
    getGoods({ page: 0 }).then((data) => {
      setData([{
        id: 'first',
        data: (data as Array<ItemData>).slice(0, 5),
      }, {
        id: 'second',
        data: (data as Array<ItemData>).slice(5),
      }])
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

    const nextData = data.slice()

    let removedItem = null

    sourcePath.slice(1).reduce((next, cur, index, arr) => {
      if (index !== arr.length - 1) {
        const index = next.findIndex(({ id }) => id === cur)
        if (index !== -1) return next[index].data
      }

      const itemIndex = next.findIndex((item) => item.id === cur)
      if (itemIndex !== -1) {
        removedItem = next.splice(itemIndex, 1)[0]
      }
    }, nextData)

    targetPath.slice(1).reduce((next, cur, index, arr) => {
      if (index !== arr.length - 1) {
        const index = next.findIndex(({ id }) => id === cur)
        if (index !== -1) return next[index].data
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
      <Droppable droppableId="group" groupId="wrapper">
        <div className="nest-wrapper">
          {data.map(value => <Group value={value} key={value.id} />)}
        </div>
      </Droppable>
    </Provider>
  )
}