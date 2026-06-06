# 前端 Mock 接口文档

> 当前所有数据由前端 Mock 实现，后续对接真实后端时可按本文档替换。  
> Mock 实现位置：`src/api/mockApi.js`  
> Mock 数据位置：`src/data/mockData.js`

---

## 1. 获取位置树

**Mock 函数：** `fetchLocationTree()`  
**建议 REST：** `GET /api/locations/tree`

### 响应示例

```json
{
  "id": "root",
  "name": "Praxis All building",
  "type": "project",
  "children": [
    {
      "id": "building-a",
      "name": "Building A",
      "type": "building",
      "children": [
        {
          "id": "building-a-1f",
          "name": "1F",
          "type": "floor",
          "children": [
            {
              "id": "lobby-a",
              "name": "Lobby A",
              "type": "room",
              "children": []
            }
          ]
        }
      ]
    }
  ]
}
```

### 字段说明

| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 节点唯一标识 |
| `name` | string | 显示名称 |
| `type` | enum | `project` / `building` / `floor` / `room` |
| `children` | array | 子节点列表 |

---

## 2. 获取地图详情

**Mock 函数：** `fetchMapDetail(nodeId)`  
**建议 REST：** `GET /api/maps/:nodeId`

### 请求参数

| 参数 | 类型 | 说明 |
|------|------|------|
| `nodeId` | string | 楼层或房间节点 ID |

### 响应示例

```json
{
  "id": "building-a-1f",
  "name": "1F",
  "type": "floor",
  "mapImage": "https://cdn.example.com/maps/building-a-1f.png",
  "mapSize": { "width": 1920, "height": 1080 },
  "regions": [
    {
      "id": "region-lobby-a",
      "name": "Lobby A",
      "targetNodeId": "lobby-a",
      "polygon": [[120, 180], [120, 720], [520, 720], [520, 180]],
      "labelPosition": [320, 450]
    }
  ],
  "devices": [
    {
      "id": "dev-1f-r01",
      "name": "Delivery Bot-01",
      "category": "robot",
      "subtype": "delivery_robot",
      "status": "running",
      "position": [280, 350]
    }
  ]
}
```

### 字段说明

**mapSize**
- 底图像素尺寸，坐标系原点为左上角，`position` 和 `polygon` 均使用像素坐标 `[x, y]`

**regions**
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 区域 ID |
| `name` | string | 区域名称 |
| `targetNodeId` | string | 点击后跳转的目标节点 ID |
| `polygon` | `[number, number][]` | 多边形顶点像素坐标 |
| `labelPosition` | `[number, number]` | 标签按钮位置（可选） |

**devices**
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | string | 设备 ID |
| `name` | string | 设备名称 |
| `category` | enum | `robot` / `camera` / `iot` |
| `subtype` | string | 设备子类型，见设备字典接口 |
| `status` | string | 设备状态，因类别而异 |
| `position` | `[number, number]` | 像素坐标 `[x, y]` |

---

## 3. 获取节点路径（面包屑）

**Mock 函数：** `fetchNodePath(nodeId)`  
**建议 REST：** `GET /api/locations/:nodeId/path`

### 响应示例

```json
[
  { "id": "root", "name": "Praxis All building", "type": "project" },
  { "id": "building-a", "name": "Building A", "type": "building" },
  { "id": "building-a-1f", "name": "1F", "type": "floor" }
]
```

---

## 4. 获取设备筛选选项

**Mock 函数：** `fetchDeviceFilterOptions()`  
**建议 REST：** `GET /api/devices/filter-options`

### 响应示例

```json
[
  { "id": "all", "label": "All devices" },
  { "id": "robot", "label": "Robots" },
  { "id": "camera", "label": "Camera" },
  { "id": "iot", "label": "IoT Devices" }
]
```

> 注：设备筛选目前为纯前端过滤，后端可不提供此接口。

---

## 5. 获取设备子类型字典

**Mock 函数：** `fetchDeviceSubtypes()`  
**建议 REST：** `GET /api/devices/subtypes`

### 响应示例

```json
{
  "robot": [
    { "id": "delivery_robot", "label": "Delivery Robot" },
    { "id": "cleaning_robot", "label": "Cleaning Robot" },
    { "id": "patrol_robot", "label": "Patrol Robot" }
  ],
  "camera": [
    { "id": "dome_camera", "label": "Dome Camera" },
    { "id": "bullet_camera", "label": "Bullet Camera" },
    { "id": "ptz_camera", "label": "PTZ Camera" }
  ],
  "iot": [
    { "id": "sensor", "label": "Sensor" },
    { "id": "access_control", "label": "Access Control" },
    { "id": "lighting", "label": "Smart Lighting" }
  ]
}
```

---

## 6. 获取设备详情

**Mock 函数：** `fetchDeviceDetail(deviceId, nodeId?)`  
**建议 REST：** `GET /api/devices/:deviceId?nodeId=xxx`

### 响应示例

```json
{
  "id": "dev-1f-r01",
  "name": "Delivery Bot-01",
  "category": "robot",
  "subtype": "delivery_robot",
  "status": "running",
  "position": [280, 350]
}
```

---

## 设备状态枚举

### Robot (`category: robot`)

| status | 说明 | 点击行为（待实现） |
|--------|------|-------------------|
| `idle` | 空闲 | 打开任务派发面板 |
| `running` | 运行中 | 查看实时路径 |
| `charging` | 充电中 | 查看充电状态 |
| `error` | 故障 | 打开故障详情 |

### Camera (`category: camera`)

| status | 说明 | 点击行为（待实现） |
|--------|------|-------------------|
| `online` | 在线 | 打开实时画面 |
| `offline` | 离线 | 显示离线诊断 |
| `recording` | 录制中 | 查看录像 |
| `maintenance` | 维护中 | 查看维护日志 |

### IoT (`category: iot`)

| status | 说明 | 点击行为（待实现） |
|--------|------|-------------------|
| `normal` | 正常 | 查看设备指标 |
| `warning` | 警告 | 显示警告详情 |
| `alarm` | 告警 | 触发告警响应 |
| `offline` | 离线 | 设备重连面板 |

---

## 图片资源

| 文件名 | 用途 | 尺寸 |
|--------|------|------|
| `assets/map.png` | 楼层平面图底图 | 1920 × 1080 |
| `assets/zoom.png` | 房间平面图底图 | 403 × 326 |

---

## 后续对接 TODO

- [ ] 替换 `fetchLocationTree` 为真实 API
- [ ] 替换 `fetchMapDetail` 为真实 API，`mapImage` 改为 CDN URL
- [ ] 替换 `fetchNodePath` 为真实 API
- [ ] 替换 `fetchDeviceDetail` 为真实 API，扩展设备详情字段
- [ ] 实现各设备状态对应的点击业务逻辑（当前为 console.log 占位）
- [ ] 补充设备 icon 资源或使用后端下发的 icon URL
- [ ] 区域坐标数据改为后端 CAD 转换后的像素坐标
- [ ] 考虑 WebSocket 推送设备状态实时更新
