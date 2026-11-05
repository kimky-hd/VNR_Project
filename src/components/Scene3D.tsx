import React, { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Html, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import {
  Check,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  RotateCw,
  Compass,
  MapPin,
} from 'lucide-react';
import {
  TOUR_SPOTS,
  VIEW_MODE_CAMERAS,
  TourSpot,
  ArchitecturalViewMode,
} from '../data/tourData';

interface Scene3DProps {
  activeSpot: TourSpot | null;
  visitedIds: number[];
  onSelectSpot: (spot: TourSpot) => void;
  isNight: boolean;
  viewMode: ArchitecturalViewMode;
  resetTrigger: number;
}

/** Bộ tạo Texture kiến trúc (chỉ khởi tạo 1 lần duy nhất trong bộ nhớ, 0ms network) */
let cachedTextures: {
  wood: THREE.CanvasTexture;
  roofTile: THREE.CanvasTexture;
  waterBump: THREE.CanvasTexture;
  sedgeMat: THREE.CanvasTexture;
} | null = null;

function getArchitecturalTextures() {
  if (cachedTextures) return cachedTextures;

  // 1. Vân gỗ lim / gỗ dổi tự nhiên
  const woodCanvas = document.createElement('canvas');
  woodCanvas.width = 256;
  woodCanvas.height = 256;
  const wCtx = woodCanvas.getContext('2d')!;
  wCtx.fillStyle = '#6A3D22';
  wCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 120; i++) {
    wCtx.fillStyle = i % 2 === 0 ? 'rgba(42, 22, 10, 0.16)' : 'rgba(140, 88, 50, 0.12)';
    const y = (i * 2.2) % 256;
    wCtx.fillRect(0, y, 256, 1.5);
  }
  const wood = new THREE.CanvasTexture(woodCanvas);
  wood.wrapS = THREE.RepeatWrapping;
  wood.wrapT = THREE.RepeatWrapping;
  wood.repeat.set(2, 2);

  // 2. Ngói vẩy cá đất nung truyền thống
  const roofCanvas = document.createElement('canvas');
  roofCanvas.width = 256;
  roofCanvas.height = 256;
  const rCtx = roofCanvas.getContext('2d')!;
  rCtx.fillStyle = '#7A3520';
  rCtx.fillRect(0, 0, 256, 256);
  for (let row = 0; row < 16; row++) {
    const ry = row * 16;
    rCtx.fillStyle = row % 2 === 0 ? '#6E2E1A' : '#853B24';
    rCtx.fillRect(0, ry, 256, 15);
    rCtx.strokeStyle = 'rgba(35, 14, 8, 0.45)';
    rCtx.lineWidth = 1.5;
    for (let col = 0; col < 8; col++) {
      const cx = col * 32 + (row % 2) * 16;
      rCtx.beginPath();
      rCtx.arc(cx, ry + 8, 15, 0, Math.PI);
      rCtx.stroke();
    }
  }
  const roofTile = new THREE.CanvasTexture(roofCanvas);
  roofTile.wrapS = THREE.RepeatWrapping;
  roofTile.wrapT = THREE.RepeatWrapping;
  roofTile.repeat.set(6, 4);

  // 3. Gợn nước tự nhiên cho Ao cá Bác Hồ
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = 256;
  waterCanvas.height = 256;
  const waCtx = waterCanvas.getContext('2d')!;
  waCtx.fillStyle = '#808080';
  waCtx.fillRect(0, 0, 256, 256);
  for (let i = 0; i < 90; i++) {
    const x = (i * 37) % 256;
    const y = (i * 53) % 256;
    const grad = waCtx.createRadialGradient(x, y, 2, x, y, 28);
    grad.addColorStop(0, 'rgba(255,255,255,0.22)');
    grad.addColorStop(1, 'rgba(128,128,128,0)');
    waCtx.fillStyle = grad;
    waCtx.beginPath();
    waCtx.arc(x, y, 28, 0, Math.PI * 2);
    waCtx.fill();
  }
  const waterBump = new THREE.CanvasTexture(waterCanvas);
  waterBump.wrapS = THREE.RepeatWrapping;
  waterBump.wrapT = THREE.RepeatWrapping;
  waterBump.repeat.set(4, 3);

  // 4. Chiếu cói mộc mạc
  const matCanvas = document.createElement('canvas');
  matCanvas.width = 128;
  matCanvas.height = 128;
  const mCtx = matCanvas.getContext('2d')!;
  mCtx.fillStyle = '#D8C396';
  mCtx.fillRect(0, 0, 128, 128);
  mCtx.fillStyle = 'rgba(155, 45, 35, 0.55)';
  mCtx.fillRect(0, 0, 128, 6);
  mCtx.fillRect(0, 122, 128, 6);
  const sedgeMat = new THREE.CanvasTexture(matCanvas);

  cachedTextures = { wood, roofTile, waterBump, sedgeMat };
  return cachedTextures;
}

/** Tạo đường cong tự nhiên (Organic Bezier Curve) cho Ao cá Bác Hồ */
function createNaturalPondShape(scale = 1.0): THREE.Shape {
  const s = new THREE.Shape();
  s.moveTo(0 * scale, -2.05 * scale);
  s.bezierCurveTo(2.4 * scale, -2.05 * scale, 4.65 * scale, -1.55 * scale, 4.75 * scale, 0.05 * scale);
  s.bezierCurveTo(4.85 * scale, 1.55 * scale, 2.75 * scale, 2.15 * scale, 0.15 * scale, 2.05 * scale);
  s.bezierCurveTo(-2.45 * scale, 1.95 * scale, -4.65 * scale, 1.65 * scale, -4.75 * scale, 0.0 * scale);
  s.bezierCurveTo(-4.85 * scale, -1.55 * scale, -2.35 * scale, -2.05 * scale, 0 * scale, -2.05 * scale);
  return s;
}

/**
 * 1. NỀN ĐỊA HÌNH KHU DI TÍCH VỚI LÒNG AO ĐÀO ÂM TỰ NHIÊN
 * Giải quyết triệt để lỗi Ao cá giống khối bê tông:
 * Mặt cỏ có hố đào âm thực sự theo đường cong tự nhiên của Ao cá Bác Hồ.
 */
const RecessedSiteTerrain = React.memo<{ isNight: boolean }>(({ isNight }) => {
  const terrainGeometry = useMemo(() => {
    const outer = new THREE.Shape();
    const w = 9.4;
    const dFront = 9.8;
    const dBack = -7.6;
    const r = 0.6;

    outer.moveTo(-w + r, dBack);
    outer.lineTo(w - r, dBack);
    outer.quadraticCurveTo(w, dBack, w, dBack + r);
    outer.lineTo(w, dFront - r);
    outer.quadraticCurveTo(w, dFront, w - r, dFront);
    outer.lineTo(-w + r, dFront);
    outer.quadraticCurveTo(-w, dFront, -w, dFront - r);
    outer.lineTo(-w, dBack + r);
    outer.quadraticCurveTo(-w, dBack, -w + r, dBack);

    // Khoét lỗ tự nhiên cho Ao cá Bác Hồ tại (x = 0.2, z = 5.6)
    const pondHole = new THREE.Path();
    const pts = createNaturalPondShape(1.02).getPoints(48);
    pts.forEach((pt, idx) => {
      const px = pt.x + 0.2;
      const pz = pt.y + 5.6;
      if (idx === 0) pondHole.moveTo(px, pz);
      else pondHole.lineTo(px, pz);
    });
    pondHole.closePath();
    outer.holes.push(pondHole);

    const geom = new THREE.ExtrudeGeometry(outer, {
      depth: 0.32,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.04,
      bevelSegments: 3,
      curveSegments: 36,
    });
    geom.rotateX(Math.PI / 2);
    return geom;
  }, []);

  return (
    <group>
      {/* Đế gỗ trưng bày sa bàn bên dưới */}
      <mesh position={[0, -0.32, 1.1]} receiveShadow>
        <boxGeometry args={[19.2, 0.36, 17.8]} />
        <meshStandardMaterial color="#231D18" roughness={0.85} />
      </mesh>
      {/* Viền đồng mảnh quanh đế sa bàn */}
      <mesh position={[0, -0.13, 1.1]}>
        <boxGeometry args={[19.3, 0.03, 17.9]} />
        <meshStandardMaterial color="#8C6D46" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Thảm cỏ tự nhiên có khoét lòng Ao cá Bác Hồ */}
      <mesh geometry={terrainGeometry} position={[0, 0.18, 0]} receiveShadow>
        <meshStandardMaterial
          color={isNight ? '#1E3224' : '#2E4C34'}
          roughness={0.92}
        />
      </mesh>
    </group>
  );
});

