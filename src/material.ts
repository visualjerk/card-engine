import * as THREE from 'three'

const textureCache = new Map<string, THREE.Texture>()

function getTexture(textureUrl: string) {
  const cachedTexture = textureCache.get(textureUrl)
  if (cachedTexture != null) {
    return cachedTexture
  }

  const texture = new THREE.TextureLoader().load(textureUrl)
  texture.colorSpace = THREE.SRGBColorSpace
  textureCache.set(textureUrl, texture)

  return texture
}

type MaterialProps = {
  texture: string
}

export function createMaterial(props: MaterialProps) {
  const texture = getTexture(props.texture)
  return new THREE.MeshBasicMaterial({ map: texture })
}