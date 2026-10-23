import {defineField, defineType} from 'sanity'

const categories = ['Adventures','Projects & DIY','Tips & Skills']
const activities = ['Hiking','Camping','Trail Running','Climbing','Skiing / Touring','Paddling','Road Trip / Travel','Workshop / DIY','General Outdoors']

export const journalPost = defineType({
  name:'journalPost', title:'Journal Post', type:'document',
  groups:[
    {name:'basics',title:'1. Basics',default:true},
    {name:'story',title:'2. Story'},
    {name:'details',title:'3. Details'},
    {name:'organize',title:'4. Organize & Relate'},
  ],
  fields:[
    defineField({name:'title',title:'Title',type:'string',group:'basics',validation:r=>r.required()}),
    defineField({name:'subtitle',title:'Subtitle / Deck',type:'text',rows:2,group:'basics'}),
    defineField({name:'slug',title:'Page URL',type:'slug',group:'basics',options:{source:'title',maxLength:90},validation:r=>r.required()}),
    defineField({name:'heroImage',title:'Hero Photo',type:'image',group:'basics',options:{hotspot:true},fields:[{name:'alt',title:'Alt Text',type:'string'},{name:'caption',title:'Caption',type:'string'}],validation:r=>r.required()}),
    defineField({name:'body',title:'Story',type:'contentBlock',group:'story',validation:r=>r.required()}),
    defineField({name:'category',title:'Kind of Story',type:'string',group:'details',options:{layout:'radio',list:categories},validation:r=>r.required()}),
    defineField({name:'activity',title:'Activity',type:'string',group:'details',options:{list:activities},validation:r=>r.required()}),
    defineField({name:'location',title:'Location',type:'string',group:'details'}),
    defineField({name:'tripDate',title:'Trip / Project Date',type:'date',group:'details'}),
    defineField({name:'projectDetails',title:'Project / DIY Details',type:'object',group:'details',hidden:({document})=>document?.category!=='Projects & DIY',options:{collapsible:true,collapsed:false},fields:[{name:'materials',title:'Materials / Tools',type:'array',of:[{type:'string'}]},{name:'difficulty',title:'Difficulty',type:'string',options:{list:['Easy','Moderate','Advanced']}},{name:'cost',title:'Approximate Cost',type:'string'},{name:'timeRequired',title:'Time Required',type:'string'}]}),
    defineField({name:'tags',title:'Tags',type:'array',group:'organize',of:[{type:'reference',to:[{type:'tag'}]}]}),
    defineField({name:'gearMentioned',title:'Gear From This Story',description:'Choose reviewed gear used or mentioned in this story.',type:'array',group:'organize',of:[{type:'reference',to:[{type:'gearReview'}]}]}),
    defineField({name:'relatedJournal',title:'Related Stories — Manual Picks',description:'Optional. Leave empty to let the site match by activity/category/tags.',type:'array',group:'organize',validation:r=>r.max(4),of:[{type:'reference',to:[{type:'journalPost'}]}]}),
    defineField({name:'featured',title:'Eligible for Featured Areas',description:'Allows this story to appear in featured slots without changing the page layout.',type:'boolean',group:'organize',initialValue:false}),
    defineField({name:'featuredPriority',title:'Featured Priority',type:'number',group:'organize',hidden:({document})=>!document?.featured}),
    defineField({name:'publishedAt',title:'Original Publish Date',type:'datetime',group:'organize'}),
    defineField({name:'updatedAt',title:'Last Meaningful Update',type:'datetime',group:'organize'}),
  ],
  orderings:[{title:'Newest First',name:'publishedDesc',by:[{field:'publishedAt',direction:'desc'}]}],
  preview:{select:{title:'title',category:'category',activity:'activity',media:'heroImage'},prepare:({title,category,activity,media})=>({title,subtitle:[category,activity].filter(Boolean).join(' · '),media})},
})
