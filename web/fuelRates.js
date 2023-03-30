$(() => {
  const ratesPresets = {
    DefRate: [60, 90, 90, 120, 130, 120, 150, 140, 120, 160, 80, 160, 80, 120, 110, 150, 3200, 3000, 4800, 4000, 2800, 7000, 6600, 5400, 6400, 2400, 3600, 2600, 3000, 3600],
    E2ERate: [20, 80, 80, 120, 120, 100, 120, 120, 140, 140, 60, 140, 60, 80, 100, 50, 1000, 1500, 1750, 2000, 2250, 3500, 3300, 2750, 3250, 1700, 2750, 1125, 1250, 2000],
    PO3Rate: [40, 160, 160, 240, 240, 200, 240, 240, 280, 800, 120, 280, 120, 160, 200, 50, 1600, 20000, 4000, 2700, 3200, 3500, 3300, 2700, 3200, 1200, 1800, 1300, 1500, 1800],
  };
  const tileNames = ["Wt", "Rs", "Qz", "Au", "Gs", "Lp", "Dm", "He", "Ed", "Cr", "Fe", "Em", "Cu", "Sn", "Mg", "[]", "##", ".."];
  const tileTitles = ["Water", "Redstone", "Quartz", "Gold", "Glowstone", "Lapis", "Diamond", "Liquid Helium", "Enderium", "Cryotheum", "Iron", "Emerald", "Copper", "Tin", "Magnesium", "Reactor Cell", "Moderator", "Air"];

  (() => {
    function getInputs(label) {
      return `
          <label for="coolingRate_${label}"><p class="${label} i-block">${label}</p> : </label>
          <input id="coolingRate_${label}" type="text">
      `;
    }

    tileNames.forEach((name) => [$("#rates").append(getInputs(name))]);
  })();

  const rates = [];

  $("#rate input").each(() => {
    rates.push($(this));
  });
  $("#activeRate input").each(() => {
    rates.push($(this));
  });
});

