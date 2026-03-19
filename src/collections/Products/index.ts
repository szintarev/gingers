import type { CollectionConfig } from 'payload'

import { slugField } from 'payload'
import { anyone } from '../../access/anyone'
import { authenticated } from '../../access/authenticated'
import { autoTranslateHook } from '../../hooks/autoTranslate'
import { revalidateProduct, revalidateProductDelete } from './hooks/revalidateProduct'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'price', 'status', 'updatedAt'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    slugField({ fieldToUse: 'title' }),
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: true,
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'in-stock',
      options: [
        { label: 'In Stock', value: 'in-stock' },
        { label: 'Out of Stock', value: 'out-of-stock' },
        { label: 'Pre-order', value: 'pre-order' },
      ],
      required: true,
    },
    {
      name: 'images',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'features',
      type: 'array',
      fields: [
        {
          name: 'feature',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'ingredients',
      type: 'array',
      fields: [
        {
          name: 'ingredient',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'nutritionFacts',
      type: 'array',
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'value',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateProduct, autoTranslateHook],
    afterDelete: [revalidateProductDelete],
  },
}
