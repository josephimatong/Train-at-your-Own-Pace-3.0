const fs = require('fs');
let code = fs.readFileSync('src/components/UserManagement.tsx', 'utf8');

const statsColStart = `                    {/* Training Progress (XP / completions) */}`;
const statusCol = `                    {/* User Status */}
                    <td className="px-5 py-4">
                      <span className={\`inline-flex items-center justify-center px-2 py-1 rounded border text-[10px] font-bold font-mono tracking-wide \${statusColor}\`}>
                        {statusLabel}
                      </span>
                    </td>
                    
                    {/* Training Progress (XP / completions) */}`;

if (!code.includes('{/* User Status */}')) {
  code = code.replace(statsColStart, statusCol);
  fs.writeFileSync('src/components/UserManagement.tsx', code);
}

