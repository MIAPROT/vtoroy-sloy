const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, 'images');
const ok = /\.(jpe?g|png|webp)$/i;

const projects = [
  {
    id: 'italian',
    folder: 'академия топ итальянская',
    tab: 'Академия ТОП (итальянская)',
    title: 'Ремонт под ключ — Академия ТОП (итальянская)',
    area: '600 м²',
    duration: '1,5 месяца',
    type: 'Ремонт под ключ',
    desc: 'Ремонт под ключ в филиале Академия ТОП (итальянская): демонтаж, полный монтаж и отделка с нуля. 600 м² сданы за полтора месяца.',
    highlights: ['Демонтаж и монтаж с нуля', 'Академия ТОП', '600 м² под ключ']
  },
  {
    id: 'tir',
    folder: 'тир 10.000 м2',
    tab: 'Тир · покраска 10 000 м²',
    title: 'Покраска стрелкового тира',
    area: '10 000 м²',
    duration: '14 дней',
    type: 'Покраска',
    desc: 'Покрасили три галереи стрелкового тира общей площадью 10 000 м². Работали зимой в сложных температурных условиях — уложились в две недели одной бригадой.',
    highlights: ['Покраска 3 галерей', 'Работа зимой', '10 000 м² за 14 дней']
  },
  {
    id: 'graf-orlov',
    folder: 'академия топ граф орлов',
    tab: 'Академия ТОП (Граф Орлов)',
    title: 'Ремонт под ключ — Академия ТОП (Граф Орлов)',
    area: '1 000 м²',
    duration: '1,5 месяца',
    type: 'Ремонт под ключ',
    desc: 'Полный ремонт под ключ в учебном центре Академия ТОП на Граф Орлов д’Ампур: 1 000 м² в сжатые сроки. Работали днём и ночью, чтобы сдать объект вовремя.',
    highlights: ['Ремонт под ключ', 'Академия ТОП', '1 000 м² за 1,5 месяца']
  },
  {
    id: 'demolition',
    folder: 'демонтаж',
    tab: 'Демонтажные работы',
    title: 'Демонтажные работы',
    area: 'По проекту',
    duration: 'По проекту',
    type: 'Демонтаж',
    desc: 'Демонтаж перегородок, напольных покрытий и старых конструкций перед ремонтом. Аккуратно, с вывозом мусора и подготовкой площадки под следующий этап.',
    highlights: ['Демонтаж конструкций', 'Подготовка под ремонт', 'Вывоз мусора']
  },
  {
    id: 'gazprom',
    folder: 'газпром',
    tab: 'Газпром · покраска офисов',
    title: 'Ночная покраска офисов — Газпром',
    area: '~3 000 м²',
    duration: '14 дней',
    type: 'Покраска',
    desc: 'Покраска офисов Газпрома только по ночам: за смену — до трёх кабинетов. Вынести мебель, укрыть, покрасить и расставить обратно до прихода сотрудников. Около 3 000 м², включая коридоры.',
    highlights: ['Покраска офисов', 'Только ночные смены', '~3 000 м² за 2 недели']
  },
  {
    id: 'coffee',
    folder: 'Кофейня',
    tab: 'Кофейня · Невский',
    title: 'Покраска — кофейня на Невском проспекте',
    area: '400 м²',
    duration: '1 день',
    type: 'Покраска',
    desc: 'Покрасили кофейню на Невском проспекте в два слоя. По плану — два дня, по факту уложились за один день.',
    highlights: ['Покраска 400 м²', 'Невский проспект', 'Сдано за 1 день']
  },
  {
    id: 'circus',
    folder: 'санкт-петербургский цирк',
    tab: 'Госцирк на Фонтанке',
    title: 'Покраска и ремонт — Большой Санкт-Петербургский государственный цирк',
    area: '~1 500 м²',
    duration: '—',
    type: 'Покраска и ремонт',
    desc: 'Покраска и ремонтные работы в Большом Санкт-Петербургском государственном цирке на Фонтанке — главной цирковой площадке города. Около 1 500 м².',
    highlights: ['Государственный цирк', 'Фонтанка', '~1 500 м²']
  },
  {
    id: 'kashmir',
    folder: 'хан кашемир',
    tab: 'Хан Кашемир · Пассаж',
    title: 'Ремонт — Хан Кашемир, ТЦ «Пассаж»',
    area: '~50 м²',
    duration: '14 дней',
    type: 'Ремонт',
    desc: 'Ремонт магазина Хан Кашемир в историческом торговом центре «Пассаж» в центре Петербурга. Работы только по ночам — без остановки торговли.',
    highlights: ['ТЦ «Пассаж»', 'Только ночные смены', 'Центр города']
  },
  {
    id: 'metal',
    folder: 'покраска металлических изделий',
    tab: 'Покраска металла',
    title: 'Покраска металлоконструкций и изделий',
    area: 'Крупные объёмы',
    duration: 'Короткие сроки',
    type: 'Покраска металла',
    desc: 'Покраска металлоконструкций и изделий большими партиями за короткие сроки. Работали зимой и ранней весной в непростых условиях.',
    highlights: ['Металлоконструкции', 'Большие объёмы', 'Короткие сроки']
  },
  {
    id: 'production',
    folder: 'произвлдственные помещения',
    tab: 'Производство · покраска',
    title: 'Покраска производственных помещений',
    area: 'Промышленные объекты',
    duration: 'По проекту',
    type: 'Покраска',
    desc: 'Покраска производственных цехов и помещений. Уровень подготовки соответствует задаче объекта — без лишних затрат там, где не требуется идеальная отделка.',
    highlights: ['Промышленные объекты', 'Покраска цехов', 'Большие площади']
  }
];

