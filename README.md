
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
  * 狼人（S1: 每攻击1个目标，增加1层凶狠BUFF。每有1层凶狠，伤害+1。BUFF全场持续，不可驱散 S2: 对除自己外的所有其他目标造成1点物理伤害  S3：当凶狠超过20层时，生命上限减少50%，生命值完全回复，）
  * 召唤师
* 角色简要描述调整
* 使用更美观的角色图片
* 伤害丛显示机制
* 0点伤害时是否需要播放击退效果？
* 播放音效期间freeze action？

## BUGS

* n/a