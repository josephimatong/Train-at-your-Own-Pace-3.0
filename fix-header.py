import re

with open('src/components/HeaderControls.tsx', 'r') as f:
    content = f.read()

desktop_role_switcher = """            {/* Role Switcher */}
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-slate-400" />
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="bg-slate-950 text-slate-200 border border-slate-800 text-xs rounded-md px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-cyan-500 cursor-pointer"
              >
                <option value={UserRole.EMPLOYEE}>Employee View</option>
                <option value={UserRole.MANAGER}>Manager View</option>
                <option value={UserRole.ADMIN}>Admin View</option>
                <option value={UserRole.SUPER_ADMIN}>Super Admin View</option>
              </select>
            </div>"""

content = re.sub(r'\{\/\* Role Switcher removed for security \*\/\}', desktop_role_switcher, content, count=1)

mobile_role_switcher = """              {/* Role Switcher */}
              <div className="space-y-1">
                <label htmlFor="role-select-mobile" className="block text-[9px] font-bold text-slate-500 uppercase tracking-widest font-mono">View As</label>
                <div className="flex items-center gap-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5">
                  <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <select
                    id="role-select-mobile"
                    value={currentRole}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full bg-transparent text-slate-300 text-xs focus:outline-none cursor-pointer"
                  >
                    <option value={UserRole.EMPLOYEE}>Employee</option>
                    <option value={UserRole.MANAGER}>Manager</option>
                    <option value={UserRole.ADMIN}>Admin</option>
                    <option value={UserRole.SUPER_ADMIN}>Super Admin</option>
                  </select>
                </div>
              </div>"""

content = re.sub(r'\{\/\* Role Switcher removed for security \*\/\}', mobile_role_switcher, content, count=1)

with open('src/components/HeaderControls.tsx', 'w') as f:
    f.write(content)
