import { createCard } from './card'
import { createCardEngine } from './card-engine'
import './style.css'

const engine = createCardEngine()
engine.init()

const card = createCard({
  width: 0.6,
  height: 1,
  depth: 0.001,
  front: './board-restaurant.jpg',
  back: './carnival-midway.jpg',
})

const handleClick = () => {
  console.log('clicked')
  card.flip()
}

card.on('click', handleClick)

engine.add(card)
