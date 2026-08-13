/**
 * Texture Preload List - full set for desktop, smaller core set for low-end/mobile entry
 */

// Entrance scene textures
export const ENTRANCE_TEXTURES = [
    // Core
    '/luomuchen2_____web-3D/textures/paper-texture.webp',
    // Doors
    '/luomuchen2_____web-3D/textures/doors/frame_sketch.webp',
    '/luomuchen2_____web-3D/textures/doors/door_left_sketch.webp',
    '/luomuchen2_____web-3D/textures/doors/door_right_sketch.webp',
    '/luomuchen2_____web-3D/textures/doors/handle_left_sketch.webp',
    '/luomuchen2_____web-3D/textures/doors/handle_right_sketch.webp',
    '/luomuchen2_____web-3D/textures/doors/door_back_left_sketch.webp',
    '/luomuchen2_____web-3D/textures/doors/pien.webp',
    // Environment
    '/luomuchen2_____web-3D/textures/entrance/wall_bricks_2.webp',
    '/luomuchen2_____web-3D/textures/entrance/stone-path.webp',
    '/luomuchen2_____web-3D/textures/entrance/floor_paper.webp',
    '/luomuchen2_____web-3D/textures/entrance/belka.webp',
    '/luomuchen2_____web-3D/textures/entrance/sign_muchen.webp',
    // Characters/Objects
    '/luomuchen2_____web-3D/textures/entrance/cat_front_body.webp',
    '/luomuchen2_____web-3D/textures/entrance/window_sketch.webp',
    '/luomuchen2_____web-3D/media/tech-sketches/window-avatar-handdrawn-cutout.png',
    '/luomuchen2_____web-3D/textures/entrance/tree_sketch.webp',
    '/luomuchen2_____web-3D/textures/entrance/mouse_hanging.webp',
    '/luomuchen2_____web-3D/textures/entrance/pot_with_duck.webp',
    '/luomuchen2_____web-3D/textures/entrance/bug_sketch.webp',
    '/luomuchen2_____web-3D/textures/entrance/speech_bubble.webp',
    '/luomuchen2_____web-3D/media/handdrawn-tech/entrance-ai-chip-doodle.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/entrance-terminal-doodle.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/entrance-neural-doodle.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/entrance-python-doodle.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/entrance-code-badge-doodle.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/entrance-avatar-badge-doodle.png',
    // Images
    '/luomuchen2_____web-3D/images/ink-splash.webp',
];

// Corridor core textures (used during the initial load on mobile/WeChat)
export const CORRIDOR_CORE_TEXTURES = [
    // Walls/Floor/Ceiling
    '/luomuchen2_____web-3D/textures/corridor/wall_texture.webp',
    '/luomuchen2_____web-3D/textures/corridor/kawalekpodlogi.webp',
    '/luomuchen2_____web-3D/textures/corridor/texturadoprogow.webp',
    '/luomuchen2_____web-3D/textures/corridor/texturadrewnadonozekbiurka.webp',
    '/luomuchen2_____web-3D/textures/corridor/ceiling_texture.webp',
    // Double doors (end of corridor)
    '/luomuchen2_____web-3D/textures/corridor/doors/frame_sketch.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/doorrleft.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/dorright.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/handle_left_sketch.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/handle_right_sketch.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/pien.webp',
    // Single side doors
    '/luomuchen2_____web-3D/textures/corridor/doors/ramkasingledoors.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/klamkadodrzwi.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/backsingledoors.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwiprojekty.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwisocial.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwiabout.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwikontakt.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwipractice.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwimoments.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwiprojekty_painted.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwisocial_painted.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwiabout_painted.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwikontakt_painted.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwipractice_painted.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/drzwimoments_painted.webp',
    // Signs
    '/luomuchen2_____web-3D/textures/corridor/pustatabliczka.webp',
    // DoorSection extras
    '/luomuchen2_____web-3D/textures/corridor/strzalka.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/door_back.webp',
    '/luomuchen2_____web-3D/textures/corridor/doors/klamkadodrzwi_painted.webp',
];

