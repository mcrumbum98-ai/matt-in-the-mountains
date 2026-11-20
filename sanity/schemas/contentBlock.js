import {defineArrayMember, defineType} from 'sanity'

const imageFields = [
  {name: 'alt', title: 'Alt Text', type: 'string', description: 'Briefly describe the image for accessibility.'},
  {name: 'caption', title: 'Caption', type: 'string'},
]

export const contentBlock = defineType({
  name: 'contentBlock',
  title: 'Story / Review Content',
  type: 'array',
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Section Heading', value: 'h2'},
        {title: 'Small Heading', value: 'h3'},
        {title: 'Quote', value: 'blockquote'},
      ],
      lists: [{title: 'Bullets', value: 'bullet'}, {title: 'Numbered', value: 'number'}],
      marks: {decorators: [{title: 'Strong', value: 'strong'}, {title: 'Emphasis', value: 'em'}]},
    }),
    defineArrayMember({
      name: 'storyImage',
      type: 'image',
      title: 'Photo',
      options: {hotspot: true},
      fields: [...imageFields, {name: 'layout', title: 'Photo Size', type: 'string', initialValue: 'reading', options: {layout: 'radio', list: [
        {title: 'Normal', value: 'reading'}, {title: 'Full Width', value: 'full'},
      ]}}],
    }),
    defineArrayMember({
      name: 'photoPair', title: 'Photo Pair', type: 'object',
      fields: [
        {name: 'left', title: 'Left Photo', type: 'image', options: {hotspot: true}, fields: imageFields},
        {name: 'right', title: 'Right Photo', type: 'image', options: {hotspot: true}, fields: imageFields},
        {name: 'caption', title: 'Pair Caption', type: 'string'},
      ],
      preview: {prepare: () => ({title: 'Photo Pair'})},
    }),
    defineArrayMember({
      name: 'gallery', title: 'Gallery', type: 'object',
      fields: [
        {name: 'images', title: 'Photos', type: 'array', validation: r => r.min(2), of: [{type: 'image', options: {hotspot: true}, fields: imageFields}]},
        {name: 'caption', title: 'Gallery Caption', type: 'string'},
      ],
      preview: {prepare: () => ({title: 'Gallery'})},
    }),
    defineArrayMember({
      name: 'gearMention', title: 'Gear Mention', type: 'object',
      fields: [
        {name: 'gear', title: 'Gear Review', type: 'reference', to: [{type: 'gearReview'}], validation: r => r.required()},
        {name: 'note', title: 'Optional Note', type: 'string'},
      ],
      preview: {select: {title: 'gear.productName'}, prepare: ({title}) => ({title: title || 'Gear Mention'})},
    }),
    defineArrayMember({
      name: 'callout', title: 'Callout', type: 'object',
      fields: [
        {name: 'heading', title: 'Heading', type: 'string'},
        {name: 'text', title: 'Text', type: 'text', rows: 3, validation: r => r.required()},
      ],
      preview: {select: {title: 'heading'}, prepare: ({title}) => ({title: title || 'Callout'})},
    }),
    defineArrayMember({name: 'divider', title: 'Divider', type: 'object', fields: [{name: 'style', title: 'Style', type: 'string', initialValue: 'standard', options: {list: [{title: 'Standard', value: 'standard'}]}}], preview: {prepare: () => ({title: 'Divider'})}}),
  ],
})