interface CarpData {
  radiusX: number;
  radiusZ: number;
  speed: number;
  offset: number;
  y: number;
  color: string;
  scale: number;
}

/**
 * 2. AO CÁ BÁC HỒ (Lòng hồ tự nhiên đào âm dưới mặt cỏ, mặt nước phản chiếu có chiều sâu)
 */
const NaturalAoCaBacHo = React.memo<{
  isNight: boolean;
  onSelect: () => void;
}>(({ isNight, onSelect }) => {
  const fishRefs = useRef<(THREE.Group | null)[]>([]);
  const waterMatRef = useRef<THREE.MeshPhysicalMaterial>(null);
  const { waterBump } = useMemo(() => getArchitecturalTextures(), []);

  // Hình học mặt nước và đáy hồ uốn lượn tự nhiên
  const { waterGeom, bedGeom, bankStones, lotusClusters } = useMemo(() => {
    const wShape = createNaturalPondShape(1.0);
    const wGeom = new THREE.ShapeGeometry(wShape, 48);
    wGeom.rotateX(-Math.PI / 2);

    const bShape = createNaturalPondShape(1.05);
    const bGeom = new THREE.ShapeGeometry(bShape, 36);
    bGeom.rotateX(-Math.PI / 2);

    // Các viên đá cuội tự nhiên và bụi cỏ dọc theo đường cong bờ ao
    const perimeterPts = createNaturalPondShape(1.03).getPoints(56);
    const stones = perimeterPts.map((pt, idx) => ({
      x: pt.x,
      z: pt.y,
      scaleX: 0.28 + ((idx * 7) % 5) * 0.04,
      scaleY: 0.12 + ((idx * 3) % 4) * 0.02,
      scaleZ: 0.24 + ((idx * 5) % 4) * 0.04,
      rotY: idx * 0.45,
      isMossy: idx % 3 === 0,
    }));

    const lotus = [
      { x: -3.1, z: 0.45, r: 0.28, hasFlower: true },
      { x: -2.65, z: 0.82, r: 0.22, hasFlower: false },
      { x: -3.45, z: 0.78, r: 0.2, hasFlower: false },
      { x: 2.8, z: -0.55, r: 0.3, hasFlower: true },
      { x: 3.25, z: -0.2, r: 0.23, hasFlower: false },
      { x: 2.4, z: 0.88, r: 0.26, hasFlower: true },
      { x: 1.95, z: 1.12, r: 0.2, hasFlower: false },
    ];

    return {
      waterGeom: wGeom,
      bedGeom: bGeom,
      bankStones: stones,
      lotusClusters: lotus,
    };
  }, []);

  const fishes = useMemo<CarpData[]>(
    () => [
      { radiusX: 2.6, radiusZ: 1.1, speed: 0.35, offset: 0.0, y: -0.02, color: '#C84B31', scale: 1.0 },
      { radiusX: 1.85, radiusZ: 0.8, speed: -0.31, offset: 1.4, y: -0.04, color: '#D97724', scale: 0.88 },
      { radiusX: 3.2, radiusZ: 1.25, speed: 0.28, offset: 2.7, y: -0.02, color: '#B83B2A', scale: 1.08 },
      { radiusX: 1.35, radiusZ: 0.6, speed: 0.42, offset: 3.8, y: -0.03, color: '#E08E35', scale: 0.82 },
      { radiusX: 2.25, radiusZ: 0.95, speed: -0.34, offset: 4.9, y: -0.02, color: '#C84B31', scale: 0.94 },
      { radiusX: 1.05, radiusZ: 0.5, speed: -0.45, offset: 2.1, y: -0.03, color: '#D97724', scale: 0.78 },
      { radiusX: 2.9, radiusZ: 1.15, speed: 0.26, offset: 5.5, y: -0.04, color: '#A83224', scale: 0.96 },
      { radiusX: 1.6, radiusZ: 0.7, speed: 0.38, offset: 0.8, y: -0.02, color: '#E69A28', scale: 0.85 },
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Chuyển động nhẹ của gợn nước
    waterBump.offset.x = (t * 0.018) % 1;
    waterBump.offset.y = (t * 0.012) % 1;

    // Đàn cá bơi uốn lượn tự nhiên dưới mặt nước
    for (let i = 0; i < fishes.length; i++) {
      const fish = fishes[i];
      const group = fishRefs.current[i];
      if (!group) continue;
      const angle = t * fish.speed + fish.offset;
      const nextAngle = angle + (fish.speed > 0 ? 0.05 : -0.05);

      const x = Math.cos(angle) * fish.radiusX;
      const z = Math.sin(angle) * fish.radiusZ;
      const nextX = Math.cos(nextAngle) * fish.radiusX;
      const nextZ = Math.sin(nextAngle) * fish.radiusZ;

      group.position.set(x, fish.y, z);
      group.lookAt(nextX, fish.y, nextZ);
    }
  });

  return (
    <group
      position={[0.2, 0, 5.6]}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
    >
      {/* Đáy lòng hồ trầm sâu (nằm âm ở y = -0.12) */}
      <mesh geometry={bedGeom} position={[0, -0.12, 0]} receiveShadow>
        <meshStandardMaterial color="#0A211C" roughness={0.95} />
      </mesh>

      {/* Lớp bùn/rêu thủy sinh tạo độ chuyển màu chiều sâu dưới lòng hồ */}
      <mesh geometry={waterGeom} position={[0, -0.07, 0]} scale={[0.92, 1, 0.9]}>
        <meshStandardMaterial color="#10332B" roughness={0.9} />
      </mesh>

      {/* MẶT NƯỚC AO CÁ BÁC HỒ TỰ NHIÊN (y = 0.06, thấp hơn mặt cỏ y = 0.18 đúng thực tế) */}
      <mesh geometry={waterGeom} position={[0, 0.06, 0]} receiveShadow>
        <meshPhysicalMaterial
          ref={waterMatRef}
          color={isNight ? '#123A32' : '#1B5649'}
          emissive={isNight ? '#0A241F' : '#0E332B'}
          emissiveIntensity={0.25}
          bumpMap={waterBump}
          bumpScale={0.015}
          roughness={0.14}
          metalness={0.12}
          clearcoat={0.9}
          clearcoatRoughness={0.12}
          reflectivity={0.75}
          transparent
          opacity={0.76}
        />
      </mesh>

      {/* Bờ kè đá cuội rêu phong tự nhiên ôm theo đường cong uốn lượn của Ao cá */}
      {bankStones.map((st, idx) => (
        <mesh
          key={idx}
          position={[st.x, 0.14, st.z]}
          rotation={[0, st.rotY, 0]}
          scale={[st.scaleX, st.scaleY, st.scaleZ]}
          receiveShadow
          castShadow
        >
          <dodecahedronGeometry args={[0.65, 1]} />
          <meshStandardMaterial
            color={st.isMossy ? '#3D4F3C' : '#6E6A61'}
            roughness={0.88}
          />
        </mesh>
      ))}

      {/* BẬC CẦU AO NƠI BÁC HỒ VỖ TAY GỌI CÁ ĂN (Gắn kết tự nhiên từ bờ cỏ xuống mặt nước) */}
      <group position={[-1.25, 0.06, -1.92]}>
        {/* 3 bậc gạch dẫn từ bờ xuống sát mặt nước */}
        <mesh position={[0, 0.1, -0.15]} castShadow receiveShadow>
          <boxGeometry args={[1.45, 0.08, 0.38]} />
          <meshStandardMaterial color="#9E9587" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.05, 0.12]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.08, 0.35]} />
          <meshStandardMaterial color="#8C8476" roughness={0.82} />
        </mesh>
        <mesh position={[0, 0.0, 0.36]} receiveShadow>
          <boxGeometry args={[1.35, 0.06, 0.32]} />
          <meshStandardMaterial color="#787165" roughness={0.85} />
        </mesh>

        {/* Hai trụ lan can thấp sơn vàng kem hai bên bậc cầu ao (chuẩn ảnh thực tế cottage-3.jpg) */}
        {[-0.72, 0.72].map((px, idx) => (
          <group key={idx} position={[px, 0.14, -0.15]}>
            <mesh position={[0, 0.14, 0]} castShadow>
              <boxGeometry args={[0.2, 0.28, 0.2]} />
              <meshStandardMaterial color="#DEC278" roughness={0.68} />
            </mesh>
            <mesh position={[0, 0.04, 0.24]} rotation={[0.35, 0, 0]} castShadow>
              <boxGeometry args={[0.14, 0.1, 0.48]} />
              <meshStandardMaterial color="#DEC278" roughness={0.68} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Cụm lá sen, hoa súng và thực vật thủy sinh trên mặt nước */}
      {lotusClusters.map((lt, idx) => (
        <group key={idx} position={[lt.x, 0.072, lt.z]}>
          <mesh rotation={[0, idx * 1.1, 0]}>
            <cylinderGeometry args={[lt.r, lt.r, 0.008, 16]} />
            <meshStandardMaterial color="#275235" roughness={0.65} />
          </mesh>
          {lt.hasFlower && (
            <mesh position={[0, 0.03, 0]}>
              <octahedronGeometry args={[0.055, 0]} />
              <meshStandardMaterial
                color="#F4B8C8"
                emissive="#C85A78"
                emissiveIntensity={0.18}
                roughness={0.4}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Rễ cây bụt mọc nhô lên tự nhiên dọc ven bờ ao */}
      {[-3.8, -3.5, -3.1, 2.9, 3.3, 3.65].map((rx, idx) => (
        <mesh key={idx} position={[rx, 0.24, -1.98]} castShadow>
          <coneGeometry args={[0.045, 0.18 + (idx % 3) * 0.04, 7]} />
          <meshStandardMaterial color="#594130" roughness={0.88} />
        </mesh>
      ))}

      {/* Đàn cá chép bơi lội dưới làn nước trong */}
      {fishes.map((fish, idx) => (
        <group
          key={idx}
          ref={(el) => {
            fishRefs.current[idx] = el;
          }}
          scale={fish.scale}
        >
          <mesh scale={[0.58, 0.42, 1.8]}>
            <octahedronGeometry args={[0.085, 1]} />
            <meshStandardMaterial
              color={fish.color}
              emissive={fish.color}
              emissiveIntensity={0.18}
              roughness={0.3}
            />
          </mesh>
          <mesh position={[0, 0, -0.16]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.052, 0.1, 4]} />
            <meshStandardMaterial color="#F2B880" roughness={0.4} />
          </mesh>
        </group>
      ))}
    </group>
  );
});

/**
 * 3. CÂY CỔ THỤ TỰ NHIÊN NHIỀU TẦNG TÁN LÁ (Thay thế các khối cầu low-poly đơn điệu)
 */
const RealisticHeritageTree = React.memo<{
  position: [number, number, number];
  scale?: number;
  whitewashedBase?: boolean;
  onClick?: () => void;
}>(({ position, scale = 1.0, whitewashedBase = true, onClick }) => {
  return (
    <group
      position={position}
      scale={scale}
      onClick={
        onClick
          ? (e) => {
              e.stopPropagation();
              onClick();
            }
          : undefined
      }
    >
      {/* Phần gốc cây quét vôi trắng đặc trưng của Khu di tích Phủ Chủ tịch */}
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.17, 0.25, 0.96, 10]} />
        <meshStandardMaterial
          color={whitewashedBase ? '#EAE6DF' : '#4A382B'}
          roughness={0.85}
        />
      </mesh>
      {/* Thân chính và các nhánh phân cành tự nhiên */}
      <mesh position={[0, 1.75, 0]} rotation={[0.03, 0, -0.02]} castShadow>
        <cylinderGeometry args={[0.13, 0.17, 1.7, 10]} />
        <meshStandardMaterial color="#4A382B" roughness={0.85} />
      </mesh>
      <mesh position={[-0.32, 2.55, 0.15]} rotation={[0.18, 0, 0.42]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.95, 8]} />
        <meshStandardMaterial color="#4A382B" roughness={0.85} />
      </mesh>
      <mesh position={[0.34, 2.5, -0.12]} rotation={[-0.15, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.07, 0.11, 0.95, 8]} />
        <meshStandardMaterial color="#4A382B" roughness={0.85} />
      </mesh>

      {/* Tán lá đa tầng mềm mại với độ chuyển sắc xanh tự nhiên */}
      <mesh position={[0, 3.35, 0]} scale={[1.25, 0.85, 1.2]} castShadow receiveShadow>
        <icosahedronGeometry args={[1.05, 2]} />
        <meshStandardMaterial color="#23472A" roughness={0.8} />
      </mesh>
      <mesh position={[-0.68, 2.98, 0.32]} scale={[1.1, 0.8, 1.05]} castShadow>
        <icosahedronGeometry args={[0.78, 2]} />
        <meshStandardMaterial color="#1D3B23" roughness={0.82} />
      </mesh>
      <mesh position={[0.72, 3.02, -0.25]} scale={[1.1, 0.8, 1.05]} castShadow>
        <icosahedronGeometry args={[0.76, 2]} />
        <meshStandardMaterial color="#2A5231" roughness={0.8} />
      </mesh>
      <mesh position={[0.15, 3.85, -0.1]} scale={[1.15, 0.78, 1.1]} castShadow>
        <icosahedronGeometry args={[0.72, 2]} />
        <meshStandardMaterial color="#315E38" roughness={0.78} />
      </mesh>
    </group>
  );
});

