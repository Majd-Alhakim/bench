# SP-H1 admin-lock test. Runs ELEVATED (one UAC prompt), only after the founder approved it.
# It writes, in three phases, then always removes:
#   C:\Program Files\EucasSpike\limits\eucas-guard.exe          (the spike guard, admin-writable only)
#   phase "file":     C:\Program Files\ClaudeCode\managed-settings.json
#   phase "registry": HKLM\SOFTWARE\Policies\ClaudeCode  value "Settings" (REG_SZ, the same JSON)
#   phase "both":     both of the above
# The managed entry is a PreToolUse hook to the spike guard with --spike-only (a no-op in every session that is not a
# spike test session) plus one deny rule that matches only a made-up remote. Between phases it waits for the
# non-elevated harness to write <phase>.done. Whatever happens (error, timeout after 15 minutes), the finally block
# removes everything it created and writes what it verified to removed.json.
param([Parameter(Mandatory)][string]$SpikeDir)
$ErrorActionPreference = 'Stop'
$flags = Join-Path $SpikeDir 'admin-flags'
New-Item -ItemType Directory -Force $flags | Out-Null
$limitsDir = 'C:\Program Files\EucasSpike\limits'
$guard = Join-Path $limitsDir 'eucas-guard.exe'
$ccDir = 'C:\Program Files\ClaudeCode'
$file = Join-Path $ccDir 'managed-settings.json'
$key = 'HKLM:\SOFTWARE\Policies\ClaudeCode'
$ccDirExisted = Test-Path $ccDir
$keyExisted = Test-Path $key
if ((Test-Path $file) -or ($keyExisted -and (Get-ItemProperty $key -Name Settings -ErrorAction SilentlyContinue))) {
  'An organisation or another tool already has managed settings here; stopping without changes.' | Set-Content (Join-Path $flags 'refused.txt')
  exit 1
}
$settings = @{
  hooks = @{ PreToolUse = @(@{ matcher = '*'; hooks = @(@{ type = 'command'; command = $guard; args = @('pre-tool-use', '--spike-only'); timeout = 10; onFailure = 'block' }) }) }
  permissions = @{ deny = @('Bash(git push eucas-spike-remote main)') }
} | ConvertTo-Json -Depth 8
$deadline = (Get-Date).AddMinutes(15)
function Wait-Done($phase) {
  "ready" | Set-Content (Join-Path $flags "$phase.ready")
  while (-not (Test-Path (Join-Path $flags "$phase.done"))) {
    if ((Get-Date) -gt $deadline) { throw "timeout in phase $phase" }
    Start-Sleep -Milliseconds 300
  }
}
function Clear-Sources {
  if (Test-Path $file) { Remove-Item $file -Force }
  if ((Test-Path $key) -and -not $keyExisted) { Remove-Item $key -Force }
  elseif (Test-Path $key) { Remove-ItemProperty $key -Name Settings -ErrorAction SilentlyContinue }
}
try {
  New-Item -ItemType Directory -Force $limitsDir | Out-Null
  Copy-Item (Join-Path $SpikeDir 'target\release\eucas-guard.exe') $guard -Force
  New-Item -ItemType Directory -Force $ccDir | Out-Null

  Set-Content -Path $file -Value $settings -Encoding UTF8
  Wait-Done 'file'

  Clear-Sources
  New-Item -Path $key -Force | Out-Null
  New-ItemProperty -Path $key -Name Settings -Value $settings -PropertyType String -Force | Out-Null
  Wait-Done 'registry'

  Set-Content -Path $file -Value $settings -Encoding UTF8
  Wait-Done 'both'
}
catch { $_.ToString() | Set-Content (Join-Path $flags 'error.txt') }
finally {
  Clear-Sources
  if (Test-Path $limitsDir) { Remove-Item 'C:\Program Files\EucasSpike' -Recurse -Force }
  if (-not $ccDirExisted -and (Test-Path $ccDir) -and -not (Get-ChildItem $ccDir -Force)) { Remove-Item $ccDir -Force }
  @{
    file_gone = -not (Test-Path $file)
    registry_gone = -not (Test-Path $key) -or -not (Get-ItemProperty $key -Name Settings -ErrorAction SilentlyContinue)
    eucas_spike_dir_gone = -not (Test-Path 'C:\Program Files\EucasSpike')
    claudecode_dir_gone_or_preexisting = $ccDirExisted -or -not (Test-Path $ccDir)
  } | ConvertTo-Json | Set-Content (Join-Path $flags 'removed.json')
}
