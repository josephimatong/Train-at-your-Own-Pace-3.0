const fs = require('fs');
let code = fs.readFileSync('src/components/UserManagement.tsx', 'utf8');

// Replace header
code = code.replace(
  '<th className="px-5 py-4">Accessibility Rights</th>\n                <th className="px-5 py-4">Status</th>\n                <th className="px-5 py-4">Training Stats</th>',
  '<th className="px-5 py-4">Accessibility Rights</th>\n                <th className="px-5 py-4">Invitation</th>\n                <th className="px-5 py-4">Last Active</th>\n                <th className="px-5 py-4">Training Stats</th>'
);

const oldStatusCol = `                    {/* User Status */}
                    <td className="px-5 py-4">
                      <span className={\`inline-flex items-center justify-center px-2 py-1 rounded border text-[10px] font-bold font-mono tracking-wide \${statusColor}\`}>
                        {statusLabel}
                      </span>
                    </td>
                    
                    {/* Training Progress (XP / completions) */}`;

const newStatusCols = `                    {/* Invitation Status */}
                    <td className="px-5 py-4">
                      <span className={\`inline-flex items-center justify-center px-2 py-1 rounded border text-[10px] font-bold font-mono tracking-wide \${isInviteAccepted ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20'}\`}>
                        {isInviteAccepted ? 'Accepted' : 'Pending'}
                      </span>
                    </td>
                    
                    {/* Last Active */}
                    <td className="px-5 py-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-slate-300">
                          {lastActiveStr ? new Date(lastActiveStr).toLocaleDateString() : 'N/A'}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {isInviteAccepted ? (lastActiveStr ? \`\${Math.floor((new Date().getTime() - new Date(lastActiveStr).getTime()) / (1000 * 3600 * 24))} days ago\` : 'Legacy User') : '-'}
                        </span>
                      </div>
                    </td>
                    
                    {/* Training Progress (XP / completions) */}`;

code = code.replace(oldStatusCol, newStatusCols);

fs.writeFileSync('src/components/UserManagement.tsx', code);
