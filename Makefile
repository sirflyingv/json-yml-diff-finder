install: # basic install
	npm ci

publish: # dry publish
	npm publish --dry-run 

lint:
	npx eslint .