// Mapping of unlocked achievement → scene element that can be "painted"
// (permanently shown in its hand-drawn color variant).
//
// Scene element types:
//   - 'frame'    : a picture frame in the corridor (id matches `frames[].id` in
//                  CorridorDecorations.jsx)
//   - 'entrance' : an interactive element at the entrance hall:
//                  - 'doors'  : the two main doors (reveal hand-drawn notes)
//                  - 'window' : the small window with the cat avatar
//
// The 'corridor_enter' / 'corridor_explore' achievements paint entrance
// elements, the rest paint a corridor frame that lives in the corresponding
// room. This way each achievement has its own meaningful visual reward.
export const ACHIEVEMENT_PAINT_MAP = {
    // The first two achievements are unlocked at the entrance. After the
    // user clicks through the doors they're already in the corridor, so
    // painting the (now behind them) entrance doors gives no immediate
    // visual reward. Instead, paint the first two frames in the corridor
    // — those are the closest frames to the camera when the user enters
    // and unlocks these achievements.
    corridor_enter:   { type: 'frame',    id: 'frame-personal-site' },
    corridor_explore: { type: 'frame',    id: 'frame-ai-garden' },

    // Remaining achievements are unlocked while the user is exploring the
    // corridor, so painting the corresponding room's frame gives an
    // immediate visual reward in the user's current field of view.
    about_fly:        { type: 'frame',    id: 'frame-code-castle' },
    studio_interact:  { type: 'frame',    id: 'frame-debug-notes' },
    gallery_inspect:  { type: 'frame',    id: 'frame-python-path' },
    contact_choose:   { type: 'frame',    id: 'frame-neural-constellation' },
    moments_browse:   { type: 'frame',    id: 'frame-robot-tutor' },
    practice_browse:  { type: 'frame',    id: 'frame-data-cloud' }
};

// Human-readable description shown next to the "点亮一处颜色" button so the
// user knows what they are about to paint.
export const PAINT_TARGET_LABEL = {
    'frame-personal-site':          '进入后的第一幅画',
    'frame-ai-garden':              'AI 花园的画框',
    'frame-code-castle':            '代码城堡的画框',
    'frame-debug-notes':            '调试笔记的画框',
    'frame-python-path':            'Python 小径的画框',
    'frame-neural-constellation':   '神经星空的画框',
    'frame-robot-tutor':            '机器人老师的画框',
    'frame-data-cloud':             '数据云的画框'
};
