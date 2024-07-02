mod selenium './selenium/justfile'
mod tauri-app './tauri-app/justfile'
mod tests-e2e-js './tests-e2e-js/justfile'

export PATH := \
    env_var('PATH') \
    + ":" + absolute_path("./node_modules/.bin")

build: deps
    just selenium::build
    just tauri-app::build --no-bundle

deps:
    npm i --prefer-offline --no-audit --progress=false

test: build
    just selenium::test
    just tests-e2e-js::test

docs:
    just selenium::docs

clean:
    just selenium::clean
    just tauri-app::clean
    just tests-e2e-js::clean
    rm -fr node_modules
    rm -fr target
    rm -fr .tsimp

pre-commit:
    just docs