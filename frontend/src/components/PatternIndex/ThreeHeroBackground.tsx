import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.z = 100;

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Create Constellation Nodes (floating spheres)
    const nodeCount = 45;
    const geometry = new THREE.SphereGeometry(1.2, 8, 8);
    
    // Get colors from CSS tokens dynamically
    const style = getComputedStyle(document.documentElement);
    const accentPrimary = style.getPropertyValue('--accent-primary').trim() || '#E94560';
    const accentSecondary = style.getPropertyValue('--accent-secondary-light').trim() || '#7B68EE';
    
    const nodes: THREE.Mesh[] = [];
    const velocities: THREE.Vector3[] = [];

    // Group to hold all 3D objects
    const group = new THREE.Group();
    scene.add(group);

    // Node materials
    const normalMaterial = new THREE.MeshBasicMaterial({
      color: new THREE.Color(accentSecondary),
      transparent: true,
      opacity: 0.7,
    });

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(geometry, normalMaterial.clone());
      
      // Random coordinates inside a bounding box
      mesh.position.set(
        (Math.random() - 0.5) * 150,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 80
      );
      
      // Random scale to make it look depth-layered
      const scale = Math.random() * 0.8 + 0.4;
      mesh.scale.set(scale, scale, scale);

      group.add(mesh);
      nodes.push(mesh);

      // Random slow velocity
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.08,
          (Math.random() - 0.5) * 0.05
        )
      );
    }

    // 5. Line Connections (edges)
    const lineMaterial = new THREE.LineBasicMaterial({
      color: new THREE.Color(accentSecondary),
      transparent: true,
      opacity: 0.15,
    });
    
    // Dynamic lines buffer
    const maxConnections = 120;
    const linePositions = new Float32Array(maxConnections * 2 * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    
    const lineSegments = new THREE.LineSegments(lineGeometry, lineMaterial);
    group.add(lineSegments);

    // 6. Interaction States
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const raycaster = new THREE.Raycaster();
    const ndcMouse = new THREE.Vector2(-999, -999);
    let hoveredNode: THREE.Mesh | null = null;

    const handleMouseMove = (event: MouseEvent) => {
      // For camera parallax
      mouse.targetX = (event.clientX / window.innerWidth - 0.5) * 25;
      mouse.targetY = -(event.clientY / window.innerHeight - 0.5) * 25;

      // For raycasting hover (normalized device coordinates)
      const rect = renderer.domElement.getBoundingClientRect();
      ndcMouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      ndcMouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 7. Resize handling
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // 8. Animation Loop
    let animationFrameId: number;
    
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Camera parallax lerp
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;
      camera.position.x = mouse.x;
      camera.position.y = mouse.y;
      camera.lookAt(scene.position);

      // Slow rotation of entire group
      group.rotation.y += 0.001;
      group.rotation.x += 0.0005;

      // Move nodes & keep within bounds
      for (let i = 0; i < nodeCount; i++) {
        const node = nodes[i];
        const vel = velocities[i];
        node.position.add(vel);

        // Boundary checks
        if (Math.abs(node.position.x) > 100) vel.x *= -1;
        if (Math.abs(node.position.y) > 65) vel.y *= -1;
        if (Math.abs(node.position.z) > 60) vel.z *= -1;
      }

      // Raycasting hover checks
      raycaster.setFromCamera(ndcMouse, camera);
      const intersects = raycaster.intersectObjects(nodes);

      if (intersects.length > 0) {
        const closest = intersects[0].object as THREE.Mesh;
        if (hoveredNode !== closest) {
          // Reset old hover
          if (hoveredNode) {
            (hoveredNode.material as THREE.MeshBasicMaterial).color.set(accentSecondary);
            hoveredNode.scale.setScalar(hoveredNode.userData.originalScale || 1);
          }
          // Set new hover
          hoveredNode = closest;
          if (!hoveredNode.userData.originalScale) {
            hoveredNode.userData.originalScale = hoveredNode.scale.x;
          }
          (hoveredNode.material as THREE.MeshBasicMaterial).color.set(accentPrimary);
          hoveredNode.scale.setScalar(hoveredNode.userData.originalScale * 1.8);
        }
      } else {
        if (hoveredNode) {
          (hoveredNode.material as THREE.MeshBasicMaterial).color.set(accentSecondary);
          hoveredNode.scale.setScalar(hoveredNode.userData.originalScale || 1);
          hoveredNode = null;
        }
      }

      // Update lines between nearby nodes
      let lineIndex = 0;
      const positions = lineGeometry.attributes.position.array as Float32Array;

      // Check all pairs for proximity
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dist = nodes[i].position.distanceTo(nodes[j].position);
          
          if (dist < 32 && lineIndex < maxConnections) {
            const p1 = nodes[i].position;
            const p2 = nodes[j].position;

            const idx = lineIndex * 6;
            positions[idx] = p1.x;
            positions[idx + 1] = p1.y;
            positions[idx + 2] = p1.z;
            positions[idx + 3] = p2.x;
            positions[idx + 4] = p2.y;
            positions[idx + 5] = p2.z;

            lineIndex++;
          }
        }
      }

      // Hide unused lines by zeroing them out
      for (let i = lineIndex; i < maxConnections; i++) {
        const idx = i * 6;
        for (let k = 0; k < 6; k++) {
          positions[idx + k] = 0;
        }
      }

      lineGeometry.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };

    animate();

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'auto', // Allows hover interaction
        zIndex: 0,
      }}
    />
  );
};
