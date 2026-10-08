"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

/* Bruit simplex 3D (Ashima / Stefan Gustavson, domaine public). */
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}`;

export const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform vec2 uMouse;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
${NOISE}
void main(){
  vec3 p = position;
  float slow = snoise(p * 0.9 + vec3(uTime * 0.18));
  float fast = snoise(p * 2.2 + vec3(0.0, uTime * 0.7, 0.0));
  float bands = sin(p.y * 7.0 + uTime * 3.0) * 0.5 + 0.5;
  float disp = slow * 0.11 + fast * 0.035 * uAmp + bands * 0.025 * uAmp;
  disp += dot(normalize(p.xy + 0.0001), uMouse) * 0.05;
  p += normal * disp;
  vDisp = disp;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vView = normalize(-mv.xyz);
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * mv;
}`;

export const FRAGMENT = /* glsl */ `
uniform float uTime;
varying vec3 vNormal;
varying vec3 vView;
varying float vDisp;
void main(){
  float fres = pow(1.0 - max(dot(normalize(vNormal), normalize(vView)), 0.0), 2.2);
  // Palette Ligne : cœur vin, lisière bordeaux → rose poudré
  vec3 core = vec3(0.07, 0.035, 0.045);
  vec3 ember = vec3(0.62, 0.24, 0.32);
  vec3 soft = vec3(0.96, 0.78, 0.80);
  vec3 col = mix(core, ember, smoothstep(0.05, 0.9, fres));
  col = mix(col, soft, smoothstep(0.75, 1.0, fres));
  col += ember * smoothstep(0.05, 0.16, vDisp) * 0.3;
  float lines = smoothstep(0.96, 1.0, sin(vDisp * 90.0 + uTime) * 0.5 + 0.5);
  col += soft * lines * 0.18 * fres;
  gl_FragColor = vec4(col, 1.0);
}`;

function Orb({ speaking }: { speaking: boolean }) {
  const mesh = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.ShaderMaterial>(null);
  const initialUniforms = useMemo(
    () => ({ uTime: { value: 0 }, uAmp: { value: 0.4 }, uMouse: { value: new THREE.Vector2() } }),
    [],
  );

  useFrame((state, delta) => {
    const uniforms = material.current?.uniforms;
    if (!uniforms) return;
    const t = state.clock.elapsedTime;
    uniforms.uTime.value = t;
    // Amplitude « voix » : rythme syllabique pseudo-aléatoire
    const voice = speaking ? 0.55 + Math.abs(Math.sin(t * 5.3) * Math.sin(t * 2.1 + 1.3)) * 0.9 : 0.35;
    uniforms.uAmp.value += (voice - uniforms.uAmp.value) * Math.min(1, delta * 6);
    (uniforms.uMouse.value as THREE.Vector2).lerp(state.pointer, Math.min(1, delta * 2.5));
    if (mesh.current) {
      mesh.current.rotation.y += delta * 0.12;
      mesh.current.rotation.x = THREE.MathUtils.lerp(mesh.current.rotation.x, state.pointer.y * 0.35, delta * 2);
      mesh.current.rotation.z = THREE.MathUtils.lerp(mesh.current.rotation.z, -state.pointer.x * 0.25, delta * 2);
    }
  });

  return (
    <mesh ref={mesh}>
      <icosahedronGeometry args={[1.35, 96]} />
      <shaderMaterial ref={material} vertexShader={VERTEX} fragmentShader={FRAGMENT} uniforms={initialUniforms} />
    </mesh>
  );
}

/** PRNG déterministe (mulberry32) : même nuage de particules à chaque rendu. */
export function seeded(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Dust() {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const count = 900;
    const random = seeded(7);
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 1.9 + random() * 1.6;
      const theta = random() * Math.PI * 2;
      const y = (random() - 0.5) * 0.9;
      pos[i * 3] = Math.cos(theta) * r;
      pos[i * 3 + 1] = y * (r * 0.5);
      pos[i * 3 + 2] = Math.sin(theta) * r;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    return g;
  }, []);

  useFrame((state, delta) => {
    if (!points.current) return;
    points.current.rotation.y -= delta * 0.06;
    points.current.rotation.x = 0.35 + state.pointer.y * 0.1;
  });

  return (
    <points ref={points} geometry={geometry}>
      <pointsMaterial size={0.012} color="#e8b4bf" transparent opacity={0.7} sizeAttenuation depthWrite={false} />
    </points>
  );
}

export default function VoiceOrb({ speaking = true }: { speaking?: boolean }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      resize={{ offsetSize: true }}
      camera={{ position: [0, 0, 4.6], fov: 40 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      style={{ pointerEvents: "none" }}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <Orb speaking={speaking} />
      <Dust />
    </Canvas>
  );
}
