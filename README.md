# tauri-e2e v2

[![Windows Tests](https://github.com/bukowa/tauri-e2e/actions/workflows/tests-windows.yaml/badge.svg?branch=master&event=push)](https://github.com/bukowa/tauri-e2e/actions/workflows/tests-windows.yaml)
[![Linux Tests](https://github.com/bukowa/tauri-e2e/actions/workflows/tests-linux.yaml/badge.svg?branch=master&event=push)](https://github.com/bukowa/tauri-e2e/actions/workflows/tests-linux.yaml)
[![macOS Tests](https://github.com/bukowa/tauri-e2e/actions/workflows/tests-macos.yaml/badge.svg?branch=master&event=push)](https://github.com/bukowa/tauri-e2e/actions/workflows/tests-macos.yaml)

This project demonstrates how to perform end-to-end testing with `Tauri v2` using `Selenium`.<br>

It can also easily be integrated into your existing `Tauri` project to automate testing and ensure the quality of your application across different platforms.

Each webdriver has its own differences between platforms. This project aims to provide a unified way to run e2e tests.
In the [webdriver.ts](./tests-e2e/src/webdriver.ts) file, you can see how the webdriver is initialized based on the platform.
Copying this file into your project should be enough to run e2e tests on your project.

# Goals
In order of priority:

- `Single Cross-Platform Command`: Implement a single command (just test-e2e) to execute end-to-end tests locally on any supported platform.

- `GitHub Actions Integration`: Enable a single cross-platform command (just test-e2e) to run end-to-end tests within GitHub Actions.

- `Scheduled Testing`: Configure GitHub Actions to run these tests on a scheduled basis to detect regressions early in new versions.

- `Minimize Dependencies and Simplify Code`: Aim to streamline the testing setup by reducing reliance on external frameworks and libraries wherever feasible. Simplifying the codebase helps maintain clarity, efficiency, and reduces potential points of failure, ensuring a more robust testing environment.

# State
- [x] `Windows` support
    - [x] github actions support
- [x] `Linux` support
    - [x] github actions support
- [ ] `Mac` support
    - [ ] github actions support

## Note on Headless Execution
In this setup, when we refer to running tests "headlessly," it means executing them without a graphical user interface (GUI) environment. This is achieved by leveraging servers like X11, which provide a virtual display for graphical applications, even in environments where no physical display is available or required.

## Note on Windows Environment
On Windows, the testing setup utilizes Bash and tools provided by [Git for Windows](https://git-scm.com/download/win). This includes Git Bash, which provides a Unix-like command-line environment on Windows, enabling seamless execution of commands and scripts similar to those used in Linux environments.

# Prerequisites
Before getting started, ensure you have the following:

- `Rust`
- `Node.js`
- `just`: Install just from [here](https://github.com/casey/just) to simplify command execution.

## Note on just:
The just tool, utilized in this setup for streamlined command execution, is noteworthy for its lightweight nature and cross-platform compatibility. Written in Rust, just is designed to be efficient and versatile across different operating systems. The entire installation typically occupies only about 4MB of disk space, making it an excellent choice for managing tasks and commands within your development environment without significant overhead. If you prefer not to use just, feel free to contribute shell script alternatives via pull requests.


# Run
```bash
just test-e2e
```

# Goals
1. `one (just 1) cross-platform command to run e2e tests for tauri application on local computer`<br>
2. `one (just 1) cross-platform command to run e2e tests for tauri application in github actions`
3. `run these tests on scheduled basis in github actions to early catch any regressions in new versions`
