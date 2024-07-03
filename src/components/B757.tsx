import * as THREE from 'three'
import { useGLTF } from '@react-three/drei'
import { GLTF } from 'three-stdlib'

type GLTFResult = GLTF & {
  nodes: {
    Wheels001_landing_gear_0_1: THREE.Mesh
    Wheels001_landing_gear_0_2: THREE.Mesh
  }
  materials: {
    PaletteMaterial001: THREE.MeshStandardMaterial
    PaletteMaterial002: THREE.MeshStandardMaterial
  }
}

export function Model(props: JSX.IntrinsicElements['group']) {
  const { nodes, materials } = useGLTF('/B757.glb') as GLTFResult
  return (
    <group {...props} dispose={null}>
      <group
        rotation={[Math.PI / 2, Math.PI, -Math.PI / 2]}
        // scale={[0.5, 0.5, 0.5]}
      >
        <mesh
          geometry={nodes.Wheels001_landing_gear_0_1.geometry}
          material={materials.PaletteMaterial001}
        />
        <mesh
          geometry={nodes.Wheels001_landing_gear_0_2.geometry}
          material={materials.PaletteMaterial002}
        />
      </group>
    </group>
  )
}

useGLTF.preload('/B757.glb')
