import React, { useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  CameraControls,
  Html,
  RoundedBox,
  Stars,
  Sparkles,
  ContactShadows,
  MeshReflectorMaterial,
  Environment,
} from '@react-three/drei';
import * as THREE from 'three';
import { Check } from 'lucide-react';
import { TOUR_SPOTS, OVERVIEW_CAMERA, TourSpot } from '../data/tourData';

interface Scene3DProps {
  activeSpot: TourSpot | null;
  visitedIds: number[];
  onSelectSpot: (spot: TourSpot) => void;
  isNight: boolean;
  showRoof: boolean;
  resetTrigger: number;
}

interface KoiFish {
  radiusX: number;
  radiusZ: number;
  speed: number;
  offset: number;
  y: number;
  color: string;
  finColor: string;
  scale: number;
}

/** Ao cá Bác Hồ với mặt nước phản chiếu thời gian thực (MeshReflectorMaterial) và đàn cá Koi bơi lội */
const MajesticPond: React.FC<{ isNight: boolean; onClick: () => void }> = ({
  isNight,
  onClick,
}) => {
  const fishRefs = useRef<(THREE.Group | null)[]>([]);

  const fishes = useMemo<KoiFish[]>(
    () => [
      { radiusX: 2.1, radiusZ: 1.05, speed: 0.45, offset: 0.0, y: 0.16, color: '#c2410c', finColor: '#fed7aa', scale: 1.05 },
      { radiusX: 1.6, radiusZ: 0.8, speed: -0.42, offset: 1.5, y: 0.15, color: '#b91c1c', finColor: '#fecaca', scale: 0.9 },
      { radiusX: 2.45, radiusZ: 1.25, speed: 0.38, offset: 2.8, y: 0.17, color: '#d97706', finColor: '#fef3c7', scale: 1.15 },
      { radiusX: 1.3, radiusZ: 0.65, speed: 0.52, offset: 3.9, y: 0.15, color: '#ea580c', finColor: '#ffedd5', scale: 0.8 },
      { radiusX: 1.9, radiusZ: 0.95, speed: -0.46, offset: 5.1, y: 0.16, color: '#991b1b', finColor: '#fca5a5', scale: 1.0 },
      { radiusX: 0.95, radiusZ: 0.5, speed: -0.65, offset: 2.2, y: 0.17, color: '#ca8a04', finColor: '#fef08a', scale: 0.75 },
    ],
    []
  );

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    fishes.forEach((fish, idx) => {
      const group = fishRefs.current[idx];
      if (!group) return;
      const angle = t * fish.speed + fish.offset;
      const nextAngle = angle + (fish.speed > 0 ? 0.06 : -0.06);

      const x = Math.cos(angle) * fish.radiusX;
      const z = Math.sin(angle) * fish.radiusZ;
      const nextX = Math.cos(nextAngle) * fish.radiusX;
      const nextZ = Math.sin(nextAngle) * fish.radiusZ;

      // Chuyển động bơi uốn lượn tự nhiên
      const wiggle = Math.sin(t * 4.5 + idx * 1.5) * 0.02;
      group.position.set(x, fish.y + Math.sin(t * 2 + idx) * 0.01, z);
      group.lookAt(nextX + wiggle, fish.y, nextZ);
    });
  });

  return (
    <group
      position={[0, 0, 5.8]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Viền đá rêu phong tự nhiên quanh bờ ao */}
      <mesh position={[0, 0.15, 0]} scale={[1.68, 1, 0.96]} receiveShadow castShadow>
        <cylinderGeometry args={[2.45, 2.65, 0.32, 48]} />
        <meshStandardMaterial color="#44403c" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Lớp nền bùn và rêu dưới đáy ao */}
      <mesh position={[0, 0.1, 0]} scale={[1.6, 1, 0.9]}>
        <cylinderGeometry args={[2.3, 2.1, 0.2, 36]} />
        <meshStandardMaterial color="#0b1b19" roughness={0.95} />
      </mesh>

      {/* MẶT NƯỚC PHẢN CHIẾU THẬT SỰ (REAL-TIME PLANAR REFLECTIONS) */}
      <mesh
        position={[0, 0.245, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[1.56, 0.88, 1]}
        receiveShadow
      >
        <circleGeometry args={[2.28, 48]} />
        <MeshReflectorMaterial
          blur={[300, 150]}
          resolution={1024}
          mirror={0.68}
          mixBlur={0.7}
          mixStrength={1.8}
          roughness={0.18}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color={isNight ? '#041716' : '#0c3532'}
          metalness={0.35}
        />
      </mesh>

      {/* Bậc cầu gạch nung Bác đứng vỗ tay gọi cá ăn */}
      <group position={[0, 0.24, -1.85]}>
        <mesh position={[0, 0.05, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.4, 0.16, 0.8]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.75} />
        </mesh>
        <mesh position={[0, 0.11, 0.4]} castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.14, 0.5]} />
          <meshStandardMaterial color="#9a3412" roughness={0.7} />
        </mesh>
      </group>

      {/* Cụm lá sen & hoa súng tao nhã */}
      {[
        [-1.85, 0.27, 0.3, 0.35],
        [-1.35, 0.27, 0.7, 0.28],
        [1.7, 0.27, -0.3, 0.32],
        [2.1, 0.27, 0.25, 0.26],
        [-0.45, 0.27, 0.95, 0.3],
      ].map(([lx, ly, lz, r], idx) => (
        <group key={idx} position={[lx, ly, lz]}>
          <mesh rotation={[0, idx * 1.3, 0]}>
            <cylinderGeometry args={[r, r, 0.015, 20]} />
            <meshStandardMaterial color="#14532d" roughness={0.5} />
          </mesh>
          {idx % 2 === 0 && (
            <mesh position={[0, 0.05, 0]}>
              <octahedronGeometry args={[0.075, 0]} />
              <meshStandardMaterial
                color="#fbcfe8"
                emissive="#db2777"
                emissiveIntensity={0.2}
                roughness={0.4}
              />
            </mesh>
          )}
        </group>
      ))}

      {/* Đàn cá chép bơi lội dưới làn nước */}
      {fishes.map((fish, idx) => (
        <group
          key={idx}
          ref={(el) => {
            fishRefs.current[idx] = el;
          }}
          scale={fish.scale}
        >
          {/* Thân cá mềm mại */}
          <mesh scale={[0.65, 0.5, 1.9]} castShadow>
            <octahedronGeometry args={[0.095, 1]} />
            <meshStandardMaterial
              color={fish.color}
              roughness={0.25}
              metalness={0.2}
            />
          </mesh>
          {/* Vây đuôi cá lượn sóng */}
          <mesh position={[0, 0.01, -0.19]} rotation={[Math.PI / 2, 0, 0]}>
            <coneGeometry args={[0.065, 0.12, 4]} />
            <meshStandardMaterial color={fish.finColor} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
};

/** Cây vú sữa miền Nam thân gỗ cổ kính rợp bóng mát */
const SouthernStarAppleTree: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  return (
    <group
      position={[-5.2, 0.2, 1.4]}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      {/* Bồn xây gạch thẻ bao quanh gốc */}
      <mesh position={[0, 0.16, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[1.25, 1.35, 0.32, 24]} />
        <meshStandardMaterial color="#7c2d12" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.28, 0]} receiveShadow>
        <cylinderGeometry args={[1.15, 1.15, 0.1, 24]} />
        <meshStandardMaterial color="#271c14" roughness={0.95} />
      </mesh>

      {/* Thân cây chính với rêu phong và đường vân gỗ phong trần */}
      <mesh position={[0, 1.7, 0]} rotation={[0.04, 0, -0.06]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.48, 3.2, 14]} />
        <meshStandardMaterial color="#422e20" roughness={0.85} />
      </mesh>
      {/* Các cành lớn tỏa bóng sum suê */}
      <mesh position={[-0.5, 2.9, 0.25]} rotation={[0.22, 0, 0.52]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 1.5, 10]} />
        <meshStandardMaterial color="#422e20" roughness={0.85} />
      </mesh>
      <mesh position={[0.5, 2.8, -0.2]} rotation={[-0.18, 0, -0.48]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 1.5, 10]} />
        <meshStandardMaterial color="#422e20" roughness={0.85} />
      </mesh>

      {/* Tán lá cây vú sữa lớn nhiều tầng lớp (mặt trên xanh thẫm, mặt dưới ánh vàng đồng) */}
      <mesh position={[0, 4.1, 0]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.85, 2]} />
        <meshStandardMaterial color="#14532d" roughness={0.7} />
      </mesh>
      <mesh position={[-1.2, 3.55, 0.45]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.35, 2]} />
        <meshStandardMaterial color="#0f3d21" roughness={0.72} />
      </mesh>
      <mesh position={[1.15, 3.6, -0.35]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.3, 2]} />
        <meshStandardMaterial color="#166534" roughness={0.72} />
      </mesh>
      <mesh position={[0.25, 3.4, 1.15]} castShadow receiveShadow>
        <dodecahedronGeometry args={[1.2, 2]} />
        <meshStandardMaterial color="#15803d" roughness={0.7} />
      </mesh>
      <mesh position={[-0.2, 4.85, -0.25]} castShadow>
        <dodecahedronGeometry args={[1.25, 2]} />
        <meshStandardMaterial color="#1e7040" roughness={0.68} />
      </mesh>

      {/* Quả vú sữa tím bóng điểm xuyết */}
      {[
        [0.7, 3.05, 0.7],
        [-0.8, 2.95, 0.6],
        [0.25, 2.85, 1.0],
        [-0.35, 3.2, -0.8],
      ].map(([fx, fy, fz], i) => (
        <mesh key={i} position={[fx, fy, fz]} castShadow>
          <sphereGeometry args={[0.11, 14, 14]} />
          <meshStandardMaterial color="#7e22ce" roughness={0.3} metalness={0.1} />
        </mesh>
      ))}
    </group>
  );
};

