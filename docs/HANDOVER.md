# 室内地图项目 — 交接文档

> 版本：v0.1（Mock 数据阶段）  
> 最后更新：2026-07-06  
> 关联文档：[需求说明](../dev.md) · [接口文档](./API_TODO.md)

---

## 目录

1. [项目概述](#1-项目概述)
2. [技术栈与运行方式](#2-技术栈与运行方式)
3. [目录结构说明](#3-目录结构说明)
4. [核心架构与数据流](#4-核心架构与数据流)
5. [关键概念](#5-关键概念)
6. [文档索引与维护规则](#6-文档索引与维护规则)
7. [常见改动场景（改哪里 / 怎么改 / 改哪些文档）](#7-常见改动场景)
8. [对接真实后端指南](#8-对接真实后端指南)
9. [样式与 UI 定制](#9-样式与-ui-定制)
10. [已知限制与后续规划](#10-已知限制与后续规划)

---

## 1. 项目概述

本项目是一个基于 **React + Leaflet** 的室内地图前端应用，用于在 CAD 建筑平面图上展示：

- **位置层级**：项目 → 建筑 → 楼层 → 房间（树形结构）
- **区域标注**：楼层上的房间区域（多边形），点击可下钻到房间平面图
- **设备标注**：机器人 / 摄像头 / IoT 设备（三大类），支持按类型前端筛选
- **像素坐标系**：所有坐标基于底图像素尺寸，原点为左上角

当前阶段 **全部数据为前端 Mock**，无真实后端接口。Mock 层设计为可替换，对接后端时只需改 `src/api/` 层，UI 组件无需大改。

---

## 2. 技术栈与运行方式

| 项目 | 版本/说明 |
|------|-----------|
| React | 19.x |
| Vite | 8.x |
| Leaflet | 1.9.x |
| react-leaflet | 5.x |
| 坐标系 | `L.CRS.Simple`（像素坐标，非经纬度） |

### 常用命令

```bash
# 安装依赖
npm install

# 本地开发（默认 http://localhost:5173）
npm run dev

# 生产构建
npm run build

# 预览构建产物
npm run preview

# 代码检查
npm run lint
```

### 静态资源

| 文件 | 路径 | 用途 | 尺寸 |
|------|------|------|------|
| 楼层底图 | `assets/map.png` | 楼层平面图 | 1920 × 1080 |
| 房间底图 | `assets/zoom.png` | 房间平面图 | 403 × 326 |
| UI 参考稿 | `assets/建筑楼层树形结构数据筛选框.png` | 位置筛选器设计参考 | — |
| UI 参考稿 | `assets/设备筛选框.png` | 设备筛选器设计参考 | — |

> 底图通过 Vite `import` 引入（见 `mockData.js`），构建时会自动 hash 并输出到 `dist/assets/`。

---

## 3. 目录结构说明

```
map/
├── dev.md                          # 原始需求说明（只读参考，勿删）
├── docs/
│   ├── API_TODO.md                 # Mock 接口规范 & 后端对接 TODO
│   └── HANDOVER.md                 # 本文档
├── assets/                         # 原始图片资源（底图、UI 参考稿）
├── src/
│   ├── main.jsx                    # 入口：挂载 React、引入 Leaflet CSS
│   ├── App.jsx                     # 页面布局：Header + 筛选器 + 地图
│   ├── App.css                     # 主样式（暗色主题、筛选器、Marker 等）
│   ├── index.css                   # 全局 reset
│   │
│   ├── api/
│   │   └── mockApi.js              # ★ 模拟接口层（对接后端时主要改这里）
│   │
│   ├── data/
│   │   └── mockData.js             # ★ 模拟数据（树形结构、区域、设备）
│   │
│   ├── hooks/
│   │   └── useMapApp.js            # ★ 应用状态管理（当前节点、筛选、加载）
│   │
│   ├── components/
│   │   ├── FloorMap.jsx            # Leaflet 地图容器
│   │   ├── MapResizer.jsx          # 地图尺寸自适应
│   │   ├── RegionOverlay.jsx       # 区域多边形层
│   │   ├── DeviceMarkers.jsx       # 设备 Marker 层
│   │   ├── LocationFilter.jsx      # 右上角 — 位置树筛选
│   │   └── DeviceFilter.jsx        # 右上角 — 设备类型筛选
│   │
│   └── utils/
│       ├── coordinates.js          # 像素坐标 ↔ Leaflet 坐标转换
│       ├── deviceIcons.js          # 设备图标、状态颜色
│       └── deviceHandlers.js       # 设备点击事件（当前为占位）
│
├── index.html
├── vite.config.js
├── eslint.config.js
└── package.json
```

**★ 标记的文件是后续改动最频繁的位置。**

---

## 4. 核心架构与数据流

```
┌─────────────────────────────────────────────────────────────┐
│  App.jsx                                                    │
│  ├─ useMapApp()          ← 状态中心                          │
│  ├─ LocationFilter       ← 位置树筛选                        │
│  ├─ DeviceFilter         ← 设备类型筛选（纯前端）              │
│  └─ FloorMap             ← Leaflet 地图                       │
│       ├─ ImageOverlay    ← 底图                             │
│       ├─ RegionOverlay   ← 区域多边形 + 下钻按钮              │
│       └─ DeviceMarkers   ← 设备 Marker + Popup              │
└─────────────────────────────────────────────────────────────┘
         │                              │
         ▼                              ▼
   mockApi.js                      mockData.js
   (模拟 HTTP 请求)                 (静态 JSON 数据)
```

### 状态流转

1. **初始化**：`useMapApp` 调用 `fetchLocationTree()` 获取树 → 默认加载 `building-a-1f` 楼层地图
2. **切换位置**（筛选器 / 面包屑 / 区域点击）→ 调用 `fetchMapDetail(nodeId)` → 更新 `currentNode`（底图 + 区域 + 设备）
3. **设备筛选**：仅修改 `deviceFilter` 状态 → `DeviceMarkers` 组件内部过滤，**不重新请求数据**
4. **设备点击**：`DeviceMarkers` → `handleDeviceClick()` → 当前输出到 Console（占位）

### 核心 Hook 返回值

`useMapApp()` 返回：

| 字段 | 类型 | 说明 |
|------|------|------|
| `tree` | MapNode | 完整位置树 |
| `currentNode` | MapNode | 当前地图详情（含 mapImage/regions/devices） |
| `currentNodeId` | string | 当前节点 ID |
| `deviceFilter` | string | 设备筛选值：`all` / `robot` / `camera` / `iot` |
| `loading` | boolean | 地图加载中 |
| `setCurrentNodeId` | fn | 切换位置（= navigateToNode） |
| `setDeviceFilter` | fn | 切换设备筛选 |
| `navigateToNode` | fn | 导航到指定节点（区域点击也用此函数） |

---

## 5. 关键概念

### 5.1 像素坐标系

- 原点 `(0, 0)` 在图片**左上角**，X 向右，Y 向下
- 后端/ CAD 导出的坐标应与此一致
- Leaflet `CRS.Simple` 中坐标格式为 `[y, x]`（lat=y, lng=x）

转换工具在 `src/utils/coordinates.js`：

```javascript
// 像素 [x, y] → Leaflet [y, x]
pixelToLatLng([280, 350])  // → [350, 280]

// 地图边界（基于图片尺寸）
getMapBounds({ width: 1920, height: 1080 })
// → [[0, 0], [1080, 1920]]
```

**⚠️ 注意**：如果后端坐标系不同（例如 Y 轴向上），需在 `coordinates.js` 中增加转换，而不是在每个组件里单独处理。

### 5.2 位置树节点类型

| type | 说明 | 是否有底图 | 是否可选中 |
|------|------|-----------|-----------|
| `project` | 项目根节点 | 否 | 否 |
| `building` | 建筑 | 否 | 否 |
| `floor` | 楼层 | 是 | 是 |
| `room` | 房间 | 是 | 是 |

只有 `floor` 和 `room` 类型的节点可以：
- 在筛选器中被选中
- 作为地图渲染的目标
- 拥有 `regions`（区域）和 `devices`（设备）

### 5.3 设备数据结构

```javascript
{
  id: 'dev-1f-r01',           // 唯一 ID
  name: 'Delivery Bot-01',    // 显示名称
  category: 'robot',          // 大类：robot | camera | iot
  subtype: 'delivery_robot',  // 子类型（见 deviceSubtypes）
  status: 'running',          // 状态（因 category 而异）
  position: [280, 350],       // 像素坐标 [x, y]
}
```

### 5.4 区域数据结构

```javascript
{
  id: 'region-lobby-a',
  name: 'Lobby A',
  targetNodeId: 'lobby-a',    // 点击后跳转的 room 节点 ID
  polygon: [                  // 多边形顶点（像素坐标）
    [120, 180], [120, 720], [520, 720], [520, 180]
  ],
  labelPosition: [320, 450],  // 标签按钮位置（可选，当前未使用）
}
```

---

## 6. 文档索引与维护规则

| 文档 | 路径 | 用途 | 何时需要更新 |
|------|------|------|-------------|
| 需求说明 | `dev.md` | 原始产品需求 | 需求变更时由产品更新 |
| 接口文档 | `docs/API_TODO.md` | Mock 接口规范、字段说明、对接 TODO | 数据结构变更、新增接口、对接后端时 |
| 交接文档 | `docs/HANDOVER.md` | 架构说明、改动指南 | 架构变更、新增模块、重要逻辑变更时 |
| README | `README.md` | 项目简介（如有） | 首次部署、变更启动方式时 |

### 文档维护原则

> **改代码 → 同步改文档。** 至少更新 `API_TODO.md` 或 `HANDOVER.md` 中与改动相关的章节。

| 改动类型 | 必须更新的文档 |
|----------|---------------|
| 新增/修改 Mock 数据字段 | `API_TODO.md` 字段说明 |
| 新增/修改 API 函数 | `API_TODO.md` 接口章节 + `HANDOVER.md` 第 7 节 |
| 新增设备类型/状态 | `API_TODO.md` 状态枚举 + `HANDOVER.md` 场景表 |
| 新增 UI 组件/模块 | `HANDOVER.md` 目录结构 + 架构图 |
| 对接真实后端 | `API_TODO.md` 勾选 TODO + `HANDOVER.md` 第 8 节 |
| 变更坐标系/底图逻辑 | `HANDOVER.md` 第 5.1 节 + `API_TODO.md` 字段说明 |

---

## 7. 常见改动场景

以下每个场景包含：**改哪些文件 → 怎么改 → 改哪些文档**。

---

### 场景 1：新增一个建筑 / 楼层 / 房间

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/data/mockData.js` | 在 `locationTree` 中添加节点 |
| `assets/` | 如有新底图，放入此目录 |

**怎么改：**

在 `locationTree` 对应层级添加节点。以新增 `Building B` 的 `1F` 为例：

```javascript
// src/data/mockData.js
{
  id: 'building-b',
  name: 'Building B',
  type: 'building',
  children: [
    {
      id: 'building-b-1f',
      name: '1F',
      type: 'floor',
      mapImage: floorMapImage,          // import 底图
      mapSize: { width: 1920, height: 1080 },  // 必须与底图实际尺寸一致
      regions: [ /* 区域数组 */ ],
      devices: [ /* 设备数组 */ ],
      children: [ /* 房间节点 */ ],
    },
  ],
}
```

**改哪些文档：**

- `docs/API_TODO.md` → 更新响应示例中的树结构
- 无需改 `HANDOVER.md`（除非层级规则本身变化）

---

### 场景 2：新增或修改区域（房间多边形）

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/data/mockData.js` | 修改对应 floor 节点的 `regions` 数组 |
| `src/data/mockData.js` | 确保 `targetNodeId` 对应 children 中的 room 节点 ID |

**怎么改：**

1. 用图像编辑器或 CAD 工具确定多边形顶点像素坐标
2. 添加到 floor 节点的 `regions`：

```javascript
regions: [
  {
    id: 'region-new-room',           // 唯一 ID
    name: 'New Room',                // 显示在按钮上的名称
    targetNodeId: 'new-room',        // 必须匹配 children 中 room 的 id
    polygon: [
      [x1, y1], [x2, y2], [x3, y3], [x4, y4]  // 顺时针或逆时针
    ],
  },
]
```

3. 在 `children` 中添加对应 room 节点（见场景 1）

**调试技巧：**

- 坐标不准时，可临时在 `RegionOverlay.jsx` 中把 `fillOpacity` 调大到 `0.5` 方便对齐
- 浏览器 DevTools Console 中可打印 `map.getBounds()` 确认坐标范围

**改哪些文档：**

- `docs/API_TODO.md` → 更新 regions 字段示例

---

### 场景 3：新增或修改设备

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/data/mockData.js` | 在对应 floor/room 的 `devices` 数组中添加/修改 |
| `src/utils/deviceIcons.js` | 如有新 status，添加颜色映射 |
| `src/utils/deviceHandlers.js` | 如有新 status，添加点击行为 |

**怎么改：**

```javascript
// 在 floor 或 room 节点的 devices 数组中添加：
{
  id: 'dev-unique-id',
  name: 'Device Name',
  category: 'robot',        // robot | camera | iot
  subtype: 'delivery_robot',  // 见 deviceSubtypes
  status: 'running',          // 见下方状态表
  position: [400, 300],       // 像素坐标 [x, y]
}
```

**各 category 可用 status：**

| category | 可用 status |
|----------|------------|
| robot | `idle`, `running`, `charging`, `error` |
| camera | `online`, `offline`, `recording`, `maintenance` |
| iot | `normal`, `warning`, `alarm`, `offline` |

**改哪些文档：**

- `docs/API_TODO.md` → 更新 devices 示例 + 状态枚举表

---

### 场景 4：新增设备大类（如 `access` 门禁类）

这是跨多文件的改动，需按顺序进行：

**Step 1 — 数据层**

| 文件 | 改动 |
|------|------|
| `src/data/mockData.js` | `DeviceCategory` typedef 添加新类型；`deviceFilterOptions` 添加选项；`deviceSubtypes` 添加子类型 |

**Step 2 — 筛选 UI**

| 文件 | 改动 |
|------|------|
| `src/components/DeviceFilter.jsx` | `OPTIONS` 数组添加新选项；`FILTER_ICONS` 添加图标 |

**Step 3 — 图标与样式**

| 文件 | 改动 |
|------|------|
| `src/utils/deviceIcons.js` | `CATEGORY_ICONS` 添加 SVG；`STATUS_COLORS` 添加新状态颜色；`getStatusLabel` 添加标签 |

**Step 4 — 点击事件**

| 文件 | 改动 |
|------|------|
| `src/utils/deviceHandlers.js` | 添加 `handleXxxClick` 函数；在 `handleDeviceClick` 中注册 |

**Step 5 — 筛选逻辑**

| 文件 | 改动 |
|------|------|
| `src/components/DeviceMarkers.jsx` | 无需改动（按 `category` 过滤，自动支持） |

**改哪些文档：**

- `docs/API_TODO.md` → 新增 category 枚举、子类型、状态表、筛选选项
- `docs/HANDOVER.md` → 更新场景 3/4 的状态表

---

### 场景 5：新增设备子类型

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/data/mockData.js` | `deviceSubtypes` 对应 category 下添加 |

**怎么改：**

```javascript
// src/data/mockData.js
export const deviceSubtypes = {
  robot: [
    // ...existing
    { id: 'new_subtype', label: 'New Subtype Label' },
  ],
}
```

子类型只影响 Popup 中显示的标签文本，不影响图标和筛选。

**改哪些文档：**

- `docs/API_TODO.md` → 更新 subtypes 响应示例

---

### 场景 6：实现设备点击业务逻辑

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/utils/deviceHandlers.js` | 将 `console.log` 替换为实际业务逻辑 |
| 新建组件（如 `DeviceDetailPanel.jsx`） | 如需弹窗/侧边栏 |
| `src/App.jsx` | 如需全局弹窗，在此挂载新组件 |

**怎么改：**

当前结构：

```javascript
// src/utils/deviceHandlers.js
function handleRobotClick(device) {
  switch (device.status) {
    case 'running':
      // TODO: 替换为实际逻辑，例如：
      // openPanel({ type: 'robot-track', deviceId: device.id })
      console.log(`[Robot] Track live path: ${device.name}`)
      break
    // ...
  }
}
```

**推荐改法（引入事件总线或回调）：**

1. 在 `useMapApp.js` 中添加 `selectedDevice` 状态
2. `handleDeviceClick` 改为调用 setter 而非 console.log
3. 在 `App.jsx` 中根据 `selectedDevice` 渲染详情面板

**改哪些文档：**

- `docs/API_TODO.md` → 更新「点击行为」列，去掉「待实现」
- `docs/HANDOVER.md` → 更新架构图（如有新组件）

---

### 场景 7：更换底图

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `assets/` | 放入新 PNG 文件 |
| `src/data/mockData.js` | import 新图片；更新 `mapImage` 和 `mapSize` |

**怎么改：**

```javascript
// 1. 获取新图尺寸（macOS）：
//    sips -g pixelWidth -g pixelHeight assets/new-map.png

// 2. 在 mockData.js 中：
import newFloorMap from '../../assets/new-map.png'

// 3. 更新节点：
mapImage: newFloorMap,
mapSize: { width: 1920, height: 1080 },  // 必须与实际尺寸一致！
```

**⚠️ 重要**：更换底图后，该节点下所有 `regions` 的 polygon 坐标和 `devices` 的 position 都需要重新标注。

**改哪些文档：**

- `docs/API_TODO.md` → 更新「图片资源」表格
- `docs/HANDOVER.md` → 更新第 2 节静态资源表

---

### 场景 8：修改默认加载楼层

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/hooks/useMapApp.js` | 修改 `DEFAULT_NODE_ID` 常量 |

```javascript
// src/hooks/useMapApp.js
const DEFAULT_NODE_ID = 'building-a-2f'  // 改为你想要的节点 ID
```

**改哪些文档：** 无需更新文档。

---

### 场景 9：修改筛选器 UI 文案 / 样式

**改哪些文件：**

| 改动 | 文件 |
|------|------|
| 位置筛选器文案/图标 | `src/components/LocationFilter.jsx` |
| 设备筛选器文案/图标 | `src/components/DeviceFilter.jsx` |
| 筛选器通用样式 | `src/App.css`（`.filter-*` 类） |
| 筛选选项数据源 | `src/data/mockData.js` → `deviceFilterOptions` |

**改哪些文档：**

- 仅改样式/文案：无需更新文档
- 改选项结构：更新 `docs/API_TODO.md` 筛选选项接口

---

### 场景 10：修改区域 / 设备在地图上的视觉样式

**改哪些文件：**

| 元素 | 文件 | 关键位置 |
|------|------|---------|
| 区域多边形颜色/边框 | `src/components/RegionOverlay.jsx` | `pathOptions` |
| 区域进入按钮 | `src/App.css` | `.region-enter-btn` |
| 设备 Marker 外形 | `src/utils/deviceIcons.js` | `createDeviceIcon()` |
| 设备 Marker 动画 | `src/App.css` | `.device-marker-*` |
| 设备 Popup 样式 | `src/App.css` | `.device-popup-*` |
| 地图缩放控件 | `src/App.css` | `.leaflet-control-zoom` |
| 整体暗色主题 | `src/App.css` + `src/index.css` | 全局 |

**改哪些文档：** 无需更新文档（纯 UI 改动）。

---

### 场景 11：修改面包屑 / 页面标题

**改哪些文件：**

| 改动 | 文件 |
|------|------|
| 页面标题 | `src/App.jsx` → `.app-title`；`index.html` → `<title>` |
| 面包屑逻辑 | `src/App.jsx`（`getPathToNode` 生成路径） |
| 面包屑样式 | `src/App.css` → `.breadcrumb-*` |

**改哪些文档：** 无需更新文档。

---

### 场景 12：添加地图加载动画 / 错误处理

**改哪些文件：**

| 文件 | 操作 |
|------|------|
| `src/hooks/useMapApp.js` | 添加 `error` 状态；在 fetch 失败时设置 |
| `src/App.jsx` | 添加 error UI 分支 |
| `src/App.css` | 添加 error 样式 |

**改哪些文档：**

- `docs/HANDOVER.md` → 更新 Hook 返回值表

---

## 8. 对接真实后端指南

### 8.1 改造步骤（推荐顺序）

```
Step 1  创建 src/api/client.js（axios/fetch 封装）
Step 2  创建 src/api/locationApi.js（真实接口）
Step 3  逐个替换 mockApi.js 中的函数
Step 4  修改 useMapApp.js 的 import 路径
Step 5  删除或保留 mockData.js（建议保留用于本地开发/测试）
Step 6  更新 docs/API_TODO.md，勾选已完成项
```

### 8.2 接口替换对照表

| Mock 函数 | 建议 REST | 调用方 |
|-----------|----------|--------|
| `fetchLocationTree()` | `GET /api/locations/tree` | `useMapApp.js` |
| `fetchMapDetail(nodeId)` | `GET /api/maps/:nodeId` | `useMapApp.js` |
| `fetchNodePath(nodeId)` | `GET /api/locations/:nodeId/path` | 当前未使用（面包屑用前端 `getPathToNode`） |
| `fetchDeviceFilterOptions()` | 可不需要（前端写死） | 当前未使用 |
| `fetchDeviceSubtypes()` | `GET /api/devices/subtypes` | `DeviceMarkers.jsx`（直接 import mockData） |
| `fetchDeviceDetail(id)` | `GET /api/devices/:id` | 当前未使用（点击时未请求详情） |

### 8.3 替换示例

```javascript
// src/api/locationApi.js（新建）
const BASE_URL = import.meta.env.VITE_API_BASE_URL

export async function fetchLocationTree() {
  const res = await fetch(`${BASE_URL}/api/locations/tree`)
  if (!res.ok) throw new Error('Failed to fetch location tree')
  return res.json()
}

export async function fetchMapDetail(nodeId) {
  const res = await fetch(`${BASE_URL}/api/maps/${nodeId}`)
  if (!res.ok) throw new Error(`Failed to fetch map: ${nodeId}`)
  return res.json()
}
```

```javascript
// src/hooks/useMapApp.js（改 import）
// 改前：
import { fetchLocationTree, fetchMapDetail } from '../api/mockApi.js'
// 改后：
import { fetchLocationTree, fetchMapDetail } from '../api/locationApi.js'
```

### 8.4 后端响应注意事项

1. **`mapImage`**：Mock 阶段是 Vite import 的本地路径；后端应返回 CDN URL 字符串
2. **`mapSize`**：必须与实际图片尺寸一致，否则坐标会偏移
3. **`polygon` / `position`**：必须是像素坐标 `[x, y]`，原点在左上角
4. **`targetNodeId`**：必须是位置树中已存在的 room 节点 ID

### 8.5 环境变量

```bash
# .env.local（新建，不要提交到 git）
VITE_API_BASE_URL=https://api.example.com
```

在 `locationApi.js` 中通过 `import.meta.env.VITE_API_BASE_URL` 读取。

**改哪些文档：**

- `docs/API_TODO.md` → 勾选 TODO 项，标注实际接口地址
- `docs/HANDOVER.md` → 更新第 8 节（如架构有变）

---

## 9. 样式与 UI 定制

### 9.1 主题色

当前为暗色主题，主要色值：

| 用途 | 色值 | 定义位置 |
|------|------|---------|
| 页面背景 | `#0f1117` | `index.css` |
| 面板背景 | `#21262d` | `App.css` |
| 边框 | `#30363d` | `App.css` |
| 主文字 | `#c9d1d9` | `App.css` |
| 高亮/链接 | `#58a6ff` | `App.css` |
| 区域边框 | `#38bdf8` | `RegionOverlay.jsx` |
| 设备状态-正常 | `#22c55e` | `deviceIcons.js` |
| 设备状态-警告 | `#f59e0b` | `deviceIcons.js` |
| 设备状态-错误 | `#ef4444` | `deviceIcons.js` |

### 9.2 UI 参考稿

| 参考稿 | 对应组件 |
|--------|---------|
| `assets/建筑楼层树形结构数据筛选框.png` | `LocationFilter.jsx` |
| `assets/设备筛选框.png` | `DeviceFilter.jsx` |

---

## 10. 已知限制与后续规划

### 当前限制

| 限制 | 说明 | 建议处理方式 |
|------|------|-------------|
| 所有房间共用 `zoom.png` | 每个 room 节点指向同一张图 | 后续每个 room 配置独立底图 |
| 区域坐标为手工模拟 | 非 CAD 导出 | 对接后端后使用真实坐标 |
| 设备点击仅 console.log | 占位实现 | 见场景 6 |
| 设备筛选为纯前端 | 不过滤后端数据 | 当前楼层设备量小，可接受 |
| 无实时状态更新 | 设备状态静态 | 后续加 WebSocket 推送 |
| 无路由 | 位置状态仅在内存中 | 如需分享链接，加 URL query 参数 |
| `fetchNodePath` 未使用 | 面包屑用前端计算 | 对接后端后可切换 |
| `labelPosition` 未使用 | 区域标签自动居中 | 如需精确定位标签，改 `RegionOverlay.jsx` |

### 后续规划 Checklist

- [ ] 对接真实后端 API（见 `docs/API_TODO.md`）
- [ ] 实现设备点击 UI（弹窗/侧边栏/跳转）
- [ ] 每个 room 独立底图
- [ ] 设备状态 WebSocket 实时推送
- [ ] 区域坐标从 CAD 自动转换
- [ ] URL 路由同步（`/map?node=building-a-1f`）
- [ ] 设备子类型级别筛选
- [ ] 自定义设备 icon 图片（替代 SVG）
- [ ] 单元测试 / E2E 测试

---

## 附录 A：快速排错

| 现象 | 可能原因 | 排查方式 |
|------|---------|---------|
| 地图空白 | 底图路径错误或尺寸不对 | 检查 `mapImage` 和 `mapSize` |
| 设备/区域位置偏移 | 坐标与底图尺寸不匹配 | 确认 `mapSize` 与实际 PNG 尺寸一致 |
| 点击区域无反应 | `targetNodeId` 不存在或无 `mapImage` | 检查 room 节点 ID 是否匹配 |
| 筛选器不显示 | `tree` 未加载完成 | 检查 `fetchLocationTree` 返回值 |
| 设备不显示 | 被筛选器过滤 | 确认 `deviceFilter` 值和 `category` 匹配 |
| 构建失败 | import 路径或 export 问题 | 运行 `npm run lint` 查看详细错误 |
| Leaflet 样式异常 | CSS 未引入 | 确认 `main.jsx` 中有 `import 'leaflet/dist/leaflet.css'` |

## 附录 B：联系人 & 资源

| 资源 | 位置 |
|------|------|
| 原始需求 | `dev.md` |
| 接口规范 | `docs/API_TODO.md` |
| Leaflet 文档 | https://leafletjs.com/reference.html |
| react-leaflet 文档 | https://react-leaflet.js.org/ |
| CRS.Simple 说明 | https://leafletjs.com/examples/crs-simple/crs-simple.html |

---

*如有疑问，请先查阅本文档第 7 节「常见改动场景」，大多数日常改动都能在其中找到对应指引。*
