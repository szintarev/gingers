'use client'
import React from 'react'
import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<{ link?: { label?: string } }>()

  const label = data?.data?.link?.label
    ? `${data?.data?.link?.label}`
    : `Link ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}`

  return <div>{label}</div>
}
