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

const area = createArea({
  width: 10,
  height: 10,
  texture: './bg-table2.jpg',
})

const handleClick = () => {
  console.log('clicked')
  card.flip()
}

card.on('click', handleClick)

engine.add(card)
engine.add(area)