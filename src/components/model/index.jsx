import React, { useState, Suspense, useEffect, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { TextureLoader, DoubleSide } from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import { RepeatWrapping } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Texture01 from '../../assets/texture-1.png';
import Texture02 from '../../assets/texture-2.png';
import Texture03 from '../../assets/texture-3.png';

const Model = ({ selectedTexture, selectedModel, mouseState }) => {
  
  const bed = useLoader(GLTFLoader, '/assets/glb/bed.glb').scene;
  const largeBox = useLoader(GLTFLoader, '/assets/glb/largeBox.glb').scene;
  const smallBox = useLoader(GLTFLoader, '/assets/glb/smallbox.glb').scene;

  const torusRef = useRef();
  const [rotate, setRotate] = useState(0);
  const [ringColor, setRingColor] = useState('white');
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(-4);
  const [isRotating, setIsRotating] = useState(false);
  const [model, setModel] = useState(bed);

  const textureImg01 = new TextureLoader().load(Texture01);
  const textureImg02 = new TextureLoader().load(Texture02);
  const textureImg03 = new TextureLoader().load(Texture03);

  const { gl } = useThree();
  textureImg03.anisotropy = Math.min(gl.capabilities.getMaxAnisotropy(), 50)
  textureImg03.wrapS = RepeatWrapping;
  textureImg03.wrapT = RepeatWrapping;
  textureImg03.repeat.set(1, 1);

  useEffect(() => {
    var currentTexture;
    if( selectedTexture === 'texture-1' ) currentTexture = textureImg01;
    else if( selectedTexture === 'texture-2' ) currentTexture = textureImg02;
    else if( selectedTexture === 'texture-3' ) currentTexture = textureImg03;

    if( model !== undefined ) {
      model.traverse(function (item) {
        if( item.name === 'wood_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            map: currentTexture,
            metalness: 0.7,
            roughness: 0.3,
          });
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTexture]);
  
  useEffect(() => {
    if( model !== undefined ) {
      model.traverse(function (item) {
        if( item.name === 'wood_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            map: textureImg03,
            metalness: 0.7,
            roughness: 0,
          });
        } else if( item.name === 'cloth_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            color: 'white'
          })
        } else if( item.name === 'handle_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            color: 'white',
            roughness: 0.9,
            metalness: 0.7
          })
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model]);
  //exchange model
  useEffect(() => {
    if( selectedModel === 'model-1' ) setModel(bed);
    else if( selectedModel === 'model-2' ) setModel(largeBox);
    else if( selectedModel === 'model-3' ) setModel(smallBox);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel])

  useEffect(() => {
    model.scale.x = 1;
    model.scale.y = 1;
    model.scale.z = 1;

    torusRef.current.scale.x = 1;
    torusRef.current.scale.y = 1;
    torusRef.current.scale.z = 1;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])
  
  useFrame(() => {
    if (model !== undefined && torusRef.current !== undefined) {
      if (mouseState === "increase") {
        if (model.scale.x < 2.49) {
          model.scale.x += 0.01;
          model.scale.y += 0.01;
          model.scale.z += 0.01;

          torusRef.current.scale.x += 0.01;
          torusRef.current.scale.y += 0.01;
          torusRef.current.scale.z += 0.01;

        }
      }
      else if (mouseState === "decrease") {
        if (model.scale.x > 1) {
          model.scale.x -= 0.01;
          model.scale.y -= 0.01;
          model.scale.z -= 0.01;

          torusRef.current.scale.x -= 0.01;
          torusRef.current.scale.y -= 0.01;
          torusRef.current.scale.z -= 0.01;

        }
      }
    }
  })
  
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
    <group>
      <group position={[positionX,-2.2,positionY]} rotation={[-0.1,rotate,0]} scale={[3, 3, 3]} >
        <group name='chair-group'>
          <group {...bindChair()} name='chair' position={[0,-0.5,0]} scale={[500, 500, 500]} >
            <Suspense fallback={null} >
              <primitive object={model} >
                <mesh />
              </primitive>
            </Suspense>
          </group>
          <group {...bindRotate()} name='arrow'onPointerEnter={()=>{ setRingColor('red') }} onPointerLeave={()=>{ setRingColor('white') }} >
            <mesh ref={torusRef} position={[0,-0.5,0]} rotation={[Math.PI/2,0,0]} >
              <torusGeometry args={[0.8, 0.02, 3, 500]} />
              <meshStandardMaterial color={ringColor} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  )
}

export default Model;