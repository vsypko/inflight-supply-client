import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls, Stage } from '@react-three/drei'
import { Model } from './B757'

export default function PlaneModel() {
  return (
    <div className="absolute left-5 right-5 h-[calc(100vh-80px)] hidden md:flex">
      <Canvas
        camera={{ fov: 45, near: 0.01, far: 10000, position: [30, 0, 50] }}
        gl={{ preserveDrawingBuffer: true }}
      >
        <Suspense fallback={null}>
          <Environment preset="city" />
          <Model position={[10, 0, 0]} />
          <OrbitControls autoRotate autoRotateSpeed={1.0} target={[0, 0, 20]} />
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
