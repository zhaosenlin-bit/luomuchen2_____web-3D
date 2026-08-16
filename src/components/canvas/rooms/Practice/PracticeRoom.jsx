import GalleryRoom from '../Gallery/GalleryRoom';

/**
 * 教学方向 · Practice
 * 复用衣架卡片翻转机制，展示 5 个教学方向
 * 教学现场 / Python / C++ / AI / 机器人
 */

const PRACTICE_PROJECTS = [
    {
        id: 'vibe',
        title: 'Vibe Coding',
        front: '/cartoon/media/scenes/vibe-coding.jpg',
        painted: '/cartoon/media/scenes/vibe-coding.jpg',
        url: '',
        description: '用自然语言驱动 AI 编程。我的知识库、《宇宙探索者》网站都是这样做的——我描述想要的东西，AI 帮我写代码。',
        techStack: []
    },
    {
        id: 'web',
        title: '网站开发',
        front: '/cartoon/media/scenes/web-dev.jpg',
        painted: '/cartoon/media/scenes/web-dev.jpg',
        url: '',
        description: 'React + Vite + TypeScript 做的网站。《宇宙探索者》就是用这套技术栈做的，已经独立完成并发布上线。',
        techStack: []
    },
    {
        id: 'threeD',
        title: '3D · Three.js',
        front: '/cartoon/media/scenes/three-d.jpg',
        painted: '/cartoon/media/scenes/three-d.jpg',
        url: '',
        description: 'Three.js + WebGL 做的 3D 场景。这个知识库本身就是 3D 走廊,推门进入每个房间都能看到内容。',
        techStack: []
    },
    {
        id: 'game',
        title: '游戏设计',
        front: '/cartoon/media/scenes/game-design.jpg',
        painted: '/cartoon/media/scenes/game-design.jpg',
        url: '',
        description: '《宇宙探索者》里 5 阶段闯关游戏:先 2D 后 3D、先收集后躲避,让玩家有成就感。',
        techStack: []
    },
    {
        id: 'robot',
        title: '机器人',
        front: '/cartoon/media/scenes/robot.jpg',
        painted: '/cartoon/media/scenes/robot.jpg',
        url: '',
        description: 'Arduino + 拼装 + 调试,准备 2025 WRC 世界机器人大赛。目标是做一台能识别环境的智能小车。',
        techStack: []
    },
];

const PracticeRoom = (props) => {
    return <GalleryRoom {...props} projects={PRACTICE_PROJECTS} tutorialId='practice_browse' />;
};

export default PracticeRoom;
