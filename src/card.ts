import * as THREE from 'three'
import { GameObject } from './game-object'
import { EventEmitter } from './event-emitter'
import { createMaterial } from './material'

const ROTATION_STEP = 0.4

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
  private isFlipped = false

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
  }

  get uuid() {
    return this.mesh.uuid
  }

  flip() {
    this.isFlipped = !this.isFlipped
  }

  get on() {
    return this.eventEmitter.on.bind(this.eventEmitter)
  }

  get dispatch() {
    return this.eventEmitter.dispatch.bind(this.eventEmitter)
  }

  update() {
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
}

export function createCard(props: CardProps) {
  return new Card(props)
}
