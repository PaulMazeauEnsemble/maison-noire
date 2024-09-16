import listOfMeshes from "./includes/listOfMeshes";



export default {
  name: 'scene',
  type: 'document',
  title: 'Manifeste Scene',
  fields: [
    {
      type: 'string',
      name: 'title'
    },
    {type: 'string', name: 'fixed_text'},
    {type: 'number', name: 'text_box_size', initialValue: 1, validation: Rule => Rule.min(0).max(3).precision(3) },
    {type: 'number', name: 'text_box_size_mobile', initialValue: 1, validation: Rule => Rule.min(0).max(3).precision(3) },
    {
      type: 'object',
      name: 'gradient',
      description: 'Hex value like : #FF0000',
      fields: [
        {type: 'string', name: 'color_1_start'},
        {type: 'string', name: 'color_2_start'},
        {type: 'string', name: 'color_3_start'},
        {type: 'string', name: 'color_1_end'},
        {type: 'string', name: 'color_2_end'},
        {type: 'string', name: 'color_3_end'},
      ]
    },
    listOfMeshes({
      title: 'List',
      name: 'list',
    })
  ]
}