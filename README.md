# majiong-empire-allstar

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Events

| Event Name       | Params      | Description       |
| :--------------- | :---------- | :---------------- |
| playSound        | { sound: '', loop: false } | 播放音效({ 音效名称（必须）， 是否循环播放 }) |
| chooseHero       | | 通知展示选择英雄弹框 |
| makeSkill        | | 通知展示选择技能弹框 |
| skillTooltip     | { left: 0, top: 0, title: '', subTitle: [''], desc: '' } | 通知展示技能描述弹框({ 距左， 距上， 标题， 副标题， 描述 }) |
| hideSkillTooltip | | 通知展示选择技能弹框 |
| chooseTarget     | { skillId: '' } | 通知展示选择技能目标弹框({ 技能id }) |
| dpsReport     | | 通知展示伤害统计报表 |
| animateDamage    | { targets: [index], value: '', sound: '', image: '' } | 通知展示伤害特效({ 目标索引，伤害数字值，音效，伤害效果图 }) |
| animateHeal      | { targets: [index], value: '', sound: '' } | 通知展示治疗特效({ 目标索引，治疗数字值，音效 }) |
| animateSpRecover | { targets: [index], value: '', sound: '' } | 通知展示SP回复特效({ 目标索引SP回复数字值，音效 }) |

## SS

| Name         | Description       |
| :----------- | :---------------- |
| sourceIndex  | 触发动作的原始对象索引，注意保存的是字符串 |


## TODOS

* 显示HP, SP地方更新数字字体？其他显示数字的地方更新字体？
* 所有角色技能review，前摇设置？
* 伤害floating动效调整
* 调整选择目标界面的确定按钮的位置，便于操作
* 优化buff图标的显示（自动按顺序罗列，不固定位置）
* HP和所有伤害数值调整
* 初始SP多少？
* 按钮添加图标，其他地方添加图标fa-tachometer-alt 仪表盘
* 顶部操作栏样式调整，优化，切换显示按钮跟状态显示
* 使用更美观的角色图片
* 所有角色再增加新技能？
* 增加新角色？

## BUGS

* 重置之后，再次选择目标界面数据错乱？