// Corridor scene textures
export const CORRIDOR_TEXTURES = [
    ...CORRIDOR_CORE_TEXTURES,
    // Decorations
    '/luomuchen2_____web-3D/textures/corridor/decorations/while_true_loop.webp',
    '/luomuchen2_____web-3D/textures/corridor/decorations/coffee_debug.webp',
    '/luomuchen2_____web-3D/textures/corridor/decorations/idea_process.webp',
    '/luomuchen2_____web-3D/textures/corridor/decorations/paper_ball.webp',
    '/luomuchen2_____web-3D/textures/corridor/decorations/paper_airplane.webp',
    '/luomuchen2_____web-3D/textures/corridor/decorations/pencil.webp',
    '/luomuchen2_____web-3D/textures/corridor/decorations/coffee_cup.webp',
    // CorridorDecorations - frames, furniture, lamps
    '/luomuchen2_____web-3D/textures/corridor/ramkanazdjecieduza.webp',
    '/luomuchen2_____web-3D/textures/corridor/ramkanazdjecieduza_painted.webp',
    '/luomuchen2_____web-3D/textures/corridor/ramkanazdjeciemala.webp',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-personal-site.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-ai-garden.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-code-castle.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-debug-notes.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-python-path.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-neural-constellation.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-robot-tutor.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-data-cloud.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-keyboard-music.png',
    '/luomuchen2_____web-3D/media/handdrawn-tech/frame-model-trainer.png',
    '/luomuchen2_____web-3D/textures/corridor/drzewkowdoniczce.webp',
    '/luomuchen2_____web-3D/textures/corridor/kratkawentylacyjna.webp',
    '/luomuchen2_____web-3D/textures/corridor/kwiatekwdoniczce.webp',
    '/luomuchen2_____web-3D/textures/corridor/kratanalampy.webp',
    '/luomuchen2_____web-3D/textures/corridor/bokilampy.webp',
    '/luomuchen2_____web-3D/textures/corridor/gorastolika.webp',
    '/luomuchen2_____web-3D/textures/corridor/szafkaprzod.webp',
    '/luomuchen2_____web-3D/textures/corridor/szafkaprzodgora.webp',
    '/luomuchen2_____web-3D/textures/corridor/rysuneknaobraz1.webp',
    '/luomuchen2_____web-3D/textures/corridor/rysuneknaobrazek3.webp',
];

// Standard HTML Image assets (preloaded via new Image() in App.jsx)
export const IMAGE_ASSETS = [
    '/luomuchen2_____web-3D/images/ink-splash.webp',
    '/luomuchen2_____web-3D/images/map.webp',
    '/luomuchen2_____web-3D/images/map_about_painted.webp',
    '/luomuchen2_____web-3D/images/map_contact_painted.webp',
    '/luomuchen2_____web-3D/images/map_gallery_painted.webp',
    '/luomuchen2_____web-3D/images/map_studio_painted.webp',
    '/luomuchen2_____web-3D/images/pin.webp',
    '/luomuchen2_____web-3D/images/pin-slot.webp',
];

