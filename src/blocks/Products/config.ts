import type { Block } from 'payload'

export const ProductsBlock: Block = {
  slug: 'products',
  interfaceName: 'ProductsBlock',
  fields: [
    {
      name: 'label',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'OUR PRODUCTS',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'Fresh From the Farm',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: false,
    },
  ],
  labels: {
    plural: 'Products Blocks',
    singular: 'Products Block',
  },
}
