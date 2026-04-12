/* ==========================================
   QUESTS.JS - Quest display helpers (stub)
   ========================================== */
// Quest system is mainly in character.js and ui.js
// This provides additional quest utilities

const QuestHelper = {
    getQuestsByArea(mapId) {
        return Object.values(QuestDB).filter(q => q.area === mapId || !q.area);
    },

    getAvailableQuests(player) {
        return Object.values(QuestDB).filter(q => {
            if (player.activeQuests.includes(q.id)) return false;
            if (player.completedQuests.includes(q.id)) return false;
            if (q.minLevel && player.level < q.minLevel) return false;
            return true;
        });
    }
};
