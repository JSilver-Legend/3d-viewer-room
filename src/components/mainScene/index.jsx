import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
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
          fov: 45,
          aspect: window.innerWidth / window.innerHeight,
          near: 0.1,
          far: 10000,
          position: [0, -0.7, 7],
        }}
      >
        <ambientLight intensity={1} />
        <directionalLight intensity={1.4} />
        <Model selectedTexture={selectedTexture} selectedModel={selectedModel} />
      </Canvas>
    </>
  )
}

export default MainScene;