export default {
  name: 'contact',
  type: 'document',
  title: '[Section] Page Contact',
  preview: {
    prepare: ({state}) => ({title: 'Page Contact'}),
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
      name: 'list',
      of: [{
        type: 'object',
        name: 'person',
        fields: [
          {type: 'string', name: 'name'},
          {type: 'string', name: 'role'},
          {type: 'string', name: 'email'},
        ]
      }]
    },
    {
      type: 'text',
      name: 'address'
    },
    {
      type: 'array',
      name: 'socials',
      of: [{
        type: 'object',
        fields: [
          {type: 'string', name: 'label'},
          {type: 'url', name: 'url'}
        ]
      }]
    }
  ]
}