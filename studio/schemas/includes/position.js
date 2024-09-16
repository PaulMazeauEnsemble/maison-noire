export default () => ({
  type: 'object',
  name: 'position',
  fields: [
    {
      name: 'x',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'y',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'z',
      type: 'number',
      initialValue: 0
    },
    
    {
      name: 'mobile_x',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'mobile_y',
      type: 'number',
      initialValue: 0
    },
    {
      name: 'mobile_z',
      type: 'number',
      initialValue: 0
    },
  ]
})