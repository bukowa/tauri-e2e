# Name of the built binary without extension.
export TAURI_BIN_NAME := "tauri-app"

# The build directories for all filesystem changes.
export _PATH_ROOT_DIR  := absolute_path(".")
export PATH_BUILD_DIR  := _PATH_ROOT_DIR / ".build"
export PATH_BUILD_TEMP := PATH_BUILD_DIR / "temp"
export PATH_BUILD_BIN  := PATH_BUILD_DIR / "bin"

export PATH := \
    env_var('PATH') \
    + ":" + PATH_BUILD_BIN \

export E2E_WEBDRIVER_BINARY := env('E2E_WEBDRIVER_BINARY', \
    if os() == 'windows' \
    {PATH_BUILD_BIN + "/msedgedriver.exe" } \
    else { shell('which $1 || true', 'WebKitWebDriver')})

exe := if os() == 'windows' { ".exe" } else { "" }

export PATH_DEBUG_BINARY := env('PATH_DEBUG_BINARY', \
    absolute_path(".") / "target/debug"     / TAURI_BIN_NAME + exe)

export PATH_RELEASE_BINARY := env('PATH_RELEASE_BINARY', \
    absolute_path(".") / "target/release"   / TAURI_BIN_NAME + exe)

export E2E_TAURI_BINARY := env('E2E_TAURI_BINARY', \
    PATH_RELEASE_BINARY)

export E2E_LOG_LEVEL    := env('E2E_LOG_LEVEL',    'info')
export E2E_NODE_TIMEOUT := env('E2E_NODE_TIMEOUT', '20000')

# TAURI_WEBVIEW_AUTOMATION — Enables webview automation (Linux Only).
# https://github.com/tauri-apps/tauri/blob/e7fd7c60d6693944e343fd8d615ec7871f31244b/tooling/cli/ENVIRONMENT_VARIABLES.md
# https://github.com/tauri-apps/tauri/blob/e7fd7c60d6693944e343fd8d615ec7871f31244b/core/tauri-runtime-wry/src/lib.rs#L4003
export TAURI_WEBVIEW_AUTOMATION := "true"

[doc('prints all evaluated variables')]
@_default:
    just --evaluate

[group('setup')]
[doc('initialize the build tool')]
init:
    mkdir -p $PATH_BUILD_DIR
    mkdir -p $PATH_BUILD_BIN
    mkdir -p $PATH_BUILD_TEMP

[group('setup')]
[doc('echo required prerequisites for the project')]
[linux]
prerequisites:
    #!/bin/bash
    set -euo pipefail
    echo $(cat <<EOF
    sudo apt update &&
    sudo apt install -y libwebkit2gtk-4.1-dev \
    build-essential \
    curl \
    wget \
    file \
    libxdo-dev \
    libssl-dev \
    libayatana-appindicator3-dev \
    librsvg2-dev
    xvfb \
    webkit2gtk-driver
    EOF
    )

[group('tauri')]
[doc('run the tauri cli')]
tauri *ARGS:
    npm run --workspace=tauri-app tauri -- {{ARGS}}

[group('tauri')]
[doc('run the tauri app')]
run-tauri target='release':
    # use xargs to handle arguments with spaces or special
    # characters uniformly across Windows and Linux.
    # this (hopefully) ensures some compatibility in cross-platform scripts.
    "{{ if target == 'release' { PATH_RELEASE_BINARY} else { PATH_DEBUG_BINARY } }}" | xargs &

[group('tests')]
[doc('run the e2e tests')]
test-e2e: webdriver-download
    #!/bin/bash
    if [ -n "$JUSTFILE_TRACE" ]; then set -x; fi
    set -euov pipefail

    npm install
    npm run build

    just tauri build --no-bundle
    test -f $E2E_TAURI_BINARY

    node --test --test-force-exit \
         --test-timeout=$E2E_NODE_TIMEOUT \
         tests-e2e-js/dist/main.js

[group('tests')]
[doc('run the e2e tests using ts-node and swc')]
test-e2e-fast *ARGS="":
    #!/bin/bash
    if [ -n "$JUSTFILE_TRACE" ]; then set -x; fi
    set -euov pipefail
    node \
      --test --test-force-exit --test-timeout=$E2E_NODE_TIMEOUT \
      --require ts-node/register \
      {{ARGS}} \
      tests-e2e-js

[group('webview')]
[doc('get microsoftedge installed version')]
[windows]
browser-version:
    #!/bin/bash
    wmic datafile where \
      'name="C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe"' \
      get version | tail -n2 | xargs

[group('webview')]
[doc('get the microsoftedge webdriver url')]
[windows]
webdriver-url:
    #!/bin/bash
    echo "https://msedgedriver.azureedge.net/$(just browser-version)/edgedriver_win64.zip"

[group('webview')]
[doc('downloads the microsoftedge webdriver')]
[windows]
webdriver-download: init
    #!/bin/bash
    if [ -n "$JUSTFILE_TRACE" ]; then set -x; fi
    set -euo pipefail

    version=$(just browser-version)
    bytes=$(echo $version | wc -c)
    if [ $bytes -ne 14 ]; then
        echo "ERROR found incorrect number of bytes in the version number: '$version'"
        echo "$version"
        exit 1
    fi

    zip_file=$PATH_BUILD_TEMP/webdriver.zip
    unzip_dir=$PATH_BUILD_TEMP/webdriver
    unzip_file=$E2E_WEBDRIVER_BINARY
    unzip_file_compares=$unzip_dir/msedgedriver.$version.exe

    # if there's unzip_file and unzip_file_compares
    # compare their sha, if they are the same, then
    # we don't need to download the webdriver
    if [ -f $unzip_file ] && [ -f $unzip_file_compares ]; then
        sha1sum $unzip_file $unzip_file_compares | awk '{print $1}' | uniq | wc -l | grep -q 1
        if [ $? -eq 0 ]; then
            echo "Webdriver found at: '$unzip_file'"
            exit 0
        fi
    fi

    curl -L $(just webdriver-url) -o $zip_file
    unzip -o $zip_file -d $unzip_dir
    cp $unzip_dir/msedgedriver.exe $unzip_file
    cp $unzip_dir/msedgedriver.exe $unzip_file_compares
    test -f $E2E_WEBDRIVER_BINARY

[group('webview')]
[doc('downloads the webdriver')]
[linux]
webdriver-download:
    #!/bin/bash
    if [ -n "$JUSTFILE_TRACE" ]; then set -x; fi
    set -euo pipefail
    if [ -n "$E2E_WEBDRIVER_BINARY" ] && [ -f $E2E_WEBDRIVER_BINARY ]; then
        echo "Webdriver found at: '$E2E_WEBDRIVER_BINARY'"
        exit 0
    else
        error_message=$(cat <<EOF
    Error: Webdriver is not found at: '$E2E_WEBDRIVER_BINARY' (E2E_WEBDRIVER_BINARY).
    To download it, you can use the following commands:
      sudo apt update
      sudo apt install webkit2gtk-driver xvfb -y
    EOF
    )
          echo "$error_message"
          exit 1
    fi

[group('webview')]
[doc('get microsoftedge versions pending update')]
[windows]
browser-version-pending-update:
    REG QUERY \
    "HKLM\SOFTWARE\WOW6432Node\Microsoft\EdgeUpdate\Clients\{56EB18F8-B008-4CBD-B6D2-8C97FE7E9062}" \
    | grep pv | awk '{print $3}'
