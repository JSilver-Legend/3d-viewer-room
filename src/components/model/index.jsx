import React, { useState, Suspense, useEffect, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { TextureLoader, DoubleSide } from 'three';
import { useLoader } from '@react-three/fiber';
import { MeshStandardMaterial } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

import Texture01 from '../../assets/texture-1.png';
import Texture02 from '../../assets/texture-2.png';
import Texture03 from '../../assets/texture-3.png';

const Model = ({ selectedTexture, selectedModel }) => {
  
  const bed = useLoader(GLTFLoader, '/assets/glb/bed.glb').scene;
  const largeBox = useLoader(GLTFLoader, '/assets/glb/largebox.glb').scene;
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
            metalness: 0.75,
            roughness: 0,
          });
        }
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTexture]);
  
  useEffect(() => {
    if( model !== undefined ) {
      model.traverse(function (item) {
        item.castShadow = true;
        item.receiveShadow = true;
        if( item.name === 'wood_obj' ) {
          item.material = new MeshStandardMaterial({
            side: DoubleSide,
            map: textureImg03,
            metalness: 0.75,
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
  //scale value set
  useEffect(() => {
    if (model !== undefined && torusRef !== undefined) {
      model.scale.x = 1;
      model.scale.y = 1;
      model.scale.z = 1;

      torusRef.current.scale.x = 1;
      torusRef.current.scale.y = 1;
      torusRef.current.scale.z = 1;

      document.addEventListener("wheel", (event) => {
        if (event.deltaY < 0) {
          if (model.scale.x < 1.49) {
            model.scale.x += 0.01;
            model.scale.y += 0.01;
            model.scale.z += 0.01;
  
            torusRef.current.scale.x += 0.01;
            torusRef.current.scale.y += 0.01;
            torusRef.current.scale.z += 0.01;
          }
        } else if (event.deltaY > 0) {
          if (model.scale.x > 1) {
            model.scale.x -= 0.01;
            model.scale.y -= 0.01;
            model.scale.z -= 0.01;
  
            torusRef.current.scale.x -= 0.01;
            torusRef.current.scale.y -= 0.01;
            torusRef.current.scale.z -= 0.01;
          }
        }
      })
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model])

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

  const bindChair = useDrag(
    ({ down, delta, first }) => {
      if( first ) {
        setIsRotating(false);
      }
      if( down && !isRotating  ) {
        setPositionX((prev)=>prev+delta[0]*0.005);
        setPositionY((prev)=>prev+delta[1]*0.005);
      }
    },
    { pointerEvents: true }
  );

  return (
    <group castShadow receiveShadow position={[positionX,-1.3,positionY]} rotation={[-0.1,rotate,0]} scale={[1.3, 1.3, 1.3]} >
      <group castShadow receiveShadow name='chair-group'>
        <group castShadow receiveShadow {...bindChair()} name='chair' position={[0,-0.5,0]} scale={[500, 500, 500]} >
          <Suspense fallback={null} >
            <primitive object={model} >
              <mesh />
            </primitive>
          </Suspense>
        </group>
        <group {...bindRotate()} name='arrow' onPointerEnter={()=>{ setRingColor('red') }} onPointerLeave={()=>{ setRingColor('white') }} >
          <mesh ref={torusRef} position={[0,-0.5,0]} rotation={[Math.PI/2,0,0]} >
            <torusGeometry args={[0.8, 0.02, 3, 500]} />
            <meshStandardMaterial color={ringColor} />
          </mesh>
        </group>
      </group>
    </group>
  )
}

export default Model;