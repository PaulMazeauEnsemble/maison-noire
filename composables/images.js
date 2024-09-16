import imageUrlBuilder from '@sanity/image-url'

export const useOptimizedImageUrl = () => {

  const sanity = useSanity()

  const builder = imageUrlBuilder(sanity.config)
  const urlFor = source => builder.image(source)

  return {getOptimizedUrl: (asset, {width} = {}) => urlFor(asset).width(width).auto('format').url()}

}