
export default {
  name: 'client_list',
  type: 'document',
  title: '[Section] Références',
  preview: {
    prepare: ({state}) => ({title: 'Références'}),
  },
  fields: [
    {
      type: 'array',
      name: 'list',
      of: [{type: 'reference', to: [{type: 'clients'}]}]
    }
  ]
}