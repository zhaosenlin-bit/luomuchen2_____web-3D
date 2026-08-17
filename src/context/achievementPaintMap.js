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
    corridor_enter:   { type: 'entrance', id: 'doors'  },
    corridor_explore: { type: 'entrance', id: 'window' },
    about_fly:        { type: 'frame',    id: 'frame-personal-site' },
    studio_interact:  { type: 'frame',    id: 'frame-ai-garden' },
    gallery_inspect:  { type: 'frame',    id: 'frame-code-castle' },
    contact_choose:   { type: 'frame',    id: 'frame-debug-notes' },
    moments_browse:   { type: 'frame',    id: 'frame-neural-constellation' },
    practice_browse:  { type: 'frame',    id: 'frame-robot-tutor' }
};

// Human-readable description shown next to the "点亮一处颜色" button so the
// user knows what they are about to paint.
export const PAINT_TARGET_LABEL = {
    'frame-personal-site':          '大门上的涂鸦',
    'frame-ai-garden':              'AI 花园的画框',
    'frame-code-castle':            '代码城堡的画框',
    'frame-debug-notes':            '调试笔记的画框',
    'frame-neural-constellation':   '神经星空的画框',
    'frame-robot-tutor':            '机器人老师的画框',
    doors:  '入口大门的手绘涂鸦',
    window: '入口窗户的猫猫头像'
};