/**
 * 4. QUẦN THỂ ĐƯỜNG XOÀI, NHÀ 54, NHÀ 67 & VƯỜN CÂY
 */
const KhuDiTichLandscape = React.memo<{
  onSelectZone2: () => void;
  onSelectPond: () => void;
}>(({ onSelectZone2, onSelectPond }) => {
  const { roofTile } = useMemo(() => getArchitecturalTextures(), []);

  return (
    <group>
      {/* ĐƯỜNG XOÀI LỊCH SỬ (Chạy dọc giữa bờ Ao cá và sân Nhà sàn, nối từ Nhà 54) */}
      <group
        position={[0, 0.185, 2.95]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectZone2();
        }}
      >
        <mesh receiveShadow>
          <boxGeometry args={[17.6, 0.02, 1.15]} />
          <meshStandardMaterial color="#C8BFA8" roughness={0.8} />
        </mesh>
        {/* Viền gạch chỉ đỏ hai bên Đường Xoài */}
        <mesh position={[0, 0.012, -0.56]}>
          <boxGeometry args={[17.6, 0.025, 0.07]} />
          <meshStandardMaterial color="#8C3B2B" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.012, 0.56]}>
          <boxGeometry args={[17.6, 0.025, 0.07]} />
          <meshStandardMaterial color="#8C3B2B" roughness={0.75} />
        </mesh>
      </group>

      {/* Lối đi lát gạch vuông từ Đường Xoài vào chính diện Nhà sàn Bác Hồ */}
      <mesh position={[0, 0.186, 1.72]} receiveShadow>
        <boxGeometry args={[1.55, 0.02, 1.35]} />
        <meshStandardMaterial color="#D6CFC2" roughness={0.75} />
      </mesh>

      {/* HÀNG RÀO DÂM BỤT cắt tỉa gọn gàng hai bên lối vào Nhà sàn */}
      {[-3.3, -2.4, -1.5, 1.5, 2.4, 3.3].map((hx, idx) => (
        <group key={idx} position={[hx, 0.45, 2.2]}>
          <mesh scale={[1.15, 0.75, 0.65]} castShadow receiveShadow>
            <icosahedronGeometry args={[0.42, 2]} />
            <meshStandardMaterial color="#23472A" roughness={0.82} />
          </mesh>
          <mesh position={[0.14, 0.16, 0.22]}>
            <octahedronGeometry args={[0.04, 0]} />
            <meshStandardMaterial color="#C83228" roughness={0.5} />
          </mesh>
          <mesh position={[-0.16, 0.08, 0.22]}>
            <octahedronGeometry args={[0.035, 0]} />
            <meshStandardMaterial color="#C83228" roughness={0.5} />
          </mesh>
        </group>
      ))}

      {/* NHÀ 54 (Kiến trúc Pháp sơn vàng kem, cửa chớp xanh lá trầm, mái ngói đỏ, đặt ở đầu Đường Xoài cạnh Ao cá) */}
      <group
        position={[-6.8, 0.18, 2.1]}
        rotation={[0, Math.PI / 2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectZone2();
        }}
      >
        <mesh position={[0, 0.12, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.5, 0.24, 2.25]} />
          <meshStandardMaterial color="#78716C" roughness={0.85} />
        </mesh>
        <mesh position={[0, 1.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.3, 1.65, 2.05]} />
          <meshStandardMaterial color="#DEC278" roughness={0.7} />
        </mesh>
        {[-1.0, 0, 1.0].map((wx, i) => (
          <mesh key={i} position={[wx, 1.02, 1.03]}>
            <boxGeometry args={[0.52, 0.96, 0.04]} />
            <meshStandardMaterial color="#2A4D3E" roughness={0.65} />
          </mesh>
        ))}
        <mesh
          position={[0, 2.24, 0]}
          rotation={[0, Math.PI / 4, 0]}
          scale={[1.26, 1, 0.85]}
          castShadow
        >
          <coneGeometry args={[2.22, 0.92, 4]} />
          <meshStandardMaterial map={roofTile} color="#8C3820" roughness={0.7} />
        </mesh>
      </group>

      {/* NHÀ 67 (Phía sau bên trái Nhà sàn, tường dày sơn xanh lục nhạt dưới bóng cây) */}
      <group
        position={[-6.0, 0.18, -3.5]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectZone2();
        }}
      >
        <mesh position={[0, 0.14, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.28, 2.4]} />
          <meshStandardMaterial color="#6E7570" roughness={0.85} />
        </mesh>
        <mesh position={[0, 0.96, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 1.42, 2.2]} />
          <meshStandardMaterial color="#9EB8A8" roughness={0.75} />
        </mesh>
        {[-0.65, 0.65].map((wx, i) => (
          <mesh key={i} position={[wx, 0.94, 1.11]}>
            <boxGeometry args={[0.54, 0.84, 0.04]} />
            <meshStandardMaterial color="#385244" roughness={0.65} />
          </mesh>
        ))}
        <mesh position={[0, 1.74, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.3, 0.16, 2.5]} />
          <meshStandardMaterial color="#57635C" roughness={0.8} />
        </mesh>
      </group>

      {/* CÂY VÚ SỮA MIỀN NAM bên hông Nhà sàn (kèm bồn gạch đỏ) */}
      <group position={[-4.35, 0.18, -0.4]}>
        <mesh position={[0, 0.12, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.92, 1.02, 0.24, 16]} />
          <meshStandardMaterial color="#8C3B2B" roughness={0.8} />
        </mesh>
        <RealisticHeritageTree
          position={[0, 0, 0]}
          scale={1.08}
          whitewashedBase
          onClick={onSelectPond}
        />
      </group>

      {/* Hàng cây xoài và cây cổ thụ quét vôi trắng dọc Đường Xoài & xung quanh Nhà sàn */}
      <RealisticHeritageTree position={[-2.2, 0.18, 3.4]} scale={0.95} whitewashedBase />
      <RealisticHeritageTree position={[2.2, 0.18, 3.4]} scale={0.95} whitewashedBase />
      <RealisticHeritageTree position={[4.5, 0.18, 3.2]} scale={1.0} whitewashedBase />
      <RealisticHeritageTree position={[5.2, 0.18, -0.6]} scale={1.05} whitewashedBase />
      <RealisticHeritageTree position={[-2.8, 0.18, -4.4]} scale={1.1} whitewashedBase />
      <RealisticHeritageTree position={[0.6, 0.18, -4.6]} scale={1.15} whitewashedBase />
      <RealisticHeritageTree position={[3.8, 0.18, -4.2]} scale={1.05} whitewashedBase />
    </group>
  );
});

