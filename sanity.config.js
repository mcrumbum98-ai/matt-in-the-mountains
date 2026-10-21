import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {gearReview} from './sanity/schemas/gearReview.js'
import {journalPost} from './sanity/schemas/journalPost.js'
import {contentBlock} from './sanity/schemas/contentBlock.js'

export default defineConfig({
  name: 'basecamp',
  title: 'Matt in the Mountains — Basecamp',
  projectId: 'azxzfjey',
  dataset: 'production',
  basePath: '/admin',
  plugins: [structureTool(), visionTool()],
  schema: {types: [gearReview, journalPost, contentBlock]},
})
