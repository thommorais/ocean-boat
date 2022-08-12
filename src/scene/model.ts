async function loadModel({ scene = "jet_sprint_boat/scene.gltf" } = {}) {
  const { LoadingManager } = await import("three")
  const { GLTFLoader } = await import("three/examples/jsm/loaders/GLTFLoader")
  const { DRACOLoader } = await import("three/examples/jsm/loaders/DRACOLoader")

  const loadingManager = new LoadingManager()
  const gltfLoader = new GLTFLoader(loadingManager)

  const dracoLoader = new DRACOLoader()
  dracoLoader.setDecoderPath("./assets/libs/draco/gltf/")
  gltfLoader.setDRACOLoader(dracoLoader)

  return new Promise((resolve) => {
    gltfLoader.load(scene, async (gltf) =>
      resolve({ model: gltf?.scene, gltf })
    )
  })
}

export default loadModel
