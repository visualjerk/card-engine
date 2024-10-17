import * as THREE from 'three'

export type GameEvents = {
  click: {}
}

export type GameObject = {
  uuid: string
  mesh: THREE.Mesh

  on(event: keyof GameEvents, callback: (event: GameEvents[keyof GameEvents]) => void): void
  dispatch(event: keyof GameEvents): void
  
  update(): void
}
