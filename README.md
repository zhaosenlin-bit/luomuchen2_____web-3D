# muchen-cartoon — 骆沐辰 · 卡通走廊个人站

骆沐辰个人站的 3D 卡通走廊版本：基于 ITom 手绘卡通模板，把「我的 AI 学习知识库」的内容全部迁移进 6 扇门。

## 6 扇门（房间）

| 门 | URL | 内容 |
| --- | --- | --- |
| 关于我 | /cartoon/about | 骆沐辰的故事：自我介绍、比赛荣誉、成长路线、能力清单 |
| 学习领域 | /cartoon/practice | AI 编程（Vibe Coding）/ 网站开发 / 3D 与游戏 / 学校学习 / 比赛与讲解 |
| 我的作品 | /cartoon/gallery | 宇宙探索者、个人站、世界机器人大赛、电教馆信息素养活动、知识库 |
| 概念乐园 | /cartoon/studio | 5 张概念卡（Vibe Coding / Prompt / Context / Acceptance Criteria / Scrapling）+ 5 天 Prompt 合集 |
| 每日记录 | /cartoon/moments | 我的成长足迹：建知识库、做作品、参加比赛，每天 3 句话 |
| 联系我 | /cartoon/contact | 邮箱 / GitHub / 知识库（隐私红线：不公开手机号、住址、学校班级） |

## 内容来源

- 全部内容来自骆沐辰的 AI 学习知识库：`D:\my lon\my-ai-learning`
- 作品截图来自《宇宙探索者》项目（`projects/骆驼/cosmic-explorer`）
- 知识库规则见 `AGENTS.md`：不编造经历、不写隐私信息

## 技术栈

- Vite 7 + React 19（base: /cartoon/）
- @react-three/fiber + @react-three/drei + three（3D 场景）
- GSAP（动画）、Sass（样式）

## 本地开发

```bash
npm install
npm run dev        # http://localhost:5173/cartoon/
```

## 构建与部署（Cloudflare Pages）

```bash
npm run build      # 产物在 dist/
```

- 构建命令：npm install && npm run build
- 输出目录：dist
- public/_redirects 已配：/cartoon/* /cartoon/index.html 200
- public/_headers 已配：assets/textures/fonts 一年缓存，media 7 天

## 待补充清单

- [ ] 宇宙探索者线上链接（部署后填进 `projects/cosmic-explorer.md` 和作品卡）
- [ ] 骆沐辰的专属邮箱 / GitHub 账号（填进「联系我」房间）
- [ ] 世界机器人大赛照片、电教馆活动内容
- [ ] 部署域名：部署后把新域名加进 `MessagePaper.jsx` 的 `ALLOWED_ORIGINS`，并给留言表单配 `VITE_WEB3FORMS_KEY`

## 素材来源与版权

- 手绘贴图 / 字体 / 音效：来自 ITom 卡通模板（模板授权范围内使用）
- 宇宙探索者截图：骆沐辰原创项目素材
- 部分示例贴图（门、房间场景）来自原 senlin_web-3D 模板，发布前请确认素材使用权
