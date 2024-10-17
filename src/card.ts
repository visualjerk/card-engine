import * as THREE from 'three'
import { GameEvents, GameObject } from './game-object'

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
  eventEmitter = new THREE.EventDispatcher<{ click: {} }>()

  private isFlipped = false

  constructor(props: CardProps) {
    const borderTexture = new THREE.TextureLoader().load('./bg-stone.jpg')
    borderTexture.colorSpace = THREE.SRGBColorSpace
    const borderMaterial = new THREE.MeshBasicMaterial({ map: borderTexture })
  
    const frontTexture = new THREE.TextureLoader().load(props.front)
    frontTexture.colorSpace = THREE.SRGBColorSpace
    const frontMaterial = new THREE.MeshBasicMaterial({ map: frontTexture })
  
    const backTexture = new THREE.TextureLoader().load(props.back)
    backTexture.colorSpace = THREE.SRGBColorSpace
    const backMaterial = new THREE.MeshBasicMaterial({ map: backTexture })
  
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

  on(event: keyof GameEvents, callback: (event: GameEvents[keyof GameEvents]) => void) {
    this.eventEmitter.addEventListener(event, callback)
    return () => this.eventEmitter.removeEventListener(event, callback)
  }

  dispatch(event: keyof GameEvents) {
    this.eventEmitter.dispatchEvent({ type: event })
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
