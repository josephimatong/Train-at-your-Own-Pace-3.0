const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

code = code.replace(
  /console\.error\(\`Error reading file \$\{file\.name\}\:\`, e\);/g,
  "console.error(`Error reading file ${file.name}:`, e.message || 'Unknown error');"
);

code = code.replace(
  /console\.error\('Drive context error:', e\);/g,
  "console.warn('Drive context unavailable:', e.message || 'Invalid or expired token');"
);

fs.writeFileSync('server.ts', code);
