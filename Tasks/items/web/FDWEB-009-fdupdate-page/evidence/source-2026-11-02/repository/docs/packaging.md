# FDUpdater native packages

FDUpdater packages are built offline from the two release binaries and checked-in
installer sources. The builder writes deterministic `.tar.gz` for Linux and `.zip`
for Windows. Every payload has a strict manifest and SHA-256 inventory. Packages
contain no credential, private key, product registration, application data or
pre-authorized target.

Build the native binaries and one package from the repository root:

```text
cargo +1.98.0 build --release --locked -p fdupdater -p fdupdater-bootstrap
node scripts/package-fdupdater.mjs --platform windows --architecture x86_64 --version 0.1.0 --fdupdater target/release/FDUpdater.exe --bootstrap target/release/FDUpdaterBootstrap.exe --output dist
```

Use `--platform linux` and extensionless binary paths on Linux. Building identical
inputs twice produces byte-identical archives on the same platform. Release
publication must authenticate the archive separately; the embedded hashes detect
damage but are not a release signature.

After extraction, run the installer from an elevated PowerShell on Windows:

```text
./install.ps1 install
./install.ps1 status
./install.ps1 upgrade
./install.ps1 repair
./install.ps1 uninstall
```

Run the corresponding commands as root on a systemd Linux host:

```text
./install.sh install
./install.sh status
./install.sh upgrade
./install.sh repair
./install.sh uninstall
```

Installation creates the automatic `FDUpdater` service under the virtual Windows
service identity `NT SERVICE\FDUpdater` or the non-root Linux account `fdupdater`.
The binary directory is administrator-owned and read-only to the service. Only the
state directory is service-writable. The configuration directory is readable by
the service and contains a placeholder-only template. Before `install`, an
administrator must create the strict `FDUpdater.json`, credentials, public trust
and product registrations described in
[runtime-operations.md](runtime-operations.md). Installation fails closed when
that production configuration is absent and passes its absolute path to systemd
or SCM.

Upgrade stages and self-tests both binaries before stopping the service. Failure
restores the prior current/previous layout and attempts to restart the prior
service. Repair replaces owned binaries and service policy without changing state
or configuration. Uninstall deletes the service definition and binary root while
retaining configuration, state and recovery data. Application roots are never an
installer argument and are never traversed. Removing retained state is a separate
administrator action outside the package command.

The documented native acceptance command is the manual-only GitHub workflow
`FDUpdater native package acceptance` (`workflow_dispatch`). Its Linux and Windows
jobs build each archive twice and generate ephemeral signing material outside the
package. They install into unique native roots, apply a signed release through the
installed CLI, force and recover an interrupted transaction, verify boot-style
restart, corrupt and repair the owned updater binary, upgrade it, uninstall it,
and compare state, recovery and external application-data canaries. No fixture
private key enters either package. The same scenarios can be run from a repository
checkout on clean hosts with:

```text
cargo +1.98.0 build --release --locked -p fdupdater --example native_fixture
sudo bash packaging/linux/native-acceptance.sh ABSOLUTE_EXPANDED_PACKAGE_ROOT "$PWD/target/release/examples/native_fixture"
powershell -File packaging/windows/native-acceptance.ps1 -PackageRoot ABSOLUTE_EXPANDED_PACKAGE_ROOT -FixtureTool "$PWD/target/release/examples/native_fixture.exe"
```
