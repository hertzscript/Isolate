const ivm = require('isolated-vm');
const Compiler = require('hertzscript-compiler');
const Dispatcher = require('hertzscript-dispatcher');

if (typeof SharedArrayBuffer === 'undefined') {
	console.error('Please run with --harmony_sharedarraybuffer flag.');
	if (process.argv[2] === '--harmony_sharedarraybuffer') {
		console.error('You have to put the flag *before* the script name since you\'re passing the flag to v8 and not to this script.');
	}
	process.exit(1);
}

/* Coroutine to be launched by Hz on the Isolate */
function coroutine() {
	console.log('Hello Dani');
}

/* Create Isolate */
const isolate = new ivm.Isolate({ memoryLimit: 128 });

const context = isolate.createContextSync();

const jail = context.global;

/* Setup Hz */
const source = Compiler(`(${coroutine})`, false, false, false);
const func = new Function('exports', 'require', 'module', '__filename', '__dirname', `return hzUserLib => { return ${source} };`);
const dispatcher = new Dispatcher();

dispatcher.import(func(exports, require, module, __filename, __dirname));

/* Bind references */
jail.setSync('global', jail.derefInto());

jail.setSync('_ivm', ivm);

jail.setSync('_log', new ivm.Reference(function(...args) {
	console.log(...args);
}));

jail.setSync('_run', new ivm.Reference(function(...args) {
	dispatcher.runComplete(); // ...args
}));

/* Bootstrap Isolate */
const bootstrap = isolate.compileScriptSync('new '+ function() {
	const ivm = _ivm;
	delete _ivm;

	const log = _log;
	delete _log;

	const run = _run;
	delete _run;

	global.log = function(...args) {
		log.applyIgnored(undefined, args.map(arg => new ivm.ExternalCopy(arg).copyInto()));
	};

	global.run = function(...args) {
		run.applyIgnored(undefined, args.map(arg => new ivm.ExternalCopy(arg).copyInto()));
	};
});

bootstrap.runSync(context);

/* Run Hz in a new Isolate */
isolate.compileScriptSync('log("Running Hz Script in a new Isolate"); run();').runSync(context);
