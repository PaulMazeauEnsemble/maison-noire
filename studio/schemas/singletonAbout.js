
export default {
  name: 'about',
  type: 'document',
  title: '[Section] Page Notre Maison',
  preview: {
    prepare: ({state}) => ({title: 'Page Notre Maison'}),
  },
  groups: [
    {name: 'hero', title: 'Hero'},
    {name: 'group2', title: 'Conception & Direction artistique'},
    {name: 'group3', title: 'La réalisation'},
    {name: 'group4', title: 'La Production'},
    {name: 'group5', title: 'La Post-production'},
    {name: 'group6', title: "L'origine"},
    {name: 'group7', title: "Equipe interne"},
    {name: 'group8', title: "Emplacement"},
  ],
  fields: [

    {
      type: 'array',
      name: 'blocs',
      of: [{
        type: 'object',
        fields: [
          {
            type: 'string',
            name: 'title',
          },
          {
            type: 'text',
            name: 'desktop_title',
          },
          {
            type: 'text',
            name: 'mobile_title',
          },
          {
            type: 'string',
            name: 'subtitle',
            description: 'Titre affiché dans le paragraphe.'
          },
          {
            type: 'text',
            name: 'description',
          },
          {
            type: 'array',
            name: 'images',
            validation: Rule => Rule.max(2),
            of: [{
              type: 'image',
            }]
          }
        ]
      }]
    },
  ]
}