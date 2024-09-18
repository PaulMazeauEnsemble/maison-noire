import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemas'
import {colorInput} from '@sanity/color-input'


const singletonActions = new Set(["publish", "discardChanges", "restore"])
const singletonTypes = new Set(["settings", "manifeste", "client_list", 'contact', 'about'])

export default defineConfig({
  name: 'default',
  title: 'Maison noire',

  projectId: 'q6ujozhq',
  dataset: 'development',

  plugins: [
    deskTool(),
    deskTool({
      structure: (S) =>
        S.list()
          .title("Content")
          .items([

            // Our singleton type has a list item with a custom child
            S.listItem()
              .title("Settings")
              .id("settings")
              .child(
                // Instead of rendering a list of documents, we render a single
                // document, specifying the `documentId` manually to ensure
                // that we're editing the single instance of the document
                S.document()
                  .schemaType("settings")
                  .documentId("settings")
              ),
            // S.listItem()
            //   .title("Manifeste")
            //   .id("manifeste")
            //   .child(
            //     // Instead of rendering a list of documents, we render a single
            //     // document, specifying the `documentId` manually to ensure
            //     // that we're editing the single instance of the document
            //     S.document()
            //       .schemaType("manifeste")
            //       .documentId("manifeste")
            //   ),

            // Regular document types
            // S.documentTypeListItem("blogPost").title("Blog Posts"),
            // S.documentTypeListItem("author").title("Authors"),
          ]),
    }),
    visionTool(),
    colorInput()
  ],

  schema: {
    types: schemaTypes,

    // Filter out singleton types from the global “New document” menu options
    templates: (templates) =>
      templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
  },

  document: {
    // For singleton types, filter out actions that are not explicitly included
    // in the `singletonActions` list defined above
    actions: (input, context) =>
      singletonTypes.has(context.schemaType)
        ? input.filter(({ action }) => action && singletonActions.has(action))
        : input,
  },
})
