let input, slider, btn, dropdown;
let isJumping = false;
let iframeDiv, iframe;
let navbar;

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  // 1. 建立 Navbar
  navbar = createDiv('');
  navbar.position(0, 0);
  navbar.style('width', '100%');
  navbar.style('display', 'flex');
  navbar.style('align-items', 'center');
  navbar.style('padding', '15px 25px');
  navbar.style('background', 'rgba(255, 255, 255, 0.6)');
  navbar.style('backdrop-filter', 'blur(10px)');
  navbar.style('box-shadow', '0 4px 15px rgba(0,0,0,0.1)');
  navbar.style('gap', '20px');
  navbar.style('z-index', '100');
  navbar.style('box-sizing', 'border-box');

  // 2. 輸入框
  input = createInput('');
  input.attribute('placeholder', '在此輸入文字...');
  input.parent(navbar);
  styleElement(input, {
    'width': '200px',
    'height': '35px',
    'border-radius': '10px',
    'border': '1px solid #3a86ff',
    'padding': '0 15px'
  });

  // 3. 滑桿
  createSpan('字體大小:').parent(navbar).style('font-weight', 'bold');
  slider = createSlider(15, 80, 50);
  slider.parent(navbar);

  // 4. 跳動按鈕
  btn = createButton('✨ 跳動開關');
  btn.parent(navbar);
  styleElement(btn, {
    'padding': '8px 15px',
    'background': '#8338ec',
    'color': 'white',
    'border': 'none',
    'border-radius': '10px',
    'cursor': 'pointer'
  });
  btn.mousePressed(() => isJumping = !isJumping);

  // 5. 下拉選單 (新增「不顯示網頁」選項)
  dropdown = createSelect();
  dropdown.parent(navbar);
  dropdown.option('請選擇網頁...', 'show'); // 提示語
  dropdown.option('淡江大學', 'https://www.tku.edu.tw');
  dropdown.option('淡江教科系', 'https://www.et.tku.edu.tw');
  dropdown.option('不顯示網頁S', 'none'); // <-- 新增的選項
  dropdown.selected('none'); // 預設不顯示
  
  styleElement(dropdown, {
    'padding': '8px 10px',
    'border-radius': '8px'
  });

  dropdown.changed(() => {
    let val = dropdown.value();
    if (val === 'none' || val === 'show') {
      iframeDiv.hide(); // 隱藏容器
    } else {
      iframeDiv.show(); // 顯示容器
      iframe.attribute('src', val); // 更新網址
    }
  });

  // 6. Iframe 容器
  iframeDiv = createDiv();
  updateIframePosition();
  iframeDiv.style('border-radius', '20px');
  iframeDiv.style('overflow', 'hidden');
  iframeDiv.style('box-shadow', '0 20px 50px rgba(0,0,0,0.3)');
  iframeDiv.style('background', 'white');
  iframeDiv.hide(); // 初始狀態隱藏

  iframe = createElement('iframe');
  iframe.style('width', '100%');
  iframe.style('height', '100%');
  iframe.style('border', 'none');
  iframe.parent(iframeDiv);

  textAlign(LEFT, CENTER);
}

function draw() {
  background(245, 247, 250); 
  
  textSize(slider.value());
  let txt = input.value() || "TKU EDU";
  let colors = ['#ffbe0b', '#fb5607', '#ff006e', '#8338ec', '#3a86ff'];

  let tw = textWidth(txt);
  if (tw > 0) {
    let spacingY = slider.value() * 1.5;
    let moveX = (frameCount * 2) % (tw + 20); // 恢復橫向捲動感

    for (let y = 100; y < height + spacingY; y += spacingY) {
      let colorIndex = floor(y / spacingY) % colors.length;
      for (let x = -tw; x < width + tw; x += tw + 20) {
        fill(colors[colorIndex % colors.length]);
        
        let offX = 0, offY = 0;
        if (isJumping) {
          offX = map(noise(x * 0.01, y * 0.01, frameCount * 0.05), 0, 1, -20, 20);
          offY = map(noise(x * 0.01 + 100, y * 0.01, frameCount * 0.05), 0, 1, -40, 40);
        }
        
        text(txt, x - moveX + offX, y + offY);
        colorIndex++;
      }
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateIframePosition();
}

function updateIframePosition() {
  let w = windowWidth * 0.7;
  let h = windowHeight * 0.6;
  iframeDiv.size(w, h);
  iframeDiv.position((windowWidth - w) / 2, (windowHeight - h) / 2 + 40);
}

function styleElement(el, styles) {
  for (let prop in styles) el.style(prop, styles[prop]);
}