const imageSwaps = {
  italian: [[0, 8]]
};

const imageExcludes = {
  production: [
    '17AAC4E6-6D37-435A-B3E8-F535B1FD614F.webp',
    '868abc75-e32d-4390-abd1-801f123f2425.JPG',
    '89bdf05f-6c7a-4ee7-bf16-5f710a695296.JPG',
    '9105fdc4-8c59-4e71-84be-96e8238d5f66.JPG',
    'D8D433F6-2F58-4461-8750-045790802274.webp',
    'a5a07500-96b7-4f7e-9256-e636fc6f4617.JPG',
    'd0d3e902-9f02-4214-8ff1-32f4dc24c825.JPG',
    'f6e9e23b-354f-45b3-a327-7a8ca0598bad.JPG',
    'ffde62c9-0234-4741-b908-cae11c81ac6e.JPG'
  ],
  'graf-orlov': [
    'IMG_2056.jpeg',
    'IMG_2061.jpeg',
    'IMG_2063.jpeg',
    'IMG_2071.jpg'
  ]
};

const imageOrderOverrides = {
  'graf-orlov': [
    'IMG_2062.jpeg',
    'IMG_2055.jpeg',
    'IMG_2057.jpeg',
    'IMG_2058.jpeg',
    'IMG_2059.jpeg',
    'IMG_2060.jpeg',
    '9313EF31-1A11-4D3F-8831-7B1034DDF3DB.JPG',
    'IMG_2064.jpeg',
    'IMG_2065.jpg',
    'IMG_2067.jpg',
    'IMG_2068.jpg',
    'IMG_2069.jpg',
    'IMG_2070.jpg',
    'IMG_2072.jpg',
    'IMG_2074.jpg'
  ],
  demolition: [
    'IMG_6715.jpeg',
    'IMG_6707.jpeg',
    'IMG_6709.jpeg',
    'IMG_6710.jpeg',
    'IMG_6712.jpeg',
    'IMG_6706.jpeg',
    'IMG_8009.jpeg',
    'IMG_8010.jpeg',
    'IMG_8011.jpeg',
    'IMG_8013.jpeg'
  ],
  gazprom: [
    'BEE34E22-7687-44E1-8CAA-48F7CF60551E.webp',
    '82F90C8C-CE63-469D-AF2F-D3AECF24B132.webp',
    '8582B189-3836-4171-A59A-DFD8BC4B089C.webp',
    'BDD40217-C21B-450F-816E-9E64C6A21D1F.webp',
    '3A39B8C5-A6DA-44BC-A319-14187BE4CF0C.webp',
    'D6271469-B82B-4293-AC00-6608CA870802.webp',
    'E744FFDD-AAB5-494F-9E0F-619C424C2693.webp',
    'F40A833F-28BA-43F8-BEE9-D9FE7C4C19A9.webp',
    'IMG_2528.JPG',
    'IMG_2529.JPG',
    'IMG_2530.JPG',
    'IMG_2531.JPG',
    'газпром копия.JPG'
  ],
  circus: [
    '54A2B9AD-00A9-4D7A-AFA6-DFEE3A8F6E23.webp',
    '1546f4ab-15dc-4aa1-9abd-ccbef5347759.JPG',
    '28E1CCAB-8A63-405E-8210-A22B7F524B35.webp',
    '3f5c2cfe-0b93-4811-9a87-f3609a801924.JPG',
    '0c874e87-de18-448d-abb5-a9be732eba7c.JPG',
    '556f84e9-115e-47a4-b9f7-bc2e1a1a4857.JPG',
    '80a3aa52-dd40-4773-a3db-d4837e4ed611.JPG',
    'F1254678-5B6F-406A-A524-07200D2850AE.webp',
    'FC2CD6E4-7E4B-4536-B227-83270A8D5BC6.webp',
    'IMG_2717.png',
    'IMG_2722.png',
    'IMG_2723.png',
    'IMG_2724.png'
  ],
  metal: [
    'metal-add-03.png',
    'metal-add-01.png',
    'metal-add-02.png',
    'metal-add-04.png',
    'metal-add-05.png',
    'metal-add-06.png',
    'metal-add-07.png',
    '4cc015f1-e96c-46d4-9361-79c5d76ca71a.JPG',
    '576baccb-1cbe-42b0-b353-9088c1b4dc44.JPG',
    'IMG_2700.JPG',
    'IMG_2701.png',
    'IMG_2702.JPG'
  ]
};

