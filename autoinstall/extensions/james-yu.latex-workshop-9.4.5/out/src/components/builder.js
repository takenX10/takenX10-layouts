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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Builder = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const cp = __importStar(require("child_process"));
const cs = __importStar(require("cross-spawn"));
const lw = __importStar(require("../lw"));
const utils_1 = require("../utils/utils");
const eventbus_1 = require("./eventbus");
const logger_1 = require("./logger");
const compilerlog_1 = require("./parser/compilerlog");
const logger = (0, logger_1.getLogger)('Builder');
class Builder {
    constructor() {
        this.lastBuild = 0;
        this.building = false;
        this.isMiktex = false;
        this.stepQueue = new BuildToolQueue();
        this.TEX_MAGIC_PROGRAM_NAME = 'TEX_MAGIC_PROGRAM_NAME';
        this.BIB_MAGIC_PROGRAM_NAME = 'BIB_MAGIC_PROGRAM_NAME';
        this.MAGIC_PROGRAM_ARGS_SUFFIX = '_WITH_ARGS';
        this.MAX_PRINT_LINE = '10000';
        // Check if pdflatex is available, and is MikTeX distro
        try {
            const pdflatexVersion = cp.execSync('pdflatex --version');
            if (pdflatexVersion.toString().match(/MiKTeX/)) {
                this.isMiktex = true;
                logger.log('pdflatex is provided by MiKTeX.');
            }
        }
        catch (e) {
            logger.log('Cannot run pdflatex to determine if we are using MiKTeX.');
        }
    }
    /**
     * Terminate current process of LaTeX building. OS-specific (pkill for linux
     * and macos, taskkill for win) kill command is first called with process
     * pid. No matter whether it succeeded, `kill()` of `child_process` is later
     * called to "double kill". Also, all subsequent tools in queue are cleared,
     * including ones in the current recipe and (if available) those from the
     * cached recipe to be executed.
     */
    kill() {
        if (this.process === undefined) {
            logger.log('LaTeX build process to kill is not found.');
            return;
        }
        const pid = this.process.pid;
        try {
            logger.log(`Kill child processes of the current process with PID ${pid}.`);
            if (process.platform === 'linux' || process.platform === 'darwin') {
                cp.execSync(`pkill -P ${pid}`, { timeout: 1000 });
            }
            else if (process.platform === 'win32') {
                cp.execSync(`taskkill /F /T /PID ${pid}`, { timeout: 1000 });
            }
        }
        catch (e) {
            logger.logError('Failed killing child processes of the current process.', e);
        }
        finally {
            this.stepQueue.clear();
            this.process.kill();
            logger.log(`Killed the current process with PID ${pid}`);
        }
    }
    buildOnFileChanged(file, bibChanged = false) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(file));
        if (configuration.get('latex.autoBuild.run') !== "onFileChange" /* BuildEvents.onFileChange */) {
            return;
        }
        logger.log(`Auto build started detecting the change of a file: ${file} .`);
        return this.invokeBuild(file, bibChanged);
    }
    buildOnSaveIfEnabled(file) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(file));
        if (configuration.get('latex.autoBuild.run') !== "onSave" /* BuildEvents.onSave */) {
            return;
        }
        logger.log(`Auto build started on saving file: ${file} .`);
        return this.invokeBuild(file, false);
    }
    invokeBuild(file, bibChanged) {
        if (!lw.builder.canAutoBuild()) {
            logger.log('Autobuild temporarily disabled.');
            return;
        }
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(file));
        if (!bibChanged && lw.manager.localRootFile && configuration.get('latex.rootFile.useSubFile')) {
            return lw.commander.build(true, lw.manager.localRootFile, lw.manager.rootFileLanguageId);
        }
        else {
            return lw.commander.build(true, lw.manager.rootFile, lw.manager.rootFileLanguageId);
        }
    }
    /**
     * Build LaTeX project using external command. This function creates a
     * {@link Tool} containing the external command info and adds it to the
     * queue. After that, this function tries to initiate a {@link buildLoop} if
     * there is no one running.
     *
     * @param command The external command to be executed.
     * @param args The arguments to {@link command}.
     * @param pwd The current working directory. This argument will be overrided
     * if there are workspace folders. If so, the root of the first workspace
     * folder is used as the current working directory.
     * @param rootFile Path to the root LaTeX file.
     */
    async buildExternal(command, args, pwd, rootFile) {
        if (this.building) {
            void logger.showErrorMessageWithCompilerLogButton('Please wait for the current build to finish.');
            return;
        }
        this.lastBuild = Date.now();
        if (rootFile) {
            lw.cacher.ignorePdfFile(rootFile);
        }
        await vscode.workspace.saveAll();
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        const cwd = workspaceFolder?.uri.fsPath || pwd;
        if (rootFile !== undefined) {
            args = args.map((0, utils_1.replaceArgumentPlaceholders)(rootFile, lw.manager.tmpDir));
        }
        const tool = { name: command, command, args };
        this.stepQueue.add(tool, rootFile, 'External', Date.now(), true, cwd);
        await this.buildLoop();
    }
    /**
     * Build LaTeX project using the recipe system. This function creates
     * {@link Tool}s containing the tool info and adds them to the queue. After
     * that, this function tries to initiate a {@link buildLoop} if there is no
     * one running.
     *
     * @param rootFile Path to the root LaTeX file.
     * @param langId The language ID of the root file. This argument is used to
     * determine whether the previous recipe can be applied to this root file.
     * @param recipeName The name of recipe to be used. If `undefined`, the
     * builder tries to determine on its own, in {@link createBuildTools}.
     */
    async build(rootFile, langId, recipeName) {
        logger.log(`Build root file ${rootFile}`);
        this.lastBuild = Date.now();
        // Stop watching the PDF file to avoid reloading the PDF viewer twice.
        // The builder will be responsible for refreshing the viewer.
        lw.cacher.ignorePdfFile(rootFile);
        await vscode.workspace.saveAll();
        this.createOuputSubFolders(rootFile);
        const tools = this.createBuildTools(rootFile, langId, recipeName);
        if (tools === undefined) {
            logger.log('Invalid toolchain.');
            return;
        }
        const timestamp = Date.now();
        tools.forEach(tool => this.stepQueue.add(tool, rootFile, recipeName || 'Build', timestamp));
        await this.buildLoop();
    }
    /**
     * This function determines whether an auto-build on save or on change can
     * be triggered. There are two conditions that this function should take
     * care of: 1. Defined `latex.autoBuild.interval` config, 2. Unwanted
     * auto-build triggered by the `saveAll()` in another previous building
     * process.
     * @returns Whether auto build can be triggered now.
     */
    canAutoBuild() {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', lw.manager.rootFile ? vscode.Uri.file(lw.manager.rootFile) : undefined);
        if (Date.now() - this.lastBuild < configuration.get('latex.autoBuild.interval', 1000)) {
            return false;
        }
        return true;
    }
    async saveActive() {
        this.lastBuild = Date.now();
        await vscode.window.activeTextEditor?.document.save();
    }
    /**
     * This function returns if there is another {@link buildLoop} function/loop
     * running. If not, this function iterates through the
     * {@link BuildToolQueue} and execute each {@link Tool} one by one. During
     * this process, the {@link Tool}s in {@link BuildToolQueue} can be
     * dynamically added or removed, handled by {@link BuildToolQueue}.
     */
    async buildLoop() {
        if (this.building) {
            return;
        }
        this.building = true;
        while (true) {
            const step = this.stepQueue.getStep();
            if (step === undefined) {
                break;
            }
            const env = this.spawnProcess(step);
            const success = await this.monitorProcess(step, env);
            if (success && this.stepQueue.isLastStep(step)) {
                await this.afterSuccessfulBuilt(step);
            }
        }
        this.building = false;
    }
    /**
     * Spawns a `child_process` for the {@link step}. This function first
     * creates the environment variables needed for the {@link step}. Then a
     * process is spawned according to the nature of the {@link step}: 1) is a
     * magic command (tex or bib), 2) is a recipe tool, or 3) is an external
     * command. After spawned, the process is stored as a class property, and
     * the io handling is performed in {@link monitorProcess}.
     *
     * @param step The {@link Step} to be executed.
     * @param cwd The current working directory.
     * @returns The process environment passed to the spawned process.
     */
    spawnProcess(step, cwd) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', step.rootFile ? vscode.Uri.file(step.rootFile) : undefined);
        if (step.index === 0 || configuration.get('latex.build.clearLog.everyRecipeStep.enabled')) {
            logger.clearCompilerMessage();
        }
        logger.refreshStatus('sync~spin', 'statusBar.foreground', undefined, undefined, ' ' + this.stepQueue.getStepString(step));
        logger.logCommand(`Recipe step ${step.index + 1}`, step.command, step.args);
        logger.log(`env: ${JSON.stringify(step.env)}`);
        logger.log(`root: ${step.rootFile}`);
        const env = Object.create(null);
        Object.keys(process.env).forEach(key => env[key] = process.env[key]);
        const toolEnv = step.env;
        if (toolEnv) {
            Object.keys(toolEnv).forEach(key => env[key] = toolEnv[key]);
        }
        env['max_print_line'] = this.MAX_PRINT_LINE;
        if (!step.isExternal &&
            (step.name.startsWith(this.TEX_MAGIC_PROGRAM_NAME) ||
                step.name.startsWith(this.BIB_MAGIC_PROGRAM_NAME))) {
            logger.log(`cwd: ${path.dirname(step.rootFile)}`);
            const args = step.args;
            if (args && !step.name.endsWith(this.MAGIC_PROGRAM_ARGS_SUFFIX)) {
                // All optional arguments are given as a unique string (% !TeX options) if any, so we use {shell: true}
                this.process = cs.spawn(`${step.command} ${args[0]}`, [], { cwd: path.dirname(step.rootFile), env, shell: true });
            }
            else {
                this.process = cs.spawn(step.command, args, { cwd: path.dirname(step.rootFile), env });
            }
        }
        else if (!step.isExternal) {
            if (step.command === 'latexmk' && step.rootFile === lw.manager.localRootFile && lw.manager.rootDir) {
                cwd = lw.manager.rootDir;
                if (step.args && !step.args.includes('-cd')) {
                    step.args.push('-cd');
                }
            }
            else {
                cwd = path.dirname(step.rootFile);
            }
            logger.log(`cwd: ${cwd}`);
            this.process = cs.spawn(step.command, step.args, { cwd, env });
        }
        else {
            logger.log(`cwd: ${step.cwd}`);
            this.process = cs.spawn(step.command, step.args, { cwd: step.cwd });
        }
        logger.log(`LaTeX build process spawned with PID ${this.process.pid}.`);
        return env;
    }
    /**
     * Monitors the output and termination of the tool process. This function
     * monitors the `stdout` and `stderr` channels to log and parse the output
     * messages. This function also **waits** for `error` or `exit` signal of
     * the process. The former indicates an unexpected error, e.g., killed by
     * user or ENOENT, and the latter is the typical exit of the process,
     * successfully built or not. If the build is unsuccessful (code != 0), this
     * function considers the four different cases: 1) tool of a recipe, not
     * terminated by user, is not a retry and should retry, 2) tool of a recipe,
     * not terminated by user, is a retry or should not retry, 3) unsuccessful
     * external command, won't retry regardless of the retry config, and 4)
     * terminated by user. In the first case, a retry {@link Tool} is created
     * and added to the {@link BuildToolQueue} based on {@link step}. In the
     * latter three, all subsequent tools in queue are cleared, including ones
     * in the current recipe and (if available) those from the cached recipe to
     * be executed.
     *
     * @param step The {@link Step} of process whose io is monitored.
     * @param env The process environment passed to the spawned process.
     * @return Whether the step is successfully executed.
     */
    async monitorProcess(step, env) {
        if (this.process === undefined) {
            return false;
        }
        let stdout = '';
        this.process.stdout.on('data', (msg) => {
            stdout += msg;
            logger.logCompiler(msg.toString());
        });
        let stderr = '';
        this.process.stderr.on('data', (msg) => {
            stderr += msg;
            logger.logCompiler(msg.toString());
        });
        const result = await new Promise(resolve => {
            if (this.process === undefined) {
                resolve(false);
                return;
            }
            this.process.on('error', err => {
                logger.logError(`LaTeX fatal error on PID ${this.process?.pid}.`, err);
                logger.log(`Does the executable exist? $PATH: ${env['PATH']}, $Path: ${env['Path']}, $SHELL: ${process.env.SHELL}`);
                logger.log(`${stderr}`);
                logger.refreshStatus('x', 'errorForeground', undefined, 'error');
                void logger.showErrorMessageWithExtensionLogButton(`Recipe terminated with fatal error: ${err.message}.`);
                this.process = undefined;
                this.stepQueue.clear();
                resolve(false);
            });
            this.process.on('exit', async (code, signal) => {
                compilerlog_1.CompilerLogParser.parse(stdout, step.rootFile);
                if (!step.isExternal && code === 0) {
                    logger.log(`Finished a step in recipe with PID ${this.process?.pid}.`);
                    this.process = undefined;
                    resolve(true);
                    return;
                }
                else if (code === 0) {
                    logger.log(`Successfully built document with PID ${this.process?.pid}.`);
                    logger.refreshStatus('check', 'statusBar.foreground', 'Build succeeded.');
                    if (step.rootFile === undefined) {
                        lw.viewer.refreshExistingViewer();
                    }
                    this.process = undefined;
                    resolve(true);
                    return;
                }
                if (!step.isExternal) {
                    logger.log(`Recipe returns with error code ${code}/${signal} on PID ${this.process?.pid}.`);
                    logger.log(`Does the executable exist? $PATH: ${env['PATH']}, $Path: ${env['Path']}, $SHELL: ${process.env.SHELL}`);
                    logger.log(`${stderr}`);
                }
                const configuration = vscode.workspace.getConfiguration('latex-workshop', step.rootFile ? vscode.Uri.file(step.rootFile) : undefined);
                if (!step.isExternal && signal !== 'SIGTERM' && !step.isRetry && configuration.get('latex.autoBuild.cleanAndRetry.enabled')) {
                    // Recipe, not terminated by user, is not retry and should retry
                    step.isRetry = true;
                    logger.refreshStatus('x', 'errorForeground', 'Recipe terminated with error. Retry building the project.', 'warning');
                    logger.log('Cleaning auxiliary files and retrying build after toolchain error.');
                    this.stepQueue.prepend(step);
                    await lw.cleaner.clean(step.rootFile);
                }
                else if (!step.isExternal && signal !== 'SIGTERM') {
                    // Recipe, not terminated by user, is retry or should not retry
                    logger.refreshStatus('x', 'errorForeground');
                    if (['onFailed', 'onBuilt'].includes(configuration.get('latex.autoClean.run'))) {
                        await lw.cleaner.clean(step.rootFile);
                    }
                    void logger.showErrorMessageWithCompilerLogButton('Recipe terminated with error.');
                    this.stepQueue.clear();
                }
                else if (step.isExternal) {
                    // External command
                    logger.log(`Build returns with error: ${code}/${signal} on PID ${this.process?.pid}.`);
                    logger.refreshStatus('x', 'errorForeground', undefined, 'warning');
                    void logger.showErrorMessageWithCompilerLogButton('Build terminated with error.');
                    this.stepQueue.clear();
                }
                else {
                    // Terminated by user
                    logger.refreshStatus('x', 'errorForeground');
                    this.stepQueue.clear();
                }
                this.process = undefined;
                resolve(false);
            });
        });
        return result;
    }
    /**
     * Some follow-up operations after successfully finishing a recipe.
     * Primarily concerning PDF refreshing and file cleaning. The execution is
     * covered in {@link buildLoop}.
     *
     * @param step The last {@link Step} in the recipe.
     */
    async afterSuccessfulBuilt(step) {
        if (step.rootFile === undefined) {
            // This only happens when the step is an external command.
            return;
        }
        logger.log(`Successfully built ${step.rootFile} .`);
        logger.refreshStatus('check', 'statusBar.foreground', 'Recipe succeeded.');
        lw.eventBus.fire(eventbus_1.BuildDone);
        if (compilerlog_1.CompilerLogParser.isLaTeXmkSkipped) {
            return;
        }
        lw.viewer.refreshExistingViewer(step.rootFile);
        lw.completer.reference.setNumbersFromAuxFile(step.rootFile);
        await lw.cacher.loadFlsFile(step.rootFile);
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(step.rootFile));
        // If the PDF viewer is internal, we call SyncTeX in src/components/viewer.ts.
        if (configuration.get('view.pdf.viewer') === 'external' && configuration.get('synctex.afterBuild.enabled')) {
            const pdfFile = lw.manager.tex2pdf(step.rootFile);
            logger.log('SyncTex after build invoked.');
            lw.locator.syncTeX(undefined, undefined, pdfFile);
        }
        if (configuration.get('latex.autoClean.run') === 'onBuilt') {
            logger.log('Auto Clean invoked.');
            await lw.cleaner.clean(step.rootFile);
        }
    }
    /**
     * Given an optional recipe, create the corresponding {@link Tool}s.
     */
    createBuildTools(rootFile, langId, recipeName) {
        let buildTools = [];
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(rootFile));
        const [magicTex, magicBib] = this.findMagicPrograms(rootFile);
        if (recipeName === undefined && magicTex && !configuration.get('latex.build.forceRecipeUsage')) {
            buildTools = this.createBuildMagic(rootFile, magicTex, magicBib);
        }
        else {
            const recipe = this.findRecipe(rootFile, langId, recipeName);
            if (recipe === undefined) {
                return undefined;
            }
            logger.log(`Preparing to run recipe: ${recipe.name}.`);
            this.prevRecipe = recipe;
            this.prevLangId = langId;
            const tools = configuration.get('latex.tools');
            recipe.tools.forEach(tool => {
                if (typeof tool === 'string') {
                    const candidates = tools.filter(candidate => candidate.name === tool);
                    if (candidates.length < 1) {
                        logger.log(`Skipping undefined tool ${tool} in recipe ${recipe.name}.`);
                        void logger.showErrorMessage(`Skipping undefined tool "${tool}" in recipe "${recipe.name}."`);
                    }
                    else {
                        buildTools.push(candidates[0]);
                    }
                }
                else {
                    buildTools.push(tool);
                }
            });
        }
        if (buildTools.length < 1) {
            return undefined;
        }
        // Use JSON.parse and JSON.stringify for a deep copy.
        buildTools = JSON.parse(JSON.stringify(buildTools));
        this.populateTools(rootFile, buildTools);
        return buildTools;
    }
    /**
     * Expand the bare {@link Tool} with docker and argument placeholder
     * strings.
     */
    populateTools(rootFile, buildTools) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(rootFile));
        const docker = configuration.get('docker.enabled');
        buildTools.forEach(tool => {
            if (docker) {
                switch (tool.command) {
                    case 'latexmk':
                        logger.log('Use Docker to invoke the command.');
                        if (process.platform === 'win32') {
                            tool.command = path.resolve(lw.extensionRoot, './scripts/latexmk.bat');
                        }
                        else {
                            tool.command = path.resolve(lw.extensionRoot, './scripts/latexmk');
                            fs.chmodSync(tool.command, 0o755);
                        }
                        break;
                    default:
                        logger.log(`Do not use Docker to invoke the command: ${tool.command}.`);
                        break;
                }
            }
            if (tool.args) {
                tool.args = tool.args.map((0, utils_1.replaceArgumentPlaceholders)(rootFile, lw.manager.tmpDir));
            }
            if (tool.env) {
                Object.keys(tool.env).forEach(v => {
                    const e = tool.env && tool.env[v];
                    if (tool.env && e) {
                        tool.env[v] = (0, utils_1.replaceArgumentPlaceholders)(rootFile, lw.manager.tmpDir)(e);
                    }
                });
            }
            if (configuration.get('latex.option.maxPrintLine.enabled')) {
                if (!tool.args) {
                    tool.args = [];
                }
                const isLuaLatex = tool.args.includes('-lualatex') ||
                    tool.args.includes('-pdflua') ||
                    tool.args.includes('-pdflualatex') ||
                    tool.args.includes('--lualatex') ||
                    tool.args.includes('--pdflua') ||
                    tool.args.includes('--pdflualatex');
                if (this.isMiktex && ((tool.command === 'latexmk' && !isLuaLatex) || tool.command === 'pdflatex')) {
                    tool.args.unshift('--max-print-line=' + this.MAX_PRINT_LINE);
                }
            }
        });
        return buildTools;
    }
    findRecipe(rootFile, langId, recipeName) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(rootFile));
        const recipes = configuration.get('latex.recipes');
        const defaultRecipeName = configuration.get('latex.recipe.default');
        if (recipes.length < 1) {
            logger.log('No recipes defined.');
            void logger.showErrorMessage('[Builder] No recipes defined.');
            return undefined;
        }
        if (this.prevLangId !== langId) {
            this.prevRecipe = undefined;
        }
        let recipe;
        // Find recipe according to the given name
        if (recipeName === undefined && !['first', 'lastUsed'].includes(defaultRecipeName)) {
            recipeName = defaultRecipeName;
        }
        if (recipeName) {
            const candidates = recipes.filter(candidate => candidate.name === recipeName);
            if (candidates.length < 1) {
                logger.log(`Failed to resolve build recipe: ${recipeName}.`);
                void logger.showErrorMessage(`[Builder] Failed to resolve build recipe: ${recipeName}.`);
            }
            recipe = candidates[0];
        }
        // Find default recipe of last used
        if (recipe === undefined && defaultRecipeName === 'lastUsed') {
            recipe = this.prevRecipe;
        }
        // If still not found, fallback to 'first'
        if (recipe === undefined) {
            let candidates = recipes;
            if (langId === 'rsweave') {
                candidates = recipes.filter(candidate => candidate.name.toLowerCase().match('rnw|rsweave'));
            }
            else if (langId === 'jlweave') {
                candidates = recipes.filter(candidate => candidate.name.toLowerCase().match('jnw|jlweave|weave.jl'));
            }
            else if (langId === 'pweave') {
                candidates = recipes.filter(candidate => candidate.name.toLowerCase().match('pnw|pweave'));
            }
            if (candidates.length < 1) {
                logger.log(`Failed to resolve build recipe: ${recipeName}.`);
                void logger.showErrorMessage(`Failed to resolve build recipe: ${recipeName}.`);
            }
            recipe = candidates[0];
        }
        return recipe;
    }
    createBuildMagic(rootFile, magicTex, magicBib) {
        const configuration = vscode.workspace.getConfiguration('latex-workshop', vscode.Uri.file(rootFile));
        if (!magicTex.args) {
            magicTex.args = configuration.get('latex.magic.args');
            magicTex.name = this.TEX_MAGIC_PROGRAM_NAME + this.MAGIC_PROGRAM_ARGS_SUFFIX;
        }
        if (magicBib) {
            if (!magicBib.args) {
                magicBib.args = configuration.get('latex.magic.bib.args');
                magicBib.name = this.BIB_MAGIC_PROGRAM_NAME + this.MAGIC_PROGRAM_ARGS_SUFFIX;
            }
            return [magicTex, magicBib, magicTex, magicTex];
        }
        else {
            return [magicTex];
        }
    }
    findMagicPrograms(rootFile) {
        const regexTex = /^(?:%\s*!\s*T[Ee]X\s(?:TS-)?program\s*=\s*([^\s]*)$)/m;
        const regexBib = /^(?:%\s*!\s*BIB\s(?:TS-)?program\s*=\s*([^\s]*)$)/m;
        const regexTexOptions = /^(?:%\s*!\s*T[Ee]X\s(?:TS-)?options\s*=\s*(.*)$)/m;
        const regexBibOptions = /^(?:%\s*!\s*BIB\s(?:TS-)?options\s*=\s*(.*)$)/m;
        const content = fs.readFileSync(rootFile).toString();
        const tex = content.match(regexTex);
        const bib = content.match(regexBib);
        let texCommand = undefined;
        let bibCommand = undefined;
        if (tex) {
            texCommand = {
                name: this.TEX_MAGIC_PROGRAM_NAME,
                command: tex[1]
            };
            logger.log(`Found TeX program by magic comment: ${texCommand.command}.`);
            const res = content.match(regexTexOptions);
            if (res) {
                texCommand.args = [res[1]];
                logger.log(`Found TeX options by magic comment: ${texCommand.args}.`);
            }
        }
        if (bib) {
            bibCommand = {
                name: this.BIB_MAGIC_PROGRAM_NAME,
                command: bib[1]
            };
            logger.log(`Found BIB program by magic comment: ${bibCommand.command}.`);
            const res = content.match(regexBibOptions);
            if (res) {
                bibCommand.args = [res[1]];
                logger.log(`Found BIB options by magic comment: ${bibCommand.args}.`);
            }
        }
        return [texCommand, bibCommand];
    }
    /**
     * Create sub directories of output directory This was supposed to create
     * the outputDir as latexmk does not take care of it (neither does any of
     * latex command). If the output directory does not exist, the latex
     * commands simply fail.
     */
    createOuputSubFolders(rootFile) {
        const rootDir = path.dirname(rootFile);
        let outDir = lw.manager.getOutDir(rootFile);
        if (!path.isAbsolute(outDir)) {
            outDir = path.resolve(rootDir, outDir);
        }
        logger.log(`outDir: ${outDir} .`);
        try {
            lw.cacher.getIncludedTeX(rootFile).forEach(file => {
                const relativePath = path.dirname(file.replace(rootDir, '.'));
                const fullOutDir = path.resolve(outDir, relativePath);
                // To avoid issues when fullOutDir is the root dir
                // Using fs.mkdir() on the root directory even with recursion will result in an error
                if (!(fs.existsSync(fullOutDir) && fs.statSync(fullOutDir).isDirectory())) {
                    fs.mkdirSync(fullOutDir, { recursive: true });
                }
            });
        }
        catch (e) {
            logger.log('Unexpected Error: please see the console log of the Developer Tools of VS Code.');
            logger.refreshStatus('x', 'errorForeground');
            throw (e);
        }
    }
}
exports.Builder = Builder;
class BuildToolQueue {
    constructor() {
        /**
         * The {@link Step}s in the current recipe.
         */
        this.steps = [];
        /**
         * The {@link Step}s in the next recipe to be executed after the current
         * ones.
         */
        this.nextSteps = [];
    }
    /**
     * Add a {@link Tool} to the queue. The input {@link tool} is first wrapped
     * to be a {@link RecipeStep} or {@link ExternalStep} with additional
     * information, according to the nature {@link isExternal}. Then the wrapped
     * {@link Step} is added to the current {@link steps} if they belongs to the
     * same recipe, determined by the same {@link timestamp}, or added to the
     * {@link nextSteps} for later execution.
     *
     * @param tool The {@link Tool} to be added to the queue.
     * @param rootFile Path to the root LaTeX file.
     * @param recipeName The name of the recipe which the {@link tool} belongs
     * to.
     * @param timestamp The timestamp when the recipe is called.
     * @param isExternal Whether the {@link tool} is an external command.
     * @param cwd The current working directory if the {@link tool} is an
     * external command.
     */
    add(tool, rootFile, recipeName, timestamp, isExternal = false, cwd) {
        let step;
        if (!isExternal && rootFile !== undefined) {
            step = tool;
            step.rootFile = rootFile;
            step.recipeName = recipeName;
            step.timestamp = timestamp;
            step.isRetry = false;
            step.isExternal = false;
        }
        else {
            step = tool;
            step.recipeName = 'External';
            step.timestamp = timestamp;
            step.isExternal = true;
            step.cwd = cwd || '';
        }
        if (this.steps.length === 0 || step.timestamp === this.steps[0].timestamp) {
            step.index = (this.steps[0] ? this.steps[0].index : -1) + 1;
            this.steps.push(step);
        }
        else if (this.nextSteps.length === 0 || step.timestamp === this.nextSteps[0].timestamp) {
            step.index = (this.nextSteps[0] ? this.nextSteps[0].index : -1) + 1;
            this.nextSteps.push(step);
        }
        else {
            step.index = 0;
            this.nextSteps = [step];
        }
    }
    prepend(step) {
        this.steps.unshift(step);
    }
    clear() {
        this.nextSteps = [];
        this.steps = [];
    }
    isLastStep(step) {
        return this.steps.length === 0 || this.steps[0].timestamp !== step.timestamp;
    }
    getStepString(step) {
        if (step.timestamp !== this.steps[0]?.timestamp && step.index === 0) {
            return step.recipeName;
        }
        else if (step.timestamp === this.steps[0]?.timestamp) {
            return `${step.recipeName}: ${step.index + 1}/${this.steps[this.steps.length - 1].index + 1} (${step.name})`;
        }
        else {
            return `${step.recipeName}: ${step.index + 1}/${step.index + 1} (${step.name})`;
        }
    }
    getStep() {
        let step;
        if (this.steps.length > 0) {
            step = this.steps.shift();
        }
        else if (this.nextSteps.length > 0) {
            this.steps = this.nextSteps;
            this.nextSteps = [];
            step = this.steps.shift();
        }
        return step;
    }
}
//# sourceMappingURL=builder.js.map