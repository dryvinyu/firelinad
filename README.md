# Firelined (Monad Fireline) 项目说明

## 项目概述
Firelined 是面向 Monad 网络的安全处置与应急响应控制台，围绕“攻击触发 → 自动/手动止血 → 复盘恢复”的流程展示完整闭环。项目包含攻击端与防御端 UI、链上事件驱动的实时面板、以及 Owner 级复位能力。

## 技术栈
- 前端框架：Next.js 16（App Router）、React 19、TypeScript
- 样式：Tailwind CSS v4、Framer Motion、Lucide React
- 链上交互：ethers.js v6
- 状态管理：Zustand
- UI 组件：Radix UI、Shadcn UI、Sonner
- 代码规范：Biome

## 已实现功能
- 攻击端（Attack Console）
  - Drain / Price Shock 触发链上事件
  - 真实链上成功/失败状态展示
- 防御端（Console）
  - Runner 状态与链上协议状态面板（reserve/price/paused/withdrawLimit 等）
  - Execution Summary / Launchpad 轨道联动展示
- 自动化响应 + 自动止血 + 手动止血
  - 基于 sandbox 事件（ReserveChanged / PriceUpdated）触发 Action Set A/B
  - 冷却时间、阈值、回溯窗口可配置
  - 手动止血（pausePool / freezeOracle / isolate / snapshot / setWithdrawLimit）
  - Owner 复位（resetSandbox / resetController）


## 利用 Monad 的特性
- 高吞吐/低延迟：用于展示快速连发的止血操作与多事件实时同步
- EVM 兼容：合约与前端交互保持以太坊生态一致的开发体验
- 并行执行心智模型：Execution Summary 与 Launchpad 视觉层表达“并行 + 原子”应急响应

## 创新点
- 攻防一体化演示：在同一界面完成攻击触发与防御联动的闭环展示
- 真实链上数据驱动：所有展示数据均来自链上事件/状态读取
- 可演示的应急流程：自动触发、手动干预、Owner 复位可完整演练
- 可视化运维面板：将链上应急动作映射为可视化轨道与摘要信息

## 目录结构
- `firelinad/`：新项目（前端与合约）
- `Monad/`：旧项目/参考实现

## 运行说明（简要）
1. 配置 `firelinad/.env` 的 RPC 与链 ID
2. 启动前端：`pnpm dev`
3. 连接钱包，进入 Console 与 Attack 页面进行演示
