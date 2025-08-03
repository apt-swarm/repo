#!/bin/bash
# Build script for repo
# Maintainer: KTrain5369 

sudo apt update
sudo apt-get install -y reprepro gnupg2 pinentry-curses gnupg-agent jq

# Load the private key
echo "$GPG_PRIVATE_KEY" | gpg --batch --import

# Allow GPG to use loopback for passphrase entry
mkdir -p ~/.gnupg
echo "allow-loopback-pinentry" >> ~/.gnupg/gpg-agent.conf
echo "pinentry-mode loopback" >> ~/.gnupg/gpg.conf
echo "use-agent" >> ~/.gnupg/gpg.conf

# Restart gpg agent to let it pick up those settings
gpgconf --kill gpg-agent

# Verify GPG key usability
gpg --batch --yes --pinentry-mode loopback --sign --passphrase "$GPG_PASSPHRASE" \
    --output /dev/null <<< "signing test"

mkdir -p public/conf
cat > public/conf/distributions <<EOF
Origin: apt-swarm
Label:  APT repository for the Swarm's creations
Suite:  stable
Codename: bookworm
Architectures: amd64
Components: main
SignWith: $GPG_KEY_ID

Origin: apt-swarm
Label:  APT repository for the Swarm's creations
Suite:  stable
Codename: noble
Architectures: amd64
Components: main
SignWith: $GPG_KEY_ID
EOF

# Fetch steps go here
# Needs to be placed into public/pool/main
for key in ${jq -r 'keys[]' ./repos.json}; do
    value=${jq -r --arg "$key" '.[$k]' ./repos.json}
    echo "Downloading \"$key\" package from \"$value\""
    version=$(gh api "repos/$value/tags" --jq '.[0].name')
    gh release download $version --repo "$value" --dir "public/pool/main" --pattern "*.deb"
    echo "Downloaded $key version $version from $value"
done

cp apt-swarm-public-key.asc public/
ls -R public/

# Ensure GPG can ask for passphrase non-interactively
export GPG_TTY=$(tty)
export GPG_AGENT_INFO=
gpgconf --launch gpg-agent

# Loop through and add all .deb files in public/pool
for deb in public/pool/**/*.deb; do
    reprepro -b public -S main includedeb bookworm "$deb"
    reprepro -b public -S main includedeb noble "$deb"
done

# reprepro will scan pool/ and generate dists/, Release, Packages.gz, Release.gpg
reprepro -b public export