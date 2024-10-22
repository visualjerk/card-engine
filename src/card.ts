import * as THREE from 'three'
import { GameObject } from './game-object'
import { EventEmitter } from './event-emitter'
import { createMaterial } from './material'
import { Position } from './position'
import { Area } from './area'

const ROTATION_STEP = 0.4
const POSITION_STEP = 0.1

export type CardVisibility = 'faceup' | 'facedown'

export type CardProps = {
  height: number
  width: number
  depth: number
  front: string
  back: string
}

export class Card implements GameObject {
  mesh: THREE.Mesh

  private eventEmitter = new EventEmitter()
  private visibility: CardVisibility = 'facedown'
  private position: Position = {
    x: 0,
    y: 0,
    z: 0,
  }
  private rotation = 0
  private area?: Area
  private props: CardProps

  constructor(props: CardProps) {
    const borderMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 })
    const frontMaterial = createMaterial({ texture: props.front })
    const backMaterial = createMaterial({ texture: props.back })

    const geometry = new THREE.BoxGeometry(props.width, props.height, props.depth)

    this.mesh = new THREE.Mesh(geometry, [
      borderMaterial,
      borderMaterial,
      borderMaterial,
      borderMaterial,
      frontMaterial,
      backMaterial,
    ])
    this.props = props
  }

  get uuid() {
    return this.mesh.uuid
  }

  get width() {
    return this.props.width
  }

  get height() {
    return this.props.height
  }
  
  get depth() {
    return this.props.depth
  }

  flip() {
    this.visibility = this.visibility === 'facedown' ? 'faceup' : 'facedown'
  }

  setVisibility(visibility: CardVisibility) {
    this.visibility = visibility
  }

  move(position: Position) {
    this.position = position
  }

  rotate(rotation: number) {
    this.rotation = rotation
  }

  placeOn(area: Area) {
    if (this.area) {
      this.area.remove(this)
    }

    this.area = area
    area.add(this)
  }

  get on() {
    return this.eventEmitter.on.bind(this.eventEmitter)
  }

  get dispatch() {
    return this.eventEmitter.dispatch.bind(this.eventEmitter)
  }

  update() {
    this.updateFlipRotation()
    this.updatePosition()
    this.updateRotation()
  }

  private updateFlipRotation() {
    // Calculate the target rotation for the card
    const targetRotation = this.visibility === 'faceup' ? Math.PI : 0;

    // Calculate the rotation difference
    let rotationDifference = Math.abs(targetRotation - this.mesh.rotation.y);

    // If the rotation is close enough to the target, snap to it
    if (rotationDifference < ROTATION_STEP) {
      this.mesh.rotation.y = targetRotation;
      return;
    }

    // Otherwise, continue rotating
    const rotationStep = this.visibility === 'faceup' ? ROTATION_STEP : -ROTATION_STEP;
    this.mesh.rotation.y += rotationStep
  }

  private updateRotation() {
    // Update the mesh step by step towards the target rotation
    this.mesh.rotation.z += (this.rotation - this.mesh.rotation.z) * ROTATION_STEP
  }

  private updatePosition() {
    // Update the mesh step by step towards the target position
    const targetX = this.position.x
    const targetY = this.position.y
    const targetZ = this.position.z

    this.mesh.position.x += (targetX - this.mesh.position.x) * POSITION_STEP
    this.mesh.position.y += (targetY - this.mesh.position.y) * POSITION_STEP
    this.mesh.position.z += (targetZ - this.mesh.position.z) * POSITION_STEP
  }
}

export function createCard(props: CardProps) {
  return new Card(props)
}
