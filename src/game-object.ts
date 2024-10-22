import * as THREE from 'three'
import { EventListener, GameEvents } from './event-emitter'

export type GameObject = {
  uuid: string
  mesh: THREE.Mesh

  on<T extends keyof GameEvents>(event: T, callback: EventListener<T>): () => void
  dispatch(event: keyof GameEvents, data?: GameEvents[keyof GameEvents]): void
  
  update(): void
}
