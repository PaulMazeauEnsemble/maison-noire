import listOfMeshes from "./includes/listOfMeshes"

export default {
  name: 'clients',
  type: 'document',
  title: 'Clients',
  fields: [
    {
      type: 'string',
      name: 'title'
    },
    {
      type: 'array',
      name: 'images',
      description: 'Eviter de mettre une image portrait dans une liste de 3 ou 4 images.',
      of: [
        {
          type: 'object',
          name: 'media',
          fields: [
            {
              type: 'boolean',
              name: 'is_image',
              initialValue: true,
            },
            {
              type: 'boolean',
              name: 'is_portrait',
              initialValue: false,
            },
            {
              type: 'image', 
              name: 'image',
              hidden: ({parent}) => !parent.is_image
            },
            {
              type: 'string',
              name: 'video',
              hidden: ({parent}) => parent.is_image
            },
            {
              type: 'string',
              name: 'video_low',
              description: 'optional',
              hidden: ({parent}) => parent.is_image
            },
          ]
        }
      ]
    }
  ]
}