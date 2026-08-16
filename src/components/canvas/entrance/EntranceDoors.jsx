import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text, useTexture, Html } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import '../shaders/RevealMaterial'; // Registers alpha-discard reveal shader
import { playBackgroundMusic } from '../../../utils/audioManager';
import { useAchievements } from '../../../context/AchievementsContext';
import { isTouchDevice } from '../../../utils/deviceDetect';

// Use same font as App.jsx preload (Inter) - works reliably
const FONT_URL = 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff';



/**
 * EntranceDoors Component - 3D Entrance to the Corridor
 * 
 * Doors that open and camera flies through.
 * EmptyCorridor provides the surrounding corridor context.
 */
const EntranceDoors = ({
    position = [0, 0, 22],
    onComplete,
    corridorHeight = 8, // Taller wall
    corridorWidth = 15 // Wider wall
}) => {
    const leftDoorRef = useRef();
    const rightDoorRef = useRef();
    const leftHandleRef = useRef();
    const rightHandleRef = useRef();
    const rightDoorMaterialRef = useRef(); // GSAP shader control
    const leftDoorMaterialRef = useRef(); // Left door reveal control
    const leftHandleMaterialRef = useRef(); // Left handle reveal control
    const rightHandleMaterialRef = useRef(); // Right handle reveal control
    const leftHandlePaintedRef = useRef(); // Painted handle mesh visibility
    const rightHandlePaintedRef = useRef(); // Painted handle mesh visibility
    const groupRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isWindowHovered, setIsWindowHovered] = useState(false);
    // Save-button state: which entrance element is "frozen" in its hover-revealed
    // state even after the mouse leaves. Values: null | 'doors' | 'window'.
    const [savedEntranceId, setSavedEntranceId] = useState(null);
    const windowAvatarRef = useRef();
    const windowAvatarMaterialRef = useRef();
    const { camera, gl } = useThree();
    const { unlockAchievement } = useAchievements();

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        setIsMobile(isTouchDevice() || window.innerWidth < 1000);
    }, []);

    // Dla hooków tekstur musimy obliczyć to raz na starcie
    const isMobileDevice = typeof window !== 'undefined' && (isTouchDevice() || window.innerWidth < 1000);
    const dummyTex = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

    const frameTexture = useTexture('/cartoon/textures/doors/frame_sketch.webp');
    const doorLeftTexture = useTexture('/cartoon/textures/doors/door_left_sketch.webp');
    const doorRightTexture = useTexture('/cartoon/textures/doors/door_right_sketch.webp');

    // Mobile optimization: Don't load painted textures or handles on phones
    const doorRightPaintedTexture = useTexture(isMobileDevice ? dummyTex : '/cartoon/textures/doors/door_right_painted.webp');
    const doorLeftPaintedTexture = useTexture(isMobileDevice ? dummyTex : '/cartoon/textures/doors/door_left_painted.webp');
    const handleLeftTexture = useTexture('/cartoon/textures/doors/handle_left_sketch.webp');
    const handleLeftPaintedTexture = useTexture(isMobileDevice ? dummyTex : '/cartoon/textures/doors/handle_left_painted.webp');
    const handleRightTexture = useTexture('/cartoon/textures/doors/handle_right_sketch.webp');
    const handleRightPaintedTexture = useTexture(isMobileDevice ? dummyTex : '/cartoon/textures/doors/handle_right_painted.webp');

    // Dynamic textures for mobile
    const doorBackTexture = useTexture(isMobileDevice ? '/cartoon/textures/doors/door_back.webp' : '/cartoon/textures/doors/door_back_left_sketch.webp');
    const edgeTexture = useTexture(isMobileDevice ? '/cartoon/textures/doors/pien_sketch.webp' : '/cartoon/textures/doors/pien.webp');

    const bricksTexture = useTexture('/cartoon/textures/entrance/wall_bricks_2.webp');
    const stonePathTexture = useTexture('/cartoon/textures/entrance/stone-path.webp');
    // const catTexture = useTexture('/cartoon/textures/entrance/cat_sketch.webp'); // Old side cat
    const catFrontBodyTexture = useTexture('/cartoon/textures/entrance/cat_front_body.webp');
    const windowSketchTexture = useTexture('/cartoon/textures/entrance/window_sketch.webp');
    // Use the original hand-drawn greeting figure in the window.
    const avatarWindowTexture = useTexture('/cartoon/media/tech-sketches/window-avatar-handdrawn-cutout.png');
    const treeTexture = useTexture('/cartoon/textures/entrance/tree_sketch.webp');
    const mouseTexture = useTexture('/cartoon/textures/entrance/mouse_hanging.webp');
    const potTexture = useTexture('/cartoon/textures/entrance/pot_with_duck.webp');
    const bugTexture = useTexture('/cartoon/textures/entrance/bug_sketch.webp');
    const inkSplashTexture = useTexture('/cartoon/images/ink-splash.webp');
    const speechBubbleTexture = useTexture('/cartoon/textures/entrance/speech_bubble.webp');
    const aiChipSketchTexture = useTexture('/cartoon/media/handdrawn-tech/entrance-ai-chip-doodle.png');
    const codeSymbolSketchTexture = useTexture('/cartoon/media/handdrawn-tech/entrance-code-badge-doodle.png');
    const neuralNetSketchTexture = useTexture('/cartoon/media/handdrawn-tech/entrance-neural-doodle.png');
    const terminalSketchTexture = useTexture('/cartoon/media/handdrawn-tech/entrance-terminal-doodle.png');
    const pythonSketchTexture = useTexture('/cartoon/media/handdrawn-tech/entrance-python-doodle.png');
    const avatarSketchTexture = useTexture('/cartoon/media/handdrawn-tech/entrance-avatar-badge-doodle.png');

    useEffect(() => {
        if (!avatarWindowTexture) return;
        avatarWindowTexture.colorSpace = THREE.SRGBColorSpace;
        avatarWindowTexture.anisotropy = Math.min(8, gl?.capabilities?.getMaxAnisotropy?.() ?? 1);
        avatarWindowTexture.needsUpdate = true;
    }, [avatarWindowTexture, gl]);


    // Cat Ref
    const leftPupilRef = useRef();
    const rightPupilRef = useRef();
    const catGroupRef = useRef(); // To get world position for tracking
    const bugRef = useRef();

    // Bug Click Animation State
    const [isBugClicked, setIsBugClicked] = useState(false);
    const [textVisible, setTextVisible] = useState(false);
    const [clipProgress, setClipProgress] = useState(0); // 0-1 for pencil drawing reveal
    const inkSplashRef = useRef();
    const handleHideDelayRef = useRef(); // Track pending gsap.delayedCall for handle visibility
    const bugFixedTextRef = useRef();
    const bugClickPos = useRef({ x: 0, y: 0 }); // Store click position

    // Duck Speech Bubble State (Rubber Duck Debugging)
    const [isDuckSpeaking, setIsDuckSpeaking] = useState(false);
    const [duckQuote, setDuckQuote] = useState('');
    const speechBubbleRef = useRef();

    // Rubber Duck Debugging Quotes
    const duckQuotes = [
        "Have you tried console.log()?",
        "Did you clear the cache?",
        "It works on my machine! 🤷",
        "Have you turned it off and on again?",
        "Maybe it's a CSS issue?",
        "Check for missing semicolons!",
        "Did you read the error message?",
        "Have you tried Stack Overflow?",
        "Is it plugged in?",
        "Works in production! 🚀",
    ];

    // Bug Click Handler
    const handleBugClick = (e) => {
        e.stopPropagation();
        if (isBugClicked) return; // Already clicked

        // Store bug position at click time
        if (bugRef.current) {
            bugClickPos.current = {
                x: bugRef.current.position.x,
                y: bugRef.current.position.y
            };
        }

        setIsBugClicked(true);
        document.body.style.cursor = "auto";

        // Animate ink splash scale up
        if (inkSplashRef.current) {
            // Position ink splash at bug's last position
            inkSplashRef.current.position.x = bugClickPos.current.x;
            inkSplashRef.current.position.y = bugClickPos.current.y;
            inkSplashRef.current.scale.set(0, 0, 0);
            inkSplashRef.current.material.opacity = 1;

            gsap.to(inkSplashRef.current.scale, {
                x: 0.8,
                y: 0.8,
                z: 1,
                duration: 0.4,
                ease: 'back.out(1.7)'
            });
        }

        // Pencil drawing effect - smooth reveal from left to right
        setTextVisible(true);
        setClipProgress(0);

        if (bugFixedTextRef.current) {
            bugFixedTextRef.current.position.x = bugClickPos.current.x;
            bugFixedTextRef.current.position.y = bugClickPos.current.y;
        }

        // Animate clip progress from 0 to 1 (reveals text like pencil drawing)
        gsap.to({ progress: 0 }, {
            progress: 1,
            duration: 0.8,
            ease: 'power1.inOut',
            onUpdate: function () {
                setClipProgress(this.targets()[0].progress);
            },
            onComplete: () => {
                // Fade out after a delay
                setTimeout(() => {
                    if (inkSplashRef.current) {
                        gsap.to(inkSplashRef.current.material, {
                            opacity: 0,
                            duration: 1,
                            ease: 'power2.out'
                        });
                    }
                }, 1500);
            }
        });
    };

    // Duck Click Handler (Rubber Duck Debugging)
    const handleDuckClick = (e) => {
        e.stopPropagation();
        if (isDuckSpeaking) return; // Already speaking

        // Pick random quote
        const randomQuote = duckQuotes[Math.floor(Math.random() * duckQuotes.length)];
        setDuckQuote(randomQuote);
        setIsDuckSpeaking(true);

        // Scale in animation for speech bubble
        if (speechBubbleRef.current) {
            speechBubbleRef.current.scale.set(0, 0, 0);
            gsap.to(speechBubbleRef.current.scale, {
                x: 1,
                y: 1,
                z: 1,
                duration: 0.3,
                ease: 'back.out(1.7)'
            });
        }

        // Hide after 3 seconds
        setTimeout(() => {
            if (speechBubbleRef.current) {
                gsap.to(speechBubbleRef.current.scale, {
                    x: 0,
                    y: 0,
                    z: 0,
                    duration: 0.2,
                    ease: 'power2.in',
                    onComplete: () => setIsDuckSpeaking(false)
                });
            } else {
                setIsDuckSpeaking(false);
            }
        }, 3000);
    };

    // ... (lines omitted)



    // Door dimensions - calculated from texture proportions (332x848 = 1:2.55)
    // Door dimensions - calculated from texture proportions (332x848 = 1:2.55)
    const doorWidth = 0.94;
    const doorHeight = 2.4;
    const doorOpeningWidth = doorWidth * 2; // Both doors together
    const wallThickness = 0.07;

    // Frame dimensions from texture (718x877 = 1:1.22)
    const frameWidth = doorOpeningWidth + 0.16; // Extra for frame borders
    const frameHeight = frameWidth * (877 / 718); // Maintain texture aspect ratio

    // Floor Y must remain at standard level (-1.75) regardless of wall height
    const floorY = -1.75;
    const doorBottomY = floorY;
    const doorCenterY = doorBottomY + doorHeight / 2;
    const wallCenterY = floorY + corridorHeight / 2;
    const topWallHeight = corridorHeight - doorHeight;
    const topWallCenterY = doorBottomY + doorHeight + topWallHeight / 2;
    const sideWallWidth = (corridorWidth - doorOpeningWidth) / 2;



    // Cat Interaction State


    // Handle click
    const handleClick = (e) => {
        e.stopPropagation();
        if (isOpen || isAnimating) return;

        // Reset cursor immediately on transition start
        document.body.style.cursor = "auto";

        setIsOpen(true);
        setIsAnimating(true);
        playBackgroundMusic();
        unlockAchievement('corridor_enter');

        const tl = gsap.timeline({
            onComplete: () => {
                onComplete?.();
            }
        });

        // Press handles down fully (like really opening)
        if (leftHandleRef.current) {
            tl.to(leftHandleRef.current.rotation, {
                z: 0.4,
                duration: 0.15,
                ease: 'power2.out'
            }, 0);
        }
        if (rightHandleRef.current) {
            tl.to(rightHandleRef.current.rotation, {
                z: -0.4,
                duration: 0.15,
                ease: 'power2.out'
            }, 0);
        }

        // Open doors - smoother angle (matches SegmentDoors)
        tl.to(leftDoorRef.current.rotation, {
            y: -Math.PI * 0.55,
            duration: 0.9,
            ease: 'power2.out'
        }, 0.1);

        tl.to(rightDoorRef.current.rotation, {
            y: Math.PI * 0.55,
            duration: 0.9,
            ease: 'power2.out'
        }, 0.1);

        // Camera flies through - STOP CLOSER to avatar/ITOM
        tl.to(camera.position, {
            z: 11,  // Closer stop point (was 11)
            y: 0.2, // Match hook's base Y position
            duration: 1.8,
            ease: 'power2.inOut'
        }, 0.3);
    };

    // Handle hover - doors slightly open to indicate interactivity
    const handlePointerEnter = () => {
        if (isOpen || isAnimating || isMobile) return;
        setIsHovered(true);
        document.body.style.cursor = "pointer";

        // Slightly open doors on hover
        gsap.to(leftDoorRef.current.rotation, {
            y: -0.08,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true
        });
        gsap.to(rightDoorRef.current.rotation, {
            y: 0.08,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true
        });

        // Rotate handles down slightly (hint effect)
        if (leftHandleRef.current) {
            gsap.to(leftHandleRef.current.rotation, {
                z: 0.1,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (rightHandleRef.current) {
            gsap.to(rightHandleRef.current.rotation, {
                z: -0.1,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        }

        // Brush-stroke reveal: discard sketch pixels to show painted door beneath
        if (rightDoorMaterialRef.current) {
            gsap.to(rightDoorMaterialRef.current, {
                uProgress: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (leftDoorMaterialRef.current) {
            gsap.to(leftDoorMaterialRef.current, {
                uProgress: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (leftHandleMaterialRef.current) {
            gsap.to(leftHandleMaterialRef.current, {
                uProgress: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (rightHandleMaterialRef.current) {
            gsap.to(rightHandleMaterialRef.current, {
                uProgress: 1.0,
                duration: 0.8,
                ease: 'power2.out',
                overwrite: true
            });
        }
        // Show painted handles (kill any pending hide from previous leave)
        if (handleHideDelayRef.current) handleHideDelayRef.current.kill();
        if (leftHandlePaintedRef.current) leftHandlePaintedRef.current.visible = true;
        if (rightHandlePaintedRef.current) rightHandlePaintedRef.current.visible = true;
    };

    const handlePointerLeave = () => {
        if (isOpen || isAnimating || isMobile) return;
        // If the user "saved" the door hover, keep the doors open + painted layer
        // revealed even after the mouse leaves.
        if (savedEntranceId === 'doors') {
            setIsHovered(false);
            document.body.style.cursor = "auto";
            return;
        }
        setIsHovered(false);
        document.body.style.cursor = "auto";

        // Close doors back
        gsap.to(leftDoorRef.current.rotation, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true
        });
        gsap.to(rightDoorRef.current.rotation, {
            y: 0,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: true
        });

        // Reset handles
        if (leftHandleRef.current) {
            gsap.to(leftHandleRef.current.rotation, {
                z: 0,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (rightHandleRef.current) {
            gsap.to(rightHandleRef.current.rotation, {
                z: 0,
                duration: 0.2,
                ease: 'power2.out',
                overwrite: true
            });
        }

        // Reverse brush-stroke reveal
        if (rightDoorMaterialRef.current) {
            gsap.to(rightDoorMaterialRef.current, {
                uProgress: 0.0,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (leftDoorMaterialRef.current) {
            gsap.to(leftDoorMaterialRef.current, {
                uProgress: 0.0,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (leftHandleMaterialRef.current) {
            gsap.to(leftHandleMaterialRef.current, {
                uProgress: 0.0,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (rightHandleMaterialRef.current) {
            gsap.to(rightHandleMaterialRef.current, {
                uProgress: 0.0,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }

        // Hide painted handles after reverse animation completes
        handleHideDelayRef.current = gsap.delayedCall(0.55, () => {
            if (leftHandlePaintedRef.current) leftHandlePaintedRef.current.visible = false;
            if (rightHandlePaintedRef.current) rightHandlePaintedRef.current.visible = false;
        });
    };



    // --- Cat Eye Tracking Logic ---
    useFrame((state) => {
        if (!leftPupilRef.current || !rightPupilRef.current) return;

        // Mouse position in normalized device reference (-1 to +1)
        const { x, y } = state.pointer;

        // Configuration
        const MAX_EYE_MOVEMENT = 0.015; // How far pupils can move from center

        // Simple mapping
        const targetX = x * MAX_EYE_MOVEMENT * 2;
        const targetY = y * MAX_EYE_MOVEMENT * 2;

        // Smoothly interpolate current pupil position to target
        // Left Eye Original: [-0.063, 0.27]
        leftPupilRef.current.position.x = THREE.MathUtils.lerp(leftPupilRef.current.position.x, -0.075 + targetX, 0.1);
        leftPupilRef.current.position.y = THREE.MathUtils.lerp(leftPupilRef.current.position.y, 0.28 + targetY, 0.1);

        // Right Eye Original: [0.0615, 0.27]
        rightPupilRef.current.position.x = THREE.MathUtils.lerp(rightPupilRef.current.position.x, 0.043 + targetX, 0.1);
        rightPupilRef.current.position.y = THREE.MathUtils.lerp(rightPupilRef.current.position.y, 0.28 + targetY, 0.1);
    });

    // --- Mouse Swinging Animation ---
    const mousePivotRef = useRef();
    useFrame(({ clock }) => {
        if (mousePivotRef.current) {
            // Gentle swing: sin wave
            // Amplitude: 0.05 radians (approx 3 degrees)
            // Speed: 1.5
            mousePivotRef.current.rotation.x = Math.sin(clock.elapsedTime * 1.5) * 0.05;
        }

        // --- Bug Animation ---
        if (bugRef.current) {
            const time = clock.elapsedTime;
            // Wandering logic: slightly complex sine waves for "random" walking felt
            // Initial Pos: [2.5, floorY + 3.0, 0.16] (Above window)
            // Range: +/- 0.3 in X, +/- 0.3 in Y

            const xOffset = Math.sin(time * 0.8) * 0.3 + Math.sin(time * 1.5) * 0.1;
            const yOffset = Math.cos(time * 0.6) * 0.2 + Math.cos(time * 1.1) * 0.1;

            bugRef.current.position.x = 3 + xOffset;
            bugRef.current.position.y = (floorY + 3.8) + yOffset;

            // Random rotation jitter
            bugRef.current.rotation.z = Math.sin(time * 5) * 0.1 + Math.atan2(yOffset, xOffset) * 0.2;
        }
    });



    // Helper for window hover
    const handleWindowEnter = (e) => {
        e.stopPropagation();
        setIsWindowHovered(true);
        document.body.style.cursor = "pointer";

        if (windowAvatarRef.current) {
            gsap.to(windowAvatarRef.current.position, {
                x: 2.5,
                duration: 0.5,
                ease: 'back.out(1.7)',
                overwrite: true
            });
            gsap.to(windowAvatarRef.current.rotation, {
                z: 0.1,
                duration: 0.5,
                ease: 'power2.out',
                overwrite: true
            });
        }
        if (windowAvatarMaterialRef.current) {
            gsap.to(windowAvatarMaterialRef.current, {
                opacity: 1,
                duration: 0.3,
                ease: 'power2.out',
                overwrite: true
            });
        }
    };

    const handleWindowLeave = (e) => {
        e.stopPropagation();
        // If the user "saved" the window hover, keep the avatar visible.
        if (savedEntranceId === 'window') {
            setIsWindowHovered(false);
            document.body.style.cursor = "auto";
            return;
        }
        setIsWindowHovered(false);
        document.body.style.cursor = "auto";

        if (windowAvatarRef.current) {
            gsap.to(windowAvatarRef.current.position, {
                x: 3.5,
                duration: 0.4,
                ease: 'power2.in',
                overwrite: true
            });
            gsap.to(windowAvatarRef.current.rotation, {
                z: 0,
                duration: 0.4,
                ease: 'power2.in',
                overwrite: true
            });
        }
        if (windowAvatarMaterialRef.current) {
            gsap.to(windowAvatarMaterialRef.current, {
                opacity: 0,
                duration: 0.25,
                ease: 'power2.in',
                overwrite: true
            });
        }
    };

    // Frame center Y - aligned with doors
    const frameCenterY = doorBottomY + frameHeight / 2;

    const facadeYOffset = -1.65;


    const pathWidth = frameWidth + 0.4;
    // New texture is 1005x2317 (approx 1:2.3 ratio).
    // Width 2.44 * 2.3 = ~5.6 height.
    const pathLength = 5.62;

    // Derived flags used by both the hover effects and the Save button.
    // doorsRevealed: include savedEntranceId so saved doors stay open + painted.
    const doorsRevealed = !isOpen && !isAnimating && (isHovered || savedEntranceId === 'doors');
    const windowRevealed = isWindowHovered || savedEntranceId === 'window';

    // The button is shown whenever the user can act — either hover-engaged
    // (so they can save), or already saved (so they can un-save).
    const showEntranceSaveButton = isHovered || isWindowHovered || savedEntranceId !== null;

    // Decide which element gets saved when the user clicks the button.
    // Priority: currently hovered element first; fall back to whatever is saved.
    const handleEntranceSaveClick = () => {
        if (isHovered && !isWindowHovered) {
            // Doors hovered — toggle saved state for doors.
            setSavedEntranceId((prev) => (prev === 'doors' ? null : 'doors'));
        } else if (isWindowHovered && !isHovered) {
            // Window hovered — toggle saved state for window.
            setSavedEntranceId((prev) => (prev === 'window' ? null : 'window'));
        } else if (isHovered && isWindowHovered) {
            // Both hovered at once — toggle doors (more central target).
            setSavedEntranceId((prev) => (prev === 'doors' ? null : 'doors'));
        } else if (savedEntranceId !== null) {
            // Nothing hovered but something is saved — clear the save.
            setSavedEntranceId(null);
        }
    };

    return (
        <group ref={groupRef} position={[position[0], 0, position[2]]}>

            {/* === STONE PATH FLOOR (On Top - in front of entrance) === */}

            {/* WYSOKOŚĆ STONE PATH: zmień 'floorY + 0.02' - większa liczba = wyżej */}
            <mesh
                position={[0, floorY + 0.02, pathLength / 2]}
                rotation={[-Math.PI / 2, 0, 0]}
            >
                <planeGeometry args={[pathWidth, pathLength]} />
                <meshBasicMaterial color="#e0e0e0"
                    map={stonePathTexture}
                    transparent={true}
                />
            </mesh>


            {/* LEFT WALL PANEL */}
            <mesh position={[-(doorOpeningWidth / 2 + sideWallWidth / 2), wallCenterY, 0]}>
                <boxGeometry args={[sideWallWidth, corridorHeight, wallThickness]} />
                <meshBasicMaterial color="#e0e0e0" roughness={0.95} />
            </mesh>

            {/* RIGHT WALL PANEL */}
            <mesh position={[(doorOpeningWidth / 2 + sideWallWidth / 2), wallCenterY, 0]}>
                <boxGeometry args={[sideWallWidth, corridorHeight, wallThickness]} />
                <meshBasicMaterial color="#e0e0e0" roughness={0.95} />
            </mesh>

            {/* TOP WALL PANEL */}
            <mesh position={[0, topWallCenterY, 0]}>
                <boxGeometry args={[doorOpeningWidth, topWallHeight, wallThickness]} />
                <meshBasicMaterial color="#e0e0e0" roughness={0.95} />
            </mesh>

            {/* === BRICK FACADE === */}
            {/* 
                DOSTOSOWANIE OBRAZKA (TEXTURE ADJUSTMENT):
                1. args={[Szerokość, Wysokość]} - Rozmiar obrazka
                2. facadeYOffset - Przesunięcie góra/dół (np. -1 obniży, 1 podwyższy)
            */}
            <mesh position={[0, wallCenterY + facadeYOffset + 1.65, 0.15]}>
                {/* args={[Szerokość, Wysokość]} - Zmieniaj te liczby (np. 7, 8) */}
                <planeGeometry args={[16., 8]} />
                <meshBasicMaterial color="#e0e0e0"
                    map={bricksTexture}
                    transparent={true}
                    alphaTest={0.01}
                    roughness={0.9}
                />
            </mesh>
            {/* === TECH / AI / CODING SKETCHES (FLOATING DECOR) === */}
            {/* Floating in front of wall items (z=1.5) for visibility */}
            
            {/* Top-left: ai chip (left of sign, above tree top) */}
            <mesh position={[-2.95, wallCenterY + facadeYOffset + 1.75, 1.5]} renderOrder={30}>
                <planeGeometry args={[0.78, 0.78]} />
                <meshBasicMaterial color="#ffffff"
                    map={aiChipSketchTexture}
                    transparent={true}
                    alphaTest={0.05}
                    opacity={0.8}
                    depthWrite={false}
                />
            </mesh>
            
            {/* Top-right: terminal (right of sign, above window) */}
            <mesh position={[2.8, wallCenterY + facadeYOffset + 1.75, 1.5]} renderOrder={30}>
                <planeGeometry args={[1.08, 0.72]} />
                <meshBasicMaterial color="#ffffff"
                    map={terminalSketchTexture}
                    transparent={true}
                    alphaTest={0.05}
                    opacity={0.78}
                    depthWrite={false}
                />
            </mesh>
            
            {/* Above sign: code symbol (between sign top and ceiling) */}
            <mesh position={[0.05, wallCenterY + facadeYOffset + 2.75, 1.5]} renderOrder={30}>
                <planeGeometry args={[0.58, 0.58]} />
                <meshBasicMaterial color="#ffffff"
                    map={codeSymbolSketchTexture}
                    transparent={true}
                    alphaTest={0.05}
                    opacity={0.76}
                    depthWrite={false}
                />
            </mesh>
            
            {/* Mid-left: neural net (between door and tree, mid height) */}
            <mesh position={[-1.45, wallCenterY + facadeYOffset - 0.2, 1.5]} renderOrder={30}>
                <planeGeometry args={[0.74, 0.74]} />
                <meshBasicMaterial color="#ffffff"
                    map={neuralNetSketchTexture}
                    transparent={true}
                    alphaTest={0.05}
                    opacity={0.76}
                    depthWrite={false}
                />
            </mesh>
            
            {/* Mid-right: python (between door and window, mid height) */}
            <mesh position={[1.55, wallCenterY + facadeYOffset - 0.18, 1.5]} renderOrder={30}>
                <planeGeometry args={[0.66, 0.8]} />
                <meshBasicMaterial color="#ffffff"
                    map={pythonSketchTexture}
                    transparent={true}
                    alphaTest={0.05}
                    opacity={0.76}
                    depthWrite={false}
                />
            </mesh>
            
            {/* Bottom-left: avatar (left of door, near cat level) */}
            <mesh position={[-2.25, wallCenterY + facadeYOffset - 1.2, 1.5]} renderOrder={30}>
                <planeGeometry args={[0.62, 0.62]} />
                <meshBasicMaterial color="#ffffff"
                    map={avatarSketchTexture}
                    transparent={true}
                    alphaTest={0.05}
                    opacity={0.78}
                    depthWrite={false}
                />
            </mesh>



            {/* === TEXTURED FRAME === */}
            <mesh position={[0, frameCenterY, 0.12]}>
                <planeGeometry args={[frameWidth, frameHeight]} />
                <meshBasicMaterial color="#e0e0e0"
                    map={frameTexture}
                    transparent={true}
                    alphaTest={0.1}
                    roughness={0.9}
                    depthWrite={false}
                />
            </mesh>

            {/* LEFT DOOR */}
            <group ref={leftDoorRef} position={[-doorWidth, doorCenterY, 0]}>
                {/* Solid 3D Door Body with edge texture */}
                <mesh
                    position={[doorWidth / 2, 0, 0.06]}
                    onClick={handleClick}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                >
                    <boxGeometry args={[doorWidth, doorHeight, 0.04]} />
                    <meshBasicMaterial color="#e0e0e0" map={edgeTexture} roughness={0.9} />
                </mesh>

                {/* Painted layer (behind sketch) - left door */}
                {!isMobile && (
                    <mesh position={[doorWidth / 2, 0, 0.088]} raycast={() => null}>
                        <planeGeometry args={[doorWidth, doorHeight]} />
                        <meshBasicMaterial color="#e0e0e0"
                            map={doorLeftPaintedTexture}
                            transparent={true}
                            alphaTest={0.5}
                            roughness={0.8}
                        />
                    </mesh>
                )}

                {/* Sketch overlay (front) - left door brush-stroke reveal */}
                <mesh position={[doorWidth / 2, 0, 0.09]} raycast={() => null}>
                    <planeGeometry args={[doorWidth, doorHeight]} />
                    <revealMaterial color="#e0e0e0"
                        ref={leftDoorMaterialRef}
                        map={doorLeftTexture}
                        transparent={true}
                        alphaTest={0.5}
                        roughness={0.8}
                        depthWrite={false}
                        uProgress={0.0}
                    />
                </mesh>

                {/* Back Texture Face (mirrored) */}
                <mesh position={[doorWidth / 2, 0, 0.03]} rotation={[0, Math.PI, 0]} scale={[-1, 1, 1]}>
                    <planeGeometry args={[doorWidth, doorHeight]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={doorBackTexture}
                        transparent={true}
                        alphaTest={0.5}
                        roughness={0.8}
                        side={2}
                    />
                </mesh>

                {/* Handle Layer (animated) - pivot at screw center (292,459 on 332x848 texture) */}
                <group ref={leftHandleRef} position={[doorWidth / 2 + 0.357, -0.099, 0.10]}>
                    {/* Painted handle (behind) - hidden until hover */}
                    {!isMobile && (
                        <mesh ref={leftHandlePaintedRef} position={[-0.357, 0.09, -0.001]} visible={false}>
                            <planeGeometry args={[doorWidth, doorHeight]} />
                            <meshBasicMaterial color="#e0e0e0"
                                map={handleLeftPaintedTexture}
                                transparent={true}
                                alphaTest={0.5}
                                depthWrite={false}
                            />
                        </mesh>
                    )}
                    {/* Sketch handle overlay (front) */}
                    <mesh position={[-0.357, 0.099, 0]}>
                        <planeGeometry args={[doorWidth, doorHeight]} />
                        <revealMaterial color="#e0e0e0"
                            ref={leftHandleMaterialRef}
                            map={handleLeftTexture}
                            transparent={true}
                            alphaTest={0.5}
                            depthWrite={false}
                            uProgress={0.0}
                        />
                    </mesh>
                </group>
            </group>

            {/* RIGHT DOOR */}
            <group ref={rightDoorRef} position={[doorWidth, doorCenterY, 0]}>
                {/* Solid 3D Door Body with edge texture */}
                <mesh
                    position={[-doorWidth / 2, 0, 0.06]}
                    onClick={handleClick}
                    onPointerEnter={handlePointerEnter}
                    onPointerLeave={handlePointerLeave}
                >
                    <boxGeometry args={[doorWidth, doorHeight, 0.04]} />
                    <meshBasicMaterial color="#e0e0e0" map={edgeTexture} roughness={0.9} />
                </mesh>

                {/* Painted layer (behind sketch) - revealed when sketch fades out on hover */}
                {!isMobile && (
                    <mesh position={[-doorWidth / 2, 0, 0.088]} raycast={() => null}>
                        <planeGeometry args={[doorWidth, doorHeight]} />
                        <meshBasicMaterial color="#e0e0e0"
                            map={doorRightPaintedTexture}
                            transparent={true}
                            alphaTest={0.5}
                            roughness={0.8}
                        />
                    </mesh>
                )}

                {/* Sketch overlay (front) - brush-stroke discard reveals painted beneath */}
                <mesh position={[-doorWidth / 2, 0, 0.09]} raycast={() => null}>
                    <planeGeometry args={[doorWidth, doorHeight]} />
                    <revealMaterial color="#e0e0e0"
                        ref={rightDoorMaterialRef}
                        map={doorRightTexture}
                        transparent={true}
                        alphaTest={0.5}
                        roughness={0.8}
                        depthWrite={false}
                        uProgress={0.0}
                    />
                </mesh>

                {/* Back Texture Face */}
                <mesh position={[-doorWidth / 2, 0, 0.03]} rotation={[0, Math.PI, 0]}>
                    <planeGeometry args={[doorWidth, doorHeight]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={doorBackTexture}
                        transparent={true}
                        alphaTest={0.5}
                        roughness={0.8}
                    />
                </mesh>

                {/* Handle Layer (animated) - pivot at screw center (40,459 on 332x848 texture) */}
                <group ref={rightHandleRef} position={[-doorWidth / 2 - 0.357, -0.099, 0.10]}>
                    {/* Painted handle (behind) - hidden until hover */}
                    {!isMobile && (
                        <mesh ref={rightHandlePaintedRef} position={[0.357, 0.09, -0.001]} visible={false}>
                            <planeGeometry args={[doorWidth, doorHeight]} />
                            <meshBasicMaterial color="#e0e0e0"
                                map={handleRightPaintedTexture}
                                transparent={true}
                                alphaTest={0.5}
                                depthWrite={false}
                            />
                        </mesh>
                    )}
                    {/* Sketch handle overlay (front) */}
                    <mesh position={[0.357, 0.099, 0]}>
                        <planeGeometry args={[doorWidth, doorHeight]} />
                        <revealMaterial color="#e0e0e0"
                            ref={rightHandleMaterialRef}
                            map={handleRightTexture}
                            transparent={true}
                            alphaTest={0.5}
                            depthWrite={false}
                            uProgress={0.0}
                        />
                    </mesh>
                </group>
            </group>

            {/* Warm lighting - WYLACZONE */}
            {/* <pointLight
                position={[0, doorBottomY + doorHeight + 1, 1]}
                intensity={0.8}
                color="#fff8e8"
                distance={10}
            /> */}
            {/* AVATAR - aligned with the window opening, behind the frame */}
            <mesh
                ref={windowAvatarRef}
                position={[2.5, 0, 0.18]}
                rotation={[0, 0, 0]}
            >
                <planeGeometry args={[1.5, 1.5]} />
                <meshBasicMaterial
                    ref={windowAvatarMaterialRef}
                    color="#e0e0e0"
                    map={avatarWindowTexture}
                    transparent={true}
                    opacity={0}
                    depthWrite={false}
                />
            </mesh>

            {/* WINDOW - positioned to the right of doors */}
            <group
                position={[2.5, 0, 0.1]}
                onPointerEnter={handleWindowEnter}
                onPointerLeave={handleWindowLeave}
            >
                {/* Explicit hitbox keeps the window interaction reliable over transparent art. */}
                <mesh
                    position={[0, 0, 0.42]}
                    onPointerEnter={handleWindowEnter}
                    onPointerLeave={handleWindowLeave}
                    onClick={(e) => e.stopPropagation()}
                    renderOrder={40}
                >
                    <planeGeometry args={[1.7, 1.7]} />
                    <meshBasicMaterial transparent opacity={0} depthTest={false} depthWrite={false} />
                </mesh>
                {/* Window Frame Sketch - in front of bricks */}
                <mesh position={[0, 0, 0.22]} renderOrder={35}>
                    <planeGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={windowSketchTexture}
                        transparent={true}
                        depthTest={false}
                        depthWrite={false}
                    />
                </mesh>
            </group>

            {/* DUCK POT (Right Side - Under Window) */}
            <group position={[2.5, floorY + 0.45, 0.4]}>
                {/* Pot texture */}
                <mesh>
                    <planeGeometry args={[3, 1.8]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={potTexture}
                        transparent={true}
                        alphaTest={0.01}
                        depthWrite={false}
                    />
                </mesh>

                {/* Invisible hitbox just for the duck (right side of pot) */}
                <mesh
                    position={[0.38, 0.1, 0.01]}
                    onClick={handleDuckClick}
                    onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
                    onPointerLeave={() => { document.body.style.cursor = "auto"; }}
                >
                    <planeGeometry args={[0.6, 0.6]} />
                    <meshBasicMaterial color="#e0e0e0" transparent opacity={0} />
                </mesh>

                {/* Speech Bubble */}
                <group
                    ref={speechBubbleRef}
                    position={[0.9, 0.8, 0.1]}
                    scale={[0, 0, 0]}
                >
                    <mesh>
                        <planeGeometry args={[1.8, 1.2]} />
                        <meshBasicMaterial color="#e0e0e0"
                            map={speechBubbleTexture}
                            transparent={true}
                            alphaTest={0.01}
                            depthWrite={false}
                        />
                    </mesh>

                    {/* Quote Text */}
                    {/* ROZMIAR TEKSTU: fontSize - mniejsza = mniejszy tekst */}
                    {/* ZAWIJANIE: maxWidth - mniejsza = wcześniejsze zawijanie */}
                    <Text
                        position={[0, 0.1, 0.01]}
                        fontSize={0.07}
                        color="#1a1a1a"
                        anchorX="center"
                        anchorY="middle"
                        font={FONT_URL}
                        maxWidth={1.4}
                        textAlign="center"
                        visible={isDuckSpeaking} // Toggle visibility instead of mounting/unmounting
                    >
                        {duckQuote || " "}
                    </Text>
                </group>
            </group>

            {/* ANIMATED BUG (Right Side - Above Window) */}
            {!isBugClicked && (
                <mesh
                    ref={bugRef}
                    position={[2.5, floorY + 2.8, 0.16]}
                    onClick={handleBugClick}
                    onPointerEnter={() => { document.body.style.cursor = "pointer"; }}
                    onPointerLeave={() => { document.body.style.cursor = "auto"; }}
                >
                    <planeGeometry args={[0.4, 0.4]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={bugTexture}
                        transparent={true}
                        alphaTest={0.01}
                        depthWrite={false}
                    />
                </mesh>
            )}

            {/* INK SPLASH - always mounted to preload texture/shader */}
            <mesh
                ref={inkSplashRef}
                position={[2.5, floorY + 2.8, 0.17]}
                scale={[0, 0, 0]}
            // Removed conditional 'visible' to ensure GPU upload
            >
                <planeGeometry args={[2, 2]} />
                <meshBasicMaterial color="#e0e0e0"
                    map={inkSplashTexture}
                    transparent={true}
                    alphaTest={0.01}
                    depthWrite={false}
                />
            </mesh>

            {/* BUG FIXED! Text - always mounted to preload font */}
            <Text
                ref={bugFixedTextRef}
                position={[2.5, floorY + 2.8, 0.35]} // Default pos, updated on click
                fontSize={0.25} // Increased size slightly for CabinSketch
                color="#1a1a1a"
                anchorX="center"
                anchorY="middle"
                font="/cartoon/fonts/CabinSketch-Bold.ttf"
                outlineWidth={0.015}
                outlineColor="#ffffff"
                clipRect={[-1, -0.5, -1 + (clipProgress * 2.5), 0.5]}
            >
                BUG FIXED!
            </Text>





            {/* TREE & MOUSE (Left Side) */}
            <group position={[-2.9, floorY + 2.7, 1]}>
                {/* Tree — renderOrder=20 so it draws BEFORE the wall sketches (renderOrder=30)
                    and stays cleanly behind the neural net / ai chip / etc. */}
                <mesh position={[0, 0, 0]} renderOrder={20}>
                    <planeGeometry args={[6, 8]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={treeTexture}
                        transparent={true}
                        alphaTest={0.05}
                        depthWrite={false}
                    />
                </mesh>
                {/* Mouse Hanging - Pivot Group for swinging */}
                {/* Pivot is moved UP by ~2.0 to be near the top of the string/branch */}
                {/* Original Mesh Y was 0.02. New Pivot Y is 0.02 + 2.0 = 2.02 */}
                {/* Mouse Hanging - Pivot Group for swinging */}
                {/* Pivot: 421, 597px. Offset relative to center: X=0.351, Y=-0.456 */}
                {/* Group Position shift: (-0.01, 0.02) + (0.351, -0.456) = (0.341, -0.436) */}
                <group ref={mousePivotRef} position={[0.341, 0.02 - 0.456, 0]}>
                    {/* Mesh moves opposite to pivot offset to keep visual position */}
                    <mesh position={[-0.351, 0.456, 0]} renderOrder={25}>
                        <planeGeometry args={[6, 8]} />
                        <meshBasicMaterial color="#e0e0e0"
                            map={mouseTexture}
                            transparent={true}
                            alphaTest={0.05}
                            depthWrite={false}
                        />
                    </mesh>
                </group>
            </group>

            {/* === SAVE BUTTON (entrance: doors + window) === */}
            {showEntranceSaveButton && (
                <Html
                    position={[0, wallCenterY + facadeYOffset + 3.4, 1.5]}
                    center
                    distanceFactor={8}
                    zIndexRange={[120, 0]}
                    style={{ pointerEvents: 'auto' }}
                >
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            handleEntranceSaveClick();
                        }}
                        style={{
                            pointerEvents: 'auto',
                            cursor: 'pointer',
                            fontFamily: '"Cabin Sketch", "Microsoft YaHei", "Comic Sans MS", sans-serif',
                            fontSize: '18px',
                            fontWeight: 700,
                            color: '#3a2a1a',
                            padding: '8px 18px',
                            border: '2px solid #6b4a2b',
                            borderRadius: '12px',
                            background: 'linear-gradient(180deg, #fff7e6 0%, #f4e3c1 100%)',
                            boxShadow: '0 4px 12px rgba(80,50,20,0.25), inset 0 0 0 2px rgba(255,255,255,0.6)',
                            letterSpacing: '0.12em',
                            textShadow: '0 1px 0 rgba(255,255,255,0.7)',
                            transform: 'translateZ(0) rotate(-1.5deg)',
                            transition: 'transform 120ms ease-out, box-shadow 120ms ease-out',
                            userSelect: 'none',
                            whiteSpace: 'nowrap',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateZ(0) rotate(-1.5deg) scale(1.06)';
                            e.currentTarget.style.boxShadow = '0 6px 18px rgba(80,50,20,0.35), inset 0 0 0 2px rgba(255,255,255,0.7)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateZ(0) rotate(-1.5deg)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(80,50,20,0.25), inset 0 0 0 2px rgba(255,255,255,0.6)';
                        }}
                    >
                        {savedEntranceId ? '↩ 取消保存' : '🖍 保存此刻'}
                    </button>
                </Html>
            )}

            {/* CAT SKETCH (Front Facing) */}
            <group position={[-1.5, floorY + 0.6, 0.8]} ref={catGroupRef}>
                {/* Body */}
                <mesh renderOrder={22}>
                    <planeGeometry args={[1.5, 1.5]} />
                    <meshBasicMaterial color="#e0e0e0"
                        map={catFrontBodyTexture}
                        transparent={true}
                        alphaTest={0.05}
                        depthWrite={false}
                    />
                </mesh>

                {/* Left Pupil */}
                <mesh
                    ref={leftPupilRef}
                    position={[-0.063, 0.27, -0.02]} // Behind cat
                >
                    <circleGeometry args={[0.020, 32]} />
                    <meshBasicMaterial color="black" />
                    {/* Oval Scale */}
                    <group scale={[0.8, 1.2, 1]} />
                </mesh>

                {/* Right Pupil */}
                <mesh
                    ref={rightPupilRef}
                    position={[0.0615, 0.27, -0.02]} // Behind cat
                >
                    <circleGeometry args={[0.020, 32]} />
                    <meshBasicMaterial color="black" />
                </mesh>
            </group>

        </group>
    );
};

export default EntranceDoors;