/** Hàng rào dâm bụt xanh thẫm điểm hoa đỏ mộc mạc quanh lối đi */
const HibiscusHedgerow: React.FC = () => {
  const bushes = useMemo(() => {
    const items: { pos: [number, number, number]; scale: number }[] = [];
    for (let z = -5.0; z <= 6.5; z += 1.3) {
      items.push({ pos: [-7.3, 0.55, z], scale: 0.95 + ((Math.abs(z) * 10) % 3) * 0.08 });
      items.push({ pos: [7.3, 0.55, z], scale: 0.95 + ((Math.abs(z) * 7) % 3) * 0.08 });
    }
    for (let x = -6.2; x <= 6.2; x += 1.35) {
      items.push({ pos: [x, 0.6, -6.0], scale: 0.98 + ((Math.abs(x) * 5) % 3) * 0.08 });
    }
    return items;
  }, []);

  return (
    <group>
      {bushes.map((bush, idx) => (
        <group key={idx} position={bush.pos} scale={bush.scale}>
          <mesh castShadow receiveShadow>
            <dodecahedronGeometry args={[0.65, 1]} />
            <meshStandardMaterial color="#0f3d21" roughness={0.8} />
          </mesh>
          <mesh position={[0.26, -0.08, 0.2]} castShadow>
            <dodecahedronGeometry args={[0.48, 1]} />
            <meshStandardMaterial color="#14532d" roughness={0.8} />
          </mesh>
          {/* Bông dâm bụt đỏ thắm */}
          <mesh position={[0.24, 0.36, 0.4]}>
            <octahedronGeometry args={[0.085, 0]} />
            <meshStandardMaterial
              color="#dc2626"
              emissive="#991b1b"
              emissiveIntensity={0.25}
              roughness={0.4}
            />
          </mesh>
          {idx % 2 === 0 && (
            <mesh position={[-0.26, 0.22, 0.44]}>
              <octahedronGeometry args={[0.075, 0]} />
              <meshStandardMaterial
                color="#ef4444"
                emissive="#b91c1c"
                emissiveIntensity={0.2}
                roughness={0.4}
              />
            </mesh>
          )}
        </group>
      ))}
    </group>
  );
};

