$(() => {
  FissionOpt().then((FissionOpt) => {
    const run = $('#run'), pause = $('#pause'), stop = $('#stop');
    let opt = null, timeout = null;

    const updateDisables = () => {
      $('#settings input').prop('disabled', opt !== null);
      $('#settings a')[opt === null ? 'removeClass' : 'addClass']('disabledLink');
      run[timeout === null ? 'removeClass' : 'addClass']('disabledLink');
      pause[timeout !== null ? 'removeClass' : 'addClass']('disabledLink');
      stop[opt !== null ? 'removeClass' : 'addClass']('disabledLink');
    };

    const fuelBasePower = $('#fuelBasePower');
    const fuelBaseHeat = $('#fuelBaseHeat');

    for (const [name, [power, heat]] of Object.entries(fuelPresets)) {
      $('#' + name).click(() => {
        if (opt !== null)
          return;
        fuelBasePower.val(power);
        fuelBaseHeat.val(heat);
      });
    }
    const applyFuelFactor = (factor) => {
      if (opt !== null)
        return;
      fuelBasePower.val(fuelBasePower.val() * factor);
      fuelBaseHeat.val(fuelBaseHeat.val() * factor);
    };
    $('#br').click(() => { applyFuelFactor(8 / 9); });
    $('#ic2').click(() => { applyFuelFactor(18 / 19); });
    $('#ic2mox').click(() => { applyFuelFactor(9 / 7); });

    const rates = [], limits = [];
    $('#rate input').each(function () { rates.push($(this)); });
    $('#activeRate input').each(function () { rates.push($(this)); });
    $('#limit input').each(function () { limits.push($(this)); });
    {
      const tail = limits.splice(-2);
      $('#activeLimit input').each(function () { limits.push($(this)); });
      limits.push(...tail);
    }
    const loadRatePreset = (preset) => {
      if (opt !== null)
        return;
      $.each(rates, (i, x) => { x.val(preset[i]); });
    };
    $('#DefRate').click(() => {
      loadRatePreset([
        60, 90, 90, 120, 130, 120, 150, 140, 120, 160, 80, 160, 80, 120, 110,
        150, 3200, 3000, 4800, 4000, 2800, 7000, 6600, 5400, 6400, 2400, 3600, 2600, 3000, 3600
      ]);
    });
    $('#E2ERate').click(() => {
      loadRatePreset([
        20, 80, 80, 120, 120, 100, 120, 120, 140, 140, 60, 140, 60, 80, 100,
        50, 1000, 1500, 1750, 2000, 2250, 3500, 3300, 2750, 3250, 1700, 2750, 1125, 1250, 2000
      ]);
    });
    $('#PO3Rate').click(() => {
      loadRatePreset([
        40, 160, 160, 240, 240, 200, 240, 240, 280, 800, 120, 280, 120, 160, 200,
        50, 1600, 20000, 4000, 2700, 3200, 3500, 3300, 2700, 3200, 1200, 1800, 1300, 1500, 1800
      ]);
    });

    const schedule = () => {
      timeout = window.setTimeout(step, 0);
    };

    const settings = new FissionOpt.FissionSettings();
    const design = $('#design');
    const save = $('#save');
    const nCoolerTypes = 15, air = nCoolerTypes * 2 + 2;
    const tileNames = ['Wt', 'Rs', 'Qz', 'Au', 'Gs', 'Lp', 'Dm', 'He', 'Ed', 'Cr', 'Fe', 'Em', 'Cu', 'Sn', 'Mg', '[]', '##', '..'];
    const tileTitles = ['Water', 'Redstone', 'Quartz', 'Gold', 'Glowstone', 'Lapis', 'Diamond', 'Liquid Helium',
      'Enderium', 'Cryotheum', 'Iron', 'Emerald', 'Copper', 'Tin', 'Magnesium', 'Reactor Cell', 'Moderator', 'Air'];
    $('#blockType>:not(:first)').each((i, x) => { $(x).attr('title', tileTitles[i]); });
    const tileClasses = tileNames.slice();
    tileClasses[15] = 'cell';
    tileClasses[16] = 'mod';
    tileClasses[17] = 'air';
    const tileSaveNames = tileTitles.slice(0, 17);
    tileSaveNames[7] = 'Helium';
    tileSaveNames[15] = 'FuelCell';
    tileSaveNames[16] = 'Graphite';

    const displayTile = (tile) => {
      let active = false;
      if (tile >= nCoolerTypes) {
        tile -= nCoolerTypes;
        if (tile < nCoolerTypes)
          active = true;
      }
      const result = $('<span>' + tileNames[tile] + '</span>').addClass(tileClasses[tile]);
      if (active) {
        result.attr('title', 'Active ' + tileTitles[tile]);
        result.css('outline', '2px dashed black')
      } else {
        result.attr('title', tileTitles[tile]);
      }
      return result;
    };

    const saveTile = (tile) => {
      if (tile >= nCoolerTypes) {
        tile -= nCoolerTypes;
        if (tile < nCoolerTypes) {
          return "Active " + tileSaveNames[tile];
        }
      }
      return tileSaveNames[tile];
    };

    const displaySample = (sample) => {
      design.empty();
      let block = $('<div></div>');
      const appendInfo = (label, value, unit) => {
        const row = $('<div></div>').addClass('info');
        row.append('<div>' + label + '</div>');
        row.append('<div>' + unit + '</div>');
        row.append(Math.round(value * 100) / 100);
        block.append(row);
      };
      appendInfo('Max Power', sample.getPower(), 'RF/t');
      appendInfo('Heat', sample.getHeat(), 'H/t');
      appendInfo('Cooling', sample.getCooling(), 'H/t');
      appendInfo('Net Heat', sample.getNetHeat(), 'H/t');
      appendInfo('Duty Cycle', sample.getDutyCycle() * 100, '%');
      appendInfo('Fuel Use Rate', sample.getAvgBreed(), '&times;');
      appendInfo('Efficiency', sample.getEfficiency() * 100, '%');
      appendInfo('Avg Power', sample.getAvgPower(), 'RF/t');
      design.append(block);

      const shapes = [], strides = [], data = sample.getData();
      for (let i = 0; i < 3; ++i) {
        shapes.push(sample.getShape(i));
        strides.push(sample.getStride(i));
      }
      let resourceMap = {};
      const saved = {
        UsedFuel: { name: '', FuelTime: 0.0, BasePower: settings.fuelBasePower, BaseHeat: settings.fuelBaseHeat },
        SaveVersion: { Major: 1, Minor: 2, Build: 24, Revision: 0, MajorRevision: 0, MinorRevision: 0 },
        InteriorDimensions: { X: shapes[2], Y: shapes[0], Z: shapes[1] },
        CompressedReactor: {}
      };
      resourceMap[-1] = (shapes[0] * shapes[1] + shapes[1] * shapes[2] + shapes[2] * shapes[0]) * 2;
      for (let x = 0; x < shapes[0]; ++x) {
        block = $('<div></div>');
        block.append('<div>Layer ' + (x + 1) + '</div>');
        for (let y = 0; y < shapes[1]; ++y) {
          const row = $('<div></div>').addClass('row');
          for (let z = 0; z < shapes[2]; ++z) {
            if (z)
              row.append(' ');
            const tile = data[x * strides[0] + y * strides[1] + z * strides[2]];
            if (!resourceMap.hasOwnProperty(tile))
              resourceMap[tile] = 1;
            else
              ++resourceMap[tile];
            const savedTile = saveTile(tile);
            if (savedTile !== undefined) {
              if (!saved.CompressedReactor.hasOwnProperty(savedTile))
                saved.CompressedReactor[savedTile] = [];
              saved.CompressedReactor[savedTile].push({ X: z + 1, Y: x + 1, Z: y + 1 });
            }
            row.append(displayTile(tile));
          }
          block.append(row);
        }
        design.append(block);
      }

      save.removeClass('disabledLink');
      save.off('click').click(() => {
        const elem = document.createElement('a');
        const url = window.URL.createObjectURL(new Blob([JSON.stringify(saved)], { type: 'text/json' }));
        elem.setAttribute('href', url);
        elem.setAttribute('download', 'reactor.json');
        elem.click();
        window.URL.revokeObjectURL(url);
      });

      block = $('<div></div>');
      block.append('<div>Total number of blocks used</div>')
      resourceMap = Object.entries(resourceMap);
      resourceMap.sort((x, y) => y[1] - x[1]);
      for (resource of resourceMap) {
        if (resource[0] == air)
          continue;
        const row = $('<div></div>');
        if (resource[0] < 0)
          row.append('Casing');
        else
          row.append(displayTile(resource[0]).addClass('row'));
        block.append(row.append(' &times; ' + resource[1]));
      }
      design.append(block);
    };

    const progress = $('#progress');
    let lossElement, lossPlot;
    function step() {
      schedule();
      opt.stepInteractive();
      const nStage = opt.getNStage();
      if (nStage == -2)
        progress.text('Episode ' + opt.getNEpisode() + ', training iteration ' + opt.getNIteration());
      else if (nStage == -1)
        progress.text('Episode ' + opt.getNEpisode() + ', inference iteration ' + opt.getNIteration());
      else
        progress.text('Episode ' + opt.getNEpisode() + ', stage ' + nStage + ', iteration ' + opt.getNIteration());
      if (opt.needsRedrawBest())
        displaySample(opt.getBest());
      if (opt.needsReplotLoss()) {
        const data = opt.getLossHistory();
        while (lossPlot.data.labels.length < data.length)
          lossPlot.data.labels.push(lossPlot.data.labels.length);
        lossPlot.data.datasets[0].data = data;
        lossPlot.update({ duration: 0 });
      }
    };

    run.click(() => {
      if (timeout !== null)
        return;
      if (opt === null) {
        const parseSize = (x) => {
          const result = parseInt(x);
          if (!(result > 0))
            throw Error("Core size must be a positive integer");
          return result;
        };
        const parsePositiveFloat = (name, x) => {
          const result = parseFloat(x);
          if (!(result > 0))
            throw Error(name + " must be a positive number");
          return result;
        };
        try {
          settings.sizeX = parseSize($('#sizeX').val());
          settings.sizeY = parseSize($('#sizeY').val());
          settings.sizeZ = parseSize($('#sizeZ').val());
          settings.fuelBasePower = parsePositiveFloat('Fuel Base Power', fuelBasePower.val());
          settings.fuelBaseHeat = parsePositiveFloat('Fuel Base Heat', fuelBaseHeat.val());
          settings.ensureActiveCoolerAccessible = $('#ensureActiveCoolerAccessible').is(':checked');
          settings.ensureHeatNeutral = $('#ensureHeatNeutral').is(':checked');
          settings.goal = parseInt($('input[name=goal]:checked').val());
          settings.symX = $('#symX').is(':checked');
          settings.symY = $('#symY').is(':checked');
          settings.symZ = $('#symZ').is(':checked');
          $.each(rates, (i, x) => { settings.setRate(i, parsePositiveFloat('Cooling Rate', x.val())); });
          $.each(limits, (i, x) => {
            x = parseInt(x.val());
            settings.setLimit(i, x >= 0 ? x : -1);
          });
        } catch (error) {
          alert('Error: ' + error.message);
          return;
        }
        design.empty();
        save.off('click');
        save.addClass('disabledLink');
        if (lossElement !== undefined)
          lossElement.remove();
        const useNet = $('#useNet').is(':checked');
        if (useNet) {
          lossElement = $('<canvas></canvas>').attr('width', 1024).attr('height', 128).insertAfter(progress);
          lossPlot = new Chart(lossElement[0].getContext('2d'), {
            type: 'bar',
            options: { responsive: false, animation: { duration: 0 }, hover: { animationDuration: 0 }, scales: { xAxes: [{ display: false }] }, legend: { display: false } },
            data: { labels: [], datasets: [{ label: 'Loss', backgroundColor: 'red', data: [], categoryPercentage: 1.0, barPercentage: 1.0 }] }
          });
        }
        opt = new FissionOpt.FissionOpt(settings, useNet);
      }
      schedule();
      updateDisables();
    });

    pause.click(() => {
      if (timeout === null)
        return;
      window.clearTimeout(timeout);
      timeout = null;
      updateDisables();
    });

    stop.click(() => {
      if (opt === null)
        return;
      if (timeout !== null) {
        window.clearTimeout(timeout);
        timeout = null;
      }
      opt.delete();
      opt = null;
      updateDisables();
    });
  });
});