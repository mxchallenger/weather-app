# Build and deploy to Github Pages
1. Commit and push to main branch
2. Build the project with `npm run build`
3. Deploy to Github Pages with `npm run deploy`

## Requires the following in the package.json to work
in "scripts":     
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build"

  "homepage": "https://username.github.io/repo-name"

### Dependencies required
- gh-pages `npm install gh-pages`