import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — 虚拟路由 + 动态 meta
 * 页面部署在 https://muchen-c1n.pages.dev/cartoon/ 子路径。
 */

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://muchen.codebn.cn';
const BASE = '/cartoon';

const ROOM_META = {
    null: {
        path: BASE + '/',
        title: '骆沐辰的知识库 | AI 编程小创客',
        description: '骆沐辰,即将升入五年级的小创客。喜欢用 AI 编程做宇宙、机器人、游戏的作品。代表作品《宇宙探索者》。',
    },
    about: {
        path: BASE + '/about',
        title: '关于沐辰 | 骆沐辰的知识库',
        description: '我是骆沐辰,即将升入五年级,2025 宜昌世界机器人大赛冠军,代表作《宇宙探索者》,喜欢 AI 编程和机器人。',
    },
    practice: {
        path: BASE + '/practice',
        title: '学习方向 | 骆沐辰的知识库',
        description: '我的五个 AI 编程方向:Vibe Coding · 网站开发 · 3D · 游戏 · 机器人。每一个方向都有上线作品。',
    },
    gallery: {
        path: BASE + '/gallery',
        title: '我的作品 | 骆沐辰的知识库',
        description: '《宇宙探索者》、太阳系 3D、5 阶段闯关游戏、知识库、个人站、WRC 2025 参赛、心理健康×科技 — 7 个上线作品。',
    },
    studio: {
        path: BASE + '/studio',
        title: '创作讲解 | 骆沐辰的知识库',
        description: '5 段创作讲解视频 + 抖音主页入口,讲清楚每个作品怎么想、怎么做、为什么这样做。',
    },
    moments: {
        path: BASE + '/moments',
        title: '成长掠影 | 骆沐辰的知识库',
        description: '23 张照片,记录比赛现场、上课日常、作品发布、跟同学老师在一起的瞬间。',
    },
    contact: {
        path: BASE + '/contact',
        title: '联系方式 | 骆沐辰的知识库',
        description: '我的抖音主页、微信公众号、邮箱、GitHub — 任何一种方式都能找到我。',
    },
};

// Map URL paths back to room IDs for deep linking
const PATH_TO_ROOM = {
    [BASE]: null,
    [BASE + '/']: null,
    [BASE + '/about']: 'about',
    [BASE + '/about/']: 'about',
    [BASE + '/practice']: 'practice',
    [BASE + '/practice/']: 'practice',
    [BASE + '/gallery']: 'gallery',
    [BASE + '/gallery/']: 'gallery',
    [BASE + '/studio']: 'studio',
    [BASE + '/studio/']: 'studio',
    [BASE + '/moments']: 'moments',
    [BASE + '/moments/']: 'moments',
    [BASE + '/contact']: 'contact',
    [BASE + '/contact/']: 'contact',
};

export function getInitialRoomFromUrl() {
    if (typeof window === 'undefined') return null;
    let path = window.location.pathname.replace(/\/+$/, '') || '\/';
    if (PATH_TO_ROOM[path] !== undefined) return PATH_TO_ROOM[path];
    if (path.startsWith(BASE)) {
        const stripped = path.slice(BASE.length) || '\/';
        if (PATH_TO_ROOM[stripped] !== undefined) return PATH_TO_ROOM[stripped];
    }
    return null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined);

    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = ROOM_META[roomKey] || ROOM_META['null'];

        document.title = meta.title;

        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', SITE_URL + meta.path);

        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', SITE_URL + meta.path);
        }

        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            if (lastPushedRoom.current === undefined) {
                const currentPath = window.location.pathname;
                const isAlreadyDeepLink = currentPath !== BASE && currentPath !== BASE + '\/' && currentPath !== '\/';
                if (isAlreadyDeepLink) {
                    lastPushedRoom.current = currentRoom;
                    return;
                }
                window.history.replaceState({ room: currentRoom }, '', meta.path);
            } else {
                window.history.pushState({ room: currentRoom }, '', meta.path);
            }
            lastPushedRoom.current = currentRoom;
        }

        isHandlingPopState.current = false;
    }, [currentRoom]);

    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom === null) {
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}
