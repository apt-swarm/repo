# apt-swarm

apt repository for the Swarm (Neuro-sama)

## Using the repository

To add the repository:

- Import the GPG public key:

```bash
wget -qO https://neuroverse-fm.github.io/apt-swarm/apt-swarm-public-key.asc | sudo gpg --dearmor -o /usr/share/keyrings/apt-swarm.gpg
```

- Add the repo to APT's sources list:

```bash
echo "deb [signed-by=/usr/share/keyrings/apt-swarm.gpg] https://neuroverse-fm.github.io/apt-swarm/ <codename> main" | sudo tee /etc/apt/sources.list.d/apt-swarm.list
```

Replace `<codename>` with the codename you want to target (either `bookworm` (Debian) or `noble` (Ubuntu))

- Update and install a package:

```bash
sudo apt update
sudo apt install <package>
```

To verify, inspect with:

```bash
apt policy <package>
```

<!-- todo: readme -->
