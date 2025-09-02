import React from 'react'
import { DashedLine } from '@/utils/Illustrations'

const Divider = ({ className = "" }) => {
  return (
    <div>
      <DashedLine className="w-[100%]" />
    </div>
  )
}

export default Divider
