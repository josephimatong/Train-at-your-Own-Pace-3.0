const fs = require('fs');

let content = fs.readFileSync('src/lib/firebaseSync.ts', 'utf8');

// We want to add a realtime listener function for the leaderboard
const newFunc = `
export function subscribeToLeaderboard(callback: (entries: any[]) => void) {
  const usersColl = collection(db, 'users');
  const unsubscribe = onSnapshot(usersColl, (qSnap) => {
    const entries: any[] = [];
    qSnap.forEach((docSnap) => {
      const data = docSnap.data();
      entries.push({
        name: data.displayName || data.email?.split('@')[0] || 'Learning Officer',
        email: data.email || 'officer@weehur.com.sg',
        xp: data.xp || 0,
        completions: data.completions || 0,
        badges: data.badges || [],
        uid: data.uid,
        role: data.weeHurRole || 'Structural Supervisor',
        site: data.project || 'Kovan Residential',
        accessibilityRole: data.role || 'employee'
      });
    });
    callback(entries);
  }, (error) => {
    console.error("Leaderboard subscription error:", error);
  });
  return unsubscribe;
}
`;

if (!content.includes('subscribeToLeaderboard')) {
  // Add onSnapshot to imports
  if (!content.includes('onSnapshot')) {
    content = content.replace("getDoc,", "getDoc, onSnapshot,");
  }
  content = content + newFunc;
  fs.writeFileSync('src/lib/firebaseSync.ts', content);
  console.log("Added subscribeToLeaderboard");
}
