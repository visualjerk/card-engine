import * as THREE from 'three'

type MaterialProps = {
  texture: string
}

export function createMaterial(props: MaterialProps) {
  const texture = new THREE.TextureLoader().load(props.texture)
  texture.colorSpace = THREE.SRGBColorSpace
  return new THREE.MeshBasicMaterial({ map: texture })
}