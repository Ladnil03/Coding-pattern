import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { VisualizationConfig, StepSnapshot } from '../../types/visualization';

interface ThreeVisualizerProps {
  config: VisualizationConfig;
  activeStepIdx: number;
}

export const ThreeVisualizer: React.FC<ThreeVisualizerProps> = ({ config, activeStepIdx }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 350;

    // 1. Scene setup
    const scene = new THREE.Scene();
    
    // Background color matching --bg-secondary
    scene.background = null; 

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 35, 75);

    // 3. Renderer setup
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Controls setup
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxPolarAngle = Math.PI / 2 - 0.05; // Don't go below ground

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(20, 40, 20);
    scene.add(dirLight);

    // Group for active visualizer meshes
    const visualizerGroup = new THREE.Group();
    scene.add(visualizerGroup);

    // Get color tokens dynamically
    const style = getComputedStyle(document.documentElement);
    const colorBgSec = style.getPropertyValue('--bg-secondary').trim() || '#16213E';
    const colorBgTert = style.getPropertyValue('--bg-tertiary').trim() || '#0F3460';
    const colorText = style.getPropertyValue('--text-primary').trim() || '#E8E6E1';
    const colorTextSec = style.getPropertyValue('--text-secondary').trim() || '#A8A4A0';
    const accentPrim = style.getPropertyValue('--accent-primary').trim() || '#E94560';
    const accentSec = style.getPropertyValue('--accent-secondary-light').trim() || '#7B68EE';
    const accentTert = style.getPropertyValue('--accent-tertiary-light').trim() || '#20E3B2';

    // Helper: Canvas Texture for text labels on meshes
    const createTextTexture = (text: string, bgColor: string, textColor: string, size = 128) => {
      const canvas = document.createElement('canvas');
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw rounded container
        ctx.fillStyle = bgColor;
        ctx.beginPath();
        ctx.roundRect(4, 4, size - 8, size - 8, size * 0.15);
        ctx.fill();

        // Border
        ctx.strokeStyle = colorBgTert;
        ctx.lineWidth = 6;
        ctx.stroke();

        // Label Text
        ctx.fillStyle = textColor;
        ctx.font = `bold ${Math.floor(size * 0.35)}px Sora, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, size / 2, size / 2);
      }
      return new THREE.CanvasTexture(canvas);
    };

    // Keep track of elements for interpolation
    interface InterpolationTarget {
      mesh: THREE.Object3D;
      targetPos: THREE.Vector3;
      targetScale: THREE.Vector3;
      targetColor?: THREE.Color;
      materialRef?: THREE.MeshStandardMaterial;
    }
    const lerpTargets: InterpolationTarget[] = [];

    // Rebuild Scene based on current step
    const rebuildScene = () => {
      // Clear previous meshes
      while (visualizerGroup.children.length > 0) {
        const obj = visualizerGroup.children[0];
        visualizerGroup.remove(obj);
      }
      lerpTargets.length = 0;

      const currentStep: StepSnapshot | undefined = config.steps[activeStepIdx];
      if (!currentStep) return;

      const { state } = currentStep;
      const visType = config.type;

      // ─── CASE A: ARRAY VISUALIZATION ───
      if (visType === 'array') {
        const arr = state.array || [];
        const pointers = state.pointers || {};
        const windowBounds = state.window;
        const highlighted = state.highlighted || [];

        const boxGeom = new THREE.BoxGeometry(5, 5, 5);
        const startX = -(arr.length - 1) * 3.5;

        // Draw array boxes
        arr.forEach((val, idx) => {
          const isHigh = highlighted.includes(idx);
          const inWindow = windowBounds && idx >= windowBounds[0] && idx <= windowBounds[1];

          let boxColor = colorBgSec;
          let textColor = colorText;
          if (isHigh) {
            boxColor = accentPrim;
            textColor = '#FFFFFF';
          } else if (inWindow) {
            boxColor = colorBgTert;
            textColor = accentPrim;
          }

          const texture = createTextTexture(String(val), boxColor, textColor);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.2,
            metalness: 0.1,
          });

          const boxMesh = new THREE.Mesh(boxGeom, material);
          boxMesh.position.set(startX + idx * 7, 0, 0);
          visualizerGroup.add(boxMesh);

          // Add index number above box
          const idxTexture = createTextTexture(String(idx), 'rgba(0,0,0,0)', colorTextSec, 64);
          const idxMat = new THREE.SpriteMaterial({ map: idxTexture });
          const idxSprite = new THREE.Sprite(idxMat);
          idxSprite.position.set(startX + idx * 7, 4.5, 0);
          idxSprite.scale.set(4, 4, 1);
          visualizerGroup.add(idxSprite);

          // Animate entry scale
          boxMesh.scale.set(0.01, 0.01, 0.01);
          lerpTargets.push({
            mesh: boxMesh,
            targetPos: boxMesh.position.clone(),
            targetScale: new THREE.Vector3(1, 1, 1),
          });
        });

        // Draw pointers (3D arrows)
        Object.entries(pointers).forEach(([name, idx]) => {
          const arrowGroup = new THREE.Group();
          const shaftGeom = new THREE.CylinderGeometry(0.2, 0.2, 3, 8);
          const headGeom = new THREE.ConeGeometry(0.6, 1.2, 8);

          const isLeft = name.toLowerCase().includes('left') || name.toLowerCase().includes('low') || name.toLowerCase().includes('slow');
          const pColor = isLeft ? accentTert : accentPrim;
          const arrowMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(pColor), roughness: 0.4 });

          const shaft = new THREE.Mesh(shaftGeom, arrowMat);
          shaft.position.y = 1.5;
          const head = new THREE.Mesh(headGeom, arrowMat);
          head.position.y = 0;
          head.rotation.x = Math.PI; // point down

          arrowGroup.add(shaft);
          arrowGroup.add(head);

          // Badge with name
          const badgeTexture = createTextTexture(name, pColor, '#FFFFFF', 128);
          const badgeMat = new THREE.SpriteMaterial({ map: badgeTexture });
          const badgeSprite = new THREE.Sprite(badgeMat);
          badgeSprite.position.set(0, 4.2, 0);
          badgeSprite.scale.set(7, 3.5, 1);
          arrowGroup.add(badgeSprite);

          // Position pointer above box
          const targetX = startX + idx * 7;
          // Offset Y slightly if multiple pointers point to the same index to stack them
          const duplicateCount = Object.values(pointers).filter((i) => i === idx).length;
          const isDuplicate = duplicateCount > 1;
          const pOrder = Object.keys(pointers).indexOf(name);
          const yOffset = isDuplicate ? 6 + pOrder * 3.5 : 6;

          arrowGroup.position.set(targetX, yOffset, 0);
          visualizerGroup.add(arrowGroup);

          // Animate position lerp
          arrowGroup.position.y += 10; // fall down animation
          lerpTargets.push({
            mesh: arrowGroup,
            targetPos: new THREE.Vector3(targetX, yOffset, 0),
            targetScale: new THREE.Vector3(1, 1, 1),
          });
        });

        // Draw Sliding Window Frame
        if (windowBounds) {
          const leftX = startX + windowBounds[0] * 7;
          const rightX = startX + windowBounds[1] * 7;
          const windowWidth = (rightX - leftX) + 6.5;

          const frameGeom = new THREE.BoxGeometry(windowWidth, 6.2, 6.2);
          const frameMat = new THREE.MeshBasicMaterial({
            color: new THREE.Color(accentPrim),
            wireframe: true,
            transparent: true,
            opacity: 0.6,
          });
          const frameMesh = new THREE.Mesh(frameGeom, frameMat);
          frameMesh.position.set((leftX + rightX) / 2, 0, 0);
          visualizerGroup.add(frameMesh);
        }
      }

      // ─── CASE B: LINKED LIST VISUALIZATION ───
      else if (visType === 'linked-list') {
        const arr = state.array || [];
        const pointers = state.pointers || {};
        const visited = state.visited || [];

        const nodeGeom = new THREE.SphereGeometry(2.8, 16, 16);
        const startX = -(arr.length - 1) * 5;

        // Draw Node Spheres
        arr.forEach((val, idx) => {
          const isVisited = visited.includes(idx);
          const hasPointer = Object.values(pointers).includes(idx);

          let sphereColor = colorBgSec;
          if (hasPointer) sphereColor = colorBgTert;
          if (isVisited) sphereColor = accentSec;

          const texture = createTextTexture(String(val), sphereColor, colorText);
          const mat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.3,
            metalness: 0.2,
          });

          const sphereMesh = new THREE.Mesh(nodeGeom, mat);
          const posX = startX + idx * 10;
          sphereMesh.position.set(posX, 0, 0);
          visualizerGroup.add(sphereMesh);

          // Node Index
          const idxTexture = createTextTexture(`[${idx}]`, 'rgba(0,0,0,0)', colorTextSec, 64);
          const idxSprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: idxTexture }));
          idxSprite.position.set(posX, 4.5, 0);
          idxSprite.scale.set(4, 2, 1);
          visualizerGroup.add(idxSprite);

          // Draw arrows between adjacent nodes
          if (idx < arr.length - 1) {
            const arrowLength = 4.4;
            const arrowDir = new THREE.Vector3(1, 0, 0);
            const arrowOrigin = new THREE.Vector3(posX + 2.8, 0, 0);
            const arrowHelper = new THREE.ArrowHelper(arrowDir, arrowOrigin, arrowLength, new THREE.Color(accentTert), 1.2, 0.6);
            visualizerGroup.add(arrowHelper);
          }

          // Cycle representation (drawn as curved loop from last node to node 2)
          if (idx === arr.length - 1 && config.inputLabel.includes('cycle')) {
            // Draw a curved line to represent loop back
            const startNodeX = posX;
            const endNodeX = startX + 2 * 10; // Connect back to node 3 (index 2)
            
            const curve = new THREE.QuadraticBezierCurve3(
              new THREE.Vector3(startNodeX, 0.5, 1),
              new THREE.Vector3((startNodeX + endNodeX) / 2, 8, 8),
              new THREE.Vector3(endNodeX, 0.5, 1)
            );
            const points = curve.getPoints(24);
            const curveGeom = new THREE.BufferGeometry().setFromPoints(points);
            const curveMat = new THREE.LineBasicMaterial({ color: new THREE.Color(accentPrim), linewidth: 2 });
            const curveLine = new THREE.Line(curveGeom, curveMat);
            visualizerGroup.add(curveLine);

            // Add arrow head at end
            const arrowHelper = new THREE.ArrowHelper(
              new THREE.Vector3(0, -1, 0),
              new THREE.Vector3(endNodeX, 2.5, 0.5),
              2.5,
              new THREE.Color(accentPrim),
              1.0,
              0.5
            );
            visualizerGroup.add(arrowHelper);
          }

          // Entry scale
          sphereMesh.scale.set(0.1, 0.1, 0.1);
          lerpTargets.push({
            mesh: sphereMesh,
            targetPos: sphereMesh.position.clone(),
            targetScale: new THREE.Vector3(1, 1, 1),
          });
        });

        // Draw pointer arrows (pointing down)
        Object.entries(pointers).forEach(([name, idx]) => {
          const arrowGroup = new THREE.Group();
          const pColor = name.includes('fast') ? accentPrim : accentTert;
          const arrowMat = new THREE.MeshStandardMaterial({ color: new THREE.Color(pColor) });

          const head = new THREE.Mesh(new THREE.ConeGeometry(0.8, 1.6, 8), arrowMat);
          head.rotation.x = Math.PI;
          arrowGroup.add(head);

          const badge = new THREE.Sprite(new THREE.SpriteMaterial({ map: createTextTexture(name, pColor, '#FFFFFF', 128) }));
          badge.position.set(0, 2.2, 0);
          badge.scale.set(6, 3, 1);
          arrowGroup.add(badge);

          const targetX = startX + idx * 10;
          // Offset fast pointer higher to avoid overlapping slow pointer
          const yPos = name.includes('fast') ? 7.5 : 5.0;

          arrowGroup.position.set(targetX, yPos + 10, 0);
          visualizerGroup.add(arrowGroup);

          lerpTargets.push({
            mesh: arrowGroup,
            targetPos: new THREE.Vector3(targetX, yPos, 0),
            targetScale: new THREE.Vector3(1, 1, 1),
          });
        });
      }

      // ─── CASE C: GRAPH / TREE VISUALIZATION ───
      else if (visType === 'graph' || visType === 'tree') {
        const graph = state.graph || {};
        const currentNode = state.currentNode;
        const visitedIdxs = state.visited || [];
        const queue = state.queue || [];
        const stack = state.stack || [];

        // Predefined layouts for nodes
        const nodePositions: Record<string, THREE.Vector3> = {};
        const nodeNames = Object.keys(graph);

        // Kahn's or BFS graph layout
        if (nodeNames.includes('0')) {
          // DAG topological layout: arrange left to right
          nodePositions['0'] = new THREE.Vector3(-22, 10, 0);
          nodePositions['1'] = new THREE.Vector3(-22, -10, 0);
          nodePositions['2'] = new THREE.Vector3(-6, 0, 0);
          nodePositions['3'] = new THREE.Vector3(10, 0, 0);
          nodePositions['4'] = new THREE.Vector3(26, 0, 0);
        } else {
          // BFS / DFS tree-like graph layout: root at top, children branches
          nodePositions['A'] = new THREE.Vector3(0, 15, 0);
          nodePositions['B'] = new THREE.Vector3(-15, 0, 0);
          nodePositions['C'] = new THREE.Vector3(15, 0, 0);
          nodePositions['D'] = new THREE.Vector3(-22, -15, 0);
          nodePositions['E'] = new THREE.Vector3(22, -15, 0);
        }

        // Draw Nodes
        nodeNames.forEach((name, idx) => {
          const pos = nodePositions[name] || new THREE.Vector3(0, 0, 0);
          const isCurrent = name === currentNode;
          const isVisited = visitedIdxs.includes(idx);
          const inQueueStack = queue.includes(name) || stack.includes(name);

          let nodeColor = colorBgSec;
          let textColor = colorText;
          if (isCurrent) {
            nodeColor = accentPrim;
            textColor = '#FFFFFF';
          } else if (inQueueStack) {
            nodeColor = colorBgTert;
            textColor = accentPrim;
          } else if (isVisited) {
            nodeColor = accentSec;
            textColor = '#FFFFFF';
          }

          const sphereGeom = new THREE.SphereGeometry(3.6, 16, 16);
          const texture = createTextTexture(name, nodeColor, textColor);
          const material = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.2,
          });

          const nodeMesh = new THREE.Mesh(sphereGeom, material);
          nodeMesh.position.copy(pos);
          visualizerGroup.add(nodeMesh);

          // Current node pulse scaling
          const scaleVal = isCurrent ? 1.3 : 1.0;
          nodeMesh.scale.set(0.1, 0.1, 0.1);
          lerpTargets.push({
            mesh: nodeMesh,
            targetPos: pos.clone(),
            targetScale: new THREE.Vector3(scaleVal, scaleVal, scaleVal),
          });
        });

        // Draw Connections (Edges)
        const edgeMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(colorBgTert),
          linewidth: 2,
        });

        const activeEdgeMaterial = new THREE.LineBasicMaterial({
          color: new THREE.Color(accentPrim),
          linewidth: 4,
        });

        Object.entries(graph).forEach(([fromNode, toNodes]) => {
          const fromPos = nodePositions[fromNode];
          if (!fromPos) return;

          toNodes.forEach((toNode) => {
            const toPos = nodePositions[toNode];
            if (!toPos) return;

            // Highlight edge if active or traversal happens between them
            const isFromCurrent = fromNode === currentNode;
            const isToVisited = visitedIdxs.includes(nodeNames.indexOf(toNode));
            const isActiveEdge = isFromCurrent && (queue.includes(toNode) || stack.includes(toNode) || isToVisited);

            // Compute line points
            const points = [
              new THREE.Vector3(fromPos.x, fromPos.y, fromPos.z),
              new THREE.Vector3(toPos.x, toPos.y, toPos.z),
            ];

            const edgeGeom = new THREE.BufferGeometry().setFromPoints(points);
            const line = new THREE.Line(edgeGeom, isActiveEdge ? activeEdgeMaterial : edgeMaterial);
            visualizerGroup.add(line);

            // Draw directional arrow pointer cone at the center of edge
            const arrowDir = new THREE.Vector3().subVectors(toPos, fromPos).normalize();
            const arrowOrigin = new THREE.Vector3().addVectors(fromPos, toPos).multiplyScalar(0.5);
            const arrowCone = new THREE.Mesh(
              new THREE.ConeGeometry(0.7, 1.8, 8),
              isActiveEdge ? new THREE.MeshStandardMaterial({ color: new THREE.Color(accentPrim) }) : new THREE.MeshStandardMaterial({ color: new THREE.Color(colorBgTert) })
            );
            arrowCone.position.copy(arrowOrigin);
            // Rotate cone to align with direction
            const quaternion = new THREE.Quaternion();
            quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), arrowDir);
            arrowCone.setRotationFromQuaternion(quaternion);
            visualizerGroup.add(arrowCone);
          });
        });
      }

      // ─── CASE D: STACK & QUEUE VISUALIZATION ───
      else if (visType === 'stack-queue') {
        const stack = state.stack || [];
        const queue = state.queue || [];

        // Draw 3D container bin (wireframe box)
        const containerWidth = visType === 'stack-queue' && queue.length > 0 ? 32 : 12;
        const containerHeight = 18;
        const containerGeom = new THREE.BoxGeometry(containerWidth, containerHeight, 6);
        const containerMat = new THREE.MeshBasicMaterial({
          color: new THREE.Color(colorBgTert),
          wireframe: true,
          transparent: true,
          opacity: 0.3,
        });
        const containerMesh = new THREE.Mesh(containerGeom, containerMat);
        containerMesh.position.set(0, 0, 0);
        visualizerGroup.add(containerMesh);

        // Visualizing Stack (stacked vertical slabs)
        if (stack.length > 0) {
          const slabHeight = 2.4;
          const startY = -containerHeight / 2 + slabHeight / 2 + 1;

          stack.forEach((val, idx) => {
            const slabGeom = new THREE.BoxGeometry(10, slabHeight, 4.8);
            const texture = createTextTexture(String(val), colorBgTert, colorText);
            const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3 });

            const slabMesh = new THREE.Mesh(slabGeom, mat);
            // Stack elements sit on top of each other
            const targetY = startY + idx * 2.8;

            slabMesh.position.set(0, targetY + 12, 0); // drop from top
            visualizerGroup.add(slabMesh);

            lerpTargets.push({
              mesh: slabMesh,
              targetPos: new THREE.Vector3(0, targetY, 0),
              targetScale: new THREE.Vector3(1, 1, 1),
            });
          });
        }

        // Visualizing Queue (aligned horizontal slabs)
        if (queue.length > 0) {
          const slabWidth = 5.2;
          const startX = -containerWidth / 2 + slabWidth / 2 + 1;

          queue.forEach((val, idx) => {
            const slabGeom = new THREE.BoxGeometry(slabWidth, 10, 4.8);
            const texture = createTextTexture(String(val), colorBgTert, colorText);
            const mat = new THREE.MeshStandardMaterial({ map: texture, roughness: 0.3 });

            const slabMesh = new THREE.Mesh(slabGeom, mat);
            // Queue elements align side-by-side
            const targetX = startX + idx * 6;

            slabMesh.position.set(targetX + 15, 0, 0); // slide in from right
            visualizerGroup.add(slabMesh);

            lerpTargets.push({
              mesh: slabMesh,
              targetPos: new THREE.Vector3(targetX, 0, 0),
              targetScale: new THREE.Vector3(1, 1, 1),
            });
          });
        }
      }

      // ─── CASE E: MATRIX VISUALIZATION (DP Tables) ───
      else if (visType === 'matrix') {
        const rowsStr = state.array || [];
        const pointers = state.pointers || {}; // Row/Col cursor positions
        const highlighted = state.highlighted || [];

        // Parse rows representing DP table grids
        // e.g. "Row 1 (wt 1, val 1): [0, 1, 1, 1, 1]"
        const matrixData: number[][] = [];
        let colCount = 0;

        rowsStr.forEach((rowStr) => {
          const str = String(rowStr);
          const match = str.match(/\[(.*?)\]/);
          if (match) {
            // Split and parse numbers, replacing T/F with 1/0 for boolean grids
            const values = match[1].split(',').map((val) => {
              const cleaned = val.trim().toLowerCase();
              if (cleaned === 't') return 1;
              if (cleaned === 'f') return 0;
              return parseFloat(cleaned) || 0;
            });
            matrixData.push(values);
            colCount = Math.max(colCount, values.length);
          }
        });

        if (matrixData.length > 0 && colCount > 0) {
          const cellWidth = 5;
          const startX = -(colCount - 1) * cellWidth / 2;
          const startZ = -(matrixData.length - 1) * cellWidth / 2;

          matrixData.forEach((rowValues, rIdx) => {
            const zPos = startZ + rIdx * cellWidth;

            rowValues.forEach((val, cIdx) => {
              const xPos = startX + cIdx * cellWidth;

              // Check if cell is currently highlighted or active
              const isActiveRow = pointers.row !== undefined && pointers.row === rIdx;
              const isActiveCol = pointers.col !== undefined && pointers.col === cIdx;
              const isCellActive = isActiveRow || (isActiveRow && isActiveCol);
              const rowHigh = highlighted.includes(rIdx);

              // Calculate dynamic height based on the cell value (perfect for DP grids!)
              // Scale height to be between 1.5 and 10 based on value size
              const maxVal = Math.max(...matrixData.flat(), 1);
              const heightMultiplier = maxVal > 10 ? 8 / maxVal : 1.2;
              const targetHeight = Math.max(val * heightMultiplier + 1.2, 1.2);

              let cellColor = colorBgSec;
              let textColor = colorText;
              if (rowHigh) {
                cellColor = colorBgTert;
                textColor = accentPrim;
              }
              if (isCellActive) {
                cellColor = accentPrim;
                textColor = '#FFFFFF';
              }

              const cellGeom = new THREE.BoxGeometry(cellWidth * 0.85, targetHeight, cellWidth * 0.85);
              const texture = createTextTexture(String(val), cellColor, textColor, 64);
              const material = new THREE.MeshStandardMaterial({
                map: texture,
                roughness: 0.25,
              });

              const cellMesh = new THREE.Mesh(cellGeom, material);
              // Position on the ground plane, height extrusion upwards
              cellMesh.position.set(xPos, targetHeight / 2 - 5, zPos);
              visualizerGroup.add(cellMesh);

              // Scale entry animation
              cellMesh.scale.set(1, 0.05, 1);
              lerpTargets.push({
                mesh: cellMesh,
                targetPos: cellMesh.position.clone(),
                targetScale: new THREE.Vector3(1, 1, 1),
              });
            });
          });
        }
      }
    };

    // Rebuild initial state
    rebuildScene();

    // 6. Resize handler
    const handleResize = () => {
      if (!containerRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Smooth interpolation (lerping) toward targets
      lerpTargets.forEach((target) => {
        // Lerp position
        target.mesh.position.lerp(target.targetPos, 0.12);
        // Lerp scale
        target.mesh.scale.lerp(target.targetScale, 0.12);
      });

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Rebuild scene when active step or config changes
    rebuildScene();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [config, activeStepIdx]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        minHeight: '340px',
        position: 'relative',
        cursor: 'grab',
      }}
    />
  );
};
