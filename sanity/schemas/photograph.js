import {defineField, defineType} from 'sanity'

export const photograph = defineType({
  name: 'photograph',
  title: 'Photograph',
  type: 'document',

  fields: [
    defineField({
      name: 'title',
      title: 'Photo Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'image',
      title: 'Original Photograph',
      type: 'image',
      description: 'Upload your original photograph. The website will preserve its composition and aspect ratio.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          description: 'A short description for visitors using screen readers.',
        }),
      ],
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'description',
      title: 'Description / Story',
      type: 'text',
      rows: 4,
    }),

    defineField({
      name: 'location',
      title: 'Location',
      type: 'string',
    }),

    defineField({
      name: 'dateTaken',
      title: 'Date Taken',
      type: 'date',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      media: 'image',
    },
  },
})
