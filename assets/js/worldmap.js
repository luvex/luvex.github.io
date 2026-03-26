/* ============================================================
   Latent Space — worldmap.js
   Interactive visited-countries tracker
   Requires: D3 v7, topojson-client v3 (loaded via CDN in travel.html)
   ============================================================ */
(function () {
  'use strict';

  var STORAGE_KEY = 'ls_travel_data';
  var TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

  /* Country numeric ISO → { name, alpha2 } */
  var COUNTRIES = {
    "004":"Afghanistan","008":"Albania","012":"Algeria","024":"Angola",
    "032":"Argentina","036":"Australia","040":"Austria","050":"Bangladesh",
    "056":"Belgium","068":"Bolivia","076":"Brazil","100":"Bulgaria",
    "116":"Cambodia","120":"Cameroon","124":"Canada","144":"Sri Lanka",
    "152":"Chile","156":"China","170":"Colombia","178":"Congo",
    "188":"Costa Rica","191":"Croatia","192":"Cuba","203":"Czechia",
    "208":"Denmark","218":"Ecuador","818":"Egypt","231":"Ethiopia",
    "246":"Finland","250":"France","276":"Germany","288":"Ghana",
    "300":"Greece","320":"Guatemala","332":"Haiti","340":"Honduras",
    "348":"Hungary","356":"India","360":"Indonesia","364":"Iran",
    "368":"Iraq","372":"Ireland","376":"Israel","380":"Italy",
    "388":"Jamaica","392":"Japan","400":"Jordan","398":"Kazakhstan",
    "404":"Kenya","408":"North Korea","410":"South Korea","414":"Kuwait",
    "418":"Laos","422":"Lebanon","430":"Liberia","434":"Libya",
    "440":"Lithuania","442":"Luxembourg","454":"Malawi","458":"Malaysia",
    "484":"Mexico","504":"Morocco","508":"Mozambique","516":"Namibia",
    "524":"Nepal","528":"Netherlands","540":"New Caledonia","554":"New Zealand",
    "558":"Nicaragua","566":"Nigeria","578":"Norway","586":"Pakistan",
    "591":"Panama","604":"Peru","608":"Philippines","616":"Poland",
    "620":"Portugal","630":"Puerto Rico","634":"Qatar","642":"Romania",
    "643":"Russia","646":"Rwanda","682":"Saudi Arabia","686":"Senegal",
    "694":"Sierra Leone","703":"Slovakia","705":"Slovenia","706":"Somalia",
    "710":"South Africa","724":"Spain","729":"Sudan","752":"Sweden",
    "756":"Switzerland","760":"Syria","764":"Thailand","792":"Turkey",
    "800":"Uganda","804":"Ukraine","784":"United Arab Emirates",
    "826":"United Kingdom","840":"United States","858":"Uruguay",
    "862":"Venezuela","704":"Vietnam","887":"Yemen","894":"Zambia",
    "716":"Zimbabwe","466":"Mali","478":"Mauritania","562":"Niger",
    "729":"Sudan","140":"Central African Republic","148":"Chad",
    "180":"DR Congo","262":"Djibouti","232":"Eritrea","266":"Gabon",
    "324":"Guinea","624":"Guinea-Bissau","050":"Bangladesh",
    "196":"Cyprus","233":"Estonia","428":"Latvia","703":"Slovakia",
    "498":"Moldova","807":"North Macedonia","070":"Bosnia & Herzegovina",
    "688":"Serbia","499":"Montenegro","008":"Albania","051":"Armenia",
    "031":"Azerbaijan","268":"Georgia","417":"Kyrgyzstan","762":"Tajikistan",
    "795":"Turkmenistan","860":"Uzbekistan","496":"Mongolia",
    "418":"Laos","096":"Brunei","626":"Timor-Leste","144":"Sri Lanka",
    "462":"Maldives","064":"Bhutan","524":"Nepal","586":"Pakistan",
    "586":"Pakistan","398":"Kazakhstan"
  };

  function getCountryName(id) {
    return COUNTRIES[String(id).padStart(3,'0')] || 'Unknown (' + id + ')';
  }

  /* LocalStorage helpers */
  function loadData() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; } catch(e) { return {}; }
  }
  function saveData(d) { localStorage.setItem(STORAGE_KEY, JSON.stringify(d)); }

  var data = loadData();

  /* ---- Stats & summary ---- */
  function updateStats() {
    var cc = Object.keys(data).length;
    var cities = Object.values(data).reduce(function(s, v){ return s + v.cities.length; }, 0);
    var el = document.getElementById('map-stats');
    if (el) el.innerHTML =
      '<span><strong>' + cc + '</strong> ' + (cc === 1 ? 'country' : 'countries') + '</span>' +
      '<span><strong>' + cities + '</strong> ' + (cities === 1 ? 'city' : 'cities') + '</span>';
    renderSummary();
  }

  function renderSummary() {
    var list = document.getElementById('visited-countries-list');
    if (!list) return;
    var keys = Object.keys(data).sort(function(a,b){ return data[a].name.localeCompare(data[b].name); });
    if (!keys.length) {
      list.innerHTML = '<p style="font-size:.82rem;color:var(--text-3);font-family:var(--font-mono);padding:.5rem 0">No countries marked yet.</p>';
      return;
    }
    list.innerHTML = keys.map(function(id) {
      var e = data[id];
      var cities = e.cities.length
        ? e.cities.join(', ')
        : '<span style="color:var(--text-3)">no cities added</span>';
      return '<div class="visited-country-row" data-id="'+id+'">' +
        '<div><div class="visited-country-name">'+e.name+'</div>' +
        '<div class="visited-cities-inline">'+cities+'</div></div>' +
        '<button class="btn-remove-country" data-id="'+id+'">remove</button>' +
        '</div>';
    }).join('');
    list.querySelectorAll('.btn-remove-country').forEach(function(btn) {
      btn.addEventListener('click', function() {
        var id = btn.getAttribute('data-id');
        delete data[id];
        saveData(data);
        applyColors();
        updateStats();
        if (currentId === id) closePanel();
      });
    });
  }

  /* ---- City panel ---- */
  var currentId = null;
  var currentName = null;

  function openPanel(id, name) {
    currentId = id; currentName = name;
    var t = document.getElementById('city-panel-title');
    if (t) t.textContent = name;
    renderCityList();
    var p = document.getElementById('city-panel');
    if (p) p.classList.add('open');
  }

  function closePanel() {
    var p = document.getElementById('city-panel');
    if (p) p.classList.remove('open');
    currentId = null; currentName = null;
  }

  function renderCityList() {
    var el = document.getElementById('city-list');
    if (!el || !currentId) return;
    var cities = (data[currentId] && data[currentId].cities) || [];
    if (!cities.length) { el.innerHTML = '<li style="color:var(--text-3)">No cities yet</li>'; return; }
    el.innerHTML = cities.map(function(c, i) {
      return '<li><span>'+c+'</span><button data-i="'+i+'">&times;</button></li>';
    }).join('');
    el.querySelectorAll('button').forEach(function(b) {
      b.addEventListener('click', function() {
        data[currentId].cities.splice(+b.getAttribute('data-i'), 1);
        saveData(data);
        renderCityList();
        updateStats();
      });
    });
  }

  function addCity() {
    var inp = document.getElementById('city-input');
    if (!inp || !currentId) return;
    var city = inp.value.trim();
    if (!city) return;
    if (!data[currentId]) data[currentId] = { name: currentName, cities: [] };
    if (data[currentId].cities.indexOf(city) < 0) data[currentId].cities.push(city);
    saveData(data);
    inp.value = '';
    renderCityList();
    updateStats();
  }

  /* ---- D3 map rendering ---- */
  var svgEl = null;

  function applyColors() {
    if (!svgEl) return;
    svgEl.selectAll('.country')
      .attr('class', function(d) {
        var id = String(d.id);
        return 'country' + (data[id] ? ' visited' : '') + (id === currentId ? ' selected' : '');
      });
  }

  function initMap(world) {
    var container = document.getElementById('world-map-canvas');
    if (!container) return;

    var w = container.offsetWidth || 800;
    var h = Math.round(w * 0.5);

    var projection = d3.geoNaturalEarth1()
      .scale(w / 6.28)
      .translate([w / 2, h / 2]);

    var path = d3.geoPath().projection(projection);
    var countries = topojson.feature(world, world.objects.countries);
    var borders = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    var svg = d3.select(container)
      .append('svg')
      .attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('width', '100%')
      .style('display', 'block');

    svgEl = svg;

    /* Ocean background */
    svg.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', 'var(--bg)');

    /* Countries */
    svg.selectAll('.country')
      .data(countries.features)
      .join('path')
      .attr('class', function(d) {
        return 'country' + (data[String(d.id)] ? ' visited' : '');
      })
      .attr('d', path)
      .attr('data-id', function(d) { return d.id; })
      .on('click', function(event, d) {
        var id = String(d.id);
        var name = getCountryName(id);

        if (!data[id]) {
          data[id] = { name: name, cities: [] };
          saveData(data);
        }
        currentId = id;
        applyColors();
        updateStats();
        openPanel(id, name);
      })
      .append('title')
      .text(function(d) { return getCountryName(String(d.id)); });

    /* Country borders */
    svg.append('path')
      .datum(borders)
      .attr('fill', 'none')
      .attr('stroke', 'var(--bg)')
      .attr('stroke-width', '0.5')
      .attr('d', path);

    applyColors();
    updateStats();
  }

  /* ---- Init ---- */
  document.addEventListener('DOMContentLoaded', function() {
    var closeBtn = document.getElementById('city-panel-close');
    if (closeBtn) closeBtn.addEventListener('click', closePanel);

    var addBtn = document.getElementById('city-add-btn');
    if (addBtn) addBtn.addEventListener('click', addCity);

    var inp = document.getElementById('city-input');
    if (inp) inp.addEventListener('keydown', function(e) { if (e.key === 'Enter') addCity(); });

    /* Close panel on click outside */
    document.addEventListener('click', function(e) {
      var panel = document.getElementById('city-panel');
      if (!panel || !panel.classList.contains('open')) return;
      if (!panel.contains(e.target) && !e.target.closest('.country')) closePanel();
    });

    /* Load topojson and render */
    fetch(TOPO_URL)
      .then(function(r) { return r.json(); })
      .then(function(world) { initMap(world); })
      .catch(function(err) {
        var c = document.getElementById('world-map-canvas');
        if (c) c.innerHTML = '<p style="padding:2rem;color:var(--text-3);font-family:var(--font-mono);font-size:.82rem">Map failed to load. Check your connection.</p>';
        console.error('worldmap.js:', err);
      });
  });
})();
