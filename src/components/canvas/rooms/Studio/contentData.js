/**
 * Studio Content Data — 骆沐辰 · 概念乐园
 * 显示器塔内容:5 张概念卡 + 1 张 Prompt 卡。
 * 每段视频:frontTexture 为横版缩略图,paintedFrontTexture 同图(无手绘变体),
 * videoSrc 指向本地 mp4,url 为外部跳转链接(可为空)。
 */

export const PLATFORM_CONFIG = {
    video: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '✦',
        label: '概念卡',
        shape: 'tv', // Wide CRT style
    },
    douyin: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '✎',
        label: 'Prompt',
        shape: 'phone', // Vertical phone
    },
};

const RAW_CONTENT_DATA = [
    {
        id: 'concept-vibe-coding',
        platform: 'video',
        title: 'Vibe Coding',
        description: '用自然语言和 AI 一起做项目：我说出我要什么，AI 帮我写代码，我检查效果，再让 AI 改。',
        frontTexture: '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp',
        paintedFrontTexture: '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp',
        thumbnail: '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp',
        poster: '/luomuchen2_____web-3D/media/apps/concept-vibe-coding.webp',
        videoSrc: '',
        url: '',
        date: '2026-08',
        views: '',
        duration: '—',
    },
    {
        id: 'concept-prompt',
        platform: 'video',
        title: 'Prompt',
        description: '给 AI 的任务说明：目标、背景、内容结构、风格、约束、验收标准。说清楚，AI 一次做对。',
        frontTexture: '/luomuchen2_____web-3D/media/apps/concept-prompt.webp',
        paintedFrontTexture: '/luomuchen2_____web-3D/media/apps/concept-prompt.webp',
        thumbnail: '/luomuchen2_____web-3D/media/apps/concept-prompt.webp',
        poster: '/luomuchen2_____web-3D/media/apps/concept-prompt.webp',
        videoSrc: '',
        url: '',
        date: '2026-08',
        views: '',
        duration: '—',
    },
    {
        id: 'concept-context',
        platform: 'video',
        title: 'Context',
        description: 'AI 做任务需要的背景。背景越多，AI 越懂我，做出来的东西越像我的。',
        frontTexture: '/luomuchen2_____web-3D/media/apps/concept-context.webp',
        paintedFrontTexture: '/luomuchen2_____web-3D/media/apps/concept-context.webp',
        thumbnail: '/luomuchen2_____web-3D/media/apps/concept-context.webp',
        poster: '/luomuchen2_____web-3D/media/apps/concept-context.webp',
        videoSrc: '',
        url: '',
        date: '2026-08',
        views: '',
        duration: '—',
    },
    {
        id: 'concept-acceptance',
        platform: 'video',
        title: 'Acceptance Criteria',
        description: '判断任务有没有完成的标准。开始前写清楚"怎样算完成"，做完后一条一条打勾。',
        frontTexture: '/luomuchen2_____web-3D/media/apps/concept-acceptance.webp',
        paintedFrontTexture: '/luomuchen2_____web-3D/media/apps/concept-acceptance.webp',
        thumbnail: '/luomuchen2_____web-3D/media/apps/concept-acceptance.webp',
        poster: '/luomuchen2_____web-3D/media/apps/concept-acceptance.webp',
        videoSrc: '',
        url: '',
        date: '2026-08',
        views: '',
        duration: '—',
    },
    {
        id: 'concept-scrapling',
        platform: 'video',
        title: 'Scrapling',
        description: 'Python 网页抓取工具，把网页内容抓下来变成可用的资料。做项目抓真实资料就靠它。',
        frontTexture: '/luomuchen2_____web-3D/media/apps/concept-scrapling.webp',
        paintedFrontTexture: '/luomuchen2_____web-3D/media/apps/concept-scrapling.webp',
        thumbnail: '/luomuchen2_____web-3D/media/apps/concept-scrapling.webp',
        poster: '/luomuchen2_____web-3D/media/apps/concept-scrapling.webp',
        videoSrc: '',
        url: '',
        date: '2026-08',
        views: '',
        duration: '—',
    },
    {
        id: 'prompt-5day',
        platform: 'douyin',
        title: '5 天 Prompt 合集',
        description: '做项目直接套：Day1 首页 → Day2 3D 探索 → Day3 任务游戏 → Day4 内容风格 → Day5 优化发布。',
        frontTexture: '/luomuchen2_____web-3D/media/apps/concept-prompt-5day.webp',
        paintedFrontTexture: '/luomuchen2_____web-3D/media/apps/concept-prompt-5day.webp',
        thumbnail: '/luomuchen2_____web-3D/media/apps/concept-prompt-5day.webp',
        poster: '/luomuchen2_____web-3D/media/apps/concept-prompt-5day.webp',
        videoSrc: '',
        url: '',
        date: '2026-08',
        views: '',
        duration: '—',
    },
];

export const CONTENT_DATA = RAW_CONTENT_DATA;

// Helper to get content by platform
export const getContentByPlatform = (platform) => {
    if (platform === 'all') return CONTENT_DATA;
    return CONTENT_DATA.filter(item => item.platform === platform);
};

// Get latest content (for "On Air" indicator)
export const getLatestContent = () => {
    return CONTENT_DATA[0];
};
