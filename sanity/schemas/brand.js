import {defineField, defineType} from 'sanity'

export const brand = defineType({
  name: 'brand',
  title: 'Brand',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Brand Name', type: 'string', validation: r => r.required()}),
    defineField({name: 'slug', title: 'Slug', type: 'slug', options: {source: 'name'}, validation: r => r.required()}),
    defineField({name: 'website', title: 'Brand Website', type: 'url'}),
  ],
  preview: {select: {title: 'name'}},
})
