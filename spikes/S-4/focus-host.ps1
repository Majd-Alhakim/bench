# S-4, the half that changes the screen (run it yourself, from a terminal): bring the window hosting one Claude Code
# session to the front, and print the tab or console title that names the session.
#   powershell -ExecutionPolicy Bypass -File focus-host.ps1 -ClaudePid 12345
# Find the pid with find-host.ps1 (read-only). Nothing is clicked or typed.
param([Parameter(Mandatory)][int]$ClaudePid)
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;
public static class F {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern IntPtr GetWindow(IntPtr h, uint cmd);
  [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr h);
  [DllImport("user32.dll")] public static extern bool ShowWindow(IntPtr h, int cmd);
  [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr h);
  [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
  public static IntPtr TopWindowOf(uint pid) {
    IntPtr found = IntPtr.Zero;
    EnumWindows((h, l) => { uint p; GetWindowThreadProcessId(h, out p);
      if (p == pid && IsWindowVisible(h) && GetWindow(h, 4) == IntPtr.Zero) { found = h; return false; } return true; }, IntPtr.Zero);
    return found;
  }
}
"@
$procs = @{}; Get-CimInstance Win32_Process | ForEach-Object { $procs[[int]$_.ProcessId] = $_ }
$cur = $procs[$ClaudePid]; $hwnd = [IntPtr]::Zero; $owner = $null; $seen = @{}
while ($cur -and -not $seen.ContainsKey($cur.ProcessId)) {
  $seen[$cur.ProcessId] = 1
  if ($cur.ProcessId -ne $ClaudePid) { $h = [F]::TopWindowOf([uint32]$cur.ProcessId); if ($h -ne [IntPtr]::Zero) { $hwnd = $h; $owner = $cur.Name; break } }
  $cur = $procs[[int]$cur.ParentProcessId]
}
if ($hwnd -eq [IntPtr]::Zero) {
  $con = $procs.Values | Where-Object { $_.Name -in 'conhost.exe', 'OpenConsole.exe' -and $seen.ContainsKey($_.ParentProcessId) } | Select-Object -First 1
  if ($con) { $hwnd = [F]::TopWindowOf([uint32]$con.ProcessId); $owner = $con.Name }
}
# The console title is what Windows Terminal shows on the session's tab (read in a child, which owns no console).
$title = powershell -NoProfile -Command "Add-Type -TypeDefinition @'
using System; using System.Runtime.InteropServices; using System.Text;
public static class C { [DllImport(""kernel32.dll"")] public static extern bool FreeConsole(); [DllImport(""kernel32.dll"")] public static extern bool AttachConsole(uint p); [DllImport(""kernel32.dll"")] public static extern uint GetConsoleTitle(StringBuilder b, uint n);
public static string T(uint p){ FreeConsole(); if(!AttachConsole(p)) return """"; var b=new StringBuilder(512); GetConsoleTitle(b,512); return b.ToString(); } }
'@; [C]::T($ClaudePid)" 2>$null
if ($hwnd -eq [IntPtr]::Zero) { "No window found for pid $ClaudePid (headless or background session). Tab/console title: '$title'"; exit 1 }
if ([F]::IsIconic($hwnd)) { [void][F]::ShowWindow($hwnd, 9) }
$ok = [F]::SetForegroundWindow($hwnd)
Start-Sleep -Milliseconds 300
[pscustomobject]@{ host = $owner; focused = ($ok -and [F]::GetForegroundWindow() -eq $hwnd); tab_or_console_title = $title } | Format-List
