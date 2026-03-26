/* ============================================================
   Latent Space — worldmap.js
   Read-only visited-countries map with hover tooltips.
   Requires: D3 v7, topojson-client v3 (loaded via CDN in travel.html)
   ============================================================ */
(function () {
  'use strict';

  var TOPO_URL = 'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json';

  /* -----------------------------------------------------------
     Visited places — hardcoded, read-only
     key = ISO numeric string (matches topojson world-atlas ids)
     Special: Hong Kong (344) and Taiwan (158) included where
     the topojson has them as separate features.
  ----------------------------------------------------------- */
  var VISITED = {
    "156": { name: "China",                cities: ["Beijing", "Shanghai", "Changchun", "Tianjin", "Shenyang", "Baishan", "Dalian", "Dandong", "Shijiazhuang", "Zhengzhou", "Nanchang", "Kunming", "Dali", "Lijiang", "Mile", "Chengdu", "Nanjing", "Suzhou", "Changzhou", "Wuxi", "Hangzhou", "Lishui", "Quzhou", "Chuzhou", "Guangzhou", "Shenzhen", "Shantou", "Jieyang"] },
    "392": { name: "Japan",                cities: ["Tokyo", "Osaka"] },
    "410": { name: "South Korea",          cities: ["Seoul"] },
    "408": { name: "North Korea",          cities: ["Pyongyang"] },
    "344": { name: "Hong Kong",            cities: ["Hong Kong"] },
    "158": { name: "Taiwan",               cities: ["Taipei", "Kaohsiung", "Taichung"] },
    "356": { name: "India",                cities: ["Bangalore"] },
    "764": { name: "Thailand",             cities: ["Bangkok", "Phuket"] },
    "704": { name: "Vietnam",              cities: ["Ho Chi Minh City"] },
    "116": { name: "Cambodia",             cities: ["Phnom Penh"] },
    "458": { name: "Malaysia",             cities: ["Kuala Lumpur", "Malacca"] },
    "702": { name: "Singapore",            cities: ["Singapore City"] },
    "784": { name: "United Arab Emirates", cities: ["Dubai", "Abu Dhabi"] },
    "634": { name: "Qatar",                cities: ["Doha"] },
    "818": { name: "Egypt",                cities: ["Cairo", "Hurghada", "Luxor", "Aswan"] },
    "528": { name: "Netherlands",          cities: ["Amsterdam", "Eindhoven", "Rotterdam", "The Hague"] },
    "056": { name: "Belgium",              cities: ["Brussels", "Ghent", "Antwerp"] },
    "442": { name: "Luxembourg",           cities: ["Luxembourg City"] },
    "250": { name: "France",               cities: ["Paris", "Nice", "Cannes", "Marseille", "Lyon", "Rennes", "Corsica"] },
    "724": { name: "Spain",                cities: ["Barcelona"] },
    "492": { name: "Monaco",               cities: ["Monaco City"] },
    "380": { name: "Italy",                cities: ["Milan", "Rome", "Pisa", "Naples", "Capri", "Florence"] },
    "756": { name: "Switzerland",          cities: ["Zurich", "Geneva", "Lucerne", "Lausanne"] },
    "276": { name: "Germany",              cities: ["Berlin", "Frankfurt", "Munich", "Cologne"] },
    "578": { name: "Norway",               cities: ["Oslo", "Tromsø", "Svalbard"] },
    "752": { name: "Sweden",               cities: ["Stockholm"] },
    "246": { name: "Finland",              cities: ["Helsinki"] },
    "643": { name: "Russia",               cities: ["Moscow", "St. Petersburg", "Murmansk"] },
    "840": { name: "United States",        cities: ["Los Angeles", "San Francisco", "Las Vegas", "Boston", "Washington D.C.", "New York"] },
    "604": { name: "Peru",                 cities: ["Lima", "Cusco"] },
    "152": { name: "Chile",                cities: ["Santiago", "Easter Island"] }
  };

  /* -----------------------------------------------------------
     Stats
  ----------------------------------------------------------- */
  function updateStats() {
    var cc = Object.keys(VISITED).length;
    var cityCount = Object.values(VISITED).reduce(function(s, v) {
      return s + v.cities.length;
    }, 0);
    var el = document.getElementById('map-stats');
    if (el) {
      el.innerHTML =
        '<span><strong>' + cc + '</strong> ' + (cc === 1 ? 'country / district' : 'countries & districts') + '</span>' +
        '<span><strong>' + cityCount + '</strong> cities</span>';
    }
    renderSummary();
  }

  function renderSummary() {
    var list = document.getElementById('visited-countries-list');
    if (!list) return;
    var keys = Object.keys(VISITED).sort(function(a, b) {
      return VISITED[a].name.localeCompare(VISITED[b].name);
    });
    list.innerHTML = keys.map(function(id) {
      var e = VISITED[id];
      var cityStr = e.cities.length
        ? e.cities.join(' · ')
        : '<span style="color:var(--text-3)">—</span>';
      return '<div class="visited-country-row">' +
        '<div class="visited-country-name">' + e.name + '</div>' +
        '<div class="visited-cities-inline">' + cityStr + '</div>' +
        '</div>';
    }).join('');
  }

  /* -----------------------------------------------------------
     Tooltip
  ----------------------------------------------------------- */
  var tooltip = null;

  function createTooltip() {
    tooltip = document.createElement('div');
    tooltip.id = 'map-tooltip';
    tooltip.style.cssText = [
      'position:fixed',
      'pointer-events:none',
      'padding:0.5rem 0.85rem',
      'background:var(--surface-2)',
      'border:1px solid var(--border)',
      'border-radius:var(--radius)',
      'font-family:var(--font-mono)',
      'font-size:0.75rem',
      'color:var(--text)',
      'line-height:1.6',
      'max-width:220px',
      'z-index:999',
      'opacity:0',
      'transition:opacity .12s',
      'white-space:normal'
    ].join(';');
    document.body.appendChild(tooltip);
  }

  function showTooltip(event, entry) {
    if (!tooltip) return;
    var lines = '<strong>' + entry.name + '</strong>';
    if (entry.cities.length) {
      lines += '<br>' + entry.cities.join(' · ');
    }
    tooltip.innerHTML = lines;
    tooltip.style.opacity = '1';
    moveTooltip(event);
  }

  function moveTooltip(event) {
    if (!tooltip) return;
    var x = event.clientX + 14;
    var y = event.clientY - 10;
    // keep within viewport
    if (x + 230 > window.innerWidth) x = event.clientX - 234;
    tooltip.style.left = x + 'px';
    tooltip.style.top  = y + 'px';
  }

  function hideTooltip() {
    if (tooltip) tooltip.style.opacity = '0';
  }

  /* -----------------------------------------------------------
     D3 map
  ----------------------------------------------------------- */
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
    var borders   = topojson.mesh(world, world.objects.countries, function(a, b) { return a !== b; });

    var svg = d3.select(container)
      .append('svg')
      .attr('viewBox', '0 0 ' + w + ' ' + h)
      .attr('width', '100%')
      .style('display', 'block');

    /* Ocean — slightly cooler than bg for contrast */
    svg.append('rect')
      .attr('width', w).attr('height', h)
      .attr('fill', '#e8e3d8');

    /* Countries */
    svg.selectAll('.country')
      .data(countries.features)
      .join('path')
      .attr('class', function(d) {
        return 'country' + (VISITED[String(d.id)] ? ' visited' : '');
      })
      .attr('d', path)
      .on('mouseover', function(event, d) {
        var entry = VISITED[String(d.id)];
        if (entry) showTooltip(event, entry);
      })
      .on('mousemove', function(event, d) {
        if (VISITED[String(d.id)]) moveTooltip(event);
      })
      .on('mouseout', hideTooltip);

    /* Borders */
    svg.append('path')
      .datum(borders)
      .attr('fill', 'none')
      .attr('stroke', 'var(--border-subtle)')
      .attr('stroke-width', '0.4')
      .attr('d', path);

    updateStats();
  }

  /* -----------------------------------------------------------
     Init
  ----------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function() {
    createTooltip();
    fetch(TOPO_URL)
      .then(function(r) { return r.json(); })
      .then(function(world) { initMap(world); })
      .catch(function(err) {
        var c = document.getElementById('world-map-canvas');
        if (c) c.innerHTML = '<p style="padding:2rem;color:var(--text-3);font-family:var(--font-mono);font-size:.82rem">Map failed to load.</p>';
        console.error('worldmap.js:', err);
      });
  });
})();
