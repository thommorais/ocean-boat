/* @ts-ignore */
import * as THREE from "three"

function Sea() {
  const matWaves: any = new THREE.MeshStandardMaterial({
    //color:0x307ddd,
    transparent: true,
    opacity: 0,
    /* @ts-ignore */
    shading: THREE.SmoothShading
  })

  let geo = new THREE.PlaneBufferGeometry(
    120,
    120,
    window.innerWidth / 12,
    window.innerHeight / 12
  )
  const plane = new THREE.Mesh(geo, matWaves)

  return plane
}

export default Sea
