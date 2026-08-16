import { useRef, useState, useMemo, useEffect, useCallback, Suspense } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, PositionalAudio } from '@react-three/drei';
import * as THREE from 'three';
import { useScene } from '../../../../context/SceneContext';
import { useAudio } from '../../../../context/AudioManager';
import { useAchievements } from '../../../../context/AchievementsContext';

// ============================================
// 掠影 · 照片墙
// 圆柱显示器塔风格:23 张真实照片围成一圈,
// 拖动旋转,点击打开灯箱;背景播放教室全景视频。
// ============================================

export const AUDIO_SETTINGS = {
    volume: 1.2,
    distance: 2,
    rolloff: 1.2
};

const PHOTOS = [
    { id: 'g1',  src: '/cartoon/media/gallery/m01-toddler-truck.jpg',     title: '四岁 · 小小工程师',   desc: '一辆玩具挖掘机,一条泥土路,关于探索的第一课。' },
    { id: 'g2',  src: '/cartoon/media/gallery/m02-preschool-buds.jpg',    title: '幼儿园 · 春天',         desc: '紫色风信子,黄色雏菊。第一次捧起花的下午。' },
    { id: 'g3',  src: '/cartoon/media/gallery/m03-preschool-rice.jpg',    title: '幼儿园 · 稻田',         desc: '在金色稻田边的合影。' },
    { id: 'g4',  src: '/cartoon/media/gallery/m04-preschool-yellow.jpg',  title: '幼儿园 · 黄衣少年',     desc: '那个永远在笑的年纪。' },
    { id: 'g5',  src: '/cartoon/media/gallery/m05-preschool-toddler.jpg', title: '两岁 · 第一张纪念照',    desc: '红毛衣、辣椒帽,学着比手势。' },
    { id: 'g6',  src: '/cartoon/media/gallery/m06-preschool-balloons.jpg',title: '两岁 · 气球与蛋糕',      desc: '粉色蛋糕和第一支蜡烛。' },
    { id: 'g7',  src: '/cartoon/media/gallery/m07-school-stage.jpg',      title: '校园 · 舞台',           desc: '站在台上的感觉,从那一刻开始。' },
    { id: 'g8',  src: '/cartoon/media/gallery/m08-school-2022.jpg',       title: '2022 · 上学',          desc: '背起书包的第一天。' },
    { id: 'g9',  src: '/cartoon/media/gallery/m09-birthday-family.jpg',   title: '生日 · 妹妹和我',       desc: '开心福气,四个字写满了整个蛋糕。' },
    { id: 'g10', src: '/cartoon/media/gallery/m10-doraemon-cake.jpg',     title: '生日 · 哆啦 A 梦',      desc: '蛋糕上站着蓝色的童年。' },
    { id: 'g11', src: '/cartoon/media/gallery/m11-orange-grove.jpg',      title: '秋天 · 桔子园',         desc: '满山的桔子,比个耶再回家。' },
    { id: 'g12', src: '/cartoon/media/gallery/m12-rose-arch.jpg',         title: '和光里 · 玫瑰拱门',     desc: '坐在一整面花墙下,记录一整个秋天。' },
    { id: 's1',  src: '/cartoon/media/gallery/m13-bench-sister.jpg',      title: '长椅 · 我和妹妹',       desc: '两个人并排坐,什么都不说也挺好。' },
    { id: 's2',  src: '/cartoon/media/gallery/m14-calligraphy-front.jpg', title: '写春联 · 前程似锦',     desc: '第一次认真写的四个字,被郑重举起。' },
    { id: 's3',  src: '/cartoon/media/gallery/m15-calligraphy-up.jpg',    title: '写春联 · 高高举起',     desc: '一样的字,举得更高一点。' },
    { id: 's4',  src: '/cartoon/media/gallery/m16-mountain-dad.jpg',      title: '山顶 · 和爸爸',         desc: '在山顶被爸爸举起来,像是站在世界的最顶上。' },
    { id: 's5',  src: '/cartoon/media/gallery/m17-tree-outfit.jpg',       title: '大树 · 唐装少年',       desc: '爬到树杈上,说自己也想开花。' },
    { id: 's6',  src: '/cartoon/media/gallery/m18-spring-2026-1.jpg',     title: '2026 春 · 日常',        desc: '新一年的开始。' },
    { id: 'r1',  src: '/cartoon/media/photo-hero.jpg',                    title: '我是骆沐辰',            desc: '我喜欢用 AI 编程做宇宙、机器人、游戏的作品。' },
    { id: 'r2',  src: '/cartoon/media/gallery/m19-spring-2026-2.jpg',     title: '2026 · 又一岁',         desc: '又长大一岁,继续探索。' },
    { id: 'p1',  src: '/cartoon/media/gallery/m20-cny-mall-2025.jpg',     title: '2025 春节 · 老街',       desc: '在老街二楼看新春灯饰,看一年又一年的样子。' },
    { id: 'p2',  src: '/cartoon/media/gallery/m21-cny-grandparents.jpg',  title: '春节 · 爷爷奶奶',        desc: '一家人整整齐齐。' },
    { id: 'p3',  src: '/cartoon/media/gallery/m22-cny-drum.jpg',          title: '春节 · 大鼓',            desc: '第一次擂响大年的鼓声。' },
    { id: 'p4',  src: '/cartoon/media/gallery/m23-shopping-trip.jpg',     title: '周末 · 出行',            desc: '和家人逛一逛,记录一座城。' },
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

    // Video background is rendered in child component wrapped in Suspense (see VideoBackground)

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
            {/* Video background wrapped in its own Suspense - failure or slow load won't block the photo ring */}
            <Suspense fallback={null}>
                <VideoBackground isMobile={isMobile} />
            </Suspense>

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
                font="/cartoon/fonts/ZCOOLKuaiLe-Regular.ttf"
            >
                掠影 · 照片墙
            </Text>
            <Text
                position={[0, isMobile ? 2.0 : 3.45, 0]}
                fontSize={isMobile ? 0.2 : 0.22}
                color="#777777"
                anchorX="center"
                anchorY="middle"
                font="/cartoon/fonts/ZCOOLKuaiLe-Regular.ttf"
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
                    url="/cartoon/sounds/szummonitorow.mp3"
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

// Video background child - isolated so its suspense does not block photo ring or other content.
// We use a plain HTMLVideoElement to guarantee we can pause + null the source when the room unmounts,
// otherwise the previous behavior left the video playing in the background after closing the overlay.
const VideoBackground = ({ isMobile }) => {
    const videoRef = useRef(null);
    const [ready, setReady] = useState(false);
    const [tex, setTex] = useState(null);

    useEffect(() => {
        const el = document.createElement('video');
        el.src = '/cartoon/media/videos/wechat-03.mp4';
        el.muted = true;
        el.loop = true;
        el.playsInline = true;
        el.autoplay = true;
        el.preload = 'auto';
        el.style.display = 'none';
        el.crossOrigin = 'anonymous';
        document.body.appendChild(el);
        videoRef.current = el;

        const onPlay = () => {
            const t = new THREE.VideoTexture(el);
            t.colorSpace = THREE.SRGBColorSpace;
            t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
            setTex(t);
            setReady(true);
        };
        el.addEventListener('playing', onPlay);
        el.play().catch(() => {});

        return () => {
            el.removeEventListener('playing', onPlay);
            try { el.pause(); } catch (e) { /* ignore */ }
            el.removeAttribute('src');
            el.load();
            if (el.parentNode) el.parentNode.removeChild(el);
            if (tex) {
                try { tex.dispose(); } catch (e) { /* ignore */ }
            }
            videoRef.current = null;
        };
    }, []);

    if (!ready || !tex) return null;

    return (
        <mesh position={[0, 1.5, -26]} frustumCulled={false}>
            <planeGeometry args={[isMobile ? 36 : 60, isMobile ? 21 : 34]} />
            <meshBasicMaterial color="#e0e0e0" map={tex} toneMapped={false} side={THREE.DoubleSide} />
        </mesh>
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
