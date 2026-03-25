import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ProcessBlock } from '@/blocks/Process/Component'
import { FarmStepsBlock } from '@/blocks/FarmSteps/Component'
import { TestimonialsBlock } from '@/blocks/Testimonials/Component'
import { StatsBlock } from '@/blocks/Stats/Component'
import { AboutBlock } from '@/blocks/About/Component'
import { FeaturesBlock } from '@/blocks/Features/Component'
import { ImageCarouselBlock } from '@/blocks/ImageCarousel/Component'
import { HeroBlock } from '@/blocks/Hero/Component'
import { PartnershipBlock } from '@/blocks/Partnership/Component'
import { ProductsBlockComponent } from '@/blocks/Products/Component'
import { CartBlockComponent } from '@/blocks/Cart/Component'
import { SingleProductBlockComponent } from '@/blocks/SingleProduct/Component'
import { ProductsGridBlockComponent } from '@/blocks/ProductsGrid/Component'

const blockComponents = {
  cta: CallToActionBlock,
  process: ProcessBlock,
  farmSteps: FarmStepsBlock,
  testimonials: TestimonialsBlock,
  stats: StatsBlock,
  about: AboutBlock,
  features: FeaturesBlock,
  imageCarousel: ImageCarouselBlock,
  hero: HeroBlock,
  partnership: PartnershipBlock,
  products: ProductsBlockComponent,
  cart: CartBlockComponent,
  singleProduct: SingleProductBlockComponent,
  productsGrid: ProductsGridBlockComponent,
}

export const RenderBlocks: React.FC<{
  blocks: Page['layout'][0][]
}> = (props) => {
  const { blocks } = props

  const hasBlocks = blocks && Array.isArray(blocks) && blocks.length > 0

  if (hasBlocks) {
    return (
      <Fragment>
        {blocks.map((block, index) => {
          const { blockType } = block

          if (blockType && blockType in blockComponents) {
            const Block = blockComponents[blockType as keyof typeof blockComponents]

            if (Block) {
              if (blockType === 'cart') {
                return <Block key={index} {...(block as any)} disableInnerContainer />
              }
              return (
                <div key={index}>
                  <Block {...(block as any)} disableInnerContainer />
                </div>
              )
            }
          }
          return null
        })}
      </Fragment>
    )
  }

  return null
}
