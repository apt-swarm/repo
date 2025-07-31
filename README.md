# apt-swarm

apt repository for the Swarm (Neuro-sama)

## Using the repository

To add the repository:

- Import the GPG public key:

```bash
sudo apt-get update
sudo apt-get install ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://neuroverse-fm.github.io/apt-swarm/apt-swarm-public-key.asc -o /etc/apt/keyrings/apt-swarm.asc
sudo chmod a+r /etc/apt/keyrings/apt-swarm.asc
```

- Add the repo to APT's sources list:

```bash
echo "deb [signed-by=/usr/share/keyrings/apt-swarm.asc] https://neuroverse-fm.github.io/apt-swarm/ <codename> main" | sudo tee /etc/apt/sources.list.d/apt-swarm.list
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
