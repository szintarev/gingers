import type { Block } from 'payload'

export const ImageCarousel: Block = {
  slug: 'imageCarousel',
  interfaceName: 'ImageCarouselBlock',
  fields: [
    {
      name: 'slides',
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
        {
          name: 'caption',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'sub',
          type: 'text',
          localized: true,
          required: true,
        },
      ],
    },
  ],
  labels: {
    plural: 'Image Carousel Blocks',
    singular: 'Image Carousel Block',
  },
}
