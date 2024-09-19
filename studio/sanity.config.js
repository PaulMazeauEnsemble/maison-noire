import {defineConfig} from 'sanity'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {colorInput} from '@sanity/color-input'
import {structureTool} from 'sanity/structure'
import {documentInternationalization} from '@sanity/document-internationalization'

const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["settings", "manifeste", "client_list", 'contact', 'about'])

export default defineConfig({
  name: 'default',
  title: 'Maison noire',

  projectId: 'q6ujozhq',
  dataset: 'development',

  plugins: [
    structureTool(),
    visionTool(),
    colorInput(),
    documentInternationalization({
      supportedLanguages: [
        {id: 'fr', title: 'Francais'},
        {id: 'en', title: 'English'}
      ],
      schemaTypes: ['manifeste', 'contact', 'about'],
      languageField: `language`
    })
  ],

  schema: {
    types: schemaTypes,
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})