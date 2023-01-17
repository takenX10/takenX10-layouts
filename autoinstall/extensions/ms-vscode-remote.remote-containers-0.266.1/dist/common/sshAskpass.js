/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------------------------------------------*/

var g=Object.create;var n=Object.defineProperty;var A=Object.getOwnPropertyDescriptor;var I=Object.getOwnPropertyNames;var h=Object.getPrototypeOf,u=Object.prototype.hasOwnProperty;var E=s=>n(s,"__esModule",{value:!0});var v=(s,e,c)=>{if(e&&typeof e=="object"||typeof e=="function")for(let o of I(e))!u.call(s,o)&&o!=="default"&&n(s,o,{get:()=>e[o],enumerable:!(c=A(e,o))||c.enumerable});return s},S=s=>v(E(n(s!=null?g(h(s)):{},"default",s&&s.__esModule&&"default"in s?{get:()=>s.default,enumerable:!0}:{value:s,enumerable:!0})),s);var d=S(require("net")),m=S(require("child_process")),f=process.env.VSCODE_SSH_ASKPASS_HANDLE;f||(console.error("VSCODE_SSH_ASKPASS_HANDLE not set."),process.exit(1));var l=process.argv.slice(2),i=process.env.VSCODE_SSH_ASKPASS_COUNTER;if(process.platform==="win32"){let e=m.execSync('wmic process where (commandline like "%ssh-askpass.bat%") get processid,parentprocessid /format:"%WINDIR%\\System32\\wbem\\en-us\\csv"').toString().split(/\r?\n/).map(r=>r.trim()).filter(r=>!!r).map(r=>r.split(",")),c=e.shift(),p=e.map(r=>r.reduce((a,P,_)=>(a[c[_]]=P,a),{})).find(r=>r.ProcessId===String(process.ppid));p&&(i=p.ParentProcessId)}else i=l.shift();var t=d.connect(f,()=>{t.write(JSON.stringify({prompt:l.join(" "),counter:i})+`
`,s=>{s&&(console.error(s),process.exit(1))})});t.setEncoding("utf8");t.on("data",s=>{process.stdout.write(s)});t.on("error",s=>{console.error(s),process.exit(1)});t.on("end",()=>{process.exit(0)});
//# sourceMappingURL=sshAskpass.js.map