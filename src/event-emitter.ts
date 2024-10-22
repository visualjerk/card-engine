import * as THREE from 'three'

export type GameEvents = {
  click: {},
  keydown: {
    key: string
  },
}

export type EventListener<T extends keyof GameEvents> = (event: GameEvents[T]) => void
export type EventOn<T extends keyof GameEvents> = (event: T, callback: EventListener<T>) => void

export class EventEmitter {
  private eventEmitter = new THREE.EventDispatcher<GameEvents>()

  on<T extends keyof GameEvents>(event: T, callback: EventListener<T>): () => void {
    this.eventEmitter.addEventListener(event, callback)
    return () => this.eventEmitter.removeEventListener(event, callback)
  }

  dispatch(event: keyof GameEvents, data?: GameEvents[keyof GameEvents]) {
    this.eventEmitter.dispatchEvent({ type: event, ...data })
  }
}
