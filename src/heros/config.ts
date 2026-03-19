import type { Field } from 'payload'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'lowImpact',
      label: 'Type',
      options: [
        { label: 'None', value: 'none' },
        { label: 'High Impact', value: 'highImpact' },
        { label: 'Medium Impact', value: 'mediumImpact' },
        { label: 'Low Impact', value: 'lowImpact' },
      ],
      required: true,
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
      },
    }),
    {
      name: 'title',
      type: 'text',
      localized: true,
      defaultValue: 'Premium Ginger Products',
      validate: (value: string | null | undefined, { siblingData }: { siblingData: { type?: string } }) => {
        if (siblingData?.type === 'highImpact' && !value) return 'Title is required for High Impact hero'
        return true
      },
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      defaultValue: 'Experience the pure, natural taste of our handcrafted ginger products',
      validate: (value: string | null | undefined, { siblingData }: { siblingData: { type?: string } }) => {
        if (siblingData?.type === 'highImpact' && !value) return 'Description is required for High Impact hero'
        return true
      },
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      validate: (value: unknown, { siblingData }: { siblingData: { type?: string } }) => {
        if (['highImpact', 'mediumImpact'].includes(siblingData?.type ?? '') && !value)
          return 'Media is required for High/Medium Impact hero'
        return true
      },
      admin: {
        condition: (_, { type } = {}) => ['highImpact', 'mediumImpact'].includes(type),
      },
    },
    {
      name: 'features',
      type: 'array',
      maxRows: 3,
      admin: {
        condition: (_, { type } = {}) => ['highImpact'].includes(type),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
          localized: true,
          required: false,
        },
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Award', value: 'Award' },
            { label: 'Leaf', value: 'Leaf' },
            { label: 'Heart', value: 'Heart' },
          ],
        },
      ],
    },
  ],
  label: false,
}