/**
 * 5. KIẾN TRÚC NHÀ SÀN BÁC HỒ VỚI CƠ CHẾ MẶT CẮT KIẾN TRÚC CHÍNH XÁC (ARCHITECTURAL SECTION CUT)
 * - viewMode === 'overview': Hiển thị đầy đủ mái ngói, mành trúc, 2 tầng nguyên vẹn.
 * - viewMode === 'floor1': Cắt lớp toàn bộ khối tầng 2 & mái, hiển thị mặt cắt đầu cột để quan sát trọn vẹn Tầng 1.
 * - viewMode === 'floor2': Ẩn mái, trần và mành trúc trên cao; hạ vách mặt trước và vách ngăn xuống tường cắt thấp (0.42m)
 *   có viền mặt cắt sáng màu, giữ nguyên vách hậu có cửa chớp gỗ và toàn bộ nội thất 2 phòng Tầng 2!
 */
const NhaSanBacHo: React.FC<{
  isNight: boolean;
  viewMode: ArchitecturalViewMode;
  onSelectSpotById: (id: number) => void;
}> = ({ isNight, viewMode, onSelectSpotById }) => {
  const { wood, roofTile, sedgeMat } = useMemo(
    () => getArchitecturalTextures(),
    []
  );

  const columnX = [-2.7, -0.9, 0.9, 2.7];
  const columnZ = [-1.45, 0, 1.45];

  const hipRoofGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(4.72, 1.65, 4);
    geom.rotateY(Math.PI / 4);
    geom.scale(1.18, 1, 0.77);
    return geom;
  }, []);

  const isFloor1Cut = viewMode === 'floor1';
  const isFloor2Cut = viewMode === 'floor2';
  const isOverview = viewMode === 'overview';

  // Chiều cao vách tường mặt trước & vách ngăn khi ở chế độ tổng thể (1.68m) vs Mặt cắt Tầng 2 (0.38m)
  const sectionWallHeight = isFloor2Cut ? 0.38 : 1.68;
  const sectionWallY = isFloor2Cut ? 0.26 : 0.88;

  return (
    <group position={[0, 0.18, -0.6]}>
      {/* ================= 1. NỀN TẦNG 1 & BỤC XI-MĂNG MẶT GỖ ================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpotById(3);
        }}
      >
        {/* Nền xi-măng tầng 1 có viền gạch gốm đỏ xung quanh */}
        <mesh position={[0, 0.1, 0]} receiveShadow castShadow>
          <boxGeometry args={[7.4, 0.2, 4.3]} />
          <meshStandardMaterial color="#8C3B2B" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.205, 0]} receiveShadow>
          <boxGeometry args={[7.16, 0.02, 4.06]} />
          <meshStandardMaterial color="#CFC9BC" roughness={0.75} />
        </mesh>

        {/* Bục xi-măng mặt gỗ bao quanh giữa các cột biên */}
        {[
          [-1.8, 0.33, 1.45, 1.6, 0.38],
          [1.8, 0.33, 1.45, 1.6, 0.38],
          [-2.7, 0.33, 0, 0.38, 2.6],
        ].map(([bx, by, bz, bw, bd], idx) => (
          <group key={idx} position={[bx, by, bz]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[bw, 0.24, bd]} />
              <meshStandardMaterial color="#B5AFA4" roughness={0.8} />
            </mesh>
            <mesh position={[0, 0.13, 0]} castShadow>
              <boxGeometry args={[bw + 0.04, 0.035, bd + 0.04]} />
              <meshStandardMaterial map={wood} color="#8C5832" roughness={0.42} />
            </mesh>
          </group>
        ))}

        {/* Bể cá vàng bằng kính khung trắng đặt ở cột góc phải */}
        <group position={[1.15, 0.5, 1.45]}>
          <mesh position={[0, -0.12, 0]} castShadow>
            <boxGeometry args={[0.38, 0.26, 0.28]} />
            <meshStandardMaterial map={wood} color="#6E4226" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.08, 0]}>
            <boxGeometry args={[0.36, 0.24, 0.26]} />
            <meshStandardMaterial
              color="#7DD3FC"
              transparent
              opacity={0.45}
              roughness={0.15}
            />
          </mesh>
        </group>
      </group>

      {/* ================= 2. HỆ 12 CỘT GỖ LIM ================= */}
      {columnX.map((cx, xi) =>
        columnZ.map((cz, zi) => {
          const colHeight = isFloor1Cut ? 1.85 : 2.36;
          const colCenterY = isFloor1Cut ? 1.22 : 1.48;
          return (
            <group key={`col-${xi}-${zi}`} position={[cx, 0, cz]}>
              <mesh position={[0, 0.26, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.24, 0.12, 0.24]} />
                <meshStandardMaterial color="#A8A29E" roughness={0.8} />
              </mesh>
              <mesh position={[0, colCenterY, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.2, colHeight, 0.2]} />
                <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.42} />
              </mesh>
              {/* Mặt cắt sáng màu trên đầu cột khi bật chế độ Mặt cắt Tầng 1 */}
              {isFloor1Cut && (
                <mesh position={[0, 2.15, 0]}>
                  <boxGeometry args={[0.21, 0.02, 0.21]} />
                  <meshStandardMaterial color="#E5DEC9" roughness={0.6} />
                </mesh>
              )}
            </group>
          );
        })
      )}

      {/* Hệ dầm gỗ trần tầng 1 (Ẩn khi đang xem Mặt cắt Tầng 1 để không che bàn họp) */}
      {!isFloor1Cut &&
        columnZ.map((cz, idx) => (
          <mesh key={`beam-x-${idx}`} position={[0, 2.52, cz]} castShadow>
            <boxGeometry args={[6.2, 0.16, 0.18]} />
            <meshStandardMaterial map={wood} color="#5C3419" roughness={0.5} />
          </mesh>
        ))}

      {/* ================= 3. TẦNG 1: PHÒNG HỌP BỘ CHÍNH TRỊ ================= */}
      <group
        position={[-0.25, 0.22, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpotById(3);
        }}
      >
        {/* Bàn họp Bộ Chính trị */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.5, 0.09, 1.08]} />
          <meshStandardMaterial map={wood} color="#5C3419" roughness={0.32} />
        </mesh>
        {[-0.75, 0.75].map((px, idx) => (
          <mesh key={idx} position={[px, 0.28, 0]} castShadow>
            <boxGeometry args={[0.45, 0.54, 0.55]} />
            <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.48} />
          </mesh>
        ))}

        {/* Khung kính bảo vệ hiện vật trên bàn họp */}
        <mesh position={[0.45, 0.66, 0]}>
          <boxGeometry args={[0.85, 0.08, 0.55]} />
          <meshStandardMaterial
            color="#E0F2FE"
            transparent
            opacity={0.32}
            roughness={0.1}
          />
        </mesh>

        {/* Điện thoại bàn, Máy đánh chữ & Bộ ấm trà */}
        <mesh position={[0.65, 0.65, 0.12]} castShadow>
          <boxGeometry args={[0.2, 0.09, 0.16]} />
          <meshStandardMaterial color="#1C1917" roughness={0.3} />
        </mesh>
        <mesh position={[-0.65, 0.65, -0.12]} castShadow>
          <boxGeometry args={[0.26, 0.09, 0.22]} />
          <meshStandardMaterial color="#334155" roughness={0.4} />
        </mesh>
        <mesh position={[0.0, 0.64, 0.0]} castShadow>
          <cylinderGeometry args={[0.05, 0.04, 0.08, 12]} />
          <meshStandardMaterial color="#F5F2EB" roughness={0.25} />
        </mesh>

        {/* 8 ghế gỗ tựa phẳng hai bên bàn họp */}
        {[-0.8, -0.25, 0.3, 0.85].map((gx, idx) => (
          <React.Fragment key={idx}>
            <group position={[gx, 0, 0.76]} rotation={[0, Math.PI, 0]}>
              <mesh position={[0, 0.34, 0]} castShadow>
                <boxGeometry args={[0.38, 0.04, 0.38]} />
                <meshStandardMaterial map={wood} color="#7C4A27" roughness={0.45} />
              </mesh>
              <mesh position={[0, 0.56, -0.17]} castShadow>
                <boxGeometry args={[0.38, 0.42, 0.04]} />
                <meshStandardMaterial map={wood} color="#8C5630" roughness={0.45} />
              </mesh>
            </group>
            <group position={[gx, 0, -0.76]}>
              <mesh position={[0, 0.34, 0]} castShadow>
                <boxGeometry args={[0.38, 0.04, 0.38]} />
                <meshStandardMaterial map={wood} color="#7C4A27" roughness={0.45} />
              </mesh>
              <mesh position={[0, 0.56, -0.17]} castShadow>
                <boxGeometry args={[0.38, 0.42, 0.04]} />
                <meshStandardMaterial map={wood} color="#8C5630" roughness={0.45} />
              </mesh>
            </group>
          </React.Fragment>
        ))}

        {/* Chiếc ghế mây đầu bàn của Bác */}
        <group position={[1.55, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
          <mesh position={[0, 0.36, 0]} castShadow>
            <cylinderGeometry args={[0.22, 0.2, 0.04, 14]} />
            <meshStandardMaterial color="#A3704C" roughness={0.6} />
          </mesh>
          <mesh position={[0, 0.62, -0.16]} castShadow>
            <cylinderGeometry args={[0.22, 0.22, 0.48, 12, 1, true, 2.2, 2.0]} />
            <meshStandardMaterial color="#4A2C18" roughness={0.5} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>

      {/* ================= 4. CẦU THANG GỖ & ĐÔI DÉP CAO SU ================= */}
      <group
        position={[2.95, 0.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpotById(4);
        }}
      >
        <mesh position={[-0.36, 1.24, 0.65]} rotation={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.16, 3.2]} />
          <meshStandardMaterial map={wood} color="#4A2C18" roughness={0.5} />
        </mesh>
        <mesh position={[0.36, 1.24, 0.65]} rotation={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.16, 3.2]} />
          <meshStandardMaterial map={wood} color="#4A2C18" roughness={0.5} />
        </mesh>
        {Array.from({ length: 8 }).map((_, idx) => (
          <mesh
            key={idx}
            position={[0, 0.28 + idx * 0.28, 1.65 - idx * 0.26]}
            castShadow
          >
            <boxGeometry args={[0.72, 0.045, 0.22]} />
            <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.48} />
          </mesh>
        ))}

        {/* Bệ trưng bày Đôi dép cao su & Mũ cối ở chân cầu thang */}
        <group position={[0.05, 0.02, 1.85]}>
          <mesh position={[0, 0.08, 0]} castShadow>
            <boxGeometry args={[0.85, 0.16, 0.56]} />
            <meshStandardMaterial map={wood} color="#5C3419" roughness={0.48} />
          </mesh>
          {/* Đôi dép cao su bốn quai */}
          {[-0.14, 0.06].map((sx, sIdx) => (
            <group key={sIdx} position={[sx, 0.18, 0.02]}>
              <mesh castShadow>
                <boxGeometry args={[0.11, 0.025, 0.27]} />
                <meshStandardMaterial color="#1C1917" roughness={0.85} />
              </mesh>
              <mesh position={[0, 0.02, -0.03]} rotation={[0, 0.3, 0]}>
                <boxGeometry args={[0.115, 0.012, 0.035]} />
                <meshStandardMaterial color="#292524" roughness={0.75} />
              </mesh>
              <mesh position={[0, 0.02, -0.03]} rotation={[0, -0.3, 0]}>
                <boxGeometry args={[0.115, 0.012, 0.035]} />
                <meshStandardMaterial color="#292524" roughness={0.75} />
              </mesh>
            </group>
          ))}
          {/* Chiếc mũ cối */}
          <mesh position={[0.24, 0.2, -0.04]} castShadow>
            <sphereGeometry args={[0.12, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color="#9E9682" roughness={0.75} />
          </mesh>
        </group>
      </group>

      {/* ================= 5. KHỐI KIẾN TRÚC TẦNG 2 (ẨN KHI XEM MẶT CẮT TẦNG 1) ================= */}
      {!isFloor1Cut && (
        <group position={[0, 2.6, 0]}>
          {/* Sàn gỗ tầng 2 */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[6.8, 0.14, 3.8]} />
            <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.42} />
          </mesh>

          {/* Lan can 5 thanh gỗ ngang bao quanh hành lang */}
          {[0.15, 0.26, 0.37, 0.48, 0.59].map((ry, idx) => (
            <React.Fragment key={idx}>
              <mesh position={[-0.45, ry, 1.82]} castShadow>
                <boxGeometry args={[5.4, 0.03, 0.03]} />
                <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.5} />
              </mesh>
              <mesh position={[-3.32, ry, 0]} castShadow>
                <boxGeometry args={[0.03, 0.03, 3.65]} />
                <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.5} />
              </mesh>
              <mesh position={[3.32, ry, 0]} castShadow>
                <boxGeometry args={[0.03, 0.03, 3.65]} />
                <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.5} />
              </mesh>
            </React.Fragment>
          ))}

          {/* Mành trúc xanh rêu đậm (Chỉ hiển thị ở chế độ Tổng thể để không che khuất khi xem Mặt cắt Tầng 2) */}
          {isOverview && (
            <group>
              <mesh position={[-3.32, 0.88, 0.2]}>
                <boxGeometry args={[0.03, 1.65, 3.1]} />
                <meshStandardMaterial color="#263E31" roughness={0.85} />
              </mesh>
              <mesh position={[3.32, 0.88, -0.2]}>
                <boxGeometry args={[0.03, 1.65, 2.4]} />
                <meshStandardMaterial color="#263E31" roughness={0.85} />
              </mesh>
              <mesh position={[0, 1.48, 1.83]}>
                <boxGeometry args={[5.4, 0.38, 0.03]} />
                <meshStandardMaterial color="#263E31" roughness={0.85} />
              </mesh>
            </group>
          )}

          {/* VÁCH TƯỜNG HẬU PHÍA SAU (Giữ nguyên chiều cao để tạo chiều sâu không gian và khung cửa sổ chớp gỗ) */}
          <mesh position={[0, 0.88, -1.35]} castShadow receiveShadow>
            <boxGeometry args={[5.5, 1.68, 0.1]} />
            <meshStandardMaterial map={wood} color="#5C3419" roughness={0.52} />
          </mesh>
          {/* Cửa sổ chớp gỗ trên vách hậu */}
          {[-1.4, 1.4].map((wx, idx) => (
            <mesh key={idx} position={[wx, 0.95, -1.29]}>
              <boxGeometry args={[1.15, 0.85, 0.03]} />
              <meshStandardMaterial color="#7C4A27" roughness={0.55} />
            </mesh>
          ))}

          {/* VÁCH HÔNG TRÁI, HÔNG PHẢI, VÁCH NGĂN GIỮA & VÁCH MẶT TRƯỚC
              Khi ở chế độ Mặt cắt Tầng 2 (isFloor2Cut): tự động hạ xuống thành tường cắt kiến trúc cao 0.38m có viền mặt cắt sáng màu */}
          {/* Vách hông trái */}
          <mesh position={[-2.72, sectionWallY, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.1, sectionWallHeight, 2.5]} />
            <meshStandardMaterial map={wood} color="#5C3419" roughness={0.52} />
          </mesh>
          {/* Vách hông phải */}
          <mesh position={[2.72, sectionWallY, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.1, sectionWallHeight, 2.5]} />
            <meshStandardMaterial map={wood} color="#5C3419" roughness={0.52} />
          </mesh>
          {/* Vách ngăn giữa Phòng làm việc và Phòng ngủ */}
          <mesh position={[0, sectionWallY, -0.1]} castShadow receiveShadow>
            <boxGeometry args={[0.09, sectionWallHeight, 2.45]} />
            <meshStandardMaterial map={wood} color="#4A2812" roughness={0.52} />
          </mesh>
          {/* Vách mặt trước tầng 2 */}
          <mesh position={[0, sectionWallY, 1.15]} castShadow receiveShadow>
            <boxGeometry args={[5.5, sectionWallHeight, 0.09]} />
            <meshStandardMaterial map={wood} color="#6E3F20" roughness={0.48} />
          </mesh>

          {/* Viền mặt cắt kiến trúc (Section Cut Cap) sáng màu khi đang ở chế độ Mặt cắt Tầng 2 */}
          {isFloor2Cut && (
            <group position={[0, 0.455, 0]}>
              <mesh position={[-2.72, 0, -0.1]}>
                <boxGeometry args={[0.12, 0.02, 2.52]} />
                <meshStandardMaterial color="#E5DEC9" roughness={0.5} />
              </mesh>
              <mesh position={[2.72, 0, -0.1]}>
                <boxGeometry args={[0.12, 0.02, 2.52]} />
                <meshStandardMaterial color="#E5DEC9" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0, -0.1]}>
                <boxGeometry args={[0.11, 0.02, 2.45]} />
                <meshStandardMaterial color="#E5DEC9" roughness={0.5} />
              </mesh>
              <mesh position={[0, 0, 1.15]}>
                <boxGeometry args={[5.54, 0.02, 0.11]} />
                <meshStandardMaterial color="#E5DEC9" roughness={0.5} />
              </mesh>
            </group>
          )}

          {/* ================= 6. NỘI THẤT TẦNG 2 – PHÒNG LÀM VIỆC (BÊN TRÁI) ================= */}
          <group
            position={[-1.38, 0.08, -0.15]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectSpotById(5);
            }}
          >
            {/* Bàn làm việc gỗ có ngăn kéo bên phải */}
            <mesh position={[0, 0.56, 0.1]} castShadow receiveShadow>
              <boxGeometry args={[1.32, 0.06, 0.74]} />
              <meshStandardMaterial map={wood} color="#4A2812" roughness={0.32} />
            </mesh>
            <mesh position={[0.4, 0.28, 0.1]} castShadow>
              <boxGeometry args={[0.44, 0.54, 0.68]} />
              <meshStandardMaterial map={wood} color="#4A2812" roughness={0.42} />
            </mesh>
            <mesh position={[-0.55, 0.28, 0.1]} castShadow>
              <boxGeometry args={[0.08, 0.54, 0.68]} />
              <meshStandardMaterial map={wood} color="#4A2812" roughness={0.42} />
            </mesh>

            {/* Ghế tựa mây làm việc của Bác */}
            <group position={[-0.08, 0, -0.38]}>
              <mesh position={[0, 0.34, 0]} castShadow>
                <cylinderGeometry args={[0.21, 0.19, 0.04, 14]} />
                <meshStandardMaterial color="#B59268" roughness={0.6} />
              </mesh>
              <mesh position={[0, 0.58, -0.16]} castShadow>
                <boxGeometry args={[0.38, 0.42, 0.04]} />
                <meshStandardMaterial color="#3D200E" roughness={0.5} />
              </mesh>
            </group>

            {/* Đèn bàn chụp vải xếp ly (tỏa ánh sáng vàng ấm áp) */}
            <group position={[0.42, 0.59, -0.05]}>
              <mesh position={[0, 0.14, 0]}>
                <cylinderGeometry args={[0.025, 0.045, 0.28, 12]} />
                <meshStandardMaterial color="#5C3419" roughness={0.3} />
              </mesh>
              <mesh position={[0, 0.3, 0]}>
                <coneGeometry args={[0.18, 0.17, 18, 1, true]} />
                <meshStandardMaterial
                  color="#FBF3DB"
                  emissive="#E59A38"
                  emissiveIntensity={isNight || isFloor2Cut ? 2.2 : 0.9}
                  side={THREE.DoubleSide}
                />
              </mesh>
              <pointLight
                position={[0, 0.24, 0]}
                color="#F5B041"
                intensity={isNight || isFloor2Cut ? 3.2 : 1.2}
                distance={5.5}
                decay={2}
              />
            </group>

            {/* Bản thảo Di chúc lịch sử & Bút chì đỏ - xanh trên mặt bàn */}
            <mesh position={[-0.1, 0.6, 0.12]}>
              <boxGeometry args={[0.36, 0.02, 0.26]} />
              <meshStandardMaterial color="#F7F3E3" roughness={0.6} />
            </mesh>
            <mesh
              position={[0.16, 0.605, 0.15]}
              rotation={[0, 0.4, Math.PI / 2]}
            >
              <cylinderGeometry args={[0.01, 0.01, 0.18, 8]} />
              <meshStandardMaterial color="#C83228" />
            </mesh>

            {/* Tủ sách đa ngôn ngữ sát vách trái */}
            <group position={[-1.08, 0.55, -0.35]}>
              <mesh castShadow receiveShadow>
                <boxGeometry args={[0.32, 1.05, 1.25]} />
                <meshStandardMaterial map={wood} color="#3D200E" roughness={0.48} />
              </mesh>
              {/* Các hàng sách bên trong kệ */}
              {[-0.25, 0.15].map((sy, rIdx) => (
                <group key={rIdx} position={[0.04, sy, 0]}>
                  {[-0.4, -0.2, 0, 0.2, 0.4].map((sz, bIdx) => (
                    <mesh key={bIdx} position={[0, 0, sz]}>
                      <boxGeometry args={[0.22, 0.24, 0.14]} />
                      <meshStandardMaterial
                        color={
                          ['#8C2D19', '#234E70', '#2D5A3C', '#9E6B28', '#5C3D2E'][
                            (rIdx + bIdx) % 5
                          ]
                        }
                        roughness={0.6}
                      />
                    </mesh>
                  ))}
                </group>
              ))}
            </group>
          </group>

          {/* ================= 7. NỘI THẤT TẦNG 2 – PHÒNG NGỦ (BÊN PHẢI) ================= */}
          <group
            position={[1.38, 0.08, -0.15]}
            onClick={(e) => {
              e.stopPropagation();
              onSelectSpotById(6);
            }}
          >
            {/* Chiếc giường gỗ đơn trải chiếu cói */}
            <group position={[0.35, 0, -0.05]}>
              <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
                <boxGeometry args={[1.18, 0.12, 1.84]} />
                <meshStandardMaterial map={wood} color="#4A2812" roughness={0.45} />
              </mesh>
              {/* Đầu giường gỗ */}
              <mesh position={[0, 0.54, -0.88]} castShadow>
                <boxGeometry args={[1.18, 0.48, 0.07]} />
                <meshStandardMaterial map={wood} color="#3D200E" roughness={0.48} />
              </mesh>
              {/* Chiếu cói mộc mạc */}
              <mesh position={[0, 0.35, 0]} receiveShadow>
                <boxGeometry args={[1.1, 0.025, 1.76]} />
                <meshStandardMaterial map={sedgeMat} roughness={0.75} />
              </mesh>
              {/* Gối vải trắng ngà & Chăn chiên gấp gọn */}
              <mesh position={[0, 0.41, -0.62]} castShadow>
                <boxGeometry args={[0.56, 0.09, 0.28]} />
                <meshStandardMaterial color="#F5F2EB" roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.4, 0.52]} castShadow>
                <boxGeometry args={[0.96, 0.08, 0.44]} />
                <meshStandardMaterial color="#3A4D39" roughness={0.85} />
              </mesh>
            </group>

            {/* Bàn gỗ cạnh cửa sổ đặt Đài Radio, Chiếc mũ cối, Quạt lá cọ & Lọ hoa */}
            <group position={[-0.64, 0, -0.52]}>
              <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
                <boxGeometry args={[0.72, 0.54, 0.48]} />
                <meshStandardMaterial map={wood} color="#4A2812" roughness={0.45} />
              </mesh>
              {/* Đài Radio bán dẫn */}
              <mesh position={[-0.06, 0.62, -0.04]} castShadow>
                <boxGeometry args={[0.24, 0.15, 0.11]} />
                <meshStandardMaterial color="#5C3419" roughness={0.38} />
              </mesh>
              {/* Chiếc mũ cối đặt cạnh Radio (đúng ảnh thực tế tang-2-phong-ngu.jpg) */}
              <mesh position={[-0.24, 0.58, 0.04]} castShadow>
                <sphereGeometry args={[0.095, 12, 10, 0, Math.PI * 2, 0, Math.PI / 2]} />
                <meshStandardMaterial color="#C8BC9E" roughness={0.75} />
              </mesh>
              {/* Chiếc quạt lá cọ */}
              <mesh position={[0.18, 0.565, 0.08]} rotation={[0, -0.4, 0]}>
                <cylinderGeometry args={[0.12, 0.12, 0.012, 14]} />
                <meshStandardMaterial color="#C8A870" roughness={0.8} />
              </mesh>
            </group>
          </group>

          {/* ================= 8. MÁI NGÓI VẨY CÁ ĐỎ NÂU (ẨN HOÀN TOÀN KHI XEM MẶT CẮT TẦNG 2) ================= */}
          {isOverview && (
            <group position={[0, 1.78, 0]}>
              <mesh position={[0, -0.08, 0]}>
                <boxGeometry args={[6.9, 0.06, 3.9]} />
                <meshStandardMaterial map={wood} color="#4A2812" />
              </mesh>
              <mesh geometry={hipRoofGeometry} position={[0, 0.72, 0]} castShadow receiveShadow>
                <meshStandardMaterial map={roofTile} color="#823A22" roughness={0.68} />
              </mesh>
              <mesh position={[0, 1.48, 0]} castShadow>
                <boxGeometry args={[4.05, 0.16, 0.24]} />
                <meshStandardMaterial color="#B5ADA0" roughness={0.78} />
              </mesh>
            </group>
          )}
        </group>
      )}
    </group>
  );
};

