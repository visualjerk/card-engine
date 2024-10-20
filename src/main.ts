import './style.css'

import { createCard } from './card'
import { createCardEngine } from './card-engine'
import { createArea } from './area'

const engine = createCardEngine()
engine.init()

const table = createArea({
  width: 10,
  height: 7,
  texture: './bg-table2.jpg',
  cardPlacement: 'grid',
})

const playerDeck = createArea({
  width: 1,
  height: 1.4,
  texture: './bg-table.jpg',
  position: {
    x: -4,
    y: -2.5,
    z: 0.001,
  },
  cardPlacement: 'stack',
})

const playerHand = createArea({
  width: 6,
  height: 2,
  texture: './bg-table.jpg',
  position: {
    x: 0,
    y: -2.5,
    z: 0.001,
  },
  cardPlacement: 'fan',
})

engine.add(table)
engine.add(playerDeck)
engine.add(playerHand)

type CardState = 'deck' | 'hand' | 'table'

function initCard() {
  const card = createCard({
    width: 0.6,
    height: 1,
    depth: 0.001,
    front: './board-restaurant.jpg',
    back: './carnival-midway.jpg',
  })

  let state: CardState = 'deck'

  const handleClick = () => {
    if (state === 'deck') {
      state = 'hand'
      card.flip()
      card.placeOn(playerHand)
    } else if (state === 'hand') {
      state = 'table'
      card.placeOn(table)
    } else if (state === 'table') {
      state = 'deck'
      card.flip()
      card.placeOn(playerDeck)
    }
  }

  card.on('click', handleClick)
  engine.add(card)
  card.placeOn(playerDeck)
}

for (let i = 0; i < 28; i++) {
  initCard()
}
