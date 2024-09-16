
export default {
  name: 'settings',
  type: 'document',
  title: '[Section] Settings',
  preview: {
    prepare: ({state}) => ({title: 'Settings'}),
  },
  fields: [
    {
      type: 'string',
      name: 'title'
    }
  ]
}