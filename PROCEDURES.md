# Adding/changing a package

After building your .deb file:

- Copy the .deb file into `debs/`
- Commit the files
- Open a pull request

It's best to use GitHub Actions to build, as it allows for faster verification of your files.
An extra step would be using artifact provenance to verify tampering.
