import { Text as TroikaText } from "troika-three-text"
import { isMobile } from "../../utils/utils"

export default class Text {

  constructor({
    scene, 
    text, 
    font,
    lineHeight = "normal", letterSpacing = 0, textAlign = "center",
    maxWidth = 2,
    maxWidthMobile = maxWidth,
  }){
    // props
    this.scene = scene
    this.text = text
    this.lineHeight = lineHeight
    this.letterSpacing = letterSpacing
    this.textAlign = textAlign
    this.maxWidth = maxWidth
    this.maxWidthMobile = maxWidthMobile
    this.font = font

    this.autoInit()
  }

  autoInit(){
    this.mesh = new TroikaText()
    this.scene.add(this.mesh)

    this.mesh.anchorX = 'center'
    this.mesh.anchorY = 'middle'
    this.mesh.lineHeight = this.lineHeight
    this.mesh.letterSpacing = this.letterSpacing
    this.mesh.textAlign = this.textAlign
    this.mesh.maxWidth = isMobile() ? this.maxWidthMobile : this.maxWidth
    this.mesh.text = this.text
    this.mesh.fontSize = 0.1
    if(this.font){
      this.mesh.font = this.font[0].src
    }
  }

}