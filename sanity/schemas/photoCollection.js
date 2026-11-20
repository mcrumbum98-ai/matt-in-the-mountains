import {defineField, defineType} from 'sanity'

export const photoCollection = defineType({
  name: 'photoCollection',
  title: 'Photo Collection',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Collection Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'slug',
      title: 'Collection URL',
      type: 'slug',
      options: {source: 'title', maxLength: 80},
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Collection Description',
      type: 'text',
      rows: 3,
    }),

    defineField({
      name: 'coverPhoto',
      title: 'Collection Cover Photograph',
      type: 'reference',
      to: [{type: 'photograph'}],
      description: 'Choose an uploaded photograph to represent this collection on the Photography landing page.',
    }),

    defineField({
      name: 'photographs',
      title: 'Photographs in This Collection',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'photograph'}]}],
      description: 'Select existing photographs. Drag them to arrange their order. A photograph can appear in multiple collections without being uploaded again.',
      validation: Rule => Rule.unique(),
    }),

    defineField({
      name: 'showOnLanding',
      title: 'Show on Photography Landing Page',
      type: 'boolean',
      initialValue: true,
    }),

    defineField({
      name: 'displayOrder',
      title: 'Collection Display Order',
      type: 'number',
      description: 'Lower numbers appear first on the Photography landing page.',
      initialValue: 10,
    }),
  ],

  orderings: [
    {
      title: 'Landing Page Order',
      name: 'displayOrderAsc',
      by: [{field: 'displayOrder', direction: 'asc'}],
    },
  ],

  preview: {
    select: {
      title: 'title',
      media: 'coverPhoto.image',
    },
  },
})
