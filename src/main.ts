import './style.css'

import { createCard } from './card'
import { createCardEngine } from './card-engine'
import { createArea } from './area'

const engine = createCardEngine()
engine.init()

const card = createCard({
  width: 0.6,
  height: 1,
  depth: 0.001,
  front: './board-restaurant.jpg',
  back: './carnival-midway.jpg',
})

let isAttached = false

const handleClick = () => {
  console.log('clicked')
  card.flip()
  
  isAttached = !isAttached
  if (isAttached) {
    card.attachTo(playerArea)
  } else {
    card.attachTo(table)
  }
}

card.on('click', handleClick)

const table = createArea({
  width: 10,
  height: 7,
  texture: './bg-table2.jpg',
})

const playerArea = createArea({
  width: 8,
  height: 2,
  texture: './bg-table.jpg',
  position: {
    x: 0,
    y: -2.5,
    z: 0.001,
  },
})

engine.add(card)
engine.add(table)
engine.add(playerArea)