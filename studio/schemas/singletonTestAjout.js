export default {
    name: 'testAjout',
    type: 'document',
    title: '[Section] Test Ajout',
    preview: {
      prepare: ({title}) => ({title: title || 'Test Ajout'}),
    },
    fields: [
      {
        name: 'title',
        type: 'string',
        title: 'Title'
      }
    ]
  }