/* ==========================================
   INVENTORY.JS - Inventory helpers (stub)
   ========================================== */
// Inventory is managed within Character class
// This file provides additional inventory utilities

const InventoryHelper = {
    sortByRarity(inventory) {
        const order = { legendary: 0, epic: 1, rare: 2, uncommon: 3, common: 4 };
        return [...inventory].sort((a, b) => {
            const ra = order[ItemDB[a.id]?.rarity || 'common'] || 4;
            const rb = order[ItemDB[b.id]?.rarity || 'common'] || 4;
            return ra - rb;
        });
    },

    sortByType(inventory) {
        const order = { weapon: 0, armor: 1, helmet: 2, boots: 3, accessory: 4, potion: 5, misc: 6 };
        return [...inventory].sort((a, b) => {
            const ta = order[ItemDB[a.id]?.type || 'misc'] || 6;
            const tb = order[ItemDB[b.id]?.type || 'misc'] || 6;
            return ta - tb;
        });
    }
};
