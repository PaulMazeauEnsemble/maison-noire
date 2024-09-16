import * as THREE from "three"

export default class CameraControls {

  constructor({eventTarget = window} = {}){

    // props
    this.eventTarget = eventTarget

    // privates
    this.mouse = {
      last: new THREE.Vector2(),
      lerped: new THREE.Vector2(),
      smooth: 0.1
    }

    // binds
    this.onMouseMove = this.onMouseMove.bind(this)

    this.autoInit()
  }

  // events
  onMouseMove(event){
    this.mouse.last.set((2 * event.x - window.innerWidth) / window.innerWidth, (2 * event.y - window.innerHeight) / window.innerHeight)
  }

  // core
  autoInit(){
    this.eventTarget.addEventListener("mousemove", this.onMouseMove)
  }

  update(stage){
    this.mouse.lerped.lerp(this.mouse.last, this.mouse.smooth)
    if(stage){

      stage.camera.position.x = -this.mouse.lerped.x * 5e-1
      stage.camera.position.y = this.mouse.lerped.y * 2e-1

      if(stage.cameraTarget){
        stage.camera.lookAt(stage.cameraTarget)
      }

      stage.camera.rotation.y = -this.mouse.lerped.x * 0.05
      stage.camera.rotation.x = -this.mouse.lerped.y * 0.05
      // stage.quad.material.uniforms.uControlsOffset.value[0] = this.mouse.lerped.x
      // stage.quad.material.uniforms.uControlsOffset.value[1] = this.mouse.lerped.y
    }
  }

}