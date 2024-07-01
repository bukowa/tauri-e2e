
- `src/webdriver.ts`:
    - this is the reusable code for the tests
    - it groups common platform and webdriver specific logic while allowing for some configuration
- `package.json`:
    - `swc` + `ts-node` (see `test-e2e-fast` in [justfile](../justfile)):
        -  optional - used to speed up running tests without transpiling the code to js