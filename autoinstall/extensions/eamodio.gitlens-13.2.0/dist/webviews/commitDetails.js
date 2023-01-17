(()=>{"use strict";var Ir={},an=(s=>(s.File="file",s.Window="window",s))(an||{}),cn=(s=>(s.Issue="Issue",s.PullRequest="PullRequest",s))(cn||{}),ln=(s=>(s.Gutter="gutter",s.Line="line",s.Scrollbar="overview",s))(ln||{}),hn=(s=>(s.DateDesc="date:desc",s.DateAsc="date:asc",s.NameAsc="name:asc",s.NameDesc="name:desc",s))(hn||{}),dn=(s=>(s.Gutter="gutter",s.Line="line",s.Scrollbar="overview",s))(dn||{}),un=(s=>(s.CopyRemoteCommitUrl="gitlens.copyRemoteCommitUrl",s.CopyRemoteFileUrl="gitlens.copyRemoteFileUrl",s.DiffWithPrevious="gitlens.diffWithPrevious",s.OpenCommitOnRemote="gitlens.openCommitOnRemote",s.OpenFileOnRemote="gitlens.openFileOnRemote",s.RevealCommitInView="gitlens.revealCommitInView",s.ShowCommitsInView="gitlens.showCommitsInView",s.ShowQuickCommitDetails="gitlens.showQuickCommitDetails",s.ShowQuickCommitFileDetails="gitlens.showQuickCommitFileDetails",s.ShowQuickCurrentBranchHistory="gitlens.showQuickRepoHistory",s.ShowQuickFileHistory="gitlens.showQuickFileHistory",s.ToggleFileBlame="gitlens.toggleFileBlame",s.ToggleFileChanges="gitlens.toggleFileChanges",s.ToggleFileChangesOnly="gitlens.toggleFileChangesOnly",s.ToggleFileHeatmap="gitlens.toggleFileHeatmap",s))(un||{}),fn=(s=>(s.Document="document",s.Containers="containers",s.Blocks="blocks",s))(fn||{}),bn=(s=>(s.CountDesc="count:desc",s.CountAsc="count:asc",s.DateDesc="date:desc",s.DateAsc="date:asc",s.NameAsc="name:asc",s.NameDesc="name:desc",s))(bn||{}),pn=(s=>(s.AzureDevOps="AzureDevOps",s.Bitbucket="Bitbucket",s.BitbucketServer="BitbucketServer",s.Custom="Custom",s.Gerrit="Gerrit",s.GoogleSource="GoogleSource",s.Gitea="Gitea",s.GitHub="GitHub",s.GitLab="GitLab",s))(pn||{}),mn=(s=>(s.Authored="authored",s.Committed="committed",s))(mn||{}),gn=(s=>(s.Absolute="absolute",s.Relative="relative",s))(gn||{}),vn=(s=>(s.Blame="blame",s.Changes="changes",s.Heatmap="heatmap",s))(vn||{}),yn=(s=>(s.Name="name",s.Usage="usage",s))(yn||{}),wn=(s=>(s.Faces="wavatar",s.Geometric="identicon",s.Monster="monsterid",s.MysteryPerson="mp",s.Retro="retro",s.Robot="robohash",s))(wn||{}),_n=(s=>(s.Gutter="gutter",s.Line="line",s.Scrollbar="overview",s))(_n||{}),$n=(s=>(s.Alternate="alternate",s.Chorded="chorded",s.None="none",s))($n||{}),xn=(s=>(s.Silent="silent",s.Errors="errors",s.Verbose="verbose",s.Debug="debug",s))(xn||{}),Cn=(s=>(s.CopyRemoteCommitUrl="gitlens.copyRemoteCommitUrl",s.CopyRemoteFileUrl="gitlens.copyRemoteFileUrl",s.DiffWithPrevious="gitlens.diffWithPrevious",s.DiffWithWorking="gitlens.diffWithWorking",s.OpenCommitOnRemote="gitlens.openCommitOnRemote",s.OpenFileOnRemote="gitlens.openFileOnRemote",s.RevealCommitInView="gitlens.revealCommitInView",s.ShowCommitsInView="gitlens.showCommitsInView",s.ShowQuickCommitDetails="gitlens.showQuickCommitDetails",s.ShowQuickCommitFileDetails="gitlens.showQuickCommitFileDetails",s.ShowQuickCurrentBranchHistory="gitlens.showQuickRepoHistory",s.ShowQuickFileHistory="gitlens.showQuickFileHistory",s.ToggleCodeLens="gitlens.toggleCodeLens",s.ToggleFileBlame="gitlens.toggleFileBlame",s.ToggleFileChanges="gitlens.toggleFileChanges",s.ToggleFileChangesOnly="gitlens.toggleFileChangesOnly",s.ToggleFileHeatmap="gitlens.toggleFileHeatmap",s))(Cn||{}),kn=(s=>(s.DateDesc="date:desc",s.DateAsc="date:asc",s.NameAsc="name:asc",s.NameDesc="name:desc",s))(kn||{}),An=(s=>(s.List="list",s.Tree="tree",s))(An||{}),W=(s=>(s.Auto="auto",s.List="list",s.Tree="tree",s))(W||{}),Sn=(s=>(s.Branch="branch",s.Working="working",s))(Sn||{}),Pn=(s=>(s.CommitHasNoPreviousCommitWarning="suppressCommitHasNoPreviousCommitWarning",s.CommitNotFoundWarning="suppressCommitNotFoundWarning",s.CreatePullRequestPrompt="suppressCreatePullRequestPrompt",s.SuppressDebugLoggingWarning="suppressDebugLoggingWarning",s.FileNotUnderSourceControlWarning="suppressFileNotUnderSourceControlWarning",s.GitDisabledWarning="suppressGitDisabledWarning",s.GitMissingWarning="suppressGitMissingWarning",s.GitVersionWarning="suppressGitVersionWarning",s.LineUncommittedWarning="suppressLineUncommittedWarning",s.NoRepositoryWarning="suppressNoRepositoryWarning",s.RebaseSwitchToTextWarning="suppressRebaseSwitchToTextWarning",s.IntegrationDisconnectedTooManyFailedRequestsWarning="suppressIntegrationDisconnectedTooManyFailedRequestsWarning",s.IntegrationRequestFailed500Warning="suppressIntegrationRequestFailed500Warning",s.IntegrationRequestTimedOutWarning="suppressIntegrationRequestTimedOutWarning",s))(Pn||{});const Rr=null,Mr=null;function Hr(s,n){const i=[];let r=0;for(;r<s.length;)i.push(s.slice(r,n+r)),r+=n;return i}function jr(s){let n=0;for(const i of s)n+=i.length;return n}function Lr(s,n){const i=Object.create(null);for(const r of s){const a=n(r);i[a]=(i[a]??0)+1}return i}function Ur(s){return s==null?void 0:Array.isArray(s)?s:[s]}function Vr(s,n){let i=0;return s.reduce((r,a)=>{const c=n(a,i++);return c!=null&&r.push(c),r},[])}function qr(s,n){let i=0;return s.reduce(async(r,a)=>{const c=await n(a,i++);return c!=null&&r.push(c),r},[])}function zr(s,n){return s.reduce((i,r)=>{const a=n(r),c=i[a];return c===void 0?i[a]=[r]:c.push(r),i},Object.create(null))}function Wr(s,n){return s.reduce((i,r)=>{const a=n(r),c=i.get(a);return c===void 0?i.set(a,[r]):c.push(r),i},new Map)}function Qr(s,n,i){return s.reduce((r,a)=>{const c=i(a);if(c!=null){const l=n(a),d=r.get(l);d===void 0?r.set(l,[c]):d.push(c)}return r},new Map)}function Gr(s){return typeof s[0]=="string"}function Tn(s,n,i,r=!1,a){const c={name:"",relativePath:"",children:new Map,descendants:[]};let l=s.reduce((d,h)=>{let u=d,f="";for(const b of n(h)){f=i(f,b),u.children===void 0&&(u.children=new Map);let p=u.children.get(b);p===void 0&&(p={name:b,relativePath:f,parent:u,children:void 0,descendants:void 0},u.children.set(b,p)),u.descendants===void 0&&(u.descendants=[]),u.descendants.push(h),u=p}return u.value=h,d},c);return r&&(l=Mt(l,i,!0,a)),l}function Mt(s,n,i=!0,r){if(s.children===void 0)return s;const a=[...s.children.values()];for(const c of a)Mt(c,n,!1,r);if(!i&&a.length===1){const c=a[0];(c.value===void 0||r?.(c.value))&&(s.name=n(s.name,c.name),s.relativePath=c.relativePath,s.children=c.children,s.descendants=c.descendants,s.value=c.value)}return s}function Yr(s){return[...new Set(s)]}function Kr(s,n){return join(new Set(s),n)}function Zr(s,n,i){return[...s.reduce((a,c)=>{const l=n(c),d=a.get(l);if(d===void 0)a.set(l,c);else{const h=i(d,c);h!==void 0&&a.set(l,h)}return a},new Map).values()]}class Ht{constructor(n,i=!1){this.method=n,this.overwriteable=i}}class S extends Ht{}class ve extends Ht{}function jt(s,n,i){s.method===n.method&&i(n.params,s)}const On=new S("webview/ready"),En=new S("webview/focus"),Xr=new S("command/execute"),Jr=new S("configuration/preview"),ea=new S("configuration/update"),ta=new ve("configuration/didChange"),oa=new ve("configuration/didPreview"),na=new ve("webview/didOpenAnchor"),Nn=`\0
\0`,Bn=new S("commit/actions"),Fn=new S("commit/file/actions"),Dn=new S("commit/file/open"),In=new S("commit/file/openOnRemote"),Rn=new S("commit/file/compareWorking"),Mn=new S("commit/file/comparePrevious"),Hn=new S("commit/pickCommit"),jn=new S("commit/searchCommit"),Ln=new S("commit/autolinkSettings"),Un=new S("commit/pin"),ot=new S("commit/preferences"),Lt=new ve("commit/didChange"),ia=new ve("commit/didChange/rich");function Vn(s){var n=typeof s;return s!=null&&(n=="object"||n=="function")}const nt=Vn;var qn=typeof global=="object"&&global&&global.Object===Object&&global;const zn=qn;var Wn=typeof self=="object"&&self&&self.Object===Object&&self,Qn=zn||Wn||Function("return this")();const Ut=Qn;var Gn=function(){return Ut.Date.now()};const it=Gn;var Yn=/\s/;function Kn(s){for(var n=s.length;n--&&Yn.test(s.charAt(n)););return n}const Zn=Kn;var Xn=/^\s+/;function Jn(s){return s&&s.slice(0,Zn(s)+1).replace(Xn,"")}const ei=Jn;var ti=Ut.Symbol;const Be=ti;var Vt=Object.prototype,oi=Vt.hasOwnProperty,ni=Vt.toString,ye=Be?Be.toStringTag:void 0;function ii(s){var n=oi.call(s,ye),i=s[ye];try{s[ye]=void 0;var r=!0}catch{}var a=ni.call(s);return r&&(n?s[ye]=i:delete s[ye]),a}const si=ii;var ri=Object.prototype,ai=ri.toString;function ci(s){return ai.call(s)}const li=ci;var hi="[object Null]",di="[object Undefined]",qt=Be?Be.toStringTag:void 0;function ui(s){return s==null?s===void 0?di:hi:qt&&qt in Object(s)?si(s):li(s)}const fi=ui;function bi(s){return s!=null&&typeof s=="object"}const pi=bi;var mi="[object Symbol]";function gi(s){return typeof s=="symbol"||pi(s)&&fi(s)==mi}const vi=gi;var zt=0/0,yi=/^[-+]0x[0-9a-f]+$/i,wi=/^0b[01]+$/i,_i=/^0o[0-7]+$/i,$i=parseInt;function xi(s){if(typeof s=="number")return s;if(vi(s))return zt;if(nt(s)){var n=typeof s.valueOf=="function"?s.valueOf():s;s=nt(n)?n+"":n}if(typeof s!="string")return s===0?s:+s;s=ei(s);var i=wi.test(s);return i||_i.test(s)?$i(s.slice(2),i?2:8):yi.test(s)?zt:+s}const Wt=xi;var Ci="Expected a function",ki=Math.max,Ai=Math.min;function Si(s,n,i){var r,a,c,l,d,h,u=0,f=!1,b=!1,p=!0;if(typeof s!="function")throw new TypeError(Ci);n=Wt(n)||0,nt(i)&&(f=!!i.leading,b="maxWait"in i,c=b?ki(Wt(i.maxWait)||0,n):c,p="trailing"in i?!!i.trailing:p);function m(v){var D=r,z=a;return r=a=void 0,u=v,l=s.apply(z,D),l}function y(v){return u=v,d=setTimeout(se,n),f?m(v):l}function P(v){var D=v-h,z=v-u,te=n-D;return b?Ai(te,c-z):te}function H(v){var D=v-h,z=v-u;return h===void 0||D>=n||D<0||b&&z>=c}function se(){var v=it();if(H(v))return q(v);d=setTimeout(se,P(v))}function q(v){return d=void 0,p&&r?m(v):(r=a=void 0,l)}function tt(){d!==void 0&&clearTimeout(d),u=0,r=h=a=d=void 0}function Ne(){return d===void 0?l:q(it())}function ge(){var v=it(),D=H(v);if(r=arguments,a=this,h=v,D){if(d===void 0)return y(h);if(b)return clearTimeout(d),d=setTimeout(se,n),m(h)}return d===void 0&&(d=setTimeout(se,n)),l}return ge.cancel=tt,ge.flush=Ne,ge}const Qt=Si;function Pi(s,n,i){const{track:r,...a}={track:!1,...i??{}};if(r!==!0)return Qt(s,n,a);let c=!1;const l=Qt(function(...h){return c=!1,s.apply(this,h)},n,i),d=function(...h){return c=!0,l.apply(this,h)};return d.pending=function(){return c},d.cancel=function(){return l.cancel.apply(l)},d.flush=function(){return l.flush.apply(l)},d}const Ti=",",Gt="",Oi="=",Ei="{",Ni="(",Bi=")",Fi=/\(([\s\S]*)\)/,Di=/(\/\*([\s\S]*?)\*\/|([^:]|^)\/\/(.*)$)/gm,Ii=/\s?=.*$/;function sa(s){if(typeof s!="function")throw new Error("Not supported");if(s.length===0)return[];let n=Function.prototype.toString.call(s);n=n.replace(Di,Gt)||n,n=n.slice(0,n.indexOf(Ei));let i=n.indexOf(Ni),r=n.indexOf(Bi);i=i>=0?i+1:0,r=r>0?r:n.indexOf(Oi),n=n.slice(i,r),n=`(${n})`;const a=Fi.exec(n);return a!=null?a[1].split(Ti).map(c=>c.trim().replace(Ii,Gt)):[]}function ra(s,n,i){return n==null?s!=null:typeof n=="function"?n(s):i===void 0?s[n]!==void 0:s[n]===i}function aa(s){return _once(s)}function ca(s,n){const i=(r,a)=>{const c=i.value===void 0?a:`${i.value}.${a}`;return i.value=c,Object.assign(d=>i(r[a],d),{value:c})};return i(s,n)}function la(s,n){let i;const r={dispose:()=>{i!=null&&(clearInterval(i),i=void 0)}};return i=setInterval(s,n),r}async function ha(s,n,i){for(const r of n)try{await s.apply(i,r)}catch{}}function da(s,n){return s>=n?s*s+s+n:s+n*n}async function ua(s){await new Promise(n=>setTimeout(n,s))}var x;(s=>{function n(a,c,l,d){let h=!1;if(typeof a=="string"){const f=function(b){const p=b?.target?.closest(a);p!=null&&l(b,p)};return document.addEventListener(c,f,d??!0),{dispose:()=>{h||(h=!0,document.removeEventListener(c,f,d??!0))}}}const u=function(f){l(f,this)};return a.addEventListener(c,u,d??!1),{dispose:()=>{h||(h=!0,a.removeEventListener(c,u,d??!1))}}}s.on=n;function i(a,c,l){const d=document.getElementById(a);if(c.replaceChildren(d?.content.cloneNode(!0)),c.className=d.className,l?.visible!=null){const h=c.querySelectorAll("[data-visible]");for(const u of h){const f=u.dataset.visible;f&&(l.visible[f]?u.style.display="initial":u.style.display="none")}}if(l?.bindings!=null){const h=c.querySelectorAll("[data-bind]");for(const u of h){const f=u.dataset.bind;if(!f)continue;const b=l.bindings[f];b!=null&&(u.textContent=String(b))}}}s.insertTemplate=i;function r(a){a.replaceChildren(),a.className=""}s.resetSlot=r})(x||(x={}));const Ri=/^(?:(#?)([0-9a-f]{3}|[0-9a-f]{6})|((?:rgb|hsl)a?)\((-?\d+%?)[,\s]+(-?\d+%?)[,\s]+(-?\d+%?)[,\s]*(-?[\d.]+%?)?\))$/i;function st(s,n){const i=s+n,r=n<0?i<0?0:i:i>255?255:i;return Math.round(r)}function C(s,n){return A(s,-n)}function A(s,n){const i=De(s);if(i==null)return s;const[r,a,c,l]=i,d=255*n/100;return`rgba(${st(r,d)}, ${st(a,d)}, ${st(c,d)}, ${l})`}function B(s,n){const i=De(s);if(i==null)return s;const[r,a,c,l]=i;return`rgba(${r}, ${a}, ${c}, ${l*(n/100)})`}function fa(s,n,i){const r=De(s),a=De(n);if(r==null||a==null)return s;const[c,l,d,h]=r,[u,f,b,p]=a;return`rgba(${Fe(c,u,i)}, ${Fe(l,f,i)}, ${Fe(d,b,i)}, ${Fe(h,p,i)})`}const Fe=(s,n,i)=>s+(n-s)*i/100;function De(s){s=s.trim();const n=Ri.exec(s);if(n==null)return null;if(n[1]==="#"){const i=n[2];switch(i.length){case 3:return[parseInt(i[0]+i[0],16),parseInt(i[1]+i[1],16),parseInt(i[2]+i[2],16),1];case 6:return[parseInt(i.substring(0,2),16),parseInt(i.substring(2,4),16),parseInt(i.substring(4,6),16),1]}return null}switch(n[3]){case"rgb":return[parseInt(n[4],10),parseInt(n[5],10),parseInt(n[6],10),1];case"rgba":return[parseInt(n[4],10),parseInt(n[5],10),parseInt(n[6],10),parseFloat(n[7])];default:return null}}const Yt=class{constructor(){this._disposed=!1}get event(){return this._event==null&&(this._event=(s,n,i)=>{this.listeners==null&&(this.listeners=new Zt);const r=this.listeners.push(n==null?s:[s,n]),a={dispose:()=>{a.dispose=Yt._noop,this._disposed||r()}};return Array.isArray(i)&&i.push(a),a}),this._event}fire(s){if(this.listeners!=null){this._deliveryQueue==null&&(this._deliveryQueue=new Zt);for(let n=this.listeners.iterator(),i=n.next();!i.done;i=n.next())this._deliveryQueue.push([i.value,s]);for(;this._deliveryQueue.size>0;){const[n,i]=this._deliveryQueue.shift();try{typeof n=="function"?n(i):n[0].call(n[1],i)}catch{}}}}dispose(){this.listeners?.clear(),this._deliveryQueue?.clear(),this._disposed=!0}};let Kt=Yt;Kt._noop=function(){};const Mi={done:!0,value:void 0},Ie=class{constructor(s){this.element=s,this.next=Ie.Undefined,this.prev=Ie.Undefined}};let w=Ie;w.Undefined=new Ie(void 0);class Zt{constructor(){this._first=w.Undefined,this._last=w.Undefined,this._size=0}get size(){return this._size}isEmpty(){return this._first===w.Undefined}clear(){this._first=w.Undefined,this._last=w.Undefined,this._size=0}unshift(n){return this._insert(n,!1)}push(n){return this._insert(n,!0)}_insert(n,i){const r=new w(n);if(this._first===w.Undefined)this._first=r,this._last=r;else if(i){const c=this._last;this._last=r,r.prev=c,c.next=r}else{const c=this._first;this._first=r,r.next=c,c.prev=r}this._size+=1;let a=!1;return()=>{a||(a=!0,this._remove(r))}}shift(){if(this._first===w.Undefined)return;const n=this._first.element;return this._remove(this._first),n}pop(){if(this._last===w.Undefined)return;const n=this._last.element;return this._remove(this._last),n}_remove(n){if(n.prev!==w.Undefined&&n.next!==w.Undefined){const i=n.prev;i.next=n.next,n.next.prev=i}else n.prev===w.Undefined&&n.next===w.Undefined?(this._first=w.Undefined,this._last=w.Undefined):n.next===w.Undefined?(this._last=this._last.prev,this._last.next=w.Undefined):n.prev===w.Undefined&&(this._first=this._first.next,this._first.prev=w.Undefined);this._size-=1}iterator(){let n,i=this._first;return{next:function(){return i===w.Undefined?Mi:(n==null?n={done:!1,value:i.element}:n.value=i.element,i=i.next,n)}}}toArray(){const n=[];for(let i=this._first;i!==w.Undefined;i=i.next)n.push(i.element);return n}}const Xt=new Kt,Hi=Xt.event;function ji(){const s=i=>{const r=document.body,a=window.getComputedStyle(r),c=r.classList.contains("vscode-light")||r.classList.contains("vscode-high-contrast-light"),l=r.style;l.setProperty("--font-family",a.getPropertyValue("--vscode-font-family").trim()),l.setProperty("--font-size",a.getPropertyValue("--vscode-font-size").trim()),l.setProperty("--font-weight",a.getPropertyValue("--vscode-font-weight").trim()),l.setProperty("--editor-font-family",a.getPropertyValue("--vscode-editor-font-family").trim()),l.setProperty("--editor-font-size",a.getPropertyValue("--vscode-editor-font-size").trim()),l.setProperty("--editor-font-weight",a.getPropertyValue("--vscode-editor-font-weight").trim());const d=a.getPropertyValue("--vscode-editor-background").trim();let h=d;l.setProperty("--color-background",h),l.setProperty("--color-background--lighten-05",A(h,5)),l.setProperty("--color-background--darken-05",C(h,5)),l.setProperty("--color-background--lighten-075",A(h,7.5)),l.setProperty("--color-background--darken-075",C(h,7.5)),l.setProperty("--color-background--lighten-10",A(h,10)),l.setProperty("--color-background--darken-10",C(h,10)),l.setProperty("--color-background--lighten-15",A(h,15)),l.setProperty("--color-background--darken-15",C(h,15)),l.setProperty("--color-background--lighten-30",A(h,30)),l.setProperty("--color-background--darken-30",C(h,30)),l.setProperty("--color-background--lighten-50",A(h,50)),l.setProperty("--color-background--darken-50",C(h,50)),h=a.getPropertyValue("--vscode-button-background").trim(),l.setProperty("--color-button-background",h),l.setProperty("--color-button-background--darken-30",C(h,30)),l.setProperty("--color-highlight",h),l.setProperty("--color-highlight--75",B(h,75)),l.setProperty("--color-highlight--50",B(h,50)),l.setProperty("--color-highlight--25",B(h,25)),h=a.getPropertyValue("--vscode-button-secondaryBackground").trim(),l.setProperty("--color-button-secondary-background",h),l.setProperty("--color-button-secondary-background--darken-30",C(h,30)),h=a.getPropertyValue("--vscode-button-foreground").trim(),l.setProperty("--color-button-foreground",h);let u=a.getPropertyValue("--vscode-editor-foreground").trim();u||(u=a.getPropertyValue("--vscode-foreground").trim()),l.setProperty("--color-foreground",u),l.setProperty("--color-foreground--85",B(u,85)),l.setProperty("--color-foreground--75",B(u,75)),l.setProperty("--color-foreground--65",B(u,65)),l.setProperty("--color-foreground--50",B(u,50)),h=a.getPropertyValue("--vscode-focusBorder").trim(),l.setProperty("--color-focus-border",h),h=a.getPropertyValue("--vscode-textLink-foreground").trim(),l.setProperty("--color-link-foreground",h),l.setProperty("--color-link-foreground--darken-20",C(h,20)),l.setProperty("--color-link-foreground--lighten-20",A(h,20)),h=a.getPropertyValue("--vscode-sideBar-background").trim(),l.setProperty("--color-view-background",h||d),h=a.getPropertyValue("--vscode-sideBar-foreground").trim(),l.setProperty("--color-view-foreground",h||u),l.setProperty("--color-view-header-foreground",a.getPropertyValue("--vscode-sideBarSectionHeader-foreground").trim()||h||u),h=a.getPropertyValue("--vscode-editorHoverWidget-background").trim(),l.setProperty("--color-hover-background",h),h=a.getPropertyValue("--vscode-editorHoverWidget-border").trim(),l.setProperty("--color-hover-border",h),h=a.getPropertyValue("--vscode-editorHoverWidget-foreground").trim(),l.setProperty("--color-hover-foreground",h),h=a.getPropertyValue("--vscode-editorHoverWidget-statusBarBackground").trim(),l.setProperty("--color-hover-statusBarBackground",h),l.setProperty("--graph-theme-opacity-factor",c?"0.5":"1"),l.setProperty("--color-graph-actionbar-background",c?C(d,5):A(d,5)),l.setProperty("--color-graph-actionbar-selectedBackground",c?C(d,10):A(d,10)),l.setProperty("--color-graph-background",c?C(d,5):A(d,5)),l.setProperty("--color-graph-background2",c?C(d,10):A(d,10)),h=a.getPropertyValue("--vscode-list-focusOutline").trim(),l.setProperty("--color-graph-contrast-border-color",h),h=a.getPropertyValue("--vscode-list-activeSelectionBackground").trim(),l.setProperty("--color-graph-selected-row",h),h=a.getPropertyValue("--vscode-list-hoverBackground").trim(),l.setProperty("--color-graph-hover-row",h),h=a.getPropertyValue("--vscode-list-activeSelectionForeground").trim(),l.setProperty("--color-graph-text-selected-row",h),l.setProperty("--color-graph-text-dimmed-selected",B(h,50)),l.setProperty("--color-graph-text-dimmed",B(u,20)),h=a.getPropertyValue("--vscode-list-hoverForeground").trim(),l.setProperty("--color-graph-text-hovered",h),l.setProperty("--color-graph-text-selected",u),l.setProperty("--color-graph-text-normal",B(u,85)),l.setProperty("--color-graph-text-secondary",B(u,65)),l.setProperty("--color-graph-text-disabled",B(u,50)),h=a.getPropertyValue("--vscode-inputValidation-infoBackground").trim(),l.setProperty("--color-alert-infoHoverBackground",c?C(h,5):A(h,5)),l.setProperty("--color-alert-infoBackground",h),h=a.getPropertyValue("--vscode-inputValidation-warningBackground").trim(),l.setProperty("--color-alert-warningHoverBackground",c?C(h,5):A(h,5)),l.setProperty("--color-alert-warningBackground",h),h=a.getPropertyValue("--vscode-inputValidation-errorBackground").trim(),l.setProperty("--color-alert-errorHoverBackground",c?C(h,5):A(h,5)),l.setProperty("--color-alert-errorBackground",h),h=c?C(d,5):A(d,5),l.setProperty("--color-alert-neutralHoverBackground",c?C(h,5):A(h,5)),l.setProperty("--color-alert-neutralBackground",h),l.setProperty("--color-alert-infoBorder","var(--vscode-inputValidation-infoBorder)"),l.setProperty("--color-alert-warningBorder","var(--vscode-inputValidation-warningBorder)"),l.setProperty("--color-alert-errorBorder","var(--vscode-inputValidation-errorBorder)"),l.setProperty("--color-alert-neutralBorder","var(--vscode-input-foreground)"),l.setProperty("--color-alert-foreground","var(--vscode-input-foreground)"),i!=null&&Xt.fire()};s();const n=new MutationObserver(s);return n.observe(document.body,{attributeFilter:["class"]}),n}const Li=2**30;let Re=0;function Jt(){return Re===Li?Re=1:Re++,`webview:${Re}`}class Ui{constructor(n){this.appName=n,this.state=window.bootstrap,window.bootstrap=void 0,this.log(`${this.appName}()`),this._api=acquireVsCodeApi(),this.onThemeUpdated!=null&&Hi(this.onThemeUpdated,this),ji(),requestAnimationFrame(()=>{this.log(`${this.appName}.initializing`);try{this.onInitialize?.(),this.bind(),this.onMessageReceived!=null&&window.addEventListener("message",this.onMessageReceived.bind(this)),this.sendCommand(On,void 0),this.onInitialized?.()}finally{document.body.classList.contains("preload")&&setTimeout(()=>{document.body.classList.remove("preload")},500)}})}bind(){this.bindDisposables?.forEach(i=>i.dispose()),this.bindDisposables=this.onBind?.(),this.bindDisposables==null&&(this.bindDisposables=[]);const n=Pi(i=>{this.sendCommand(En,i)},150);this.bindDisposables.push(x.on(document,"focusin",i=>{const r=i.composedPath().some(a=>a.tagName==="INPUT");(this._focused!==!0||this._inputFocused!==r)&&(this._focused=!0,this._inputFocused=r,n({focused:!0,inputFocused:r}))}),x.on(document,"focusout",()=>{(this._focused!==!1||this._inputFocused!==!1)&&(this._focused=!1,this._inputFocused=!1,n({focused:!1,inputFocused:!1}))}))}log(n,...i){}getState(){return this._api.getState()}sendCommand(n,i){const r=Jt();this.log(`${this.appName}.sendCommand(${r}): name=${n.method}`),this.postMessage({id:r,method:n.method,params:i})}async sendCommandWithCompletion(n,i,r){const a=Jt();this.log(`${this.appName}.sendCommandWithCompletion(${a}): name=${n.method}`);const c=new Promise((l,d)=>{let h;const u=[x.on(window,"message",f=>{jt(r,f.data,b=>{f.data.completionId===a&&(u.forEach(p=>p.dispose()),queueMicrotask(()=>l(b)))})}),{dispose:function(){h!=null&&(clearTimeout(h),h=void 0)}}];h=setTimeout(()=>{h=void 0,u.forEach(f=>f.dispose()),d(new Error(`Timed out waiting for completion of ${r.method}`))},6e4)});return this.postMessage({id:a,method:n.method,params:i,completionId:a}),c}setState(n){this.state=n,n!=null&&this._api.setState(n)}postMessage(n){this._api.postMessage(n)}}class Vi{createCSS(){return""}createBehavior(){}}const Q=function(){if(typeof globalThis<"u")return globalThis;if(typeof global<"u")return global;if(typeof self<"u")return self;if(typeof window<"u")return window;try{return new Function("return this")()}catch{return{}}}();Q.trustedTypes===void 0&&(Q.trustedTypes={createPolicy:(s,n)=>n});const eo={configurable:!1,enumerable:!1,writable:!1};Q.FAST===void 0&&Reflect.defineProperty(Q,"FAST",Object.assign({value:Object.create(null)},eo));const we=Q.FAST;if(we.getById===void 0){const s=Object.create(null);Reflect.defineProperty(we,"getById",Object.assign({value(n,i){let r=s[n];return r===void 0&&(r=i?s[n]=i():null),r}},eo))}const rt=Object.freeze([]);function to(){const s=new WeakMap;return function(n){let i=s.get(n);if(i===void 0){let r=Reflect.getPrototypeOf(n);for(;i===void 0&&r!==null;)i=s.get(r),r=Reflect.getPrototypeOf(r);i=i===void 0?[]:i.slice(0),s.set(n,i)}return i}}const at=Q.FAST.getById(1,()=>{const s=[],n=[];function i(){if(n.length)throw n.shift()}function r(l){try{l.call()}catch(d){n.push(d),setTimeout(i,0)}}function a(){let d=0;for(;d<s.length;)if(r(s[d]),d++,d>1024){for(let h=0,u=s.length-d;h<u;h++)s[h]=s[h+d];s.length-=d,d=0}s.length=0}function c(l){s.length<1&&Q.requestAnimationFrame(a),s.push(l)}return Object.freeze({enqueue:c,process:a})}),oo=Q.trustedTypes.createPolicy("fast-html",{createHTML:s=>s});let ct=oo;const _e=`fast-${Math.random().toString(36).substring(2,8)}`,no=`${_e}{`,lt=`}${_e}`,_=Object.freeze({supportsAdoptedStyleSheets:Array.isArray(document.adoptedStyleSheets)&&"replace"in CSSStyleSheet.prototype,setHTMLPolicy(s){if(ct!==oo)throw new Error("The HTML policy can only be set once.");ct=s},createHTML(s){return ct.createHTML(s)},isMarker(s){return s&&s.nodeType===8&&s.data.startsWith(_e)},extractDirectiveIndexFromMarker(s){return parseInt(s.data.replace(`${_e}:`,""))},createInterpolationPlaceholder(s){return`${no}${s}${lt}`},createCustomAttributePlaceholder(s,n){return`${s}="${this.createInterpolationPlaceholder(n)}"`},createBlockPlaceholder(s){return`<!--${_e}:${s}-->`},queueUpdate:at.enqueue,processUpdates:at.process,nextUpdate(){return new Promise(at.enqueue)},setAttribute(s,n,i){i==null?s.removeAttribute(n):s.setAttribute(n,i)},setBooleanAttribute(s,n,i){i?s.setAttribute(n,""):s.removeAttribute(n)},removeChildNodes(s){for(let n=s.firstChild;n!==null;n=s.firstChild)s.removeChild(n)},createTemplateWalker(s){return document.createTreeWalker(s,133,null,!1)}});class I{constructor(){this.targets=new WeakSet}addStylesTo(n){this.targets.add(n)}removeStylesFrom(n){this.targets.delete(n)}isAttachedTo(n){return this.targets.has(n)}withBehaviors(...n){return this.behaviors=this.behaviors===null?n:this.behaviors.concat(n),this}}I.create=(()=>{if(_.supportsAdoptedStyleSheets){const s=new Map;return n=>new qi(n,s)}return s=>new Qi(s)})();function ht(s){return s.map(n=>n instanceof I?ht(n.styles):[n]).reduce((n,i)=>n.concat(i),[])}function io(s){return s.map(n=>n instanceof I?n.behaviors:null).reduce((n,i)=>i===null?n:(n===null&&(n=[]),n.concat(i)),null)}class qi extends I{constructor(n,i){super(),this.styles=n,this.styleSheetCache=i,this._styleSheets=void 0,this.behaviors=io(n)}get styleSheets(){if(this._styleSheets===void 0){const n=this.styles,i=this.styleSheetCache;this._styleSheets=ht(n).map(r=>{if(r instanceof CSSStyleSheet)return r;let a=i.get(r);return a===void 0&&(a=new CSSStyleSheet,a.replaceSync(r),i.set(r,a)),a})}return this._styleSheets}addStylesTo(n){n.adoptedStyleSheets=[...n.adoptedStyleSheets,...this.styleSheets],super.addStylesTo(n)}removeStylesFrom(n){const i=this.styleSheets;n.adoptedStyleSheets=n.adoptedStyleSheets.filter(r=>i.indexOf(r)===-1),super.removeStylesFrom(n)}}let zi=0;function Wi(){return`fast-style-class-${++zi}`}class Qi extends I{constructor(n){super(),this.styles=n,this.behaviors=null,this.behaviors=io(n),this.styleSheets=ht(n),this.styleClass=Wi()}addStylesTo(n){const i=this.styleSheets,r=this.styleClass;n=this.normalizeTarget(n);for(let a=0;a<i.length;a++){const c=document.createElement("style");c.innerHTML=i[a],c.className=r,n.append(c)}super.addStylesTo(n)}removeStylesFrom(n){n=this.normalizeTarget(n);const i=n.querySelectorAll(`.${this.styleClass}`);for(let r=0,a=i.length;r<a;++r)n.removeChild(i[r]);super.removeStylesFrom(n)}isAttachedTo(n){return super.isAttachedTo(this.normalizeTarget(n))}normalizeTarget(n){return n===document?document.body:n}}function so(s,n){const i=[];let r="";const a=[];for(let c=0,l=s.length-1;c<l;++c){r+=s[c];let d=n[c];if(d instanceof Vi){const h=d.createBehavior();d=d.createCSS(),h&&a.push(h)}d instanceof I||d instanceof CSSStyleSheet?(r.trim()!==""&&(i.push(r),r=""),i.push(d)):r+=d}return r+=s[s.length-1],r.trim()!==""&&i.push(r),{styles:i,behaviors:a}}function G(s,...n){const{styles:i,behaviors:r}=so(s,n),a=I.create(i);return r.length&&a.withBehaviors(...r),a}class Gi extends null{constructor(n,i){super(),this.behaviors=i,this.css="";const r=n.reduce((a,c)=>(typeof c=="string"?this.css+=c:a.push(c),a),[]);r.length&&(this.styles=ElementStyles.create(r))}createBehavior(){return this}createCSS(){return this.css}bind(n){this.styles&&n.$fastController.addStyles(this.styles),this.behaviors.length&&n.$fastController.addBehaviors(this.behaviors)}unbind(n){this.styles&&n.$fastController.removeStyles(this.styles),this.behaviors.length&&n.$fastController.removeBehaviors(this.behaviors)}}function ba(s,...n){const{styles:i,behaviors:r}=so(s,n);return new Gi(i,r)}class Me{constructor(n,i){this.sub1=void 0,this.sub2=void 0,this.spillover=void 0,this.source=n,this.sub1=i}has(n){return this.spillover===void 0?this.sub1===n||this.sub2===n:this.spillover.indexOf(n)!==-1}subscribe(n){const i=this.spillover;if(i===void 0){if(this.has(n))return;if(this.sub1===void 0){this.sub1=n;return}if(this.sub2===void 0){this.sub2=n;return}this.spillover=[this.sub1,this.sub2,n],this.sub1=void 0,this.sub2=void 0}else i.indexOf(n)===-1&&i.push(n)}unsubscribe(n){const i=this.spillover;if(i===void 0)this.sub1===n?this.sub1=void 0:this.sub2===n&&(this.sub2=void 0);else{const r=i.indexOf(n);r!==-1&&i.splice(r,1)}}notify(n){const i=this.spillover,r=this.source;if(i===void 0){const a=this.sub1,c=this.sub2;a!==void 0&&a.handleChange(r,n),c!==void 0&&c.handleChange(r,n)}else for(let a=0,c=i.length;a<c;++a)i[a].handleChange(r,n)}}class ro{constructor(n){this.subscribers={},this.sourceSubscribers=null,this.source=n}notify(n){var i;const r=this.subscribers[n];r!==void 0&&r.notify(n),(i=this.sourceSubscribers)===null||i===void 0||i.notify(n)}subscribe(n,i){var r;if(i){let a=this.subscribers[i];a===void 0&&(this.subscribers[i]=a=new Me(this.source)),a.subscribe(n)}else this.sourceSubscribers=(r=this.sourceSubscribers)!==null&&r!==void 0?r:new Me(this.source),this.sourceSubscribers.subscribe(n)}unsubscribe(n,i){var r;if(i){const a=this.subscribers[i];a!==void 0&&a.unsubscribe(n)}else(r=this.sourceSubscribers)===null||r===void 0||r.unsubscribe(n)}}const k=we.getById(2,()=>{const s=/(:|&&|\|\||if)/,n=new WeakMap,i=_.queueUpdate;let r,a=u=>{throw new Error("Must call enableArrayObservation before observing arrays.")};function c(u){let f=u.$fastController||n.get(u);return f===void 0&&(Array.isArray(u)?f=a(u):n.set(u,f=new ro(u))),f}const l=to();class d{constructor(f){this.name=f,this.field=`_${f}`,this.callback=`${f}Changed`}getValue(f){return r!==void 0&&r.watch(f,this.name),f[this.field]}setValue(f,b){const p=this.field,m=f[p];if(m!==b){f[p]=b;const y=f[this.callback];typeof y=="function"&&y.call(f,m,b),c(f).notify(this.name)}}}class h extends Me{constructor(f,b,p=!1){super(f,b),this.binding=f,this.isVolatileBinding=p,this.needsRefresh=!0,this.needsQueue=!0,this.first=this,this.last=null,this.propertySource=void 0,this.propertyName=void 0,this.notifier=void 0,this.next=void 0}observe(f,b){this.needsRefresh&&this.last!==null&&this.disconnect();const p=r;r=this.needsRefresh?this:void 0,this.needsRefresh=this.isVolatileBinding;const m=this.binding(f,b);return r=p,m}disconnect(){if(this.last!==null){let f=this.first;for(;f!==void 0;)f.notifier.unsubscribe(this,f.propertyName),f=f.next;this.last=null,this.needsRefresh=this.needsQueue=!0}}watch(f,b){const p=this.last,m=c(f),y=p===null?this.first:{};if(y.propertySource=f,y.propertyName=b,y.notifier=m,m.subscribe(this,b),p!==null){if(!this.needsRefresh){let P;r=void 0,P=p.propertySource[p.propertyName],r=this,f===P&&(this.needsRefresh=!0)}p.next=y}this.last=y}handleChange(){this.needsQueue&&(this.needsQueue=!1,i(this))}call(){this.last!==null&&(this.needsQueue=!0,this.notify(this))}records(){let f=this.first;return{next:()=>{const b=f;return b===void 0?{value:void 0,done:!0}:(f=f.next,{value:b,done:!1})},[Symbol.iterator]:function(){return this}}}}return Object.freeze({setArrayObserverFactory(u){a=u},getNotifier:c,track(u,f){r!==void 0&&r.watch(u,f)},trackVolatile(){r!==void 0&&(r.needsRefresh=!0)},notify(u,f){c(u).notify(f)},defineProperty(u,f){typeof f=="string"&&(f=new d(f)),l(u).push(f),Reflect.defineProperty(u,f.name,{enumerable:!0,get:function(){return f.getValue(this)},set:function(b){f.setValue(this,b)}})},getAccessors:l,binding(u,f,b=this.isVolatileBinding(u)){return new h(u,f,b)},isVolatileBinding(u){return s.test(u.toString())}})});function ao(s,n){k.defineProperty(s,n)}function He(s,n,i){return Object.assign({},i,{get:function(){return k.trackVolatile(),i.get.apply(this)}})}const co=we.getById(3,()=>{let s=null;return{get(){return s},set(n){s=n}}});class $e{constructor(){this.index=0,this.length=0,this.parent=null,this.parentContext=null}get event(){return co.get()}get isEven(){return this.index%2===0}get isOdd(){return this.index%2!==0}get isFirst(){return this.index===0}get isInMiddle(){return!this.isFirst&&!this.isLast}get isLast(){return this.index===this.length-1}static setEvent(n){co.set(n)}}k.defineProperty($e.prototype,"index"),k.defineProperty($e.prototype,"length");const je=Object.seal(new $e),lo=Object.freeze({locate:to()}),Yi={toView(s){return s?"true":"false"},fromView(s){return!(s==null||s==="false"||s===!1||s===0)}},pa={toView(s){if(s==null)return null;const n=s*1;return isNaN(n)?null:n.toString()},fromView(s){if(s==null)return null;const n=s*1;return isNaN(n)?null:n}};class Le{constructor(n,i,r=i.toLowerCase(),a="reflect",c){this.guards=new Set,this.Owner=n,this.name=i,this.attribute=r,this.mode=a,this.converter=c,this.fieldName=`_${i}`,this.callbackName=`${i}Changed`,this.hasCallback=this.callbackName in n.prototype,a==="boolean"&&c===void 0&&(this.converter=Yi)}setValue(n,i){const r=n[this.fieldName],a=this.converter;a!==void 0&&(i=a.fromView(i)),r!==i&&(n[this.fieldName]=i,this.tryReflectToAttribute(n),this.hasCallback&&n[this.callbackName](r,i),n.$fastController.notify(this.name))}getValue(n){return k.track(n,this.name),n[this.fieldName]}onAttributeChangedCallback(n,i){this.guards.has(n)||(this.guards.add(n),this.setValue(n,i),this.guards.delete(n))}tryReflectToAttribute(n){const i=this.mode,r=this.guards;r.has(n)||i==="fromView"||_.queueUpdate(()=>{r.add(n);const a=n[this.fieldName];switch(i){case"reflect":const c=this.converter;_.setAttribute(n,this.attribute,c!==void 0?c.toView(a):a);break;case"boolean":_.setBooleanAttribute(n,this.attribute,a);break}r.delete(n)})}static collect(n,...i){const r=[];i.push(lo.locate(n));for(let a=0,c=i.length;a<c;++a){const l=i[a];if(l!==void 0)for(let d=0,h=l.length;d<h;++d){const u=l[d];typeof u=="string"?r.push(new Le(n,u)):r.push(new Le(n,u.property,u.attribute,u.mode,u.converter))}}return r}}function g(s,n){let i;function r(a,c){arguments.length>1&&(i.property=c),lo.locate(a.constructor).push(i)}if(arguments.length>1){i={},r(s,n);return}return i=s===void 0?{}:s,r}const ho={mode:"open"},uo={},dt=we.getById(4,()=>{const s=new Map;return Object.freeze({register(n){return s.has(n.type)?!1:(s.set(n.type,n),!0)},getByType(n){return s.get(n)}})});class Ue{constructor(n,i=n.definition){typeof i=="string"&&(i={name:i}),this.type=n,this.name=i.name,this.template=i.template;const r=Le.collect(n,i.attributes),a=new Array(r.length),c={},l={};for(let d=0,h=r.length;d<h;++d){const u=r[d];a[d]=u.attribute,c[u.name]=u,l[u.attribute]=u}this.attributes=r,this.observedAttributes=a,this.propertyLookup=c,this.attributeLookup=l,this.shadowOptions=i.shadowOptions===void 0?ho:i.shadowOptions===null?void 0:Object.assign(Object.assign({},ho),i.shadowOptions),this.elementOptions=i.elementOptions===void 0?uo:Object.assign(Object.assign({},uo),i.elementOptions),this.styles=i.styles===void 0?void 0:Array.isArray(i.styles)?I.create(i.styles):i.styles instanceof I?i.styles:I.create([i.styles])}get isDefined(){return!!dt.getByType(this.type)}define(n=customElements){const i=this.type;if(dt.register(this)){const r=this.attributes,a=i.prototype;for(let c=0,l=r.length;c<l;++c)k.defineProperty(a,r[c]);Reflect.defineProperty(i,"observedAttributes",{value:this.observedAttributes,enumerable:!0})}return n.get(this.name)||n.define(this.name,i,this.elementOptions),this}}Ue.forType=dt.getByType;const fo=new WeakMap,Ki={bubbles:!0,composed:!0,cancelable:!0};function ut(s){return s.shadowRoot||fo.get(s)||null}class ft extends ro{constructor(n,i){super(n),this.boundObservables=null,this.behaviors=null,this.needsInitialization=!0,this._template=null,this._styles=null,this._isConnected=!1,this.$fastController=this,this.view=null,this.element=n,this.definition=i;const r=i.shadowOptions;if(r!==void 0){const c=n.attachShadow(r);r.mode==="closed"&&fo.set(n,c)}const a=k.getAccessors(n);if(a.length>0){const c=this.boundObservables=Object.create(null);for(let l=0,d=a.length;l<d;++l){const h=a[l].name,u=n[h];u!==void 0&&(delete n[h],c[h]=u)}}}get isConnected(){return k.track(this,"isConnected"),this._isConnected}setIsConnected(n){this._isConnected=n,k.notify(this,"isConnected")}get template(){return this._template}set template(n){this._template!==n&&(this._template=n,this.needsInitialization||this.renderTemplate(n))}get styles(){return this._styles}set styles(n){this._styles!==n&&(this._styles!==null&&this.removeStyles(this._styles),this._styles=n,!this.needsInitialization&&n!==null&&this.addStyles(n))}addStyles(n){const i=ut(this.element)||this.element.getRootNode();if(n instanceof HTMLStyleElement)i.append(n);else if(!n.isAttachedTo(i)){const r=n.behaviors;n.addStylesTo(i),r!==null&&this.addBehaviors(r)}}removeStyles(n){const i=ut(this.element)||this.element.getRootNode();if(n instanceof HTMLStyleElement)i.removeChild(n);else if(n.isAttachedTo(i)){const r=n.behaviors;n.removeStylesFrom(i),r!==null&&this.removeBehaviors(r)}}addBehaviors(n){const i=this.behaviors||(this.behaviors=new Map),r=n.length,a=[];for(let c=0;c<r;++c){const l=n[c];i.has(l)?i.set(l,i.get(l)+1):(i.set(l,1),a.push(l))}if(this._isConnected){const c=this.element;for(let l=0;l<a.length;++l)a[l].bind(c,je)}}removeBehaviors(n,i=!1){const r=this.behaviors;if(r===null)return;const a=n.length,c=[];for(let l=0;l<a;++l){const d=n[l];if(r.has(d)){const h=r.get(d)-1;h===0||i?r.delete(d)&&c.push(d):r.set(d,h)}}if(this._isConnected){const l=this.element;for(let d=0;d<c.length;++d)c[d].unbind(l)}}onConnectedCallback(){if(this._isConnected)return;const n=this.element;this.needsInitialization?this.finishInitialization():this.view!==null&&this.view.bind(n,je);const i=this.behaviors;if(i!==null)for(const[r]of i)r.bind(n,je);this.setIsConnected(!0)}onDisconnectedCallback(){if(!this._isConnected)return;this.setIsConnected(!1);const n=this.view;n!==null&&n.unbind();const i=this.behaviors;if(i!==null){const r=this.element;for(const[a]of i)a.unbind(r)}}onAttributeChangedCallback(n,i,r){const a=this.definition.attributeLookup[n];a!==void 0&&a.onAttributeChangedCallback(this.element,r)}emit(n,i,r){return this._isConnected?this.element.dispatchEvent(new CustomEvent(n,Object.assign(Object.assign({detail:i},Ki),r))):!1}finishInitialization(){const n=this.element,i=this.boundObservables;if(i!==null){const a=Object.keys(i);for(let c=0,l=a.length;c<l;++c){const d=a[c];n[d]=i[d]}this.boundObservables=null}const r=this.definition;this._template===null&&(this.element.resolveTemplate?this._template=this.element.resolveTemplate():r.template&&(this._template=r.template||null)),this._template!==null&&this.renderTemplate(this._template),this._styles===null&&(this.element.resolveStyles?this._styles=this.element.resolveStyles():r.styles&&(this._styles=r.styles||null)),this._styles!==null&&this.addStyles(this._styles),this.needsInitialization=!1}renderTemplate(n){const i=this.element,r=ut(i)||i;this.view!==null?(this.view.dispose(),this.view=null):this.needsInitialization||_.removeChildNodes(r),n&&(this.view=n.render(i,r,i))}static forCustomElement(n){const i=n.$fastController;if(i!==void 0)return i;const r=Ue.forType(n.constructor);if(r===void 0)throw new Error("Missing FASTElement definition.");return n.$fastController=new ft(n,r)}}function bo(s){return class extends s{constructor(){super(),ft.forCustomElement(this)}$emit(n,i,r){return this.$fastController.emit(n,i,r)}connectedCallback(){this.$fastController.onConnectedCallback()}disconnectedCallback(){this.$fastController.onDisconnectedCallback()}attributeChangedCallback(n,i,r){this.$fastController.onAttributeChangedCallback(n,i,r)}}}const Y=Object.assign(bo(HTMLElement),{from(s){return bo(s)},define(s,n){return new Ue(s,n).define().type}});function K(s){return function(n){new Ue(n,s).define()}}var Zi=Object.defineProperty,Xi=Object.getOwnPropertyDescriptor,Ve=(s,n,i,r)=>{for(var a=r>1?void 0:r?Xi(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Zi(n,i,a),a};const Ji=G`
	:host {
		font: normal normal normal var(--code-icon-size, 16px) / 1 codicon;
		display: inline-block;
		text-decoration: none;
		text-rendering: auto;
		text-align: center;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
		color: inherit;
		vertical-align: text-bottom;
		letter-spacing: normal;
	}

	:host([icon='add']):before {
		content: '\\ea60';
	}
	:host([icon='plus']):before {
		content: '\\ea60';
	}
	:host([icon='gist-new']):before {
		content: '\\ea60';
	}
	:host([icon='repo-create']):before {
		content: '\\ea60';
	}
	:host([icon='lightbulb']):before {
		content: '\\ea61';
	}
	:host([icon='light-bulb']):before {
		content: '\\ea61';
	}
	:host([icon='repo']):before {
		content: '\\ea62';
	}
	:host([icon='repo-delete']):before {
		content: '\\ea62';
	}
	:host([icon='gist-fork']):before {
		content: '\\ea63';
	}
	:host([icon='repo-forked']):before {
		content: '\\ea63';
	}
	:host([icon='git-pull-request']):before {
		content: '\\ea64';
	}
	:host([icon='git-pull-request-abandoned']):before {
		content: '\\ea64';
	}
	:host([icon='record-keys']):before {
		content: '\\ea65';
	}
	:host([icon='keyboard']):before {
		content: '\\ea65';
	}
	:host([icon='tag']):before {
		content: '\\ea66';
	}
	:host([icon='tag-add']):before {
		content: '\\ea66';
	}
	:host([icon='tag-remove']):before {
		content: '\\ea66';
	}
	:host([icon='person']):before {
		content: '\\ea67';
	}
	:host([icon='person-follow']):before {
		content: '\\ea67';
	}
	:host([icon='person-outline']):before {
		content: '\\ea67';
	}
	:host([icon='person-filled']):before {
		content: '\\ea67';
	}
	:host([icon='git-branch']):before {
		content: '\\ea68';
	}
	:host([icon='git-branch-create']):before {
		content: '\\ea68';
	}
	:host([icon='git-branch-delete']):before {
		content: '\\ea68';
	}
	:host([icon='source-control']):before {
		content: '\\ea68';
	}
	:host([icon='mirror']):before {
		content: '\\ea69';
	}
	:host([icon='mirror-public']):before {
		content: '\\ea69';
	}
	:host([icon='star']):before {
		content: '\\ea6a';
	}
	:host([icon='star-add']):before {
		content: '\\ea6a';
	}
	:host([icon='star-delete']):before {
		content: '\\ea6a';
	}
	:host([icon='star-empty']):before {
		content: '\\ea6a';
	}
	:host([icon='comment']):before {
		content: '\\ea6b';
	}
	:host([icon='comment-add']):before {
		content: '\\ea6b';
	}
	:host([icon='alert']):before {
		content: '\\ea6c';
	}
	:host([icon='warning']):before {
		content: '\\ea6c';
	}
	:host([icon='search']):before {
		content: '\\ea6d';
	}
	:host([icon='search-save']):before {
		content: '\\ea6d';
	}
	:host([icon='log-out']):before {
		content: '\\ea6e';
	}
	:host([icon='sign-out']):before {
		content: '\\ea6e';
	}
	:host([icon='log-in']):before {
		content: '\\ea6f';
	}
	:host([icon='sign-in']):before {
		content: '\\ea6f';
	}
	:host([icon='eye']):before {
		content: '\\ea70';
	}
	:host([icon='eye-unwatch']):before {
		content: '\\ea70';
	}
	:host([icon='eye-watch']):before {
		content: '\\ea70';
	}
	:host([icon='circle-filled']):before {
		content: '\\ea71';
	}
	:host([icon='primitive-dot']):before {
		content: '\\ea71';
	}
	:host([icon='close-dirty']):before {
		content: '\\ea71';
	}
	:host([icon='debug-breakpoint']):before {
		content: '\\ea71';
	}
	:host([icon='debug-breakpoint-disabled']):before {
		content: '\\ea71';
	}
	:host([icon='debug-hint']):before {
		content: '\\ea71';
	}
	:host([icon='primitive-square']):before {
		content: '\\ea72';
	}
	:host([icon='edit']):before {
		content: '\\ea73';
	}
	:host([icon='pencil']):before {
		content: '\\ea73';
	}
	:host([icon='info']):before {
		content: '\\ea74';
	}
	:host([icon='issue-opened']):before {
		content: '\\ea74';
	}
	:host([icon='gist-private']):before {
		content: '\\ea75';
	}
	:host([icon='git-fork-private']):before {
		content: '\\ea75';
	}
	:host([icon='lock']):before {
		content: '\\ea75';
	}
	:host([icon='mirror-private']):before {
		content: '\\ea75';
	}
	:host([icon='close']):before {
		content: '\\ea76';
	}
	:host([icon='remove-close']):before {
		content: '\\ea76';
	}
	:host([icon='x']):before {
		content: '\\ea76';
	}
	:host([icon='repo-sync']):before {
		content: '\\ea77';
	}
	:host([icon='sync']):before {
		content: '\\ea77';
	}
	:host([icon='clone']):before {
		content: '\\ea78';
	}
	:host([icon='desktop-download']):before {
		content: '\\ea78';
	}
	:host([icon='beaker']):before {
		content: '\\ea79';
	}
	:host([icon='microscope']):before {
		content: '\\ea79';
	}
	:host([icon='vm']):before {
		content: '\\ea7a';
	}
	:host([icon='device-desktop']):before {
		content: '\\ea7a';
	}
	:host([icon='file']):before {
		content: '\\ea7b';
	}
	:host([icon='file-text']):before {
		content: '\\ea7b';
	}
	:host([icon='more']):before {
		content: '\\ea7c';
	}
	:host([icon='ellipsis']):before {
		content: '\\ea7c';
	}
	:host([icon='kebab-horizontal']):before {
		content: '\\ea7c';
	}
	:host([icon='mail-reply']):before {
		content: '\\ea7d';
	}
	:host([icon='reply']):before {
		content: '\\ea7d';
	}
	:host([icon='organization']):before {
		content: '\\ea7e';
	}
	:host([icon='organization-filled']):before {
		content: '\\ea7e';
	}
	:host([icon='organization-outline']):before {
		content: '\\ea7e';
	}
	:host([icon='new-file']):before {
		content: '\\ea7f';
	}
	:host([icon='file-add']):before {
		content: '\\ea7f';
	}
	:host([icon='new-folder']):before {
		content: '\\ea80';
	}
	:host([icon='file-directory-create']):before {
		content: '\\ea80';
	}
	:host([icon='trash']):before {
		content: '\\ea81';
	}
	:host([icon='trashcan']):before {
		content: '\\ea81';
	}
	:host([icon='history']):before {
		content: '\\ea82';
	}
	:host([icon='clock']):before {
		content: '\\ea82';
	}
	:host([icon='folder']):before {
		content: '\\ea83';
	}
	:host([icon='file-directory']):before {
		content: '\\ea83';
	}
	:host([icon='symbol-folder']):before {
		content: '\\ea83';
	}
	:host([icon='logo-github']):before {
		content: '\\ea84';
	}
	:host([icon='mark-github']):before {
		content: '\\ea84';
	}
	:host([icon='github']):before {
		content: '\\ea84';
	}
	:host([icon='terminal']):before {
		content: '\\ea85';
	}
	:host([icon='console']):before {
		content: '\\ea85';
	}
	:host([icon='repl']):before {
		content: '\\ea85';
	}
	:host([icon='zap']):before {
		content: '\\ea86';
	}
	:host([icon='symbol-event']):before {
		content: '\\ea86';
	}
	:host([icon='error']):before {
		content: '\\ea87';
	}
	:host([icon='stop']):before {
		content: '\\ea87';
	}
	:host([icon='variable']):before {
		content: '\\ea88';
	}
	:host([icon='symbol-variable']):before {
		content: '\\ea88';
	}
	:host([icon='array']):before {
		content: '\\ea8a';
	}
	:host([icon='symbol-array']):before {
		content: '\\ea8a';
	}
	:host([icon='symbol-module']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-package']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-namespace']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-object']):before {
		content: '\\ea8b';
	}
	:host([icon='symbol-method']):before {
		content: '\\ea8c';
	}
	:host([icon='symbol-function']):before {
		content: '\\ea8c';
	}
	:host([icon='symbol-constructor']):before {
		content: '\\ea8c';
	}
	:host([icon='symbol-boolean']):before {
		content: '\\ea8f';
	}
	:host([icon='symbol-null']):before {
		content: '\\ea8f';
	}
	:host([icon='symbol-numeric']):before {
		content: '\\ea90';
	}
	:host([icon='symbol-number']):before {
		content: '\\ea90';
	}
	:host([icon='symbol-structure']):before {
		content: '\\ea91';
	}
	:host([icon='symbol-struct']):before {
		content: '\\ea91';
	}
	:host([icon='symbol-parameter']):before {
		content: '\\ea92';
	}
	:host([icon='symbol-type-parameter']):before {
		content: '\\ea92';
	}
	:host([icon='symbol-key']):before {
		content: '\\ea93';
	}
	:host([icon='symbol-text']):before {
		content: '\\ea93';
	}
	:host([icon='symbol-reference']):before {
		content: '\\ea94';
	}
	:host([icon='go-to-file']):before {
		content: '\\ea94';
	}
	:host([icon='symbol-enum']):before {
		content: '\\ea95';
	}
	:host([icon='symbol-value']):before {
		content: '\\ea95';
	}
	:host([icon='symbol-ruler']):before {
		content: '\\ea96';
	}
	:host([icon='symbol-unit']):before {
		content: '\\ea96';
	}
	:host([icon='activate-breakpoints']):before {
		content: '\\ea97';
	}
	:host([icon='archive']):before {
		content: '\\ea98';
	}
	:host([icon='arrow-both']):before {
		content: '\\ea99';
	}
	:host([icon='arrow-down']):before {
		content: '\\ea9a';
	}
	:host([icon='arrow-left']):before {
		content: '\\ea9b';
	}
	:host([icon='arrow-right']):before {
		content: '\\ea9c';
	}
	:host([icon='arrow-small-down']):before {
		content: '\\ea9d';
	}
	:host([icon='arrow-small-left']):before {
		content: '\\ea9e';
	}
	:host([icon='arrow-small-right']):before {
		content: '\\ea9f';
	}
	:host([icon='arrow-small-up']):before {
		content: '\\eaa0';
	}
	:host([icon='arrow-up']):before {
		content: '\\eaa1';
	}
	:host([icon='bell']):before {
		content: '\\eaa2';
	}
	:host([icon='bold']):before {
		content: '\\eaa3';
	}
	:host([icon='book']):before {
		content: '\\eaa4';
	}
	:host([icon='bookmark']):before {
		content: '\\eaa5';
	}
	:host([icon='debug-breakpoint-conditional-unverified']):before {
		content: '\\eaa6';
	}
	:host([icon='debug-breakpoint-conditional']):before {
		content: '\\eaa7';
	}
	:host([icon='debug-breakpoint-conditional-disabled']):before {
		content: '\\eaa7';
	}
	:host([icon='debug-breakpoint-data-unverified']):before {
		content: '\\eaa8';
	}
	:host([icon='debug-breakpoint-data']):before {
		content: '\\eaa9';
	}
	:host([icon='debug-breakpoint-data-disabled']):before {
		content: '\\eaa9';
	}
	:host([icon='debug-breakpoint-log-unverified']):before {
		content: '\\eaaa';
	}
	:host([icon='debug-breakpoint-log']):before {
		content: '\\eaab';
	}
	:host([icon='debug-breakpoint-log-disabled']):before {
		content: '\\eaab';
	}
	:host([icon='briefcase']):before {
		content: '\\eaac';
	}
	:host([icon='broadcast']):before {
		content: '\\eaad';
	}
	:host([icon='browser']):before {
		content: '\\eaae';
	}
	:host([icon='bug']):before {
		content: '\\eaaf';
	}
	:host([icon='calendar']):before {
		content: '\\eab0';
	}
	:host([icon='case-sensitive']):before {
		content: '\\eab1';
	}
	:host([icon='check']):before {
		content: '\\eab2';
	}
	:host([icon='checklist']):before {
		content: '\\eab3';
	}
	:host([icon='chevron-down']):before {
		content: '\\eab4';
	}
	:host([icon='chevron-left']):before {
		content: '\\eab5';
	}
	:host([icon='chevron-right']):before {
		content: '\\eab6';
	}
	:host([icon='chevron-up']):before {
		content: '\\eab7';
	}
	:host([icon='chrome-close']):before {
		content: '\\eab8';
	}
	:host([icon='chrome-maximize']):before {
		content: '\\eab9';
	}
	:host([icon='chrome-minimize']):before {
		content: '\\eaba';
	}
	:host([icon='chrome-restore']):before {
		content: '\\eabb';
	}
	:host([icon='circle-outline']):before {
		content: '\\eabc';
	}
	:host([icon='debug-breakpoint-unverified']):before {
		content: '\\eabc';
	}
	:host([icon='circle-slash']):before {
		content: '\\eabd';
	}
	:host([icon='circuit-board']):before {
		content: '\\eabe';
	}
	:host([icon='clear-all']):before {
		content: '\\eabf';
	}
	:host([icon='clippy']):before {
		content: '\\eac0';
	}
	:host([icon='close-all']):before {
		content: '\\eac1';
	}
	:host([icon='cloud-download']):before {
		content: '\\eac2';
	}
	:host([icon='cloud-upload']):before {
		content: '\\eac3';
	}
	:host([icon='code']):before {
		content: '\\eac4';
	}
	:host([icon='collapse-all']):before {
		content: '\\eac5';
	}
	:host([icon='color-mode']):before {
		content: '\\eac6';
	}
	:host([icon='comment-discussion']):before {
		content: '\\eac7';
	}
	:host([icon='credit-card']):before {
		content: '\\eac9';
	}
	:host([icon='dash']):before {
		content: '\\eacc';
	}
	:host([icon='dashboard']):before {
		content: '\\eacd';
	}
	:host([icon='database']):before {
		content: '\\eace';
	}
	:host([icon='debug-continue']):before {
		content: '\\eacf';
	}
	:host([icon='debug-disconnect']):before {
		content: '\\ead0';
	}
	:host([icon='debug-pause']):before {
		content: '\\ead1';
	}
	:host([icon='debug-restart']):before {
		content: '\\ead2';
	}
	:host([icon='debug-start']):before {
		content: '\\ead3';
	}
	:host([icon='debug-step-into']):before {
		content: '\\ead4';
	}
	:host([icon='debug-step-out']):before {
		content: '\\ead5';
	}
	:host([icon='debug-step-over']):before {
		content: '\\ead6';
	}
	:host([icon='debug-stop']):before {
		content: '\\ead7';
	}
	:host([icon='debug']):before {
		content: '\\ead8';
	}
	:host([icon='device-camera-video']):before {
		content: '\\ead9';
	}
	:host([icon='device-camera']):before {
		content: '\\eada';
	}
	:host([icon='device-mobile']):before {
		content: '\\eadb';
	}
	:host([icon='diff-added']):before {
		content: '\\eadc';
	}
	:host([icon='diff-ignored']):before {
		content: '\\eadd';
	}
	:host([icon='diff-modified']):before {
		content: '\\eade';
	}
	:host([icon='diff-removed']):before {
		content: '\\eadf';
	}
	:host([icon='diff-renamed']):before {
		content: '\\eae0';
	}
	:host([icon='diff']):before {
		content: '\\eae1';
	}
	:host([icon='discard']):before {
		content: '\\eae2';
	}
	:host([icon='editor-layout']):before {
		content: '\\eae3';
	}
	:host([icon='empty-window']):before {
		content: '\\eae4';
	}
	:host([icon='exclude']):before {
		content: '\\eae5';
	}
	:host([icon='extensions']):before {
		content: '\\eae6';
	}
	:host([icon='eye-closed']):before {
		content: '\\eae7';
	}
	:host([icon='file-binary']):before {
		content: '\\eae8';
	}
	:host([icon='file-code']):before {
		content: '\\eae9';
	}
	:host([icon='file-media']):before {
		content: '\\eaea';
	}
	:host([icon='file-pdf']):before {
		content: '\\eaeb';
	}
	:host([icon='file-submodule']):before {
		content: '\\eaec';
	}
	:host([icon='file-symlink-directory']):before {
		content: '\\eaed';
	}
	:host([icon='file-symlink-file']):before {
		content: '\\eaee';
	}
	:host([icon='file-zip']):before {
		content: '\\eaef';
	}
	:host([icon='files']):before {
		content: '\\eaf0';
	}
	:host([icon='filter']):before {
		content: '\\eaf1';
	}
	:host([icon='flame']):before {
		content: '\\eaf2';
	}
	:host([icon='fold-down']):before {
		content: '\\eaf3';
	}
	:host([icon='fold-up']):before {
		content: '\\eaf4';
	}
	:host([icon='fold']):before {
		content: '\\eaf5';
	}
	:host([icon='folder-active']):before {
		content: '\\eaf6';
	}
	:host([icon='folder-opened']):before {
		content: '\\eaf7';
	}
	:host([icon='gear']):before {
		content: '\\eaf8';
	}
	:host([icon='gift']):before {
		content: '\\eaf9';
	}
	:host([icon='gist-secret']):before {
		content: '\\eafa';
	}
	:host([icon='gist']):before {
		content: '\\eafb';
	}
	:host([icon='git-commit']):before {
		content: '\\eafc';
	}
	:host([icon='git-compare']):before {
		content: '\\eafd';
	}
	:host([icon='compare-changes']):before {
		content: '\\eafd';
	}
	:host([icon='git-merge']):before {
		content: '\\eafe';
	}
	:host([icon='github-action']):before {
		content: '\\eaff';
	}
	:host([icon='github-alt']):before {
		content: '\\eb00';
	}
	:host([icon='globe']):before {
		content: '\\eb01';
	}
	:host([icon='grabber']):before {
		content: '\\eb02';
	}
	:host([icon='graph']):before {
		content: '\\eb03';
	}
	:host([icon='gripper']):before {
		content: '\\eb04';
	}
	:host([icon='heart']):before {
		content: '\\eb05';
	}
	:host([icon='home']):before {
		content: '\\eb06';
	}
	:host([icon='horizontal-rule']):before {
		content: '\\eb07';
	}
	:host([icon='hubot']):before {
		content: '\\eb08';
	}
	:host([icon='inbox']):before {
		content: '\\eb09';
	}
	:host([icon='issue-reopened']):before {
		content: '\\eb0b';
	}
	:host([icon='issues']):before {
		content: '\\eb0c';
	}
	:host([icon='italic']):before {
		content: '\\eb0d';
	}
	:host([icon='jersey']):before {
		content: '\\eb0e';
	}
	:host([icon='json']):before {
		content: '\\eb0f';
	}
	:host([icon='kebab-vertical']):before {
		content: '\\eb10';
	}
	:host([icon='key']):before {
		content: '\\eb11';
	}
	:host([icon='law']):before {
		content: '\\eb12';
	}
	:host([icon='lightbulb-autofix']):before {
		content: '\\eb13';
	}
	:host([icon='link-external']):before {
		content: '\\eb14';
	}
	:host([icon='link']):before {
		content: '\\eb15';
	}
	:host([icon='list-ordered']):before {
		content: '\\eb16';
	}
	:host([icon='list-unordered']):before {
		content: '\\eb17';
	}
	:host([icon='live-share']):before {
		content: '\\eb18';
	}
	:host([icon='loading']):before {
		content: '\\eb19';
	}
	:host([icon='location']):before {
		content: '\\eb1a';
	}
	:host([icon='mail-read']):before {
		content: '\\eb1b';
	}
	:host([icon='mail']):before {
		content: '\\eb1c';
	}
	:host([icon='markdown']):before {
		content: '\\eb1d';
	}
	:host([icon='megaphone']):before {
		content: '\\eb1e';
	}
	:host([icon='mention']):before {
		content: '\\eb1f';
	}
	:host([icon='milestone']):before {
		content: '\\eb20';
	}
	:host([icon='mortar-board']):before {
		content: '\\eb21';
	}
	:host([icon='move']):before {
		content: '\\eb22';
	}
	:host([icon='multiple-windows']):before {
		content: '\\eb23';
	}
	:host([icon='mute']):before {
		content: '\\eb24';
	}
	:host([icon='no-newline']):before {
		content: '\\eb25';
	}
	:host([icon='note']):before {
		content: '\\eb26';
	}
	:host([icon='octoface']):before {
		content: '\\eb27';
	}
	:host([icon='open-preview']):before {
		content: '\\eb28';
	}
	:host([icon='package']):before {
		content: '\\eb29';
	}
	:host([icon='paintcan']):before {
		content: '\\eb2a';
	}
	:host([icon='pin']):before {
		content: '\\eb2b';
	}
	:host([icon='play']):before {
		content: '\\eb2c';
	}
	:host([icon='run']):before {
		content: '\\eb2c';
	}
	:host([icon='plug']):before {
		content: '\\eb2d';
	}
	:host([icon='preserve-case']):before {
		content: '\\eb2e';
	}
	:host([icon='preview']):before {
		content: '\\eb2f';
	}
	:host([icon='project']):before {
		content: '\\eb30';
	}
	:host([icon='pulse']):before {
		content: '\\eb31';
	}
	:host([icon='question']):before {
		content: '\\eb32';
	}
	:host([icon='quote']):before {
		content: '\\eb33';
	}
	:host([icon='radio-tower']):before {
		content: '\\eb34';
	}
	:host([icon='reactions']):before {
		content: '\\eb35';
	}
	:host([icon='references']):before {
		content: '\\eb36';
	}
	:host([icon='refresh']):before {
		content: '\\eb37';
	}
	:host([icon='regex']):before {
		content: '\\eb38';
	}
	:host([icon='remote-explorer']):before {
		content: '\\eb39';
	}
	:host([icon='remote']):before {
		content: '\\eb3a';
	}
	:host([icon='remove']):before {
		content: '\\eb3b';
	}
	:host([icon='replace-all']):before {
		content: '\\eb3c';
	}
	:host([icon='replace']):before {
		content: '\\eb3d';
	}
	:host([icon='repo-clone']):before {
		content: '\\eb3e';
	}
	:host([icon='repo-force-push']):before {
		content: '\\eb3f';
	}
	:host([icon='repo-pull']):before {
		content: '\\eb40';
	}
	:host([icon='repo-push']):before {
		content: '\\eb41';
	}
	:host([icon='report']):before {
		content: '\\eb42';
	}
	:host([icon='request-changes']):before {
		content: '\\eb43';
	}
	:host([icon='rocket']):before {
		content: '\\eb44';
	}
	:host([icon='root-folder-opened']):before {
		content: '\\eb45';
	}
	:host([icon='root-folder']):before {
		content: '\\eb46';
	}
	:host([icon='rss']):before {
		content: '\\eb47';
	}
	:host([icon='ruby']):before {
		content: '\\eb48';
	}
	:host([icon='save-all']):before {
		content: '\\eb49';
	}
	:host([icon='save-as']):before {
		content: '\\eb4a';
	}
	:host([icon='save']):before {
		content: '\\eb4b';
	}
	:host([icon='screen-full']):before {
		content: '\\eb4c';
	}
	:host([icon='screen-normal']):before {
		content: '\\eb4d';
	}
	:host([icon='search-stop']):before {
		content: '\\eb4e';
	}
	:host([icon='server']):before {
		content: '\\eb50';
	}
	:host([icon='settings-gear']):before {
		content: '\\eb51';
	}
	:host([icon='settings']):before {
		content: '\\eb52';
	}
	:host([icon='shield']):before {
		content: '\\eb53';
	}
	:host([icon='smiley']):before {
		content: '\\eb54';
	}
	:host([icon='sort-precedence']):before {
		content: '\\eb55';
	}
	:host([icon='split-horizontal']):before {
		content: '\\eb56';
	}
	:host([icon='split-vertical']):before {
		content: '\\eb57';
	}
	:host([icon='squirrel']):before {
		content: '\\eb58';
	}
	:host([icon='star-full']):before {
		content: '\\eb59';
	}
	:host([icon='star-half']):before {
		content: '\\eb5a';
	}
	:host([icon='symbol-class']):before {
		content: '\\eb5b';
	}
	:host([icon='symbol-color']):before {
		content: '\\eb5c';
	}
	:host([icon='symbol-constant']):before {
		content: '\\eb5d';
	}
	:host([icon='symbol-enum-member']):before {
		content: '\\eb5e';
	}
	:host([icon='symbol-field']):before {
		content: '\\eb5f';
	}
	:host([icon='symbol-file']):before {
		content: '\\eb60';
	}
	:host([icon='symbol-interface']):before {
		content: '\\eb61';
	}
	:host([icon='symbol-keyword']):before {
		content: '\\eb62';
	}
	:host([icon='symbol-misc']):before {
		content: '\\eb63';
	}
	:host([icon='symbol-operator']):before {
		content: '\\eb64';
	}
	:host([icon='symbol-property']):before {
		content: '\\eb65';
	}
	:host([icon='wrench']):before {
		content: '\\eb65';
	}
	:host([icon='wrench-subaction']):before {
		content: '\\eb65';
	}
	:host([icon='symbol-snippet']):before {
		content: '\\eb66';
	}
	:host([icon='tasklist']):before {
		content: '\\eb67';
	}
	:host([icon='telescope']):before {
		content: '\\eb68';
	}
	:host([icon='text-size']):before {
		content: '\\eb69';
	}
	:host([icon='three-bars']):before {
		content: '\\eb6a';
	}
	:host([icon='thumbsdown']):before {
		content: '\\eb6b';
	}
	:host([icon='thumbsup']):before {
		content: '\\eb6c';
	}
	:host([icon='tools']):before {
		content: '\\eb6d';
	}
	:host([icon='triangle-down']):before {
		content: '\\eb6e';
	}
	:host([icon='triangle-left']):before {
		content: '\\eb6f';
	}
	:host([icon='triangle-right']):before {
		content: '\\eb70';
	}
	:host([icon='triangle-up']):before {
		content: '\\eb71';
	}
	:host([icon='twitter']):before {
		content: '\\eb72';
	}
	:host([icon='unfold']):before {
		content: '\\eb73';
	}
	:host([icon='unlock']):before {
		content: '\\eb74';
	}
	:host([icon='unmute']):before {
		content: '\\eb75';
	}
	:host([icon='unverified']):before {
		content: '\\eb76';
	}
	:host([icon='verified']):before {
		content: '\\eb77';
	}
	:host([icon='versions']):before {
		content: '\\eb78';
	}
	:host([icon='vm-active']):before {
		content: '\\eb79';
	}
	:host([icon='vm-outline']):before {
		content: '\\eb7a';
	}
	:host([icon='vm-running']):before {
		content: '\\eb7b';
	}
	:host([icon='watch']):before {
		content: '\\eb7c';
	}
	:host([icon='whitespace']):before {
		content: '\\eb7d';
	}
	:host([icon='whole-word']):before {
		content: '\\eb7e';
	}
	:host([icon='window']):before {
		content: '\\eb7f';
	}
	:host([icon='word-wrap']):before {
		content: '\\eb80';
	}
	:host([icon='zoom-in']):before {
		content: '\\eb81';
	}
	:host([icon='zoom-out']):before {
		content: '\\eb82';
	}
	:host([icon='list-filter']):before {
		content: '\\eb83';
	}
	:host([icon='list-flat']):before {
		content: '\\eb84';
	}
	:host([icon='list-selection']):before {
		content: '\\eb85';
	}
	:host([icon='selection']):before {
		content: '\\eb85';
	}
	:host([icon='list-tree']):before {
		content: '\\eb86';
	}
	:host([icon='debug-breakpoint-function-unverified']):before {
		content: '\\eb87';
	}
	:host([icon='debug-breakpoint-function']):before {
		content: '\\eb88';
	}
	:host([icon='debug-breakpoint-function-disabled']):before {
		content: '\\eb88';
	}
	:host([icon='debug-stackframe-active']):before {
		content: '\\eb89';
	}
	:host([icon='debug-stackframe-dot']):before {
		content: '\\eb8a';
	}
	:host([icon='debug-stackframe']):before {
		content: '\\eb8b';
	}
	:host([icon='debug-stackframe-focused']):before {
		content: '\\eb8b';
	}
	:host([icon='debug-breakpoint-unsupported']):before {
		content: '\\eb8c';
	}
	:host([icon='symbol-string']):before {
		content: '\\eb8d';
	}
	:host([icon='debug-reverse-continue']):before {
		content: '\\eb8e';
	}
	:host([icon='debug-step-back']):before {
		content: '\\eb8f';
	}
	:host([icon='debug-restart-frame']):before {
		content: '\\eb90';
	}
	:host([icon='debug-alt']):before {
		content: '\\eb91';
	}
	:host([icon='call-incoming']):before {
		content: '\\eb92';
	}
	:host([icon='call-outgoing']):before {
		content: '\\eb93';
	}
	:host([icon='menu']):before {
		content: '\\eb94';
	}
	:host([icon='expand-all']):before {
		content: '\\eb95';
	}
	:host([icon='feedback']):before {
		content: '\\eb96';
	}
	:host([icon='group-by-ref-type']):before {
		content: '\\eb97';
	}
	:host([icon='ungroup-by-ref-type']):before {
		content: '\\eb98';
	}
	:host([icon='account']):before {
		content: '\\eb99';
	}
	:host([icon='bell-dot']):before {
		content: '\\eb9a';
	}
	:host([icon='debug-console']):before {
		content: '\\eb9b';
	}
	:host([icon='library']):before {
		content: '\\eb9c';
	}
	:host([icon='output']):before {
		content: '\\eb9d';
	}
	:host([icon='run-all']):before {
		content: '\\eb9e';
	}
	:host([icon='sync-ignored']):before {
		content: '\\eb9f';
	}
	:host([icon='pinned']):before {
		content: '\\eba0';
	}
	:host([icon='github-inverted']):before {
		content: '\\eba1';
	}
	:host([icon='server-process']):before {
		content: '\\eba2';
	}
	:host([icon='server-environment']):before {
		content: '\\eba3';
	}
	:host([icon='pass']):before {
		content: '\\eba4';
	}
	:host([icon='issue-closed']):before {
		content: '\\eba4';
	}
	:host([icon='stop-circle']):before {
		content: '\\eba5';
	}
	:host([icon='play-circle']):before {
		content: '\\eba6';
	}
	:host([icon='record']):before {
		content: '\\eba7';
	}
	:host([icon='debug-alt-small']):before {
		content: '\\eba8';
	}
	:host([icon='vm-connect']):before {
		content: '\\eba9';
	}
	:host([icon='cloud']):before {
		content: '\\ebaa';
	}
	:host([icon='merge']):before {
		content: '\\ebab';
	}
	:host([icon='export']):before {
		content: '\\ebac';
	}
	:host([icon='graph-left']):before {
		content: '\\ebad';
	}
	:host([icon='magnet']):before {
		content: '\\ebae';
	}
	:host([icon='notebook']):before {
		content: '\\ebaf';
	}
	:host([icon='redo']):before {
		content: '\\ebb0';
	}
	:host([icon='check-all']):before {
		content: '\\ebb1';
	}
	:host([icon='pinned-dirty']):before {
		content: '\\ebb2';
	}
	:host([icon='pass-filled']):before {
		content: '\\ebb3';
	}
	:host([icon='circle-large-filled']):before {
		content: '\\ebb4';
	}
	:host([icon='circle-large-outline']):before {
		content: '\\ebb5';
	}
	:host([icon='combine']):before {
		content: '\\ebb6';
	}
	:host([icon='gather']):before {
		content: '\\ebb6';
	}
	:host([icon='table']):before {
		content: '\\ebb7';
	}
	:host([icon='variable-group']):before {
		content: '\\ebb8';
	}
	:host([icon='type-hierarchy']):before {
		content: '\\ebb9';
	}
	:host([icon='type-hierarchy-sub']):before {
		content: '\\ebba';
	}
	:host([icon='type-hierarchy-super']):before {
		content: '\\ebbb';
	}
	:host([icon='git-pull-request-create']):before {
		content: '\\ebbc';
	}
	:host([icon='run-above']):before {
		content: '\\ebbd';
	}
	:host([icon='run-below']):before {
		content: '\\ebbe';
	}
	:host([icon='notebook-template']):before {
		content: '\\ebbf';
	}
	:host([icon='debug-rerun']):before {
		content: '\\ebc0';
	}
	:host([icon='workspace-trusted']):before {
		content: '\\ebc1';
	}
	:host([icon='workspace-untrusted']):before {
		content: '\\ebc2';
	}
	:host([icon='workspace-unknown']):before {
		content: '\\ebc3';
	}
	:host([icon='terminal-cmd']):before {
		content: '\\ebc4';
	}
	:host([icon='terminal-debian']):before {
		content: '\\ebc5';
	}
	:host([icon='terminal-linux']):before {
		content: '\\ebc6';
	}
	:host([icon='terminal-powershell']):before {
		content: '\\ebc7';
	}
	:host([icon='terminal-tmux']):before {
		content: '\\ebc8';
	}
	:host([icon='terminal-ubuntu']):before {
		content: '\\ebc9';
	}
	:host([icon='terminal-bash']):before {
		content: '\\ebca';
	}
	:host([icon='arrow-swap']):before {
		content: '\\ebcb';
	}
	:host([icon='copy']):before {
		content: '\\ebcc';
	}
	:host([icon='person-add']):before {
		content: '\\ebcd';
	}
	:host([icon='filter-filled']):before {
		content: '\\ebce';
	}
	:host([icon='wand']):before {
		content: '\\ebcf';
	}
	:host([icon='debug-line-by-line']):before {
		content: '\\ebd0';
	}
	:host([icon='inspect']):before {
		content: '\\ebd1';
	}
	:host([icon='layers']):before {
		content: '\\ebd2';
	}
	:host([icon='layers-dot']):before {
		content: '\\ebd3';
	}
	:host([icon='layers-active']):before {
		content: '\\ebd4';
	}
	:host([icon='compass']):before {
		content: '\\ebd5';
	}
	:host([icon='compass-dot']):before {
		content: '\\ebd6';
	}
	:host([icon='compass-active']):before {
		content: '\\ebd7';
	}
	:host([icon='azure']):before {
		content: '\\ebd8';
	}
	:host([icon='issue-draft']):before {
		content: '\\ebd9';
	}
	:host([icon='git-pull-request-closed']):before {
		content: '\\ebda';
	}
	:host([icon='git-pull-request-draft']):before {
		content: '\\ebdb';
	}
	:host([icon='debug-all']):before {
		content: '\\ebdc';
	}
	:host([icon='debug-coverage']):before {
		content: '\\ebdd';
	}
	:host([icon='run-errors']):before {
		content: '\\ebde';
	}
	:host([icon='folder-library']):before {
		content: '\\ebdf';
	}
	:host([icon='debug-continue-small']):before {
		content: '\\ebe0';
	}
	:host([icon='beaker-stop']):before {
		content: '\\ebe1';
	}
	:host([icon='graph-line']):before {
		content: '\\ebe2';
	}
	:host([icon='graph-scatter']):before {
		content: '\\ebe3';
	}
	:host([icon='pie-chart']):before {
		content: '\\ebe4';
	}
	:host([icon='bracket']):before {
		content: '\\eb0f';
	}
	:host([icon='bracket-dot']):before {
		content: '\\ebe5';
	}
	:host([icon='bracket-error']):before {
		content: '\\ebe6';
	}
	:host([icon='lock-small']):before {
		content: '\\ebe7';
	}
	:host([icon='azure-devops']):before {
		content: '\\ebe8';
	}
	:host([icon='verified-filled']):before {
		content: '\\ebe9';
	}
	:host([icon='newline']):before {
		content: '\\ebea';
	}
	:host([icon='layout']):before {
		content: '\\ebeb';
	}
	:host([icon='layout-activitybar-left']):before {
		content: '\\ebec';
	}
	:host([icon='layout-activitybar-right']):before {
		content: '\\ebed';
	}
	:host([icon='layout-panel-left']):before {
		content: '\\ebee';
	}
	:host([icon='layout-panel-center']):before {
		content: '\\ebef';
	}
	:host([icon='layout-panel-justify']):before {
		content: '\\ebf0';
	}
	:host([icon='layout-panel-right']):before {
		content: '\\ebf1';
	}
	:host([icon='layout-panel']):before {
		content: '\\ebf2';
	}
	:host([icon='layout-sidebar-left']):before {
		content: '\\ebf3';
	}
	:host([icon='layout-sidebar-right']):before {
		content: '\\ebf4';
	}
	:host([icon='layout-statusbar']):before {
		content: '\\ebf5';
	}
	:host([icon='layout-menubar']):before {
		content: '\\ebf6';
	}
	:host([icon='layout-centered']):before {
		content: '\\ebf7';
	}
	:host([icon='target']):before {
		content: '\\ebf8';
	}
	:host([icon='gl-pinned-filled']):before {
		font-family: 'glicons';
		content: '\\f11c';
		/* TODO: see relative positioning needed in every use-case */
		position: relative;
		left: 1px;
	}
	:host([icon='gl-graph']):before {
		font-family: 'glicons';
		content: '\\f102';
	}
	:host([icon='gl-list-auto']):before {
		font-family: 'glicons';
		content: '\\f11a';
	}

	@keyframes codicon-spin {
		100% {
			transform: rotate(360deg);
		}
	}

	:host([modifier='spin']) {
		/* Use steps to throttle FPS to reduce CPU usage */
		animation: codicon-spin 1.5s steps(30) infinite;
	}
	:host([icon='loading'][modifier='spin']) {
		/* Use steps to throttle FPS to reduce CPU usage */
		animation: codicon-spin 1.5s steps(30) infinite;

		/* custom speed & easing for loading icon */
		animation-duration: 1s !important;
		animation-timing-function: cubic-bezier(0.53, 0.21, 0.29, 0.67) !important;
	}
`;let xe=class extends Y{constructor(){super(...arguments),this.icon="",this.modifier="",this.size=16}sizeChanged(){this.style.setProperty("--code-icon-size",`${this.size}px`)}};Ve([g],xe.prototype,"icon",2),Ve([g],xe.prototype,"modifier",2),Ve([g],xe.prototype,"size",2),xe=Ve([K({name:"code-icon",styles:Ji})],xe);class qe{constructor(){this.targetIndex=0}}class po extends qe{constructor(){super(...arguments),this.createPlaceholder=_.createInterpolationPlaceholder}}class mo extends qe{constructor(n,i,r){super(),this.name=n,this.behavior=i,this.options=r}createPlaceholder(n){return _.createCustomAttributePlaceholder(this.name,n)}createBehavior(n){return new this.behavior(n,this.options)}}function es(s,n){this.source=s,this.context=n,this.bindingObserver===null&&(this.bindingObserver=k.binding(this.binding,this,this.isBindingVolatile)),this.updateTarget(this.bindingObserver.observe(s,n))}function ts(s,n){this.source=s,this.context=n,this.target.addEventListener(this.targetName,this)}function os(){this.bindingObserver.disconnect(),this.source=null,this.context=null}function ns(){this.bindingObserver.disconnect(),this.source=null,this.context=null;const s=this.target.$fastView;s!==void 0&&s.isComposed&&(s.unbind(),s.needsBindOnly=!0)}function is(){this.target.removeEventListener(this.targetName,this),this.source=null,this.context=null}function ss(s){_.setAttribute(this.target,this.targetName,s)}function rs(s){_.setBooleanAttribute(this.target,this.targetName,s)}function as(s){if(s==null&&(s=""),s.create){this.target.textContent="";let n=this.target.$fastView;n===void 0?n=s.create():this.target.$fastTemplate!==s&&(n.isComposed&&(n.remove(),n.unbind()),n=s.create()),n.isComposed?n.needsBindOnly&&(n.needsBindOnly=!1,n.bind(this.source,this.context)):(n.isComposed=!0,n.bind(this.source,this.context),n.insertBefore(this.target),this.target.$fastView=n,this.target.$fastTemplate=s)}else{const n=this.target.$fastView;n!==void 0&&n.isComposed&&(n.isComposed=!1,n.remove(),n.needsBindOnly?n.needsBindOnly=!1:n.unbind()),this.target.textContent=s}}function cs(s){this.target[this.targetName]=s}function ls(s){const n=this.classVersions||Object.create(null),i=this.target;let r=this.version||0;if(s!=null&&s.length){const a=s.split(/\s+/);for(let c=0,l=a.length;c<l;++c){const d=a[c];d!==""&&(n[d]=r,i.classList.add(d))}}if(this.classVersions=n,this.version=r+1,r!==0){r-=1;for(const a in n)n[a]===r&&i.classList.remove(a)}}class bt extends po{constructor(n){super(),this.binding=n,this.bind=es,this.unbind=os,this.updateTarget=ss,this.isBindingVolatile=k.isVolatileBinding(this.binding)}get targetName(){return this.originalTargetName}set targetName(n){if(this.originalTargetName=n,n!==void 0)switch(n[0]){case":":if(this.cleanedTargetName=n.substr(1),this.updateTarget=cs,this.cleanedTargetName==="innerHTML"){const i=this.binding;this.binding=(r,a)=>_.createHTML(i(r,a))}break;case"?":this.cleanedTargetName=n.substr(1),this.updateTarget=rs;break;case"@":this.cleanedTargetName=n.substr(1),this.bind=ts,this.unbind=is;break;default:this.cleanedTargetName=n,n==="class"&&(this.updateTarget=ls);break}}targetAtContent(){this.updateTarget=as,this.unbind=ns}createBehavior(n){return new hs(n,this.binding,this.isBindingVolatile,this.bind,this.unbind,this.updateTarget,this.cleanedTargetName)}}class hs{constructor(n,i,r,a,c,l,d){this.source=null,this.context=null,this.bindingObserver=null,this.target=n,this.binding=i,this.isBindingVolatile=r,this.bind=a,this.unbind=c,this.updateTarget=l,this.targetName=d}handleChange(){this.updateTarget(this.bindingObserver.observe(this.source,this.context))}handleEvent(n){$e.setEvent(n);const i=this.binding(this.source,this.context);$e.setEvent(null),i!==!0&&n.preventDefault()}}let pt=null;class mt{addFactory(n){n.targetIndex=this.targetIndex,this.behaviorFactories.push(n)}captureContentBinding(n){n.targetAtContent(),this.addFactory(n)}reset(){this.behaviorFactories=[],this.targetIndex=-1}release(){pt=this}static borrow(n){const i=pt||new mt;return i.directives=n,i.reset(),pt=null,i}}function ds(s){if(s.length===1)return s[0];let n;const i=s.length,r=s.map(l=>typeof l=="string"?()=>l:(n=l.targetName||n,l.binding)),a=(l,d)=>{let h="";for(let u=0;u<i;++u)h+=r[u](l,d);return h},c=new bt(a);return c.targetName=n,c}const us=lt.length;function go(s,n){const i=n.split(no);if(i.length===1)return null;const r=[];for(let a=0,c=i.length;a<c;++a){const l=i[a],d=l.indexOf(lt);let h;if(d===-1)h=l;else{const u=parseInt(l.substring(0,d));r.push(s.directives[u]),h=l.substring(d+us)}h!==""&&r.push(h)}return r}function vo(s,n,i=!1){const r=n.attributes;for(let a=0,c=r.length;a<c;++a){const l=r[a],d=l.value,h=go(s,d);let u=null;h===null?i&&(u=new bt(()=>d),u.targetName=l.name):u=ds(h),u!==null&&(n.removeAttributeNode(l),a--,c--,s.addFactory(u))}}function fs(s,n,i){const r=go(s,n.textContent);if(r!==null){let a=n;for(let c=0,l=r.length;c<l;++c){const d=r[c],h=c===0?n:a.parentNode.insertBefore(document.createTextNode(""),a.nextSibling);typeof d=="string"?h.textContent=d:(h.textContent=" ",s.captureContentBinding(d)),a=h,s.targetIndex++,h!==n&&i.nextNode()}s.targetIndex--}}function bs(s,n){const i=s.content;document.adoptNode(i);const r=mt.borrow(n);vo(r,s,!0);const a=r.behaviorFactories;r.reset();const c=_.createTemplateWalker(i);let l;for(;l=c.nextNode();)switch(r.targetIndex++,l.nodeType){case 1:vo(r,l);break;case 3:fs(r,l,c);break;case 8:_.isMarker(l)&&r.addFactory(n[_.extractDirectiveIndexFromMarker(l)])}let d=0;(_.isMarker(i.firstChild)||i.childNodes.length===1&&n.length)&&(i.insertBefore(document.createComment(""),i.firstChild),d=-1);const h=r.behaviorFactories;return r.release(),{fragment:i,viewBehaviorFactories:h,hostBehaviorFactories:a,targetOffset:d}}const gt=document.createRange();class yo{constructor(n,i){this.fragment=n,this.behaviors=i,this.source=null,this.context=null,this.firstChild=n.firstChild,this.lastChild=n.lastChild}appendTo(n){n.appendChild(this.fragment)}insertBefore(n){if(this.fragment.hasChildNodes())n.parentNode.insertBefore(this.fragment,n);else{const i=this.lastChild;if(n.previousSibling===i)return;const r=n.parentNode;let a=this.firstChild,c;for(;a!==i;)c=a.nextSibling,r.insertBefore(a,n),a=c;r.insertBefore(i,n)}}remove(){const n=this.fragment,i=this.lastChild;let r=this.firstChild,a;for(;r!==i;)a=r.nextSibling,n.appendChild(r),r=a;n.appendChild(i)}dispose(){const n=this.firstChild.parentNode,i=this.lastChild;let r=this.firstChild,a;for(;r!==i;)a=r.nextSibling,n.removeChild(r),r=a;n.removeChild(i);const c=this.behaviors,l=this.source;for(let d=0,h=c.length;d<h;++d)c[d].unbind(l)}bind(n,i){const r=this.behaviors;if(this.source!==n)if(this.source!==null){const a=this.source;this.source=n,this.context=i;for(let c=0,l=r.length;c<l;++c){const d=r[c];d.unbind(a),d.bind(n,i)}}else{this.source=n,this.context=i;for(let a=0,c=r.length;a<c;++a)r[a].bind(n,i)}}unbind(){if(this.source===null)return;const n=this.behaviors,i=this.source;for(let r=0,a=n.length;r<a;++r)n[r].unbind(i);this.source=null}static disposeContiguousBatch(n){if(n.length!==0){gt.setStartBefore(n[0].firstChild),gt.setEndAfter(n[n.length-1].lastChild),gt.deleteContents();for(let i=0,r=n.length;i<r;++i){const a=n[i],c=a.behaviors,l=a.source;for(let d=0,h=c.length;d<h;++d)c[d].unbind(l)}}}}class wo{constructor(n,i){this.behaviorCount=0,this.hasHostBehaviors=!1,this.fragment=null,this.targetOffset=0,this.viewBehaviorFactories=null,this.hostBehaviorFactories=null,this.html=n,this.directives=i}create(n){if(this.fragment===null){let u;const f=this.html;if(typeof f=="string"){u=document.createElement("template"),u.innerHTML=_.createHTML(f);const p=u.content.firstElementChild;p!==null&&p.tagName==="TEMPLATE"&&(u=p)}else u=f;const b=bs(u,this.directives);this.fragment=b.fragment,this.viewBehaviorFactories=b.viewBehaviorFactories,this.hostBehaviorFactories=b.hostBehaviorFactories,this.targetOffset=b.targetOffset,this.behaviorCount=this.viewBehaviorFactories.length+this.hostBehaviorFactories.length,this.hasHostBehaviors=this.hostBehaviorFactories.length>0}const i=this.fragment.cloneNode(!0),r=this.viewBehaviorFactories,a=new Array(this.behaviorCount),c=_.createTemplateWalker(i);let l=0,d=this.targetOffset,h=c.nextNode();for(let u=r.length;l<u;++l){const f=r[l],b=f.targetIndex;for(;h!==null;)if(d===b){a[l]=f.createBehavior(h);break}else h=c.nextNode(),d++}if(this.hasHostBehaviors){const u=this.hostBehaviorFactories;for(let f=0,b=u.length;f<b;++f,++l)a[l]=u[f].createBehavior(n)}return new yo(i,a)}render(n,i,r){typeof i=="string"&&(i=document.getElementById(i)),r===void 0&&(r=i);const a=this.create(r);return a.bind(n,je),a.appendTo(i),a}}const ps=/([ \x09\x0a\x0c\x0d])([^\0-\x1F\x7F-\x9F "'>=/]+)([ \x09\x0a\x0c\x0d]*=[ \x09\x0a\x0c\x0d]*(?:[^ \x09\x0a\x0c\x0d"'`<>=]*|"[^"]*|'[^']*))$/;function O(s,...n){const i=[];let r="";for(let a=0,c=s.length-1;a<c;++a){const l=s[a];let d=n[a];if(r+=l,d instanceof wo){const h=d;d=()=>h}if(typeof d=="function"&&(d=new bt(d)),d instanceof po){const h=ps.exec(l);h!==null&&(d.targetName=h[2])}d instanceof qe?(r+=d.createPlaceholder(i.length),i.push(d)):r+=d}return r+=s[s.length-1],new wo(r,i)}function re(s,n){const i=typeof n=="function"?n:()=>n;return(r,a)=>s(r,a)?i(r,a):null}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ze=window,vt=ze.ShadowRoot&&(ze.ShadyCSS===void 0||ze.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,yt=Symbol(),_o=new WeakMap;class $o{constructor(n,i,r){if(this._$cssResult$=!0,r!==yt)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=n,this.t=i}get styleSheet(){let n=this.o;const i=this.t;if(vt&&n===void 0){const r=i!==void 0&&i.length===1;r&&(n=_o.get(i)),n===void 0&&((this.o=n=new CSSStyleSheet).replaceSync(this.cssText),r&&_o.set(i,n))}return n}toString(){return this.cssText}}const ms=s=>new $o(typeof s=="string"?s:s+"",void 0,yt),We=(s,...n)=>{const i=s.length===1?s[0]:n.reduce((r,a,c)=>r+(l=>{if(l._$cssResult$===!0)return l.cssText;if(typeof l=="number")return l;throw Error("Value passed to 'css' function must be a 'css' function result: "+l+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+s[c+1],s[0]);return new $o(i,s,yt)},gs=(s,n)=>{vt?s.adoptedStyleSheets=n.map(i=>i instanceof CSSStyleSheet?i:i.styleSheet):n.forEach(i=>{const r=document.createElement("style"),a=ze.litNonce;a!==void 0&&r.setAttribute("nonce",a),r.textContent=i.cssText,s.appendChild(r)})},xo=vt?s=>s:s=>s instanceof CSSStyleSheet?(n=>{let i="";for(const r of n.cssRules)i+=r.cssText;return ms(i)})(s):s;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var wt;const Qe=window,Co=Qe.trustedTypes,vs=Co?Co.emptyScript:"",ko=Qe.reactiveElementPolyfillSupport,_t={toAttribute(s,n){switch(n){case Boolean:s=s?vs:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,n){let i=s;switch(n){case Boolean:i=s!==null;break;case Number:i=s===null?null:Number(s);break;case Object:case Array:try{i=JSON.parse(s)}catch{i=null}}return i}},Ao=(s,n)=>n!==s&&(n==n||s==s),$t={attribute:!0,type:String,converter:_t,reflect:!1,hasChanged:Ao};class ae extends HTMLElement{constructor(){super(),this._$Ei=new Map,this.isUpdatePending=!1,this.hasUpdated=!1,this._$El=null,this.u()}static addInitializer(n){var i;this.finalize(),((i=this.h)!==null&&i!==void 0?i:this.h=[]).push(n)}static get observedAttributes(){this.finalize();const n=[];return this.elementProperties.forEach((i,r)=>{const a=this._$Ep(r,i);a!==void 0&&(this._$Ev.set(a,r),n.push(a))}),n}static createProperty(n,i=$t){if(i.state&&(i.attribute=!1),this.finalize(),this.elementProperties.set(n,i),!i.noAccessor&&!this.prototype.hasOwnProperty(n)){const r=typeof n=="symbol"?Symbol():"__"+n,a=this.getPropertyDescriptor(n,r,i);a!==void 0&&Object.defineProperty(this.prototype,n,a)}}static getPropertyDescriptor(n,i,r){return{get(){return this[i]},set(a){const c=this[n];this[i]=a,this.requestUpdate(n,c,r)},configurable:!0,enumerable:!0}}static getPropertyOptions(n){return this.elementProperties.get(n)||$t}static finalize(){if(this.hasOwnProperty("finalized"))return!1;this.finalized=!0;const n=Object.getPrototypeOf(this);if(n.finalize(),n.h!==void 0&&(this.h=[...n.h]),this.elementProperties=new Map(n.elementProperties),this._$Ev=new Map,this.hasOwnProperty("properties")){const i=this.properties,r=[...Object.getOwnPropertyNames(i),...Object.getOwnPropertySymbols(i)];for(const a of r)this.createProperty(a,i[a])}return this.elementStyles=this.finalizeStyles(this.styles),!0}static finalizeStyles(n){const i=[];if(Array.isArray(n)){const r=new Set(n.flat(1/0).reverse());for(const a of r)i.unshift(xo(a))}else n!==void 0&&i.push(xo(n));return i}static _$Ep(n,i){const r=i.attribute;return r===!1?void 0:typeof r=="string"?r:typeof n=="string"?n.toLowerCase():void 0}u(){var n;this._$E_=new Promise(i=>this.enableUpdating=i),this._$AL=new Map,this._$Eg(),this.requestUpdate(),(n=this.constructor.h)===null||n===void 0||n.forEach(i=>i(this))}addController(n){var i,r;((i=this._$ES)!==null&&i!==void 0?i:this._$ES=[]).push(n),this.renderRoot!==void 0&&this.isConnected&&((r=n.hostConnected)===null||r===void 0||r.call(n))}removeController(n){var i;(i=this._$ES)===null||i===void 0||i.splice(this._$ES.indexOf(n)>>>0,1)}_$Eg(){this.constructor.elementProperties.forEach((n,i)=>{this.hasOwnProperty(i)&&(this._$Ei.set(i,this[i]),delete this[i])})}createRenderRoot(){var n;const i=(n=this.shadowRoot)!==null&&n!==void 0?n:this.attachShadow(this.constructor.shadowRootOptions);return gs(i,this.constructor.elementStyles),i}connectedCallback(){var n;this.renderRoot===void 0&&(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(n=this._$ES)===null||n===void 0||n.forEach(i=>{var r;return(r=i.hostConnected)===null||r===void 0?void 0:r.call(i)})}enableUpdating(n){}disconnectedCallback(){var n;(n=this._$ES)===null||n===void 0||n.forEach(i=>{var r;return(r=i.hostDisconnected)===null||r===void 0?void 0:r.call(i)})}attributeChangedCallback(n,i,r){this._$AK(n,r)}_$EO(n,i,r=$t){var a;const c=this.constructor._$Ep(n,r);if(c!==void 0&&r.reflect===!0){const l=(((a=r.converter)===null||a===void 0?void 0:a.toAttribute)!==void 0?r.converter:_t).toAttribute(i,r.type);this._$El=n,l==null?this.removeAttribute(c):this.setAttribute(c,l),this._$El=null}}_$AK(n,i){var r;const a=this.constructor,c=a._$Ev.get(n);if(c!==void 0&&this._$El!==c){const l=a.getPropertyOptions(c),d=typeof l.converter=="function"?{fromAttribute:l.converter}:((r=l.converter)===null||r===void 0?void 0:r.fromAttribute)!==void 0?l.converter:_t;this._$El=c,this[c]=d.fromAttribute(i,l.type),this._$El=null}}requestUpdate(n,i,r){let a=!0;n!==void 0&&(((r=r||this.constructor.getPropertyOptions(n)).hasChanged||Ao)(this[n],i)?(this._$AL.has(n)||this._$AL.set(n,i),r.reflect===!0&&this._$El!==n&&(this._$EC===void 0&&(this._$EC=new Map),this._$EC.set(n,r))):a=!1),!this.isUpdatePending&&a&&(this._$E_=this._$Ej())}async _$Ej(){this.isUpdatePending=!0;try{await this._$E_}catch(i){Promise.reject(i)}const n=this.scheduleUpdate();return n!=null&&await n,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var n;if(!this.isUpdatePending)return;this.hasUpdated,this._$Ei&&(this._$Ei.forEach((a,c)=>this[c]=a),this._$Ei=void 0);let i=!1;const r=this._$AL;try{i=this.shouldUpdate(r),i?(this.willUpdate(r),(n=this._$ES)===null||n===void 0||n.forEach(a=>{var c;return(c=a.hostUpdate)===null||c===void 0?void 0:c.call(a)}),this.update(r)):this._$Ek()}catch(a){throw i=!1,this._$Ek(),a}i&&this._$AE(r)}willUpdate(n){}_$AE(n){var i;(i=this._$ES)===null||i===void 0||i.forEach(r=>{var a;return(a=r.hostUpdated)===null||a===void 0?void 0:a.call(r)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(n)),this.updated(n)}_$Ek(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$E_}shouldUpdate(n){return!0}update(n){this._$EC!==void 0&&(this._$EC.forEach((i,r)=>this._$EO(r,this[r],i)),this._$EC=void 0),this._$Ek()}updated(n){}firstUpdated(n){}}ae.finalized=!0,ae.elementProperties=new Map,ae.elementStyles=[],ae.shadowRootOptions={mode:"open"},ko?.({ReactiveElement:ae}),((wt=Qe.reactiveElementVersions)!==null&&wt!==void 0?wt:Qe.reactiveElementVersions=[]).push("1.5.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var xt;const Ge=window,ce=Ge.trustedTypes,So=ce?ce.createPolicy("lit-html",{createHTML:s=>s}):void 0,j=`lit$${(Math.random()+"").slice(9)}$`,Ct="?"+j,ys=`<${Ct}>`,le=document,Ce=(s="")=>le.createComment(s),ke=s=>s===null||typeof s!="object"&&typeof s!="function",Po=Array.isArray,To=s=>Po(s)||typeof s?.[Symbol.iterator]=="function",Ae=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Oo=/-->/g,Eo=/>/g,oe=RegExp(`>|[ 	
\f\r](?:([^\\s"'>=/]+)([ 	
\f\r]*=[ 	
\f\r]*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),No=/'/g,Bo=/"/g,Fo=/^(?:script|style|textarea|title)$/i,Do=s=>(n,...i)=>({_$litType$:s,strings:n,values:i}),Z=Do(1),ma=Do(2),he=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),Io=new WeakMap,de=le.createTreeWalker(le,129,null,!1),Ro=(s,n)=>{const i=s.length-1,r=[];let a,c=n===2?"<svg>":"",l=Ae;for(let h=0;h<i;h++){const u=s[h];let f,b,p=-1,m=0;for(;m<u.length&&(l.lastIndex=m,b=l.exec(u),b!==null);)m=l.lastIndex,l===Ae?b[1]==="!--"?l=Oo:b[1]!==void 0?l=Eo:b[2]!==void 0?(Fo.test(b[2])&&(a=RegExp("</"+b[2],"g")),l=oe):b[3]!==void 0&&(l=oe):l===oe?b[0]===">"?(l=a??Ae,p=-1):b[1]===void 0?p=-2:(p=l.lastIndex-b[2].length,f=b[1],l=b[3]===void 0?oe:b[3]==='"'?Bo:No):l===Bo||l===No?l=oe:l===Oo||l===Eo?l=Ae:(l=oe,a=void 0);const y=l===oe&&s[h+1].startsWith("/>")?" ":"";c+=l===Ae?u+ys:p>=0?(r.push(f),u.slice(0,p)+"$lit$"+u.slice(p)+j+y):u+j+(p===-2?(r.push(void 0),h):y)}const d=c+(s[i]||"<?>")+(n===2?"</svg>":"");if(!Array.isArray(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return[So!==void 0?So.createHTML(d):d,r]};class Se{constructor({strings:n,_$litType$:i},r){let a;this.parts=[];let c=0,l=0;const d=n.length-1,h=this.parts,[u,f]=Ro(n,i);if(this.el=Se.createElement(u,r),de.currentNode=this.el.content,i===2){const b=this.el.content,p=b.firstChild;p.remove(),b.append(...p.childNodes)}for(;(a=de.nextNode())!==null&&h.length<d;){if(a.nodeType===1){if(a.hasAttributes()){const b=[];for(const p of a.getAttributeNames())if(p.endsWith("$lit$")||p.startsWith(j)){const m=f[l++];if(b.push(p),m!==void 0){const y=a.getAttribute(m.toLowerCase()+"$lit$").split(j),P=/([.?@])?(.*)/.exec(m);h.push({type:1,index:c,name:P[2],strings:y,ctor:P[1]==="."?Ho:P[1]==="?"?jo:P[1]==="@"?Lo:Pe})}else h.push({type:6,index:c})}for(const p of b)a.removeAttribute(p)}if(Fo.test(a.tagName)){const b=a.textContent.split(j),p=b.length-1;if(p>0){a.textContent=ce?ce.emptyScript:"";for(let m=0;m<p;m++)a.append(b[m],Ce()),de.nextNode(),h.push({type:2,index:++c});a.append(b[p],Ce())}}}else if(a.nodeType===8)if(a.data===Ct)h.push({type:2,index:c});else{let b=-1;for(;(b=a.data.indexOf(j,b+1))!==-1;)h.push({type:7,index:c}),b+=j.length-1}c++}}static createElement(n,i){const r=le.createElement("template");return r.innerHTML=n,r}}function ne(s,n,i=s,r){var a,c,l,d;if(n===he)return n;let h=r!==void 0?(a=i._$Co)===null||a===void 0?void 0:a[r]:i._$Cl;const u=ke(n)?void 0:n._$litDirective$;return h?.constructor!==u&&((c=h?._$AO)===null||c===void 0||c.call(h,!1),u===void 0?h=void 0:(h=new u(s),h._$AT(s,i,r)),r!==void 0?((l=(d=i)._$Co)!==null&&l!==void 0?l:d._$Co=[])[r]=h:i._$Cl=h),h!==void 0&&(n=ne(s,h._$AS(s,n.values),h,r)),n}class Mo{constructor(n,i){this.u=[],this._$AN=void 0,this._$AD=n,this._$AM=i}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}v(n){var i;const{el:{content:r},parts:a}=this._$AD,c=((i=n?.creationScope)!==null&&i!==void 0?i:le).importNode(r,!0);de.currentNode=c;let l=de.nextNode(),d=0,h=0,u=a[0];for(;u!==void 0;){if(d===u.index){let f;u.type===2?f=new ue(l,l.nextSibling,this,n):u.type===1?f=new u.ctor(l,u.name,u.strings,this,n):u.type===6&&(f=new Uo(l,this,n)),this.u.push(f),u=a[++h]}d!==u?.index&&(l=de.nextNode(),d++)}return c}p(n){let i=0;for(const r of this.u)r!==void 0&&(r.strings!==void 0?(r._$AI(n,r,i),i+=r.strings.length-2):r._$AI(n[i])),i++}}class ue{constructor(n,i,r,a){var c;this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=n,this._$AB=i,this._$AM=r,this.options=a,this._$Cm=(c=a?.isConnected)===null||c===void 0||c}get _$AU(){var n,i;return(i=(n=this._$AM)===null||n===void 0?void 0:n._$AU)!==null&&i!==void 0?i:this._$Cm}get parentNode(){let n=this._$AA.parentNode;const i=this._$AM;return i!==void 0&&n.nodeType===11&&(n=i.parentNode),n}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(n,i=this){n=ne(this,n,i),ke(n)?n===$||n==null||n===""?(this._$AH!==$&&this._$AR(),this._$AH=$):n!==this._$AH&&n!==he&&this.g(n):n._$litType$!==void 0?this.$(n):n.nodeType!==void 0?this.T(n):To(n)?this.k(n):this.g(n)}O(n,i=this._$AB){return this._$AA.parentNode.insertBefore(n,i)}T(n){this._$AH!==n&&(this._$AR(),this._$AH=this.O(n))}g(n){this._$AH!==$&&ke(this._$AH)?this._$AA.nextSibling.data=n:this.T(le.createTextNode(n)),this._$AH=n}$(n){var i;const{values:r,_$litType$:a}=n,c=typeof a=="number"?this._$AC(n):(a.el===void 0&&(a.el=Se.createElement(a.h,this.options)),a);if(((i=this._$AH)===null||i===void 0?void 0:i._$AD)===c)this._$AH.p(r);else{const l=new Mo(c,this),d=l.v(this.options);l.p(r),this.T(d),this._$AH=l}}_$AC(n){let i=Io.get(n.strings);return i===void 0&&Io.set(n.strings,i=new Se(n)),i}k(n){Po(this._$AH)||(this._$AH=[],this._$AR());const i=this._$AH;let r,a=0;for(const c of n)a===i.length?i.push(r=new ue(this.O(Ce()),this.O(Ce()),this,this.options)):r=i[a],r._$AI(c),a++;a<i.length&&(this._$AR(r&&r._$AB.nextSibling,a),i.length=a)}_$AR(n=this._$AA.nextSibling,i){var r;for((r=this._$AP)===null||r===void 0||r.call(this,!1,!0,i);n&&n!==this._$AB;){const a=n.nextSibling;n.remove(),n=a}}setConnected(n){var i;this._$AM===void 0&&(this._$Cm=n,(i=this._$AP)===null||i===void 0||i.call(this,n))}}class Pe{constructor(n,i,r,a,c){this.type=1,this._$AH=$,this._$AN=void 0,this.element=n,this.name=i,this._$AM=a,this.options=c,r.length>2||r[0]!==""||r[1]!==""?(this._$AH=Array(r.length-1).fill(new String),this.strings=r):this._$AH=$}get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}_$AI(n,i=this,r,a){const c=this.strings;let l=!1;if(c===void 0)n=ne(this,n,i,0),l=!ke(n)||n!==this._$AH&&n!==he,l&&(this._$AH=n);else{const d=n;let h,u;for(n=c[0],h=0;h<c.length-1;h++)u=ne(this,d[r+h],i,h),u===he&&(u=this._$AH[h]),l||(l=!ke(u)||u!==this._$AH[h]),u===$?n=$:n!==$&&(n+=(u??"")+c[h+1]),this._$AH[h]=u}l&&!a&&this.j(n)}j(n){n===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,n??"")}}class Ho extends Pe{constructor(){super(...arguments),this.type=3}j(n){this.element[this.name]=n===$?void 0:n}}const ws=ce?ce.emptyScript:"";class jo extends Pe{constructor(){super(...arguments),this.type=4}j(n){n&&n!==$?this.element.setAttribute(this.name,ws):this.element.removeAttribute(this.name)}}class Lo extends Pe{constructor(n,i,r,a,c){super(n,i,r,a,c),this.type=5}_$AI(n,i=this){var r;if((n=(r=ne(this,n,i,0))!==null&&r!==void 0?r:$)===he)return;const a=this._$AH,c=n===$&&a!==$||n.capture!==a.capture||n.once!==a.once||n.passive!==a.passive,l=n!==$&&(a===$||c);c&&this.element.removeEventListener(this.name,this,a),l&&this.element.addEventListener(this.name,this,n),this._$AH=n}handleEvent(n){var i,r;typeof this._$AH=="function"?this._$AH.call((r=(i=this.options)===null||i===void 0?void 0:i.host)!==null&&r!==void 0?r:this.element,n):this._$AH.handleEvent(n)}}class Uo{constructor(n,i,r){this.element=n,this.type=6,this._$AN=void 0,this._$AM=i,this.options=r}get _$AU(){return this._$AM._$AU}_$AI(n){ne(this,n)}}const ga={P:"$lit$",A:j,M:Ct,C:1,L:Ro,R:Mo,D:To,V:ne,I:ue,H:Pe,N:jo,U:Lo,B:Ho,F:Uo},Vo=Ge.litHtmlPolyfillSupport;Vo?.(Se,ue),((xt=Ge.litHtmlVersions)!==null&&xt!==void 0?xt:Ge.litHtmlVersions=[]).push("2.5.0");const _s=(s,n,i)=>{var r,a;const c=(r=i?.renderBefore)!==null&&r!==void 0?r:n;let l=c._$litPart$;if(l===void 0){const d=(a=i?.renderBefore)!==null&&a!==void 0?a:null;c._$litPart$=l=new ue(n.insertBefore(Ce(),d),d,void 0,i??{})}return l._$AI(s),l};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var kt,At;const va=null;class L extends ae{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var n,i;const r=super.createRenderRoot();return(n=(i=this.renderOptions).renderBefore)!==null&&n!==void 0||(i.renderBefore=r.firstChild),r}update(n){const i=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(n),this._$Do=_s(i,this.renderRoot,this.renderOptions)}connectedCallback(){var n;super.connectedCallback(),(n=this._$Do)===null||n===void 0||n.setConnected(!0)}disconnectedCallback(){var n;super.disconnectedCallback(),(n=this._$Do)===null||n===void 0||n.setConnected(!1)}render(){return he}}L.finalized=!0,L._$litElement$=!0,(kt=globalThis.litElementHydrateSupport)===null||kt===void 0||kt.call(globalThis,{LitElement:L});const qo=globalThis.litElementPolyfillSupport;qo?.({LitElement:L});const ya={_$AK:(s,n,i)=>{s._$AK(n,i)},_$AL:s=>s._$AL};((At=globalThis.litElementVersions)!==null&&At!==void 0?At:globalThis.litElementVersions=[]).push("3.2.2");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Te=s=>n=>typeof n=="function"?((i,r)=>(customElements.define(i,r),r))(s,n):((i,r)=>{const{kind:a,elements:c}=r;return{kind:a,elements:c,finisher(l){customElements.define(i,l)}}})(s,n);/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const $s=(s,n)=>n.kind==="method"&&n.descriptor&&!("value"in n.descriptor)?{...n,finisher(i){i.createProperty(n.key,s)}}:{kind:"field",key:Symbol(),placement:"own",descriptor:{},originalKey:n.key,initializer(){typeof n.initializer=="function"&&(this[n.key]=n.initializer.call(this))},finisher(i){i.createProperty(n.key,s)}};function E(s){return(n,i)=>i!==void 0?((r,a,c)=>{a.constructor.createProperty(c,r)})(s,n,i):$s(s,n)}/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */var St;const xs=((St=window.HTMLSlotElement)===null||St===void 0?void 0:St.prototype.assignedElements)!=null?(s,n)=>s.assignedElements(n):(s,n)=>s.assignedNodes(n).filter(i=>i.nodeType===Node.ELEMENT_NODE);function wa(s){const{slot:n,selector:i}=s??{};return o({descriptor:r=>({get(){var a;const c="slot"+(n?`[name=${n}]`:":not([name])"),l=(a=this.renderRoot)===null||a===void 0?void 0:a.querySelector(c),d=l!=null?xs(l,s):[];return i?d.filter(h=>h.matches(i)):d},enumerable:!0,configurable:!0})})}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function _a(s,n,i){let r,a=s;return typeof s=="object"?(a=s.slot,r=s):r={flatten:n},i?t({slot:a,flatten:n,selector:i}):e({descriptor:c=>({get(){var l,d;const h="slot"+(a?`[name=${a}]`:":not([name])"),u=(l=this.renderRoot)===null||l===void 0?void 0:l.querySelector(h);return(d=u?.assignedNodes(r))!==null&&d!==void 0?d:[]},enumerable:!0,configurable:!0})})}const zo=/(?<literal>\[.*?\])|(?<year>YYYY|YY)|(?<month>M{1,4})|(?<day>Do|DD?)|(?<weekday>d{2,4})|(?<hour>HH?|hh?)|(?<minute>mm?)|(?<second>ss?)|(?<fractionalSecond>SSS)|(?<dayPeriod>A|a)|(?<timeZoneName>ZZ?)/g,Wo=/(?<dateStyle>full|long|medium|short)(?:\+(?<timeStyle>full|long|medium|short))?/,Cs=[["year",24*60*60*1e3*(365*2-1),24*60*60*1e3*365,"yr"],["month",24*60*60*1e3*365/12,24*60*60*1e3*365/12,"mo"],["week",24*60*60*1e3*7,24*60*60*1e3*7,"wk"],["day",24*60*60*1e3,24*60*60*1e3,"d"],["hour",60*60*1e3,60*60*1e3,"h"],["minute",60*1e3,60*1e3,"m"],["second",1e3,1e3,"s"]];let ie;const Oe=new Map;let X,fe,J;function $a(s){typeof s=="string"?s==="system"?X=void 0:X=[s]:X=s??void 0,fe=void 0,J=void 0,Oe.clear(),ie=void 0}function xa(s,n){const i=new Date(s.getTime());for(const[r,a]of Object.entries(n))if(a)switch(r){case"years":i.setFullYear(i.getFullYear()+a);break;case"months":i.setMonth(i.getMonth()+a);break;case"days":i.setDate(i.getDate()+a);break;case"hours":i.setHours(i.getHours()+a);break;case"minutes":i.setMinutes(i.getMinutes()+a);break;case"seconds":i.setSeconds(i.getSeconds()+a);break}return i}function ks(s,n){const i=(typeof s=="number"?s:s.getTime())-new Date().getTime();for(const[r,a,c,l]of Cs){const d=Math.abs(i);if(d>=a||a===1e3)return n?(ie==null&&(J!=null?ie=J.resolvedOptions().locale:fe!=null?ie=fe.resolvedOptions().locale:(J=new Intl.RelativeTimeFormat(X,{localeMatcher:"best fit",numeric:"always",style:"narrow"}),ie=J.resolvedOptions().locale)),ie==="en"||ie?.startsWith("en-")?`${Math.round(d/c)}${l}`:(J==null&&(J=new Intl.RelativeTimeFormat(X,{localeMatcher:"best fit",numeric:"always",style:"narrow"})),J.format(Math.round(i/c),r))):(fe==null&&(fe=new Intl.RelativeTimeFormat(X,{localeMatcher:"best fit",numeric:"auto",style:"long"})),fe.format(Math.round(i/c),r))}return""}function As(s,n,i,r=!0){n=n??void 0;const a=`${i??""}:${n}`;let c=Oe.get(a);if(c==null){const h=Ss(n);let u;i==null?u=X:i==="system"?u=void 0:u=[i],c=new Intl.DateTimeFormat(u,h),r&&Oe.set(a,c)}if(n==null||Wo.test(n))return c.format(s);function l(h){const u=`${i??""}:time:${h}`;let f=Oe.get(u);if(f==null){const b={localeMatcher:"best fit",timeStyle:h};let p;i==null?p=X:i==="system"?p=void 0:p=[i],f=new Intl.DateTimeFormat(p,b),r&&Oe.set(u,f)}return f}const d=c.formatToParts(s);return n.replace(zo,(h,u,f,b,p,m,y,P,H,se,q,tt,Ne,ge,v)=>{if(u!=null)return u.substring(1,u.length-1);for(const D in v){const z=v[D];if(z==null)continue;const te=d.find(rn=>rn.type===D);return z==="Do"&&te?.type==="day"?Ps(Number(te.value)):z==="a"&&te?.type==="dayPeriod"?` ${(l("short").formatToParts(s).find(Dr=>Dr.type==="dayPeriod")??te)?.value??""}`:te?.value??""}return""})}function Ca(s,n,i){const r=(typeof n=="number"?n:n.getTime())-(typeof s=="number"?s:s.getTime());switch(i){case"days":return Math.floor(r/(1e3*60*60*24));case"hours":return Math.floor(r/(1e3*60*60));case"minutes":return Math.floor(r/(1e3*60));case"seconds":return Math.floor(r/1e3);default:return r}}function Ss(s){if(s==null)return{localeMatcher:"best fit",dateStyle:"full",timeStyle:"short"};const n=Wo.exec(s);if(n?.groups!=null){const{dateStyle:r,timeStyle:a}=n.groups;return{localeMatcher:"best fit",dateStyle:r||"full",timeStyle:a||void 0}}const i={localeMatcher:"best fit"};for(const{groups:r}of s.matchAll(zo))if(r!=null)for(const a in r){const c=r[a];if(c!=null)switch(a){case"year":i.year=c.length===4?"numeric":"2-digit";break;case"month":switch(c.length){case 4:i.month="long";break;case 3:i.month="short";break;case 2:i.month="2-digit";break;case 1:i.month="numeric";break}break;case"day":c==="DD"?i.day="2-digit":i.day="numeric";break;case"weekday":switch(c.length){case 4:i.weekday="long";break;case 3:i.weekday="short";break;case 2:i.weekday="narrow";break}break;case"hour":i.hour=c.length===2?"2-digit":"numeric",i.hour12=c==="hh"||c==="h";break;case"minute":i.minute=c.length===2?"2-digit":"numeric";break;case"second":i.second=c.length===2?"2-digit":"numeric";break;case"fractionalSecond":i.fractionalSecondDigits=3;break;case"dayPeriod":i.dayPeriod="narrow",i.hour12=!0,i.hourCycle="h12";break;case"timeZoneName":i.timeZoneName=c.length===2?"long":"short";break}}return i}const Pt=["th","st","nd","rd"];function Ps(s){const n=s%100;return`${s}${Pt[(n-20)%10]??Pt[n]??Pt[0]}`}const Ts=()=>({toAttribute:s=>s.getTime(),fromAttribute:(s,n)=>new Date(parseInt(s,10))});var Os=Object.defineProperty,Es=Object.getOwnPropertyDescriptor,Tt=(s,n,i,r)=>{for(var a=r>1?void 0:r?Es(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Os(n,i,a),a};let Ye=class extends L{constructor(){super(...arguments),this.format="MMMM Do, YYYY h:mma",this.date=new Date}render(){return Z`<time datetime="${this.date}" title="${As(this.date,this.format??"MMMM Do, YYYY h:mma")}"
			>${ks(this.date)}</time
		>`}};Tt([E()],Ye.prototype,"format",2),Tt([E({converter:Ts(),reflect:!0})],Ye.prototype,"date",2),Ye=Tt([Te("formatted-date")],Ye);var Ns=Object.defineProperty,Bs=Object.getOwnPropertyDescriptor,U=(s,n,i,r)=>{for(var a=r>1?void 0:r?Bs(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Ns(n,i,a),a};const Fs=O`
	<template>
		<a class="avatar" href="${s=>s.email?`mailto:${s.email}`:"#"}">
			${re(s=>s.showAvatar,O`<img class="thumb" lazy src="${s=>s.avatarUrl}" alt="${s=>s.name}" />`)}
			${re(s=>!s.showAvatar,O`<code-icon icon="person" size="32"></code-icon>`)}
		</a>
		<a class="name" href="${s=>s.email?`mailto:${s.email}`:"#"}">${s=>s.name}</a>
		<span class="date"
			>${s=>s.actionLabel} <formatted-date date=${s=>s.date} format="${s=>s.dateFormat}"></formatted-date
		></span>
	</template>
`,Ds=G`
	:host {
		display: grid;
		gap: 0rem 1rem;
		justify-content: start;
	}
	a {
		color: var(--color-link-foreground);
		text-decoration: none;
	}
	.avatar {
		grid-column: 1;
		grid-row: 1 / 3;
		width: 36px;
	}
	.thumb {
		width: 100%;
		height: auto;
		border-radius: 0.4rem;
	}
	.name {
		grid-column: 2;
		grid-row: 1;
		font-size: 1.5rem;
	}
	.date {
		grid-column: 2;
		grid-row: 2;
		font-size: 1.3rem;
	}
`;let R=class extends Y{constructor(){super(...arguments),this.name="",this.email="",this.date="",this.avatarUrl="https://www.gravatar.com/avatar/?s=64&d=robohash",this.showAvatar=!1,this.dateFormat="MMMM Do, YYYY h:mma",this.committer=!1,this.actionLabel="committed"}};U([g({mode:"reflect"})],R.prototype,"name",2),U([g({mode:"reflect"})],R.prototype,"email",2),U([g({mode:"reflect"})],R.prototype,"date",2),U([g({mode:"reflect"})],R.prototype,"avatarUrl",2),U([g({mode:"boolean"})],R.prototype,"showAvatar",2),U([g({mode:"reflect"})],R.prototype,"dateFormat",2),U([g({mode:"boolean"})],R.prototype,"committer",2),U([g({mode:"reflect"})],R.prototype,"actionLabel",2),R=U([K({name:"commit-identity",template:Fs,styles:Ds})],R);var Is=Object.defineProperty,Rs=Object.getOwnPropertyDescriptor,be=(s,n,i,r)=>{for(var a=r>1?void 0:r?Rs(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Is(n,i,a),a};let ee=class extends L{constructor(){super(...arguments),this.url="",this.name="",this.date="",this.status="merged",this.key="#1999"}renderDate(){return this.date===""?$:Z`<formatted-date date="${this.date}"></formatted-date>`}render(){let s="issues";switch(this.status.toLowerCase()){case"":s="link";break;case"merged":s="git-merge";break;case"closed":s="pass";break}return Z`
			<span class="icon"><code-icon icon=${s}></code-icon></span>
			<p class="title">
				<a href="${this.url}">${this.name}</a>
			</p>
			<p class="date">${this.key} ${this.status===""?this.status:$} ${this.renderDate()}</p>
		`}};ee.styles=We`
		:host {
			display: grid;
			gap: 0.25rem 0.6rem;
			justify-content: start;
		}

		a {
			color: var(--color-link-foreground);
			text-decoration: none;
		}

		.icon {
			grid-column: 1;
			grid-row: 1 / 3;
			color: var(--vscode-gitlens-mergedPullRequestIconColor);
			text-align: center;
			padding-top: 0.1rem;
		}

		.title {
			grid-column: 2;
			grid-row: 1;
			margin: 0;
			font-size: 1.4rem;
		}

		.date {
			grid-column: 2;
			grid-row: 2;
			margin: 0;
			font-size: 1.3rem;
		}
	`,be([E()],ee.prototype,"url",2),be([E()],ee.prototype,"name",2),be([E()],ee.prototype,"date",2),be([E()],ee.prototype,"status",2),be([E()],ee.prototype,"key",2),ee=be([Te("issue-pull-request")],ee);var Ms=Object.defineProperty,Hs=Object.getOwnPropertyDescriptor,Qo=(s,n,i,r)=>{for(var a=r>1?void 0:r?Hs(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Ms(n,i,a),a};let Ke=class extends L{constructor(){super(...arguments),this.lines=1}render(){const s=`--skeleton-lines: ${this.lines};`;return Z`<div class="skeleton" style=${s}></div>`}};Ke.styles=We`
		:host {
			--skeleton-line-height: 1.2;
			--skeleton-lines: 1;
		}

		.skeleton {
			position: relative;
			display: block;
			overflow: hidden;
			border-radius: 0.25em;
			width: 100%;
			height: calc(1em * var(--skeleton-line-height, 1.2) * var(--skeleton-lines, 1));
			background-color: var(--color-background--lighten-15);
		}

		.skeleton::before {
			content: '';
			position: absolute;
			display: block;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			background-image: linear-gradient(
				to right,
				transparent 0%,
				var(--color-background--lighten-15) 20%,
				var(--color-background--lighten-30) 60%,
				transparent 100%
			);
			transform: translateX(-100%);
			animation: skeleton-loader 2s ease-in-out infinite;
		}

		@keyframes skeleton-loader {
			100% {
				transform: translateX(100%);
			}
		}
	`,Qo([E({type:Number})],Ke.prototype,"lines",2),Ke=Qo([Te("skeleton-loader")],Ke);var js=Object.defineProperty,Ls=Object.getOwnPropertyDescriptor,Ze=(s,n,i,r)=>{for(var a=r>1?void 0:r?Ls(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&js(n,i,a),a};let pe=class extends L{constructor(){super(...arguments),this.added=0,this.modified=0,this.removed=0}render(){return Z`
			<span class="stat added" title="${this.added} added" aria-label="${this.added} added"
				><span class="label">+${this.added}</span></span
			>
			<span class="stat modified" title="${this.modified} modified" aria-label="${this.modified} modified"
				><span class="label">~${this.modified}</span></span
			>
			<span class="stat deleted" title="${this.removed} removed" aria-label="${this.removed} removed"
				><span class="label">-${this.removed}</span></span
			>
		`}};pe.styles=We`
        :host {
            display: inline-flex;
            flex-direction: row;
            align-items: center;
            gap: 1rem;
        }

        .stat {
            display: inline-flex;
            flex-direction: row;
            align-items: center;
        }

        .stat code-icon {
            margin-right: 0.25rem;
        }

        .added {
            color: var(--vscode-gitDecoration-addedResourceForeground);
        }
        .modified {
            color: var(--vscode-gitDecoration-modifiedResourceForeground);
        }
        .deleted {
            color: var(--vscode-gitDecoration-deletedResourceForeground);
        }

        .label {
            flex-basis: 100%;
            text-align: center;
        }
    }
    `,Ze([E({type:Number})],pe.prototype,"added",2),Ze([E({type:Number})],pe.prototype,"modified",2),Ze([E({type:Number})],pe.prototype,"removed",2),pe=Ze([Te("commit-stats")],pe);function ka(s){return s?function(n,i,r){return n.nodeType===1&&n.matches(s)}:function(n,i,r){return n.nodeType===1}}class Us{constructor(n,i){this.target=n,this.options=i,this.source=null}bind(n){const i=this.options.property;this.shouldUpdate=k.getAccessors(n).some(r=>r.name===i),this.source=n,this.updateTarget(this.computeNodes()),this.shouldUpdate&&this.observe()}unbind(){this.updateTarget(rt),this.source=null,this.shouldUpdate&&this.disconnect()}handleEvent(){this.updateTarget(this.computeNodes())}computeNodes(){let n=this.getNodes();return this.options.filter!==void 0&&(n=n.filter(this.options.filter)),n}updateTarget(n){this.source[this.options.property]=n}}class Vs extends Us{constructor(n,i){super(n,i)}observe(){this.target.addEventListener("slotchange",this)}disconnect(){this.target.removeEventListener("slotchange",this)}getNodes(){return this.target.assignedNodes(this.options)}}function Go(s){return typeof s=="string"&&(s={property:s}),new mo("fast-slotted",Vs,s)}var qs=Object.defineProperty,zs=Object.getOwnPropertyDescriptor,Yo=(s,n,i,r)=>{for(var a=r>1?void 0:r?zs(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&qs(n,i,a),a};const Ws=O`<template role="navigation"><slot ${Go("actionNodes")}></slot></template>`,Qs=G`
	:host {
		display: flex;
		align-items: center;
		user-select: none;
	}
`;let Ot=class extends Y{actionNodesChanged(s,n){if(this.actionNodesDisposer?.(),!n?.length)return;const i=this.handleKeydown.bind(this),r=n?.filter(a=>a.nodeType===1).map((a,c)=>(a.setAttribute("tabindex",c===0?"0":"-1"),a.addEventListener("keydown",i,!1),{dispose:()=>{a?.removeEventListener("keydown",i,!1)}}));this.actionNodesDisposer=()=>{r?.forEach(({dispose:a})=>a())}}disconnectedCallback(){this.actionNodesDisposer?.()}handleKeydown(s){if(!s.target||this.actionNodes==null||this.actionNodes.length<2)return;const n=s.target;let i=null;if(s.key==="ArrowLeft"){if(i=n.previousElementSibling,i==null){const r=this.actionNodes.filter(a=>a.nodeType===1);i=r[r.length-1]??null}}else s.key==="ArrowRight"&&(i=n.nextElementSibling,i==null&&(i=this.actionNodes.find(r=>r.nodeType===1)??null));i==null||i===n||(n.setAttribute("tabindex","-1"),i.setAttribute("tabindex","0"),i.focus())}};Yo([ao],Ot.prototype,"actionNodes",2),Ot=Yo([K({name:"action-nav",template:Ws,styles:Qs})],Ot);var Gs=Object.defineProperty,Ys=Object.getOwnPropertyDescriptor,Xe=(s,n,i,r)=>{for(var a=r>1?void 0:r?Ys(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Gs(n,i,a),a};let me=class extends L{constructor(){super(...arguments),this.collapsable=!1,this.expanded=!1,this.loading=!1}renderTitle(){return this.collapsable?Z`<button
			type="button"
			class="label"
			aria-controls="content"
			aria-expanded=${this.expanded}
			@click="${this.toggleExpanded}"
		>
			<code-icon class="icon" icon=${this.expanded?"chevron-down":"chevron-right"}></code-icon
			><span class="title"><slot name="title">Section</slot></span>
			<span class="subtitle"><slot name="subtitle"></slot></span>
		</button>`:Z`<div class="label">
				<span class="title"><slot name="title">Section</slot></span>
				<span class="subtitle"><slot name="subtitle"></slot></span>
			</div>`}render(){return Z`
			<header class="header">
				${this.renderTitle()}
				<slot name="actions"></slot>
				<progress-indicator active="${this.loading}"></progress-indicator>
			</header>
			<div id="content" role="region" class="content">
				<slot></slot>
			</div>
		`}toggleExpanded(){this.expanded=!this.expanded,this.dispatchEvent(new CustomEvent("expanded-change",{detail:{expanded:this.expanded},bubbles:!0,composed:!0}))}};me.styles=We`
		:host {
			display: flex;
			flex-direction: column;
			background-color: var(--vscode-sideBar-background);
		}

		* {
			box-sizing: border-box;
		}

		.header {
			flex: none;
			display: flex;
			background-color: var(--vscode-sideBarSectionHeader-background);
			color: var(--vscode-sideBarSectionHeader-foreground);
			border-top: 1px solid var(--vscode-sideBarSectionHeader-border);
			position: relative;
		}

		.header:focus-within {
			outline: 1px solid var(--vscode-focusBorder);
			outline-offset: -1px;
		}

		.label {
			appearance: none;
			display: flex;
			flex-direction: row;
			align-items: center;
			width: 100%;
			padding: 0;
			border: none;
			text-align: left;
			font-family: var(--font-family);
			font-size: 1.1rem;
			line-height: 2.2rem;
			height: 2.2rem;
			background: transparent;
			color: inherit;
			cursor: pointer;
			outline: none;
			text-overflow: ellipsis;
		}

		.title {
			font-weight: bold;
			text-transform: uppercase;
		}

		.subtitle {
			margin-left: 1rem;
			opacity: 0.6;
		}

		.icon {
			font-weight: normal;
			margin: 0 0.2rem;
		}

		.content {
			overflow: auto;
			/*
			scrollbar-gutter: stable;
			box-shadow: #000000 0 0.6rem 0.6rem -0.6rem inset;
			*/
			padding-top: 0.6rem;
		}

		:host([collapsable]:not([expanded])) .content,
		:host([collapsable][expanded='false']) .content {
			display: none;
		}

		slot[name='actions']::slotted(*) {
			flex: none;
			margin-left: auto;
		}
	`,Xe([E({type:Boolean,reflect:!0})],me.prototype,"collapsable",2),Xe([E({type:Boolean,reflect:!0})],me.prototype,"expanded",2),Xe([E({type:Boolean,reflect:!0})],me.prototype,"loading",2),me=Xe([Te("webview-pane")],me);var Ks=Object.defineProperty,Zs=Object.getOwnPropertyDescriptor,Et=(s,n,i,r)=>{for(var a=r>1?void 0:r?Zs(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Ks(n,i,a),a};const Xs=O`
	<template class="${s=>s.mode}${s=>s.active?" active":""}" role="progressbar">
		<div class="progress-bar"></div>
	</template>
`,Js=G`
	* {
		box-sizing: border-box;
	}

	:host {
		position: absolute;
		left: 0;
		bottom: 0;
		z-index: 5;
		height: 2px;
		width: 100%;
		overflow: hidden;
	}

	.progress-bar {
		background-color: var(--vscode-progressBar-background);
		display: none;
		position: absolute;
		left: 0;
		width: 2%;
		height: 2px;
	}

	:host(.active) .progress-bar {
		display: inherit;
	}

	:host(.discrete) .progress-bar {
		left: 0;
		transition: width 0.1s linear;
	}

	:host(.discrete.done) .progress-bar {
		width: 100%;
	}

	:host(.infinite) .progress-bar {
		animation-name: progress;
		animation-duration: 4s;
		animation-iteration-count: infinite;
		animation-timing-function: steps(100);
		transform: translateZ(0);
	}

	@keyframes progress {
		0% {
			transform: translateX(0) scaleX(1);
		}

		50% {
			transform: translateX(2500%) scaleX(3);
		}

		to {
			transform: translateX(4900%) scaleX(1);
		}
	}
`;let Je=class extends Y{constructor(){super(...arguments),this.mode="infinite",this.active=!1}};Et([g({mode:"reflect"})],Je.prototype,"mode",2),Et([g({mode:"boolean"})],Je.prototype,"active",2),Je=Et([K({name:"progress-indicator",template:Xs,styles:Js})],Je);var er=Object.defineProperty,tr=Object.getOwnPropertyDescriptor,Ko=(s,n,i,r)=>{for(var a=r>1?void 0:r?tr(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&er(n,i,a),a};const or=O`
	<template role="tree">
		<slot ${Go("itemNodes")}></slot>
	</template>
`,nr=G`
	::slotted(*) {
		box-sizing: inherit;
	}
`;let Nt=class extends Y{itemNodesChanged(s,n){if(this.itemNodesDisposer?.(),!n?.length)return;const i=n?.filter(r=>r.nodeType===1).map(r=>{const a=this.handleKeydown.bind(this),c=this.handleBeforeSelected.bind(this),l=this.handleSelected.bind(this);return r.addEventListener("keydown",a,!1),r.addEventListener("select",c,!1),r.addEventListener("selected",l,!1),{dispose:function(){r?.removeEventListener("keydown",a,!1),r?.removeEventListener("select",c,!1),r?.removeEventListener("selected",l,!1)}}});this.itemNodesDisposer=()=>{i?.forEach(({dispose:r})=>r())}}disconnectedCallback(){this.itemNodesDisposer?.()}handleBeforeSelected(s){if(!s.target)return;const n=s.target;this._lastSelected!=null&&this._lastSelected!==n&&this._lastSelected.deselect(),this._lastSelected=n}handleSelected(s){if(!s.target||!s.detail.branch)return;const n=s.target,i=n.getAttribute("level"),r=l=>parseInt(l.getAttribute("level")??"0",10),a=l=>{const d=r(l);let h=l.previousElementSibling;for(;h;){if(r(h)<d)return h;h=h.previousElementSibling}};let c=n.nextElementSibling;for(;c&&c.getAttribute("level")!==i;){const l=a(c);c.setAttribute("parentexpanded",l?.expanded===!1?"false":"true"),c.setAttribute("expanded",s.detail.expanded?"true":"false"),c=c.nextElementSibling}}handleKeydown(s){if(!s.target)return;const n=s.target;s.key==="Enter"||s.key===" "?n.select(s.key==="Enter"?{preserveFocus:!1}:void 0):s.key==="ArrowUp"?n.previousElementSibling?.focus():s.key==="ArrowDown"&&n.nextElementSibling?.focus()}};Ko([ao],Nt.prototype,"itemNodes",2),Nt=Ko([K({name:"list-container",template:or,styles:nr})],Nt);function F(s,n,i){return{index:s,removed:n,addedCount:i}}const Zo=0,Xo=1,Bt=2,Ft=3;function ir(s,n,i,r,a,c){const l=c-a+1,d=i-n+1,h=new Array(l);let u,f;for(let b=0;b<l;++b)h[b]=new Array(d),h[b][0]=b;for(let b=0;b<d;++b)h[0][b]=b;for(let b=1;b<l;++b)for(let p=1;p<d;++p)s[n+p-1]===r[a+b-1]?h[b][p]=h[b-1][p-1]:(u=h[b-1][p]+1,f=h[b][p-1]+1,h[b][p]=u<f?u:f);return h}function sr(s){let n=s.length-1,i=s[0].length-1,r=s[n][i];const a=[];for(;n>0||i>0;){if(n===0){a.push(Bt),i--;continue}if(i===0){a.push(Ft),n--;continue}const c=s[n-1][i-1],l=s[n-1][i],d=s[n][i-1];let h;l<d?h=l<c?l:c:h=d<c?d:c,h===c?(c===r?a.push(Zo):(a.push(Xo),r=c),n--,i--):h===l?(a.push(Ft),n--,r=l):(a.push(Bt),i--,r=d)}return a.reverse(),a}function rr(s,n,i){for(let r=0;r<i;++r)if(s[r]!==n[r])return r;return i}function ar(s,n,i){let r=s.length,a=n.length,c=0;for(;c<i&&s[--r]===n[--a];)c++;return c}function cr(s,n,i,r){return n<i||r<s?-1:n===i||r===s?0:s<i?n<r?n-i:r-i:r<n?r-s:n-s}function Jo(s,n,i,r,a,c){let l=0,d=0;const h=Math.min(i-n,c-a);if(n===0&&a===0&&(l=rr(s,r,h)),i===s.length&&c===r.length&&(d=ar(s,r,h-l)),n+=l,a+=l,i-=d,c-=d,i-n===0&&c-a===0)return rt;if(n===i){const y=F(n,[],0);for(;a<c;)y.removed.push(r[a++]);return[y]}else if(a===c)return[F(n,[],i-n)];const u=sr(ir(s,n,i,r,a,c)),f=[];let b,p=n,m=a;for(let y=0;y<u.length;++y)switch(u[y]){case Zo:b!==void 0&&(f.push(b),b=void 0),p++,m++;break;case Xo:b===void 0&&(b=F(p,[],0)),b.addedCount++,p++,b.removed.push(r[m]),m++;break;case Bt:b===void 0&&(b=F(p,[],0)),b.addedCount++,p++;break;case Ft:b===void 0&&(b=F(p,[],0)),b.removed.push(r[m]),m++;break}return b!==void 0&&f.push(b),f}const en=Array.prototype.push;function lr(s,n,i,r){const a=F(n,i,r);let c=!1,l=0;for(let d=0;d<s.length;d++){const h=s[d];if(h.index+=l,c)continue;const u=cr(a.index,a.index+a.removed.length,h.index,h.index+h.addedCount);if(u>=0){s.splice(d,1),d--,l-=h.addedCount-h.removed.length,a.addedCount+=h.addedCount-u;const f=a.removed.length+h.removed.length-u;if(!a.addedCount&&!f)c=!0;else{let b=h.removed;if(a.index<h.index){const p=a.removed.slice(0,h.index-a.index);en.apply(p,b),b=p}if(a.index+a.removed.length>h.index+h.addedCount){const p=a.removed.slice(h.index+h.addedCount-a.index);en.apply(b,p)}a.removed=b,h.index<a.index&&(a.index=h.index)}}else if(a.index<h.index){c=!0,s.splice(d,0,a),d++;const f=a.addedCount-a.removed.length;h.index+=f,l+=f}}c||s.push(a)}function hr(s){const n=[];for(let i=0,r=s.length;i<r;i++){const a=s[i];lr(n,a.index,a.removed,a.addedCount)}return n}function dr(s,n){let i=[];const r=hr(n);for(let a=0,c=r.length;a<c;++a){const l=r[a];if(l.addedCount===1&&l.removed.length===1){l.removed[0]!==s[l.index]&&i.push(l);continue}i=i.concat(Jo(s,l.index,l.index+l.addedCount,l.removed,0,l.removed.length))}return i}let tn=!1;function Dt(s,n){let i=s.index;const r=n.length;return i>r?i=r-s.addedCount:i<0&&(i=r+s.removed.length+i-s.addedCount),i<0&&(i=0),s.index=i,s}class ur extends Me{constructor(n){super(n),this.oldCollection=void 0,this.splices=void 0,this.needsQueue=!0,this.call=this.flush,Reflect.defineProperty(n,"$fastController",{value:this,enumerable:!1})}subscribe(n){this.flush(),super.subscribe(n)}addSplice(n){this.splices===void 0?this.splices=[n]:this.splices.push(n),this.needsQueue&&(this.needsQueue=!1,_.queueUpdate(this))}reset(n){this.oldCollection=n,this.needsQueue&&(this.needsQueue=!1,_.queueUpdate(this))}flush(){const n=this.splices,i=this.oldCollection;if(n===void 0&&i===void 0)return;this.needsQueue=!0,this.splices=void 0,this.oldCollection=void 0;const r=i===void 0?dr(this.source,n):Jo(this.source,0,this.source.length,i,0,i.length);this.notify(r)}}function fr(){if(tn)return;tn=!0,k.setArrayObserverFactory(h=>new ur(h));const s=Array.prototype;if(s.$fastPatch)return;Reflect.defineProperty(s,"$fastPatch",{value:1,enumerable:!1});const n=s.pop,i=s.push,r=s.reverse,a=s.shift,c=s.sort,l=s.splice,d=s.unshift;s.pop=function(){const h=this.length>0,u=n.apply(this,arguments),f=this.$fastController;return f!==void 0&&h&&f.addSplice(F(this.length,[u],0)),u},s.push=function(){const h=i.apply(this,arguments),u=this.$fastController;return u!==void 0&&u.addSplice(Dt(F(this.length-arguments.length,[],arguments.length),this)),h},s.reverse=function(){let h;const u=this.$fastController;u!==void 0&&(u.flush(),h=this.slice());const f=r.apply(this,arguments);return u!==void 0&&u.reset(h),f},s.shift=function(){const h=this.length>0,u=a.apply(this,arguments),f=this.$fastController;return f!==void 0&&h&&f.addSplice(F(0,[u],0)),u},s.sort=function(){let h;const u=this.$fastController;u!==void 0&&(u.flush(),h=this.slice());const f=c.apply(this,arguments);return u!==void 0&&u.reset(h),f},s.splice=function(){const h=l.apply(this,arguments),u=this.$fastController;return u!==void 0&&u.addSplice(Dt(F(+arguments[0],h,arguments.length>2?arguments.length-2:0),this)),h},s.unshift=function(){const h=d.apply(this,arguments),u=this.$fastController;return u!==void 0&&u.addSplice(Dt(F(0,[],arguments.length),this)),h}}const on=Object.freeze({positioning:!1,recycle:!0});function br(s,n,i,r){s.bind(n[i],r)}function pr(s,n,i,r){const a=Object.create(r);a.index=i,a.length=n.length,s.bind(n[i],a)}class mr{constructor(n,i,r,a,c,l){this.location=n,this.itemsBinding=i,this.templateBinding=a,this.options=l,this.source=null,this.views=[],this.items=null,this.itemsObserver=null,this.originalContext=void 0,this.childContext=void 0,this.bindView=br,this.itemsBindingObserver=k.binding(i,this,r),this.templateBindingObserver=k.binding(a,this,c),l.positioning&&(this.bindView=pr)}bind(n,i){this.source=n,this.originalContext=i,this.childContext=Object.create(i),this.childContext.parent=n,this.childContext.parentContext=this.originalContext,this.items=this.itemsBindingObserver.observe(n,this.originalContext),this.template=this.templateBindingObserver.observe(n,this.originalContext),this.observeItems(!0),this.refreshAllViews()}unbind(){this.source=null,this.items=null,this.itemsObserver!==null&&this.itemsObserver.unsubscribe(this),this.unbindAllViews(),this.itemsBindingObserver.disconnect(),this.templateBindingObserver.disconnect()}handleChange(n,i){n===this.itemsBinding?(this.items=this.itemsBindingObserver.observe(this.source,this.originalContext),this.observeItems(),this.refreshAllViews()):n===this.templateBinding?(this.template=this.templateBindingObserver.observe(this.source,this.originalContext),this.refreshAllViews(!0)):this.updateViews(i)}observeItems(n=!1){if(!this.items){this.items=rt;return}const i=this.itemsObserver,r=this.itemsObserver=k.getNotifier(this.items),a=i!==r;a&&i!==null&&i.unsubscribe(this),(a||n)&&r.subscribe(this)}updateViews(n){const i=this.childContext,r=this.views,a=this.bindView,c=this.items,l=this.template,d=this.options.recycle,h=[];let u=0,f=0;for(let b=0,p=n.length;b<p;++b){const m=n[b],y=m.removed;let P=0,H=m.index;const se=H+m.addedCount,q=r.splice(m.index,y.length),tt=f=h.length+q.length;for(;H<se;++H){const Ne=r[H],ge=Ne?Ne.firstChild:this.location;let v;d&&f>0?(P<=tt&&q.length>0?(v=q[P],P++):(v=h[u],u++),f--):v=l.create(),r.splice(H,0,v),a(v,c,H,i),v.insertBefore(ge)}q[P]&&h.push(...q.slice(P))}for(let b=u,p=h.length;b<p;++b)h[b].dispose();if(this.options.positioning)for(let b=0,p=r.length;b<p;++b){const m=r[b].context;m.length=p,m.index=b}}refreshAllViews(n=!1){const i=this.items,r=this.childContext,a=this.template,c=this.location,l=this.bindView;let d=i.length,h=this.views,u=h.length;if((d===0||n||!this.options.recycle)&&(yo.disposeContiguousBatch(h),u=0),u===0){this.views=h=new Array(d);for(let f=0;f<d;++f){const b=a.create();l(b,i,f,r),h[f]=b,b.insertBefore(c)}}else{let f=0;for(;f<d;++f)if(f<u){const p=h[f];l(p,i,f,r)}else{const p=a.create();l(p,i,f,r),h.push(p),p.insertBefore(c)}const b=h.splice(f,u-f);for(f=0,d=b.length;f<d;++f)b[f].dispose()}}unbindAllViews(){const n=this.views;for(let i=0,r=n.length;i<r;++i)n[i].unbind()}}class gr extends qe{constructor(n,i,r){super(),this.itemsBinding=n,this.templateBinding=i,this.options=r,this.createPlaceholder=_.createBlockPlaceholder,fr(),this.isItemsBindingVolatile=k.isVolatileBinding(n),this.isTemplateBindingVolatile=k.isVolatileBinding(i)}createBehavior(n){return new mr(n,this.itemsBinding,this.isItemsBindingVolatile,this.templateBinding,this.isTemplateBindingVolatile,this.options)}}function vr(s,n,i=on){const r=typeof n=="function"?n:()=>n;return new gr(s,r,Object.assign(Object.assign({},on),i))}const nn={toView:function(s){return s.toString()},fromView:function(s){return parseInt(s,10)}};var yr=Object.defineProperty,wr=Object.getOwnPropertyDescriptor,V=(s,n,i,r)=>{for(var a=r>1?void 0:r?wr(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&yr(n,i,a),a};const _r=O`
	<template
		role="treeitem"
		aria-expanded="${s=>s.expanded===!0?"true":"false"}"
		aria-hidden="${s=>s.isHidden}"
	>
		<button id="item" class="item" type="button" @click="${(s,n)=>s.onItemClick(n.event)}">
			${vr(s=>s.treeLeaves,O`<span class="node node--connector"><code-icon name="blank"></code-icon></span>`)}
			${re(s=>s.branch,O`<span class="node"
					><code-icon
						class="branch"
						icon="${s=>s.expanded?"chevron-down":"chevron-right"}"
					></code-icon
				></span>`)}
			<span class="icon"><slot name="icon"></slot></span>
			<span class="text">
				<span class="main"><slot></slot></span>
				<span class="description"><slot name="description"></slot></span>
			</span>
		</button>
		<nav class="actions"><slot name="actions"></slot></nav>
	</template>
`,$r=G`
	:host {
		box-sizing: border-box;
		padding-left: var(--gitlens-gutter-width);
		padding-right: var(--gitlens-scrollbar-gutter-width);
		padding-top: 0.1rem;
		padding-bottom: 0.1rem;
		line-height: 2.2rem;
		height: 2.2rem;

		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: space-between;
		font-size: var(--vscode-font-size);
		color: var(--vscode-sideBar-foreground);
	}

	:host(:hover) {
		color: var(--vscode-list-hoverForeground);
		background-color: var(--vscode-list-hoverBackground);
	}

	:host([active]) {
		color: var(--vscode-list-inactiveSelectionForeground);
		background-color: var(--vscode-list-inactiveSelectionBackground);
	}

	:host(:focus-within) {
		outline: 1px solid var(--vscode-list-focusOutline);
		outline-offset: -0.1rem;
		color: var(--vscode-list-activeSelectionForeground);
		background-color: var(--vscode-list-activeSelectionBackground);
	}

	:host([aria-hidden='true']) {
		display: none;
	}

	* {
		box-sizing: border-box;
	}

	.item {
		appearance: none;
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		gap: 0.6rem;
		width: 100%;
		padding: 0;
		text-decoration: none;
		color: inherit;
		background: none;
		border: none;
		outline: none;
		cursor: pointer;
		min-width: 0;
	}

	.icon {
		display: inline-block;
		width: 1.6rem;
		text-align: center;
	}

	slot[name='icon']::slotted(*) {
		width: 1.6rem;
		aspect-ratio: 1;
		vertical-align: text-bottom;
	}

	.node {
		display: inline-block;
		width: 1.6rem;
		text-align: center;
	}

	.node--connector {
		position: relative;
	}
	.node--connector::before {
		content: '';
		position: absolute;
		height: 2.2rem;
		border-left: 1px solid transparent;
		top: 50%;
		transform: translate(-50%, -50%);
		left: 0.8rem;
		width: 0.1rem;
		transition: border-color 0.1s linear;
		opacity: 0.4;
	}

	:host-context(.indentGuides-always) .node--connector::before,
	:host-context(.indentGuides-onHover:focus-within) .node--connector::before,
	:host-context(.indentGuides-onHover:hover) .node--connector::before {
		border-color: var(--vscode-tree-indentGuidesStroke);
	}

	.text {
		overflow: hidden;
		white-space: nowrap;
		text-align: left;
		text-overflow: ellipsis;
		flex: 1;
	}

	.description {
		opacity: 0.7;
		margin-left: 0.3rem;
	}

	.actions {
		flex: none;
		user-select: none;
		color: var(--vscode-icon-foreground);
	}

	:host(:focus-within) .actions {
		color: var(--vscode-list-activeSelectionIconForeground);
	}

	:host(:not(:hover):not(:focus-within)) .actions {
		display: none;
	}

	slot[name='actions']::slotted(*) {
		display: flex;
		align-items: center;
	}
`;let M=class extends Y{constructor(){super(...arguments),this.tree=!1,this.branch=!1,this.expanded=!0,this.parentexpanded=!0,this.level=1,this.active=!1}get treeLeaves(){const s=this.level-1;return s<1?[]:Array.from({length:s},(n,i)=>i+1)}get isHidden(){return this.parentexpanded===!1||!this.branch&&!this.expanded?"true":"false"}onItemClick(s){this.select()}select(s,n=!1){this.$emit("select"),this.branch&&(this.expanded=!this.expanded),this.active=!0,n||window.requestAnimationFrame(()=>{this.$emit("selected",{tree:this.tree,branch:this.branch,expanded:this.expanded,level:this.level})})}deselect(){this.active=!1}focus(s){this.shadowRoot?.getElementById("item")?.focus(s)}};V([g({mode:"boolean"})],M.prototype,"tree",2),V([g({mode:"boolean"})],M.prototype,"branch",2),V([g({mode:"boolean"})],M.prototype,"expanded",2),V([g({mode:"boolean"})],M.prototype,"parentexpanded",2),V([g({converter:nn})],M.prototype,"level",2),V([g({mode:"boolean"})],M.prototype,"active",2),V([He],M.prototype,"treeLeaves",1),V([He],M.prototype,"isHidden",1),M=V([K({name:"list-item",template:_r,styles:$r})],M);class xr{constructor(n,i){this.target=n,this.propertyName=i}bind(n){n[this.propertyName]=this.target}unbind(){}}function Cr(s){return new mo("fast-ref",xr,s)}var kr=Object.defineProperty,Ar=Object.getOwnPropertyDescriptor,N=(s,n,i,r)=>{for(var a=r>1?void 0:r?Ar(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&kr(n,i,a),a};const Sr=O`
	<list-item
		${Cr("base")}
		tree="${s=>s.tree}"
		level="${s=>s.level}"
		active="${s=>s.active}"
		expanded="${s=>s.expanded}"
		parentexpanded="${s=>s.parentexpanded}"
		@selected="${(s,n)=>s.onComparePrevious(n.event)}"
	>
		<img slot="icon" src="${s=>s.icon}" title="${s=>s.statusName}" alt="${s=>s.statusName}" />
		${s=>s.fileName}
		${re(s=>!s.tree,O`<span slot="description">${s=>s.filePath}</span>`)}
		<span slot="actions">
			<a
				class="change-list__action"
				@click="${(s,n)=>s.onOpenFile(n.event)}"
				href="#"
				title="Open file"
				aria-label="Open file"
				><code-icon icon="go-to-file"></code-icon
			></a>
			${re(s=>!s.uncommitted,O`
					<a
						class="change-list__action"
						@click="${(s,n)=>s.onCompareWorking(n.event)}"
						href="#"
						title="Open Changes with Working File"
						aria-label="Open Changes with Working File"
						><code-icon icon="git-compare"></code-icon
					></a>
					${re(s=>!s.stash,O`<a
								class="change-list__action"
								@click="${(s,n)=>s.onOpenFileOnRemote(n.event)}"
								href="#"
								title="Open on remote"
								aria-label="Open on remote"
								><code-icon icon="globe"></code-icon></a
							><a
								class="change-list__action"
								@click="${(s,n)=>s.onMoreActions(n.event)}"
								href="#"
								title="Show more actions"
								aria-label="Show more actions"
								><code-icon icon="ellipsis"></code-icon
							></a>`)}
				`)}
		</span>
	</list-item>
`,Pr=G`
	.change-list__action {
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.25em;
		color: inherit;
		padding: 2px;
		vertical-align: text-bottom;
		text-decoration: none;
	}
	.change-list__action:focus {
		outline: 1px solid var(--vscode-focusBorder);
		outline-offset: -1px;
	}
	.change-list__action:hover {
		background-color: var(--vscode-toolbar-hoverBackground);
	}
	.change-list__action:active {
		background-color: var(--vscode-toolbar-activeBackground);
	}
`,Tr={".":"Unchanged","!":"Ignored","?":"Untracked",A:"Added",D:"Deleted",M:"Modified",R:"Renamed",C:"Copied",AA:"Conflict",AU:"Conflict",UA:"Conflict",DD:"Conflict",DU:"Conflict",UD:"Conflict",UU:"Conflict",T:"Modified",U:"Updated but Unmerged"};let T=class extends Y{constructor(){super(...arguments),this.tree=!1,this.expanded=!0,this.parentexpanded=!0,this.level=1,this.active=!1,this.stash=!1,this.uncommitted=!1,this.icon="",this.path="",this.repo="",this.status=""}select(s){this.base?.select(s)}deselect(){this.base?.deselect()}focus(s){this.base?.focus(s)}get isHidden(){return this.base?.isHidden??"false"}get pathIndex(){return this.path.lastIndexOf("/")}get fileName(){return this.pathIndex>-1?this.path.substring(this.pathIndex+1):this.path}get filePath(){return!this.tree&&this.pathIndex>-1?this.path.substring(0,this.pathIndex):""}get statusName(){return this.status!==""?Tr[this.status]:""}getEventDetail(s){return{path:this.path,repoPath:this.repo,showOptions:s}}onOpenFile(s){s.preventDefault(),this.$emit("file-open",this.getEventDetail())}onOpenFileOnRemote(s){s.preventDefault(),this.$emit("file-open-on-remote",this.getEventDetail())}onCompareWorking(s){s.preventDefault(),this.$emit("file-compare-working",this.getEventDetail())}onComparePrevious(s,n){s?.preventDefault(),this.$emit("file-compare-previous",this.getEventDetail(n))}onMoreActions(s){s.preventDefault(),this.$emit("file-more-actions",this.getEventDetail())}};N([g({mode:"boolean"})],T.prototype,"tree",2),N([g({mode:"boolean"})],T.prototype,"expanded",2),N([g({mode:"boolean"})],T.prototype,"parentexpanded",2),N([g({converter:nn})],T.prototype,"level",2),N([g({mode:"boolean"})],T.prototype,"active",2),N([g({mode:"boolean"})],T.prototype,"stash",2),N([g({mode:"boolean"})],T.prototype,"uncommitted",2),N([g],T.prototype,"icon",2),N([g],T.prototype,"path",2),N([g],T.prototype,"repo",2),N([g],T.prototype,"status",2),N([He],T.prototype,"fileName",1),N([He],T.prototype,"filePath",1),T=N([K({name:"file-change-list-item",template:Sr,styles:Pr})],T);var Or=Object.defineProperty,Er=Object.getOwnPropertyDescriptor,et=(s,n,i,r)=>{for(var a=r>1?void 0:r?Er(n,i):n,c=s.length-1,l;c>=0;c--)(l=s[c])&&(a=(r?l(n,i,a):l(a))||a);return r&&a&&Or(n,i,a),a};const Nr=O`<a
	role="${s=>s.href?null:"button"}"
	type="${s=>s.href?null:"button"}"
	aria-label="${s=>s.label}"
	title="${s=>s.label}"
	><code-icon icon="${s=>s.icon}"></code-icon
></a>`,Br=G`
	:host {
		box-sizing: border-box;
		display: inline-flex;
		justify-content: center;
		align-items: center;
		width: 2rem;
		height: 2rem;
		border-radius: 0.5rem;
		color: inherit;
		padding: 0.2rem;
		vertical-align: text-bottom;
		text-decoration: none;
		cursor: pointer;
	}
	:host(:focus) {
		outline: 1px solid var(--vscode-focusBorder);
		outline-offset: -1px;
	}
	:host(:hover) {
		background-color: var(--vscode-toolbar-hoverBackground);
	}
	:host(:active) {
		background-color: var(--vscode-toolbar-activeBackground);
	}
`;let Ee=class extends Y{constructor(){super(...arguments),this.label="",this.icon=""}};et([g],Ee.prototype,"href",2),et([g],Ee.prototype,"label",2),et([g],Ee.prototype,"icon",2),Ee=et([K({name:"action-item",template:Nr,styles:Br})],Ee);const It="0000000000000000000000000000000000000000";class Fr extends Ui{constructor(){super("CommitDetailsApp")}onInitialize(){this.log(`${this.appName}.onInitialize`),this.renderContent()}onBind(){return[x.on("file-change-list-item","file-open-on-remote",i=>this.onOpenFileOnRemote(i.detail)),x.on("file-change-list-item","file-open",i=>this.onOpenFile(i.detail)),x.on("file-change-list-item","file-compare-working",i=>this.onCompareFileWithWorking(i.detail)),x.on("file-change-list-item","file-compare-previous",i=>this.onCompareFileWithPrevious(i.detail)),x.on("file-change-list-item","file-more-actions",i=>this.onFileMoreActions(i.detail)),x.on('[data-action="dismiss-banner"]',"click",i=>this.onDismissBanner(i)),x.on('[data-action="commit-actions"]',"click",i=>this.onCommitActions(i)),x.on('[data-action="pick-commit"]',"click",i=>this.onPickCommit(i)),x.on('[data-action="search-commit"]',"click",i=>this.onSearchCommit(i)),x.on('[data-action="autolink-settings"]',"click",i=>this.onAutolinkSettings(i)),x.on("[data-switch-value]","click",i=>this.onToggleFilesLayout(i)),x.on('[data-action="pin"]',"click",i=>this.onTogglePin(i)),x.on('[data-region="rich-pane"]',"expanded-change",i=>this.onExpandedChange(i.detail))]}onMessageReceived(n){const i=n.data;switch(this.log(`${this.appName}.onMessageReceived(${i.id}): name=${i.method}`),i.method){case Lt.method:jt(Lt,i,r=>{r.state,this.state=r.state,this.renderContent()});break;default:super.onMessageReceived?.(n)}}onDismissBanner(n){const i=this.state.preferences?.dismissed??[];if(i.includes("sidebar"))return;i.push("sidebar"),this.state.preferences={...this.state.preferences,dismissed:i};const r=n.target?.closest('[data-region="sidebar-banner"]')??void 0;this.renderBanner(this.state,r),this.sendCommand(ot,{dismissed:i})}onToggleFilesLayout(n){const i=n.target?.getAttribute("data-switch-value")??void 0;if(i===this.state.preferences?.files?.layout)return;const r={...this.state.preferences?.files,layout:i??W.Auto,compact:this.state.preferences?.files?.compact??!0,threshold:this.state.preferences?.files?.threshold??5};this.state.preferences={...this.state.preferences,files:r},this.renderFiles(this.state),this.sendCommand(ot,{files:r})}onExpandedChange(n){this.state.preferences={...this.state.preferences,autolinksExpanded:n.expanded},this.sendCommand(ot,{autolinksExpanded:n.expanded})}onTogglePin(n){n.preventDefault(),this.sendCommand(Un,{pin:!this.state.pinned})}onAutolinkSettings(n){n.preventDefault(),this.sendCommand(Ln,void 0)}onSearchCommit(n){this.sendCommand(jn,void 0)}onPickCommit(n){this.sendCommand(Hn,void 0)}onOpenFileOnRemote(n){this.sendCommand(In,n)}onOpenFile(n){this.sendCommand(Dn,n)}onCompareFileWithWorking(n){this.sendCommand(Rn,n)}onCompareFileWithPrevious(n){this.sendCommand(Mn,n)}onFileMoreActions(n){this.sendCommand(Fn,n)}onCommitActions(n){if(n.preventDefault(),this.state.selected===void 0){n.stopPropagation();return}const i=n.target?.getAttribute("data-action-type");i!=null&&this.sendCommand(Bn,{action:i,alt:n.altKey})}renderCommit(n){const i=n.selected!==void 0,r=document.getElementById("empty"),a=document.getElementById("main");return r?.setAttribute("aria-hidden",i?"true":"false"),a?.setAttribute("aria-hidden",i?"false":"true"),i}renderRichContent(){this.renderCommit(this.state)&&(this.renderMessage(this.state),this.renderPullRequestAndAutolinks(this.state))}renderContent(){this.renderCommit(this.state)&&(this.renderBanner(this.state),this.renderActions(this.state),this.renderPin(this.state),this.renderSha(this.state),this.renderMessage(this.state),this.renderAuthor(this.state),this.renderStats(this.state),this.renderFiles(this.state),this.renderPullRequestAndAutolinks(this.state))}renderBanner(n,i){n.preferences?.dismissed?.includes("sidebar")&&(i||(i=document.querySelector('[data-region="sidebar-banner"]')??void 0),i?.remove())}renderActions(n){const i=n.selected?.sha===It,r=i.toString();for(const a of document.querySelectorAll('[data-action-type="sha"],[data-action-type="more"]'))a.setAttribute("aria-hidden",r);document.querySelector('[data-action-type="scm"]')?.setAttribute("aria-hidden",(!i).toString())}renderPin(n){const i=document.querySelector('[data-action="pin"]');if(i==null)return;const r=n.pinned?"Unpin this Commit":"Pin this Commit";i.setAttribute("aria-label",r),i.setAttribute("title",r),i.classList.toggle("is-active",n.pinned),i.querySelector('[data-region="commit-pin"]')?.setAttribute("icon",n.pinned?"gl-pinned-filled":"pin")}renderSha(n){const i=[...document.querySelectorAll('[data-region="shortsha"]')];if(i.length!==0)for(const r of i)r.textContent=n.selected.shortSha}renderChoices(){const n=document.querySelector('[data-region="choices"]');n!=null&&(n.setAttribute("aria-hidden","true"),n.innerHTML="")}renderStats(n){const i=document.querySelector('[data-region="stats"]');if(i!=null){if(n.selected.stats?.changedFiles==null){i.innerHTML="";return}if(typeof n.selected.stats.changedFiles=="number")i.innerHTML=`
			<commit-stats added="?" modified="${n.selected.stats.changedFiles}" removed="?"></commit-stats>
		`;else{const{added:r,deleted:a,changed:c}=n.selected.stats.changedFiles;i.innerHTML=`
			<commit-stats added="${r}" modified="${c}" removed="${a}"></commit-stats>
		`}}}renderFiles(n){const i=document.querySelector('[data-region="files"]');if(i==null)return;const r=n.preferences?.files?.layout??W.Auto,a=document.querySelector("[data-switch-value]");if(a)switch(r){case W.Auto:a.setAttribute("data-switch-value","list"),a.setAttribute("icon","list-flat"),a.setAttribute("label","View as List");break;case W.List:a.setAttribute("data-switch-value","tree"),a.setAttribute("icon","list-tree"),a.setAttribute("label","View as Tree");break;case W.Tree:a.setAttribute("data-switch-value","auto"),a.setAttribute("icon","gl-list-auto"),a.setAttribute("label","View as Auto");break}if(!n.selected.files?.length){i.innerHTML="";return}let c;r===W.Auto?c=n.selected.files.length>(n.preferences?.files?.threshold??5):c=r===W.Tree;const l=n.selected.isStash?"stash ":n.selected.sha===It?"uncommitted ":"";if(c){const d=Tn(n.selected.files,u=>u.path.split("/"),(...u)=>u.join("/"),this.state.preferences?.files?.compact??!0),h=sn(d);i.innerHTML=`
					<li class="change-list__item">
						<list-container class="indentGuides-${n.indentGuides}">
							${h.map(({level:u,item:f})=>f.name===""?"":f.value==null?`
											<list-item level="${u}" tree branch>
												<code-icon slot="icon" icon="folder" title="Directory" aria-label="Directory"></code-icon>
												${f.name}
											</list-item>
										`:`
										<file-change-list-item
											tree
											level="${u}"
											${l}
											path="${f.value.path}"
											repo="${f.value.repoPath}"
											icon="${f.value.icon.dark}"
											status="${f.value.status}"
										></file-change-list-item>
									`).join("")}
						</list-container>
					</li>`}else i.innerHTML=`
				<li class="change-list__item">
					<list-container>
						${n.selected.files.map(d=>`
										<file-change-list-item
											${l}
											path="${d.path}"
											repo="${d.repoPath}"
											icon="${d.icon.dark}"
											status="${d.status}"
										></file-change-list-item>
									`).join("")}
					</list-container>
				</li>`;i.setAttribute("aria-hidden","false")}renderAuthor(n){const i=document.querySelector('[data-region="author"]');i!=null&&(n.selected?.isStash===!0?(i.innerHTML=`
				<div class="commit-stashed">
					<span class="commit-stashed__media"><code-icon class="commit-stashed__icon" icon="inbox"></code-icon></span>
					<span class="commit-stashed__date">stashed <formatted-date date=${n.selected.author.date} dateFormat="${n.dateFormat}"></formatted-date></span>
				</div>
			`,i.setAttribute("aria-hidden","false")):n.selected?.author!=null?(i.innerHTML=`
				<commit-identity
					name="${n.selected.author.name}"
					email="${n.selected.author.email}"
					date=${n.selected.author.date}
					dateFormat="${n.dateFormat}"
					avatarUrl="${n.selected.author.avatar??""}"
					showAvatar="${n.preferences?.avatars??!0}"
					actionLabel="${n.selected.sha===It?"modified":"committed"}"
				></commit-identity>
			`,i.setAttribute("aria-hidden","false")):(i.innerHTML="",i.setAttribute("aria-hidden","true")))}renderTitle(n){const i=document.querySelector('[data-region="commit-title"]');i!=null&&(i.innerHTML=n.selected.shortSha)}renderMessage(n){const i=document.querySelector('[data-region="message"]');if(i==null)return;const r=n.selected.message.indexOf(Nn);r===-1?i.innerHTML=`<strong>${n.selected.message}</strong>`:i.innerHTML=`<strong>${n.selected.message.substring(0,r)}</strong><br />${n.selected.message.substring(r+3)}`}renderPullRequestAndAutolinks(n){const i=document.querySelector('[data-region="rich-pane"]');if(i==null)return;i.expanded=this.state.preferences?.autolinksExpanded??!0,i.loading=!n.includeRichContent;const r=i.querySelector('[data-region="rich-info"]'),a=i.querySelector('[data-region="autolinks"]'),c=n.autolinkedIssues?.length??0;let l=n.selected.autolinks?.length??0,d=l;if(n.pullRequest!=null||c||l){let u=n.selected.autolinks;u?.length&&c&&(u=u.filter(f=>!n.autolinkedIssues?.some(b=>b.url===f.url))),a?.setAttribute("aria-hidden","false"),r?.setAttribute("aria-hidden","true"),this.renderAutolinks({...n,selected:{...n.selected,autolinks:u}}),this.renderPullRequest(n),this.renderIssues(n),l=u?.length??0,d=(n.pullRequest!=null?1:0)+c+l}else a?.setAttribute("aria-hidden","true"),r?.setAttribute("aria-hidden","false");const h=i.querySelector('[data-region="autolink-count"]');h!=null&&(h.innerHTML=`${n.includeRichContent||l?`${d} found `:""}${n.includeRichContent?"":"\u2026"}`)}renderAutolinks(n){const i=document.querySelector('[data-region="custom-autolinks"]');i!=null&&(n.selected.autolinks?.length?(i.innerHTML=n.selected.autolinks.map(r=>{let a=r.description??r.title;return a===void 0&&(a=`Custom Autolink ${r.prefix}${r.id}`),`
						<issue-pull-request
							name="${a?Rt(a):""}"
							url="${r.url}"
							key="${r.prefix}${r.id}"
							status=""
						></issue-pull-request>
					`}).join(""),i.setAttribute("aria-hidden","false")):(i.innerHTML="",i.setAttribute("aria-hidden","true")))}renderPullRequest(n){const i=document.querySelector('[data-region="pull-request"]');i!=null&&(n.pullRequest!=null?(i.innerHTML=`
				<issue-pull-request
					name="${Rt(n.pullRequest.title)}"
					url="${n.pullRequest.url}"
					key="#${n.pullRequest.id}"
					status="${n.pullRequest.state}"
					date=${n.pullRequest.date}
					dateFormat="${n.dateFormat}"
				></issue-pull-request>
			`,i.setAttribute("aria-hidden","false")):(i.innerHTML="",i.setAttribute("aria-hidden","true")))}renderIssues(n){const i=document.querySelector('[data-region="issue"]');i!=null&&(n.autolinkedIssues?.length?(i.innerHTML=n.autolinkedIssues.map(r=>`
						<issue-pull-request
							name="${Rt(r.title)}"
							url="${r.url}"
							key="${r.id}"
							status="${r.closed?"closed":"opened"}"
							date="${r.closed?r.closedDate:r.date}"
						></issue-pull-request>
					`).join(""),i.setAttribute("aria-hidden","false")):(i.innerHTML="",i.setAttribute("aria-hidden","true")))}}function Aa(s){}function sn(s,n=0){const i=[];if(s==null)return i;if(i.push({level:n,item:s}),s.children!=null){const r=Array.from(s.children.values());r.sort((a,c)=>!a.value||!c.value?(a.value?1:-1)-(c.value?1:-1):a.relativePath<c.relativePath?-1:a.relativePath>c.relativePath?1:0),r.forEach(a=>{i.push(...sn(a,n+1))})}return i}function Rt(s){return s.replace(/"/g,"&quot;")}new Fr})();
