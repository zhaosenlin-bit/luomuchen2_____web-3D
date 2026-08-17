import React, { useState, useEffect } from 'react';
import { useAchievements, ACHIEVEMENTS } from '../../context/AchievementsContext';
import { ACHIEVEMENT_PAINT_MAP, PAINT_TARGET_LABEL } from '../../context/achievementPaintMap';
import '../../styles/AchievementsPanel.scss';

const AchievementsPanel = ({ isOpen, onClose }) => {
    const { completed, painted, paintAchievement } = useAchievements();
    const [justPaintedId, setJustPaintedId] = useState(null);

    // How many achievements the user has painted so far (used in the footer
    // and for the visual "已点亮" feedback).
    const paintedCount = painted ? painted.size : 0;
    const totalCount = Object.keys(ACHIEVEMENTS).length;

    // Clear the "just painted" highlight after the flash animation finishes.
    useEffect(() => {
        if (!justPaintedId) return;
        const t = setTimeout(() => setJustPaintedId(null), 1200);
        return () => clearTimeout(t);
    }, [justPaintedId]);

    // Click handler: paint, then show a celebration splash + row flash so the
    // user gets immediate feedback that the click did something.
    const handlePaintClick = (id) => {
        paintAchievement(id);
        setJustPaintedId(id);
    };

    return (
        <div className={`achievements-panel ${isOpen ? 'open' : ''}`} inert={!isOpen ? true : undefined}>
            <div className="achievements-card">
                <div className="achievements-header">
                    <h3>成就</h3>
                    <button
                        className="close-btn"
                        onClick={onClose}
                        aria-label="关闭成就面板"
                    >
                        <svg viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="achievements-list">
                    {Object.values(ACHIEVEMENTS).map((achievement) => {
                        const isUnlocked = completed.includes(achievement.id);
                        const isPainted = painted ? painted.has(achievement.id) : false;
                        const paintTarget = ACHIEVEMENT_PAINT_MAP[achievement.id];
                        const paintLabel = paintTarget
                            ? (PAINT_TARGET_LABEL[paintTarget.id] || '场景中某处')
                            : null;
                        return (
                            <div
                                key={achievement.id}
                                className={`achievement-item ${isUnlocked ? 'unlocked' : 'locked'} ${justPaintedId === achievement.id ? 'just-painted' : ''}`}
                            >
                                <div className="achievement-icon">
                                    {isUnlocked ? (
                                        <svg viewBox="0 0 24 24" className="icon-unlocked">
                                            <path d="M12 15l-3-3 1.4-1.4 1.6 1.6 4.6-4.6L18 9" fill="none" stroke="#1a1a1a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                            <circle cx="12" cy="12" r="10" fill="none" stroke="#1a1a1a" strokeWidth="2" />
                                        </svg>
                                    ) : (
                                        <svg viewBox="0 0 24 24" className="icon-locked">
                                            <rect x="7" y="11" width="10" height="8" rx="2" fill="none" stroke="#666" strokeWidth="2" />
                                            <path d="M9 11V8a3 3 0 0 1 6 0v3" fill="none" stroke="#666" strokeWidth="2" />
                                        </svg>
                                    )}
                                </div>
                                <div className="achievement-text">
                                    <div className="achievement-title">{achievement.title}</div>
                                    <div className="achievement-label">{achievement.label}</div>
                                </div>
                                {isUnlocked && paintTarget && (
                                    <div className="paint-toggle-wrap">
                                        <button
                                            type="button"
                                            className={`paint-toggle ${isPainted ? 'painted' : ''}`}
                                            onClick={() => handlePaintClick(achievement.id)}
                                            title={isPainted
                                                ? '已点亮 · 再点一下取消'
                                                : '点亮' + (paintLabel ? ' ' + paintLabel : '')}
                                        >
                                            {isPainted ? '✨ 已点亮' : '🖍 点亮一处颜色'}
                                        </button>
                                        {justPaintedId === achievement.id && (
                                            <span className="paint-toggle-splash" key={Date.now()}>🎨</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                <div className="achievements-footer">
                    <span>
                        {completed.length} / {totalCount} 已探索 · {paintedCount} 处已点亮
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AchievementsPanel;
