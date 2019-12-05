export default {
  step: 0, // 当前步骤， 0 - 初始化，还未决出先后手， 1 - 已决出先后手，等待战斗开始， 2 - 战斗已确认，战斗中
  firstHand: '', // 先手方, 'up' - 上方先手， 'down' - 下方先手
  turn: '', // 标注当前是谁的回合，'up' - 上方回合， 'down' - 下方回合
  unitIndex: -1, // 存储自己选择单位的index，-1-null/0~4-上方/5~9-下方单位
  // targetIndex: -1, // 存储目标单位的index，-1-null/0~4-上方/5~9-下方单位
  msg: [] // 当前已保存的信息
}
