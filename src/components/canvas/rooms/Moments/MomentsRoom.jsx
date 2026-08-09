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
    { id: 'g1', src: '/cartoon/media/gallery/wrc7.jpg', title: 'WRC 训练体系', desc: '从拼装、调试到走上赛场,机器人课的一整年。' },
    { id: 'g2', src: '/cartoon/media/gallery/python-course.jpg', title: 'Python 课程', desc: '从一行代码到一份作品,Python 项目式课堂。' },
    { id: 'g3', src: '/cartoon/media/gallery/cpp-course.jpg', title: 'C++ 竞赛路径', desc: '从一道题、一份训练,走到一个能上台面的自己。' },
    { id: 'g4', src: '/cartoon/media/gallery/robot-detail1.jpg', title: '机器人项目细节', desc: '每一个螺丝和每一行代码,都是孩子们的现场。' },
    { id: 'g5', src: '/cartoon/media/gallery/4e7cde1d67137f31dbbaceea09b3ba97.jpg', title: '课堂辅导瞬间', desc: '一个课堂、一个舞台、一个创作者。' },
    { id: 'g6', src: '/cartoon/media/gallery/5532032ec1ecd25b5aab600c3c66653e.jpg', title: '工作坊瞬间', desc: '作品工作坊:学生互相看、互相改、互相鼓掌。' },
    { id: 'g7', src: '/cartoon/media/gallery/7ea7aec2c2fc24cdff315baf30e19994.jpg', title: '学生作品展示', desc: '每一届人走出教室时,手里都握着一样东西。' },
    { id: 'g8', src: '/cartoon/media/gallery/bf42704d89c36b8f7175792f2c6406df.jpg', title: '幕后现场', desc: '舞台背后的准备与调试。' },
    { id: 'g9', src: '/cartoon/media/gallery/03e58ed3352bb2c5b6c34475e3ef5c05.jpg', title: '教学现场', desc: '课堂幻灯片、学生作品镜头,每届人都上台。' },
    { id: 'g10', src: '/cartoon/media/gallery/11.jpg', title: '学生作品', desc: '孩子自己造出来、愿意拿给世界看的小作品。' },
    { id: 'g11', src: '/cartoon/media/gallery/4c034334db22d80ecae7cd665b142e62.jpg', title: '课堂剪影', desc: '日常课堂里的专注与笑声。' },
    { id: 'g12', src: '/cartoon/media/gallery/ebe3db8e9e230e42fa4a3821dc906ca8.jpg', title: '活动现场', desc: '活动与赛场的真实记录。' },
    { id: 's1', src: '/cartoon/media/scenes/python-path.jpg', title: 'Python 成长路', desc: '从第一行到第一个作品,关卡式进阶。' },
    { id: 's2', src: '/cartoon/media/scenes/cpp-noi-path.jpg', title: 'C++ / NOI 之路', desc: '从爱好走向系统,从爱好到出成果。' },
    { id: 's3', src: '/cartoon/media/scenes/ai-classroom-path.jpg', title: 'AI 课堂', desc: '让 AI 走下神坛,变成孩子课桌上的一个工具。' },
    { id: 's4', src: '/cartoon/media/scenes/robotics-path.jpg', title: '机器人之路', desc: '从一台机器到一场比赛,孩子学到的远不止是机械。' },
    { id: 's5', src: '/cartoon/media/scenes/project-release-path.jpg', title: '作品发布现场', desc: '作品、笔记与在舞台上讲的事,都被记下。' },
    { id: 's6', src: '/cartoon/media/scenes/service-loop-path.jpg', title: '服务与成长循环', desc: '课堂、反馈、迭代,一年又一年。' },
    { id: 'r1', src: '/cartoon/media/photo-hero.webp', title: '森林', desc: '我是森林,一位手艺人出身的教育者。' },
    { id: 'r2', src: '/cartoon/media/photo-wrcc.webp', title: 'WRC 赛场', desc: '赛场上的合影与纪念。' },
    { id: 'p1', src: '/cartoon/media/posters/personal-site.jpg', title: '个人站搭建全流程', desc: '网站 · 项目:完整记录个人站的搭建。' },
    { id: 'p2', src: '/cartoon/media/posters/interactive-knowledge.jpg', title: '互动知识课堂', desc: '课堂记录:可以动手玩的知识现场。' },
    { id: 'p3', src: '/cartoon/media/posters/color-english.jpg', title: '色彩英语 · AI 演示', desc: '人工智能 · 教学:AI 现场生成色彩单词卡片。' },
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
    useEffect(() => {
        texture.colorSpace = THREE.SRGBColorSpace;
    }, [texture]);

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
