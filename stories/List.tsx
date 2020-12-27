import React from 'react'
import { Droppable, Draggable } from '../src/react'

const B = (props: any) => {
  const { forwardRef } = props

  return (
    <div ref={forwardRef}>
      next
    </div>
  )
}

export default () => {
  return (
    <>
      <Draggable>
        <div>hello</div>
      </Draggable>
      <Droppable>
        <B />
      </Droppable>
    </>
  )
}