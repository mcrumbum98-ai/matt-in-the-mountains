import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {gearReview} from './sanity/schemas/gearReview.js'
import {journalPost} from './sanity/schemas/journalPost.js'
import {contentBlock} from './sanity/schemas/contentBlock.js'
import {brand} from './sanity/schemas/brand.js'
import {tag} from './sanity/schemas/tag.js'

const structure = (S) => S.list()
  .title('Basecamp')
  .items([
    S.listItem().title('Gear Reviews').schemaType('gearReview').child(S.documentTypeList('gearReview').title('Gear Reviews')),
    S.listItem().title('Journal Posts').schemaType('journalPost').child(S.documentTypeList('journalPost').title('Journal Posts')),
    S.divider(),
    S.listItem().title('Brands').schemaType('brand').child(S.documentTypeList('brand').title('Brands')),
    S.listItem().title('Tags').schemaType('tag').child(S.documentTypeList('tag').title('Tags')),
  ])

export default defineConfig({
  name:'basecamp',
  title:'Matt in the Mountains — Basecamp',
  projectId:'azxzfjey',
  dataset:'production',
  basePath:'/admin',
  plugins:[structureTool({structure}), visionTool()],
  schema:{types:[gearReview,journalPost,brand,tag,contentBlock]},
})
