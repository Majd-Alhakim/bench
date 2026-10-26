# S-4, read-only half: for every running claude.exe, walk up its parents to the process that owns a visible top-level
# window, and report the host kind. Nothing is focused, moved or clicked. Window titles are not printed (they can
# name private projects); only whether a title exists and how long it is.
Add-Type @"
using System;
using System.Collections.Generic;
using System.Runtime.InteropServices;
using System.Text;
public static class W {
  public delegate bool EnumProc(IntPtr h, IntPtr l);
  [DllImport("user32.dll")] public static extern bool EnumWindows(EnumProc f, IntPtr l);
  [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr h);
  [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr h, out uint pid);
  [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr h);
  [DllImport("user32.dll")] public static extern IntPtr GetWindow(IntPtr h, uint cmd);
  public static Dictionary<uint, List<IntPtr>> TopWindowsByPid() {
    var d = new Dictionary<uint, List<IntPtr>>();
    EnumWindows((h, l) => {
      if (IsWindowVisible(h) && GetWindow(h, 4) == IntPtr.Zero) {
        uint pid; GetWindowThreadProcessId(h, out pid);
        if (!d.ContainsKey(pid)) d[pid] = new List<IntPtr>();
        d[pid].Add(h);
      }
      return true;
    }, IntPtr.Zero);
    return d;
  }
}
"@
$procs = @{}; Get-CimInstance Win32_Process | ForEach-Object { $procs[[uint32]$_.ProcessId] = $_ }
$wins = [W]::TopWindowsByPid()
$hostKinds = @{ 'WindowsTerminal.exe' = 'Windows Terminal'; 'OpenConsole.exe' = 'Windows Terminal (OpenConsole)'; 'conhost.exe' = 'conhost'; 'Code.exe' = 'VS Code'; 'Code - Insiders.exe' = 'VS Code Insiders'; 'Claude.exe' = 'Claude desktop app'; 'Cursor.exe' = 'Cursor'; 'idea64.exe' = 'JetBrains' }
$rows = foreach ($p in $procs.Values | Where-Object { $_.Name -eq 'claude.exe' }) {
  $chain = @(); $cur = $p; $found = $null; $seen = @{}
  while ($cur -and -not $seen.ContainsKey($cur.ProcessId)) {
    $seen[$cur.ProcessId] = 1
    $chain += $cur.Name
    if ($wins.ContainsKey([uint32]$cur.ProcessId) -and $cur.ProcessId -ne $p.ProcessId) { $found = $cur; break }
    $cur = $procs[[uint32]$cur.ParentProcessId]
  }
  # A console window belongs to conhost/OpenConsole, which is not in the parent chain: look for one attached to the chain.
  $console = $null
  if (-not $found) {
    $console = $procs.Values | Where-Object { $_.Name -in 'conhost.exe', 'OpenConsole.exe' -and $seen.ContainsKey($_.ParentProcessId) -and $wins.ContainsKey([uint32]$_.ProcessId) } | Select-Object -First 1
  }
  $w = if ($found) { $wins[[uint32]$found.ProcessId] } elseif ($console) { $wins[[uint32]$console.ProcessId] } else { @() }
  $owner = if ($found) { $found.Name } elseif ($console) { $console.Name } else { '' }
  [pscustomobject]@{
    claude_pid   = $p.ProcessId
    chain        = ($chain -join ' < ')
    host         = if ($hostKinds.ContainsKey($owner)) { $hostKinds[$owner] } elseif ($owner) { $owner } else { '(none: headless or background)' }
    windows      = $w.Count
    title_length = if ($w.Count) { [W]::GetWindowTextLength($w[0]) } else { 0 }
  }
}
$rows | Sort-Object host | Format-Table -AutoSize | Out-String -Width 220
