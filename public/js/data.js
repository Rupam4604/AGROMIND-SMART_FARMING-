/* ═══════════════════════════════════════════════════
   data.js — DISEASE DATABASE & MODEL CLASS LABELS
   All 39 PlantVillage classes with full disease info.
═══════════════════════════════════════════════════ */

// ── PlantVillage 39-class labels (must match your model output order) ──
const CLASSES = [
  'Apple — Apple Scab',                       // 0
  'Apple — Black Rot',                        // 1
  'Apple — Cedar Apple Rust',                 // 2
  'Apple — Healthy',                          // 3
  'Background — No Plant',                    // 4
  'Blueberry — Healthy',                      // 5
  'Cherry — Powdery Mildew',                  // 6
  'Cherry — Healthy',                         // 7
  'Corn — Cercospora Leaf Spot',              // 8
  'Corn — Common Rust',                       // 9
  'Corn — Northern Leaf Blight',              // 10
  'Corn — Healthy',                           // 11
  'Grape — Black Rot',                        // 12
  'Grape — Esca (Black Measles)',             // 13
  'Grape — Leaf Blight',                      // 14
  'Grape — Healthy',                          // 15
  'Orange — Haunglongbing (Citrus Greening)', // 16
  'Peach — Bacterial Spot',                   // 17
  'Peach — Healthy',                          // 18
  'Pepper — Bacterial Spot',                  // 19
  'Pepper — Healthy',                         // 20
  'Potato — Early Blight',                    // 21
  'Potato — Late Blight',                     // 22
  'Potato — Healthy',                         // 23
  'Raspberry — Healthy',                      // 24
  'Soybean — Healthy',                        // 25
  'Squash — Powdery Mildew',                  // 26
  'Strawberry — Leaf Scorch',                 // 27
  'Strawberry — Healthy',                     // 28
  'Tomato — Bacterial Spot',                  // 29
  'Tomato — Early Blight',                    // 30
  'Tomato — Late Blight',                     // 31
  'Tomato — Leaf Mold',                       // 32
  'Tomato — Septoria Leaf Spot',              // 33
  'Tomato — Spider Mites',                    // 34
  'Tomato — Target Spot',                     // 35
  'Tomato — Yellow Leaf Curl Virus',          // 36
  'Tomato — Mosaic Virus',                    // 37
  'Tomato — Healthy',      // 38
];

