<template>
  <div class="home">
    <action-panel></action-panel>
    <battle-field></battle-field>
    <battle-log></battle-log>

    <choose-hero></choose-hero>
    <make-skill></make-skill>
    <choose-target></choose-target>
    <dps-report></dps-report>
    <skill-tooltip></skill-tooltip>

    <audio-manager></audio-manager>
  </div>
</template>

<script>
import ActionPanel from '@/components/ActionPanel'
import BattleField from '@/components/BattleField'
import BattleLog from '@/components/BattleLog'
import ChooseHero from '@/components/ChooseHero'
import MakeSkill from '@/components/MakeSkill'
import ChooseTarget from '@/components/ChooseTarget'
import DpsReport from '@/components/DpsReport'
import SkillTooltip from '@/components/SkillTooltip'
import AudioManager from '@/components/AudioManager'

export default {
  name: 'home',
  components: {
    ActionPanel,
    BattleField,
    BattleLog,
    ChooseHero,
    MakeSkill,
    ChooseTarget,
    DpsReport,
    SkillTooltip,
    AudioManager
  }
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
}
</style>