/**
 * 6. ĐIỂM ĐÁNH DẤU ĐỊA DANH TỐI GIẢN (MINIMALIST MUSEUM PIN)
 * - Bình thường chỉ hiển thị nút số tròn nhỏ (26px) để không che khuất kiến trúc Nhà sàn và Ao cá.
 * - Chỉ hiển thị nhãn tên khi người dùng rê chuột vào (Hover) hoặc khi điểm đó đang được chọn.
 */
const MinimalistSpotMarker: React.FC<{
  spot: TourSpot;
  isSelected: boolean;
  isVisited: boolean;
  onSelect: (spot: TourSpot) => void;
}> = ({ spot, isSelected, isVisited, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const showLabel = isSelected || isHovered;

  return (
    <group position={spot.position}>
      <Html center zIndexRange={[20, 0]}>
        <button
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onClick={(e) => {
            e.stopPropagation();
            onSelect(spot);
          }}
          className={`flex items-center gap-1.5 rounded-full transition-all duration-200 cursor-pointer select-none shadow-md ${
            showLabel ? 'px-2.5 py-1' : 'w-7 h-7 justify-center'
          } ${
            isSelected
              ? 'bg-[#8C6747] text-[#FAF8F5] border border-[#F5F2EB] scale-105'
              : isVisited
              ? 'bg-[#181A18]/90 text-[#D6CFC2] border border-[#78B890]/65 hover:border-[#C6A87C]'
              : 'bg-[#181A18]/90 text-[#F5F2EB] border border-[#C6A87C]/65 hover:bg-[#262926]'
          }`}
        >
          <span className="text-[11px] font-semibold leading-none">
            {spot.id}
          </span>

          {showLabel && (
            <span className="text-xs font-medium whitespace-nowrap pr-0.5">
              {spot.shortLabel}
            </span>
          )}

          {showLabel && isVisited && !isSelected && (
            <Check className="w-3 h-3 text-[#78B890] stroke-[2.5]" />
          )}
        </button>
      </Html>
    </group>
  );
};

/** Nội dung chính của Scene 3D */
const SceneContent: React.FC<
  Scene3DProps & {
    controlsRef: React.RefObject<CameraControls>;
    showMarkers: boolean;
  }
> = ({
  activeSpot,
  visitedIds,
  onSelectSpot,
  isNight,
  viewMode,
  resetTrigger,
  controlsRef,
  showMarkers,
}) => {
  // Tự động điều chỉnh góc nhìn Camera khi chọn địa điểm hoặc khi chuyển đổi chế độ xem Tổng thể / Tầng 1 / Tầng 2
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (activeSpot && activeSpot.recommendedViewMode === viewMode) {
      const [px, py, pz] = activeSpot.cameraPos;
      const [tx, ty, tz] = activeSpot.cameraTarget;
      controls.setLookAt(px, py, pz, tx, ty, tz, true);
    } else {
      const preset = VIEW_MODE_CAMERAS[viewMode];
      const [px, py, pz] = preset.position;
      const [tx, ty, tz] = preset.target;
      controls.setLookAt(px, py, pz, tx, ty, tz, true);
    }
  }, [activeSpot, viewMode, resetTrigger, controlsRef]);

  const handleSelectById = (id: number) => {
    const found = TOUR_SPOTS.find((s) => s.id === id);
    if (found) onSelectSpot(found);
  };

  return (
    <>
      <CameraControls
        ref={controlsRef}
        makeDefault
        minDistance={2.6}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2 - 0.05}
        minPolarAngle={0.14}
        smoothTime={0.48}
      />

      {/* Ánh sáng tự nhiên cân bằng, tôn vinh chất liệu gỗ và mặt nước */}
      <ambientLight
        intensity={isNight ? 0.58 : 1.12}
        color={isNight ? '#CBD5E1' : '#FAF6EE'}
      />
      <hemisphereLight
        args={[
          isNight ? '#334155' : '#E2E8F0',
          isNight ? '#1E293B' : '#3A4D39',
          isNight ? 0.55 : 0.8,
        ]}
      />
      <directionalLight
        position={isNight ? [-10, 15, 10] : [13, 18, 14]}
        intensity={isNight ? 0.9 : 1.65}
        color={isNight ? '#E2E8F0' : '#FFF8E7'}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-far={42}
        shadow-camera-left={-13}
        shadow-camera-right={13}
        shadow-camera-top={13}
        shadow-camera-bottom={-13}
        shadow-bias={-0.0002}
      />

      {/* 1. Nền địa hình khoét lòng Ao cá tự nhiên */}
      <RecessedSiteTerrain isNight={isNight} />

      {/* 2. Ao cá Bác Hồ (Lòng hồ đào âm, mặt nước tự nhiên, bờ đá cuội rêu phong, bậc cầu ao & đàn cá) */}
      <NaturalAoCaBacHo
        isNight={isNight}
        onSelect={() => handleSelectById(1)}
      />

      {/* 3. Quần thể Đường Xoài, Nhà 54, Nhà 67 & Vườn cây cổ thụ */}
      <KhuDiTichLandscape
        onSelectZone2={() => handleSelectById(2)}
        onSelectPond={() => handleSelectById(1)}
      />

      {/* 4. Nhà sàn Bác Hồ với cơ chế Mặt cắt Tầng 1 & Tầng 2 */}
      <NhaSanBacHo
        isNight={isNight}
        viewMode={viewMode}
        onSelectSpotById={handleSelectById}
      />

      {/* Bóng đổ tĩnh (chỉ render 1 lần khi tải, mượt 60 FPS) */}
      <ContactShadows
        position={[0, 0.185, 1.1]}
        opacity={0.4}
        scale={22}
        blur={2.0}
        far={7}
        frames={1}
      />

      {/* 5. Các điểm đánh dấu tối giản (chỉ hiện tên khi rê chuột hoặc đang chọn) */}
      {showMarkers &&
        TOUR_SPOTS.filter((spot) =>
          viewMode === 'floor1' ? spot.recommendedViewMode !== 'floor2' : true
        ).map((spot) => (
          <MinimalistSpotMarker
            key={spot.id}
            spot={spot}
            isSelected={activeSpot?.id === spot.id}
            isVisited={visitedIds.includes(spot.id)}
            onSelect={onSelectSpot}
          />
        ))}
    </>
  );
};

