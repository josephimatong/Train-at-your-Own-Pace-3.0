/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VideoTutorial, LeaderboardEntry, Quiz, InAppNotification, CloudStorageConfig } from './types';

export const INITIAL_TUTORIALS: VideoTutorial[] = [
  {
    id: 'tut-1',
    title: 'Work At Height Safety (WAH) Regulations',
    category: 'Safety Track',
    module: 'Specialized Safety (Site/Factory Specific)',
    topic: 'Topic 4.1: Working at Heights: Fall Protection Plans, Anchors, Harnesses, and Lifelines',
    description: 'Crucial safety procedures for working on scaffolds, proper harness attachment, and fall protection measures on high-rise residential construction sites in Singapore.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-safet-hats-resting-on-a-table-48560-large.mp4', // Realistic high quality placeholder
    duration: '04:15',
    xpValue: 150,
    isCompleted: false,
    quizPassed: false,
    downloaded: false,
    deadline: '2026-07-15',
    cloudSource: 'local'
  },
  {
    id: 'tut-2',
    title: 'Excavation and Shoring Safety Measures',
    category: 'Safety Track',
    module: 'Specialized Safety (Site/Factory Specific)',
    topic: 'Topic 4.9: Excavation and Shoring Safety: Preventing Cave-ins and Striking Underground Services',
    description: 'Learn how to detect soil instability, set up secure shoring and sheet piling systems, and execute safe trench excavations under BCA regulations.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-construction-worker-working-with-heavy-machinery-44047-large.mp4',
    duration: '05:30',
    xpValue: 200,
    isCompleted: false,
    quizPassed: false,
    downloaded: false,
    deadline: '2026-07-20',
    cloudSource: 'local'
  },
  {
    id: 'tut-3',
    title: 'Precast Concrete Installation Guide',
    category: 'Technical Track',
    module: 'Material Science & Construction Technology',
    topic: 'Topic 2.7: Industrialized Building Systems (IBS) and Modular Prefabrication (PPVC)',
    description: 'Standard operating procedures for lifting, aligning, and securing prefabricated prefinished volumetric construction (PPVC) modules on Wee Hur project sites.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-under-construction-building-in-a-city-43952-large.mp4',
    duration: '06:45',
    xpValue: 250,
    isCompleted: false,
    quizPassed: false,
    downloaded: false,
    deadline: '2026-07-28',
    cloudSource: 'Google Drive'
  },
  {
    id: 'tut-4',
    title: 'Tower Crane Operation & Hand Signals',
    category: 'Safety Track',
    module: 'Specialized Safety (Site/Factory Specific)',
    topic: 'Topic 4.7: Heavy Lifting Operations: Crane Safety, Rigger/Signalman Communication, and Lifting Plans',
    description: 'An overview of essential communication protocol between riggers, signalmen, and crane operators to ensure zero-incident material hoisting.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-heavy-crane-lifting-cargo-at-a-port-41619-large.mp4',
    duration: '03:50',
    xpValue: 180,
    isCompleted: false,
    quizPassed: false,
    downloaded: false,
    deadline: '2026-08-05',
    cloudSource: 'AWS S3'
  },
  {
    id: 'tut-5',
    title: 'CONQUAS Quality Standards: Wet Trades',
    category: 'Technical Track',
    module: 'Quality Assurance & Quality Control (QA/QC)',
    topic: 'Topic 3.9: Workmanship Assessment Standards (e.g., CONQUAS / Quality Mark Frameworks)',
    description: 'Key checkpoints for architectural finishings, plastering, tiling, and waterproofing inspections to achieve high CONQUAS scores.',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-carpenter-measuring-and-cutting-wood-43983-large.mp4',
    duration: '08:12',
    xpValue: 300,
    isCompleted: false,
    quizPassed: false,
    downloaded: false,
    deadline: '2026-08-10',
    cloudSource: 'OneDrive'
  }
];