// Additional textures from App.jsx and avatar animations
export const UI_TEXTURES = [
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

// ============================================
// ROOM TEXTURES - Preloaded for instant room entry
// ============================================

// Gallery Room textures (loaded via useTexture / drei)
// These are organized to handle conditional painted vs standard versions
export const GALLERY_TEXTURES_BASE = [
    '/luomuchen2_____web-3D/textures/gallery/floor.webp',
    '/luomuchen2_____web-3D/textures/gallery/railing.webp',
    '/luomuchen2_____web-3D/textures/gallery/domki.webp',
    '/luomuchen2_____web-3D/textures/gallery/miastotlo.webp',
    '/luomuchen2_____web-3D/textures/gallery/bird_gray.webp',
    '/luomuchen2_____web-3D/textures/gallery/klamerka.webp',
    '/luomuchen2_____web-3D/textures/gallery/openliveproject.webp',
];

export const GALLERY_TEXTURES_VERSIONED = [
    // Card back
    'tylkartki',
    'przyciskdotylukartki',
    // Tech stack logos
    'csslogo',
    'elementorlogo',
    'firebaselogo',
    'htmllogo',
    'jslogo',
    'netlifylogo',
    'phplogo',
    'reactlogo',
    'tailwindlogo',
    'wordpresslogo',
];

export const GALLERY_TEXTURES = [
    ...GALLERY_TEXTURES_BASE,
    ...GALLERY_TEXTURES_VERSIONED.flatMap(name => [
        `/luomuchen2_____web-3D/textures/gallery/${name}.webp`,
        name === 'csslogo' ? `/luomuchen2_____web-3D/textures/gallery/css3logo_painted.webp` : `/luomuchen2_____web-3D/textures/gallery/${name}_painted.webp`
    ]),
];

// Contact Room textures (loaded via useTexture / drei)
export const CONTACT_TEXTURES = [
    '/luomuchen2_____web-3D/textures/contact/faletopdown.webp',
    '/luomuchen2_____web-3D/textures/contact/molo.webp',
    '/luomuchen2_____web-3D/textures/contact/latarnia.webp',
    '/luomuchen2_____web-3D/textures/contact/statek.webp',
    '/luomuchen2_____web-3D/textures/contact/paper_form.webp',
    '/luomuchen2_____web-3D/textures/contact/send_button.webp',
    '/luomuchen2_____web-3D/textures/contact/beczka.webp',
    '/luomuchen2_____web-3D/textures/contact/beczka_painted.webp',
];

// About Room textures (loaded via useLoader(TextureLoader))
export const ABOUT_TEXTURES = [
    // Avatar
    '/luomuchen2_____web-3D/textures/about/awatarnachmurce.webp',
    '/luomuchen2_____web-3D/textures/about/muchen-avatar.webp',
    // Awards
    '/luomuchen2_____web-3D/textures/about/muchen-card-kb.webp',
    '/luomuchen2_____web-3D/textures/about/muchen-card-champion.webp',
    '/luomuchen2_____web-3D/textures/about/muchen-card-edu.webp',
    '/luomuchen2_____web-3D/textures/about/button.webp',
    '/luomuchen2_____web-3D/textures/about/button_painted.webp',
    // Award images (for overlay)
    // 荣誉卡图已换成 muchen-card-*（见上方）
    // Journey islands (real course photos)
    '/luomuchen2_____web-3D/textures/about/uowyspa.webp',
    '/luomuchen2_____web-3D/textures/about/freelancewyspa.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-3d.webp',
    '/luomuchen2_____web-3D/media/gallery/wrc7.jpg',
    // Skill balloons - large
    '/luomuchen2_____web-3D/textures/about/reactduzybalon.webp',
    '/luomuchen2_____web-3D/textures/about/reactduzybalon_painted.webp',
    '/luomuchen2_____web-3D/textures/about/threejsduzybalon.webp',
    '/luomuchen2_____web-3D/textures/about/threejsduzybalon_painted.webp',
    '/luomuchen2_____web-3D/textures/about/GSAPduzybalon.webp',
    '/luomuchen2_____web-3D/textures/about/GSAPduzybalon_painted.webp',
    // Skill balloons - medium
    '/luomuchen2_____web-3D/textures/about/JSSREDNIBALON.webp',
    '/luomuchen2_____web-3D/textures/about/JSSREDNIBALON_painted.webp',
    '/luomuchen2_____web-3D/textures/about/csssrednibalon.webp',
    '/luomuchen2_____web-3D/textures/about/csssrednibalon_painted.webp',
    '/luomuchen2_____web-3D/textures/about/nextjssrednibalon.webp',
    '/luomuchen2_____web-3D/textures/about/nextjssrednibalon_painted.webp',
    // Skill balloons - small
    '/luomuchen2_____web-3D/textures/about/htmlmalybalon.webp',
    '/luomuchen2_____web-3D/textures/about/htmlmalybalon_painted.webp',
    '/luomuchen2_____web-3D/textures/about/gitmalybalon.webp',
    '/luomuchen2_____web-3D/textures/about/gitmalybalon_painted.webp',
    '/luomuchen2_____web-3D/textures/about/figmamalybalon.webp',
    '/luomuchen2_____web-3D/textures/about/figmamalybalon_painted.webp',
    '/luomuchen2_____web-3D/textures/about/firebasemalybalon.webp',
    '/luomuchen2_____web-3D/textures/about/firebasemalybalon_painted.webp',
    // Clouds
    '/luomuchen2_____web-3D/textures/clouds/1131c3eb-dfae-423f-924b-ff39d8ccd6dc.webp',
    '/luomuchen2_____web-3D/textures/clouds/254b8ec8-d6f7-4275-956f-7bab65b2ce2d.webp',
    '/luomuchen2_____web-3D/textures/clouds/2cc88dd1-483c-466d-b07e-f8308c61ccbe.webp',
    '/luomuchen2_____web-3D/textures/clouds/5606fcc0-3252-447d-a58a-7bcbac73229a.webp',
    '/luomuchen2_____web-3D/textures/clouds/7882dc72-3d01-41fb-ac0e-d07b0184ebc1.webp',
    '/luomuchen2_____web-3D/textures/clouds/9b2ca72f-7bd0-473b-ba6e-dd9e0eb79d35.webp',
    '/luomuchen2_____web-3D/textures/clouds/c83293c6-d90c-4a32-8d9d-5ac9af7e2296.webp',
    '/luomuchen2_____web-3D/textures/clouds/f6e358bc-d27c-41dd-95f4-6787a835c41e.webp',
];

// Studio Room textures (loaded via useLoader(TextureLoader))
export const STUDIO_TEXTURES = [
    // Monitor (blog)
    '/luomuchen2_____web-3D/textures/studio/monitor_front.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_front_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_back.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_back_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_top.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_top_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_bottom.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_bottom_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_left.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_left_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_right.webp',
    '/luomuchen2_____web-3D/textures/studio/monitor_right_painted.webp',
    // TV (youtube)
    '/luomuchen2_____web-3D/textures/studio/tv_front.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_front_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_back.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_back_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_top.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_top_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_bottom.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_bottom_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_side.webp',
    '/luomuchen2_____web-3D/textures/studio/tv_side_painted.webp',
    // Phone (tiktok)
    '/luomuchen2_____web-3D/textures/studio/phone_front.webp',
    '/luomuchen2_____web-3D/textures/studio/phone_front_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/phone_back.webp',
    '/luomuchen2_____web-3D/textures/studio/phone_back_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/phone_side.webp',
    '/luomuchen2_____web-3D/textures/studio/phone_side_painted.webp',
    // 概念卡贴图
    '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp',
    '/luomuchen2_____web-3D/media/apps/concept-prompt.webp',
    '/luomuchen2_____web-3D/media/apps/concept-context.webp',
    '/luomuchen2_____web-3D/media/apps/concept-acceptance.webp',
    '/luomuchen2_____web-3D/media/apps/concept-scrapling.webp',
    '/luomuchen2_____web-3D/media/apps/concept-prompt-5day.webp',
    // Custom content front textures
    '/luomuchen2_____web-3D/textures/studio/monitorfront_postnafbdoublewinner.webp',
    '/luomuchen2_____web-3D/textures/studio/monitorfront_postnafbdoublewinner_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/phonefront_followmeontiktok.webp',
    '/luomuchen2_____web-3D/textures/studio/phonefront_followmeontiktok_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/tvfront_filmikedytowaniezdjec.webp',
    '/luomuchen2_____web-3D/textures/studio/tvfront_filmikedytowaniezdjec_painted.webp',
    '/luomuchen2_____web-3D/textures/studio/tvfront_filmikprojektdlamultiego.webp',
    '/luomuchen2_____web-3D/textures/studio/tvfront_filmikprojektdlamultiego_painted.webp',
];

// Moments Room textures (实拍照片)
export const MOMENTS_TEXTURES = [
    // 我的成长足迹（宇宙探索者截图 + 知识库 + 比赛占位）
    '/luomuchen2_____web-3D/media/moments/kb-home.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-3d.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-sun.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-planets-hover.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-moons.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-earth.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-saturn.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-dwarf.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-galaxies.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-gallery.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-blackhole.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-nebula.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-mission.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-stage3.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-dock.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-mercury.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-solar.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-homecard.webp',
    '/luomuchen2_____web-3D/media/moments/cosmic-check.webp',
    '/luomuchen2_____web-3D/media/gallery/wrc7.jpg',
    '/luomuchen2_____web-3D/media/apps/knowledge-base.webp',
    '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp',
    '/luomuchen2_____web-3D/images/map.webp',
];

// ============================================
// COMBINED EXPORTS
// ============================================

// Textures loaded via useTexture (drei) - entrance, corridor, UI, gallery, contact
export const PRELOAD_ALL = [
    ...ENTRANCE_TEXTURES,
    ...CORRIDOR_TEXTURES,
    ...UI_TEXTURES,
    ...GALLERY_TEXTURES,
    ...CONTACT_TEXTURES,
    ...MOMENTS_TEXTURES,
    ...IMAGE_ASSETS,
];


// Textures loaded via useLoader(TextureLoader) - about, studio
export const PRELOAD_LOADER = [
    ...ABOUT_TEXTURES,
    ...STUDIO_TEXTURES,
];

/**
 * Filters the preload list based on whether the device supports hover (desktop) 
 * or is a touch-only device (mobile/tablet).
 * @param {string[]} list The list of texture paths to filter
 * @param {boolean} usePainted Whether to prioritize _painted versions
 * @returns {string[]} The filtered list
 */
export const filterTexturesByDevice = (list, usePainted) => {
    // 1. Identify all paths that have a _painted version available
    const paintedVersions = new Set(list.filter(p => p.includes('_painted.webp')));
    
    // Also include the special css3logo case
    const hasCss3Painted = list.some(p => p.includes('css3logo_painted.webp'));
    
    return list.filter(path => {
        const isPainted = path.includes('_painted.webp');
        const isCss3 = path.includes('css3logo_painted.webp');
        
        // Find the "standard" version for this path if it's a painted one
        let standardVersion = null;
        if (isPainted) {
            standardVersion = path.replace('_painted.webp', '.webp');
        } else if (isCss3) {
            standardVersion = path.replace('css3logo_painted.webp', 'csslogo.webp');
        } else {
            // Check if this standard path HAS a painted version in the list
            const pVersion = path.replace('.webp', '_painted.webp');
            const css3Version = path.replace('csslogo.webp', 'css3logo_painted.webp');
            if (list.includes(pVersion) || (path.includes('csslogo.webp') && hasCss3Painted)) {
                // Return true to keep the standard version! Both desktop and mobile need it.
                return true; 
            }
            // If it doesn't have a painted version, it's a static texture (always keep)
            return true;
        }

        // It's a painted version
        return usePainted;
    });
};