function resolveImagePaths(folder, filenames) {
  const dir = path.join(root, folder);
  if (!fs.existsSync(dir)) return [];
  const dirFiles = fs.readdirSync(dir).filter(function (f) { return ok.test(f); });
  const byLower = {};
  dirFiles.forEach(function (f) { byLower[f.toLowerCase()] = f; });
  return filenames
    .map(function (f) { return byLower[f.toLowerCase()]; })
    .filter(Boolean)
    .map(function (f) { return 'images/' + folder + '/' + f; });
}

const data = projects.map(function (p) {
  const dir = path.join(root, p.folder);
  const exclude = new Set((imageExcludes[p.id] || []).map(function (f) { return f.toLowerCase(); }));
  var images;
  if (imageOrderOverrides[p.id]) {
    images = resolveImagePaths(p.folder, imageOrderOverrides[p.id]);
  } else {
    images = fs.existsSync(dir)
      ? fs.readdirSync(dir).filter(function (f) {
          return ok.test(f) && !exclude.has(f.toLowerCase());
        }).sort().map(function (f) {
          return 'images/' + p.folder + '/' + f;
        })
      : [];
    (imageSwaps[p.id] || []).forEach(function (pair) {
      if (images.length > Math.max(pair[0], pair[1])) {
        var tmp = images[pair[0]];
        images[pair[0]] = images[pair[1]];
        images[pair[1]] = tmp;
      }
    });
  }
  return Object.assign({}, p, { images: images });
}).filter(function (p) { return p.images.length; });

fs.writeFileSync(
  path.join(__dirname, 'projects-data.js'),
  'window.PROJECTS_DATA = ' + JSON.stringify(data, null, 2) + ';\n',
  'utf8'
);

console.log('Built ' + data.length + ' projects');
