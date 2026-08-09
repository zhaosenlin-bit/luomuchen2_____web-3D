import GalleryRoom from '../Gallery/GalleryRoom';

/**
 * 教学方向 · Practice
 * 复用衣架卡片翻转机制，展示 5 个教学方向
 * 教学现场 / Python / C++ / AI / 机器人
 */

const PRACTICE_PROJECTS = [
    {
        id: 'teaching',
        title: '教学现场',
        front: '/cartoon/media/gallery/4e7cde1d67137f31dbbaceea09b3ba97.jpg',
        painted: '/cartoon/media/gallery/4e7cde1d67137f31dbbaceea09b3ba97.jpg',
        url: '',
        description: '一个课堂、一块黑板、一位创作者。课堂里录影片、学生作品挂墙上，每次有人都上台。',
        techStack: []
    },
    {
        id: 'python',
        title: 'Python · 项目实战',
        front: '/cartoon/media/scenes/python-path.jpg',
        painted: '/cartoon/media/scenes/python-path.jpg',
        url: 'https://game.codebn.cn/',
        description: '从一行代码到一份作品。Python 入门像是一座一座小岛，每座岛上都有任务、有同伴、有可带走的作品。',
        techStack: []
    },
    {
        id: 'cpp',
        title: 'C++ · NOI / CSP',
        front: '/cartoon/media/scenes/cpp-noi-path.jpg',
        painted: '/cartoon/media/scenes/cpp-noi-path.jpg',
        url: '',
        description: '从爱好走向系统。从一道题、一次训练，走到能上台面的自己，从爱好到成就感。',
        techStack: []
    },
    {
        id: 'ai',
        title: '人工智能课堂',
        front: '/cartoon/media/scenes/ai-classroom-path.jpg',
        painted: '/cartoon/media/scenes/ai-classroom-path.jpg',
        url: 'https://ai.codebn.cn/',
        description: '让 AI 走下神坛，变成孩子工具箱里的一个工具。AI 走进课堂、与学生谈生活、现场展示与试验。',
        techStack: []
    },
    {
        id: 'robotics',
        title: '机器人',
        front: '/cartoon/media/gallery/wrc7.jpg',
        painted: '/cartoon/media/gallery/wrc7.jpg',
        url: '',
        description: '从一台机器到一场比赛。拼装、调试、上台。孩子学到的远不止是机器。',
        techStack: []
    },
];

const PracticeRoom = (props) => {
    return <GalleryRoom {...props} projects={PRACTICE_PROJECTS} tutorialId='practice_browse' />;
};

export default PracticeRoom;
