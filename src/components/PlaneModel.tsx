import { Suspense, useEffect, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'

import { Model } from './B757'

export default function PlaneModel() {
  // const orbitControlsRef = useRef<any>(null)
  // useEffect(() => {
  //   if (orbitControlsRef.current) {
  //     orbitControlsRef.current.target.set(30, 0, 0)
  //     // orbitControlsRef.current.autoRotate = true
  //   }
  // }, [])

  return (
    <div className="absolute left-5 right-5 h-[calc(100vh-80px)] hidden md:flex">
      <Canvas
        camera={{ fov: 45, near: 0.01, far: 10000, position: [0, 0, 30] }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <OrbitControls target={[0, 0, 0]} />
        <Environment preset="city" />
        <Suspense fallback={null}>
          <Model position={[2, 0, 0]} />
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 right-4 font-bold text-slate-500">
        <a
          href="https://sketchfab.com/andrewswihart?utm_medium=embed&utm_campaign=share-popup&utm_content=761a094f337945e48182b3f28a3e5183"
          target="_blank"
          rel="nofollow"
        >
          {'Boeing 757 Transparent by Arion Digital'}
        </a>
      </div>
    </div>
  )
}
