import {defineField, defineType} from 'sanity'

const activities = ['Hike & Camp','Trail Running','Climbing','Ski & Tour','Paddling','Everyday / Travel','Dog Adventures']
const gearTypes = ['Footwear','Apparel','Pack / Carry','Shelter / Sleep','Cook / Camp','Climbing Equipment','Ski Equipment','Paddle / Boat','Safety','Electronics / Gadgets','Tools & Essentials','Dog Gear','Other']

export const gearReview = defineType({
  name: 'gearReview', title: 'Gear Review', type: 'document',
  groups: [
    {name: 'basics', title: '1. Basics', default: true},
    {name: 'review', title: '2. Review'},
    {name: 'testing', title: '3. Testing & Ratings'},
    {name: 'links', title: '4. Links & Disclosure'},
    {name: 'organize', title: '5. Organize & Relate'},
  ],
  fields: [
    defineField({name:'productName', title:'Product Name', type:'string', group:'basics', validation:r=>r.required()}),
    defineField({name:'brand', title:'Brand', type:'reference', to:[{type:'brand'}], group:'basics', description:'Choose an existing brand or create one once and reuse it.', validation:r=>r.required()}),
    defineField({name:'title', title:'Review Headline', type:'string', group:'basics', description:'The editorial headline visitors will see.', validation:r=>r.required()}),
    defineField({name:'subtitle', title:'Short Deck', type:'text', rows:2, group:'basics'}),
    defineField({name:'slug', title:'Page URL', type:'slug', group:'basics', options:{source:'productName', maxLength:80}, validation:r=>r.required()}),
    defineField({name:'heroImage', title:'Featured / Hero Photo', type:'image', group:'basics', options:{hotspot:true}, fields:[{name:'alt',title:'Alt Text',type:'string'}], validation:r=>r.required()}),
    defineField({name:'overallRating', title:'Overall Rating', description:'0–10. One decimal is allowed.', type:'number', group:'basics', validation:r=>r.required().min(0).max(10).precision(1)}),
    defineField({name:'verdict', title:'Verdict / TL;DR', type:'text', rows:4, group:'review', validation:r=>r.required()}),
    defineField({name:'pros', title:'Pros', type:'array', group:'review', of:[{type:'string'}]}),
    defineField({name:'cons', title:'Cons', type:'array', group:'review', of:[{type:'string'}]}),
    defineField({name:'body', title:'Full Review', type:'contentBlock', group:'review', validation:r=>r.required()}),
    defineField({name:'ownedTested', title:'Owned / Tested Since', type:'string', group:'testing'}),
    defineField({name:'use', title:'Primary Use', type:'string', group:'testing'}),
    defineField({name:'conditions', title:'Where / Conditions Tested', type:'text', rows:2, group:'testing'}),
    defineField({name:'ratingBreakdown', title:'Rating Breakdown', description:'Use whatever categories make sense for this kind of gear.', type:'array', group:'testing', of:[{type:'object', fields:[{name:'label',title:'Rating Category',type:'string',validation:r=>r.required()},{name:'score',title:'Score',type:'number',validation:r=>r.required().min(0).max(10).precision(1)}], preview:{select:{title:'label',score:'score'},prepare:({title,score})=>({title,subtitle:score==null?'No score':`${score}/10`})}}]}),
    defineField({name:'purchaseLinks', title:'Where to Buy', type:'array', group:'links', of:[{type:'object', fields:[{name:'store',title:'Store / Seller',type:'string',validation:r=>r.required()},{name:'url',title:'Purchase URL',type:'url',validation:r=>r.required()},{name:'affiliate',title:'Affiliate Link?',type:'boolean',initialValue:false}], preview:{select:{title:'store',affiliate:'affiliate'},prepare:({title,affiliate})=>({title,subtitle:affiliate?'Affiliate link':'Standard link'})}}]}),
    defineField({name:'howObtained', title:'How I Got It', type:'string', group:'links', options:{layout:'radio',list:['Purchased with my own money','Manufacturer sample','Loaner','Sponsored / paid']}, validation:r=>r.required()}),
    defineField({name:'disclosureNote', title:'Additional Disclosure', type:'text', rows:2, group:'links'}),
    defineField({name:'activity', title:'Activity', type:'string', group:'organize', options:{list:activities}, validation:r=>r.required()}),
    defineField({name:'gearType', title:'Gear Type', type:'string', group:'organize', options:{list:gearTypes}, validation:r=>r.required()}),
    defineField({name:'subtype', title:'Subtype', description:'More specific, e.g. Trail Shoe, Touring Ski, PFD, Headlamp.', type:'string', group:'organize', validation:r=>r.required()}),
    defineField({name:'tags', title:'Tags', type:'array', group:'organize', of:[{type:'reference',to:[{type:'tag'}]}]}),
    defineField({name:'relatedGear', title:'Related Gear — Manual Picks', description:'Optional. If left empty, the site can fall back to matching subtype/type/activity/tags.', type:'array', group:'organize', validation:r=>r.max(4), of:[{type:'reference',to:[{type:'gearReview'}]}]}),
    defineField({name:'relatedJournal', title:'Related Journal Stories', type:'array', group:'organize', of:[{type:'reference',to:[{type:'journalPost'}]}]}),
    defineField({name:'featured', title:'Eligible for Featured Areas', description:'Allows this review to appear in curated/featured slots. It does not change the number of cards on a page.', type:'boolean', group:'organize', initialValue:false}),
    defineField({name:'featuredPriority', title:'Featured Priority', description:'Optional. Higher numbers win when multiple items are featured.', type:'number', group:'organize', hidden:({document})=>!document?.featured}),
    defineField({name:'publishedAt', title:'Original Publish Date', type:'datetime', group:'organize'}),
    defineField({name:'updatedAt', title:'Last Meaningful Update', type:'datetime', group:'organize'}),
  ],
  orderings:[{title:'Newest First',name:'publishedDesc',by:[{field:'publishedAt',direction:'desc'}]},{title:'Highest Rated',name:'ratingDesc',by:[{field:'overallRating',direction:'desc'}]}],
  preview:{select:{title:'productName',brand:'brand.name',rating:'overallRating',media:'heroImage'},prepare:({title,brand,rating,media})=>({title,subtitle:[brand,rating!=null?`${rating}/10`:null].filter(Boolean).join(' · '),media})},
})
