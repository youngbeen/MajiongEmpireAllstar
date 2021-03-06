
# Majiong Empire All-stars

This is a deluxe edition rebuilt with Electron and Vue based on [MajiongEmpire HTML](https://github.com/youngbeen/MajiongEmpire). It's also the latest MajiongEmpire piece in my MajiongEmpire series.

All heros and skills are kept, while it brings more features, heros, skills etc.

## Introduction

### Features

* All heros' deluxe fight
* Up to X heros
* Various skills
* Addictive battle rhythm with SE & Animation

# Guide For Developer

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run e:serve
```

### Compiles and minifies for production(HTML edition)
```
npm run build
```

### Compiles and minifies for production(Application edition)
```
npm run e:build
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

* 增加新角色
  * 狼人技能补全
  * 召唤师（召唤：随机在空位置召唤任意一个召唤物。协助：每次攻击10%几率召唤物会协助攻击，伤害+2。邪恶召唤：牺牲所有场上的召唤物，召唤出一个随机的强大召唤物）
* 新角色测试
* 角色简要描述调整
* 使用更美观的角色图片
* 伤害丛显示机制
* 0点伤害时是否需要播放击退效果？
* 播放音效期间freeze action？

## BUGS

* n/a