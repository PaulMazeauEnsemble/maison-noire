import listOfMeshes from "./includes/listOfMeshes"

export default {
  name: 'manifeste',
  type: 'document',
  title: '[Section] Philosophie',
  preview: {
    prepare: ({state}) => {
      return {
        title: 'Philosophie'
      }
    }
  },
  fields: [
    {
      type: 'array',
      name: 'scenes',
      of: [{type: 'scene'}]
    },
  ]
}