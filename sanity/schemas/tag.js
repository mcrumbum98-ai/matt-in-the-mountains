import {defineField, defineType} from 'sanity'

export const tag = defineType({
  name: 'tag',
  title: 'Tag',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Tag Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: r => r.required()}),
    defineField({name: 'description', title: 'Internal Note', description: 'Optional. Helps you remember how this tag should be used.', type: 'text', rows: 2}),
  ],
  preview: {select: {title: 'name'}},
})
