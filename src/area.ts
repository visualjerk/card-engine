import * as THREE from 'three'
import { EventEmitter } from "./event-emitter"
import { GameObject } from "./game-object"
import { createMaterial } from './material'
import { Position } from './position'
import { Card } from './card'

export type CardPlacement = 'stack' | 'grid' |'fanned'

export type AreaProps = {
  width: number
  height: number
  texture: string
  position?: Position
  cardPlacement?: CardPlacement
}

export class Area implements GameObject {
  mesh: THREE.Mesh

  private eventEmitter = new EventEmitter()
  private cardPlacement: CardPlacement = 'stack'
  private cards: Card[] = []

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

    if (props.cardPlacement) {
      this.cardPlacement = props.cardPlacement
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

  add(card: Card) {
    this.cards.push(card)
    this.placeCards()
  }

  remove(card: Card) {
    this.cards = this.cards.filter(c => c.uuid !== card.uuid)
    this.placeCards()
  }

  private placeCards() {
    if (this.cardPlacement === 'stack') {
      this.placeCardsStacked()
    }
  }

  private placeCardsStacked() {
    this.cards.forEach((card, index) => {
      card.move({
        x: this.mesh.position.x,
        y: this.mesh.position.y,
        z: this.mesh.position.z + index * 0.01
      })
    })
  }
}

export function createArea(props: AreaProps) {
  return new Area(props)
}
