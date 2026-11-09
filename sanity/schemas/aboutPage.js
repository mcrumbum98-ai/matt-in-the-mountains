import {defineField, defineType} from 'sanity'

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
      name: 'heading',
      title: 'Page Heading',
      type: 'string',
      initialValue: 'Outside, usually.',
    }),
    defineField({
      name: 'portrait',
      title: 'Portrait Photograph',
      type: 'image',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'portraitCaption',
      title: 'Portrait Caption',
      type: 'string',
      initialValue: 'Somewhere outside, which is generally the point.',
    }),
    defineField({
      name: 'introduction',
      hidden: true,
      title: 'Introduction',
      type: 'text',
      rows: 4,
      description: 'The opening paragraph of your About page.',
    }),
    defineField({
      name: 'richIntroduction',
      title: 'Introduction',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Formatted introduction. Takes precedence over the original plain-text field.',
    }),
    defineField({
      name: 'richBiography',
      title: 'Biography',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Formatted biography. Takes precedence over the original plain-text field.',
    }),
    defineField({
      name: 'biography',
      hidden: true,
      title: 'Main Biography',
      type: 'text',
      rows: 12,
      description: 'Your main About page writing. Separate paragraphs with blank lines.',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'About Page',
        subtitle: 'Personal introduction and biography',
      }
    },
  },
})
