#!/usr/bin/env node

import { execFileSync } from "child_process";
import { readFileSync } from "fs";

let filename = process.argv[2];

if (!filename) {
    console.log("Run all the JS scripts in a markdown file");
    console.log("md-js-run <filename.md>");
    process.exit(1);
}

let success = true;

let previous = null;
for (let part of readFileSync(filename, { encoding: "utf8" })
    .split(/```(.*)/)
) {
    if (previous == "js") {
        console.log(part);
        console.log("".padStart(process.stdout.columns, "-"));
        try {
            execFileSync(
                "node",
                ["--input-type=module"],
                { input: part, encoding: "utf8", stdio: ["pipe", "inherit", "inherit"] }
            );
        } catch (e) {
            console.log("Failed");
            success = false;
        }
        console.log("".padStart(process.stdout.columns, "="));
    }
    previous = part;
}

process.exit(success ? 0 : 1);