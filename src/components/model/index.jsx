import * as THREE from 'three';
import React, { useState, Suspense, useEffect, useRef, useMemo } from 'react';
import { useDrag } from '@use-gesture/react';
import { TextureLoader, DoubleSide, CompressedArrayTexture } from 'three';
import { useLoader } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Texture01 from '../../assets/texture-1.png';
import Texture02 from '../../assets/texture-2.png';
import Texture03 from '../../assets/texture-3.png';
import { GradientTexture } from '@react-three/drei';

const Model = ({ selectedTexture, selectedModel }) => {
  
  const bed = useLoader(GLTFLoader, '/assets/glb/bed.glb').scene;
  const largeBox = useLoader(GLTFLoader, '/assets/glb/largebox.glb').scene;
  const smallBox = useLoader(GLTFLoader, '/assets/glb/smallbox.glb').scene;

  const modelRef = useRef();
  const [rotate, setRotate] = useState(0);
  const [ringColor, setRingColor] = useState('white');
  const [positionX, setPositionX] = useState(0);
  const [positionY, setPositionY] = useState(-4);
  // console.log('x - y : ', positionX, positionY);
  const [isRotating, setIsRotating] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [model, setModel] = useState(bed);

  const textureImg01 = new TextureLoader().load(Texture01);
  textureImg01.wrapS = textureImg01.wrapT = THREE.RepeatWrapping;
  textureImg01.repeat.set(1, 1);
  textureImg01.rotation = Math.PI;
  textureImg01.offset.x = 0.1;
  textureImg01.offset.y = -0.2;
  const textureImg02 = new TextureLoader().load(Texture02);
  textureImg02.wrapS = textureImg02.wrapT = THREE.RepeatWrapping;
  textureImg02.repeat.set(1, 1);
  textureImg02.rotation = Math.PI;
  textureImg02.offset.x = 0.1;
  textureImg02.offset.y = -0.2;
  const textureImg03 = new TextureLoader().load(Texture03);
  textureImg03.wrapS = textureImg03.wrapT = THREE.RepeatWrapping;
  textureImg03.repeat.set(1, 1);
  textureImg03.rotation = Math.PI;
  textureImg03.offset.x = 0.1;
  textureImg03.offset.y = -0.2;

  const limitValue = useMemo(() => {
    const minLimitX = -window.innerWidth * 0.004 / 2.2;
    const maxLimitX = window.innerWidth * 0.004 / 2.2;
    const minLimitY = -4;
    const maxLimitY = -1;

    return {minLimitX, maxLimitX, minLimitY, maxLimitY}
  }, [window.innerWidth, window.innerHeight])
  
  const bindRotate = useDrag(
    ({ down, delta, first, event }) => {
      if( first ) {
        setIsRotating(true);
      }
      if( down ) {
        setRotate((prev)=>prev+delta[0]*0.01);
      }
    },
    { pointerEvents: true },
  );

  const bindModel = useDrag(
    ({ down, delta, first }) => {
      if( first ) {
        setIsRotating(false);
      }
      if( down && !isRotating  ) {
        setIsDrawing(true);
        
        if (positionX >= limitValue.minLimitX && positionX <= limitValue.maxLimitX) {
          if (positionY <= limitValue.maxLimitY && positionY >= (-0.56 * positionX - 3.62) ) {
            setPositionX((prev) => prev + delta[0] * 0.005);
            setPositionY((prev) => prev + delta[1] * 0.005);
          } else if (positionY > limitValue.maxLimitY) {
            setPositionY(limitValue.maxLimitY)
          } else if (positionY < (-0.56 * positionX - 3.62)) {
            setPositionY((-0.56 * positionX - 3.62));
          }
        } else if (positionX < limitValue.minLimitX) {
          setPositionX(limitValue.minLimitX);
        } else if (positionX > limitValue.maxLimitX) {
          setPositionX(limitValue.maxLimitX);
        }
      }
      if ( !down )
        setIsDrawing(false);
    },
    { pointerEvents: true }
  );

  //select model texture
  useEffect(() => {
    var currentTexture;
    if( selectedTexture === 'texture-1' ) currentTexture = textureImg01;
    else if( selectedTexture === 'texture-2' ) currentTexture = textureImg02;
    else if( selectedTexture === 'texture-3' ) currentTexture = textureImg03;

    if( model !== undefined ) {
      model.traverse(function (item) {
        item.castShadow = true;
        item.receiveShadow = true;
        if( item.name === 'wood_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            map: currentTexture,
            metalness: 0.8,
            roughness: 0,
          });
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTexture]);
  
  //init show model
  useEffect(() => {
    if( model !== undefined ) {
      model.traverse(function (item) {
        item.castShadow = true;
        item.receiveShadow = true;
        if( item.name === 'wood_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            map: textureImg03,
            metalness: 0.8,
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
            metalness: 0.8
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
    modelRef.current.scale.x = 1;
    modelRef.current.scale.y = 1;
    modelRef.current.scale.z = 1;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedModel])

  //scale value set
  useEffect(() => {
    if (model !== undefined && modelRef.current !== undefined) {
      document.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
          if (modelRef.current.scale.x < 1.49) {  
            modelRef.current.scale.x += 0.01;
            modelRef.current.scale.y += 0.01;
            modelRef.current.scale.z += 0.01;
          }
        } else if (event.deltaY > 0) {
          if (modelRef.current.scale.x > 1) {  
            modelRef.current.scale.x -= 0.01;
            modelRef.current.scale.y -= 0.01;
            modelRef.current.scale.z -= 0.01;
          }
        }
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, modelRef])

  return (
    <group ref={modelRef} castShadow receiveShadow position={[positionX, -1.1, positionY]} rotation={[-0.1 ,rotate, 0]} scale={[1.3, 1.3, 1.3]}>
      <group castShadow receiveShadow name='chair-group'>
        <group castShadow receiveShadow {...bindModel()} name='chair' position={[0, -0.5, 0]} scale={[500, 500, 500]}>
          <Suspense fallback={null}>
            <primitive object={model}>
              <mesh />
            </primitive>
          </Suspense>
        </group>
        <group {...bindRotate()} name='arrow' onPointerEnter={()=>{ isDrawing ? setRingColor('white') : setRingColor('red') }} onPointerLeave={()=>{ setRingColor('white') }} rotation={[0, -1.1, 0]}>
          <mesh position={[0, -0.5, 0]} rotation={[Math.PI/2,0,0]}>
            <torusGeometry args={[0.8, 0.02, 25, 60, 6.1]} />
            <meshStandardMaterial color={ringColor} side={DoubleSide} metalness={0.6} />
          </mesh>
          <mesh position={[0.795, -0.5, -0.04]} rotation={[-Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.04, 0.16, 25, 1]} />
            <meshStandardMaterial color={'red'} side={DoubleSide} metalness={0.6} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default Model;