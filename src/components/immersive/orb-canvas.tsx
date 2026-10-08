"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { FRAGMENT, seeded, VERTEX } from "./voice-orb";

/** Pose cible de l'orbe, en fractions de l'écran (0–1) ; `energy` agite la surface. */
export type OrbPose = { x: number; y: number; s: number; energy: number };

/** Rayon apparent : à s = 1, l'orbe fait environ un tiers de la hauteur d'écran. */
const BASE_SCALE = 0.42;

function TravellingOrb({ pose }: { pose: MutableRefObject<OrbPose> }) {
  const group = useRef<THREE.Group>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const dust = useRef<THREE.Points>(null);
  const target = useMemo(() => new THREE.Vector3(), []);
  const initialUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 0.4 }, uMouse: { value: new THREE.Vector2() } }),
    [],
  );
  const dustGeometry = useMemo(() => {
    const random = seeded(11);
    const count = 700;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.8 + random() * 1.8;
      const theta = random() * Math.PI * 2;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = (random() - 0.5) * 0.9 * (r * 0.5);
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    const uniforms = material.current?.uniforms;
    if (!g || !uniforms) return;
    const { width, height } = state.viewport;
    const p = pose.current;

    // Inertie : l'orbe rejoint sa pose avec un amorti exponentiel (indépendant du framerate).
    const k = 1 - Math.exp(-delta * 4.2);
    target.set((p.x - 0.5) * width, -(p.y - 0.5) * height, 0);
    const before = g.position.clone();
    g.position.lerp(target, k);
    const speed = before.distanceTo(g.position) / Math.max(delta, 1e-3);
    const scale = THREE.MathUtils.lerp(g.scale.x, p.s * BASE_SCALE, k);
    g.scale.setScalar(scale);

    // La surface s'agite davantage quand l'orbe voyage (il « parle » en se déplaçant).
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    const voice = 0.5 + Math.abs(Math.sin(t * 5.3) * Math.sin(t * 2.1 + 1.3)) * 0.7;
    const wanted = voice * p.energy + Math.min(1.2, speed * 0.35);
    uniforms.uAmp.value += (wanted - uniforms.uAmp.value) * Math.min(1, delta * 5);
    (uniforms.uMouse.value as THREE.Vector2).lerp(state.pointer, Math.min(1, delta * 2.5));

    if (mesh.current) {
      mesh.current.rotation.y += delta * (0.15 + speed * 0.12);
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, state.pointer.y * 0.35, delta * 2);
    }
    if (dust.current) {
      dust.current.rotation.y -= delta * (0.06 + speed * 0.05);
      dust.current.rotation.x = 0.35 + state.pointer.y * 0.1;
    }
  });

  return (
    <group ref={group} scale={0.01}>
      <mesh ref={mesh}>
        <icosahedronGeometry args={[1.35, 96]} />
        <shaderMaterial ref={material} vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={initialUniforms} />
      </mesh>
      <points ref={dust} geometry={dustGeometry}>
        <pointsMaterial size={0.014} color="#e8b4bf" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
      </points>
    </group>
  );
}

/** Scène 3D plein écran : l'orbe reste net à toutes les tailles et voyage avec inertie. */
export default function OrbCanvas({ pose }: { pose: MutableRefObject<OrbPose> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      resize={{ offsetSize: true }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <TravellingOrb pose={pose} />
    </Canvas>
  );
}
