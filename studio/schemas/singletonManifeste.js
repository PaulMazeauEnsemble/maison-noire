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
      type: 'string',
      name: 'language',
      title: 'Language',
      options: {
        list: [
          {title: 'Francais', value: 'fr'},
          {title: 'English', value: 'en'}
        ]
      }
    },
    {
      type: 'array',
      name: 'scenes',
      of: [{type: 'scene'}]
    },
  ]
}