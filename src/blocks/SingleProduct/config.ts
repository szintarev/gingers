import type { Block } from 'payload'

export const SingleProductBlock: Block = {
  slug: 'singleProduct',
  interfaceName: 'SingleProductBlock',
  fields: [
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
      label: 'Product',
    },
  ],
  labels: {
    plural: 'Single Product Blocks',
    singular: 'Single Product Block',
  },
}
