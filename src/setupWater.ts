/* @ts-ignore */
import * as THREE from "three"

function Sea() {
  const matWaves: any = new THREE.MeshStandardMaterial({
    color: "green",
    /* @ts-ignore */
    shading: THREE.SmoothShading
  })

  let geo = new THREE.PlaneBufferGeometry(
    240,
    240,
    window.innerWidth / 12,
    window.innerHeight / 12
  )
  const plane = new THREE.Mesh(geo, matWaves)

  return plane
}

export default Sea
