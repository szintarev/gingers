import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
}

export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span className={clsx('font-bold text-xl tracking-tight text-[#8B1538]', className)}>
      Gingers
    </span>
  )
}
