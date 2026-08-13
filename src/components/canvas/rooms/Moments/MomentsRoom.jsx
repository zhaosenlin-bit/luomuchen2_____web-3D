import { useRef, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../../../context/SceneContext';
import { useAudio } from '../../../../context/AudioManager';
import { useAchievements } from '../../../../context/AchievementsContext';

// ============================================
// 掠影 · 照片墙
// 圆柱显示器塔风格:照片围成一圈,
// 拖动旋转,点击打开灯箱;背景为深空星墙。
// ============================================

export const AUDIO_SETTINGS = {
    volume: 1.2,
    distance: 2,
    rolloff: 1.2
};

const PHOTOS = [
    { id: 'm1', src: '/luomuchen2_____web-3D/media/moments/kb-home.webp', title: '2026-08-10 · 知识库诞生', desc: '建好我的 AI 学习知识库：INDEX、AGENTS、五大视图、模板，一样不少。' },
    { id: 'm2', src: '/luomuchen2_____web-3D/media/moments/cosmic-3d.webp', title: '宇宙探索者 · 3D 视图', desc: '太阳系 3D 视图，鼠标拖动看行星。' },
    { id: 'm3', src: '/luomuchen2_____web-3D/media/moments/cosmic-sun.webp', title: '宇宙探索者 · 点击太阳', desc: '点击太阳，查看它的档案和真实数据。' },
    { id: 'm4', src: '/luomuchen2_____web-3D/media/moments/cosmic-planets-hover.webp', title: '宇宙探索者 · 行星档案', desc: '每一颗行星都有中文档案卡。' },
    { id: 'm5', src: '/luomuchen2_____web-3D/media/moments/cosmic-moons.webp', title: '宇宙探索者 · 月球', desc: '月球档案：人类登月的故事。' },
    { id: 'm6', src: '/luomuchen2_____web-3D/media/moments/cosmic-earth.webp', title: '宇宙探索者 · 地球', desc: '从太空看地球，蓝色的家。' },
    { id: 'm7', src: '/luomuchen2_____web-3D/media/moments/cosmic-saturn.webp', title: '宇宙探索者 · 土星', desc: '土星环的浪漫。' },
    { id: 'm8', src: '/luomuchen2_____web-3D/media/moments/cosmic-dwarf.webp', title: '宇宙探索者 · 矮行星', desc: '矮行星档案：冥王星也有一席之地。' },
    { id: 'm9', src: '/luomuchen2_____web-3D/media/moments/cosmic-galaxies.webp', title: '宇宙探索者 · 星系', desc: '星系科普页。' },
    { id: 'm10', src: '/luomuchen2_____web-3D/media/moments/cosmic-gallery.webp', title: '宇宙探索者 · 影像画廊', desc: '宇宙影像画廊：星云、星系、深空。' },
    { id: 'm11', src: '/luomuchen2_____web-3D/media/moments/cosmic-blackhole.webp', title: '宇宙探索者 · 黑洞', desc: '3D 黑洞场景，什么都逃不出去。' },
    { id: 'm12', src: '/luomuchen2_____web-3D/media/moments/cosmic-nebula.webp', title: '宇宙探索者 · 星云', desc: '绚丽星云背景。' },
    { id: 'm13', src: '/luomuchen2_____web-3D/media/moments/cosmic-mission.webp', title: '宇宙探索者 · 任务游戏', desc: '5 阶段闯关：收集材料、建造火箭。' },
    { id: 'm14', src: '/luomuchen2_____web-3D/media/moments/cosmic-stage3.webp', title: '宇宙探索者 · 躲避陨石', desc: '3D 躲避陨石，空格发射炮弹。' },
    { id: 'm15', src: '/luomuchen2_____web-3D/media/moments/cosmic-dock.webp', title: '宇宙探索者 · 飞船对接', desc: '用鼠标控制飞船与航天站对接。' },
    { id: 'm16', src: '/luomuchen2_____web-3D/media/moments/cosmic-mercury.webp', title: '宇宙探索者 · 水星任务', desc: '任务游戏里走过水星。' },
    { id: 'm17', src: '/luomuchen2_____web-3D/media/moments/cosmic-solar.webp', title: '宇宙探索者 · 太阳系', desc: '太阳系全景。' },
    { id: 'm18', src: '/luomuchen2_____web-3D/media/moments/cosmic-homecard.webp', title: '宇宙探索者 · 首页', desc: '首页第一屏：一句话记住我的作品。' },
    { id: 'm19', src: '/luomuchen2_____web-3D/media/moments/cosmic-check.webp', title: '发布前优化', desc: '用"发布前优化 Prompt"修复了网页打不开、图片加载不出来。' },
    { id: 'm20', src: '/luomuchen2_____web-3D/media/gallery/wrc7.jpg', title: '世界机器人大赛（图待补）', desc: '2025 宜昌锦标赛 冠军 🏆，具体照片待补充。' },
    { id: 'm21', src: '/luomuchen2_____web-3D/media/apps/knowledge-base.webp', title: '我的知识库 · 五大视图', desc: '能力 / 项目 / 资源 / 概念 / 每日索引。' },
    { id: 'm22', src: '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp', title: '我的概念卡', desc: 'Vibe Coding、Prompt、Context……一张卡一个概念。' },
    { id: 'm23', src: '/luomuchen2_____web-3D/images/map.webp', title: '下一个小目标', desc: '参加黑客松和企业比赛，用 AI 做出更多有用的应用。' },
];

const MomentsRoom = ({ showRoom, onReady, isExiting, isWarmup }) => {
    const groupRef = useRef();
    const ringRef = useRef();
    const { size } = useThree();
    const { openOverlay } = useScene();
    const { globalVolume, isMuted } = useAudio();
    const { showTutorial } = useAchievements();
    const effectiveVolume = isMuted ? 0 : AUDIO_SETTINGS.volume * globalVolume;

    const isMobile = size.width < 768;

    // Ready signal
    const hasSignaledReady = useRef(false);
    const frameCount = useRef(0);
    const FRAMES_TO_WAIT = 12;

    // Show the browse hint shortly after the room becomes interactive
    useEffect(() => {
        if (showRoom && !isWarmup && !isExiting) {
            const t = setTimeout(() => showTutorial('moments_browse'), 1500);
            return () => clearTimeout(t);
        }
    }, [showRoom, isWarmup, isExiting, showTutorial]);

    // Rotation state
    const angle = useRef(0);
    const targetAngle = useRef(0);
    const velocity = useRef(0);
    const dragging = useRef(false);
    const lastX = useRef(0);
    const dragDist = useRef(0);
    const hasInteracted = useRef(false);

    
    // Arrange photos in a ring (two staggered rows)
    const ringItems = useMemo(() => {
        const radius = isMobile ? 4.5 : 5;
        const perRow = Math.ceil(PHOTOS.length / 2);
        return PHOTOS.map((photo, i) => {
            const row = i % 2;
            const rowIndex = Math.floor(i / 2);
            const a = (rowIndex / perRow) * Math.PI * 2 + (row === 0 ? 0 : (Math.PI * 2) / perRow / 2);
            const x = Math.cos(a) * radius;
            const z = Math.sin(a) * radius;
            const y = row === 0 ? 1.4 : -1.6;
            // Face the center: plane normal (+Z) rotated by rotY should point to origin
            const rotY = Math.atan2(-Math.cos(a), -Math.sin(a));
            return { ...photo, x, y, z, rotY };
        });
    }, [isMobile]);

    // Interaction: drag to rotate
    const onPointerDown = useCallback((e) => {
        dragging.current = true;
        lastX.current = e.clientX ?? 0;
        dragDist.current = 0;
        velocity.current = 0;
    }, []);

    const onPointerMove = useCallback((e) => {
        if (!dragging.current) return;
        const x = e.clientX ?? 0;
        const dx = x - lastX.current;
        lastX.current = x;
        dragDist.current += Math.abs(dx);
        targetAngle.current += dx * 0.008;
        velocity.current = dx * 0.008;
        hasInteracted.current = true;
    }, []);

    const onPointerUp = useCallback(() => {
        dragging.current = false;
    }, []);

    useEffect(() => {
        window.addEventListener('pointerdown', onPointerDown);
        window.addEventListener('pointermove', onPointerMove);
        window.addEventListener('pointerup', onPointerUp);
        window.addEventListener('pointercancel', onPointerUp);
        return () => {
            window.removeEventListener('pointerdown', onPointerDown);
            window.removeEventListener('pointermove', onPointerMove);
            window.removeEventListener('pointerup', onPointerUp);
            window.removeEventListener('pointercancel', onPointerUp);
        };
    }, [onPointerDown, onPointerMove, onPointerUp]);

    // Frame loop: inertia + smooth rotation
    useFrame((state, delta) => {
        if (!hasSignaledReady.current) {
            frameCount.current++;
            if (frameCount.current >= FRAMES_TO_WAIT) {
                hasSignaledReady.current = true;
                onReady?.();
            }
        }

        if (!dragging.current) {
            targetAngle.current += velocity.current;
            velocity.current *= 0.96;
            if (Math.abs(velocity.current) < 0.0001) velocity.current = 0;
        }

        // Gentle auto-sway before first interaction
        if (!hasInteracted.current) {
            targetAngle.current = Math.sin(state.clock.elapsedTime * 0.05) * 0.6;
        }

        const lerp = 1 - Math.pow(0.001, delta);
        angle.current = THREE.MathUtils.lerp(angle.current, targetAngle.current, lerp);
        if (ringRef.current) {
            ringRef.current.rotation.y = angle.current;
        }
    });

    const handlePhotoClick = (photo, e) => {
        e.stopPropagation();
        if (dragDist.current > 8) return; // It was a drag, not a click
        openOverlay({
            layout: 'photo',
            title: photo.title,
            description: photo.desc,
            image: photo.src,
        });
    };

    return (
        <group ref={groupRef} position={[0, 0, 0]}>
            {/* 背景视频已移除：不展示原模板的课堂实录视频 */}

            {/* Backdrop wall (paper) */}
            <mesh position={[0, 0, -8]}>
                <planeGeometry args={[80, 40]} />
                <meshBasicMaterial color="#f2ead8" side={THREE.DoubleSide} />
            </mesh>

            {/* Title (compact so it does not fill the viewport) */}
            <Text
                position={[0, isMobile ? 2.7 : 4.0, 0]}
                fontSize={isMobile ? 0.6 : 0.85}
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="/luomuchen2_____web-3D/fonts/ZCOOLKuaiLe-Regular.ttf"
            >
                掠影 · 照片墙
            </Text>
            <Text
                position={[0, isMobile ? 2.0 : 3.45, 0]}
                fontSize={isMobile ? 0.2 : 0.22}
                color="#777777"
                anchorX="center"
                anchorY="middle"
                font="/luomuchen2_____web-3D/fonts/ZCOOLKuaiLe-Regular.ttf"
            >
                拖动旋转 · 点击查看照片
            </Text>

            {/* Photo ring */}
            <group ref={ringRef}>
                {ringItems.map((photo) => (
                    <PhotoFrame
                        key={photo.id}
                        photo={photo}
                        onPhotoClick={handlePhotoClick}
                    />
                ))}
            </group>

            {/* Floor */}
            <mesh position={[0, -4.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                <circleGeometry args={[isMobile ? 16 : 24, 48]} />
                <meshBasicMaterial color="#e9dcc0" />
            </mesh>

            {/* Ambient audio */}
            {!isWarmup && (
                <PositionalAudio
                    url="/luomuchen2_____web-3D/sounds/szummonitorow.mp3"
                    distanceModel="exponential"
                    refDistance={AUDIO_SETTINGS.distance}
                    rolloffFactor={AUDIO_SETTINGS.rolloff}
                    loop
                    autoplay
                    volume={effectiveVolume}
                />
            )}
        </group>
    );
};


// Polaroid frame whose size follows the photo's aspect ratio
const PhotoFrame = ({ photo, onPhotoClick }) => {
    const texture = useTexture(photo.src);
    const { gl } = useThree();
    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.anisotropy = Math.min(8, gl?.capabilities?.getMaxAnisotropy?.() ?? 1);
        texture.needsUpdate = true;
    }, [texture, gl]);

    const dims = useMemo(() => {
        const img = texture.image;
        let aspect = 4 / 3;
        if (img && img.width && img.height) aspect = img.width / img.height;
        aspect = Math.min(Math.max(aspect, 0.62), 1.85); // clamp extreme portrait/landscape
        const w = 0.9;
        const h = w / aspect;
        return { w, h };
    }, [texture]);

    return (
        <group
            position={[photo.x, photo.y, photo.z]}
            rotation={[0, photo.rotY, 0]}
            onClick={(e) => onPhotoClick(photo, e)}
            onPointerOver={(e) => {
                e.stopPropagation();
                document.body.style.cursor = 'pointer';
            }}
            onPointerOut={() => {
                document.body.style.cursor = 'auto';
            }}
        >
            {/* Polaroid-style paper frame, tighter margins so the photo dominates */}
            <mesh position={[0, 0, 0]}>
                <planeGeometry args={[dims.w + 0.18, dims.h + 0.22]} />
                <meshBasicMaterial color="#fffaf2" side={THREE.DoubleSide} />
            </mesh>
            {/* Inner inked border for a hand-drawn feel */}
            <mesh position={[0, 0, 0.005]}>
                <planeGeometry args={[dims.w + 0.10, dims.h + 0.14]} />
                <meshBasicMaterial color="#e9dfcc" transparent opacity={0.55} side={THREE.DoubleSide} />
            </mesh>
            {/* Photo */}
            <mesh position={[0, 0.02, 0.02]}>
                <planeGeometry args={[dims.w, dims.h]} />
                <meshBasicMaterial color="#e0e0e0" map={texture} side={THREE.DoubleSide} />
            </mesh>
        </group>
    );
};

export default MomentsRoom;
