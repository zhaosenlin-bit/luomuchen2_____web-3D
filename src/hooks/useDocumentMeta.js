import { useEffect, useRef } from 'react';
import { useScene } from '../context/SceneContext';

/**
 * useDocumentMeta — 虚拟路由 + 动态 meta
 * 页面部署于 Cloudflare Pages 的 /luomuchen2_____web-3D/ 子路径（可改 BASE）。
 */

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : '';
const BASE = '/cartoon';

const ROOM_META = {
    null: {
        path: BASE + '/',
        title: '骆沐辰 · Muchen Studio — 小创客个人站',
        description: '骆沐辰,一个热爱用 AI 编程做作品的小创客。Vibe Coding、网站开发、3D、游戏、机器人,还有我的 AI 学习知识库。',
    },
    about: {
        path: BASE + '/about',
        title: '关于我 · 骆沐辰',
        description: '我是骆沐辰,马上五年级的小创客。喜欢用 AI 编程做网站和游戏,参加过世界机器人大赛 2025 宜昌锦标赛并获得冠军。',
    },
    practice: {
        path: BASE + '/practice',
        title: '学习领域 · Vibe Coding / 网站 / 3D / 学校学习',
        description: '我长期在学的领域:AI 编程(Vibe Coding)、网站与游戏开发、3D 场景、项目发布,还有学校学习。',
    },
    gallery: {
        path: BASE + '/gallery',
        title: '我的作品 · 宇宙探索者 / 个人站 / 机器人比赛',
        description: '宇宙探索者网站+游戏、3D 卡通走廊个人站、2025 宜昌锦标赛冠军项目、电教馆信息素养提升活动。',
    },
    studio: {
        path: BASE + '/studio',
        title: '概念乐园 · 我学过的概念',
        description: 'Vibe Coding、Prompt、Context、Acceptance Criteria、Scrapling——一张概念卡一个知识点,还有好用的 Prompt 合集。',
    },
    moments: {
        path: BASE + '/moments',
        title: '每日记录 · 我的成长足迹',
        description: '我的学习记录与成长足迹:建知识库、做宇宙探索者、参加比赛,每一天都在进步。',
    },
    contact: {
        path: BASE + '/contact',
        title: '联系我 · 邮箱 / GitHub / 留言',
        description: '隐私红线:不公开手机号、家庭住址、身份证和学校班级。欢迎通过邮箱和留言和我交流。',
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
                    // URL already points to a deep link (e.g. /luomuchen2_____web-3D/about/) - mark room accordingly but don't change URL yet
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
