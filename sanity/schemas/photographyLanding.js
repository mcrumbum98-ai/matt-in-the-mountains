import {defineField, defineType} from 'sanity'

export const photographyLanding = defineType({
  name: 'photographyLanding',
  title: 'Photography Landing',
  type: 'document',
  fields: [
    defineField({
      name: 'introHeading',
      title: 'Introduction Heading',
      type: 'string',
      description: 'First line of the exhibition heading.',
      initialValue: 'Not a gallery.',
    }),
    defineField({
      name: 'introEmphasis',
      title: 'Introduction Italic Line',
      type: 'string',
      initialValue: 'A way through.',
    }),
    defineField({
      name: 'introDescription',
      title: 'Introduction Description',
      type: 'text',
      rows: 3,
      initialValue: 'Scroll slowly. The photographs keep their original compositions; the page moves around them.',
    }),
    defineField({
      name: 'featuredPhotographs',
      title: 'Five Featured Photographs',
      type: 'array',
      description: 'Choose exactly five photographs, in exhibition order. Each position has its own existing animation.',
      of: [
        {
          type: 'object',
          name: 'featuredPhotograph',
          title: 'Featured Photograph',
          fields: [
            defineField({
              name: 'photograph',
              title: 'Photograph',
              type: 'reference',
              to: [{type: 'photograph'}],
              validation: Rule => Rule.required(),
            }),
            defineField({
              name: 'caption',
              title: 'Exhibition Caption',
              type: 'string',
              description: 'Example: HIGH COUNTRY / 01',
            }),
          ],
          preview: {
            select: {
              title: 'photograph.title',
              subtitle: 'caption',
              media: 'photograph.image',
            },
          },
        },
      ],
      validation: Rule => Rule.max(5),
    }),
    defineField({
      name: 'exhibitionStatement',
      title: 'Exhibition Statement',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Three lines displayed during the immersive exhibition.',
      initialValue: [
        'GO FAR ENOUGH',
        'TO BRING SOMETHING',
        'BACK WITH YOU.',
      ],
      validation: Rule => Rule.max(3),
    }),
    defineField({
      name: 'outroHeading',
      title: 'Closing Heading',
      type: 'string',
      initialValue: 'The photographs belong to the stories.',
    }),
    defineField({
      name: 'outroDescription',
      title: 'Closing Description',
      type: 'text',
      rows: 3,
      initialValue: 'Some eventually become Journal entries. Some stay as moments. Either way, they were made outside.',
    }),
  ],
  preview: {
    prepare: () => ({title: 'Photography Landing'}),
  },
})
