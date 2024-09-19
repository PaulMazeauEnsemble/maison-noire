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

  update(stage) {
    this.mouse.lerped.lerp(this.mouse.last, this.mouse.smooth);
    if (stage) {
      // Limiter les mises à jour de la caméra
      if (Math.abs(this.mouse.lerped.x - this.mouse.last.x) > 0.01 || Math.abs(this.mouse.lerped.y - this.mouse.last.y) > 0.01) {
        stage.camera.position.x = -this.mouse.lerped.x * 0.5;
        stage.camera.position.y = this.mouse.lerped.y * 0.2;
  
        if (stage.cameraTarget) {
          stage.camera.lookAt(stage.cameraTarget);
        }
  
        stage.camera.rotation.y = -this.mouse.lerped.x * 0.05;
        stage.camera.rotation.x = -this.mouse.lerped.y * 0.05;
      }
    }
  }

}