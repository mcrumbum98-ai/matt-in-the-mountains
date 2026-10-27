import {defineField, defineType} from 'sanity'

export const gearLanding = defineType({
  name: 'gearLanding',
  title: 'Gear Landing',
  type: 'document',

  fields: [
    defineField({
      name: 'heroKicker',
      title: 'Hero Kicker',
      type: 'string',
      initialValue: 'FIELD TESTED / ACTUALLY USED',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroTitle',
      title: 'Hero Title',
      type: 'string',
      initialValue: 'Gear',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroIntro',
      title: 'Hero Introduction',
      type: 'text',
      rows: 3,
      initialValue: 'The equipment that gets packed, scratched, soaked, repaired, waxed, carried and used again.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'introTitle',
      title: 'Introduction Title',
      type: 'string',
      initialValue: 'Find gear by where it takes you.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'introCopy',
      title: 'Introduction Copy',
      type: 'text',
      rows: 4,
      initialValue: "This isn't a storefront. It's a growing library of equipment I actually use, organized around the activities it belongs to. One piece can live in more than one place—because a shell doesn't stop being useful when the season changes.",
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categoriesKicker',
      title: 'Categories Kicker',
      type: 'string',
      initialValue: 'EXPLORE BY ACTIVITY',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'categoriesTitle',
      title: 'Categories Title',
      type: 'string',
      initialValue: 'Pick a direction.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'reviewsKicker',
      title: 'Reviews Kicker',
      type: 'string',
      initialValue: 'FROM THE GEAR ROOM',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'reviewsTitle',
      title: 'Reviews Title',
      type: 'string',
      initialValue: 'Latest reviews.',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'libraryKicker',
      title: 'Library Kicker',
      type: 'string',
      initialValue: 'THE LIBRARY',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'libraryTitle',
      title: 'Library Title',
      type: 'string',
      initialValue: 'All gear.',
      validation: Rule => Rule.required(),
    }),
  ],

  preview: {
    prepare() {
      return {
        title: 'Gear Landing',
        subtitle: 'Gear page editorial copy',
      }
    },
  },
})
