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
| animateDamage    | { targets: [index], value: '', sound: '', image: '' } | 通知展示伤害特效({ 目标索引，伤害数字值，音效，伤害效果图 }) |
| animateHeal      | { targets: [index], value: '', sound: '' } | 通知展示治疗特效({ 目标索引，治疗数字值，音效 }) |
| animateSpRecover | { targets: [index], value: '', sound: '' } | 通知展示SP回复特效({ 目标索引SP回复数字值，音效 }) |

## SS

| Name         | Description       |
| :----------- | :---------------- |
| sourceIndex  | 触发动作的原始对象索引，注意保存的是字符串 |


## TODOS

* 战斗记录框
* 冲锋只能指定相邻的目标
* 死亡角色身上的效果未清除？不影响实际战斗（是否需要修改？）
* 重置回合的音乐在何时播放？
* 调整选择目标界面的确定按钮的位置，便于操作