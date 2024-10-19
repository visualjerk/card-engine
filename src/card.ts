import * as THREE from 'three'
import { GameObject } from './game-object'
import { EventEmitter } from './event-emitter'
import { createMaterial } from './material'
import { Position } from './position'
import { Area } from './area'

const ROTATION_STEP = 0.4
const POSITION_STEP = 0.1

export type CardProps = {
  height: number
  width: number
  depth: number
  front: string
  back: string
  position?: Position
}

export class Card implements GameObject {
  mesh: THREE.Mesh

  private eventEmitter = new EventEmitter()
  private isFlipped = false
  private position: Position = {
    x: 0,
    y: 0,
    z: 0,
  }
  private area?: Area

  constructor(props: CardProps) {
    const borderMaterial = createMaterial({ texture: './bg-stone.jpg' })
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

    if (props.position) {
      this.position = props.position
      this.mesh.position.set(this.position.x, this.position.y, this.position.z)
    }
  }

  get uuid() {
    return this.mesh.uuid
  }

  flip() {
    this.isFlipped = !this.isFlipped
  }

  move(position: Position) {
    this.position = position
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
  }

  private updateFlipRotation() {
    // Calculate the target rotation for the card
    const targetRotation = this.isFlipped ? Math.PI : 0;

    // Calculate the rotation difference
    let rotationDifference = Math.abs(targetRotation - this.mesh.rotation.y);

    // If the rotation is close enough to the target, snap to it
    if (rotationDifference < ROTATION_STEP) {
      this.mesh.rotation.y = targetRotation;
      return;
    }

    // Otherwise, continue rotating
    const rotationStep = this.isFlipped ? ROTATION_STEP : -ROTATION_STEP;
    this.mesh.rotation.y += rotationStep
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
