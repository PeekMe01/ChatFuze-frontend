// BubbleScene.js
import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere } from 'three';

const BubbleScene = () => {
  return (
    <Canvas>
      {/* Add lights and camera */}
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <camera position={[0, 0, 5]} />
      
      {/* Render bubbles */}
      <Bubbles />
    </Canvas>
  );
};

const Bubbles = () => {
  const groupRef = useRef();

  // Use useFrame to animate the bubbles
  useFrame(({ clock }) => {
    // Access the group's children (bubbles) and update their position
    groupRef.current.children.forEach((bubble) => {
      // You can modify the bubble's position here
      const time = clock.elapsedTime;
      const speed = 0.1; // Adjust speed as needed
      const offset = 3; // Adjust offset as needed
      
      // Update bubble's position using sinusoidal motion for smooth looping
      bubble.position.x = Math.sin(time * speed + bubble.position.y) * offset;
      bubble.position.y += 0.001; // Adjust vertical speed as needed
    });
  });

  return (
    <group ref={groupRef}>
      {[...Array(100)].map((_, index) => (
        <Bubble key={index} position={getRandomPosition()} />
      ))}
    </group>
  );
};

const Bubble = ({ position }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.1, 32, 32]} />
      <meshStandardMaterial color="white" transparent opacity={0.5} />
    </mesh>
  );
};

// Function to generate random positions within the scene
const getRandomPosition = () => {
  const x = (Math.random() - 0.5) * 10; // Adjust range as needed
  const y = (Math.random() - 0.5) * 65; // Adjust range as needed
  const z = (Math.random() - 0.5) * 19; // Adjust range as needed
  return [x, y, z];
};

export default BubbleScene;
