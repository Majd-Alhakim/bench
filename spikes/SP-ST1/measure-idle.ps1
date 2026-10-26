# Idle footprint of a process tree: the root plus every descendant (WebView2 or Chromium helpers).
# Reports private working set (what Task Manager calls "Memory") and CPU time used over the sample window.
param([Parameter(Mandatory)][string]$Root, [int]$Seconds = 60)

function Get-Tree([int]$rootId) {
  $all = Get-CimInstance Win32_Process | Select-Object ProcessId, ParentProcessId, Name
  $ids = [System.Collections.Generic.List[int]]::new(); $ids.Add($rootId)
  $grew = $true
  while ($grew) {
    $grew = $false
    foreach ($p in $all) { if ($ids.Contains([int]$p.ParentProcessId) -and -not $ids.Contains([int]$p.ProcessId)) { $ids.Add([int]$p.ProcessId); $grew = $true } }
  }
  return $ids
}

$rootProc = Get-Process -Name $Root -ErrorAction Stop | Sort-Object StartTime | Select-Object -First 1
$ids = Get-Tree $rootProc.Id
$procs = $ids | ForEach-Object { Get-Process -Id $_ -ErrorAction SilentlyContinue }
$cpu0 = ($procs | ForEach-Object { $_.TotalProcessorTime.TotalMilliseconds } | Measure-Object -Sum).Sum
Start-Sleep -Seconds $Seconds
$procs = $ids | ForEach-Object { Get-Process -Id $_ -ErrorAction SilentlyContinue }
$cpu1 = ($procs | ForEach-Object { $_.TotalProcessorTime.TotalMilliseconds } | Measure-Object -Sum).Sum
$priv = ($ids | ForEach-Object {
    (Get-CimInstance Win32_PerfFormattedData_PerfProc_Process -Filter "IDProcess=$_" -ErrorAction SilentlyContinue).WorkingSetPrivate
  } | Measure-Object -Sum).Sum
$ws = ($procs | Measure-Object -Property WorkingSet64 -Sum).Sum
$cores = [Environment]::ProcessorCount
[pscustomobject]@{
  root            = $Root
  processes       = $procs.Count
  privateWS_MB    = [math]::Round($priv / 1MB, 1)
  workingSet_MB   = [math]::Round($ws / 1MB, 1)
  cpu_ms_in_window = [math]::Round($cpu1 - $cpu0, 0)
  cpu_pct_of_one_core = [math]::Round(100 * ($cpu1 - $cpu0) / ($Seconds * 1000), 2)
  cores           = $cores
} | ConvertTo-Json
