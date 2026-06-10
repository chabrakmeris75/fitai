// ─── Données simulées — remplacer par HealthKit API en production ───

export const USER = {
  name: 'Alex',
  goal: 'recomposition',
  weightTarget: 78,
  proteinTarget: 200,
  calorieTarget: 2400,
  sleepTarget: 7.5,
}

export const SLEEP_DATA = [
  { day: 'L', date: '02/06', hours: 7.2, quality: 82, deep: 1.4, rem: 1.8 },
  { day: 'M', date: '03/06', hours: 5.8, quality: 61, deep: 0.9, rem: 1.2 },
  { day: 'M', date: '04/06', hours: 8.1, quality: 91, deep: 1.8, rem: 2.1 },
  { day: 'J', date: '05/06', hours: 6.5, quality: 74, deep: 1.2, rem: 1.6 },
  { day: 'V', date: '06/06', hours: 7.8, quality: 88, deep: 1.6, rem: 2.0 },
  { day: 'S', date: '07/06', hours: 9.0, quality: 95, deep: 2.1, rem: 2.4 },
  { day: 'D', date: '08/06', hours: 6.2, quality: 70, deep: 1.1, rem: 1.5 },
]

export const WEIGHT_DATA = [
  { date: '01/05', weight: 83.2, fat: 18.4, muscle: 41.1, bmi: 25.1 },
  { date: '08/05', weight: 82.8, fat: 18.1, muscle: 41.4, bmi: 24.9 },
  { date: '15/05', weight: 82.3, fat: 17.8, muscle: 41.7, bmi: 24.8 },
  { date: '22/05', weight: 81.9, fat: 17.5, muscle: 42.0, bmi: 24.6 },
  { date: '29/05', weight: 81.4, fat: 17.2, muscle: 42.2, bmi: 24.5 },
  { date: '05/06', weight: 80.9, fat: 16.9, muscle: 42.5, bmi: 24.3 },
]

export const CALORIES_DATA = [
  { day: 'L', ingested: 2340, burned: 2680 },
  { day: 'M', ingested: 1980, burned: 2210 },
  { day: 'M', ingested: 2560, burned: 2890 },
  { day: 'J', ingested: 2100, burned: 2350 },
  { day: 'V', ingested: 2450, burned: 2720 },
  { day: 'S', ingested: 2800, burned: 2600 },
  { day: 'D', ingested: 2200, burned: 2180 },
]

export const TODAY_NUTRITION = {
  calories: { eaten: 2200, target: 2400 },
  protein:  { g: 178, target: 200 },
  carbs:    { g: 242, target: 280 },
  fat:      { g: 68,  target: 75  },
  water:    { l: 2.1, target: 2.5 },
}

export const WORKOUTS = [
  {
    id: 1, date: '07/06', type: 'Push', name: 'Push — Poitrine & Épaules',
    duration: 58, volume: 8240, pr: true,
    exercises: [
      { name: 'Développé couché', sets: [{kg:100,reps:5},{kg:100,reps:5},{kg:102.5,reps:4},{kg:97.5,reps:6}] },
      { name: 'Développé incliné', sets: [{kg:75,reps:8},{kg:75,reps:8},{kg:75,reps:7}] },
      { name: 'Écarté câble', sets: [{kg:20,reps:12},{kg:20,reps:12},{kg:20,reps:10}] },
      { name: 'Développé militaire', sets: [{kg:70,reps:6},{kg:70,reps:6},{kg:70,reps:5}] },
      { name: 'Élévations latérales', sets: [{kg:14,reps:15},{kg:14,reps:15},{kg:14,reps:12}] },
    ]
  },
  {
    id: 2, date: '06/06', type: 'Pull', name: 'Pull — Dos & Biceps',
    duration: 65, volume: 9120, pr: false,
    exercises: [
      { name: 'Tractions', sets: [{kg:20,reps:6},{kg:20,reps:6},{kg:20,reps:5},{kg:15,reps:6}] },
      { name: 'Rowing barre', sets: [{kg:100,reps:8},{kg:100,reps:8},{kg:100,reps:7}] },
      { name: 'Tirage poulie', sets: [{kg:80,reps:10},{kg:80,reps:10},{kg:75,reps:10}] },
      { name: 'Curl haltères', sets: [{kg:18,reps:10},{kg:18,reps:10},{kg:16,reps:12}] },
    ]
  },
  {
    id: 3, date: '04/06', type: 'Legs', name: 'Legs — Quadriceps',
    duration: 72, volume: 12400, pr: false,
    exercises: [
      { name: 'Squat barre', sets: [{kg:127.5,reps:5},{kg:130,reps:5},{kg:130,reps:4},{kg:125,reps:6}] },
      { name: 'Presse à cuisses', sets: [{kg:200,reps:10},{kg:200,reps:10},{kg:200,reps:8}] },
      { name: 'Leg curl', sets: [{kg:60,reps:12},{kg:60,reps:12},{kg:55,reps:12}] },
      { name: 'Fentes marchées', sets: [{kg:60,reps:10},{kg:60,reps:10},{kg:60,reps:8}] },
    ]
  },
]