/** Cây xanh cổ thụ che bóng mát khu di tích */
const AncientGardenTrees: React.FC = () => {
  return (
    <group>
      <group position={[5.4, 0.2, 0.8]}>
        <mesh position={[0, 1.5, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.35, 3.0, 12]} />
          <meshStandardMaterial color="#382618" roughness={0.85} />
        </mesh>
        <mesh position={[0, 3.4, 0]} castShadow>
          <dodecahedronGeometry args={[1.45, 2]} />
          <meshStandardMaterial color="#14532d" roughness={0.75} />
        </mesh>
      </group>
      <group position={[-4.8, 0.2, -4.0]}>
        <mesh position={[0, 1.7, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.38, 3.4, 12]} />
          <meshStandardMaterial color="#382618" roughness={0.85} />
        </mesh>
        <mesh position={[0, 3.8, 0]} castShadow>
          <dodecahedronGeometry args={[1.6, 2]} />
          <meshStandardMaterial color="#0f3d21" roughness={0.75} />
        </mesh>
      </group>
      <group position={[4.8, 0.2, -3.8]}>
        <mesh position={[0, 1.6, 0]} castShadow>
          <cylinderGeometry args={[0.22, 0.34, 3.2, 12]} />
          <meshStandardMaterial color="#382618" roughness={0.85} />
        </mesh>
        <mesh position={[0, 3.6, 0]} castShadow>
          <dodecahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial color="#166534" roughness={0.75} />
        </mesh>
      </group>
    </group>
  );
};

