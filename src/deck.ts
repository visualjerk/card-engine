import { Card } from "./card"

export class Deck {
  constructor(public cards: Card[]) {}

  shuffle() {
    this.cards.sort(() => Math.random() - 0.5)
  }

  draw() {
    return this.cards.pop()
  }
}
