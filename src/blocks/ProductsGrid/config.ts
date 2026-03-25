import type { Block } from 'payload'

export const ProductsGridBlock: Block = {
  slug: 'productsGrid',
  interfaceName: 'ProductsGridBlock',
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
    plural: 'Products Grid Blocks',
    singular: 'Products Grid Block',
  },
}
