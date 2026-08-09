/**
 * Studio Content Data — 森林·创作现场
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
        id: 'video-personal-site',
        platform: 'video',
        title: '个人站搭建全流程',
        description: '从零开始搭一个属于自己的个人站:结构、路由、上线。一个网站 · 项目案例,完整记录。',
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
        id: 'video-interactive-knowledge',
        platform: 'video',
        title: '互动知识课堂',
        description: '把课堂变成可以动手玩的知识现场:实时互动、即时反馈,学生不是在看,是在参与。',
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
        id: 'video-color-english',
        platform: 'video',
        title: '色彩英语 · AI 演示',
        description: '人工智能 + 英语课堂:用 AI 现场生成色彩单词卡片,孩子一边玩颜色一边学英语。',
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
        id: 'video-wechat-01',
        platform: 'video',
        title: '课堂实录 · 作品课',
        description: '微信视频号课堂实录:孩子们的作品上台时刻。每一届人走出教室时,手里都握着一样东西。',
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
        id: 'video-wechat-02',
        platform: 'video',
        title: '课堂实录 · 编程课',
        description: 'Python 课堂随拍:从一行代码到一份作品,学生互相看、互相改、互相鼓掌。',
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
        title: '抖音主页 · 关注森林老师',
        description: '持续分享课堂工具、学习资源与应用作品。点开跳转到抖音主页,看更多现场。',
        frontTexture: '/cartoon/media/qr/douyin.jpg',
        paintedFrontTexture: '/cartoon/media/qr/douyin.jpg',
        thumbnail: '/cartoon/media/qr/douyin.jpg',
        poster: '/cartoon/media/qr/douyin.jpg',
        videoSrc: '',
        url: 'https://www.douyin.com/user/MS4wLjABAAAAxHHFo-1JZJ3GPL_HYbgUo6X7hN5jWrk5wJUYl42rgW0',
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
