const fs = require('fs');
const articles = JSON.parse(fs.readFileSync('data/articles.json', 'utf8'));

const imageMap = {
  'nintendo-brought-back-virtual-boy-and-its-perfect': [
    { after: 0, src: 'https://upload.wikimedia.org/wikipedia/commons/1/1d/Virtual-Boy-Set.png', alt: 'The original Nintendo Virtual Boy console with controller and stand', credit: 'Image: Evan-Amos / Wikimedia Commons' },
    { after: 3, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Nintendo_Switch_2_in_Handheld_Mode.png/800px-Nintendo_Switch_2_in_Handheld_Mode.png', alt: 'Nintendo Switch 2 in handheld mode', credit: 'Image: Wikimedia Commons' }
  ],
  'vr-games-showcase-march-2026-biggest-reveals': [
    { after: 'Payday: Aces High', src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/3456660/4d8dca2e8d0c3850edebe5b327041c5b3cf178df/header.jpg', alt: 'Payday: Aces High VR co-op heist game official artwork', credit: 'Image: Starbreeze Studios / Steam' },
    { after: 'Little Nightmares VR: Altered Echoes', src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2482940/d452a2c46f521825dead1bd5fda5a2b6a31d6379/header.jpg', alt: 'Little Nightmares VR: Altered Echoes official header art', credit: 'Image: Bandai Namco / Steam' }
  ],
  'google-vibe-coding-xr-xr-blocks-gemini': [
    { after: 'What is Vibe Coding XR?', src: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/0098-ARVR-XR-Blog-Header-2096x1182-v2.width-1300.png', alt: 'Android XR platform announcement header showing spatial computing interface', credit: 'Image: Google' },
    { after: 'The demos are impressive', src: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/blockshero.width-1300.png', alt: 'Google Blocks 3D creation tool for spatial computing', credit: 'Image: Google' }
  ],
  'half-life-alyx-still-the-gold-standard': [
    { after: 0, src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/546560/header.jpg', alt: 'Half-Life: Alyx official header art showing Alyx Vance in City 17', credit: 'Image: Valve / Steam' },
    { after: 'The world felt real', src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/546560/ss_0360004603a7861cf6781d5449e641f916f1ee07.1920x1080.jpg', alt: 'Half-Life: Alyx gameplay screenshot exploring City 17 in VR', credit: 'Image: Valve / Steam' }
  ],
  'steam-frame-everything-we-know': [
    { after: 0, src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Air_Force_officer_using_Valve_Index.jpg/800px-Air_Force_officer_using_Valve_Index.jpg', alt: 'Person wearing Valve Index VR headset', credit: 'Image: U.S. Air Force / Wikimedia Commons' },
    { after: 'Why this matters', src: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/Steam_Deck_%28front%29.png', alt: 'Valve Steam Deck front view, a reference point for Steam Frame hardware design', credit: 'Image: Wikimedia Commons' }
  ],
  'smart-glasses-2026-year-they-finally-make-sense': [
    { after: 0, src: 'https://upload.wikimedia.org/wikipedia/commons/b/bf/Ray-Ban_Stories.jpg', alt: 'Ray-Ban Stories smart glasses, the first Meta and Ray-Ban collaboration', credit: 'Image: Wikimedia Commons' },
    { after: 'What changed', src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/A_Google_Glass_wearer.jpg/800px-A_Google_Glass_wearer.jpg', alt: 'Person wearing Google Glass smart glasses', credit: 'Image: Wikimedia Commons' },
    { after: 'The enterprise angle', src: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Ray-Ban_Stories%2C_Feedback_LED%2C_and_Case.jpg', alt: 'Ray-Ban Stories smart glasses with feedback LED and charging case', credit: 'Image: Wikimedia Commons' }
  ],
  'vr-horror-games-ranked': [
    { after: 0, src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/2050650/header.jpg', alt: 'Resident Evil 4 VR official header art', credit: 'Image: Capcom / Steam' },
    { after: '3. Phasmophobia', src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/739630/c227a2855aba60f3657bc0c3a46515b8c41fb2b6/header.jpg', alt: 'Phasmophobia VR ghost hunting game official artwork', credit: 'Image: Kinetic Games / Steam' }
  ],
  'android-xr-could-be-the-next-android': [
    { after: 'What Android XR actually is', src: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/0098-ARVR-XR-Blog-Header-2096x1182-v2.width-1300.png', alt: 'Android XR platform header showing Google spatial computing vision', credit: 'Image: Google' },
    { after: 'The platform war is heating up', src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Meta_Quest_3_display_unit.jpg', alt: 'Meta Quest 3 headset with controllers on display', credit: 'Image: Wikimedia Commons' }
  ],
  'vr-training-replacing-traditional-methods': [
    { after: 0, src: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/2CR_Soldiers_use_virtual_reality_for_Counter-Unmanned_Aerial_Systems_Training_%288867747%29.jpg', alt: 'Soldiers using VR headsets for counter-drone military training', credit: 'Image: U.S. Army / Wikimedia Commons' },
    { after: "Where it's working", src: 'https://upload.wikimedia.org/wikipedia/commons/5/5f/2024-02-14_Aufhof_KRH_Akademie_mit_VR-Brille_der_Sophienklink_Hannover.jpg', alt: 'Healthcare professional training with a VR headset in a medical academy', credit: 'Image: Wikimedia Commons' },
    { after: 'What changed to make this viable', src: 'https://upload.wikimedia.org/wikipedia/commons/8/81/Driving_a_Vehicle_simulator_-_190128-F-JB127-0029.jpg', alt: 'Military personnel using VR vehicle driving simulator for training', credit: 'Image: U.S. Air Force / Wikimedia Commons' }
  ],
  'beat-saber-changed-vr-forever': [
    { after: 0, src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620980/3067664ee110fed550f5c3a1b74340cabd7d53f0/header.jpg', alt: 'Beat Saber official header art with neon light sabers', credit: 'Image: Beat Games / Steam' },
    { after: 'Why it mattered', src: 'https://shared.akamai.steamstatic.com/store_item_assets/steam/apps/620980/ss_114dc9a9f27666b2d56801ba49a1db8fa202b6ee.1920x1080.jpg', alt: 'Beat Saber gameplay screenshot showing blocks and glowing sabers', credit: 'Image: Beat Games / Steam' }
  ],
  'webxr-future-of-xr-development': [
    { after: 'Why it matters now', src: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/blockshero.width-1300.png', alt: 'Google Blocks VR 3D creation tool built for web-based spatial computing', credit: 'Image: Google' },
    { after: 'The advantages', src: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/0098-ARVR-XR-Blog-Header-2096x1182-v2.width-1300.png', alt: 'Android XR platform supporting browser-based WebXR experiences', credit: 'Image: Google' }
  ],
  'apple-vision-pro-enterprise-surprise': [
    { after: 0, src: 'https://www.apple.com/newsroom/images/2024/01/apple-vision-pro-available-in-the-us-on-february-2/article/Apple-Vision-Pro-availability-hero_big.jpg.large.jpg', alt: 'Apple Vision Pro headset being worn, showing the front glass and Digital Crown', credit: 'Image: Apple' },
    { after: 'The display advantage', src: 'https://www.apple.com/newsroom/images/2024/04/apple-vision-pro-brings-a-new-era-of-spatial-computing-to-business/article/Apple-Vision-Pro-Microsoft-365-productivity-apps_big.jpg.large.jpg', alt: 'Apple Vision Pro displaying Microsoft 365 enterprise productivity apps in spatial environment', credit: 'Image: Apple' },
    { after: 'The productivity angle', src: 'https://www.apple.com/newsroom/images/2024/01/apple-vision-pro-available-in-the-us-on-february-2/article/Apple-Vision-Pro-availability-Digital-Crown_big.jpg.large.jpg', alt: 'Apple Vision Pro close-up showing the Digital Crown and Light Seal design', credit: 'Image: Apple' }
  ],
  'meta-reality-labs-layoffs-pivot-2026': [
    { after: 0, src: 'https://upload.wikimedia.org/wikipedia/commons/b/bb/Meta_HQ_2023.png', alt: 'Meta headquarters campus in Menlo Park, California', credit: 'Image: Wikimedia Commons' },
    { after: 'Third-party headsets on hold', src: 'https://upload.wikimedia.org/wikipedia/commons/a/af/Meta_Quest_3_display_unit.jpg', alt: 'Meta Quest 3 headset with controllers on display', credit: 'Image: Wikimedia Commons' }
  ],
  'niantic-8th-wall-free-open-source': [
    { after: 0, src: 'https://upload.wikimedia.org/wikipedia/en/9/90/Pok%C3%A9mon_Go_AR_Mode%2C_Dec_2017.png', alt: 'Pokemon Go AR mode showing augmented reality gameplay by Niantic', credit: 'Image: Niantic' },
    { after: 'The bigger picture', src: 'https://storage.googleapis.com/gweb-uniblog-publish-prod/images/0098-ARVR-XR-Blog-Header-2096x1182-v2.width-1300.png', alt: 'Android XR platform representing the growing WebAR and WebXR ecosystem', credit: 'Image: Google' }
  ]
};

function makeFigure(img) {
  return `<figure><img src="${img.src}" alt="${img.alt}" loading="lazy" /><figcaption>${img.credit}</figcaption></figure>`;
}

let updatedCount = 0;
for (const article of articles) {
  const images = imageMap[article.id];
  if (!images) continue;

  let body = article.body;
  const insertions = [];

  for (const img of images) {
    const fig = makeFigure(img);
    if (typeof img.after === 'number') {
      // Insert after Nth paragraph (0 = after first paragraph)
      let idx = 0;
      let searchFrom = 0;
      for (let i = 0; i <= img.after; i++) {
        idx = body.indexOf('</p>', searchFrom);
        if (idx === -1) break;
        searchFrom = idx + 4;
      }
      if (idx !== -1) {
        insertions.push({ pos: idx + 4, html: fig });
      }
    } else {
      // Insert after the h2 containing this text, then after the next paragraph
      const h2Pattern = `<h2>${img.after}</h2>`;
      const h2Idx = body.indexOf(h2Pattern);
      if (h2Idx !== -1) {
        const afterH2 = h2Idx + h2Pattern.length;
        const nextPEnd = body.indexOf('</p>', afterH2);
        if (nextPEnd !== -1) {
          insertions.push({ pos: nextPEnd + 4, html: fig });
        }
      }
    }
  }

  // Sort by position descending so we insert from end to start
  insertions.sort((a, b) => b.pos - a.pos);
  for (const ins of insertions) {
    body = body.slice(0, ins.pos) + ins.html + body.slice(ins.pos);
  }

  article.body = body;
  updatedCount++;
}

fs.writeFileSync('data/articles.json', JSON.stringify(articles, null, 2));
console.log(`Done! Updated ${updatedCount} articles with images.`);
console.log(`Total image insertions: ${Object.values(imageMap).reduce((sum, arr) => sum + arr.length, 0)}`);
