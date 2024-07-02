/**
 * Converts javascript examples to Markdown format.
 *
 * @example
 * ```bash
 * node example-to-markdown.js /path/to/examples
 * ```
 *
 */
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {resolve, join, basename} from 'node:path';

// regular expression to match frontmatter
const reFrontmatter = /\/\*\s*([\s\S]*?)\s*\*\//;

// function to convert example file to markdown
function exampleToMarkdown(file) {
    let content = readFileSync(file, 'utf-8');
    let frontmatter = reFrontmatter.exec(content)[1].trim();
    content = content.replace(reFrontmatter, '').trim();
    let newContent = `${frontmatter}
\`\`\`\`javascript
${content}
\`\`\`\`\``
    let newFile = join(resolve(file, '..'), basename(file, '.js') + '.md');
    console.log(`Writing markdown to new file '${newFile}'`)
    writeFileSync(newFile, newContent);
}

// read first argument
const dir = process.argv[2]
if (!dir) {
    console.error('Please provide a directory');
    process.exit(1);
}

// resolve the directory
const fullDir = resolve(dir);
console.log(`Reading examples from '${fullDir}'`);

// read all files in the directory
const files = readdirSync(fullDir);

// convert each file ending with `.js`
files.filter(file => file.endsWith('.js')).forEach(
    file => exampleToMarkdown(resolve(fullDir, file))
)
