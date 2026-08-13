import GalleryRoom from '../Gallery/GalleryRoom';

/**
 * 学习领域 · Practice
 * 复用衣架卡片翻转机制，展示 5 个学习领域
 * 教学现场 / Python / C++ / AI / 机器人
 */

const PRACTICE_PROJECTS = [
    {
        id: 'vibe-coding',
        title: 'AI 编程 · Vibe Coding',
        front: '/luomuchen2_____web-3D/media/scenes/ai-classroom-path.jpg',
        painted: '/luomuchen2_____web-3D/media/scenes/ai-classroom-path.jpg',
        url: '',
        description: '用自然语言和 AI 一起做项目：我说出我要什么，AI 帮我写代码，我检查效果，再让 AI 改。',
        techStack: []
    },
    {
        id: 'web-dev',
        title: '网站开发',
        front: '/luomuchen2_____web-3D/media/scenes/project-release-path.jpg',
        painted: '/luomuchen2_____web-3D/media/scenes/project-release-path.jpg',
        url: '',
        description: 'React + Vite + TypeScript 做过多页面网站，用 Cloudflare 发布上线。',
        techStack: []
    },
    {
        id: '3d-game',
        title: '3D 与游戏',
        front: '/luomuchen2_____web-3D/media/scenes/python-path.jpg',
        painted: '/luomuchen2_____web-3D/media/scenes/python-path.jpg',
        url: '',
        description: 'Three.js 做过太阳系、飞船视角和 5 阶段闯关游戏，喜欢让页面"动起来"。',
        techStack: []
    },
    {
        id: 'school-learning',
        title: '学校学习',
        front: '/luomuchen2_____web-3D/media/scenes/cpp-noi-path.jpg',
        painted: '/luomuchen2_____web-3D/media/scenes/cpp-noi-path.jpg',
        url: '',
        description: '文化课水平一般，但我在用 AI 做学习工具：背单词、做练习、整理错题。',
        techStack: []
    },
    {
        id: 'competition',
        title: '比赛与讲解',
        front: '/luomuchen2_____web-3D/media/gallery/wrc7.jpg',
        painted: '/luomuchen2_____web-3D/media/gallery/wrc7.jpg',
        url: '',
        description: '世界机器人大赛 2025 宜昌锦标赛冠军；会写作品介绍和讲解稿，能上台讲项目。',
        techStack: []
    },
];

const PracticeRoom = (props) => {
    return <GalleryRoom {...props} projects={PRACTICE_PROJECTS} tutorialId='practice_browse' />;
};

export default PracticeRoom;