export const INITIAL_QUIZZES: Record<string, Quiz> = {
  'tut-1': {
    tutorialId: 'tut-1',
    questions: [
      {
        id: 'q1-1',
        question: 'At what height is full fall protection system mandatory on Singapore construction sites under WAH regulations?',
        options: ['1.5 meters', '2.0 meters', '3.0 meters', '4.0 meters'],
        correctIndex: 1,
        explanation: 'According to Singapore WAH Regulations, full fall protection must be provided where there is a risk of falling from a height of 2 meters or more.'
      },
      {
        id: 'q1-2',
        question: 'How often must a safety harness be inspected by the user?',
        options: ['Every month', 'Once a week', 'Before every single use', 'Only after a fall'],
        correctIndex: 2,
        explanation: 'Users must inspect their safety harness and lanyard for wear, tears, or damage before every single use to guarantee integrity.'
      },
      {
        id: 'q1-3',
        question: 'What is the correct action if a scaffolding has a RED Scafftag?',
        options: ['Use it with caution', 'Only work on the lower tiers', 'Do not mount the scaffold under any circumstances', 'Notify the crane operator only'],
        correctIndex: 2,
        explanation: 'A RED Scafftag indicates the scaffold is unsafe/incomplete. Mounting it is strictly prohibited.'
      }
    ]
  },
  'tut-2': {
    tutorialId: 'tut-2',
    questions: [
      {
        id: 'q2-1',
        question: 'What depth of excavation requires an engineered shoring or support system under BCA safety norms?',
        options: ['Over 1.0 meters', 'Over 1.5 meters', 'Over 2.0 meters', 'Over 4.0 meters'],
        correctIndex: 1,
        explanation: 'Excaavation of trenches/holes exceeding 1.5 meters in depth must have certified shoring, sheet piling, or benching to prevent cave-ins.'
      },
      {
        id: 'q2-2',
        question: 'Which of the following is an early warning sign of potential trench cave-in?',
        options: ['Minor tension cracks on the surrounding surface', 'Water seepage at the trench base', 'Bulging walls at the bottom of the trench', 'All of the above'],
        correctIndex: 3,
        explanation: 'Tension cracks, water pooling, and bulging are all severe warning signs of structural soil failure requiring immediate evacuation.'
      }
    ]
  },
  'tut-3': {
    tutorialId: 'tut-3',
    questions: [
      {
        id: 'q3-1',
        question: 'What is the standard lifting gear check before moving a PPVC (Prefabricated Volumetric) module?',
        options: ['Visual check of slings and spreader beams', 'Certificates confirmation of crane capacity', 'Weather and wind speed check', 'All of the above'],
        correctIndex: 3,
        explanation: 'Moving heavy PPVC modules requires complete crane certification, rigger clearance, wind monitoring (must be under 10m/s), and physical inspection of tackles.'
      },
      {
        id: 'q3-2',
        question: 'What is the tolerance limit for precast panel vertical alignment during leveling operations?',
        options: ['±2 mm', '±5 mm', '±10 mm', '±15 mm'],
        correctIndex: 1,
        explanation: 'Standard vertical tolerance for precast concrete walls and columns on Wee Hur premium projects is restricted to ±5 mm to ensure build quality.'
      }
    ]
  },
  'tut-4': {
    tutorialId: 'tut-4',
    questions: [
      {
        id: 'q4-1',
        question: 'Who is authorized to give crane hoisting signals to the tower crane operator?',
        options: ['Any worker on the ground', 'Only a designated and qualified Signalman/Rigger', 'The project manager only', 'The truck driver'],
        correctIndex: 1,
        explanation: 'Only trained and designated signalmen wearing highly visible armbands are authorized to communicate commands to the crane pilot.'
      },
      {
        id: 'q4-2',
        question: 'What does a hand extended flat, palm down, moving horizontally left and right signify?',
        options: ['Hoist slowly', 'Emergency Stop', 'Slew left', 'Trolley out'],
        correctIndex: 1,
        explanation: 'The horizontal waving of a flat palm downwards is the universal crane signal for an immediate Emergency Stop.'
      }
    ]
  },
  'tut-5': {
    tutorialId: 'tut-5',
    questions: [
      {
        id: 'q5-1',
        question: 'Which of the following is a key CONQUAS evaluation criteria for wet tile installations?',
        options: ['Color consistency only', 'Hollowness check by tapping with a joint rod', 'Thickness of grout joints', 'Both Hollowness check and joint alignment'],
        correctIndex: 3,
        explanation: 'CONQUAS inspects tile alignment, joint consistency, cleanliness, and checks for hollow sounds (tapping) across at least 5 spots per tile.'
      },
      {
        id: 'q5-2',
        question: 'What is the required ponding test duration for wet area waterproofing inspections?',
        options: ['12 hours', '24 hours', '48 hours', '72 hours'],
        correctIndex: 1,
        explanation: 'Singapore construction quality standards mandate a 24-hour ponding water test in bathrooms and kitchens to verify waterproofing effectiveness before finishing.'
      }
    ]
  }
};

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Tan Teck Meng', role: 'Safety Coordinator', site: 'Woodlands BTO Project', xp: 2150, badges: ['⚡ Safety Champ', '🏆 Perfectionist', '💡 Mentor'], completions: 12 },
  { rank: 2, name: 'Siti Aminah', role: 'Site Engineer', site: 'Punggol PPVC Site', xp: 1980, badges: ['🏗️ Prefab Master', '📊 QA Guru'], completions: 10 },
  { rank: 3, name: 'Ramesh Kumar', role: 'Tower Crane Operator', site: 'Woodlands BTO Project', xp: 1820, badges: ['🏗️ Safe Lift', '⏱️ Punctual'], completions: 9 },
  { rank: 4, name: 'Joseph Imatong', role: 'Structural Supervisor', site: 'Kovan Residential', xp: 1450, badges: ['🔥 Fast Learner', '📋 Inspector'], completions: 7 },
  { rank: 5, name: 'Lim Wei Jie', role: 'Site Supervisor', site: 'Punggol PPVC Site', xp: 1210, badges: ['🛡️ Safe Start'], completions: 6 },
  { rank: 6, name: 'Ahmad Fauzi', role: 'WSHO Officer', site: 'Kovan Residential', xp: 1100, badges: ['📋 Compliance'], completions: 5 },
  { rank: 7, name: 'Sanjay Pillay', role: 'Safety Assistant', site: 'Woodlands BTO Project', xp: 950, badges: ['💡 Greenhorn'], completions: 4 }
];

