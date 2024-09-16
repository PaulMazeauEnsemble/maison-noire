
// utils
const isMeshTypeText = ({parent}) => parent?.mesh_type === 'text'
const isMeshTypeMedia = ({parent}) => parent?.mesh_type === 'media'

const isMediaImage = ({parent}) => parent?.media_type === 'image'
const isMediaVideo = ({parent}) => parent?.media_type === 'video'


export default (options = {}) => ({
  ...options,
  type: 'array',
  description: 'Tous les éléments',
  validation: Rule => Rule.min(1).custom((meshes, context) => {
    const meshesWithNoMedia = meshes.filter(mesh => mesh.mesh_type === 'media' && ((mesh.media_type === 'image' && typeof mesh.image === 'undefined') || (mesh.media_type === 'video' && typeof mesh.video === 'undefined')))
    return meshesWithNoMedia.length ? {
      message: 'One element has no image or video assigned',
      paths: meshesWithNoMedia.map(mesh => ({_key: mesh._key}))
    } : true
  }),
  of: [{
    type: 'object',
    name: 'mesh',
    preview: {
      select: {
        mesh_type: 'mesh_type',
        media_type: 'media_type',
        text: 'text',
        media_title: 'title',
      },
      prepare: (item) => {
        if(item.mesh_type === 'text'){
          return {
            title: '(Text) ' + item.text
          }
        } else {
          return {
            title: '(' + item.media_type + ') ' + item.media_title
          }
        }
      }
    },
    fields: [
      {type: 'string', name: 'title'},

      {
        type: 'string',
        name: 'mesh_type',
        initialValue: 'media',
        options: {
          list: [{title: 'Media', value: 'media'}, {title: 'Text', value: 'text'}],
          layout: 'radio'
        }
      },

      // text
      {type: 'string', name: 'text', hidden: isMeshTypeMedia},
      {type: 'number', name: 'text_width', hidden: isMeshTypeMedia},
      {type: 'number', name: 'text_width_mobile', hidden: isMeshTypeMedia},

      // media
      {
        type: 'string',
        name: 'media_type',
        initialValue: 'image',
        options: {
          list: [{title: 'Image', value: 'image'}, {title: 'Video', value: 'video'}],
          layout: 'radio'
        },
        hidden: isMeshTypeText
      },
        // image
        {
          type: 'image',
          name: 'image',
          hidden: arg => isMeshTypeText(arg) || isMediaVideo(arg)
        },
        // video
        {
          type: 'string',
          name: 'local_video',
          hidden: arg => isMeshTypeText(arg) || isMediaImage(arg),
        },
        {
          type: 'string',
          name: 'video',
          hidden: arg => isMeshTypeText(arg) || isMediaImage(arg),
        },
        {
          type: 'string',
          name: 'video_low',
          description: 'Optional',
          hidden: arg => isMeshTypeText(arg) || isMediaImage(arg),
        },
        {
          type: 'boolean',
          name: 'special_shape',
          description: 'Affichage dans la forme de la porte.',
          hidden: arg => isMeshTypeText(arg) || isMediaImage(arg)
        }
    ]
  }]
})