import React from 'react'
import type { FarmStepsBlock as FarmStepsBlockProps } from '@/payload-types'
import { ProcessBlock } from '@/blocks/Process/Component'

// FarmSteps has an identical field structure to Process, so it shares the same component.
export const FarmStepsBlock = ProcessBlock as unknown as React.FC<FarmStepsBlockProps>