export const INITIAL_NOTIFICATIONS: InAppNotification[] = [
  {
    id: 'notif-1',
    title: '⚠️ Course Deadline Approaching',
    message: 'Your course "Work At Height Safety (WAH) Regulations" is due in 3 days. Complete the quiz to maintain site compliance.',
    time: '2 hours ago',
    read: false,
    type: 'deadline'
  },
  {
    id: 'notif-2',
    title: '🏆 Achievement Unlocked',
    message: 'Congratulations! You unlocked the "Inspector" Badge by scoring 100% on the excavation and shoring quiz.',
    time: '1 day ago',
    read: true,
    type: 'achievement'
  },
  {
    id: 'notif-3',
    title: '🔄 Data Synchronization Status',
    message: 'Encrypted safety records synced with Wee Hur headquarters central server database.',
    time: '2 days ago',
    read: true,
    type: 'sync'
  }
];

export const INITIAL_CLOUD_CONFIGS: CloudStorageConfig[] = [
  { id: 'cloud-1', service: 'Google Drive', connected: true, accountEmail: 'corporateinfo.cons@weehur.com.sg', lastSync: '2026-07-07 09:12' },
  { id: 'cloud-2', service: 'OneDrive', connected: false },
  { id: 'cloud-3', service: 'AWS S3', connected: true, accountEmail: 's3://weehur-learning-bucket', lastSync: '2026-07-06 18:30' }
];

// Mock database stats by project site
export const SITE_ANALYTICS = [
  { name: 'Woodlands BTO', compliance: 95, completion: 88, activeUsers: 42, safetyViolations: 0 },
  { name: 'Punggol PPVC', compliance: 92, completion: 82, activeUsers: 38, safetyViolations: 1 },
  { name: 'Kovan Residential', compliance: 88, completion: 74, activeUsers: 24, safetyViolations: 2 },
  { name: 'Geylang Warehouse', compliance: 100, completion: 91, activeUsers: 15, safetyViolations: 0 },
  { name: 'Changi Site B', compliance: 85, completion: 68, activeUsers: 29, safetyViolations: 3 }
];

// Historical completion trends (Monthly)
export const COMPLETION_TRENDS = [
  { month: 'Jan', Completed: 45, Target: 50 },
  { month: 'Feb', Completed: 58, Target: 60 },
  { month: 'Mar', Completed: 72, Target: 70 },
  { month: 'Apr', Completed: 85, Target: 80 },
  { month: 'May', Completed: 98, Target: 90 },
  { month: 'Jun', Completed: 120, Target: 110 },
  { month: 'Jul', Completed: 145, Target: 130 }
];

// Prepopulated Collaborative Notes
export const INITIAL_STUDY_NOTES: Record<string, string> = {
  'tut-1': `=== WAH SAFETY BRIEFING SUMMARY ===
1. Safety Harness Anchor point must be strictly above shoulder level to reduce free fall distance (prefer 2.0m overhead).
2. Lifelines must be inspected daily for abrasions, chemical damage, or cuts.
3. Keep the work deck clean - scaffold planks must be securely cleated.

--- Added by Siti Aminah (Site Engineer) ---
Guys, please remember we have a BCA inspection coming up next Tuesday. Ensure everyone on the 12th-floor deck is strictly utilizing the double-lanyard system at all times.

--- Added by Ramesh Kumar ---
Understood, Siti. I've briefed the scaffolding crew to complete the toe-boards inspection today before the wind warning.
`,
  'tut-2': `=== EXCAVATION OBSERVATIONS ===
1. Sloping or shoring is mandatory for trenches deeper than 1.5 meters.
2. Maintain soil stockpiles at least 1 meter away from the trench lip.
3. Air quality checks needed inside deep excavations (confined space hazards).
`,
  'tut-3': `=== PPVC ALIGNMENT CHECKLIST ===
1. Check the vertical plumb on at least three sides.
2. Grout must achieve 60MPa strength before removing temporary props.
`
};
