import { randomBoolean, randomInteger, randomItem } from "./random"


function setIfDefined(val, defaultValue){
  return typeof val !== "undefined" ? val : defaultValue()
}

export const oneImagePositions = ({fs, isMobile, force = {}, images}) => {

  const oneIsPortrait = images[0].is_portrait


  const isLeft = setIfDefined(force.isLeft, () => randomBoolean(fs))
  const isTop = setIfDefined(force.isTop, () => oneIsPortrait ? true : randomBoolean(fs))
  const isSmall = false

  return {
    type: 'one',
    style: [{
      gridColumn: getGridColumn(fs, isSmall, isLeft, isMobile, oneIsPortrait), 
      gridRow: getGridRow(fs, isSmall, isTop, isMobile)
    }],
    params: {
      isLeft, isTop, isSmall
    }
  }
}

export const twoImagesPositions = ({fs, left = undefined, isMobile, images} = {}) => {

  const oneIsPortrait = images.findIndex(img => img.is_portrait)

  const isSmall = randomBoolean(fs)
  const isLeft = typeof left === "undefined" ? randomBoolean(fs) : left
  const isTop = oneIsPortrait === -1 ? randomBoolean(fs) : oneIsPortrait === 0 ? true : false

  return {
    type: 'two',
    style: [
      {gridColumn: getGridColumn(fs, isSmall, isLeft, isMobile, images[0].is_portrait), gridRow: getGridRow(fs, isSmall, isTop, isMobile, images[0].is_portrait)},
      {gridColumn: getGridColumn(fs, !isSmall, !isLeft, isMobile, images[1].is_portrait), gridRow: getGridRow(fs, !isSmall, !isTop, isMobile, images[1].is_portrait)},
    ]
  }
}

export const getGridColumn = (fs, isSmall, isLeft = true, isMobile, isPortrait) => {

  if(isMobile){
    const size = isPortrait ? 2 : 5
    const start = isLeft ? isPortrait ? randomInteger(fs, 1, 2) : 1 : isPortrait ? randomInteger(fs, 4, 5) : 3
    const end = start + size  
    return `${start}/${end}`
  } else {
    const size = isPortrait ? 3 : 4
    const start = isLeft ? 1 : 13 - size
    const end = start + size  
    return `${start}/${end}`
  }

}

export const getGridRow = (fs, isSmall, isTop = true, isMobile, isPortrait) => {
  const size = isSmall ? 2 : 4
  
  if(isMobile){
    return isTop ? 2 : 6
  } else {
    return isTop ? isPortrait ? 2 : randomInteger(fs, 2, Math.max(2, 6 - size)) : isPortrait ? 2 : 5
  }
}