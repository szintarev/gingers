import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'

/*==================================================================
    BLOCK IMPORTS
==================================================================*/
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
import { PromiseBlockComponent } from '@/blocks/Promise/Component'
import { TrustStatsBlockComponent } from '@/blocks/TrustStats/Component'

/*==================================================================
    BLOCK MAP — slug → component
==================================================================*/
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
  promise: PromiseBlockComponent,
  trustStats: TrustStatsBlockComponent,
}

/*==================================================================
    RENDER BLOCKS
    Maps the page layout array to block components in order.
    Some blocks have layout-specific wrappers (dividers, offsets).
==================================================================*/
export const RenderBlocks: React.FC<{ blocks: Page['layout'][0][] }> = ({ blocks }) => {
  if (!blocks?.length) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block
        if (!blockType || !(blockType in blockComponents)) return null

        const Block = blockComponents[blockType as keyof typeof blockComponents]
        if (!Block) return null

        // Full-bleed cart page — no wrapper
        if (blockType === 'cart') {
          return <Block key={index} {...(block as any)} disableInnerContainer />
        }

        // About block gets a top divider line in brand color
        if (blockType === 'about') {
          return (
            <div key={index}>
              <div style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                <div style={{ height: '1px', backgroundColor: '#8B1538', maxWidth: '80rem', marginLeft: 'auto', marginRight: 'auto' }} />
              </div>
              <Block {...(block as any)} disableInnerContainer />
            </div>
          )
        }

        // FarmSteps overlaps with section above by 1px to avoid rendering gap
        if (blockType === 'farmSteps') {
          return (
            <div key={index} style={{ marginTop: '-1px' }}>
              <Block {...(block as any)} disableInnerContainer />
            </div>
          )
        }

        return (
          <div key={index}>
            <Block {...(block as any)} disableInnerContainer />
          </div>
        )
      })}
    </Fragment>
  )
}
