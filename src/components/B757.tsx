import * as THREE from "three"
import { useGLTF } from "@react-three/drei"
import { GLTF } from "three-stdlib"

type GLTFResult = GLTF & {
  nodes: {
    ["blades_turbine_003_turbine-01_accent_yellow_0"]: THREE.Mesh
    body001_MAIN_0: THREE.Mesh
  }
  materials: {
    PaletteMaterial001: THREE.MeshStandardMaterial
    PaletteMaterial002: THREE.MeshStandardMaterial
  }
}

type ContextType = Record<string, React.ForwardRefExoticComponent<JSX.IntrinsicElements["mesh"]>>

export function Model(props: JSX.IntrinsicElements["group"]) {
  const { nodes, materials } = useGLTF("/B757.glb") as GLTFResult

  return (
    <group {...props} dispose={null} rotation={[0, Math.PI, 0]}>
      <mesh
        geometry={nodes["blades_turbine_003_turbine-01_accent_yellow_0"].geometry}
        material={materials.PaletteMaterial001}
        position={[5.458, 1.243, -2.922]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.01}
      />
      <mesh
        geometry={nodes.body001_MAIN_0.geometry}
        material={materials.PaletteMaterial002}
        position={[1.666, 4.045, -0.928]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={0.01}
      />
    </group>
  )
}

useGLTF.preload("/B757.glb")
