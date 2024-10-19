import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { GameObject } from './game-object'

export function createCardEngine() {
  let camera: THREE.PerspectiveCamera
  let scene: THREE.Scene
  let renderer: THREE.WebGLRenderer
  let controls: OrbitControls
  let raycaster: THREE.Raycaster
  let pointer: THREE.Vector2
  let intersects: THREE.Intersection[]
  let objects: Map<string, GameObject>

  function init() {
    camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    )
    camera.position.z = 5
    camera.position.y = -0.5

    scene = new THREE.Scene()
    objects = new Map()
    raycaster = new THREE.Raycaster()
    pointer = new THREE.Vector2()

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.render(scene, camera)
    document.body.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.update()
    controls.enableDamping = true
    controls.enableRotate = false
    renderer.setAnimationLoop(animate)

    window.addEventListener('resize', onWindowResize)
    window.addEventListener('pointermove', onMouseMove)
    window.addEventListener('pointerup', onClick)
  }

  function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)
  }

  function onMouseMove(event: MouseEvent) {
    pointer.x = (event.clientX  / window.innerWidth) * 2 - 1
    pointer.y = -(event.clientY / window.innerHeight) * 2 + 1
  }

  function onClick() {
    const firstIntersect = intersects[0]
    if (firstIntersect == null) {
      return
    }

    const object = objects.get(firstIntersect.object.uuid)
    object?.dispatch('click')
  }

  function animate() {
    controls.update()
    update()
    raycaster.setFromCamera(pointer, camera)
    intersects = raycaster.intersectObjects(scene.children)
    renderer.render(scene, camera)
  }

  function update() {
    objects.forEach((object) => {
      object.update()
    })
  }

  function add(object: GameObject) {
    scene.add(object.mesh)
    objects.set(object.uuid, object)
  }

  return {
    init,
    add,
  }
}
