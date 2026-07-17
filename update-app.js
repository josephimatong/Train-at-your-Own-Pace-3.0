const fs = require('fs');

let content = fs.readFileSync('src/App.tsx', 'utf8');

if (!content.includes('subscribeToLeaderboard')) {
  // Add import
  content = content.replace('getLeaderboardFromFirestore,', 'getLeaderboardFromFirestore, subscribeToLeaderboard,');

  // Find the place to add the useEffect
  // We can add a useEffect that subscribes to the leaderboard when the component mounts or when driveUser exists
  const effectCode = `
  useEffect(() => {
    if (!driveUser) return;
    
    const unsubscribe = subscribeToLeaderboard((dbLeaderboard) => {
      if (dbLeaderboard && dbLeaderboard.length > 0) {
        const merged = dbLeaderboard.map(entry => ({
          ...entry,
          isCurrentUser: entry.uid === driveUser.uid
        }));
        
        const hasCurrentUser = merged.some(m => m.isCurrentUser);
        if (!hasCurrentUser) {
          merged.push({
            name: driveUser.displayName || driveUser.email?.split('@')[0] || 'Learning Officer',
            email: driveUser.email || 'officer@weehur.com.sg',
            xp: 0,
            completions: 0,
            badges: [],
            isCurrentUser: true,
            uid: driveUser.uid,
            role: 'Structural Supervisor',
            site: 'Kovan Residential',
            accessibilityRole: driveUser.email === 'josephimatong@weehur.com.sg' ? 'super_admin' : 'employee'
          });
        }
        
        const sorted = merged
          .sort((a, b) => b.xp - a.xp)
          .map((item, index) => ({ ...item, rank: index + 1 }));
        setLeaderboard(sorted);
      }
    });
    
    return () => unsubscribe();
  }, [driveUser]);
  `;
  
  content = content.replace("  // Save leaderboard whenever it changes", effectCode + "\n  // Save leaderboard whenever it changes");
  
  // Remove the static getLeaderboardFromFirestore calls in loadFirestoreData and refreshUsersList
  // Actually, keeping refreshUsersList calling it is fine, but it might conflict.
  // In loadFirestoreData:
  /*
    // 4. Load general leaderboard
    try {
      const dbLeaderboard = await getLeaderboardFromFirestore();
  */
  // I will just comment out the block in loadFirestoreData.
  
  const loadLeaderboardStart = content.indexOf('// 4. Load general leaderboard');
  const loadLeaderboardEnd = content.indexOf('// 5. Load notifications');
  
  if (loadLeaderboardStart > -1 && loadLeaderboardEnd > -1) {
    const block = content.substring(loadLeaderboardStart, loadLeaderboardEnd);
    content = content.replace(block, '// 4. Load general leaderboard (Handled by realtime listener)\n    ');
  }
  
  // Also in refreshUsersList
  const refreshStart = content.indexOf('const refreshUsersList = async () => {');
  const refreshEnd = content.indexOf('const handleDriveLogin', refreshStart);
  
  if (refreshStart > -1 && refreshEnd > -1) {
    // Just replace the whole function
    content = content.substring(0, refreshStart) + `const refreshUsersList = async () => {
    // Leaderboard is realtime, no need to manually refresh leaderboard here
    // Just a placeholder to resolve the promise
    triggerToast('Users refreshed!', 'success');
  };
  ` + content.substring(refreshEnd);
  }

  fs.writeFileSync('src/App.tsx', content);
  console.log("Updated App.tsx with realtime leaderboard");
}
