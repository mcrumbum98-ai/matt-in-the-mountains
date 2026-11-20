import {defineField, defineType} from 'sanity'

export const journalLanding = defineType({
  name: 'journalLanding',
  title: 'Journal Landing',
  type: 'document',

  fields: [
    defineField({
      name: 'mastheadTitle',
      title: 'Masthead Title',
      type: 'string',
      description: 'Large headline at the top of the Journal page.',
      initialValue: 'Things worth bringing home.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'mastheadIntro',
      title: 'Masthead Introduction',
      type: 'text',
      rows: 3,
      description: 'Short introduction beneath the Journal masthead.',
      initialValue: 'Adventures, projects, useful mistakes and photographs from wherever curiosity happens to lead.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'storiesTitle',
      title: 'Stories Section Title',
      type: 'string',
      description: 'Headline above the Journal story feed.',
      initialValue: 'Stories along the trail.',
      validation: Rule => Rule.required(),
    }),

    defineField({
      name: 'storiesIntro',
      title: 'Stories Section Introduction',
      type: 'text',
      rows: 3,
      description: 'Optional short introduction above the story feed.',
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Journal Landing',
        subtitle: 'Journal page editorial copy',
      }
    },
  },
})
