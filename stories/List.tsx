import React from 'react'
import { Droppable } from '../src/react'

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
    <Droppable>
      {/* <div>hello</div> */}
      <B />
    </Droppable>
  )
}