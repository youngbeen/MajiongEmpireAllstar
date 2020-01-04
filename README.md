
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

* 所有角色再增加新技能（ZS旋风斩，LR瞄准锁定，SM治疗链，WS禅坐，DZ左右开弓（左或右双目标攻击），FS法力爆炸（触发冰枪术后（50 - 回合数）%概率触发法力爆炸，对所有敌方目标造成当前伤害总量10%的伤害），XD自然之道（消耗5，立即回复5%HP，获得2回合BUFF，回合结束回复10%），DK感染（所有目标2层毒，如果目标身上已有毒，则翻倍），QS奉献（减少当前剩余HP的1/3，对目标造成减少HP的50%伤害），MS复活（恢复到15%血量），SR赞美（永久BUFF，可驱散，伤害+1），PC击破（消耗6SP，指定1个目标，造成其当前HP50%的伤害），JB鸡尾酒（选择1个友方目标，HP或者SP随机变化），YD友善礼物（全部SP转移给1个友方单位），YX隐匿（持续BUFF，无法驱散，50%概率闪避物理伤害，始终跳过回合，每回合结束+1SP，SP回满自动取消），TF嗜血（每击杀1个敌方单位，HP上限+1，HP+2），MO不死之心（回合结束时，若SP满，则SP转化为HP回复）） --> DZ
* 补充新技能所需音效
* 伤害丛显示机制
* 使用更美观的角色图片
* 增加新角色？
* 0点伤害时是否需要播放击退效果？
* 播放音效期间freeze action？

## BUGS

* n/a