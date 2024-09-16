import * as THREE from "three"
import PlaneImage from "../webgl/components/PlaneImage"
import PlaneVideo from "../webgl/components/PlaneVideo"
import Text from "../webgl/components/Text"
import AssetsManager from "./AssetsManager"
import FastRandom from "fast-random"
import { randomInteger, randomItem } from "./random"
import { isBrowser, isMobile } from "./utils"


const Z_SPACE_BETWEEN = (isBrowser() && isMobile()) ? -9 : -9

const GRID_Z_BASE = -4.5
const GRID_X_LENGTH = 14
const GRID_Y_LENGTH = 7

const GRID_FULL_WIDTH = 26

const GRID_COLS = 3
const GRID_ROWS = 3

const LANDSCAPE_SIZES = [4/12, 5/12, 6/12]
const PORTRAIT_SIZES = [3/12, 4/12]

const DEBUG = false


const setPosition = (x, y, vector, logType) => {
  vector.set(
    GRID_X_LENGTH * x / GRID_COLS,
    GRID_Y_LENGTH * y / GRID_ROWS,
  )

  if(logType && DEBUG){
    console.log(`${logType}: (${x};${y}) -> (${vector.x};${vector.y})`)
  }

  return {x, y}
} 
const setRandomPosition = (fs, vector) => {

  const x = randomInteger(fs, 1 - GRID_COLS, GRID_COLS - 1)
  const y = randomInteger(fs, 1 - GRID_ROWS, GRID_ROWS - 1)  

  return setPosition(x, y, vector, 'random')
}

const setNextPosition = (fs, vector, previous) => {
  const availableCols = Array((GRID_COLS - 1) * 2 + 1).fill(1).map((_, index) => {
    const val = (index - (GRID_COLS - 1))
    return val > previous.x + 1 || val < previous.x - 1 ? val : undefined
  }).filter(n => n !== undefined)
  const availableRows = Array((GRID_ROWS - 1) * 2 + 1).fill(1).map((_, index) => {
    const val = (index - (GRID_ROWS - 1))
    return val > previous.y + 1 || val < previous.y - 1 ? val : undefined
  }).filter(n => n !== undefined)

  const x = randomItem(fs, availableCols)
  const y = randomItem(fs, availableRows)

  return setPosition(x, y, vector, DEBUG && 'next')
}

const getPlaneSize = (fs, ratio) => {
  const size = ratio > 1 ? randomItem(fs, LANDSCAPE_SIZES) : randomItem(fs, PORTRAIT_SIZES)
  return size * GRID_FULL_WIDTH
}

export const createScene = ({elements, stage, startOffset = 0} = {}) => {

  const seed = Date.now() + stage.uid
  if(DEBUG){
    console.log(`===> create scene ${stage.uid}: seed = ${seed}`)
  }

  const fs = FastRandom(seed)
  const gridPosition = new THREE.Vector2()
  let z = GRID_Z_BASE + startOffset

  if(elements[0].mesh_type === 'media' && startOffset){
    z += GRID_Z_BASE * 1.5
  }

  if(stage.uid === 0){
    z += GRID_Z_BASE * 2
  }

  const createdElements = []

  let previous;

  elements.forEach((el, index) => {

    let mesh;
    let setOpacity, getOpacity;

    if(el.mesh_type === "text"){
      const text = new Text({
        scene: stage.scene,
        text: el.text,
        maxWidth: el.text_width,
        maxWidthMobile: el.text_width_mobile || el.text_width,
        font: AssetsManager.fonts.beautyClassicMedium
      })
      mesh = text.mesh
      mesh._isTroikaText = true

      setOpacity = function(val){
        mesh.material.opacity = val
        mesh.visible = val > 0
      }
      getOpacity = function(){return mesh.material.opacity}

      mesh.userData.near = -3
      mesh.userData.nearLength = 2

      createdElements.push(text)

    }
    else if(el.mesh_type === "media" && el.media_type === "image"){
      const image = new PlaneImage({
        scene: stage.scene,
        texture: el.preloadedAssetReference,
      })
      image.init()
      mesh = image.plane
      const size = getPlaneSize(fs, image.ratio)
      image.plane.scale.y = 1 / image.ratio
      image.plane.scale.multiplyScalar(size)
      setOpacity = function(val){
        mesh.material.uniforms.uOpacity.value = val
        mesh.visible = val > 0
      }
      getOpacity = function(){return mesh.material.uniforms.uOpacity.value}

      createdElements.push(image)

    }
    else if(el.mesh_type === "media" && el.media_type === "video"){
      const video = new PlaneVideo({
        scene: stage.scene,
        texture: el.preloadedAssetReference,
        specialShape: el.special_shape,
        getSize: ratio => getPlaneSize(fs, ratio)
      })
      video.init()

      mesh = video.plane
      mesh.userData.element = video


      setOpacity = function(val){
        mesh.material.uniforms.uOpacity.value = val
        mesh.visible = val > 0
      }
      getOpacity = function(){return mesh.material.uniforms.uOpacity.value}

      createdElements.push(video)

    }

    mesh.userData.setOpacity = setOpacity
    mesh.userData.getOpacity = getOpacity

    if(el.mesh_type !== "text"){
      if(previous){
        previous = setNextPosition(fs, gridPosition, previous)
      } else {
        // previous = setPosition(0, 0, gridPosition)
        previous = setRandomPosition(fs, gridPosition)
      }

      mesh.position.x = gridPosition.x
      mesh.position.y = gridPosition.y
    }

    mesh.position.z = z
    z += Z_SPACE_BETWEEN
    stage.sceneElements.push(mesh)

  })


  stage.end.position = isMobile() ? z - Z_SPACE_BETWEEN / 2 :  z
  stage.end.threshold = 10

  return createdElements

}

export const showGridHelper = ({stage}) => {

  let group = new THREE.Group()
  stage.scene.add(group)
  // stage.scene.add(stage.camera)
  group.position.z = GRID_Z_BASE * 3

  for(let c = 0; c < (GRID_COLS - 1) * 2 + 1; c++){
    const col = (c - (GRID_COLS - 1))

    for(let r = 0; r < (GRID_ROWS - 1) * 2 + 1; r++){  
      const row = (r - (GRID_ROWS - 1))
      // const row = GRID_COLS

      let mesh = new THREE.Mesh(
        new THREE.SphereGeometry(0.1),
        new THREE.MeshBasicMaterial({color: "red"})
      )
      group.add(mesh)
      setPosition(col, row, mesh.position)


    }
  }

}