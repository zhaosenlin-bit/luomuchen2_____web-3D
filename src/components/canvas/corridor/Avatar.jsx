import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

const FRAME_PATHS = [
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/1.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/2.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/3.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/4.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/5.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/6.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/7.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/8.webp',
    '/luomuchen2_____web-3D/textures/corridor/avatar_anim/9.webp',
];

const FRAME_COUNT = FRAME_PATHS.length;
const ANIMATION_FPS = 8;
const FRAME_W = 0.7;
const FRAME_H = 1.75;

const Avatar = ({ position = [0, -0.61, -0.3] }) => {
    const meshRef = useRef();
    const groupRef = useRef();
    const frameRef = useRef(0);
    const elapsedRef = useRef(0);
    const { camera } = useThree();

    const dodgeX = useRef(0);
    const targetDodgeX = useRef(0);
    const worldPosVec = useRef(new THREE.Vector3());

    const textures = useTexture(FRAME_PATHS);

    useEffect(() => {
        if (Array.isArray(textures)) {
            textures.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; });
        }
        if (meshRef.current && Array.isArray(textures) && textures[0]) {
            meshRef.current.material.map = textures[0];
            meshRef.current.material.needsUpdate = true;
        }
    }, [textures]);

    useFrame((state, delta) => {
        if (!groupRef.current) return;

        const time = state.clock.elapsedTime;
        groupRef.current.getWorldPosition(worldPosVec.current);
        const distance = camera.position.z - worldPosVec.current.z;

        const DODGE_START = 3;
        const DODGE_PEAK = 0;
        const DODGE_END = -2;
        const DODGE_AMOUNT = -1.5;

        if (distance > DODGE_PEAK && distance < DODGE_START) {
            const t = (DODGE_START - distance) / (DODGE_START - DODGE_PEAK);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else if (distance <= DODGE_PEAK && distance > DODGE_END) {
            const t = (distance - DODGE_END) / (DODGE_PEAK - DODGE_END);
            targetDodgeX.current = DODGE_AMOUNT * easeOutQuad(t);
        } else {
            targetDodgeX.current = 0;
        }

        dodgeX.current = THREE.MathUtils.lerp(dodgeX.current, targetDodgeX.current, 0.08);
        groupRef.current.position.x = position[0] + dodgeX.current;
        groupRef.current.position.y = position[1] + Math.sin(time * 0.6) * 0.04;

        if (Array.isArray(textures) && textures.length === FRAME_COUNT) {
            elapsedRef.current += delta;
            const newFrame = Math.floor(elapsedRef.current * ANIMATION_FPS) % FRAME_COUNT;
            if (newFrame !== frameRef.current && meshRef.current && textures[newFrame]) {
                frameRef.current = newFrame;
                meshRef.current.material.map = textures[newFrame];
                meshRef.current.material.needsUpdate = true;
            }
        }
    });

    return (
        <group ref={groupRef} position={position}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <planeGeometry args={[FRAME_W, FRAME_H]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent={true}
                    side={THREE.DoubleSide}
                    depthWrite={false}
                    toneMapped={false}
                />
            </mesh>
        </group>
    );
};

const easeOutQuad = (t) => t * (2 - t);

export default Avatar;