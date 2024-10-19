import * as THREE from 'three'
import { GameEvents } from './event-emitter'

export type GameObject = {
  uuid: string
  mesh: THREE.Mesh

  on(event: keyof GameEvents, callback: (event: GameEvents[keyof GameEvents]) => void): void
  dispatch(event: keyof GameEvents, data?: GameEvents[keyof GameEvents]): void
  
  update(): void
}