// ── Full disease database for all 39 classes ──
const DIS_DB = {

  // ── APPLE ──
  'apple scab': {
    desc: 'Venturia inaequalis fungus causes olive-brown scabby lesions on leaves and fruit, reducing yield and marketability.',
    treat: 'Apply fungicides (captan, myclobutanil) at bud break. Remove and destroy fallen leaves.',
    prev: 'Plant resistant varieties. Rake and destroy fallen leaves. Ensure good air circulation.',
    sev: 'med',
  },
  'cedar apple rust': {
    desc: 'Gymnosporangium juniperi-virginianae causes bright orange-yellow spots on apple leaves and fruit.',
    treat: 'Apply fungicides (myclobutanil, triadimefon) from pink bud stage through petal fall.',
    prev: 'Remove nearby juniper/cedar trees. Plant resistant apple varieties.',
    sev: 'med',
  },

  // ── CHERRY ──
  'powdery mildew': {
    desc: 'Fungal white powdery coating on leaves reducing photosynthesis and plant vigour.',
    treat: 'Sulfur-based or systemic fungicides (myclobutanil). Neem oil for organic options.',
    prev: 'Good air circulation. Avoid nitrogen excess. Use resistant varieties.',
    sev: 'med',
  },

  // ── CORN ──
  'cercospora' : {
    desc: 'Gray leaf spot caused by Cercospora zeae-maydis. Rectangular gray-brown lesions reduce photosynthesis significantly.',
    treat: 'Foliar fungicides (azoxystrobin, pyraclostrobin). Remove infected crop debris.',
    prev: 'Crop rotation. Resistant hybrids. Avoid overhead watering.',
    sev: 'med',
  },
  'common rust': {
    desc: 'Puccinia sorghi causes orange-red pustules on both leaf surfaces spreading rapidly in cool humid weather.',
    treat: 'Apply fungicide (propiconazole) at first sign. Remove heavily infected plants.',
    prev: 'Resistant hybrids. Good airflow. Avoid wetting foliage.',
    sev: 'med',
  },
  'northern leaf blight': {
    desc: 'Exserohilum turcicum causes long cigar-shaped tan lesions up to 15cm on corn leaves.',
    treat: 'Foliar fungicides (azoxystrobin). Remove infected debris after harvest.',
    prev: 'Resistant hybrids. Crop rotation. Tillage to reduce inoculum.',
    sev: 'med',
  },

  // ── GRAPE ──
  'black rot': {
    desc: 'Guignardia bidwellii causes V-shaped brown lesions on leaves and shrivelled mummified fruit.',
    treat: 'Apply mancozeb or captan at bud break. Remove mummified fruit and infected canes.',
    prev: 'Prune for airflow. Remove overwintering sources. Maintain spray schedule.',
    sev: 'high',
  },
  'esca': {
    desc: 'Complex fungal disease (Black Measles) causing tiger-stripe leaf patterns and internal wood decay.',
    treat: 'No effective chemical cure. Remove and destroy infected vines. Protect pruning wounds.',
    prev: 'Use clean pruning tools. Apply wound sealants. Remove infected wood promptly.',
    sev: 'high',
  },
  'leaf blight': {
    desc: 'Isariopsis leaf spot causes dark brown lesions with yellow halos on grape leaves.',
    treat: 'Copper-based fungicides. Remove infected leaves. Improve air circulation.',
    prev: 'Avoid overhead irrigation. Proper vine spacing. Remove fallen leaves.',
    sev: 'med',
  },

  // ── ORANGE ──
  'citrus greening': {
    desc: 'Huanglongbing (HLB) bacterial disease spread by Asian citrus psyllid. Causes yellow mottled leaves and bitter fruit. No cure.',
    treat: 'Remove and destroy infected trees immediately. Control psyllid population with insecticides.',
    prev: 'Plant certified disease-free stock. Monitor for psyllids regularly. Quarantine infected areas.',
    sev: 'high',
  },
  ' haunglongbing' : {
    desc: 'Huanglongbing (HLB) bacterial disease spread by Asian citrus psyllid. Causes yellow mottled leaves and bitter fruit. No cure.',
    treat: 'Remove and destroy infected trees immediately. Control psyllid population with insecticides.',
    prev: 'Plant certified disease-free stock. Monitor for psyllids regularly. Quarantine infected areas.',
    sev: 'high',
  },

  // ── PEACH ──
  'bacterial spot': {
    desc: 'Xanthomonas bacteria cause water-soaked lesions that turn brown with yellow halos on leaves and fruit.',
    treat: 'Copper bactericides. Remove severely infected plants. Apply at bud swell.',
    prev: 'Use disease-free seed. Avoid overhead watering. Crop rotation.',
    sev: 'med',
  },

  // ── POTATO ──
  'early blight': {
    desc: 'Alternaria solani causes dark concentric-ringed spots with yellow halos on lower leaves first.',
    treat: 'Apply chlorothalonil or copper fungicides. Remove infected leaves promptly.',
    prev: 'Crop rotation. Avoid wetting foliage. Remove plant debris after harvest.',
    sev: 'med',
  },
  'late blight': {
    desc: 'Phytophthora infestans causes water-soaked lesions that rapidly turn brown-black. Destroyed the Irish potato crop in 1845.',
    treat: 'Apply copper-based or systemic fungicides (mancozeb, metalaxyl). Remove infected tissue immediately.',
    prev: 'Avoid overhead irrigation. Use resistant varieties. Proper plant spacing for airflow.',
    sev: 'high',
  },

  // ── SQUASH ──
  'squash powdery mildew': {
    desc: 'Podosphaera xanthii causes white powdery patches on squash leaves reducing yield.',
    treat: 'Apply sulfur or potassium bicarbonate sprays. Neem oil for organic control.',
    prev: 'Plant resistant varieties. Space plants for airflow. Avoid excess nitrogen.',
    sev: 'med',
  },

  // ── STRAWBERRY ──
  'leaf scorch': {
    desc: 'Diplocarpon earliana causes small dark purple spots with white or grey centres on strawberry leaves.',
    treat: 'Fungicides (captan, myclobutanil). Remove and destroy infected leaves.',
    prev: 'Improve air circulation. Avoid overhead irrigation. Remove old foliage.',
    sev: 'med',
  },

  // ── TOMATO ──
  'leaf mold': {
    desc: 'Cladosporium fulvum causes pale-green to yellow spots on upper leaf surface with olive-brown mould below.',
    treat: 'Improve ventilation. Apply copper or chlorothalonil fungicides.',
    prev: 'Reduce humidity below 85%. Remove lower leaves. Use resistant varieties.',
    sev: 'med',
  },
  'septoria leaf spot': {
    desc: 'Septoria lycopersici causes small circular spots with dark borders and grey centres on lower leaves first.',
    treat: 'Apply fungicides (chlorothalonil, mancozeb). Remove infected lower leaves.',
    prev: 'Avoid overhead watering. Crop rotation. Remove plant debris.',
    sev: 'med',
  },
  'spider mites': {
    desc: 'Tetranychus urticae causes stippled yellow leaves with fine webbing. Thrives in hot dry conditions.',
    treat: 'Miticides, neem oil, or predatory mites (Phytoseiulus persimilis).',
    prev: 'Keep plants well-watered. Avoid dusty conditions. Encourage natural predators.',
    sev: 'med',
  },
  'target spot': {
    desc: 'Corynespora cassiicola causes brown circular lesions with concentric rings resembling a target on leaves.',
    treat: 'Apply fungicides (azoxystrobin, difenoconazole). Remove infected tissue.',
    prev: 'Avoid overhead irrigation. Improve air circulation. Crop rotation.',
    sev: 'med',
  },
  'yellow leaf curl virus': {
    desc: 'Tomato Yellow Leaf Curl Virus (TYLCV) spread by whiteflies. Leaves curl upward, yellow and stunted growth.',
    treat: 'No cure. Remove and destroy infected plants immediately. Control whitefly population.',
    prev: 'Use resistant varieties. Reflective mulch repels whiteflies. Monitor regularly.',
    sev: 'high',
  },
  'mosaic virus': {
    desc: 'Tomato Mosaic Virus (ToMV) causes mosaic-patterned yellowing. Spread by aphids, contaminated tools and contact.',
    treat: 'No cure. Remove infected plants immediately. Disinfect all tools.',
    prev: 'Control aphids. Use virus-free certified seeds. Disinfect tools between plants.',
    sev: 'high',
  },

  // ── HEALTHY (all plants) ──
  healthy: {
    desc: 'The plant appears healthy with no visible signs of disease or pest damage.',
    treat: 'No treatment required. Maintain current growing conditions.',
    prev: 'Continue regular monitoring and good agricultural practices.',
    sev: 'low',
  },

  // ── BACKGROUND ──
  background: {
    desc: 'No plant detected in this image. Please upload a clear photo of a plant leaf.',
    treat: 'N/A',
    prev: 'Take a close-up photo of the leaf filling most of the frame.',
    sev: 'low',
  },

  // ── DEFAULT FALLBACK ──
  _default: {
    desc: 'Disease detected. Consult a local plant pathologist for specific diagnosis and guidance.',
    treat: 'Apply broad-spectrum fungicide. Remove visibly infected tissue. Isolate affected plants.',
    prev: 'Maintain good field hygiene. Ensure proper spacing and ventilation. Monitor regularly.',
    sev: 'med',
  },
};