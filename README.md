# senlin-cartoon — 森林 · 卡通走廊个人站

森林(Senlin)个人站的 3D 卡通走廊版本:基于 ITom 手绘卡通模板,把 senlin-web 的
个人信息、教学方向、项目应用、作品视频、照片墙、联系方式全部迁移进 6 扇门。

在线预览:https://senlin-c1n.pages.dev/cartoon/

## 6 扇门(房间)

| 门 | URL | 内容 |
| --- | --- | --- |
| 关于我 | /cartoon/about | 森林故事:自我介绍、数字足迹 KPI、教学路线、技能清单 |
| 教学方向 | /cartoon/practice | Python · 项目式 / C++ · NOI/CSP / AI 课堂 / 机器人 / 教学现场 |
| 作品应用 | /cartoon/gallery | 7 个真实项目应用,点击卡片打开外链 |
| 创作现场 | /cartoon/studio | 5 段本地视频塔 + 抖音手机入口(外链跳转) |
| 掠影照片 | /cartoon/moments | 23 张真实照片圆柱塔 + 教室全景视频背景 |
| 联系我们 | /cartoon/contact | 微信(扫码)/ 抖音 / 邮件 / GitHub / 电话 / B站 |

## 技术栈

- Vite 7 + React 19 + React Router v7(base: /cartoon/)
- @react-three/fiber + @react-three/drei + three(3D 场景)
- GSAP(动画)、Sass(样式)
- sharp(图片转 webp)、ffmpeg(视频转码,脚本在 scripts/)

## 本地开发

```bash
cd senlin-cartoon
npm install
npm run dev        # http://localhost:5173/cartoon/
```

## 构建与部署(Cloudflare Pages)

```bash
npm run build      # 产物在 dist/
```

部署配置:

- 框架预设:None(Vite)
- 构建命令:npm install && npm run build
- 输出目录:dist
- 域名:https://senlin-c1n.pages.dev(项目已有,子路径 /cartoon/)
- public/_redirects 已配:/cartoon/* /cartoon/index.html 200,刷新/直达可用
- public/_headers 已配:assets/textures/fonts 一年缓存,media 7 天

## 素材来源与版权

- 图片 / 视频 / 二维码:来自 D:\kaifa_stu\senlin-web(森林本人原创课堂素材)
- 3 段微信视频:用户提供的课堂实录,已用 ffmpeg 转码压缩(720x1280,CRF28,均 ≤ 25MB)
- 手绘贴图 / 字体 / 音效:来自 ITom 卡通模板(模板授权范围内使用)
- 部署前请确认素材使用权与模板授权边界

## 关键实现说明

- 所有业务资源路径均带 /cartoon/ 前缀(vite base 只处理 index.html 与打包资源)
- Sanity/PostHog 已从代码中移除,数据全部本地静态
- 中文字体:ZCOOL 快乐体(ZCOOLKuaiLe-Regular.ttf),门牌/标题统一使用
- 抖音主页为外链跳转;微信桶点击弹出二维码大图
