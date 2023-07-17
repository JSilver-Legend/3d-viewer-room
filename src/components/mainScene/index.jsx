import React, { Suspense, useState } from 'react';
import { useDrag } from '@use-gesture/react';
import { Canvas } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import './style.css';

const MainScene = () => {

  const { scene } = useGLTF('/assets/glb/chair.glb');
  
  const [rotate, setRotate] = useState(0);
  const [ringColor, setRingColor] = useState('white');
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(-4);
  const [isRotating, setIsRotating] = useState(false);

  const bindRotate = useDrag(
    ({ down, delta, first }) => {
      if( first ) {
        setIsRotating(true);
      }
      if( down ) {
        setRotate((prev)=>prev+delta[0]*0.01)
      }
    },
    { pointerEvents: true },
  );

  const bindChair = useDrag(
    ({ down, delta, first }) => {
      if( first ) {
        setIsRotating(false);
      }
      if( down && !isRotating  ) {
        setPositionX((prev)=>prev+delta[0]*0.01);
        setPositionY((prev)=>prev+delta[1]*0.01);
      }
    },
    { pointerEvents: true }
  );

  return (
    <Canvas 
      className='canvas-scene'
      camera={{
        fov: "45",
        aspect: window.innerWidth / window.innerHeight,
        near: 0.1,
        far: 100,
        position: [0, -0.7, 7],
      }}
    >
      <ambientLight intensity={0.4} />
      <directionalLight intensity={1.4} />
      <group position={[positionX,-3,positionY]} rotation={[-0.1,rotate,0]} >
        <group name='chair-group'>
          <group {...bindChair()} name='chair' scale={[1.4,1.4,1.4]} >
            <Suspense fallback={null} >
              <primitive object={scene} >
                <mesh />
              </primitive>
            </Suspense>
          </group>
          <group {...bindRotate()} name='arrow'onPointerEnter={()=>{ setRingColor('red') }} onPointerLeave={()=>{ setRingColor('white') }} >
            <mesh position={[0,-0.5,0]} rotation={[Math.PI/2,0,0]} >
              <torusGeometry args={[1.3, 0.03, 3, 500]} />
              <meshStandardMaterial color={ringColor} />
            </mesh>
            {/* <mesh position={[0,-0.5,1.3]} rotation={[0,0,-Math.PI/2]}>
              <coneGeometry args={[0.05,0.18,30]} />
              <meshStandardMaterial color={'red'} />
            </mesh> */}
          </group>
          {/* <gridHelper args={[70,20]} position={[0,-0.5,0]} /> */}
        </group>
      </group>
    </Canvas>
  )
}

export default MainScene;