/** Mô hình Nhà sàn Bác Hồ với chất liệu gỗ lim truyền thống & tính năng X-Ray */
const StiltHouseModel: React.FC<{
  isNight: boolean;
  showRoof: boolean;
  onSelectSpotById: (id: number) => void;
}> = ({ isNight, showRoof, onSelectSpotById }) => {
  const roofGroupRef = useRef<THREE.Group>(null);
  const roofMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ridgeMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const frontWallMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const ceilingMatRef = useRef<THREE.MeshStandardMaterial>(null);

  // 12 cột gỗ lim nâng sàn tầng 2
  const columnX = [-2.7, -0.9, 0.9, 2.7];
  const columnZ = [-1.45, 0, 1.45];

  // Mái ngói 4 mái dốc vát cong nhẹ
  const hipRoofGeometry = useMemo(() => {
    const geom = new THREE.ConeGeometry(4.7, 1.7, 4);
    geom.rotateY(Math.PI / 4);
    geom.scale(1.18, 1, 0.77);
    return geom;
  }, []);

  useFrame((_, delta) => {
    const targetRoofY = showRoof ? 4.38 : 5.25;

    if (roofGroupRef.current) {
      roofGroupRef.current.position.y = THREE.MathUtils.lerp(
        roofGroupRef.current.position.y,
        targetRoofY,
        delta * 5
      );
    }

    const updateMat = (mat: THREE.MeshStandardMaterial | null, minOp = 0.12) => {
      if (!mat) return;
      const desired = showRoof ? 1.0 : minOp;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, desired, delta * 6);
      mat.transparent = mat.opacity < 0.98;
      mat.depthWrite = mat.opacity > 0.5;
    };

    updateMat(roofMatRef.current, 0.12);
    updateMat(ridgeMatRef.current, 0.16);
    updateMat(frontWallMatRef.current, 0.1);
    updateMat(ceilingMatRef.current, 0.08);
  });

  return (
    <group position={[0, 0.2, -0.4]}>
      {/* ================= 1. NỀN GẠCH THẺ TẦNG 1 ================= */}
      <group
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpotById(2);
        }}
      >
        <RoundedBox
          args={[7.5, 0.24, 4.5]}
          radius={0.06}
          smoothness={4}
          position={[0, 0.12, 0]}
          receiveShadow
          castShadow
        >
          <meshStandardMaterial color="#682916" roughness={0.7} />
        </RoundedBox>
        <mesh position={[0, 0.245, 0]} receiveShadow>
          <boxGeometry args={[7.1, 0.02, 4.1]} />
          <meshStandardMaterial color="#83331b" roughness={0.55} />
        </mesh>
      </group>

      {/* ================= 2. 12 CỘT GỖ LIM NÂU TRẦM ================= */}
      {columnX.map((cx, xi) =>
        columnZ.map((cz, zi) => (
          <group key={`col-${xi}-${zi}`} position={[cx, 0, cz]}>
            {/* Chân tảng đá xanh kê cột */}
            <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.18, 0.22, 0.15, 16]} />
              <meshStandardMaterial color="#44403c" roughness={0.8} />
            </mesh>
            {/* Thân cột gỗ lim nhẵn bóng */}
            <mesh position={[0, 1.48, 0]} castShadow receiveShadow>
              <cylinderGeometry args={[0.14, 0.15, 2.38, 16]} />
              <meshStandardMaterial color="#3b2214" roughness={0.45} metalness={0.15} />
            </mesh>
          </group>
        ))
      )}

      {/* Hệ xà gỗ ngang dọc nâng sàn tầng 2 */}
      {columnZ.map((cz, idx) => (
        <mesh key={`beam-x-${idx}`} position={[0, 2.52, cz]} castShadow>
          <boxGeometry args={[6.2, 0.15, 0.17]} />
          <meshStandardMaterial color="#2e1a0f" roughness={0.5} />
        </mesh>
      ))}
      {columnX.map((cx, idx) => (
        <mesh key={`beam-z-${idx}`} position={[cx, 2.52, 0]} castShadow>
          <boxGeometry args={[0.17, 0.15, 3.5]} />
          <meshStandardMaterial color="#2e1a0f" roughness={0.5} />
        </mesh>
      ))}

      {/* Đèn lồng tre treo góc hiên tầng 1 phát ánh sáng ấm cúng */}
      {[
        [-2.7, 2.3, 1.45],
        [2.7, 2.3, 1.45],
      ].map(([lx, ly, lz], lIdx) => (
        <group key={`lantern-${lIdx}`} position={[lx, ly, lz]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.1, 0.14, 0.25, 12]} />
            <meshStandardMaterial
              color="#fed7aa"
              emissive="#f59e0b"
              emissiveIntensity={isNight ? 2.5 : 0.8}
              transparent
              opacity={0.85}
            />
          </mesh>
          <pointLight
            position={[0, 0, 0]}
            color="#fbbf24"
            intensity={isNight ? 2.2 : 0.8}
            distance={5}
            decay={2}
          />
        </group>
      ))}

      {/* ================= 3. TẦNG 1: PHÒNG HỌP BỘ CHÍNH TRỊ ================= */}
      <group
        position={[-0.25, 0.25, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpotById(2);
        }}
      >
        {/* Bàn họp gỗ dài mặt gương bóng loáng */}
        <mesh position={[0, 0.58, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.55, 0.08, 1.08]} />
          <meshStandardMaterial color="#422515" roughness={0.25} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.628, 0]}>
          <boxGeometry args={[2.46, 0.015, 0.99]} />
          <meshStandardMaterial
            color="#e0f2fe"
            transparent
            opacity={0.35}
            roughness={0.08}
            metalness={0.85}
          />
        </mesh>
        {/* Chân bàn gỗ */}
        {[
          [-1.08, 0.29, -0.42],
          [1.08, 0.29, -0.42],
          [-1.08, 0.29, 0.42],
          [1.08, 0.29, 0.42],
        ].map(([lx, ly, lz], idx) => (
          <mesh key={idx} position={[lx, ly, lz]} castShadow>
            <boxGeometry args={[0.1, 0.56, 0.1]} />
            <meshStandardMaterial color="#2e180d" roughness={0.5} />
          </mesh>
        ))}

        {/* 8 Chiếc ghế mây cách điệu */}
        {[
          { pos: [-0.75, 0, 0.8] as [number, number, number], rot: Math.PI },
          { pos: [0, 0, 0.8] as [number, number, number], rot: Math.PI },
          { pos: [0.75, 0, 0.8] as [number, number, number], rot: Math.PI },
          { pos: [-0.75, 0, -0.8] as [number, number, number], rot: 0 },
          { pos: [0, 0, -0.8] as [number, number, number], rot: 0 },
          { pos: [0.75, 0, -0.8] as [number, number, number], rot: 0 },
          { pos: [-1.55, 0, 0] as [number, number, number], rot: Math.PI / 2 },
          { pos: [1.55, 0, 0] as [number, number, number], rot: -Math.PI / 2 },
        ].map((chair, idx) => (
          <group key={idx} position={chair.pos} rotation={[0, chair.rot, 0]}>
            <mesh position={[0, 0.36, 0]} castShadow>
              <cylinderGeometry args={[0.22, 0.2, 0.05, 16]} />
              <meshStandardMaterial color="#b45309" roughness={0.65} />
            </mesh>
            <mesh position={[0, 0.6, -0.16]} rotation={[0.15, 0, 0]} castShadow>
              <boxGeometry args={[0.4, 0.44, 0.05]} />
              <meshStandardMaterial color="#92400e" roughness={0.7} />
            </mesh>
            <mesh position={[0, 0.18, 0]} castShadow>
              <cylinderGeometry args={[0.17, 0.21, 0.36, 12, 1, true]} />
              <meshStandardMaterial color="#78350f" roughness={0.75} side={THREE.DoubleSide} />
            </mesh>
          </group>
        ))}

        {/* Chiếc điện thoại bàn Bakelite màu đen cổ điển */}
        <group position={[0.88, 0.64, 0.26]} rotation={[0, -0.35, 0]}>
          <mesh position={[0, 0.045, 0]} castShadow>
            <boxGeometry args={[0.22, 0.09, 0.18]} />
            <meshStandardMaterial color="#171717" roughness={0.2} metalness={0.5} />
          </mesh>
          <mesh position={[0, 0.096, 0.03]} rotation={[0.35, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.015, 16]} />
            <meshStandardMaterial color="#d4d4d8" roughness={0.2} metalness={0.8} />
          </mesh>
          <mesh position={[0, 0.128, -0.02]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.26, 12]} />
            <meshStandardMaterial color="#0a0a0a" roughness={0.2} />
          </mesh>
        </group>

        {/* Máy đánh chữ cổ */}
        <group position={[-0.8, 0.64, -0.2]} rotation={[0, 0.25, 0]}>
          <mesh position={[0, 0.05, 0]} castShadow>
            <boxGeometry args={[0.29, 0.1, 0.25]} />
            <meshStandardMaterial color="#334155" roughness={0.35} metalness={0.6} />
          </mesh>
          <mesh position={[0, 0.11, -0.07]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.028, 0.028, 0.32, 12]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        </group>

        {/* Bộ ấm chén trà men ngọc Bát Tràng */}
        <group position={[0.05, 0.64, -0.05]}>
          <mesh position={[0, 0.01, 0]}>
            <boxGeometry args={[0.36, 0.015, 0.24]} />
            <meshStandardMaterial color="#5c2d12" />
          </mesh>
          <mesh position={[-0.08, 0.06, 0]} castShadow>
            <sphereGeometry args={[0.055, 16, 16]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.1} />
          </mesh>
          {[0.05, 0.12].map((cx, i) => (
            <mesh key={i} position={[cx, 0.04, 0.03]} castShadow>
              <cylinderGeometry args={[0.022, 0.018, 0.04, 12]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.15} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ================= 4. CẦU THANG GỖ & ĐÔI DÉP CAO SU ================= */}
      <group
        position={[2.95, 0.24, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelectSpotById(3);
        }}
      >
        <mesh position={[-0.38, 1.25, 0.72]} rotation={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.16, 3.25]} />
          <meshStandardMaterial color="#3b2214" roughness={0.5} />
        </mesh>
        <mesh position={[0.38, 1.25, 0.72]} rotation={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.08, 0.16, 3.25]} />
          <meshStandardMaterial color="#3b2214" roughness={0.5} />
        </mesh>

        {Array.from({ length: 9 }).map((_, idx) => {
          const stepY = 0.25 + idx * 0.25;
          const stepZ = 1.75 - idx * 0.24;
          return (
            <mesh key={idx} position={[0, stepY, stepZ]} castShadow receiveShadow>
              <boxGeometry args={[0.76, 0.045, 0.22]} />
              <meshStandardMaterial color="#54301d" roughness={0.45} />
            </mesh>
          );
        })}

        {/* Tay vịn gỗ nhẵn bóng */}
        <mesh position={[-0.38, 1.85, 0.72]} rotation={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.06, 3.25]} />
          <meshStandardMaterial color="#442617" roughness={0.35} />
        </mesh>
        <mesh position={[0.38, 1.85, 0.72]} rotation={[-0.82, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.06, 3.25]} />
          <meshStandardMaterial color="#442617" roughness={0.35} />
        </mesh>

        {/* Bệ trưng bày Đôi dép cao su & Mũ cối */}
        <group position={[0.05, 0.02, 1.95]}>
          <RoundedBox args={[0.95, 0.18, 0.65]} radius={0.03} position={[0, 0.09, 0]} castShadow>
            <meshStandardMaterial color="#4a2612" roughness={0.4} metalness={0.1} />
          </RoundedBox>
          <mesh position={[0, 0.185, 0]}>
            <boxGeometry args={[0.82, 0.015, 0.52]} />
            <meshStandardMaterial color="#881337" roughness={0.7} />
          </mesh>

          {/* ĐÔI DÉP CAO SU BỐN QUAI */}
          {[-0.14, 0.08].map((sx, sIdx) => (
            <group
              key={sIdx}
              position={[sx, 0.21, 0.04]}
              rotation={[0, sIdx === 0 ? 0.1 : -0.06, 0]}
            >
              <RoundedBox args={[0.13, 0.028, 0.3]} radius={0.012} castShadow>
                <meshStandardMaterial color="#18181b" roughness={0.8} />
              </RoundedBox>
              <mesh position={[0, 0.03, -0.04]} rotation={[0, 0.35, 0]}>
                <boxGeometry args={[0.135, 0.016, 0.038]} />
                <meshStandardMaterial color="#27272a" roughness={0.7} />
              </mesh>
              <mesh position={[0, 0.03, -0.04]} rotation={[0, -0.35, 0]}>
                <boxGeometry args={[0.135, 0.016, 0.038]} />
                <meshStandardMaterial color="#27272a" roughness={0.7} />
              </mesh>
            </group>
          ))}

          {/* CHIẾC MŨ CỐI */}
          <group position={[0.26, 0.22, -0.05]} rotation={[0.08, -0.3, 0]}>
            <mesh position={[0, 0.02, 0]} scale={[1, 1, 1.15]} castShadow>
              <cylinderGeometry args={[0.17, 0.19, 0.025, 20]} />
              <meshStandardMaterial color="#78716c" roughness={0.75} />
            </mesh>
            <mesh position={[0, 0.04, 0]} scale={[1, 0.65, 1.1]} castShadow>
              <sphereGeometry args={[0.13, 20, 14, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color="#847c72" roughness={0.7} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ================= 5. TẦNG 2: SÀN GỖ, HÀNH LANG & NỘI THẤT ================= */}
      <group position={[0, 2.6, 0]}>
        <RoundedBox
          args={[6.85, 0.14, 3.85]}
          radius={0.03}
          position={[0, 0, 0]}
          castShadow
          receiveShadow
        >
          <meshStandardMaterial color="#54301d" roughness={0.4} metalness={0.1} />
        </RoundedBox>

        {/* Lan can con tiện gỗ truyền thống */}
        <mesh position={[-0.55, 0.5, 1.84]} castShadow>
          <boxGeometry args={[5.5, 0.06, 0.06]} />
          <meshStandardMaterial color="#3b2214" roughness={0.5} />
        </mesh>
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={`rail-f-${i}`} position={[-3.2 + i * 0.4, 0.26, 1.84]} castShadow>
            <cylinderGeometry args={[0.022, 0.022, 0.46, 8]} />
            <meshStandardMaterial color="#4a2817" roughness={0.5} />
          </mesh>
        ))}

        <mesh position={[-3.34, 0.5, 0]} castShadow>
          <boxGeometry args={[0.06, 0.06, 3.7]} />
          <meshStandardMaterial color="#3b2214" roughness={0.5} />
        </mesh>
        <mesh position={[3.34, 0.5, 0]} castShadow>
          <boxGeometry args={[0.06, 0.06, 3.7]} />
          <meshStandardMaterial color="#3b2214" roughness={0.5} />
        </mesh>

        {/* Vách gỗ ngăn phòng */}
        <mesh position={[0, 0.88, -1.38]} castShadow receiveShadow>
          <boxGeometry args={[5.6, 1.7, 0.1]} />
          <meshStandardMaterial color="#4a2817" roughness={0.6} />
        </mesh>
        <mesh position={[-2.78, 0.88, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.7, 2.6]} />
          <meshStandardMaterial color="#4a2817" roughness={0.6} />
        </mesh>
        <mesh position={[2.78, 0.88, -0.1]} castShadow receiveShadow>
          <boxGeometry args={[0.1, 1.7, 2.6]} />
          <meshStandardMaterial color="#4a2817" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.88, -0.25]} castShadow receiveShadow>
          <boxGeometry args={[0.09, 1.7, 2.25]} />
          <meshStandardMaterial color="#3b2214" roughness={0.6} />
        </mesh>

        {/* Vách trước tầng 2 (Tự làm mờ X-Ray khi mở nội thất) */}
        <mesh position={[0, 0.88, 1.18]}>
          <boxGeometry args={[5.6, 1.7, 0.08]} />
          <meshStandardMaterial
            ref={frontWallMatRef}
            color="#54301d"
            roughness={0.55}
            transparent
            opacity={1}
          />
        </mesh>

        {/* ================= 6. PHÒNG LÀM VIỆC TẦNG 2 ================= */}
        <group
          position={[-1.4, 0.08, -0.15]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSpotById(4);
          }}
        >
          <mesh position={[0, 0.54, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.28, 0.06, 0.74]} />
            <meshStandardMaterial color="#422515" roughness={0.3} metalness={0.15} />
          </mesh>

          {/* CHIẾC ĐÈN BÀN phát ánh sáng vàng ấm */}
          <group position={[-0.4, 0.57, -0.12]}>
            <mesh position={[0, 0.02, 0]}>
              <cylinderGeometry args={[0.09, 0.11, 0.04, 16]} />
              <meshStandardMaterial color="#78350f" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.16, 0]}>
              <cylinderGeometry args={[0.02, 0.025, 0.28, 12]} />
              <meshStandardMaterial color="#d97706" metalness={0.8} roughness={0.2} />
            </mesh>
            <mesh position={[0, 0.3, 0]}>
              <coneGeometry args={[0.16, 0.14, 20, 1, true]} />
              <meshStandardMaterial
                color="#fef08a"
                emissive="#f59e0b"
                emissiveIntensity={isNight ? 3.0 : 1.2}
                side={THREE.DoubleSide}
              />
            </mesh>
            <pointLight
              position={[0, 0.25, 0.05]}
              color="#ffb703"
              intensity={isNight ? 5.0 : 1.8}
              distance={6}
              decay={2}
            />
          </group>

          {/* Bản thảo Di chúc và bút chì đỏ-xanh */}
          <group position={[0.05, 0.58, 0.05]} rotation={[0, 0.1, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.34, 0.025, 0.26]} />
              <meshStandardMaterial color="#fef08a" roughness={0.6} />
            </mesh>
          </group>
          <group position={[0.32, 0.585, 0.08]} rotation={[0, 0.45, 0]}>
            <mesh position={[0, 0, -0.055]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.11, 10]} />
              <meshStandardMaterial color="#dc2626" />
            </mesh>
            <mesh position={[0, 0, 0.055]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.11, 10]} />
              <meshStandardMaterial color="#2563eb" />
            </mesh>
          </group>

          {/* Kệ sách gỗ sát tường */}
          <group position={[-1.14, 0.7, -0.25]}>
            <mesh castShadow receiveShadow>
              <boxGeometry args={[0.32, 1.38, 1.38]} />
              <meshStandardMaterial color="#381d0f" roughness={0.5} />
            </mesh>
          </group>
        </group>

        {/* ================= 7. PHÒNG NGỦ TẦNG 2 ================= */}
        <group
          position={[1.35, 0.08, -0.15]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectSpotById(5);
          }}
        >
          {/* Chiếc giường đơn giản dị */}
          <group position={[0.32, 0, -0.1]}>
            <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
              <boxGeometry args={[1.18, 0.12, 1.88]} />
              <meshStandardMaterial color="#422515" roughness={0.5} />
            </mesh>
            <mesh position={[0, 0.35, 0]} receiveShadow>
              <boxGeometry args={[1.1, 0.025, 1.8]} />
              <meshStandardMaterial color="#d4b476" roughness={0.75} />
            </mesh>
          </group>

          {/* Bàn nhỏ đầu giường: Đài Radio & Quạt lá cọ */}
          <group position={[-0.65, 0, -0.58]}>
            <mesh position={[0, 0.28, 0]} castShadow receiveShadow>
              <boxGeometry args={[0.56, 0.54, 0.48]} />
              <meshStandardMaterial color="#422515" roughness={0.5} />
            </mesh>
            {/* Đài Radio Zenit */}
            <group position={[-0.1, 0.65, -0.04]} rotation={[0, 0.2, 0]}>
              <RoundedBox args={[0.24, 0.16, 0.11]} radius={0.015} castShadow>
                <meshStandardMaterial color="#5c2d12" roughness={0.3} />
              </RoundedBox>
              <mesh position={[0, 0.01, 0.058]}>
                <boxGeometry args={[0.19, 0.09, 0.01]} />
                <meshStandardMaterial color="#fcd34d" metalness={0.7} roughness={0.2} />
              </mesh>
            </group>
          </group>
        </group>
      </group>

      {/* ================= 8. MÁI NGÓI TRUYỀN THỐNG (X-RAY DISSOLVE) ================= */}
      <group ref={roofGroupRef} position={[0, 4.38, 0]}>
        <mesh position={[0, -0.08, 0]}>
          <boxGeometry args={[6.95, 0.06, 3.95]} />
          <meshStandardMaterial
            ref={ceilingMatRef}
            color="#3b2214"
            transparent
            opacity={1}
          />
        </mesh>
        <mesh geometry={hipRoofGeometry} position={[0, 0.74, 0]} castShadow receiveShadow>
          <meshStandardMaterial
            ref={roofMatRef}
            color="#7c2d12"
            roughness={0.65}
            transparent
            opacity={1}
          />
        </mesh>
        <RoundedBox args={[3.95, 0.18, 0.25]} radius={0.04} position={[0, 1.5, 0]} castShadow>
          <meshStandardMaterial
            ref={ridgeMatRef}
            color="#5a1d0b"
            roughness={0.55}
            transparent
            opacity={1}
          />
        </RoundedBox>
      </group>
    </group>
  );
};

