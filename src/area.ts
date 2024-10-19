import * as THREE from 'three'
import { EventEmitter } from "./event-emitter"
import { GameObject } from "./game-object"
import { createMaterial } from './material'

export type AreaProps = {
  width: number
  height: number
  texture: string
  position?: {
    x: number
    y: number
    z: number
  }
}

export class Area implements GameObject {
  mesh: THREE.Mesh

  private eventEmitter = new EventEmitter()

  constructor(props: AreaProps) {
    const geometry = new THREE.PlaneGeometry(props.width, props.height)
    const material = createMaterial({ texture: props.texture })
    
    this.mesh = new THREE.Mesh(
      geometry,
      material
    )
    
    if (props.position) {
      this.mesh.position.set(props.position.x, props.position.y, props.position.z)
    }
  }

  get uuid() {
    return this.mesh.uuid
  }

  get on() {
    return this.eventEmitter.on.bind(this.eventEmitter)
  }

  get dispatch() {
    return this.eventEmitter.dispatch.bind(this.eventEmitter)
  }

  update() {
    // do nothing
  }
}

export function createArea(props: AreaProps) {
  return new Area(props)
}
