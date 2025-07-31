"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const github = __importStar(require("@actions/github"));
const fs = __importStar(require("fs"));
const glob = __importStar(require("@actions/glob"));
async function run() {
    try {
        const token = core.getInput('github-token', { required: true });
        const configPath = core.getInput('config-path') || './smarter-codeowners-config.json';
        const commentTitle = core.getInput('comment-title') || '👥 Code Owners';
        const octokit = github.getOctokit(token);
        const { payload, repo } = github.context;
        if (!payload.pull_request) {
            core.setFailed('This action can only be run on pull request events');
            return;
        }
        const prNumber = payload.pull_request.number;
        // Load config
        const config = loadConfig(configPath);
        const changedFiles = await getChangedFiles(octokit, repo, prNumber);
        core.info(`Found ${changedFiles.length} changed files`);
        const fileMatches = await findFileOwners(changedFiles, config);
        if (fileMatches.length === 0) {
            core.info('No files matched any configured paths');
            return;
        }
        await updateOrCreateComment(octokit, repo, prNumber, fileMatches, commentTitle, config.mention_all);
        core.info(`Successfully tagged code owners for ${fileMatches.length} files`);
    }
    catch (error) {
        core.setFailed(`Action failed: ${error instanceof Error ? error.message : String(error)}`);
    }
}
function loadConfig(configPath) {
    try {
        if (!fs.existsSync(configPath)) {
            throw new Error(`Config file not found: ${configPath}`);
        }
        const content = fs.readFileSync(configPath, 'utf8');
        const config = JSON.parse(content);
        if (!config.version || typeof config.mention_all !== 'boolean' || !config.paths) {
            throw new Error('Invalid config format');
        }
        return config;
    }
    catch (error) {
        throw new Error(`Failed to load config: ${error instanceof Error ? error.message : String(error)}`);
    }
}
async function getChangedFiles(octokit, repo, prNumber) {
    const { data: files } = await octokit.rest.pulls.listFiles({
        owner: repo.owner,
        repo: repo.repo,
        pull_number: prNumber,
        per_page: 100
    });
    return files.map(file => file.filename);
}
async function findFileOwners(files, config) {
    const matches = [];
    for (const file of files) {
        let lastMatch = null;
        for (const [pattern, owners] of Object.entries(config.paths)) {
            try {
                const globber = await glob.create(pattern);
                const isMatch = await globber.glob();
                if (isMatch.includes(file)) {
                    if (config.mention_all) {
                        matches.push({ file, owners, pattern });
                    }
                    else {
                        lastMatch = { file, owners, pattern }; // Keep overwriting to get the last match
                    }
                }
            }
            catch (error) {
                core.warning(`Failed to process pattern '${pattern}': ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        // Add the last match if we're not mentioning all
        if (!config.mention_all && lastMatch) {
            matches.push(lastMatch);
        }
    }
    return matches;
}
async function updateOrCreateComment(octokit, repo, prNumber, matches, commentTitle, mentionAll) {
    // Build comment body
    let commentBody = `## ${commentTitle}\n\n`;
    if (mentionAll) {
        const allOwners = new Set();
        matches.forEach(match => match.owners.forEach((owner) => allOwners.add(owner)));
        commentBody += `${Array.from(allOwners).join(' ')} - Please review the changes below:\n\n`;
    }
    commentBody += `The following files have been modified and require review:\n\n`;
    // Group by owners for cleaner display
    const ownerGroups = new Map();
    for (const match of matches) {
        const key = match.owners.join(',');
        if (!ownerGroups.has(key)) {
            ownerGroups.set(key, []);
        }
        ownerGroups.get(key).push(match.file);
    }
    for (const [owners, files] of ownerGroups) {
        commentBody += `### ${owners.split(',').join(' ')}\n\n`;
        for (const file of files.sort()) {
            commentBody += `- \`${file}\`\n`;
        }
        commentBody += '\n';
    }
    commentBody += `\n---\n*This comment was automatically generated by the in-house \`smarter-codeowners\` action*`;
    // Check for existing comment and update or create
    const { data: comments } = await octokit.rest.issues.listComments({
        owner: repo.owner,
        repo: repo.repo,
        issue_number: prNumber
    });
    const existingComment = comments.find(comment => comment.body?.includes('smarter-codeowners action') &&
        comment.body?.includes(commentTitle));
    if (existingComment) {
        await octokit.rest.issues.updateComment({
            owner: repo.owner,
            repo: repo.repo,
            comment_id: existingComment.id,
            body: commentBody
        });
        core.info('Updated existing code owners comment');
    }
    else {
        await octokit.rest.issues.createComment({
            owner: repo.owner,
            repo: repo.repo,
            issue_number: prNumber,
            body: commentBody
        });
        core.info('Created new code owners comment');
    }
}
run();
//# sourceMappingURL=index.js.map