/** Nội dung chính của Scene 3D Diorama */
const SceneContent: React.FC<Scene3DProps> = ({
  activeSpot,
  visitedIds,
  onSelectSpot,
  isNight,
  showRoof,
  resetTrigger,
}) => {
  const cameraControlsRef = useRef<CameraControls>(null);

  useEffect(() => {
    const controls = cameraControlsRef.current;
    if (!controls) return;

    if (activeSpot) {
      const [px, py, pz] = activeSpot.cameraPos;
      const [tx, ty, tz] = activeSpot.cameraTarget;
      controls.setLookAt(px, py, pz, tx, ty, tz, true);
    } else {
      const [px, py, pz] = OVERVIEW_CAMERA.position;
      const [tx, ty, tz] = OVERVIEW_CAMERA.target;
      controls.setLookAt(px, py, pz, tx, ty, tz, true);
    }
  }, [activeSpot, resetTrigger]);

  const handleSelectById = (id: number) => {
    const found = TOUR_SPOTS.find((s) => s.id === id);
    if (found) onSelectSpot(found);
  };

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        makeDefault
        minDistance={2.8}
        maxDistance={28}
        maxPolarAngle={Math.PI / 2 - 0.04}
        minPolarAngle={0.12}
        smoothTime={0.7}
      />

      {/* Ánh sáng & Môi trường HDRI tự nhiên */}
      <Environment preset={isNight ? 'night' : 'park'} />
      <ambientLight intensity={isNight ? 0.35 : 0.85} color={isNight ? '#93c5fd' : '#fef3c7'} />
      <directionalLight
        position={isNight ? [-12, 16, -10] : [15, 20, 14]}
        intensity={isNight ? 0.7 : 1.9}
        color={isNight ? '#c7d2fe' : '#fffbeb'}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.0001}
      />

      {/* Sương mù khí quyển điện ảnh (Cinematic Fog) */}
      <fog attach="fog" args={[isNight ? '#05070e' : '#142022', 12, 38]} />

      {/* Đom đóm / Bụi vàng phát sáng lơ lửng trong không gian */}
      <Sparkles
        count={isNight ? 95 : 55}
        scale={[18, 9, 18]}
        position={[0, 3.5, 0]}
        size={isNight ? 3.0 : 2.2}
        speed={0.25}
        color={isNight ? '#fbbf24' : '#fde047'}
        opacity={isNight ? 0.85 : 0.45}
      />

      {isNight && (
        <Stars radius={70} depth={40} count={3500} factor={4} saturation={0} fade speed={1} />
      )}

      {/* ================= BỆ ĐÁ SA BÀN ================= */}
      <group>
        <RoundedBox
          args={[17.4, 0.55, 16.6]}
          radius={0.22}
          smoothness={4}
          position={[0, -0.35, 0.4]}
          receiveShadow
        >
          <meshStandardMaterial color="#1c1917" roughness={0.8} />
        </RoundedBox>
        <RoundedBox args={[17.55, 0.08, 16.75]} radius={0.22} position={[0, -0.08, 0.4]}>
          <meshStandardMaterial color="#b45309" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Thảm cỏ xanh rêu */}
        <RoundedBox
          args={[16.8, 0.36, 16.0]}
          radius={0.18}
          smoothness={4}
          position={[0, 0.02, 0.4]}
          receiveShadow
        >
          <meshStandardMaterial color={isNight ? '#062c19' : '#0e4a28'} roughness={0.9} />
        </RoundedBox>
        {/* Lối đi lát gạch đỏ */}
        <mesh position={[0, 0.21, 2.8]} receiveShadow>
          <boxGeometry args={[1.55, 0.03, 2.6]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.75} />
        </mesh>
      </group>

      {/* Kiến trúc & Cảnh quan */}
      <MajesticPond isNight={isNight} onClick={() => handleSelectById(1)} />
      <SouthernStarAppleTree onClick={() => handleSelectById(1)} />
      <HibiscusHedgerow />
      <AncientGardenTrees />
      <StiltHouseModel
        isNight={isNight}
        showRoof={showRoof}
        onSelectSpotById={handleSelectById}
      />

      <ContactShadows
        position={[0, 0.21, 0.4]}
        opacity={isNight ? 0.4 : 0.65}
        scale={22}
        blur={2.4}
        far={8}
      />

      {/* ================= 5 ĐIỂM HOTSPOT 3D - LIQUID GLASS CAO CẤP (KHÔNG NHẤP NHÁY) ================= */}
      {TOUR_SPOTS.map((spot) => {
        const isSelected = activeSpot?.id === spot.id;
        const isVisited = visitedIds.includes(spot.id);

        return (
          <group key={spot.id} position={spot.position}>
            {/* Nhãn Liquid Glass cao cấp, điềm tĩnh, không chớp nháy */}
            <Html center distanceFactor={14} zIndexRange={[20, 0]}>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectSpot(spot);
                }}
                className={`group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full transition-all duration-300 backdrop-blur-xl border cursor-pointer select-none whitespace-nowrap ${
                  isSelected
                    ? 'liquid-glass-active scale-110 shadow-[0_0_30px_rgba(245,197,122,0.35)]'
                    : isVisited
                    ? 'liquid-glass hover:scale-105 border-emerald-500/40 text-emerald-200'
                    : 'liquid-glass-pill hover:scale-105 text-stone-200'
                }`}
              >
                {/* Vòng số vàng đồng chạm khắc tinh xảo */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-serif font-bold transition-all ${
                    isSelected
                      ? 'bg-amber-400 text-slate-950 shadow-md'
                      : isVisited
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-400/40'
                      : 'bg-white/10 text-amber-200 border border-white/20'
                  }`}
                >
                  {spot.id}
                </span>

                <span className="text-xs font-medium tracking-wide">
                  {spot.shortLabel}
                </span>

                {isVisited && (
                  <span className="flex items-center justify-center w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400">
                    <Check className="w-2.5 h-2.5 stroke-[3]" />
                  </span>
                )}
              </button>
            </Html>
          </group>
        );
      })}
    </>
  );
};

export const Scene3D: React.FC<Scene3DProps> = (props) => {
  return (
    <div className="relative w-full h-full">
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: props.isNight ? 1.05 : 1.35,
          antialias: true,
        }}
        camera={{
          position: OVERVIEW_CAMERA.position,
          fov: 40,
          near: 0.1,
          far: 120,
        }}
        className={`w-full h-full transition-colors duration-1000 ${
          props.isNight
            ? 'bg-gradient-to-b from-[#04060d] via-[#080d1a] to-[#05070e]'
            : 'bg-gradient-to-b from-[#0c181c] via-[#102428] to-[#091517]'
        }`}
      >
        <SceneContent {...props} />
      </Canvas>

      {/* Lớp phủ Cinematic Vignette đậm chất điện ảnh */}
      <div className="cinematic-vignette absolute inset-0 pointer-events-none" />

      {/* Chú thích thao tác tối giản */}
      <div className="pointer-events-none absolute left-6 bottom-24 hidden lg:flex items-center gap-3 px-4 py-2 rounded-2xl liquid-glass text-xs text-stone-300">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400/80" />
        <span>
          <strong className="text-amber-200">Kéo chuột:</strong> Xoay không gian 360° •{' '}
          <strong className="text-amber-200">Cuộn chuột:</strong> Thu phóng •{' '}
          <strong className="text-amber-200">Điểm 1-5:</strong> Khám phá di sản
        </span>
      </div>
    </div>
  );
};

export default Scene3D;