export const MUSCLE_VOLUME = [
  { name: 'Pectoraux', sets: 18, target: 20 },
  { name: 'Dos',       sets: 22, target: 20 },
  { name: 'Épaules',   sets: 15, target: 18 },
  { name: 'Biceps',    sets: 12, target: 12 },
  { name: 'Triceps',   sets: 14, target: 12 },
  { name: 'Jambes',    sets: 10, target: 20 },
  { name: 'Abdos',     sets: 6,  target: 12 },
]

export const EXERCISE_LIBRARY = [
  'Développé couché','Développé incliné','Écarté câble','Dips',
  'Développé militaire','Élévations latérales','Face pull',
  'Tractions','Rowing barre','Tirage poulie','Soulevé de terre',
  'Curl haltères','Curl barre','Curl marteau',
  'Squat barre','Presse à cuisses','Leg curl','Leg extension','Fentes','Mollets debout',
  'Triceps poulie','Extensions triceps',
  'Crunch','Gainage','Ab wheel',
]

export const WEEKLY_PLAN = [
  { day: 'Lundi',    type: 'Repos',  done: true,  rest: true  },
  { day: 'Mardi',    type: 'Push',   done: true,  rest: false,
    exercises: ['Dév. couché','Dév. incliné','Écarté','Dév. mil.','Élév. lat.'] },
  { day: 'Mercredi', type: 'Pull',   done: true,  rest: false,
    exercises: ['Tractions','Rowing barre','Tirage','Curl haltères'] },
  { day: 'Jeudi',    type: 'Repos',  done: true,  rest: true  },
  { day: 'Vendredi', type: 'Legs',   done: false, rest: false, today: true,
    exercises: ['Squat barre','Presse à cuisses','Leg curl','Fentes','Mollets'] },
  { day: 'Samedi',   type: 'Push',   done: false, rest: false,
    exercises: ['Dév. mil.','Élév. lat.','Face pull','Dips','Triceps'] },
  { day: 'Dimanche', type: 'Repos',  done: false, rest: true  },
]

export const CORRELATIONS_30D = Array.from({length: 30}, (_, i) => {
  const sleep = 5.5 + Math.random() * 3
  const vol   = Math.round(5000 + sleep * 500 + (Math.random() - 0.5) * 1500)
  const prot  = Math.round(130 + sleep * 7 + (Math.random() - 0.5) * 30)
  const recov = Math.round(55 + sleep * 5 + (Math.random() - 0.5) * 15)
  return {
    day: `${String(i+1).padStart(2,'0')}/05`,
    sleep: Math.round(sleep * 10) / 10,
    volume: vol,
    protein: prot,
    recovery: Math.min(100, Math.max(40, recov)),
  }
})

export const AI_RESPONSES = {
  default: (q) => `J'analyse ta question "${q}" en croisant ton sommeil (moy. 7.1h), ta nutrition (moy. 2 280 kcal/j) et tes entraînements (4 séances/sem.).\n\nDonne-moi quelques secondes pour générer une réponse personnalisée.`,
  'force': "D'après tes données des dernières 48h :\n\n• Sommeil hier : 5h58 (−1h30 vs moyenne)\n• Protéines hier : 142g vs objectif 200g\n• Calories : −380 kcal sous ta cible\n\nCe combo explique la baisse de force. Séance volume modéré recommandée aujourd'hui.",
  'programme': "Basé sur ta récupération actuelle (81/100) et ton niveau de force :\n\nPush/Pull/Legs 6j/sem est optimal pour toi. Volume cible : 18-22 séries/groupe/sem. Surcharge progressive : +2.5kg tous les 2 cycles réussis.\n\nPoint d'attention : augmenter le volume Legs de 10 à 20 séries.",
  'nutrition': "Tes macros sont quasi-optimales les jours d'entraînement. Problème détecté : les jours de repos, tes protéines chutent à 142g (objectif 200g).\n\nLa synthèse protéique reste active 48h post-séance. Maintenir 200g de protéines même au repos est crucial pour la recomposition.",
  'sommeil': "Corrélation forte détectée (r = +0.74) entre ton sommeil et tes performances :\n\n• +8h de sommeil → +12% de volume\n• -6h30 de sommeil → −18% de volume\n\nTon objectif prioritaire : viser 7h30 minimum avant les séances lourdes (squat, soulevé).",
  'recomposition': "Progression sur 6 semaines :\n\n• Masse grasse : −2.3 kg ✓\n• Masse musculaire : +1.4 kg ✓\n• Ratio : idéal pour une recomposition\n\nMaintenir le déficit de ~200 kcal/j. Ne pas descendre sous 1 900 kcal les jours de repos.",
}

export const SOURCES_STATUS = [
  { id: 'zepp',   name: 'Zepp / Amazfit', icon: '⌚', status: 'ok',   pts: 201, desc: 'Workouts · Sommeil · FC · SpO2' },
  { id: 'renpho', name: 'Renpho Health',  icon: '⚖',  status: 'ok',   pts: 1,   desc: 'Poids · % graisse · Muscle · IMC' },
  { id: 'crono',  name: 'Cronometer',     icon: '🥗',  status: 'ok',   pts: 45,  desc: 'Calories · Macros · Micros' },
]
