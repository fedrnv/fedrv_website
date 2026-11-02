#!/usr/bin/env bash
set -euo pipefail
umask 022

die() { printf '%s\n' "$*" >&2; exit 1; }
mode=${1:?mode required}
root=${2:?deployment root required}
release=${3:?release identifier required}
[[ "$root" =~ ^(/[A-Za-z0-9._-]+){2,}$ ]] || die 'Invalid deployment root'
[[ ! "$root" =~ /\.{1,2}(/|$) ]] || die 'Dot segments are forbidden'
[[ "$release" =~ ^[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || die 'Invalid release identifier'
[[ -d "$root" && ! -L "$root" ]] || die 'Provision a real deployment root directory first'
root=$(cd -- "$root" && pwd -P)
for name in incoming releases .deploy-state; do
  [[ ! -L "$root/$name" ]] || die 'Deployment directories must not be symlinks'
  [[ ! -e "$root/$name" || -d "$root/$name" ]] || die 'Invalid deployment directory'
done
mkdir -p -- "$root/incoming" "$root/releases" "$root/.deploy-state"
incoming="$root/incoming/$release"
target="releases/$release"
state="$root/.deploy-state/$release"

if [[ "$mode" == prepare ]]; then
  [[ ! -e "$root/releases/$release" && ! -e "$state" ]] || die 'Release already exists'
  mkdir -- "$incoming"
  exit 0
fi

[[ "$mode" == activate || "$mode" == rollback ]] || die 'Unknown publication mode'
lock="$root/.publish-lock"
mkdir -- "$lock" 2>/dev/null || die 'Another publisher owns the lock; inspect it before retrying'
trap 'rmdir -- "$lock"' EXIT

current='-'
if [[ -e "$root/current" || -L "$root/current" ]]; then
  [[ -L "$root/current" ]] || die 'current must be an owned release symlink, not a real directory'
  current=$(readlink "$root/current")
  [[ "$current" =~ ^releases/[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || die 'current points outside the release contract'
fi

if [[ "$mode" == rollback ]]; then
  if [[ "$current" != "$target" ]]; then
    [[ ! -e "$state" ]] && exit 0
    [[ -f "$state" && ! -L "$state" ]] || die 'Invalid recovery state'
    [[ "$current" == "$(cat -- "$state")" ]] && exit 0
    die 'A different release is active; refusing to overwrite it'
  fi
  [[ -f "$state" && ! -L "$state" ]] || die 'Missing recovery state'
  previous=$(cat -- "$state")
  if [[ "$previous" == '-' ]]; then
    rm -- "$root/current"
  else
    [[ "$previous" =~ ^releases/[a-f0-9]{40}-[0-9]+-[0-9]+$ ]] || die 'Invalid recovery target'
    [[ -f "$root/$previous/index.html" ]] || die 'Previous release is unavailable'
    ln -s -- "$previous" "$root/.current-$release"
    mv -Tf -- "$root/.current-$release" "$root/current"
  fi
  printf '%s\n' 'Previous release restored'
  exit 0
fi

checksum=${4:?archive checksum required}
[[ "$checksum" =~ ^[a-f0-9]{64}$ ]] || die 'Invalid checksum'
[[ -d "$incoming" && ! -L "$incoming" ]] || die 'Missing upload directory'
[[ -f "$incoming/site.tar.gz" && ! -L "$incoming/site.tar.gz" ]] || die 'Missing uploaded archive'
[[ ! -e "$root/releases/$release" && ! -e "$state" ]] || die 'Release already exists'
printf '%s  %s\n' "$checksum" "$incoming/site.tar.gz" | sha256sum --check --status || die 'Archive checksum mismatch'

# The SSH-bound checksum authenticates the runner's package. Also reject unsafe tar entries.
tar -tzf "$incoming/site.tar.gz" > "$incoming/entries"
while IFS= read -r entry; do
  [[ "$entry" =~ ^(\./)?[A-Za-z0-9._/-]+$ ]] || die 'Unsupported archive path'
  [[ "$entry" != /* && ! "$entry" =~ (^|/)\.\.(/|$) ]] || die 'Unsafe archive path'
done < "$incoming/entries"
tar -tvzf "$incoming/site.tar.gz" > "$incoming/types"
while IFS= read -r entry; do
  [[ "$entry" == d* || "$entry" == -* ]] || die 'Only regular files and directories may be published'
done < "$incoming/types"
mkdir -- "$incoming/site"
tar -xzf "$incoming/site.tar.gz" --no-same-owner --no-same-permissions -C "$incoming/site"
[[ -f "$incoming/site/index.html" && -f "$incoming/site/404.html" && -f "$incoming/site/deployment.json" ]] || die 'Incomplete static site package'
find "$incoming/site" -type d -exec chmod 0755 {} +
find "$incoming/site" -type f -exec chmod 0644 {} +
mv -- "$incoming/site" "$root/releases/$release"
printf '%s\n' "$current" > "$state"
ln -s -- "$target" "$root/.current-$release"
mv -Tf -- "$root/.current-$release" "$root/current"
rm -- "$incoming/site.tar.gz" "$incoming/entries" "$incoming/types"
rmdir -- "$incoming"
printf '%s\n' "Activated $release"
