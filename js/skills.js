/* ==========================================
   SKILLS.JS - Active skills helpers (stub)
   ========================================== */
// Skill system is mainly handled in character.js and ui.js
// This provides any additional skill utilities

const SkillHelper = {
    getSkillDescription(skillId, level) {
        const skill = SkillDB[skillId];
        if (!skill) return '';
        let desc = skill.desc;
        if (level > 0 && skill.effect) {
            // Try to get actual values from effect
            const mockChar = {
                getAtk: () => 100,
                getStat: () => 10,
                stats: { hp: 100, maxHp: 100, mp: 100, maxMp: 100, atk: 100, int: 10 }
            };
            try {
                const eff = skill.effect(mockChar, null, level);
                if (eff.damage) desc += ` (Sát thương: ~${eff.damage})`;
                if (eff.heal) desc += ` (Hồi: ~${eff.heal} HP)`;
            } catch(e) {}
        }
        return desc;
    }
};
