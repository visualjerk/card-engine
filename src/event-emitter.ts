import * as THREE from 'three'

export type GameEvents = {
  click: {},
  keydown: {
    key: string
  },
}

export class EventEmitter {
  private eventEmitter = new THREE.EventDispatcher<GameEvents>()

  on(event: keyof GameEvents, callback: (event: GameEvents[keyof GameEvents]) => void) {
    this.eventEmitter.addEventListener(event, callback)
    return () => this.eventEmitter.removeEventListener(event, callback)
  }

  dispatch(event: keyof GameEvents) {
    this.eventEmitter.dispatchEvent({ type: event })
  }
}
