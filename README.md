# omninspigot
### Checks
* [![Code Style Analysis](https://github.com/JoshMerlino/omnispigot/actions/workflows/code-style-analysis.yml/badge.svg)](https://github.com/JoshMerlino/omnispigot/actions/workflows/code-style-analysis.yml)
* [![Code Quality Analysis](https://github.com/JoshMerlino/omnispigot/actions/workflows/code-quality-analysis.yml/badge.svg)](https://github.com/JoshMerlino/omnispigot/actions/workflows/code-quality-analysis.yml)
* [![Test CI](https://github.com/JoshMerlino/omnispigot/actions/workflows/test-ci.yml/badge.svg)](https://github.com/JoshMerlino/omnispigot/actions/workflows/test-ci.yml)

An API server for caching and distributing Minecraft Server JARs.

## Run the server yourself
```batch
git clone https://github.com/JoshMerlino/omnispigot.git
cd omnispigot
sudo apt-get install build-essential -y
npm install
npm run build
```

Then run the server with: `node .`

## API Documentation
Run the server with the instructions above, then navigate to `https://localhost/docs/` for the automaticly generated documentation.
