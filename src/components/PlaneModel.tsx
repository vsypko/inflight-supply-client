import { Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stage } from "@react-three/drei"
import { Model } from "../components/B757"

export default function PlaneModel() {
  return (
    <div className="absolute left-5 right-5 h-[calc(100vh-80px)] hidden md:flex">
      <Canvas camera={{ fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
        <ambientLight intensity={0.5} />
        <Suspense fallback={null}>
          <Stage adjustCamera intensity={1} environment="city">
            <Model />
            <OrbitControls />
          </Stage>
        </Suspense>
      </Canvas>
      <div className="absolute bottom-4 right-4 font-bold text-slate-500">
        <a
          href="https://sketchfab.com/andrewswihart?utm_medium=embed&utm_campaign=share-popup&utm_content=761a094f337945e48182b3f28a3e5183"
          target="_blank"
          rel="nofollow"
        >
          {"Boeing 757 Transparent by Arion Digital"}
        </a>
      </div>
    </div>
  )
}
