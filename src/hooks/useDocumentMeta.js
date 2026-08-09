import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — 虚拟路由 + 动态 meta
 * 页面部署于 https://senlin-c1n.pages.dev/cartoon/ 子路径。
 */

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://senlin.codebn.cn';
const BASE = '/cartoon';

const ROOM_META = {
    null: {
        path: BASE + '/',
        title: '森林 · Senlin Studio — 创意教育者个人站',
        description: '森林(Senlin),六年创意编程课堂的教育者。Python、C++、Web、AI 与机器人教学,陪学生从一行代码到一份作品。',
    },
    about: {
        path: BASE + '/about',
        title: '关于我 · 森林 Senlin',
        description: '我是森林,乐启享合伙人 · 副校长,六年项目式编程课堂经验,指导 1000+ 学生,上线 120+ 作品。',
    },
    practice: {
        path: BASE + '/practice',
        title: '教学方向 · Python / C++ / AI / 机器人',
        description: 'Python 项目式入门、C++ NOI/CSP 竞赛、AI 互动课堂、机器人比赛,每一门课都从作品出发。',
    },
    gallery: {
        path: BASE + '/gallery',
        title: '项目应用 · 森林作品集',
        description: 'Python 冒险岛、class 教学系统、AI 互动课堂、乐启享打字等 7 个项目应用,点击即可打开。',
    },
    studio: {
        path: BASE + '/studio',
        title: '创作现场 · 视频与作品',
        description: '个人站搭建全流程、互动知识课堂、色彩英语 AI 演示与课堂实录视频,还有抖音主页入口。',
    },
    moments: {
        path: BASE + '/moments',
        title: '掠影 · 照片墙',
        description: '六年教学现场的 23 张照片:课堂、比赛、工作坊与学生作品,教室全景视频背景。',
    },
    contact: {
        path: BASE + '/contact',
        title: '联系森林 · 微信 / 抖音 / 邮件 / GitHub',
        description: '微信扫码、抖音主页、邮件 zhaosenlin12@gmail.com、电话 13071210697、GitHub 与 B 站。',
    },
};

// Map URL paths back to room IDs for deep linking
const PATH_TO_ROOM = {
    // Full path keys
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

/**
 * Returns the room ID that the initial URL points to (for deep linking).
 * Call this once at app startup to determine if we need to auto-teleport.
 */
export function getInitialRoomFromUrl() {
    if (typeof window === 'undefined') return null;
    let path = window.location.pathname.replace(/\/+$/, '') || '\/';
    // Try direct lookup (full path with base)
    if (PATH_TO_ROOM[path] !== undefined) return PATH_TO_ROOM[path];
    // Try stripping base prefix
    if (path.startsWith(BASE)) {
        const stripped = path.slice(BASE.length) || '\/';
        if (PATH_TO_ROOM[stripped] !== undefined) return PATH_TO_ROOM[stripped];
    }
    return null;
}

export function useDocumentMeta() {
    const { currentRoom, teleportTo, hasEntered } = useScene();
    const isHandlingPopState = useRef(false);
    const lastPushedRoom = useRef(undefined); // Track what we last pushed to avoid duplicates

    // Update document meta and URL when room changes
    useEffect(() => {
        const roomKey = currentRoom === null ? 'null' : currentRoom;
        const meta = ROOM_META[roomKey] || ROOM_META['null'];

        // Update the page title
        document.title = meta.title;

        // Update meta description
        const descTag = document.querySelector('meta[name="description"]');
        if (descTag) {
            descTag.setAttribute('content', meta.description);
        }

        // Update OG meta tags
        const ogTitle = document.querySelector('meta[property="og:title"]');
        if (ogTitle) ogTitle.setAttribute('content', meta.title);

        const ogDesc = document.querySelector('meta[property="og:description"]');
        if (ogDesc) ogDesc.setAttribute('content', meta.description);

        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl) ogUrl.setAttribute('content', SITE_URL + meta.path);

        // Update canonical link to ensure virtual routes are correctly indexable as separate pages
        const canonicalTag = document.querySelector('link[rel="canonical"]');
        if (canonicalTag) {
            canonicalTag.setAttribute('href', SITE_URL + meta.path);
        }

        // Push to browser history (only if not handling a popstate event and room actually changed)
        if (!isHandlingPopState.current && lastPushedRoom.current !== currentRoom) {
            // Use replaceState for the very first load, pushState for subsequent navigations
            if (lastPushedRoom.current === undefined) {
                // First load: only replace URL if current URL doesn't already point to a valid deep link
                const currentPath = window.location.pathname;
                const isAlreadyDeepLink = currentPath !== BASE && currentPath !== BASE + '/' && currentPath !== '/';
                if (isAlreadyDeepLink) {
                    // URL already points to a deep link (e.g. /cartoon/about/) - mark room accordingly but don't change URL yet
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

    // Handle browser back/forward buttons
    useEffect(() => {
        const handlePopState = (event) => {
            isHandlingPopState.current = true;
            const targetRoom = event.state?.room ?? null;
            lastPushedRoom.current = targetRoom;

            if (targetRoom === null) {
                // Going back to corridor — update meta immediately
                const meta = ROOM_META['null'];
                document.title = meta.title;
            } else if (hasEntered) {
                // Teleport to the target room
                teleportTo(targetRoom);
            }
        };

        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, [teleportTo, hasEntered]);
}
