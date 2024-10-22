import * as THREE from 'three'
import { EventEmitter } from "./event-emitter"
import { GameObject } from "./game-object"
import { createMaterial } from './material'
import { Position } from './position'
import { Card } from './card'

export type CardPlacement = 'stack' | 'grid' | 'fan'

export type AreaProps = {
  width: number
  height: number
  texture?: string
  position?: Position
  cardPlacement?: CardPlacement
}

export class Area implements GameObject {
  mesh: THREE.Mesh
  cards: Card[] = []

  private eventEmitter = new EventEmitter()
  private props: AreaProps

  private cardPlacement: CardPlacement = 'stack'

  constructor(props: AreaProps) {
    const geometry = new THREE.PlaneGeometry(props.width, props.height)
    const material = createMaterial({
      texture: props.texture
    })
    
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

    this.props = props
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

  get width() {
    return this.props.width
  }

  get height() {
    return this.props.height
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
    if (this.cards.length === 0) {
      return
    }

    if (this.cardPlacement === 'stack') {
      this.placeCardsStacked()
    } else if (this.cardPlacement === 'grid') {
      this.placeCardsGrid()
    } else if (this.cardPlacement === 'fan') {
      this.placeCardsFanned()
    }
  }

  private placeCardsStacked() {
    this.cards.forEach((card, index) => {
      card.rotate(0)
      card.move({
        x: this.mesh.position.x,
        y: this.mesh.position.y,
        z: this.mesh.position.z + index * 0.01
      })
    })
  }

  private placeCardsGrid() {
    const spacing = 0.1
    const cardWidth = this.cards[0].width
    const cardHeight = this.cards[0].height

    const columns = Math.floor((this.width + spacing) / (cardWidth + spacing))

    const rowWidth = (cardWidth + spacing) * Math.min(this.cards.length, columns) - spacing
    const columnHeight = (cardHeight + spacing) * Math.ceil(this.cards.length / columns) - spacing

    this.cards.forEach((card, index) => {
      const column = index % columns
      const row = Math.floor(index / columns)
      
      card.rotate(0)
      card.move({
        x: this.mesh.position.x + (column * cardWidth) + (column * spacing) - rowWidth / 2 + cardWidth / 2,
        y: this.mesh.position.y - (row * cardHeight) - (row * spacing) + columnHeight / 2 - cardHeight / 2,
        z: this.mesh.position.z
      })
    })
  }

  private placeCardsFanned() {
    const fanAngle = Math.min(Math.PI / 40 * this.cards.length, Math.PI / 4); // Max 45 degrees total fan spread
    const fanRadius = this.width / 2
    const centerAngle = -Math.PI / 2 // Center the fan at the top of the area

    this.cards.forEach((card, index) => {
      let cardAngle;
      if (this.cards.length === 1) {
        cardAngle = centerAngle;
      } else {
        cardAngle = centerAngle + (index / (this.cards.length - 1) - 0.5) * fanAngle;
      }

      card.rotate(cardAngle + Math.PI / 2); // Rotate card to face outward
      card.move({
        x: this.mesh.position.x + Math.cos(cardAngle) * fanRadius,
        y: this.mesh.position.y - Math.sin(cardAngle) * fanRadius - fanRadius + card.height / 4,
        z: this.mesh.position.z + index * 0.01 // Slight z-offset for layering
      });
    });
  }
}

export function createArea(props: AreaProps) {
  return new Area(props)
}
