import React, { useState, useEffect  } from 'react'
import { Droppable, Draggable, Provider } from '../../packages/react/src'
import { getGoods, ItemData } from './data-source'
import './style.css'

const Item = (props) => {
  const { data } = props
  const { id, title, description}  = data
  return (
    <Draggable>
      <div className="horizontal-item">
        {id}
      </div>
    </Draggable>
  )
}

export default () => {
  const [data, setData] = useState([] as Array<ItemData>)
  useEffect(() => {
    getGoods({ page: 0 }).then(data => setData(data as Array<ItemData>))
  }, [])

  return(
    <Provider>
      <div className="wrapper">
        <Droppable orientation="horizontal">
          <div className="horizontal-container">
            {data.map(item => <Item data={item} key={item.id} />)}
          </div>
        </Droppable>
        <Droppable orientation="horizontal" key="second">
          <div className="horizontal-container">
            {data.map(item => <Item data={item} key={item.id} />)}
          </div>
        </Droppable>
      </div>
    </Provider>
  )
}