export const Scene3D: React.FC<Scene3DProps> = (props) => {
  const controlsRef = useRef<CameraControls>(null);
  const [showMarkers, setShowMarkers] = useState(true);

  const handleRotate = (angleDeg: number) => {
    controlsRef.current?.rotate((angleDeg * Math.PI) / 180, 0, true);
  };

  const handleZoom = (delta: number) => {
    controlsRef.current?.dolly(delta, true);
  };

  const handleResetCamera = () => {
    const preset = VIEW_MODE_CAMERAS[props.viewMode];
    controlsRef.current?.setLookAt(
      preset.position[0],
      preset.position[1],
      preset.position[2],
      preset.target[0],
      preset.target[1],
      preset.target[2],
      true
    );
  };

  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        dpr={[1, 1.5]}
        gl={{
          powerPreference: 'high-performance',
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: props.isNight ? 0.98 : 1.15,
        }}
        camera={{
          position: VIEW_MODE_CAMERAS.overview.position,
          fov: 38,
          near: 0.2,
          far: 90,
        }}
        className={`w-full h-full transition-colors duration-500 ${
          props.isNight
            ? 'bg-gradient-to-b from-[#11161B] via-[#171E24] to-[#12171A]'
            : 'bg-gradient-to-b from-[#232E29] via-[#2B3832] to-[#1C2420]'
        }`}
      >
        <SceneContent
          {...props}
          controlsRef={controlsRef}
          showMarkers={showMarkers}
        />
      </Canvas>

      {/* Cụm nút điều khiển Camera 3D gọn nhẹ ở góc trái dưới */}
      <div className="fixed left-4 bottom-16 sm:bottom-4 z-20 flex items-center gap-1 p-1.5 rounded-xl museum-panel">
        <button
          type="button"
          onClick={() => handleRotate(-45)}
          title="Xoay trái 45°"
          className="p-2 rounded-lg museum-button cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleRotate(45)}
          title="Xoay phải 45°"
          className="p-2 rounded-lg museum-button cursor-pointer"
        >
          <RotateCw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(2.2)}
          title="Phóng to"
          className="p-2 rounded-lg museum-button cursor-pointer"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => handleZoom(-2.2)}
          title="Thu nhỏ"
          className="p-2 rounded-lg museum-button cursor-pointer"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={handleResetCamera}
          title="Đặt lại góc nhìn chuẩn"
          className="p-2 rounded-lg museum-button cursor-pointer"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          onClick={() => setShowMarkers((prev) => !prev)}
          title={showMarkers ? 'Ẩn số đánh dấu trên mô hình' : 'Hiện số đánh dấu trên mô hình'}
          className={`p-2 rounded-lg cursor-pointer ${
            showMarkers ? 'museum-button-active' : 'museum-button'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default Scene3D;
