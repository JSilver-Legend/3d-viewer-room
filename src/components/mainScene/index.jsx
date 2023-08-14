import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import Model from '../model';

import Texture01 from '../../assets/texture-1.png';
import Texture02 from '../../assets/texture-2.png';
import Texture03 from '../../assets/texture-3.png';
import Model01 from '../../assets/model-1.png';
import Model02 from '../../assets/model-2.png';
import Model03 from '../../assets/model-3.png';

import './style.css';

const MainScene = () => {

  const [selectedTexture, setSelectedTexture] = useState('texture-1');
  const [selectedModel, setSelectedModel] = useState('model-1');
  
  return (
    <>
      <div className='hint-area'>
        <p>You can use the scroll to resize the model.</p>
      </div>
      <div className='menu-left'>
        <div className='menu-item' onClick={()=>{ setSelectedModel('model-1'); }} >
          <img alt='model01' width={80} height={80} src={Model01} />
        </div>
        <div className='menu-item' onClick={()=>{ setSelectedModel('model-2'); }}>
          <img alt='model02' width={80} height={80} src={Model02} />
        </div>
        <div className='menu-item' onClick={()=>{ setSelectedModel('model-3'); }}>
          <img alt='model03' width={80} height={80} src={Model03} />
        </div>
      </div>
      <div className='menu-right'>
        <div className='menu-item' onClick={()=>{ setSelectedTexture('texture-1'); }} >
          <img alt='texture01' width={80} height={80} src={Texture01} />
        </div>
        <div className='menu-item' onClick={()=>{ setSelectedTexture('texture-2'); }}>
          <img alt='texture02' width={80} height={80} src={Texture02} />
        </div>
        <div className='menu-item' onClick={()=>{ setSelectedTexture('texture-3'); }}>
          <img alt='texture03' width={80} height={80} src={Texture03} />
        </div>
      </div>

      <Canvas 
        className='canvas-scene'
        camera={{
          fov: 25,
          aspect: window.innerWidth / window.innerHeight,
          near: 1,
          far: 1000,
        }}
        // logarithmicdepthbuffer="true"
        // antialias="true"
        // powerpreference="high-performance"
        shadows
      >
        <OrbitControls
          minAzimuthAngle={0}
          maxAzimuthAngle={0}
          minPolarAngle={Math.PI / 2.1}
          maxPolarAngle={Math.PI / 2.1}
          enableZoom={false}
          enableRotate={false}
          enablePan={false}
        />
        <ambientLight intensity={2} />
        <directionalLight castShadow position={[10, 10, 5]} intensity={2} color={"#FFFFFF"} shadow-mapSize={[1024, 1024]}>
            <orthographicCamera attach="shadow-camera" args={[-5, 5, 5, -5]} />
        </directionalLight>
        <directionalLight intensity={0.5} position={[-10, 10, 10]} />
        {/* <gridHelper args={[50, 50]} position={[0, -3, 0]} /> */}
        <Model selectedTexture={selectedTexture} selectedModel={selectedModel} />
      </Canvas>
    </>
  )
}

export default MainScene;