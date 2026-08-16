/**
 * Studio Content Data — 骆沐辰·创作讲解
 * 视频塔内容:5 段视频 + 抖音手机入口。
 * 每段视频:frontTexture 为横版缩略图,paintedFrontTexture 同图(无手绘变体),
 * videoSrc 指向本地 mp4,url 为外部跳转链接(可为空)。
 */

export const PLATFORM_CONFIG = {
    video: {
        color: '#4A90D9',
        accentColor: '#2d6cb5',
        icon: '▶',
        label: '视频',
        shape: 'tv', // Wide CRT style
    },
    douyin: {
        color: '#00F2EA',
        accentColor: '#FF0050',
        icon: '♪',
        label: '抖音',
        shape: 'phone', // Vertical phone
    },
};

const RAW_CONTENT_DATA = [
    {
        id: 'video-cosmic-explorer',
        platform: 'video',
        title: '宇宙探索者讲解',
        description: '我的代表作《宇宙探索者》讲解:3D 视图怎么做的、5 阶段游戏怎么设计、为什么用 React + Three.js。已经发布上线。',
        frontTexture: '/cartoon/media/thumbs/personal-site.webp',
        paintedFrontTexture: '/cartoon/media/thumbs/personal-site.webp',
        thumbnail: '/cartoon/media/thumbs/personal-site.webp',
        poster: '/cartoon/media/posters/personal-site.jpg',
        videoSrc: '/cartoon/media/videos/personal-site.mp4',
        url: '',
        date: '2026-03',
        views: '2.1k',
        duration: '01:24',
    },
    {
        id: 'video-solar-system',
        platform: 'video',
        title: '太阳系 3D 怎么做的',
        description: '3D 太阳系场景:行星轨道用真实开普勒定律、缩放旋转用 OrbitControls、UI 用 drei 的 Text。已经能点击任意行星看介绍。',
        frontTexture: '/cartoon/media/thumbs/interactive-knowledge.webp',
        paintedFrontTexture: '/cartoon/media/thumbs/interactive-knowledge.webp',
        thumbnail: '/cartoon/media/thumbs/interactive-knowledge.webp',
        poster: '/cartoon/media/posters/interactive-knowledge.jpg',
        videoSrc: '/cartoon/media/videos/interactive-knowledge.mp4',
        url: '',
        date: '2026-04',
        views: '1.6k',
        duration: '02:08',
    },
    {
        id: 'video-5-stage',
        platform: 'video',
        title: '5 阶段闯关游戏设计思路',
        description: '《宇宙探索者》里 5 阶段闯关游戏的设计思路:为什么先 2D 后 3D、为什么先收集后躲避、怎么让玩家有成就感。',
        frontTexture: '/cartoon/media/thumbs/color-english.webp',
        paintedFrontTexture: '/cartoon/media/thumbs/color-english.webp',
        thumbnail: '/cartoon/media/thumbs/color-english.webp',
        poster: '/cartoon/media/posters/color-english.jpg',
        videoSrc: '/cartoon/media/videos/color-english.mp4',
        url: '',
        date: '2026-05',
        views: '3.2k',
        duration: '01:47',
    },
    {
        id: 'video-vibe-coding',
        platform: 'video',
        title: 'Vibe Coding 怎么用',
        description: '我平时怎么用 Vibe Coding 写代码:先描述想要的东西、让 AI 生成、再手动改。这是这个知识库的诞生方式。',
        frontTexture: '/cartoon/media/thumbs/wechat-01.webp',
        paintedFrontTexture: '/cartoon/media/thumbs/wechat-01.webp',
        thumbnail: '/cartoon/media/thumbs/wechat-01.webp',
        poster: '/cartoon/media/gallery/wrc7.jpg',
        videoSrc: '/cartoon/media/videos/wechat-01.mp4',
        url: '',
        date: '2026-07',
        views: '980',
        duration: '01:45',
    },
    {
        id: 'video-wrc-recap',
        platform: 'video',
        title: 'WRC 2025 比赛回顾',
        description: '2025 宜昌世界机器人大赛复盘:从准备到上场、从答辩到拿奖,一台智能小车的诞生记。',
        frontTexture: '/cartoon/media/thumbs/wechat-02.webp',
        paintedFrontTexture: '/cartoon/media/thumbs/wechat-02.webp',
        thumbnail: '/cartoon/media/thumbs/wechat-02.webp',
        poster: '/cartoon/media/gallery/python-course.jpg',
        videoSrc: '/cartoon/media/videos/wechat-02.mp4',
        url: '',
        date: '2026-07',
        views: '760',
        duration: '00:55',
    },
    {
        id: 'douyin-home',
        platform: 'douyin',
        title: '抖音主页 · 关注骆沐辰',
        description: '持续分享我的 AI 编程日常、作品创作过程、比赛现场。点开跳转到抖音主页,看更多。',
        frontTexture: '/cartoon/media/qr/douyin.jpg',
        paintedFrontTexture: '/cartoon/media/qr/douyin.jpg',
        thumbnail: '/cartoon/media/qr/douyin.jpg',
        poster: '/cartoon/media/qr/douyin.jpg',
        videoSrc: '',
        url: 'https://www.douyin.com/',
        date: '持续更新',
        views: '1.2w',
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
