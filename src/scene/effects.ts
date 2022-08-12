import * as THREE from "three"
import { EffectPass, DepthOfFieldEffect, VignetteEffect } from "postprocessing"
import Experience from "../utils/Experience"

export function addEffects() {
  const webgl = new Experience()
  const { composer, camera } = webgl
  if (!composer) return

  const depthOfFieldEffect = new DepthOfFieldEffect(camera, {
    focalLength: 0,
    bokehScale: 0,
    // @ts-ignore
    resolutionScale: 2
  })
  depthOfFieldEffect.target = new THREE.Vector3(0, 0, 0)
  const depthOfFieldPass = new EffectPass(camera, depthOfFieldEffect)
  composer.addPass(depthOfFieldPass)

  composer.addPass(new EffectPass(camera, new VignetteEffect()))
}
