"use client";

import { useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

import { seeded } from "./voice-orb";

/**
 * Pose du flux d'appels :
 * - `mode` 0 = chaos (sans Ligne), 1 = tourbillon ordonné (avec Ligne)
 * - `x`, `y` : centre du tourbillon en fractions d'écran ; `s` : taille
 */
export type FlowPose = { x: number; y: number; s: number; mode: number };

const COUNT = 1600;

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uMode;
uniform float uScale;
uniform vec2 uCenter;
uniform vec2 uView;
uniform float uDpr;
attribute vec4 aSeed;
varying vec3 vColor;
varying float vAlpha;

void main() {
  // Chaos : appels dispersés dans tout l'écran, qui errent.
  vec3 chaos = vec3((aSeed.x - 0.5) * uView.x * 1.15, (aSeed.y - 0.5) * uView.y * 1.15, (aSeed.z - 0.5) * 1.5);
  chaos.x += sin(uTime * (0.25 + aSeed.w * 0.4) + aSeed.y * 23.0) * 0.45;
  chaos.y += cos(uTime * (0.22 + aSeed.z * 0.4) + aSeed.x * 19.0) * 0.38;

  // Ordre : galaxie à trois bras qui aspire les appels vers le cœur, puis les relance au bord.
  float R = 1.9;
  float r = mod(aSeed.x * R - uTime * (0.16 + aSeed.w * 0.18), R) + 0.04;
  float arm = floor(aSeed.z * 3.0) * 2.0944;
  float spread = (aSeed.y - 0.5) * (0.22 + r * 0.2);
  // Rotation commune : les bras gardent leur forme (sinon ils se brouillent avec le temps).
  float ang = arm + r * 3.1 - uTime * 0.4 + spread;
  vec3 vortex = vec3(cos(ang) * r, sin(ang) * r * 0.58, sin(ang) * r * 0.45) * uScale + vec3(uCenter, 0.0);

  // Chaque particule bascule à son rythme : la transformation se propage.
  float m = smoothstep(aSeed.w * 0.55, aSeed.w * 0.55 + 0.45, uMode);
  vec3 pos = mix(chaos, vortex, m);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mv;
  float heat = 1.0 - clamp(r / R, 0.0, 1.0);
  float size = mix(2.4 + aSeed.z * 3.6, 2.2 + heat * 4.5 + aSeed.z * 1.8, m);
  gl_PointSize = size * uDpr * (4.6 / -mv.z);

  // Couleurs : gris froid (quelques appels qui « meurent » en rouge) → bordeaux / rose.
  float dying = step(0.965, fract(aSeed.x * 37.0 + uTime * 0.12 * (0.5 + aSeed.w)));
  vec3 cold = mix(vec3(0.62, 0.68, 0.8), vec3(1.0, 0.34, 0.3), dying);
  vec3 warm = mix(vec3(0.72, 0.28, 0.38), vec3(1.0, 0.86, 0.88), heat);
  vColor = mix(cold, warm, m);
  vAlpha = mix(0.5 + dying * 0.5, 0.6 + heat * 0.4, m);
}`;

const FRAGMENT = /* glsl */ `
varying vec3 vColor;
varying float vAlpha;
void main() {
  float d = length(gl_PointCoord - 0.5);
  float a = smoothstep(0.5, 0.0, d);
  gl_FragColor = vec4(vColor, a * vAlpha);
}`;

function Flow({ pose }: { pose: MutableRefObject<FlowPose> }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const target = useMemo(() => new THREE.Vector2(), []);
  const geometry = useMemo(() => {
    const random = seeded(29);
    const seeds = new Float32Array(COUNT * 4);
    for (let i = 0; i < seeds.length; i++) seeds[i] = random();
    const g = new THREE.BufferGeometry();
    // Positions factices : tout est calculé dans le shader.
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array(COUNT * 3), 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seeds, 4));
    return g;
  }, []);
  const initialUniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMode: { value: 0 },
      uScale: { value: 1 },
      uCenter: { value: new THREE.Vector2() },
      uView: { value: new THREE.Vector2(6, 3.4) },
      uDpr: { value: 1 },
    }),
    [],
  );

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;
    const { width, height } = state.viewport;
    const p = pose.current;
    const k = 1 - Math.exp(-delta * 3.6); // inertie
    u.uTime.value = state.clock.elapsedTime;
    u.uDpr.value = state.viewport.dpr;
    (u.uView.value as THREE.Vector2).set(width, height);
    target.set((p.x - 0.5) * width, -(p.y - 0.5) * height);
    (u.uCenter.value as THREE.Vector2).lerp(target, k);
    u.uScale.value += (p.s - u.uScale.value) * k;
    u.uMode.value += (p.mode - u.uMode.value) * (1 - Math.exp(-delta * 2.2));
  });

  return (
    <points geometry={geometry} frustumCulled={false}>
      <shaderMaterial
        ref={material}
        vertexShader={VERTEX}
        fragmentShader={FRAGMENT}
        uniforms={initialUniforms}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

export default function FlowCanvas({ pose }: { pose: MutableRefObject<FlowPose> }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, 4.6], fov: 40 }}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      resize={{ offsetSize: true }}
    >
      <Flow pose={pose} />
    </Canvas>
  );
}
