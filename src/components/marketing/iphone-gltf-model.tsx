"use client";

/**
 * iPhone 18 Pro — rendu WebGL (GLB Pro titane), teinte Deep Cherry LIGNE.
 * Asset de base: Sketchfab Polyman (CC-BY-4.0).
 * Source: https://sketchfab.com/3d-models/apple-iphone-15-pro-max-black-df17520841214c1792fb8a44c6783ee7
 * Écran = UI d’appel live.
 */

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import type { ThreeElements } from "@react-three/fiber";
import type { MotionValue } from "motion/react";

import { useIPhoneScreenTexture } from "@/components/marketing/iphone-screen-texture";

type GLTFResult = {
  nodes: Record<string, THREE.Mesh>;
  materials: Record<string, THREE.MeshStandardMaterial>;
};

/** Matériaux écran / verre / capteurs — ne pas recolorer */
const KEEP = new Set([
  "zFdeDaGNRwzccye",
  "ujsvqBWRMnqdwPx",
  "hUlRcbieVuIiOXG",
  "jlzuBkUzuJqgiAK",
  "xNrofRCqOXXHVZt",
  "pIJKfZsazmcpEiU", // dalle — gérée à part (texture UI)
]);

const BORDEAUX = "#5c2a36";

type Props = ThreeElements["group"] & {
  color?: string;
  progress: MotionValue<number>;
};

export function IPhoneGltfModel({ color = BORDEAUX, progress, ...props }: Props) {
  const { nodes, materials } = useGLTF("/models/iphone.glb") as unknown as GLTFResult;
  const screenTex = useIPhoneScreenTexture(progress);

  const bodyColor = useMemo(() => new THREE.Color(color), [color]);

  useEffect(() => {
    Object.entries(materials).forEach(([name, mat]) => {
      if (!KEEP.has(name) && mat?.color) {
        mat.color.copy(bodyColor);
        mat.metalness = Math.max(mat.metalness ?? 0.6, 0.75);
        mat.roughness = Math.min(mat.roughness ?? 0.35, 0.4);
        mat.needsUpdate = true;
      }
    });
  }, [materials, bodyColor]);

  // Verre avant — laisse passer la dalle UI
  useEffect(() => {
    const glass = materials.zFdeDaGNRwzccye;
    if (!glass) return;
    glass.transparent = true;
    glass.opacity = Math.min(glass.opacity ?? 1, 0.22);
    glass.depthWrite = false;
    glass.needsUpdate = true;
  }, [materials]);

  const screenMat = useMemo(() => {
    if (!screenTex) return new THREE.MeshBasicMaterial({ color: "#090909" });
    return new THREE.MeshBasicMaterial({
      map: screenTex,
      toneMapped: false,
    });
  }, [screenTex]);

  useEffect(() => () => screenMat.dispose(), [screenMat]);

  const s = 0.01;

  return (
    <group {...props} dispose={null}>
      <mesh castShadow receiveShadow geometry={nodes.ttmRoLdJipiIOmf.geometry} material={materials.hUlRcbieVuIiOXG} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.DjsDkGiopeiEJZK.geometry} material={materials.PaletteMaterial001} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.buRWvyqhBBgcJFo.geometry} material={materials.PaletteMaterial002} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.MrMmlCAsAxJpYqQ_0.geometry} material={materials.dxCVrUCvYhjVxqy} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.wqbHSzWaUxBCwxY_0.geometry} material={materials.MHFGNLrDQbTNima} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.QvGDcbDApaGssma.geometry} material={materials.kUhjpatHUvkBwfM} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.vFwJFNASGvEHWhs.geometry} material={materials.RJoymvEsaIItifI} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.evAxFwhaQUwXuua.geometry} material={materials.KSIxMqttXxxmOYl} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.USxQiqZgxHbRvqB.geometry} material={materials.mcPrzcBUcdqUybC} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.TvgBVmqNmSrFVfW.geometry} material={materials.pIhYLPqiSQOZTjn} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.GuYJryuYunhpphO.geometry} material={materials.eShKpuMNVJTRrgg} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.pvdHknDTGDzVpwc.geometry} material={materials.xdyiJLYTYRfJffH} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.CfghdUoyzvwzIum.geometry} material={materials.jpGaQNgTtEGkTfo} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.DjdhycfQYjKMDyn.geometry} material={materials.ujsvqBWRMnqdwPx} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.usFLmqcyrnltBUr.geometry} material={materials.sxNzrmuTqVeaXdg} scale={s} />
      {/* Dalle — texture UI LIGNE (non éclairée, toujours lisible) */}
      <mesh geometry={nodes.xXDHkMplTIDAXLN.geometry} material={screenMat} scale={s} />
      <mesh geometry={nodes.vELORlCJixqPHsZ.geometry} material={materials.zFdeDaGNRwzccye} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.EbQGKrWAqhBHiMv.geometry} material={materials.TBLSREBUyLMVtJa} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.EddVrWkqZTlvmci.geometry} material={materials.xNrofRCqOXXHVZt} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.KSWlaxBcnPDpFCs.geometry} material={materials.yQQySPTfbEJufve} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.TakBsdEjEytCAMK.geometry} material={materials.PaletteMaterial003} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.IykfmVvLplTsTEW.geometry} material={materials.PaletteMaterial004} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.wLfSXtbwRlBrwof.geometry} material={materials.oZRkkORNzkufnGD} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.WJwwVjsahIXbJpU.geometry} material={materials.yhcAXNGcJWCqtIS} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.YfrJNXgMvGOAfzz.geometry} material={materials.bCgzXjHOanGdTFV} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.DCLCbjzqejuvsqH.geometry} material={materials.vhaEJjZoqGtyLdo} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.CdalkzDVnwgdEhS.geometry} material={materials.jlzuBkUzuJqgiAK} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.NtjcIgolNGgYlCg.geometry} material={materials.PpwUTnTFZJXxCoE} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.pXBNoLiaMwsDHRF.geometry} material={materials.yiDkEwDSyEhavuP} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.IkoiNqATMVoZFKD.geometry} material={materials.hiVunnLeAHkwGEo} scale={s} />
      <mesh castShadow receiveShadow geometry={nodes.rqgRAGHOwnuBypi.geometry} material={materials.HGhEhpqSBZRnjHC} scale={s} />
    </group>
  );
}

useGLTF.preload("/models/iphone.glb");
