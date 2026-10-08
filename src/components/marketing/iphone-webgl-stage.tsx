"use client";

import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import { useMotionValueEvent, type MotionValue } from "motion/react";
import * as THREE from "three";

import { IPhoneGltfModel } from "@/components/marketing/iphone-gltf-model";

/** Facteur Apple/JS Mastery — le GLB interne est en scale 0.01, il faut ×15–17. */
const MODEL_BASE = 16.5;

type Props = {
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  scale: MotionValue<number>;
  visible: MotionValue<"hidden" | "visible">;
  progress: MotionValue<number>;
  className?: string;
};

/**
 * Scène WebGL — iPhone 18 Pro GLB, éclairé, orbit scroll.
 */
export function IPhoneWebGLStage({
  rotateY,
  rotateX,
  scale,
  visible,
  progress,
  className = "",
}: Props) {
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 5.2], fov: 36, near: 0.1, far: 100 }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[5, 7, 6]} intensity={1.6} />
          <directionalLight position={[-5, 3, -3]} intensity={0.55} color="#ffc8d2" />
          <spotLight position={[0, 10, 3]} intensity={1.1} angle={0.45} penumbra={0.85} />
          <Environment preset="city" environmentIntensity={0.7} />

          <ScrollPhone
            rotateY={rotateY}
            rotateX={rotateX}
            scale={scale}
            visible={visible}
            progress={progress}
          />

          <ContactShadows
            position={[0, -2.6, 0]}
            opacity={0.5}
            scale={14}
            blur={2.8}
            far={6}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

function ScrollPhone({
  rotateY,
  rotateX,
  scale,
  visible,
  progress,
}: {
  rotateY: MotionValue<number>;
  rotateX: MotionValue<number>;
  scale: MotionValue<number>;
  visible: MotionValue<"hidden" | "visible">;
  progress: MotionValue<number>;
}) {
  const group = useRef<THREE.Group>(null);
  const target = useRef({
    y: rotateY.get(),
    x: rotateX.get(),
    s: scale.get() * MODEL_BASE,
    show: visible.get() !== "hidden",
  });
  const progressRef = useRef(progress.get());

  useMotionValueEvent(rotateY, "change", (v) => {
    target.current.y = v;
  });
  useMotionValueEvent(rotateX, "change", (v) => {
    target.current.x = v;
  });
  useMotionValueEvent(scale, "change", (v) => {
    target.current.s = v * MODEL_BASE;
  });
  useMotionValueEvent(visible, "change", (v) => {
    target.current.show = v !== "hidden";
  });
  useMotionValueEvent(progress, "change", (v) => {
    progressRef.current = v;
  });

  useFrame((state, dt) => {
    const g = group.current;
    if (!g) return;
    const t = target.current;
    const k = 1 - Math.exp(-12 * dt);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, THREE.MathUtils.degToRad(t.y), k);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, THREE.MathUtils.degToRad(t.x), k);
    const s = THREE.MathUtils.lerp(g.scale.x || t.s, t.s, k);
    g.scale.setScalar(s);
    g.visible = t.show;

    // Vibration « sonnerie » au début (appel entrant)
    const p = progressRef.current;
    const ringing = p < 0.11;
    if (ringing) {
      const time = state.clock.elapsedTime;
      const envelope = Math.max(0, Math.sin(time * 3.4)); // salves
      const amp = envelope * envelope;
      g.position.x = Math.sin(time * 62) * 0.055 * amp;
      g.position.y = -0.05 + Math.cos(time * 51) * 0.04 * amp;
      g.rotation.z = Math.sin(time * 48) * 0.045 * amp;
    } else {
      g.position.x = THREE.MathUtils.lerp(g.position.x, 0, k);
      g.position.y = THREE.MathUtils.lerp(g.position.y, -0.05, k);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, k);
    }
  });

  return (
    <group ref={group} position={[0, -0.05, 0]} scale={MODEL_BASE}>
      <IPhoneGltfModel rotation={[-0.02, Math.PI, 0]} progress={progress} />
    </group>
  );
}
