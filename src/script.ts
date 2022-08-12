import "./style.css"
import Experience, { isDebug } from "./utils/Experience"
import * as THREE from "three"
import { Sky } from "./sky"
import { Water } from "./water"
import assets from "./utils/assets"
import { addLights } from "./scene/lights"
import { addEffects } from "./scene/effects"

import loadModel from "./scene/model"

const webgl = new Experience({
  clearColor: "#fff",
  renderer: {
    canvas: document.querySelector("canvas.webgl") as HTMLCanvasElement
  },
  orbitControls: true,
  stats: isDebug,
  gui: false,
  postprocessing: true
})
assets.loadQueued().then(() => {
  /**
   * Camera
   */
  webgl.camera.fov = 75
  webgl.camera.near = 1
  webgl.camera.far = 200
  webgl.camera.updateProjectionMatrix()
  webgl.camera.position.set(30, 30, 100).normalize().multiplyScalar(10)
  webgl.orbitControls!.target.y = 0.25
  webgl.orbitControls!.minDistance = 1
  webgl.orbitControls!.maxDistance = 24
  webgl.orbitControls!.minPolarAngle = 0
  webgl.orbitControls!.maxPolarAngle = Math.PI / 2 - 0.3
  webgl.orbitControls!.enablePan = false
  webgl.orbitControls!.enableDamping = true

  // Water
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000)

  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      "textures/water/waternormals.jpg",
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 2,
    fog: webgl.scene.fog !== undefined
  })

  water.rotation.x = -Math.PI / 2

  webgl.scene.add(water)

  // Skybox
  const sky: any = new Sky()
  sky.scale.setScalar(10000)
  webgl.scene.add(sky)

  const skyUniforms = sky.material.uniforms

  skyUniforms["turbidity"].value = 10
  skyUniforms["rayleigh"].value = 2
  skyUniforms["mieCoefficient"].value = 0.005
  skyUniforms["mieDirectionalG"].value = 0.8

  const parameters = {
    elevation: 2,
    azimuth: 180
  }

  const sun = new THREE.Vector3()

  const pmremGenerator = new THREE.PMREMGenerator(webgl.renderer)
  let renderTarget: any = undefined

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation)
    const theta = THREE.MathUtils.degToRad(parameters.azimuth)

    sun.setFromSphericalCoords(1, phi, theta)

    sky.material.uniforms["sunPosition"].value.copy(sun)

    if (renderTarget !== undefined) {
      renderTarget.dispose()
    }

    renderTarget = pmremGenerator.fromScene(sky)

    webgl.scene.environment = renderTarget.texture
  }

  updateSun()
  addLights()
  addEffects()
  ;(async () => {
    const { model }: any = await loadModel()
    model.position.set(1, 1.4, 0)
    model.scale.set(0.05, 0.05, 0.05)
    webgl.scene.add(model)
    let x = 0
    const max = 0.2
    webgl.events.tick.on((dt) => {
      x += dt / 12
      const xx = Math.abs((x % (max * 2)) - max)
      model.rotation.x = xx
    })
  })()

  webgl.events.tick.on(() => {
    // @ts-ignore: Unreachable code erro
    water.material.uniforms.time.value += 1.0 / 60.0
  })

  /**
   * Toggle animation
   */
  window.addEventListener("keyup", (event) => {
    if (event.key === " ") {
      webgl.isAnimationActive = !webgl.isAnimationActive
    }
  })

  setTimeout(() => {
    webgl.start()
  }, 100)
})
