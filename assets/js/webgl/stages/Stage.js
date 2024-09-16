
let uid = 0
export default class Stage {

  constructor(props){
    this.uid = uid++


    this.attached = false
    this.opened = false

  }

  // attached to navigation.next or .navigationcurrent
  onAttached(){
    this.attached = true
    // console.log("attaching", this.uid)
  }

  // detached to navigation.next or .navigationcurrent
  onDetached(){
    this.attached = false
    this.onClosed()
    // console.log("detaching", this.uid)
  }

  // become visible
  onOpened(){
    this.opened = true
    // console.log("opened", this.uid)
  }

  // completely close
  onClosed(){
    this.opened = false
    // console.log("closed", this.uid)
  }


  destroy(){console.warn("must defined implementation .destroy()")}
  getPortalPercent(){console.warn("must defined implementation .getPortalPercent()")}
  getTexture(){console.warn("must defined implementation .getTexture()")}

}