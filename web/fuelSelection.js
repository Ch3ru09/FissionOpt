$(() => {
  const fuelPresets = {
    UraniumIngot: {
      E2E: [600, 48],
    },
    TBU: { Default: [60, 18], E2E: [360, 21.6], PO3: [18000, 72] },
    "TBU-oxide": { Default: [84, 22.5], E2E: [504, 27], PO3: [25200, 90] },
    LEU235: { Default: [120, 50], E2E: [720, 60], PO3: [36000, 200] },
    "LEU235-oxide": { Default: [168, 62.5], E2E: [1008, 75], PO3: [50400, 250] },
    HEU235: { Default: [480, 300], E2E: [2880, 360], PO3: [144000, 1200] },
    "HEU235-oxide": { Default: [672, 375], E2E: [4032, 450], PO3: [201600, 1500] },
    LEU233: { Default: [144, 60], E2E: [864, 72], PO3: [43200, 240] },
    "LEU233-oxide": { Default: [201.6, 75], E2E: [1209.6, 90], PO3: [60318, 300] },
    HEU233: { Default: [576, 360], E2E: [3456, 432], PO3: [172800, 1440] },
    "HEU233-oxide": { Default: [806.4, 450], E2E: [4838.4, 540], PO3: [241812, 1800] },
    LEN236: { Default: [90, 36], E2E: [540, 43.2], PO3: [27000, 144] },
    "LEN236-oxide": { Default: [126, 45], E2E: [756, 54], PO3: [37800, 180] },
    HEN236: { Default: [360, 216], E2E: [2160, 259.2], PO3: [108000, 864] },
    "HEN236-oxide": { Default: [504, 270], E2E: [3024, 324], PO3: [151200, 1080] },
    MOX239: { Default: [155.4, 57.5], E2E: [932.4, 69], PO3: [46512, 230] },
    MOX241: { Default: [243.6, 97.5], E2E: [1461.6, 117], PO3: [72918, 390] },
    LEP239: { Default: [105, 40], E2E: [630, 48], PO3: [31500, 160] },
    "LEP239-oxide": { Default: [147, 50], E2E: [882, 60], PO3: [44100, 200] },
    HEP239: { Default: [420, 240], E2E: [2520, 288], PO3: [126000, 960] },
    "HEP239-oxide": { Default: [588, 300], E2E: [3528, 360], PO3: [176400, 1200] },
    LEP241: { Default: [165, 70], E2E: [990, 84], PO3: [49500, 280] },
    "LEP241-oxide": { Default: [231, 87.5], E2E: [1386, 105], PO3: [69300, 350] },
    HEP241: { Default: [660, 420], E2E: [3960, 504], PO3: [198000, 1680] },
    "HEP241-oxide": { Default: [924, 525], E2E: [5544, 630], PO3: [277200, 2100] },
    LEA242: { Default: [192, 94], E2E: [1152, 112.8], PO3: [57600, 376] },
    "LEA242-oxide": { Default: [268.8, 117.5], E2E: [1612.8, 141], PO3: [80424, 470] },
    HEA242: { Default: [768, 564], E2E: [4608, 676.8], PO3: [230400, 2256] },
    "HEA242-oxide": { Default: [1075.2, 705], E2E: [6451.2, 846], PO3: [322506, 2820] },
    LECm243: { Default: [210, 112], E2E: [1260, 134.4], PO3: [63000, 448] },
    "LECm243-oxide": { Default: [294, 140], E2E: [1764, 168], PO3: [88200, 560] },
    HECm243: { Default: [840, 672], E2E: [5040, 806.4], PO3: [252000, 2688] },
    "HECm243-oxide": { Default: [1176, 840], E2E: [7056, 1008], PO3: [352800, 3360] },
    LECm245: { Default: [162, 68], E2E: [972, 81.6], PO3: [48600, 272] },
    "LECm245-oxide": { Default: [226.8, 85], E2E: [1360.8, 102], PO3: [67824, 340] },
    HECm245: { Default: [648, 408], E2E: [3888, 489.6], PO3: [194400, 1632] },
    "HECm245-oxide": { Default: [907.2, 510], E2E: [5443.2, 612], PO3: [272106, 2040] },
    LECm247: { Default: [138, 54], E2E: [828, 64.8], PO3: [41400, 216] },
    "LECm247-oxide": { Default: [193.2, 67.5], E2E: [1159.2, 81], PO3: [57906, 270] },
    HECm247: { Default: [552, 324], E2E: [3312, 388.8], PO3: [165600, 1296] },
    "HECm247-oxide": { Default: [772.8, 405], E2E: [4636.8, 486], PO3: [231624, 1620] },
    LEB248: { Default: [135, 52], E2E: [810, 62.4], PO3: [40500, 208] },
    "LEB248-oxide": { Default: [189, 65], E2E: [1134, 78], PO3: [56700, 260] },
    HEB248: { Default: [540, 312], E2E: [3240, 374.4], PO3: [162000, 1248] },
    "HEB248-oxide": { Default: [756, 390], E2E: [4536, 468], PO3: [226800, 1560] },
    LECf249: { Default: [216, 116], E2E: [1296, 139.2], PO3: [64800, 464] },
    "LECf249-oxide": { Default: [302.4, 145], E2E: [1814.4, 174], PO3: [90612, 580] },
    HECf249: { Default: [864, 696], E2E: [5184, 835.2], PO3: [259200, 2784] },
    "HECf249-oxide": {
      Default: [1209.6, 870],
      E2E: [7257.6, 1044],
      PO3: [362718, 3480],
    },
    LECf251: { Default: [225, 120], E2E: [1350, 144], PO3: [67500, 480] },
    "LECf251-oxide": { Default: [315, 150], E2E: [1890, 180], PO3: [94500, 600] },
    HECf251: { Defaultault: [900, 720], E2E: [5400, 864], PO3: [270000, 2880] },
    "HECf251-oxide": { Default: [1260, 900], E2E: [7560, 1080], PO3: [378000, 3600] },
  };

  const fuelBasePower = $("#fuelBasePower");
  const fuelBaseHeat = $("#fuelBaseHeat");
  let selectedFuel = "";
  let selectedVersion = "";
  let filter = "";

  function getPreset(fuel, version) {
    const [power, heat] = fuelPresets[fuel][version];
    fuelBasePower.val(power);
    fuelBaseHeat.val(heat);
  }

  function generateDropdown(set, element, location, button) {
    for (let x in set) {
      if (filter && !x.toLowerCase().includes(filter)) continue;
      $("#" + location).append(`<a id="${element}_${x}" href="javascript:;" tabindex="-1">${x}</a>`);
      $("#" + element + "_" + x).click((e) => {
        $("#" + button).text(e.target.innerText);
        if (element == "fuel") {
          selectedFuel = e.target.innerText;
          $("#versionContainer").addClass("d-block");
          regenerateDropdown("", "version");
        } else if (element == "version") {
          selectedVersion = e.target.innerText;
          getPreset(selectedFuel, selectedVersion);
        }
      });
    }
  }

  function regenerateDropdown(text, element) {
    filter = text;
    $("#" + element + "Options").empty();
    generateDropdown(element == "fuel" ? fuelPresets : fuelPresets[selectedFuel], element, `${element}Options`, `select${element}`);
  }

  regenerateDropdown("", "fuel");

  for (let ans of ["fuel", "version"]) {
    function closeDropdown() {
      $("#" + ans + "Options").removeClass("show");
      $("#search" + ans).removeClass("reveal");
      $("#select" + ans).removeClass("reveal");
    }

    $(document).click((e) => {
      if (e.target.id == `search${ans}`) return;
      if ($.contains($("#" + ans + "dropdown"), e.target)) return;
      if (!$("#" + ans + "Options").hasClass("show")) return;
      closeDropdown();
    });

    document.addEventListener("keydown", function (e) {
      if (e.key != "Escape") return;
      if (!$("#" + ans + "Options").hasClass("show")) return;
      closeDropdown();
    });

    $("#select" + ans).click(() => {
      setTimeout(() => {
        $("#" + ans + "Options").addClass("show");
        $("#search" + ans).addClass("reveal");
        $("#select" + ans).addClass("reveal");
        const TO = setTimeout(() => {
          if (!$("#" + ans + "Options").hasClass("show")) return;
          $("#search" + ans).focus();
        }, 250);
      }, 1);
    });

    $("#search" + ans).keypress((e) => regenerateDropdown(e.target.value.toLowerCase().trim(), text, ans));
    $("#search" + ans).keyup((e) => regenerateDropdown(e.target.value.toLowerCase().trim(), text, ans));
  }
});

