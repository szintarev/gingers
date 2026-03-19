import type { Block } from 'payload'

export const Testimonials: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    {
      name: 'subtitle',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'TESTIMONIALS',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
      defaultValue: 'What Our Customers Say',
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      required: false,
    },
    {
      name: 'testimonials',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'role',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          required: true,
          defaultValue: 5,
        },
        {
          name: 'text',
          type: 'textarea',
          localized: true,
          required: true,
        },
      ],
    },
    {
      name: 'overallRating',
      type: 'group',
      fields: [
        {
          name: 'score',
          type: 'number',
          required: true,
          defaultValue: 4.9,
        },
        {
          name: 'maxScore',
          type: 'number',
          required: true,
          defaultValue: 5.0,
        },
        {
          name: 'reviewCountText',
          type: 'text',
          localized: true,
          required: true,
          defaultValue: 'Based on 500+ reviews',
        },
      ],
    },
  ],
  labels: {
    plural: 'Testimonials Blocks',
    singular: 'Testimonials Block',
  },
}
