/**
 * This script downloads the Edge driver for Selenium.
 * It handles the download, extraction, and caching of the Edge driver.
 * Cache is stored in the `node_modules/.cache/{$PACKAGE_NAME}/edgedriver` directory.
 * @packageDocumentation
 */

import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import {spawnSync} from "node:child_process";

import {logger} from "../logger.js";
import {CACHE_DIR} from '../constants.js';

/**
 * We can't continue without cache directory.
 */
if (!CACHE_DIR) {
    throw new Error("The CACHE_DIR constant is not defined.");
}

/**
 * The directory for the cache of the Edge driver.
 */
const EDGE_DIR = path.join(CACHE_DIR, 'edgedriver');

/**
 * The path to the Edge driver zip file.
 */
const EDGE_ZIP = path.join(EDGE_DIR, 'edgedriver.zip');

/**
 * The path to the Edge driver unzip directory.
 */
const EDGE_UNZIP = path.join(EDGE_DIR, 'edgedriver');

/**
 * The path to the Edge driver executable.
 */
const EDGE_EXE = path.join(EDGE_DIR, 'msedgedriver.exe');

/**
 * Get the path to the Edge driver executable for the specified version.
 * @param version {string} - The version of the Edge driver.
 * @returns {string} - The path to the Edge driver executable for the specified version.
 */
function GET_EDGE_EXE_VERSION(version: string): string {
    return path.join(EDGE_DIR, `msedgedriver.${version}.exe`);
}

/**
 * Make the directories for the Edge driver.
 */
function makeDirs() {
    logger.debug("Making directories for Edge driver...", {
        dir: EDGE_DIR
    });
    fs.mkdirSync(EDGE_DIR, {recursive: true});
}

/**
 * Get the version of the Edge driver.
 * @returns {string} - The version of the Edge driver.
 */
function getEdgeVersion(): string {

    let cmd = 'wmic';
    let args = [
        'datafile',
        'where',
        // wmic requires double backslashes for the path
        'name="C:\\\\Program Files (x86)\\\\Microsoft\\\\Edge\\\\Application\\\\msedge.exe"',
        "get",
        "version",
    ]

    logger.debug("Querying Edge driver version...", {
        cmd: cmd,
        args: args
    });

    let result = spawnSync(cmd, args);

    // check for errors
    if (result.error) {
        throw result.error;
    }

    // check for exit code
    if (result.status !== 0) {
        throw new Error(`Failed to get the Edge driver version: ${result.stderr.toString()}`);
    }

    let version = result.stdout.toString().trim().split("\n")?.[1]?.trim();

    logger.debug("Queried Edge driver version.", {
        stdout: result.stdout.toString(),
        version: version
    });
    return version;
}


/**
 * Format the URL for the specified version of the Edge driver.
 * @param version {string} - The version of the Edge driver.
 * @returns {string} - The URL for the specified version of the Edge driver.
 */
function formatEdgeDriverUrl(version: string): string {
    return `https://msedgedriver.azureedge.net/${version}/edgedriver_win64.zip`;
}

/**
 * Check if the Edge driver needs to be downloaded.
 * @param version {string} - The version of the Edge driver.
 */
function needsEdgeDriverDownload(version: string): boolean {
    const EDGE_EXE_VERSION = GET_EDGE_EXE_VERSION(version);

    // check if the Edge driver is not downloaded yet
    if (!fs.existsSync(EDGE_EXE) || !fs.existsSync(EDGE_EXE_VERSION)) {
        logger.debug("Edge driver not downloaded yet.");
        return true;
    }

    // check if they are equal
    const edge_exe = fs.readFileSync(EDGE_EXE);
    const edge_exe_version = fs.readFileSync(EDGE_EXE_VERSION);

    return !edge_exe.equals(edge_exe_version)
}

/**
 * Download the Edge driver.
 * @param version {string} - The version of the Edge driver.
 * @param toPath {string} - The path to download the Edge driver to.
 */
async function downloadEdgeDriver(version: string, toPath: string) {
    return new Promise((resolve: any, reject: any) => {

        // get the URL for the specified version of the Edge driver
        const url = formatEdgeDriverUrl(version);

        logger.debug("Downloading Edge driver...", {
            url: url,
            toPath: toPath
        });

        // download the Edge driver
        let request = https.get(url, (response) => {
            const file = fs.createWriteStream(toPath);
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                logger.debug("Downloaded Edge driver.", {
                    toPath: toPath
                });
                resolve();
            });
        })

        // handle errors
        request.on('error', (err) => {
            logger.error("Failed to download the Edge driver.", {
                url: url,
                error: err,
                toPath: toPath
            });
            reject(err);
        });
    });
}

/**
 * Unzip the Edge driver.
 * @param fromPath {string} - The path to the zip file.
 * @param toPath {string} - The path to the unzip directory.
 */
function unzipEdgeDriver(fromPath: string, toPath: string) {

    let cmd = `C:\\Windows\\System32\\tar.exe`
    let args = [
        "-xf",
        fromPath
    ]

    logger.debug("Unzipping Edge driver...", {
        cmd: cmd,
        args: args,
        cwd: EDGE_DIR
    });

    // Windows ships with tar.exe, so we can use it to extract the zip file.
    // If we don't provide full path to tar.exe it may happen that MSYS2 tar will be used.
    // MSYS2 tar will fail to extract because of the different path format.
    // I really don't like executing a command from the system32 directory, but
    // what really is the difference between that and executing it from the PATH?
    let result = spawnSync(cmd, args, {
        cwd: EDGE_DIR,
    })

    if (result.error) {
        logger.error("Failed to unzip the Edge driver.", {
            error: result.error
        });
        throw result.error;
    }

    if (result.status !== 0) {
        logger.error("Failed to unzip the Edge driver.", {
            stderr: result.stderr.toString()
        });
        throw new Error(`Failed to unzip the Edge driver: ${result.stderr.toString()}`);
    }
}

/**
 * Download the Edge driver.
 * @returns {Promise<string>} - The path to the Edge driver executable.
 */
async function download(): Promise<string> {

    // make the directories for the Edge driver
    makeDirs()

    // get the version of the Edge browser
    let version = getEdgeVersion();

    // check if the Edge driver needs to be downloaded
    if (needsEdgeDriverDownload(version)) {
        logger.info("Need to download Edge driver...", {
            version: version
        });

        // download the Edge driver
        await downloadEdgeDriver(version, EDGE_ZIP);

        // unzip the Edge driver
        unzipEdgeDriver(EDGE_ZIP, EDGE_UNZIP);

        // copy the Edge driver executable
        fs.copyFileSync(EDGE_EXE, GET_EDGE_EXE_VERSION(version));
    } else {
        logger.info("Using cached Edge driver", {
            version: version
        });
    }

    // return the path to the Edge driver executable
    return GET_EDGE_EXE_VERSION(version);
}

export {
    getEdgeVersion,
    download
}