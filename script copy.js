document.getElementById("plotButton").addEventListener("click", plotHyperbola);

function plotHyperbola() {
  const a = parseFloat(document.getElementById('a').value);
  const b = parseFloat(document.getElementById('b').value);
  const c = parseFloat(document.getElementById('c').value);

  if (isNaN(a) || isNaN(b) || isNaN(c) || a <= 0 || b <= 0 || c <= 0) {
    alert("Усі значення повинні бути додатними числами!");
    return;
  }

  // ❖ Параметри анімації
  const steps = 600;   // кількість точок
  const T = 10;        // максимальне значення параметра t
  const dt = T / steps;

  const xRight = [], yRight = [];
  const xLeft = [], yLeft = [];
  const xDownRight = [], yDownRight = [];
  const xDownLeft = [], yDownLeft = [];

  for (let i = 0; i <= steps; i++) {
    const t = i * dt;
    const X = a * Math.cosh(t);
    const Y = b * Math.sinh(t);

    xRight.push(X);
    yRight.push(Y);

    xLeft.push(-X);
    yLeft.push(Y);

    xDownRight.push(X);
    yDownRight.push(-Y);

    xDownLeft.push(-X);
    yDownLeft.push(-Y);
  }

  // ❖ Створення кадрів для анімації
  const frames = [];
  for (let i = 1; i <= steps; i++) {
    frames.push({
      data: [
        { x: xRight.slice(0, i), y: yRight.slice(0, i) },
        { x: xLeft.slice(0, i), y: yLeft.slice(0, i) },
        { x: xDownRight.slice(0, i), y: yDownRight.slice(0, i) },
        { x: xDownLeft.slice(0, i), y: yDownLeft.slice(0, i) }
      ]
    });
  }

  // ❖ Гілки гіперболи
  const trace1 = { x: [], y: [], mode: 'lines', line: { color: '#dc2626', width: 2 }, name: 'Верхня права' };
  const trace2 = { x: [], y: [], mode: 'lines', line: { color: '#dc2626', width: 2 }, name: 'Верхня ліва' };
  const trace3 = { x: [], y: [], mode: 'lines', line: { color: '#dc2626', width: 2 }, name: 'Нижня права' };
  const trace4 = { x: [], y: [], mode: 'lines', line: { color: '#dc2626', width: 2 }, name: 'Нижня ліва' };

  // ❖ Фокуси
  const fociTrace = {
    x: [c, -c],
    y: [0, 0],
    mode: 'markers+text',
    text: ['F₁', 'F₂'],
    textposition: 'top center',
    marker: { color: '#2563eb', size: 10 },
    name: 'Фокуси'
  };

  // ❖ Напрямні (x = ± a²/c)
  const D = (a * a) / c;
  const directrixRight = {
    x: [D, D],
    y: [-b * 4, b * 4],
    mode: 'lines',
    line: { color: '#60a5fa', dash: 'dot' },
    name: 'Напрямна 1'
  };

  const directrixLeft = {
    x: [-D, -D],
    y: [-b * 4, b * 4],
    mode: 'lines',
    line: { color: '#60a5fa', dash: 'dot' },
    name: 'Напрямна 2'
  };

  const layout = {
    title: `Гіпербола: x²/${(a*a).toFixed(2)} - y²/${(b*b).toFixed(2)} = 1`,
    paper_bgcolor: 'rgba(0,0,0,0)',  // прозорий фон контейнера
    plot_bgcolor: 'rgba(0,0,0,0)',   // прозорий фон графіка
    xaxis: {
      zeroline: true,
      showgrid: true,
      gridcolor: '#cbd5e1',
      title: 'X',
      range: [-Math.max(c * 2, a * 2), Math.max(c * 2, a * 2)]
    },
    yaxis: {
      zeroline: true,
      showgrid: true,
      gridcolor: '#cbd5e1',
      title: 'Y',
      range: [-Math.max(c * 1.5, b * 2), Math.max(c * 1.5, b * 2)]
    },
    showlegend: true
  };

  Plotly.newPlot('plot',
    [trace1, trace2, trace3, trace4, fociTrace, directrixRight, directrixLeft],
    layout
  ).then(() => {
    Plotly.animate('plot', frames, {
      frame: { duration: 15, redraw: true },
      transition: { duration: 0 }
    });
    document.getElementById('plot').classList.add('show');
  });
}

// автоматична побудова при завантаженні
plotHyperbola();