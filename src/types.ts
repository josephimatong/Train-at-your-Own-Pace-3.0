/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  EMPLOYEE = 'employee',
  MANAGER = 'manager',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin'
}

export enum Language {
  EN = 'en',
  ZH = 'zh',
  MS = 'ms',
  TA = 'ta'
}

export interface VideoTutorial {
  id: string;
  title: string;
  category: string;
  module?: string;
  topic?: string;
  description: string;
  videoUrl: string;
  duration: string;
  xpValue: number;
  isCompleted?: boolean;
  quizPassed?: boolean;
  quizScore?: number;
  downloaded?: boolean;
  deadline?: string; // Date string
  cloudSource?: string; // "Google Drive", "OneDrive", "S3" or local
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Quiz {
  tutorialId: string;
  questions: QuizQuestion[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  role: string;
  site: string; // e.g., Woodlands site, Punggol site
  xp: number;
  badges: string[];
  completions: number;
  isCurrentUser?: boolean;
  email?: string;
  uid?: string;
  accessibilityRole?: string;
}

export interface SyncLogEntry {
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
}

export interface InAppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'deadline' | 'achievement' | 'sync' | 'alert';
}

export interface CollaborativeNote {
  id: string;
  tutorialId: string;
  content: string;
  lastUpdated: string;
  collaborators: {
    name: string;
    avatarColor: string;
    cursorPosition?: number;
    isEditing?: boolean;
  }[];
}

export interface CloudStorageConfig {
  id: string;
  service: 'Google Drive' | 'OneDrive' | 'AWS S3';
  connected: boolean;
  accountEmail?: string;
  lastSync?: string;
}

export const TRANSLATIONS: Record<Language, Record<string, string>> = {
  [Language.EN]: {
    appName: "Wee Hur Training Hub",
    tagline: "Train at Your Own Pace",
    searchPlaceholder: "Search tutorial topics...",
    searchBtn: "Search",
    allCategories: "All Categories",
    safety: "Safety Track",
    construction: "BIM & Integrated Digital Delivery (BIM-IDD) Track",
    equipment: "Operation Track",
    quality: "Technical Track",
    hr: "HR-Onboarding Track",
    "Safety Track": "Safety Track",
    "BIM & Integrated Digital Delivery (BIM-IDD) Track": "BIM & Integrated Digital Delivery (BIM-IDD) Track",
    "Technical Track": "Technical Track",
    "Operation Track": "Operation Track",
    "HR-Onboarding Track": "HR-Onboarding Track",
    roleLabel: "Active Role:",
    langLabel: "Language:",
    offlineMode: "Offline Mode",
    offlineActive: "Offline Mode Active (Cached Content)",
    onlineActive: "Online Mode Active",
    leaderboard: "Leaderboard",
    personalDashboard: "My Dashboard",
    managerAnalytics: "Manager Analytics",
    adminControl: "Admin Panel",
    xp: "XP",
    completed: "Completed",
    quizPassed: "Quiz Passed",
    takeQuiz: "Take Quiz",
    quizResults: "Quiz Results",
    tryAgain: "Try Again",
    correct: "Correct!",
    incorrect: "Incorrect",
    score: "Score",
    congrats: "Congratulations!",
    failedQuiz: "Quiz not passed yet. Pass with 70%+ to earn completion and XP.",
    passXp: "Earned +{xp} XP!",
    studyNotes: "Collaborative Study Notes",
    collaboratorsActive: "Collaborators Active:",
    writeNotePlaceholder: "Share key safety points and training takeaways here...",
    syncingNotes: "Syncing collaborative edits...",
    cloudStorage: "Cloud Storage Integration",
    connect: "Connect",
    disconnect: "Disconnect",
    uploadTutorial: "Upload Tutorial & Create Quiz",
    videoTitle: "Tutorial Title",
    videoDesc: "Description",
    videoCat: "Category",
    videoFile: "Video File Link or Select",
    videoFilePlaceholder: "Enter YouTube URL, MP4 link or upload via cloud below",
    quizCreator: "Create Quiz Question",
    addQuestion: "Add Question",
    publishTutorial: "Publish Tutorial",
    pushNotifications: "Push & Deadlines Center",
    upcomingDeadlines: "Upcoming Course Deadlines",
    remindMe: "Remind Me",
    simNotification: "Simulate Upcoming Deadline Check",
    analyticsOverview: "Training Analytics & Site Compliance",
    completionBySite: "Completion Progress by Site",
    completionRate: "Average Completion Rate",
    topPerformingSites: "Top Performing Sites",
    sensitiveSync: "Secure Encrypted Report Synchronization",
    syncNow: "Sync & Export Reports Now",
    syncLogs: "Cryptographic Sync Audit Logs",
    employeeName: "Employee Name",
    siteLocation: "Project Site",
    status: "Status",
    rank: "Rank",
    badges: "Badges",
    downloadForOffline: "Download Tutorial",
    downloaded: "Downloaded",
    securingPayload: "Securing report payload...",
    encryptionLog: "Encrypted using AES-256 with key: {key}",
    syncedSuccess: "Synchronized safety reports successfully.",
    welcomeUser: "Welcome",
    managerWelcome: "Team Analytics, Manager",
    adminWelcome: "System Dashboard, Administrator",
    superAdminWelcome: "Universal Control Panel, Super Administrator",
    userManagement: "User & Project Management",
    assignProject: "Assign Project Site",
    weeHurRole: "Wee Hur Job Title",
    accessibilityRights: "Accessibility Level"
  },
  [Language.ZH]: {
    appName: "伟合培训中心",
    tagline: "自主步调，高效学习",
    searchPlaceholder: "搜索教程主题...",
    searchBtn: "搜索",
    allCategories: "所有类别",
    safety: "安全轨道 (Safety)",
    construction: "BIM数字化集成交付轨道 (BIM-IDD)",
    equipment: "操作与运营轨道 (Operation)",
    quality: "技术轨道 (Technical)",
    hr: "人事入职轨道 (HR-Onboarding)",
    "Safety Track": "安全轨道 (Safety Track)",
    "BIM & Integrated Digital Delivery (BIM-IDD) Track": "BIM数字化集成交付轨道 (BIM-IDD Track)",
    "Technical Track": "技术与质量轨道 (Technical Track)",
    "Operation Track": "施工与运营轨道 (Operation Track)",
    "HR-Onboarding Track": "人事入职轨道 (HR-Onboarding Track)",
    roleLabel: "当前角色：",
    langLabel: "语言：",
    offlineMode: "离线模式",
    offlineActive: "离线模式已激活 (使用缓存内容)",
    onlineActive: "在线模式已激活",
    leaderboard: "排行榜",
    personalDashboard: "我的仪表板",
    managerAnalytics: "经理分析",
    adminControl: "管理员控制台",
    xp: "经验值 (XP)",
    completed: "已完成",
    quizPassed: "测验已通过",
    takeQuiz: "开始测验",
    quizResults: "测验结果",
    tryAgain: "再试一次",
    correct: "回答正确！",
    incorrect: "回答错误",
    score: "得分",
    congrats: "恭喜您！",
    failedQuiz: "测验未通过。获得 70% 以上的分数即可解锁完成状态并获得经验值。",
    passXp: "获得了 +{xp} XP！",
    studyNotes: "协同学习笔记",
    collaboratorsActive: "正在协同编辑：",
    writeNotePlaceholder: "在此分享关键安全要点和培训心得...",
    syncingNotes: "正在同步协作修改...",
    cloudStorage: "云存储集成",
    connect: "连接",
    disconnect: "断开连接",
    uploadTutorial: "上传视频教程与创建测验",
    videoTitle: "教程标题",
    videoDesc: "教程描述",
    videoCat: "教程类别",
    videoFile: "视频链接或选择文件",
    videoFilePlaceholder: "输入视频链接、MP4地址或从下方云盘选择",
    quizCreator: "创建测验问题",
    addQuestion: "添加问题",
    publishTutorial: "发布教程",
    pushNotifications: "推送通知与截止日期中心",
    upcomingDeadlines: "即将到来的课程截止日期",
    remindMe: "提醒我",
    simNotification: "模拟即将到来的截止日期检查",
    analyticsOverview: "培训分析与项目安全合规性",
    completionBySite: "各项目工地培训进度",
    completionRate: "平均完成率",
    topPerformingSites: "优秀项目工地",
    sensitiveSync: "敏感报告安全加密同步",
    syncNow: "立即同步并导出报告",
    syncLogs: "加密同步审计日志",
    employeeName: "员工姓名",
    siteLocation: "项目工地",
    status: "状态",
    rank: "排名",
    badges: "徽章",
    downloadForOffline: "下载教程(供离线使用)",
    downloaded: "已下载",
    securingPayload: "正在对报告数据进行安全保护...",
    encryptionLog: "使用 AES-256 密钥进行加密：{key}",
    syncedSuccess: "安全报告同步成功。",
    welcomeUser: "欢迎",
    managerWelcome: "团队数据分析，经理",
    adminWelcome: "系统管理仪表板，管理员",
    superAdminWelcome: "全权控制面板，超级管理员",
    userManagement: "用户与项目管理",
    assignProject: "指派项目工地",
    weeHurRole: "伟合职位名称",
    accessibilityRights: "权限等级"
  },
  [Language.MS]: {
    appName: "Hub Latihan Wee Hur",
    tagline: "Latih Mengikut Rentak Anda Sendiri",
    searchPlaceholder: "Cari topik tutorial...",
    searchBtn: "Cari",
    allCategories: "Semua Kategori",
    safety: "Laluan Keselamatan (Safety)",
    construction: "Laluan BIM-IDD",
    equipment: "Laluan Operasi (Operation)",
    quality: "Laluan Teknikal",
    hr: "Laluan Suai Kenal HR",
    "Safety Track": "Laluan Keselamatan (Safety Track)",
    "BIM & Integrated Digital Delivery (BIM-IDD) Track": "Laluan BIM-IDD (BIM-IDD Track)",
    "Technical Track": "Laluan Teknikal (Technical Track)",
    "Operation Track": "Laluan Operasi (Operation Track)",
    "HR-Onboarding Track": "Laluan Suai Kenal HR (HR-Onboarding Track)",
    roleLabel: "Peranan Aktif:",
    langLabel: "Bahasa:",
    offlineMode: "Mod Luar Talian",
    offlineActive: "Mod Luar Talian Aktif (Kandungan Disimpan)",
    onlineActive: "Mod Dalam Talian Aktif",
    leaderboard: "Carta Pendahulu",
    personalDashboard: "Papan Pemuka Saya",
    managerAnalytics: "Analitis Pengurus",
    adminControl: "Panel Admin",
    xp: "XP",
    completed: "Selesai",
    quizPassed: "Kuiz Lulus",
    takeQuiz: "Ambil Kuiz",
    quizResults: "Keputusan Kuiz",
    tryAgain: "Cuba Lagi",
    correct: "Betul!",
    incorrect: "Salah",
    score: "Skor",
    congrats: "Tahniah!",
    failedQuiz: "Kuiz belum lulus. Lulus dengan 70%+ untuk mendapatkan penyelesaian dan XP.",
    passXp: "Mendapat +{xp} XP!",
    studyNotes: "Nota Pembelajaran Kolaboratif",
    collaboratorsActive: "Kolaborator Aktif:",
    writeNotePlaceholder: "Kongsi perkara utama keselamatan dan pengajaran latihan di sini...",
    syncingNotes: "Menyegerakkan suntingan kolaboratif...",
    cloudStorage: "Integrasi Penyimpanan Awan",
    connect: "Sambungkan",
    disconnect: "Putuskan",
    uploadTutorial: "Muat Naik Tutorial & Buat Kuiz",
    videoTitle: "Tajuk Tutorial",
    videoDesc: "Keterangan",
    videoCat: "Kategori",
    videoFile: "Pautan Fail Video",
    videoFilePlaceholder: "Masukkan URL YouTube, pautan MP4 atau muat naik melalui awan",
    quizCreator: "Buat Soalan Kuiz",
    addQuestion: "Tambah Soalan",
    publishTutorial: "Terbitkan Tutorial",
    pushNotifications: "Pusat Pemberitahuan & Tarikh Akhir",
    upcomingDeadlines: "Tarikh Akhir Kursus Akan Datang",
    remindMe: "Ingatkan Saya",
    simNotification: "Simulasikan Semakan Tarikh Akhir",
    analyticsOverview: "Analitis Latihan & Pematuhan Tapak",
    completionBySite: "Kemajuan Penyelesaian Mengikut Tapak",
    completionRate: "Kadar Penyelesaian Purata",
    topPerformingSites: "Tapak Berprestasi Tinggi",
    sensitiveSync: "Penyegerakan Laporan Sensitif Dekripsi Selamat",
    syncNow: "Segerakkan & Eksport Laporan Sekarang",
    syncLogs: "Log Audit Penyegerakan Kriptografi",
    employeeName: "Nama Pekerja",
    siteLocation: "Tapak Projek",
    status: "Status",
    rank: "Pangkat",
    badges: "Lencana",
    downloadForOffline: "Muat Turun Tutorial",
    downloaded: "Telah Dimuat Turun",
    securingPayload: "Mengamankan data laporan...",
    encryptionLog: "Disandarkan menggunakan AES-256 dengan kunci: {key}",
    syncedSuccess: "Laporan keselamatan berjaya disegerakkan.",
    welcomeUser: "Selamat Datang",
    managerWelcome: "Analitis Pasukan, Pengurus",
    adminWelcome: "Papan Pemuka Sistem, Administrator",
    superAdminWelcome: "Panel Kawalan Sejagat, Super Administrator",
    userManagement: "Pengurusan Pengguna & Projek",
    assignProject: "Tugaskan Tapak Projek",
    weeHurRole: "Gelaran Kerja Wee Hur",
    accessibilityRights: "Tahap Kebolehcapaian"
  },
  [Language.TA]: {
    appName: "வீ ஹர் பயிற்சி மையம்",
    tagline: "உங்கள் சொந்த வேகத்தில் பயிற்சி பெறுங்கள்",
    searchPlaceholder: "பயிற்சி தலைப்புகளைத் தேடுங்கள்...",
    searchBtn: "தேடு",
    allCategories: "அனைத்து பிரிவுகள்",
    safety: "பாதுகாப்பு தடம் (Safety)",
    construction: "BIM-IDD தடம்",
    equipment: "செயல்பாட்டு தடம் (Operation)",
    quality: "தொழில்நுட்ப தடம்",
    hr: "மனிதவள ஆன் போர்டிங் தடம்",
    "Safety Track": "பாதுகாப்பு தடம் (Safety Track)",
    "BIM & Integrated Digital Delivery (BIM-IDD) Track": "BIM-IDD தடம் (BIM-IDD Track)",
    "Technical Track": "தொழில்நுட்ப தடம் (Technical Track)",
    "Operation Track": "செயல்பாட்டு தடம் (Operation Track)",
    "HR-Onboarding Track": "மனிதவள ஆன் போர்டிங் தடம் (HR-Onboarding Track)",
    roleLabel: "செயலில் உள்ள பங்கு:",
    langLabel: "மொழி:",
    offlineMode: "ஆஃப்லைன் பயன்முறை",
    offlineActive: "ஆஃப்லைன் பயன்முறை செயலில் உள்ளது (சேமிக்கப்பட்ட உள்ளடக்கம்)",
    onlineActive: "ஆன்லைன் பயன்முறை செயலில் உள்ளது",
    leaderboard: "முன்னணி பலகை",
    personalDashboard: "எனது டாஷ்போர்டு",
    managerAnalytics: "மேலாளர் பகுப்பாய்வு",
    adminControl: "நிர்வாகி பேனல்",
    xp: "எக்ஸ்பி (XP)",
    completed: "முடிந்தது",
    quizPassed: "தேர்வில் வெற்றி",
    takeQuiz: "தேர்வு எழுதுக",
    quizResults: "தேர்வு முடிவுகள்",
    tryAgain: "மீண்டும் முயற்சி",
    correct: "சரி!",
    incorrect: "தவறு",
    score: "மதிப்பெண்",
    congrats: "வாழ்த்துகள்!",
    failedQuiz: "தேர்வில் இன்னும் தேர்ச்சி பெறவில்லை. முடிக்கவும் XP பெறவும் 70%+ மதிப்பெண் பெறவும்.",
    passXp: "+{xp} XP பெறப்பட்டது!",
    studyNotes: "கூட்டு கூட்டு ஆய்வு குறிப்புகள்",
    collaboratorsActive: "கூட்டுப்பணியாளர்கள் செயலில் உள்ளனர்:",
    writeNotePlaceholder: "முக்கிய பாதுகாப்பு குறிப்புகள் மற்றும் பயிற்சி கருத்துகளை இங்கே பகிர்ந்து கொள்ளுங்கள்...",
    syncingNotes: "கூட்டு திருத்தங்களை ஒத்திசைக்கிறது...",
    cloudStorage: "கிளவுட் ஸ்டோரேஜ் இணைப்பு",
    connect: "இணை",
    disconnect: "இணைப்பை துண்டி",
    uploadTutorial: "டுடோரியலைப் பதிவேற்றி வினாடி வினாவை உருவாக்குங்கள்",
    videoTitle: "தலைப்பு",
    videoDesc: "விளக்கம்",
    videoCat: "வகை",
    videoFile: "வீடியோ கோப்பு இணைப்பு",
    videoFilePlaceholder: "யூடியூப் அல்லது எம்பி4 இணைப்பை உள்ளிடவும்",
    quizCreator: "வினாடி வினா கேள்வியை உருவாக்குங்கள்",
    addQuestion: "கேள்வி சேர்",
    publishTutorial: "பயிற்சியை வெளியிடு",
    pushNotifications: "அறிவிப்புகள் மற்றும் காலக்கெடு மையம்",
    upcomingDeadlines: "வரவிருக்கும் பாட காலக்கெடு",
    remindMe: "நினைவூட்டு",
    simNotification: "காலக்கெடுவை சரிபார்க்கவும்",
    analyticsOverview: "பயிற்சி பகுப்பாய்வு மற்றும் தள இணக்கம்",
    completionBySite: "தள வாரியாக பயிற்சி முடித்தல்",
    completionRate: "சராசரி நிறைவு விகிதம்",
    topPerformingSites: "சிறந்த கட்டுமான தளங்கள்",
    sensitiveSync: "பாதுகாப்பான குறியாக்கப்பட்ட ஒத்திசைவு",
    syncNow: "அறிக்கைகளை ஒத்திசைத்து ஏற்றுமதி செய்",
    syncLogs: "கிரிப்டோகிராஃபிக் தணிக்கை பதிவுகள்",
    employeeName: "பணியாளர் பெயர்",
    siteLocation: "கட்டுமான தளம்",
    status: "நிலை",
    rank: "தரவரிசை",
    badges: "பேட்ஜ்கள்",
    downloadForOffline: "பதிவிறக்கு",
    downloaded: "பதிவிறக்கம் செய்யப்பட்டது",
    securingPayload: "அறிக்கை தரவைப் பாதுகாக்கிறது...",
    encryptionLog: "AES-256 குறியாக்க விசை: {key}",
    syncedSuccess: "பாதுகாப்பு அறிக்கைகள் வெற்றிகரமாக ஒத்திசைக்கப்பட்டன.",
    welcomeUser: "வரவேற்கிறோம்",
    managerWelcome: "குழு பகுப்பாய்வு, மேலாளர்",
    adminWelcome: "நிர்வாக டாஷ்போர்டு",
    superAdminWelcome: "உலகளாவிய கட்டுப்பாட்டு குழு, சூப்பர் நிர்வாகி",
    userManagement: "பயனர் & திட்ட மேலாண்மை",
    assignProject: "திட்ட தளத்தை ஒதுக்குங்கள்",
    weeHurRole: "வீ ஹர் பணித் தலைப்பு",
    accessibilityRights: "அணுகல் நிலை"
  }
};
