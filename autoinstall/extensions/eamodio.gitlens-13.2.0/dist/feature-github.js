var ct=Object.defineProperty;var R=(de,ue)=>ct(de,"name",{value:ue,configurable:!0});exports.id=457;exports.ids=[457];exports.modules={5186:(de,ue,S)=>{var P=S(3698),Z=S(2505),Y=S(6417),k=Function.bind,V=k.bind(k);function ae(ce,ge,J){var Ue=V(Y,null).apply(null,J?[ge,J]:[ge]);ce.api={remove:Ue},ce.remove=Ue,["before","error","after","wrap"].forEach(function(te){var Re=J?[ge,te,J]:[ge,te];ce[te]=ce.api[te]=V(Z,null).apply(null,Re)})}R(ae,"bindApi");function W(){var ce="h",ge={registry:{}},J=P.bind(null,ge,ce);return ae(J,ge,ce),J}R(W,"HookSingular");function we(){var ce={registry:{}},ge=P.bind(null,ce);return ae(ge,ce),ge}R(we,"HookCollection");var ie=!1;function he(){return ie||(console.warn('[before-after-hook]: "Hook()" repurposing warning, use "Hook.Collection()". Read more: https://git.io/upgrade-before-after-hook-to-1.4'),ie=!0),we()}R(he,"Hook"),he.Singular=W.bind(),he.Collection=we.bind(),de.exports=he,de.exports.Hook=he,de.exports.Singular=he.Singular,de.exports.Collection=he.Collection},2505:de=>{de.exports=ue;function ue(S,P,Z,Y){var k=Y;S.registry[Z]||(S.registry[Z]=[]),P==="before"&&(Y=R(function(V,ae){return Promise.resolve().then(k.bind(null,ae)).then(V.bind(null,ae))},"hook")),P==="after"&&(Y=R(function(V,ae){var W;return Promise.resolve().then(V.bind(null,ae)).then(function(we){return W=we,k(W,ae)}).then(function(){return W})},"hook")),P==="error"&&(Y=R(function(V,ae){return Promise.resolve().then(V.bind(null,ae)).catch(function(W){return k(W,ae)})},"hook")),S.registry[Z].push({hook:Y,orig:k})}R(ue,"addHook")},3698:de=>{de.exports=ue;function ue(S,P,Z,Y){if(typeof Z!="function")throw new Error("method for before hook must be a function");return Y||(Y={}),Array.isArray(P)?P.reverse().reduce(function(k,V){return ue.bind(null,S,V,k,Y)},Z)():Promise.resolve().then(function(){return S.registry[P]?S.registry[P].reduce(function(k,V){return V.hook.bind(null,k,Y)},Z)():Z(Y)})}R(ue,"register")},6417:de=>{de.exports=ue;function ue(S,P,Z){if(S.registry[P]){var Y=S.registry[P].map(function(k){return k.orig}).indexOf(Z);Y!==-1&&S.registry[P].splice(Y,1)}}R(ue,"removeHook")},8026:(de,ue,S)=>{"use strict";S.r(ue),S.d(ue,{GitHubApi:()=>ne});function P(){return typeof navigator=="object"&&"userAgent"in navigator?navigator.userAgent:typeof process=="object"&&"version"in process?`Node.js/${process.version.substr(1)} (${process.platform}; ${process.arch})`:"<environment undetectable>"}R(P,"getUserAgent");var Z=S(5186);/*!
 * is-plain-object <https://github.com/jonschlinkert/is-plain-object>
 *
 * Copyright (c) 2014-2017, Jon Schlinkert.
 * Released under the MIT License.
 */function Y(c){return Object.prototype.toString.call(c)==="[object Object]"}R(Y,"isObject");function k(c){var n,s;return Y(c)===!1?!1:(n=c.constructor,n===void 0?!0:(s=n.prototype,!(Y(s)===!1||s.hasOwnProperty("isPrototypeOf")===!1)))}R(k,"isPlainObject");function V(c){return c?Object.keys(c).reduce((n,s)=>(n[s.toLowerCase()]=c[s],n),{}):{}}R(V,"lowercaseKeys");function ae(c,n){const s=Object.assign({},c);return Object.keys(n).forEach(i=>{k(n[i])?i in c?s[i]=ae(c[i],n[i]):Object.assign(s,{[i]:n[i]}):Object.assign(s,{[i]:n[i]})}),s}R(ae,"mergeDeep");function W(c){for(const n in c)c[n]===void 0&&delete c[n];return c}R(W,"removeUndefinedProperties");function we(c,n,s){if(typeof n=="string"){let[u,a]=n.split(" ");s=Object.assign(a?{method:u,url:a}:{url:u},s)}else s=Object.assign({},n);s.headers=V(s.headers),W(s),W(s.headers);const i=ae(c||{},s);return c&&c.mediaType.previews.length&&(i.mediaType.previews=c.mediaType.previews.filter(u=>!i.mediaType.previews.includes(u)).concat(i.mediaType.previews)),i.mediaType.previews=i.mediaType.previews.map(u=>u.replace(/-preview/,"")),i}R(we,"merge");function ie(c,n){const s=/\?/.test(c)?"&":"?",i=Object.keys(n);return i.length===0?c:c+s+i.map(u=>u==="q"?"q="+n.q.split("+").map(encodeURIComponent).join("+"):`${u}=${encodeURIComponent(n[u])}`).join("&")}R(ie,"addQueryParameters");const he=/\{[^}]+\}/g;function ce(c){return c.replace(/^\W+|\W+$/g,"").split(/,/)}R(ce,"removeNonChars");function ge(c){const n=c.match(he);return n?n.map(ce).reduce((s,i)=>s.concat(i),[]):[]}R(ge,"extractUrlVariableNames");function J(c,n){return Object.keys(c).filter(s=>!n.includes(s)).reduce((s,i)=>(s[i]=c[i],s),{})}R(J,"omit");function Ue(c){return c.split(/(%[0-9A-Fa-f]{2})/g).map(function(n){return/%[0-9A-Fa-f]/.test(n)||(n=encodeURI(n).replace(/%5B/g,"[").replace(/%5D/g,"]")),n}).join("")}R(Ue,"encodeReserved");function te(c){return encodeURIComponent(c).replace(/[!'()*]/g,function(n){return"%"+n.charCodeAt(0).toString(16).toUpperCase()})}R(te,"encodeUnreserved");function Re(c,n,s){return n=c==="+"||c==="#"?Ue(n):te(n),s?te(s)+"="+n:n}R(Re,"encodeValue");function re(c){return c!=null}R(re,"isDefined");function Me(c){return c===";"||c==="&"||c==="?"}R(Me,"isKeyOperator");function Ve(c,n,s,i){var u=c[s],a=[];if(re(u)&&u!=="")if(typeof u=="string"||typeof u=="number"||typeof u=="boolean")u=u.toString(),i&&i!=="*"&&(u=u.substring(0,parseInt(i,10))),a.push(Re(n,u,Me(n)?s:""));else if(i==="*")Array.isArray(u)?u.filter(re).forEach(function(l){a.push(Re(n,l,Me(n)?s:""))}):Object.keys(u).forEach(function(l){re(u[l])&&a.push(Re(n,u[l],l))});else{const l=[];Array.isArray(u)?u.filter(re).forEach(function(m){l.push(Re(n,m))}):Object.keys(u).forEach(function(m){re(u[m])&&(l.push(te(m)),l.push(Re(n,u[m].toString())))}),Me(n)?a.push(te(s)+"="+l.join(",")):l.length!==0&&a.push(l.join(","))}else n===";"?re(u)&&a.push(te(s)):u===""&&(n==="&"||n==="?")?a.push(te(s)+"="):u===""&&a.push("");return a}R(Ve,"getValues");function Ie(c){return{expand:ke.bind(null,c)}}R(Ie,"parseUrl");function ke(c,n){var s=["+","#",".","/",";","?","&"];return c.replace(/\{([^\{\}]+)\}|([^\{\}]+)/g,function(i,u,a){if(u){let m="";const f=[];if(s.indexOf(u.charAt(0))!==-1&&(m=u.charAt(0),u=u.substr(1)),u.split(/,/g).forEach(function(p){var y=/([^:\*]*)(?::(\d+)|(\*))?/.exec(p);f.push(Ve(n,m,y[1],y[2]||y[3]))}),m&&m!=="+"){var l=",";return m==="?"?l="&":m!=="#"&&(l=m),(f.length!==0?m:"")+f.join(l)}else return f.join(",")}else return Ue(a)})}R(ke,"expand");function Pe(c){let n=c.method.toUpperCase(),s=(c.url||"/").replace(/:([a-z]\w+)/g,"{$1}"),i=Object.assign({},c.headers),u,a=J(c,["method","baseUrl","url","headers","request","mediaType"]);const l=ge(s);s=Ie(s).expand(a),/^http/.test(s)||(s=c.baseUrl+s);const m=Object.keys(c).filter(y=>l.includes(y)).concat("baseUrl"),f=J(a,m);if(!/application\/octet-stream/i.test(i.accept)&&(c.mediaType.format&&(i.accept=i.accept.split(/,/).map(y=>y.replace(/application\/vnd(\.\w+)(\.v3)?(\.\w+)?(\+json)?$/,`application/vnd$1$2.${c.mediaType.format}`)).join(",")),c.mediaType.previews.length)){const y=i.accept.match(/[\w-]+(?=-preview)/g)||[];i.accept=y.concat(c.mediaType.previews).map(x=>{const N=c.mediaType.format?`.${c.mediaType.format}`:"+json";return`application/vnd.github.${x}-preview${N}`}).join(",")}return["GET","HEAD"].includes(n)?s=ie(s,f):"data"in f?u=f.data:Object.keys(f).length&&(u=f),!i["content-type"]&&typeof u<"u"&&(i["content-type"]="application/json; charset=utf-8"),["PATCH","PUT"].includes(n)&&typeof u>"u"&&(u=""),Object.assign({method:n,url:s,headers:i},typeof u<"u"?{body:u}:null,c.request?{request:c.request}:null)}R(Pe,"parse");function qe(c,n,s){return Pe(we(c,n,s))}R(qe,"endpointWithDefaults");function K(c,n){const s=we(c,n),i=qe.bind(null,s);return Object.assign(i,{DEFAULTS:s,defaults:K.bind(null,s),merge:we.bind(null,s),parse:Pe})}R(K,"withDefaults");const Ee={method:"GET",baseUrl:"https://api.github.com",headers:{accept:"application/vnd.github.v3+json","user-agent":`octokit-endpoint.js/7.0.3 ${P()}`},mediaType:{format:"",previews:[]}},be=K(null,Ee);var $e=S(6292);class De extends Error{constructor(n){super(n),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="Deprecation"}}R(De,"Deprecation");var Le=S(778),Oe=S.n(Le);const We=Oe()(c=>console.warn(c)),ze=Oe()(c=>console.warn(c));class ye extends Error{constructor(n,s,i){super(n),Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor),this.name="HttpError",this.status=s;let u;"headers"in i&&typeof i.headers<"u"&&(u=i.headers),"response"in i&&(this.response=i.response,u=i.response.headers);const a=Object.assign({},i.request);i.request.headers.authorization&&(a.headers=Object.assign({},i.request.headers,{authorization:i.request.headers.authorization.replace(/ .*$/," [REDACTED]")})),a.url=a.url.replace(/\bclient_secret=\w+/g,"client_secret=[REDACTED]").replace(/\baccess_token=\w+/g,"access_token=[REDACTED]"),this.request=a,Object.defineProperty(this,"code",{get(){return We(new De("[@octokit/request-error] `error.code` is deprecated, use `error.status`.")),s}}),Object.defineProperty(this,"headers",{get(){return ze(new De("[@octokit/request-error] `error.headers` is deprecated, use `error.response.headers`.")),u||{}}})}}R(ye,"RequestError");const je="6.2.2";function Qe(c){return c.arrayBuffer()}R(Qe,"getBufferResponse");function Ge(c){const n=c.request&&c.request.log?c.request.log:console;(k(c.body)||Array.isArray(c.body))&&(c.body=JSON.stringify(c.body));let s={},i,u;return(c.request&&c.request.fetch||globalThis.fetch||$e.ZP)(c.url,Object.assign({method:c.method,body:c.body,headers:c.headers,redirect:c.redirect},c.request)).then(async l=>{u=l.url,i=l.status;for(const m of l.headers)s[m[0]]=m[1];if("deprecation"in s){const m=s.link&&s.link.match(/<([^>]+)>; rel="deprecation"/),f=m&&m.pop();n.warn(`[@octokit/request] "${c.method} ${c.url}" is deprecated. It is scheduled to be removed on ${s.sunset}${f?`. See ${f}`:""}`)}if(!(i===204||i===205)){if(c.method==="HEAD"){if(i<400)return;throw new ye(l.statusText,i,{response:{url:u,status:i,headers:s,data:void 0},request:c})}if(i===304)throw new ye("Not modified",i,{response:{url:u,status:i,headers:s,data:await D(l)},request:c});if(i>=400){const m=await D(l);throw new ye(ve(m),i,{response:{url:u,status:i,headers:s,data:m},request:c})}return D(l)}}).then(l=>({status:i,url:u,headers:s,data:l})).catch(l=>{throw l instanceof ye||l.name==="AbortError"?l:new ye(l.message,500,{request:c})})}R(Ge,"fetchWrapper");async function D(c){const n=c.headers.get("content-type");return/application\/json/.test(n)?c.json():!n||/^text\/|charset=utf-8$/.test(n)?c.text():Qe(c)}R(D,"getResponseData");function ve(c){return typeof c=="string"?c:"message"in c?Array.isArray(c.errors)?`${c.message}: ${c.errors.map(JSON.stringify).join(", ")}`:c.message:`Unknown error: ${JSON.stringify(c)}`}R(ve,"toErrorMessage");function _e(c,n){const s=c.defaults(n);return Object.assign(R(function(u,a){const l=s.merge(u,a);if(!l.request||!l.request.hook)return Ge(s.parse(l));const m=R((f,p)=>Ge(s.parse(s.merge(f,p))),"request");return Object.assign(m,{endpoint:s,defaults:_e.bind(null,s)}),l.request.hook(m,l)},"newApi"),{endpoint:s,defaults:_e.bind(null,s)})}R(_e,"dist_web_withDefaults");const xe=_e(be,{headers:{"user-agent":`octokit-request.js/${je} ${P()}`}}),Te="5.0.4";function Ne(c){return`Request failed due to following response errors:
`+c.errors.map(n=>` - ${n.message}`).join(`
`)}R(Ne,"_buildMessageForResponseErrors");class Be extends Error{constructor(n,s,i){super(Ne(i)),this.request=n,this.headers=s,this.response=i,this.name="GraphqlResponseError",this.errors=i.errors,this.data=i.data,Error.captureStackTrace&&Error.captureStackTrace(this,this.constructor)}}R(Be,"GraphqlResponseError");const M=["method","baseUrl","url","headers","request","query","mediaType"],Xe=["query","method","url"],H=/\/api\/v3\/?$/;function e(c,n,s){if(s){if(typeof n=="string"&&"query"in s)return Promise.reject(new Error('[@octokit/graphql] "query" cannot be used as variable name'));for(const l in s)if(Xe.includes(l))return Promise.reject(new Error(`[@octokit/graphql] "${l}" cannot be used as variable name`))}const i=typeof n=="string"?Object.assign({query:n},s):n,u=Object.keys(i).reduce((l,m)=>M.includes(m)?(l[m]=i[m],l):(l.variables||(l.variables={}),l.variables[m]=i[m],l),{}),a=i.baseUrl||c.endpoint.DEFAULTS.baseUrl;return H.test(a)&&(u.url=a.replace(H,"/api/graphql")),c(u).then(l=>{if(l.data.errors){const m={};for(const f of Object.keys(l.headers))m[f]=l.headers[f];throw new Be(u,m,l.data)}return l.data.data})}R(e,"graphql");function r(c,n){const s=c.defaults(n);return Object.assign(R((u,a)=>e(s,u,a),"newApi"),{defaults:r.bind(null,s),endpoint:s.endpoint})}R(r,"graphql_dist_web_withDefaults");const t=r(xe,{headers:{"user-agent":`octokit-graphql.js/${Te} ${P()}`},method:"POST",url:"/graphql"});function o(c){return r(c,{method:"POST",url:"/graphql"})}R(o,"withCustomRequest");const d=/^v1\./,h=/^ghs_/,v=/^ghu_/;async function g(c){const n=c.split(/\./).length===3,s=d.test(c)||h.test(c),i=v.test(c);return{type:"token",token:c,tokenType:n?"app":s?"installation":i?"user-to-server":"oauth"}}R(g,"auth");function b(c){return c.split(/\./).length===3?`bearer ${c}`:`token ${c}`}R(b,"withAuthorizationPrefix");async function C(c,n,s,i){const u=n.endpoint.merge(s,i);return u.headers.authorization=b(c),n(u)}R(C,"hook");const T=R(function(n){if(!n)throw new Error("[@octokit/auth-token] No token passed to createTokenAuth");if(typeof n!="string")throw new Error("[@octokit/auth-token] Token passed to createTokenAuth is not a string");return n=n.replace(/^(token|bearer) +/i,""),Object.assign(g.bind(null,n),{hook:C.bind(null,n)})},"createTokenAuth"),F="4.1.0";class _{constructor(n={}){const s=new Z.Collection,i={baseUrl:xe.endpoint.DEFAULTS.baseUrl,headers:{},request:Object.assign({},n.request,{hook:s.bind(null,"request")}),mediaType:{previews:[],format:""}};if(i.headers["user-agent"]=[n.userAgent,`octokit-core.js/${F} ${P()}`].filter(Boolean).join(" "),n.baseUrl&&(i.baseUrl=n.baseUrl),n.previews&&(i.mediaType.previews=n.previews),n.timeZone&&(i.headers["time-zone"]=n.timeZone),this.request=xe.defaults(i),this.graphql=o(this.request).defaults(i),this.log=Object.assign({debug:()=>{},info:()=>{},warn:console.warn.bind(console),error:console.error.bind(console)},n.log),this.hook=s,n.authStrategy){const{authStrategy:a,...l}=n,m=a(Object.assign({request:this.request,log:this.log,octokit:this,octokitOptions:l},n.auth));s.wrap("request",m.hook),this.auth=m}else if(!n.auth)this.auth=async()=>({type:"unauthenticated"});else{const a=T(n.auth);s.wrap("request",a.hook),this.auth=a}this.constructor.plugins.forEach(a=>{Object.assign(this,a(this,n))})}static defaults(n){return R(class extends this{constructor(...i){const u=i[0]||{};if(typeof n=="function"){super(n(u));return}super(Object.assign({},n,u,u.userAgent&&n.userAgent?{userAgent:`${u.userAgent} ${n.userAgent}`}:null))}},"OctokitWithDefaults")}static plugin(...n){var s;const i=this.plugins;return s=R(class extends this{},"_a"),s.plugins=i.concat(n.filter(a=>!i.includes(a))),s}}R(_,"Octokit"),_.VERSION=F,_.plugins=[];var q=S(9496),L=S(1149),E=S(4673),B=S(9179),$=S(5396),I=S(5059),G=S(3082),A=S(7530),Q=S(2436),j=S(1999),U=S(7369),oe=S(9417),fe=S(2971),X=S(565),me=S(8301),pe=Object.defineProperty,at=Object.getOwnPropertyDescriptor,lt=R((c,n,s)=>n in c?pe(c,n,{enumerable:!0,configurable:!0,writable:!0,value:s}):c[n]=s,"__defNormalProp"),se=R((c,n,s,i)=>{for(var u=i>1?void 0:i?at(n,s):n,a=c.length-1,l;a>=0;a--)(l=c[a])&&(u=(i?l(n,s,u):l(u))||u);return i&&u&&pe(n,s,u),u},"__decorateClass"),He=R((c,n,s)=>(lt(c,typeof n!="symbol"?n+"":n,s),s),"__publicField");const Se=Object.freeze({values:[]}),Ke=Object.freeze({ranges:[]});class ne{constructor(n){He(this,"_onDidReauthenticate",new q.EventEmitter),He(this,"_disposable"),He(this,"_proxyAgent",null),He(this,"_enterpriseVersions",new Map),He(this,"_octokits",new Map),this._disposable=q.Disposable.from(B.DN.onDidChange(s=>{(B.DN.changed(s,"proxy")||B.DN.changed(s,"outputLevel"))&&this.resetCaches()}),B.DN.onDidChangeAny(s=>{(s.affectsConfiguration("http.proxy")||s.affectsConfiguration("http.proxyStrictSSL"))&&this.resetCaches()}))}get onDidReauthenticate(){return this._onDidReauthenticate.event}dispose(){var n;(n=this._disposable)==null||n.dispose()}resetCaches(){this._proxyAgent=null,this._octokits.clear(),this._enterpriseVersions.clear()}get proxyAgent(){if(!E.$L)return this._proxyAgent===null&&(this._proxyAgent=(0,L.Nx)()),this._proxyAgent}async getAccountForCommit(n,s,i,u,a,l){var m,f;const p=(0,U.UH)();try{const y=`query getAccountForCommit(
	$owner: String!
	$repo: String!
	$ref: GitObjectID!
	$avatarSize: Int
) {
	repository(name: $repo, owner: $owner) {
		object(oid: $ref) {
			... on Commit {
				author {
					name
					email
					avatarUrl(size: $avatarSize)
				}
			}
		}
	}
}`,x=await this.graphql(n,s,y,{...l,owner:i,repo:u,ref:a},p),N=(f=(m=x?.repository)==null?void 0:m.object)==null?void 0:f.author;return N==null?void 0:{provider:n,name:N.name??void 0,email:N.email??void 0,avatarUrl:!N.avatarUrl||Je(l)?N.avatarUrl??void 0:N.email&&l?.baseUrl!=null?await this.createEnterpriseAvatarUrl(n,s,l.baseUrl,N.email,l.avatarSize):void 0}}catch(y){if(y instanceof $.Ww)return;throw this.handleException(y,n,p)}}async getAccountForEmail(n,s,i,u,a,l){var m,f;const p=(0,U.UH)();try{const y=`query getAccountForEmail(
	$emailQuery: String!
	$avatarSize: Int
) {
	search(type: USER, query: $emailQuery, first: 1) {
		nodes {
			... on User {
				name
				email
				avatarUrl(size: $avatarSize)
			}
		}
	}
}`,x=await this.graphql(n,s,y,{...l,owner:i,repo:u,emailQuery:`in:email ${a}`},p),N=(f=(m=x?.search)==null?void 0:m.nodes)==null?void 0:f[0];return N==null?void 0:{provider:n,name:N.name??void 0,email:N.email??void 0,avatarUrl:!N.avatarUrl||Je(l)?N.avatarUrl??void 0:N.email&&l?.baseUrl!=null?await this.createEnterpriseAvatarUrl(n,s,l.baseUrl,N.email,l.avatarSize):void 0}}catch(y){if(y instanceof $.Ww)return;throw this.handleException(y,n,p)}}async getDefaultBranch(n,s,i,u,a){var l,m;const f=(0,U.UH)();try{const p=`query getDefaultBranch(
	$owner: String!
	$repo: String!
) {
	repository(name: $repo, owner: $owner) {
		defaultBranchRef {
			name
		}
	}
}`,y=await this.graphql(n,s,p,{...a,owner:i,repo:u},f),x=((m=(l=y?.repository)==null?void 0:l.defaultBranchRef)==null?void 0:m.name)??void 0;return x==null?void 0:{provider:n,name:x}}catch(p){if(p instanceof $.Ww)return;throw this.handleException(p,n,f)}}async getIssueOrPullRequest(n,s,i,u,a,l){var m;const f=(0,U.UH)();try{const p=`query getIssueOrPullRequest(
	$owner: String!
	$repo: String!
	$number: Int!
) {
	repository(name: $repo, owner: $owner) {
		issueOrPullRequest(number: $number) {
			__typename
			... on Issue {
				createdAt
				closed
				closedAt
				title
				url
			}
			... on PullRequest {
				createdAt
				closed
				closedAt
				title
				url
			}
		}
	}
}`,y=await this.graphql(n,s,p,{...l,owner:i,repo:u,number:a},f),x=(m=y?.repository)==null?void 0:m.issueOrPullRequest;return x==null?void 0:{provider:n,type:x.type,id:String(a),date:new Date(x.createdAt),title:x.title,closed:x.closed,closedDate:x.closedAt==null?void 0:new Date(x.closedAt),url:x.url}}catch(p){if(p instanceof $.Ww)return;throw this.handleException(p,n,f)}}async getPullRequestForBranch(n,s,i,u,a,l){var m,f,p,y;const x=(0,U.UH)();try{const N=`query getPullRequestForBranch(
	$owner: String!
	$repo: String!
	$branch: String!
	$limit: Int!
	$include: [PullRequestState!]
	$avatarSize: Int
) {
	repository(name: $repo, owner: $owner) {
		refs(query: $branch, refPrefix: "refs/heads/", first: 1) {
			nodes {
				associatedPullRequests(first: $limit, orderBy: {field: UPDATED_AT, direction: DESC}, states: $include) {
					nodes {
						author {
							login
							avatarUrl(size: $avatarSize)
							url
						}
						permalink
						number
						title
						state
						updatedAt
						closedAt
						mergedAt
						repository {
							isFork
							owner {
								login
							}
						}
					}
				}
			}
		}
	}
}`,z=await this.graphql(n,s,N,{...l,owner:i,repo:u,branch:a,limit:10},x),O=(y=(p=(f=(m=z?.repository)==null?void 0:m.refs.nodes[0])==null?void 0:f.associatedPullRequests)==null?void 0:p.nodes)==null?void 0:y.filter(ee=>ee!=null&&(!ee.repository.isFork||ee.repository.owner.login===i));return O==null||O.length===0?void 0:(O.length>1&&O.sort((ee,le)=>(ee.repository.owner.login===i?-1:1)-(le.repository.owner.login===i?-1:1)||(ee.state==="OPEN"?-1:1)-(le.state==="OPEN"?-1:1)||new Date(le.updatedAt).getTime()-new Date(ee.updatedAt).getTime()),me.GitHubPullRequest.from(O[0],n))}catch(N){if(N instanceof $.Ww)return;throw this.handleException(N,n,x)}}async getPullRequestForCommit(n,s,i,u,a,l){var m,f,p,y;const x=(0,U.UH)();try{const N=`query getPullRequestForCommit(
	$owner: String!
	$repo: String!
	$ref: GitObjectID!
	$avatarSize: Int
) {
	repository(name: $repo, owner: $owner) {
		object(oid: $ref) {
			... on Commit {
				associatedPullRequests(first: 2, orderBy: {field: UPDATED_AT, direction: DESC}) {
					nodes {
						author {
							login
							avatarUrl(size: $avatarSize)
							url
						}
						permalink
						number
						title
						state
						updatedAt
						closedAt
						mergedAt
						repository {
							isFork
							owner {
								login
							}
						}
					}
				}
			}
		}
	}
}`,z=await this.graphql(n,s,N,{...l,owner:i,repo:u,ref:a},x),O=(y=(p=(f=(m=z?.repository)==null?void 0:m.object)==null?void 0:f.associatedPullRequests)==null?void 0:p.nodes)==null?void 0:y.filter(ee=>ee!=null&&(!ee.repository.isFork||ee.repository.owner.login===i));return O==null||O.length===0?void 0:(O.length>1&&O.sort((ee,le)=>(ee.repository.owner.login===i?-1:1)-(le.repository.owner.login===i?-1:1)||(ee.state==="MERGED"?-1:1)-(le.state==="MERGED"?-1:1)||new Date(le.updatedAt).getTime()-new Date(ee.updatedAt).getTime()),me.GitHubPullRequest.from(O[0],n))}catch(N){if(N instanceof $.Ww)return;throw this.handleException(N,n,x)}}async getBlame(n,s,i,u,a){var l,m,f,p,y;const x=(0,U.UH)();try{const N=`query getBlameRanges(
	$owner: String!
	$repo: String!
	$ref: String!
	$path: String!
) {
	viewer { name }
	repository(owner: $owner, name: $repo) {
		object(expression: $ref) {
			...on Commit {
				blame(path: $path) {
					ranges {
						startingLine
						endingLine
						commit {
							oid
							parents(first: 3) { nodes { oid } }
							message
							additions
							changedFiles
							deletions
							author {
								avatarUrl
								date
								email
								name
							}
							committer {
								date
								email
								name
							}
						}
					}
				}
			}
		}
	}
}`,z=await this.graphql(void 0,n,N,{owner:s,repo:i,ref:u,path:a},x);if(z==null)return Ke;const O=(f=(m=(l=z.repository)==null?void 0:l.object)==null?void 0:m.blame)==null?void 0:f.ranges;return O==null||O.length===0?{ranges:[],viewer:(p=z.viewer)==null?void 0:p.name}:{ranges:O,viewer:(y=z.viewer)==null?void 0:y.name}}catch(N){if(N instanceof $.Ww)return Ke;throw this.handleException(N,void 0,x)}}async getBranches(n,s,i,u){var a;const l=(0,U.UH)();try{const m=`query getBranches(
	$owner: String!
	$repo: String!
	$branchQuery: String
	$cursor: String
	$limit: Int = 100
) {
	repository(owner: $owner, name: $repo) {
		refs(query: $branchQuery, refPrefix: "refs/heads/", first: $limit, after: $cursor, orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
			pageInfo {
				endCursor
				hasNextPage
			}
			nodes {
				name
				target {
					oid
					commitUrl
					...on Commit {
						authoredDate
						committedDate
					}
				}
			}
		}
	}
}`,f=await this.graphql(void 0,n,m,{owner:s,repo:i,branchQuery:u?.query,cursor:u?.cursor,limit:Math.min(100,u?.limit??100)},l);if(f==null)return Se;const p=(a=f.repository)==null?void 0:a.refs;return p==null?Se:{paging:{cursor:p.pageInfo.endCursor,more:p.pageInfo.hasNextPage},values:p.nodes}}catch(m){if(m instanceof $.Ww)return Se;throw this.handleException(m,void 0,l)}}async getCommit(n,s,i,u){var a,l,m,f,p,y,x,N,z,O;const ee=(0,U.UH)();try{const le=await this.request(void 0,n,"GET /repos/{owner}/{repo}/commits/{ref}",{owner:s,repo:i,ref:u},ee),Ce=le?.data;if(Ce==null)return;const{commit:Fe}=Ce;return{oid:Ce.sha,parents:{nodes:Ce.parents.map(Ye=>({oid:Ye.sha}))},message:Fe.message,additions:(a=Ce.stats)==null?void 0:a.additions,changedFiles:(l=Ce.files)==null?void 0:l.length,deletions:(m=Ce.stats)==null?void 0:m.deletions,author:{avatarUrl:((f=Ce.author)==null?void 0:f.avatar_url)??void 0,date:((p=Fe.author)==null?void 0:p.date)??new Date().toString(),email:((y=Fe.author)==null?void 0:y.email)??void 0,name:((x=Fe.author)==null?void 0:x.name)??""},committer:{date:((N=Fe.committer)==null?void 0:N.date)??new Date().toString(),email:((z=Fe.committer)==null?void 0:z.email)??void 0,name:((O=Fe.committer)==null?void 0:O.name)??""},files:Ce.files}}catch(le){if(le instanceof $.Ww)return;throw this.handleException(le,void 0,ee)}}async getCommitForFile(n,s,i,u,a){if(G.p.isSha(u))return this.getCommit(n,s,i,u);const l=await this.getCommits(n,s,i,u,{limit:1,path:a});return l.values.length===0?void 0:{...await this.getCommit(n,s,i,l.values[0].oid)??l.values[0],viewer:l.viewer}}async getCommitBranches(n,s,i,u,a){var l,m;const f=(0,U.UH)();try{const p=`query getCommitBranches(
	$owner: String!
	$repo: String!
	$since: GitTimestamp!
	$until: GitTimestamp!
) {
	repository(owner: $owner, name: $repo) {
		refs(first: 20, refPrefix: "refs/heads/", orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
			nodes {
				name
				target {
					... on Commit {
						history(first: 3, since: $since until: $until) {
							nodes { oid }
						}
					}
				}
			}
		}
	}
}`,y=await this.graphql(void 0,n,p,{owner:s,repo:i,since:a.toISOString(),until:a.toISOString()},f),x=(m=(l=y?.repository)==null?void 0:l.refs)==null?void 0:m.nodes;if(x==null)return[];const N=[];for(const z of x)for(const O of z.target.history.nodes)if(O.oid===u){N.push(z.name);break}return N}catch(p){if(p instanceof $.Ww)return[];throw this.handleException(p,void 0,f)}}async getCommitCount(n,s,i,u){var a,l;const m=(0,U.UH)();try{const f=`query getCommitCount(
	$owner: String!
	$repo: String!
	$ref: String!
) {
	repository(owner: $owner, name: $repo) {
		ref(qualifiedName: $ref) {
			target {
				... on Commit {
					history(first: 1) {
						totalCount
					}
				}
			}
		}
	}
}`,p=await this.graphql(void 0,n,f,{owner:s,repo:i,ref:u},m);return(l=(a=p?.repository)==null?void 0:a.ref)==null?void 0:l.target.history.totalCount}catch(f){if(f instanceof $.Ww)return;throw this.handleException(f,void 0,m)}}async getCommitOnBranch(n,s,i,u,a,l){var m;const f=(0,U.UH)();try{const p=`query getCommitOnBranch(
	$owner: String!
	$repo: String!
	$ref: String!
	$since: GitTimestamp!
	$until: GitTimestamp!
) {
	repository(owner: $owner, name: $repo) {
		ref(qualifiedName: $ref) {
			target {
				... on Commit {
					history(first: 3, since: $since until: $until) {
						nodes { oid }
					}
				}
			}
		}
	}
}`,y=await this.graphql(void 0,n,p,{owner:s,repo:i,ref:`refs/heads/${u}`,since:l.toISOString(),until:l.toISOString()},f),x=(m=y?.repository)==null?void 0:m.ref.target.history.nodes;if(x==null)return[];const N=[];for(const z of x)if(z.oid===a){N.push(u);break}return N}catch(p){if(p instanceof $.Ww)return[];throw this.handleException(p,void 0,f)}}async getCommits(n,s,i,u,a){var l,m,f,p;const y=(0,U.UH)();if(a?.limit===1&&a?.path==null)return this.getCommitsCoreSingle(n,s,i,u);try{const x=`query getCommits(
	$owner: String!
	$repo: String!
	$ref: String!
	$path: String
	$author: CommitAuthor
	$after: String
	$before: String
	$limit: Int = 100
	$since: GitTimestamp
	$until: GitTimestamp
) {
	viewer { name }
	repository(name: $repo, owner: $owner) {
		object(expression: $ref) {
			... on Commit {
				history(first: $limit, author: $author, path: $path, after: $after, before: $before, since: $since, until: $until) {
					pageInfo {
						startCursor
						endCursor
						hasNextPage
						hasPreviousPage
					}
					nodes {
						... on Commit {
							oid
							message
							parents(first: 3) { nodes { oid } }
							additions
							changedFiles
							deletions
							author {
								avatarUrl
								date
								email
								name
							}
							committer {
								 date
								 email
								 name
							 }
						}
					}
				}
			}
		}
	}
}`;let N;if(a?.authors!=null)if(a.authors.length===1){const[ee]=a.authors;N={id:ee.id,emails:ee.email?[ee.email]:void 0}}else{const ee=a.authors.filter(le=>le.email).map(le=>le.email);N=ee.length?{emails:ee}:void 0}const z=await this.graphql(void 0,n,x,{owner:s,repo:i,ref:u,after:a?.after,before:a?.before,path:a?.path,author:N,limit:Math.min(100,a?.limit??100),since:typeof a?.since=="string"?a?.since:(l=a?.since)==null?void 0:l.toISOString(),until:typeof a?.until=="string"?a?.until:(m=a?.until)==null?void 0:m.toISOString()},y),O=(p=(f=z?.repository)==null?void 0:f.object)==null?void 0:p.history;return O==null?Se:{paging:O.pageInfo.endCursor!=null?{cursor:O.pageInfo.endCursor??void 0,more:O.pageInfo.hasNextPage}:void 0,values:O.nodes,viewer:z?.viewer.name}}catch(x){if(x instanceof $.Ww)return Se;throw this.handleException(x,void 0,y)}}async getCommitsCoreSingle(n,s,i,u){var a;const l=(0,U.UH)();try{const m=`query getCommit(
	$owner: String!
	$repo: String!
	$ref: String!
) {
	viewer { name }
	repository(name: $repo owner: $owner) {
		object(expression: $ref) {
			...on Commit {
				oid
				parents(first: 3) { nodes { oid } }
				message
				additions
				changedFiles
				deletions
				author {
					avatarUrl
					date
					email
					name
				}
				committer {
					date
					email
					name
				}
			}
		}
	}
}`,f=await this.graphql(void 0,n,m,{owner:s,repo:i,ref:u},l);if(f==null)return Se;const p=(a=f.repository)==null?void 0:a.object;return p!=null?{values:[p],viewer:f.viewer.name}:Se}catch(m){if(m instanceof $.Ww)return Se;throw this.handleException(m,void 0,l)}}async getCommitRefs(n,s,i,u,a){var l,m;const f=(0,U.UH)();try{const p=`query getCommitRefs(
	$owner: String!
	$repo: String!
	$ref: String!
	$after: String
	$before: String
	$first: Int
	$last: Int
	$path: String
	$since: GitTimestamp
	$until: GitTimestamp
) {
	repository(name: $repo, owner: $owner) {
		object(expression: $ref) {
			... on Commit {
				history(first: $first, last: $last, path: $path, since: $since, until: $until, after: $after, before: $before) {
					pageInfo { startCursor, endCursor, hasNextPage, hasPreviousPage }
					totalCount
					nodes { oid }
				}
			}
		}
	}
}`,y=await this.graphql(void 0,n,p,{owner:s,repo:i,ref:u,path:a?.path,first:a?.first,last:a?.last,after:a?.after,before:a?.before,since:a?.since,until:a?.until},f),x=(m=(l=y?.repository)==null?void 0:l.object)==null?void 0:m.history;return x==null?void 0:{pageInfo:x.pageInfo,totalCount:x.totalCount,values:x.nodes}}catch(p){if(p instanceof $.Ww)return;throw this.handleException(p,void 0,f)}}async getNextCommitRefs(n,s,i,u,a,l){const m=await this.getCommitDate(n,s,i,l);if(m==null)return[];let f=await this.getCommitRefs(n,s,i,u,{path:a,first:1,since:m});if(f==null)return[];const p=`${f.pageInfo.startCursor.split(" ",1)[0]} ${f.totalCount}`;let y;if([,y]=p.split(" ",2),y=Math.min(parseInt(y,10),5),f=await this.getCommitRefs(n,s,i,u,{path:a,last:y,before:p}),f==null)return[];const x=[];for(const{oid:N}of f.values){if(N===l)break;x.push(N)}return x.reverse()}async getCommitDate(n,s,i,u){var a,l;const m=(0,U.UH)();try{const f=`query getCommitDate(
	$owner: String!
	$repo: String!
	$sha: GitObjectID!
) {
	repository(name: $repo, owner: $owner) {
		object(oid: $sha) {
			... on Commit { committer { date } }
		}
	}
}`,p=await this.graphql(void 0,n,f,{owner:s,repo:i,sha:u},m);return(l=(a=p?.repository)==null?void 0:a.object)==null?void 0:l.committer.date}catch(f){if(f instanceof $.Ww)return;throw this.handleException(f,void 0,m)}}async getContributors(n,s,i){const u=(0,U.UH)();try{const a=await this.request(void 0,n,"GET /repos/{owner}/{repo}/contributors",{owner:s,repo:i,per_page:100},u);return a?.data==null?[]:a.data}catch(a){if(a instanceof $.Ww)return[];throw this.handleException(a,void 0,u)}}async getDefaultBranchName(n,s,i){var u,a;const l=(0,U.UH)();try{const m=`query getDefaultBranch(
	$owner: String!
	$repo: String!
) {
	repository(owner: $owner, name: $repo) {
		defaultBranchRef {
			name
		}
	}
}`,f=await this.graphql(void 0,n,m,{owner:s,repo:i},l);return f==null?void 0:((a=(u=f.repository)==null?void 0:u.defaultBranchRef)==null?void 0:a.name)??void 0}catch(m){if(m instanceof $.Ww)return;throw this.handleException(m,void 0,l)}}async getCurrentUser(n,s,i){var u,a,l,m;const f=(0,U.UH)();try{const p=`query getCurrentUser(
	$owner: String!
	$repo: String!
) {
	viewer { name, email, login, id }
	repository(owner: $owner, name: $repo) { viewerPermission }
}`,y=await this.graphql(void 0,n,p,{owner:s,repo:i},f);return y==null?void 0:{name:(u=y.viewer)==null?void 0:u.name,email:(a=y.viewer)==null?void 0:a.email,username:(l=y.viewer)==null?void 0:l.login,id:(m=y.viewer)==null?void 0:m.id}}catch(p){if(p instanceof $.Ww)return;throw this.handleException(p,void 0,f)}}async getRepositoryVisibility(n,s,i){var u;const a=(0,U.UH)();try{const l=`query getRepositoryVisibility(
	$owner: String!
	$repo: String!
) {
	repository(owner: $owner, name: $repo) {
		visibility
	}
}`,m=await this.graphql(void 0,n,l,{owner:s,repo:i},a);return((u=m?.repository)==null?void 0:u.visibility)==null?void 0:m.repository.visibility==="PUBLIC"?I.q.Public:I.q.Private}catch(l){if(l instanceof $.Ww)return;throw this.handleException(l,void 0,a)}}async getTags(n,s,i,u){var a;const l=(0,U.UH)();try{const m=`query getTags(
	$owner: String!
	$repo: String!
	$tagQuery: String
	$cursor: String
	$limit: Int = 100
) {
	repository(owner: $owner, name: $repo) {
		refs(query: $tagQuery, refPrefix: "refs/tags/", first: $limit, after: $cursor, orderBy: { field: TAG_COMMIT_DATE, direction: DESC }) {
			pageInfo {
				endCursor
				hasNextPage
			}
			nodes {
				name
				target {
					oid
					commitUrl
					...on Commit {
						authoredDate
						committedDate
						message
					}
					...on Tag {
						message
						tagger { date }
					}
				}
			}
		}
	}
}`,f=await this.graphql(void 0,n,m,{owner:s,repo:i,tagQuery:u?.query,cursor:u?.cursor,limit:Math.min(100,u?.limit??100)},l);if(f==null)return Se;const p=(a=f.repository)==null?void 0:a.refs;return p==null?Se:{paging:{cursor:p.pageInfo.endCursor,more:p.pageInfo.hasNextPage},values:p.nodes}}catch(m){if(m instanceof $.Ww)return Se;throw this.handleException(m,void 0,l)}}async resolveReference(n,s,i,u,a){var l,m,f,p,y,x;const N=(0,U.UH)();try{if(!a){const ee=`query resolveReference(
	$owner: String!
	$repo: String!
	$ref: String!
) {
	repository(owner: $owner, name: $repo) {
		object(expression: $ref) {
			oid
		}
	}
}`,le=await this.graphql(void 0,n,ee,{owner:s,repo:i,ref:u},N);return((m=(l=le?.repository)==null?void 0:l.object)==null?void 0:m.oid)??void 0}const z=`query resolveReference(
	$owner: String!
	$repo: String!
	$ref: String!
	$path: String!
) {
	repository(owner: $owner, name: $repo) {
		object(expression: $ref) {
			... on Commit {
				history(first: 1, path: $path) {
					nodes { oid }
				}
			}
		}
	}
}`,O=await this.graphql(void 0,n,z,{owner:s,repo:i,ref:u,path:a},N);return((x=(y=(p=(f=O?.repository)==null?void 0:f.object)==null?void 0:p.history.nodes)==null?void 0:y[0])==null?void 0:x.oid)??void 0}catch(z){if(z instanceof $.Ww)return;throw this.handleException(z,void 0,N)}}async searchCommits(n,s,i){const u=(0,U.UH)(),a=Math.min(100,i?.limit??100);let l,m,f;i?.cursor!=null?([l,m,f]=i.cursor.split(" ",3),l=parseInt(l,10),m=parseInt(m,10),f=parseInt(f,10)):(l=1,m=a,f=0);try{const p=await this.request(void 0,n,"GET /search/commits",{q:s,sort:i?.sort,order:i?.order,per_page:m,page:l},u),y=p?.data;if(y==null||y.items.length===0)return;const x=y.items.map(O=>{var ee,le,Ce,Fe,Ye,Ze,et,tt,rt,nt,it,ot,st;return{oid:O.sha,parents:{nodes:O.parents.map(ut=>({oid:ut.sha}))},message:O.commit.message,author:{avatarUrl:((ee=O.author)==null?void 0:ee.avatar_url)??void 0,date:((le=O.commit.author)==null?void 0:le.date)??((Ce=O.commit.author)==null?void 0:Ce.date)??new Date().toString(),email:((Fe=O.author)==null?void 0:Fe.email)??((Ye=O.commit.author)==null?void 0:Ye.email)??void 0,name:((Ze=O.author)==null?void 0:Ze.name)??((et=O.commit.author)==null?void 0:et.name)??""},committer:{date:((tt=O.commit.committer)==null?void 0:tt.date)??((rt=O.committer)==null?void 0:rt.date)??new Date().toString(),email:((nt=O.committer)==null?void 0:nt.email)??((it=O.commit.committer)==null?void 0:it.email)??void 0,name:((ot=O.committer)==null?void 0:ot.name)??((st=O.commit.committer)==null?void 0:st.name)??""}}}),N=f+y.items.length,z=y.incomplete_results||y.total_count>N;return{pageInfo:{startCursor:`${l} ${m} ${f}`,endCursor:z?`${l+1} ${m} ${N}`:void 0,hasPreviousPage:y.total_count>0&&l>1,hasNextPage:z},totalCount:y.total_count,values:x}}catch(p){if(p instanceof $.Ww)return;throw this.handleException(p,void 0,u)}}async searchCommitShas(n,s,i){const u=(0,U.UH)(),a=Math.min(100,i?.limit??100);let l,m,f;i?.cursor!=null?([l,m,f]=i.cursor.split(" ",3),l=parseInt(l,10),m=parseInt(m,10),f=parseInt(f,10)):(l=1,m=a,f=0);try{const p=await this.request(void 0,n,"GET /search/commits",{q:s,sort:i?.sort,order:i?.order,per_page:m,page:l},u),y=p?.data;if(y==null||y.items.length===0)return;const x=f+y.items.length,N=y.incomplete_results||y.total_count>x;return{pageInfo:{startCursor:`${l} ${m} ${f}`,endCursor:N?`${l+1} ${m} ${x}`:void 0,hasPreviousPage:y.total_count>0&&l>1,hasNextPage:N},totalCount:y.total_count,values:y.items.map(z=>{var O;return{sha:z.sha,authorDate:new Date(z.commit.author.date).getTime(),committerDate:new Date(((O=z.commit.committer)==null?void 0:O.date)??z.commit.author.date).getTime()}})}}catch(p){if(p instanceof $.Ww)return;throw this.handleException(p,void 0,u)}}async getEnterpriseVersion(n,s,i){var u;let a=this._enterpriseVersions.get(s);if(a!=null)return a;if(a===null)return;const l=(0,U.UH)();try{const m=await this.request(n,s,"GET /meta",i,l),f=(u=m?.data)==null?void 0:u.installed_version;a=f?(0,X.mL)(f):null}catch{a=null}return this._enterpriseVersions.set(s,a),a??void 0}octokit(n,s){let i=this._octokits.get(n);if(i==null){let a;if(E.$L){let l=R(function(m,f){if(f.headers!=null){const{"user-agent":p,...y}=f.headers;p&&(f.headers=y)}return(0,L.he)(m,f)},"fetchCore2");var u=l;a=_.defaults({auth:`token ${n}`,request:{fetch:l}})}else a=_.defaults({auth:`token ${n}`,request:{agent:this.proxyAgent}});i=new a(s),this._octokits.set(n,i),(Q.Yd.logLevel===Q.in.Debug||Q.Yd.isDebugging)&&i.hook.wrap("request",async(l,m)=>{const f=new oe.u(`[GITHUB] ${m.method} ${m.url}`,{log:!1});try{return await l(m)}finally{let p;try{if(typeof m.query=="string"){const y=/(^[^({\n]+)/.exec(m.query);p=` ${y?.[1].trim()??m.query}`}}catch{}f.stop({message:p})}})}return i}async graphql(n,s,i,u,a){var l,m,f,p,y;try{return await(0,L.a_)(n?.getIgnoreSSLErrors()??!1,()=>this.octokit(s).graphql(i,u))}catch(x){if(x instanceof Be){switch((m=(l=x.errors)==null?void 0:l[0])==null?void 0:m.type){case"NOT_FOUND":throw new $.Ww(x);case"FORBIDDEN":throw new $._7("github",$.Jx.Forbidden,x);case"RATE_LIMITED":{let N;const z=(f=x.headers)==null?void 0:f["x-ratelimit-reset"];throw z!=null&&(N=parseInt(z,10),Number.isNaN(N)&&(N=void 0)),new $.yx(x,s,N)}}Q.Yd.isDebugging&&q.window.showErrorMessage(`GitHub request failed: ${((y=(p=x.errors)==null?void 0:p[0])==null?void 0:y.message)??x.message}`)}else x instanceof ye?this.handleRequestError(n,s,x,a):Q.Yd.isDebugging&&q.window.showErrorMessage(`GitHub request failed: ${x.message}`);throw x}}async request(n,s,i,u,a){try{return await(0,L.a_)(n?.getIgnoreSSLErrors()??!1,()=>this.octokit(s).request(i,u))}catch(l){throw l instanceof ye?this.handleRequestError(n,s,l,a):Q.Yd.isDebugging&&q.window.showErrorMessage(`GitHub request failed: ${l.message}`),l}}handleRequestError(n,s,i,u){var a,l,m,f,p;switch(i.status){case 404:case 410:case 422:throw new $.Ww(i);case 401:throw new $._7("github",$.Jx.Unauthorized,i);case 403:if(i.message.includes("rate limit")){let y;const x=(l=(a=i.response)==null?void 0:a.headers)==null?void 0:l["x-ratelimit-reset"];throw x!=null&&(y=parseInt(x,10),Number.isNaN(y)&&(y=void 0)),new $.yx(i,s,y)}throw new $._7("github",$.Jx.Forbidden,i);case 500:Q.Yd.error(i,u),i.response!=null&&(n?.trackRequestException(),(0,j.vF)(`${n?.name??"GitHub"} failed to respond and might be experiencing issues.${n?.custom?"":" Please visit the [GitHub status page](https://githubstatus.com) for more information."}`));return;case 502:if(Q.Yd.error(i,u),i.message.includes("timeout")){n?.trackRequestException(),(0,j.s$)(n?.name??"GitHub");return}break;default:if(i.status>=400&&i.status<500)throw new $.Bn(i);break}Q.Yd.error(i,u),Q.Yd.isDebugging&&q.window.showErrorMessage(`GitHub request failed: ${((p=(f=(m=i.response)==null?void 0:m.errors)==null?void 0:f[0])==null?void 0:p.message)??i.message}`)}handleException(n,s,i){return Q.Yd.error(n,i),n instanceof $._7&&this.showAuthenticationErrorMessage(n,s),n}async showAuthenticationErrorMessage(n,s){if(n.reason===$.Jx.Unauthorized||n.reason===$.Jx.Forbidden){const i="Reauthenticate";await q.window.showErrorMessage(`${n.message}. Would you like to try reauthenticating${n.reason===$.Jx.Forbidden?" to provide additional access":""}?`,i)===i&&(await s?.reauthenticate(),this._onDidReauthenticate.fire())}else q.window.showErrorMessage(n.message)}async createEnterpriseAvatarUrl(n,s,i,u,a){a=a??16;const l=await this.getEnterpriseVersion(n,s,{baseUrl:i});if((0,X.L5)(l,">= 3.0.0")){let m;const f=(0,A.at)(u);f!=null&&q.Uri.parse(i).authority===f.authority&&(f.userId!=null?m=`${i}/enterprise/avatars/u/${encodeURIComponent(f.userId)}?s=${a}`:f.login!=null&&(m=`${i}/enterprise/avatars/${encodeURIComponent(f.login)}?s=${a}`)),m==null&&(m=`${i}/enterprise/avatars/u/e?email=${encodeURIComponent(u)}&s=${a}`);const p=await(0,L.a_)(n?.getIgnoreSSLErrors()??!1,()=>(0,L.he)(m,{method:"GET",headers:{Authorization:`Bearer ${s}`}}));if(p.ok){const y=(0,fe.US)(new Uint8Array(await p.arrayBuffer()));return`data:${p.headers.get("content-type")};base64,${y}`}}return`https://avatars.githubusercontent.com/u/e?email=${encodeURIComponent(u)}&s=${a}`}}R(ne,"GitHubApi"),se([(0,U.fF)({args:{0:c=>c.name,1:"<token>"}})],ne.prototype,"getAccountForCommit",1),se([(0,U.fF)({args:{0:c=>c.name,1:"<token>"}})],ne.prototype,"getAccountForEmail",1),se([(0,U.fF)({args:{0:c=>c.name,1:"<token>"}})],ne.prototype,"getDefaultBranch",1),se([(0,U.fF)({args:{0:c=>c.name,1:"<token>"}})],ne.prototype,"getIssueOrPullRequest",1),se([(0,U.fF)({args:{0:c=>c.name,1:"<token>"}})],ne.prototype,"getPullRequestForBranch",1),se([(0,U.fF)({args:{0:c=>c.name,1:"<token>"}})],ne.prototype,"getPullRequestForCommit",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getBlame",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getBranches",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommit",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommitForFile",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommitBranches",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommitCount",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommitOnBranch",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommits",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCommitRefs",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getNextCommitRefs",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getContributors",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getDefaultBranchName",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getCurrentUser",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getRepositoryVisibility",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getTags",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"resolveReference",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"searchCommits",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"searchCommitShas",1),se([(0,U.fF)({args:{0:"<token>"}})],ne.prototype,"getEnterpriseVersion",1);function Je(c){return c?.baseUrl==null||c.baseUrl==="https://api.github.com"}R(Je,"isGitHubDotCom")},3333:(de,ue,S)=>{"use strict";S.r(ue),S.d(ue,{GitHubGitProvider:()=>M});var P=S(9496),Z=S(7267),Y=S(9179),k=S(1045),V=S(313),ae=S(2721),W=S(5396),we=S(6532),ie=S(3497),he=S(5059),ce=S(2324),ge=S(2742),J=S(8031),Ue=S(9735),te=S(3901),Re=S(4905),re=S(3082),Me=S(2804),Ve=S(8991),Ie=S(3492),ke=S(6016),Pe=S(189),qe=S(3969),K=S(2436),Ae=S(5861),w=S(7369),Ee=S(2886),be=S(516),$e=S(680),De=S(8587),Le=S(2378);async function Oe(H){try{const e=P.extensions.getExtension("ms-vscode.remote-repositories")??P.extensions.getExtension("GitHub.remotehub");if(e==null)throw K.Yd.log("GitHub Repositories extension is not installed or enabled"),new W.R5("GitHub Repositories","GitHub.remotehub");return e.isActive?e.exports:await e.activate()}catch(e){if(K.Yd.error(e,"Unable to get required api from the GitHub Repositories extension"),e instanceof W.R5,H)return;throw e}}R(Oe,"getRemoteHubApi");var We=(H=>(H[H.Branch=0]="Branch",H[H.RemoteBranch=1]="RemoteBranch",H[H.Tag=2]="Tag",H[H.Commit=3]="Commit",H))(We||{}),ze=(H=>(H[H.Branch=0]="Branch",H[H.Tag=1]="Tag",H[H.Commit=2]="Commit",H[H.PullRequest=3]="PullRequest",H[H.Tree=4]="Tree",H))(ze||{}),ye=S(8301),je=Object.defineProperty,Qe=Object.getOwnPropertyDescriptor,Ge=R((H,e,r)=>e in H?je(H,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):H[e]=r,"__defNormalProp"),D=R((H,e,r,t)=>{for(var o=t>1?void 0:t?Qe(e,r):e,d=H.length-1,h;d>=0;d--)(h=H[d])&&(o=(t?h(e,r,o):h(o))||o);return t&&o&&je(e,r,o),o},"__decorateClass"),ve=R((H,e,r)=>(Ge(H,typeof e!="symbol"?e+"":e,r),r),"__publicField");const _e=/"/g,xe=Object.freeze({values:[]}),Te=Promise.resolve(void 0),Ne=["repo","read:user","user:email"],Be=/^[^/](?!.*\/\.)(?!.*\.\.)(?!.*\/\/)(?!.*@\{)[^\000-\037\177 ~^:?*[\\]+[^./]$/;class M{constructor(e){this.container=e,ve(this,"descriptor",{id:he.p.GitHub,name:"GitHub",virtual:!0}),ve(this,"supportedSchemes",new Set([k.sN.Virtual,k.sN.GitHub,k.sN.PRs])),ve(this,"_onDidChangeRepository",new P.EventEmitter),ve(this,"_onDidCloseRepository",new P.EventEmitter),ve(this,"_onDidOpenRepository",new P.EventEmitter),ve(this,"_branchesCache",new Map),ve(this,"_repoInfoCache",new Map),ve(this,"_tagsCache",new Map),ve(this,"_disposables",[]),ve(this,"_github"),ve(this,"_remotehub"),ve(this,"_remotehubPromise"),ve(this,"_sessionPromise"),this._disposables.push(P.authentication.onDidChangeSessions(this.onAuthenticationSessionsChanged,this))}get onDidChangeRepository(){return this._onDidChangeRepository.event}get onDidCloseRepository(){return this._onDidCloseRepository.event}get onDidOpenRepository(){return this._onDidOpenRepository.event}dispose(){this._disposables.forEach(e=>void e.dispose())}onAuthenticationSessionsChanged(e){e.provider.id==="github"&&(this._sessionPromise=void 0,this.ensureSession(!1,!0))}onRepositoryChanged(e,r){this._branchesCache.delete(e.path),this._tagsCache.delete(e.path),this._repoInfoCache.delete(e.path),this._onDidChangeRepository.fire(r)}async discoverRepositories(e){if(!this.supportedSchemes.has(e.scheme))return[];try{const{remotehub:r}=await this.ensureRepositoryContext(e.toString(),!0),t=r.getVirtualWorkspaceUri(e);return t==null?[]:this.openRepository(void 0,t,!0)}catch{return[]}}updateContext(){(0,V.v)(k.zf.HasVirtualFolders,this.container.git.hasOpenRepositories(this.descriptor.id))}openRepository(e,r,t,o,d){return[new Ve._j(this.container,this.onRepositoryChanged.bind(this),this.descriptor,e,r,t,o??!P.window.state.focused,d)]}async supports(e){switch(e){case we.A.Stashes:case we.A.Worktrees:return!1;default:return!0}}async visibility(e){const r=await this.getRemotes(e,{sort:!0});if(r.length===0)return he.q.Local;for await(const t of(0,$e.Wx)(r.map(o=>this.getRemoteVisibility(o))))if(t.status==="fulfilled"&&t.value===he.q.Public)return he.q.Public;return he.q.Private}async getRemoteVisibility(e){var r;switch((r=e.provider)==null?void 0:r.id){case"github":{const{github:t,metadata:o,session:d}=await this.ensureRepositoryContext(e.repoPath);return await t.getRepositoryVisibility(d.accessToken,o.repo.owner,o.repo.name)??he.q.Private}default:return he.q.Private}}async getOpenScmRepositories(){return[]}async getScmRepository(e){}async getOrOpenScmRepository(e){}canHandlePathOrUri(e,r){if(this.supportedSchemes.has(e))return typeof r=="string"?r:r.toString()}getAbsoluteUri(e,r){if(typeof r=="string")if((0,be.tE)(r))r=P.Uri.parse(r,!0);else throw P.window.showErrorMessage(`Unable to get absolute uri between ${typeof e=="string"?e:e.toString(!0)} and ${r}; Base path '${r}' must be a uri`),new Error(`Base path '${r}' must be a uri`);if(typeof e=="string"&&!(0,be.tE)(e)){const o=(0,be.AH)(e);if(!(0,be.YP)(o))return P.Uri.joinPath(r,o)}const t=this.getRelativePath(e,r);return P.Uri.joinPath(r,t)}async getBestRevisionUri(e,r,t){return t?this.createProviderUri(e,t,r):this.createVirtualUri(e,t,r)}getRelativePath(e,r){if(typeof r=="string")if((0,be.tE)(r))r=P.Uri.parse(r,!0);else throw P.window.showErrorMessage(`Unable to get relative path between ${typeof e=="string"?e:e.toString(!0)} and ${r}; Base path '${r}' must be a uri`),new Error(`Base path '${r}' must be a uri`);let t;if(typeof e=="string")if((0,be.tE)(e))e=P.Uri.parse(e,!0);else return e=(0,be.AH)(e),t=(0,be.YP)(e)&&e.startsWith(r.path)?e.slice(r.path.length):e,t.charCodeAt(0)===k.mN.Slash&&(t=t.slice(1)),t;return t=(0,be.AH)((0,be.Gf)(r.path.slice(1),e.path.slice(1))),t}getRevisionUri(e,r,t){const o=this.createProviderUri(e,t,r);return t===re.p.deletedOrMissing?o.with({query:"~"}):o}async getWorkingUri(e,r){return this.createVirtualUri(e,void 0,r.path)}async addRemote(e,r,t){}async pruneRemote(e,r){}async applyChangesToWorkingFile(e,r,t){}async branchContainsCommit(e,r,t){return!1}async checkout(e,r,t){}resetCaches(...e){(e.length===0||e.includes("branches"))&&this._branchesCache.clear(),(e.length===0||e.includes("tags"))&&this._tagsCache.clear(),e.length===0&&this._repoInfoCache.clear()}async excludeIgnoredUris(e,r){return r}async fetch(e,r){}async findRepositoryUri(e,r){const t=(0,w.UH)();try{return(await this.ensureRemoteHubApi()).getProviderRootUri(e).with({scheme:k.sN.Virtual})}catch(o){o instanceof W.R5,K.Yd.error(o,t);return}}async getAheadBehindCommitCount(e,r){}async getBlame(e,r){const t=(0,w.UH)();if(r?.isDirty)return;let o="blame";e.sha!=null&&(o+=`:${e.sha}`);const d=await this.container.tracker.getOrAdd(e);if(d.state!=null){const v=d.state.getBlame(o);if(v!=null)return K.Yd.debug(t,`Cache hit: '${o}'`),v.item}K.Yd.debug(t,`Cache miss: '${o}'`),d.state==null&&(d.state=new Le.p2);const h=this.getBlameCore(e,d,o,t);if(d.state!=null){K.Yd.debug(t,`Cache add: '${o}'`);const v={item:h};d.state.setBlame(o,v)}return h}async getBlameCore(e,r,t,o){var d,h;try{const v=await this.ensureRepositoryContext(e.repoPath);if(v==null)return;const{metadata:g,github:b,remotehub:C,session:T}=v,F=C.getVirtualUri(C.getProviderRootUri(e)),_=this.getRelativePath(e,F);if(e.scheme===k.sN.Virtual){const[G,A]=await Promise.allSettled([P.workspace.fs.stat(e),P.workspace.fs.stat(e.with({scheme:k.sN.GitHub}))]);if(G.status!=="fulfilled"||A.status!=="fulfilled"||G.value.mtime!==A.value.mtime)return}const q=!e.sha||e.sha==="HEAD"?(await g.getRevision()).revision:e.sha,L=await b.getBlame(T.accessToken,g.repo.owner,g.repo.name,q,_),E=new Map,B=new Map,$=[];for(const G of L.ranges){const A=G.commit,{viewer:Q=T.account.label}=L,j=Q!=null&&A.author.name===Q?"You":A.author.name,U=Q!=null&&A.committer.name===Q?"You":A.committer.name;let oe=E.get(j);oe==null&&(oe={name:j,lineCount:0},E.set(j,oe)),oe.lineCount+=G.endingLine-G.startingLine+1;let fe=B.get(A.oid);fe==null&&(fe=new J.aM(this.container,e.repoPath,A.oid,new J._j(j,A.author.email,new Date(A.author.date),A.author.avatarUrl),new J._j(U,A.committer.email,new Date(A.author.date)),A.message.split(`
`,1)[0],(d=A.parents.nodes[0])!=null&&d.oid?[(h=A.parents.nodes[0])==null?void 0:h.oid]:[],A.message,new te.K8(F.toString(),_,te.NV.Modified),{changedFiles:A.changedFiles??0,additions:A.additions??0,deletions:A.deletions??0},[]),B.set(A.oid,fe));for(let X=G.startingLine;X<=G.endingLine;X++){const me={sha:A.oid,originalLine:X,line:X};fe.lines.push(me),$[X-1]=me}}const I=new Map([...E.entries()].sort((G,A)=>A[1].lineCount-G[1].lineCount));return{repoPath:e.repoPath,authors:I,commits:B,lines:$}}catch(v){if(r.state!=null&&!String(v).includes("No provider registered with")){const g=v?.toString()??"";K.Yd.debug(o,`Cache replace (with empty promise): '${t}'`);const b={item:Te,errorMessage:g};return r.state.setBlame(t,b),r.setBlameFailure(),Te}return}}async getBlameContents(e,r){}async getBlameForLine(e,r,t,o){var d,h;const v=(0,w.UH)();if(!t?.isDirty){if(!o?.forceSingleLine){const g=await this.getBlame(e);if(g==null)return;let b=g.lines[r];if(b==null){if(g.lines.length!==r)return;b=g.lines[r-1]}const C=g.commits.get(b.sha);return C==null?void 0:{author:{...g.authors.get(C.author.name),lineCount:C.lines.length},commit:C,line:b}}try{const g=await this.ensureRepositoryContext(e.repoPath);if(g==null)return;const{metadata:b,github:C,remotehub:T,session:F}=g,_=T.getVirtualUri(T.getProviderRootUri(e)),q=this.getRelativePath(e,_),L=!e.sha||e.sha==="HEAD"?(await b.getRevision()).revision:e.sha,E=await C.getBlame(F.accessToken,b.repo.owner,b.repo.name,L,q),B=r+1,$=E.ranges.find(U=>U.startingLine===B);if($==null)return;const I=$.commit,{viewer:G=F.account.label}=E,A=G!=null&&I.author.name===G?"You":I.author.name,Q=G!=null&&I.committer.name===G?"You":I.committer.name,j=new J.aM(this.container,e.repoPath,I.oid,new J._j(A,I.author.email,new Date(I.author.date),I.author.avatarUrl),new J._j(Q,I.committer.email,new Date(I.author.date)),I.message.split(`
`,1)[0],(d=I.parents.nodes[0])!=null&&d.oid?[(h=I.parents.nodes[0])==null?void 0:h.oid]:[],I.message,new te.K8(_.toString(),q,te.NV.Modified),{changedFiles:I.changedFiles??0,additions:I.additions??0,deletions:I.deletions??0},[]);for(let U=$.startingLine;U<=$.endingLine;U++){const oe={sha:I.oid,originalLine:U,line:U};j.lines.push(oe)}return{author:{name:A,lineCount:$.endingLine-$.startingLine+1},commit:j,line:{sha:I.oid,originalLine:$.startingLine,line:$.startingLine}}}catch(g){K.Yd.error(v,g);return}}}async getBlameForLineContents(e,r,t,o){}async getBlameForRange(e,r){const t=await this.getBlame(e);if(t!=null)return this.getBlameRange(t,e,r)}async getBlameForRangeContents(e,r,t){const o=await this.getBlameContents(e,t);if(o!=null)return this.getBlameRange(o,e,r)}getBlameRange(e,r,t){if(e.lines.length===0)return{allLines:e.lines,...e};if(t.start.line===0&&t.end.line===e.lines.length-1)return{allLines:e.lines,...e};const o=e.lines.slice(t.start.line,t.end.line+1),d=new Set(o.map(T=>T.sha)),h=t.start.line+1,v=t.end.line+1,g=new Map,b=new Map;for(const T of e.commits.values()){if(!d.has(T.sha))continue;const F=T.with({lines:T.lines.filter(q=>q.line>=h&&q.line<=v)});b.set(T.sha,F);let _=g.get(F.author.name);_==null&&(_={name:F.author.name,lineCount:0},g.set(_.name,_)),_.lineCount+=F.lines.length}const C=new Map([...g.entries()].sort((T,F)=>F[1].lineCount-T[1].lineCount));return{repoPath:r.repoPath,authors:C,commits:b,lines:o,allLines:e.lines}}async getBranch(e){const{values:[r]}=await this.getBranches(e,{filter:t=>t.current});return r}async getBranches(e,r){if(e==null)return xe;const t=(0,w.UH)();let o=r?.cursor?void 0:this._branchesCache.get(e);if(o==null){async function h(){var v;try{const{metadata:g,github:b,session:C}=await this.ensureRepositoryContext(e),T=await g.getRevision(),F=T.type===0?T.name:void 0,_=[];let q=r?.cursor;const L=q==null;for(;;){const E=await b.getBranches(C.accessToken,g.repo.owner,g.repo.name,{cursor:q});for(const B of E.values){const $=new Date(Y.DN.get("advanced.commitOrdering")==="author-date"?B.target.authoredDate:B.target.committedDate),I=B.target.oid;_.push(new ge.XI(e,B.name,!1,B.name===F,$,I,{name:`origin/${B.name}`,missing:!1}),new ge.XI(e,`origin/${B.name}`,!0,!1,$,I))}if(!((v=E.paging)!=null&&v.more)||!L)return{...E,values:_};q=E.paging.cursor}}catch(g){return K.Yd.error(g,t),this._branchesCache.delete(e),xe}}R(h,"load"),o=h.call(this),r?.cursor==null&&this._branchesCache.set(e,o)}let d=await o;return r?.filter!=null&&(d={...d,values:d.values.filter(r.filter)}),r?.sort!=null&&(0,ge.YF)(d.values,typeof r.sort=="boolean"?void 0:r.sort),d}async getChangedFilesCount(e,r){if(!r)return;const t=await this.getCommit(e,r);if(t?.stats==null)return;const{stats:o}=t,d=typeof o.changedFiles=="number"?o.changedFiles:o.changedFiles.added+o.changedFiles.changed+o.changedFiles.deleted;return{additions:o.additions,deletions:o.deletions,changedFiles:d}}async getCommit(e,r){var t;if(e==null)return;const o=(0,w.UH)();try{const{metadata:d,github:h,session:v}=await this.ensureRepositoryContext(e),g=await h.getCommit(v.accessToken,d.repo.owner,d.repo.name,r);if(g==null)return;const{viewer:b=v.account.label}=g,C=b!=null&&g.author.name===b?"You":g.author.name,T=b!=null&&g.committer.name===b?"You":g.committer.name;return new J.aM(this.container,e,g.oid,new J._j(C,g.author.email,new Date(g.author.date),g.author.avatarUrl),new J._j(T,g.committer.email,new Date(g.committer.date)),g.message.split(`
`,1)[0],g.parents.nodes.map(F=>F.oid),g.message,((t=g.files)==null?void 0:t.map(F=>new te.K8(e,F.filename??"",(0,ye.fromCommitFileStatus)(F.status)??te.NV.Modified,F.previous_filename,void 0,{additions:F.additions??0,deletions:F.deletions??0,changes:F.changes??0})))??[],{changedFiles:g.changedFiles??0,additions:g.additions??0,deletions:g.deletions??0},[])}catch(d){K.Yd.error(d,o);return}}async getCommitBranches(e,r,t){if(e==null||t?.commitDate==null)return[];const o=(0,w.UH)();try{const{metadata:d,github:h,session:v}=await this.ensureRepositoryContext(e);let g;return t?.branch?g=await h.getCommitOnBranch(v.accessToken,d.repo.owner,d.repo.name,t?.branch,r,t?.commitDate):g=await h.getCommitBranches(v.accessToken,d.repo.owner,d.repo.name,r,t?.commitDate),g}catch(d){return K.Yd.error(d,o),[]}}async getCommitCount(e,r){if(e==null)return;const t=(0,w.UH)();try{const{metadata:o,github:d,session:h}=await this.ensureRepositoryContext(e);return await d.getCommitCount(h?.accessToken,o.repo.owner,o.repo.name,r)}catch(o){K.Yd.error(o,t);return}}async getCommitForFile(e,r,t){var o;if(e==null)return;const d=(0,w.UH)();try{const{metadata:h,github:v,remotehub:g,session:b}=await this.ensureRepositoryContext(e),C=this.getRelativePath(r,g.getProviderRootUri(r)),T=!t?.ref||t.ref==="HEAD"?(await h.getRevision()).revision:t.ref,F=await v.getCommitForFile(b.accessToken,h.repo.owner,h.repo.name,T,C);if(F==null)return;const{viewer:_=b.account.label}=F,q=_!=null&&F.author.name===_?"You":F.author.name,L=_!=null&&F.committer.name===_?"You":F.committer.name,E=(o=F.files)==null?void 0:o.map($=>new te.K8(e,$.filename??"",(0,ye.fromCommitFileStatus)($.status)??te.NV.Modified,$.previous_filename,void 0,{additions:$.additions??0,deletions:$.deletions??0,changes:$.changes??0})),B=E?.find($=>$.path===C);return new J.aM(this.container,e,F.oid,new J._j(q,F.author.email,new Date(F.author.date),F.author.avatarUrl),new J._j(L,F.committer.email,new Date(F.committer.date)),F.message.split(`
`,1)[0],F.parents.nodes.map($=>$.oid),F.message,{file:B,files:E},{changedFiles:F.changedFiles??0,additions:F.additions??0,deletions:F.deletions??0},[])}catch(h){K.Yd.error(h,d);return}}async getCommitsForGraph(e,r,t){var o,d;const h=t?.limit??Y.DN.get("graph.defaultItemLimit")??5e3,v=Y.DN.get("graph.commitOrdering",void 0,"date"),g=Y.DN.get("graph.avatars",void 0,!0),[b,C,T,F,_]=await Promise.allSettled([this.getLog(e,{all:!0,ordering:v,limit:h}),this.getBranch(e),this.getRemotes(e),this.getTags(e),this.getCurrentUser(e)]),q=new Map,L=new Set;return this.getCommitsForGraphCore(e,r,(0,$e.Sb)(b),(0,$e.Sb)(C),(o=(0,$e.Sb)(T))==null?void 0:o[0],(d=(0,$e.Sb)(F))==null?void 0:d.values,(0,$e.Sb)(_),q,L,{...t,useAvatars:g})}async getCommitsForGraphCore(e,r,t,o,d,h,v,g,b,C){var T,F,_,q,L;const E=o!=null?new Map([[o.name,o]]):new Map,B=d!=null?new Map([[d.name,d]]):new Map;if(t==null)return{repoPath:e,avatars:g,ids:b,branches:E,remotes:B,rows:[]};const $=(F=((T=t.pagedCommits)==null?void 0:T.call(t))??t.commits)==null?void 0:F.values();if($==null)return{repoPath:e,avatars:g,ids:b,branches:E,remotes:B,rows:[]};const I=[];let G=!1,A=!1,Q,j,U,oe;const fe=o?.sha!=null&&d!=null;for(const X of $){if(b.add(X.sha),G=X.sha===o?.sha,fe&&G?(Q=[{id:(0,ge.Vx)(e,!1,o.name),name:o.name,isCurrentHead:!0,context:(0,De.BH)({webviewItem:`gitlens:branch${G?"+current":""}${o?.upstream!=null?"+tracking":""}`,webviewItemValue:{type:"branch",ref:re.W.create(o.name,e,{refType:"branch",name:o.name,remote:!1,upstream:o.upstream})}})}],j=[{id:(0,ge.Vx)(e,!0,o.name),name:o.name,owner:d.name,url:d.url,avatarUrl:(q=(C?.useAvatars?(_=d.provider)==null?void 0:_.avatarUri:void 0)??(0,Me.dM)(this.container,d,r))==null?void 0:q.toString(!0),context:(0,De.BH)({webviewItem:"gitlens:branch+remote",webviewItemValue:{type:"branch",ref:re.W.create(o.name,e,{refType:"branch",name:o.name,remote:!0,upstream:{name:d.name,missing:!1}})}})}]):(Q=[],j=[]),h!=null?U=[...(0,Ee.DZ)(h,me=>{if(me.sha===X.sha)return{id:me.id,name:me.name,annotated:Boolean(me.message),context:(0,De.BH)({webviewItem:"gitlens:tag",webviewItemValue:{type:"tag",ref:re.W.create(me.name,e,{refType:"tag",name:me.name})}})}})]:U=[],X.author.email&&!g.has(X.author.email)){const me=X.getCachedAvatarUri();me!=null&&g.set(X.author.email,me.toString(!0))}A=X.author.name==="You",oe={row:(0,De.BH)({webviewItem:`gitlens:commit${fe&&X.sha===o.sha?"+HEAD":""}+current`,webviewItemValue:{type:"commit",ref:re.W.create(X.sha,e,{refType:"revision",message:X.message})}}),avatar:(0,De.BH)({webviewItem:`gitlens:contributor${A?"+current":""}`,webviewItemValue:{type:"contributor",repoPath:e,name:A&&v?.name!=null?v.name:X.author.name,email:X.author.email,current:A}})},I.push({sha:X.sha,parents:X.parents,author:X.author.name,email:X.author.email??"",date:X.committer.date.getTime(),message:(0,ae.X)(X.message&&String(X.message).length?X.message:X.summary),type:X.parents.length>1?Re.e.MergeCommit:Re.e.Commit,heads:Q,remotes:j,tags:U,contexts:oe})}return C?.ref==="HEAD"?C.ref=(L=(0,Ee.Ps)(t.commits.values()))==null?void 0:L.sha:C?.ref!=null&&(C.ref=void 0),{repoPath:e,avatars:g,ids:b,branches:E,remotes:B,rows:I,id:C?.ref,paging:{limit:t.limit,startingCursor:t.startingCursor,hasMore:t.hasMore},more:async X=>{var me;const pe=await((me=t.more)==null?void 0:me.call(t,X));return this.getCommitsForGraphCore(e,r,pe,o,d,h,v,g,b,C)}}}async getOldestUnpushedRefForFile(e,r){}async getContributors(e,r){if(e==null)return[];const t=(0,w.UH)();try{const{metadata:o,github:d,session:h}=await this.ensureRepositoryContext(e),v=await d.getContributors(h.accessToken,o.repo.owner,o.repo.name),g=await this.getCurrentUser(e),b=[];for(const C of v)C.type==="User"&&b.push(new Ue.V(e,C.name,C.email,C.contributions,void 0,(0,ke.o)(g,C.name,C.email,C.login),void 0,C.login,C.avatar_url,C.node_id));return b}catch(o){return K.Yd.error(o,t),[]}}async getCurrentUser(e){if(!e)return;const r=(0,w.UH)(),t=this._repoInfoCache.get(e);let o=t?.user;if(o!=null)return o;if(o!==null)try{const{metadata:d,github:h,session:v}=await this.ensureRepositoryContext(e);return o=await h.getCurrentUser(v.accessToken,d.repo.owner,d.repo.name),this._repoInfoCache.set(e,{...t,user:o??null}),o}catch(d){K.Yd.error(d,r),this._repoInfoCache.set(e,{...t,user:null});return}}async getDefaultBranchName(e,r){if(e==null)return;const t=(0,w.UH)();try{const{metadata:o,github:d,session:h}=await this.ensureRepositoryContext(e);return await d.getDefaultBranchName(h.accessToken,o.repo.owner,o.repo.name)}catch(o){K.Yd.error(o,t);return}}async getDiffForFile(e,r,t){}async getDiffForFileContents(e,r,t){}async getDiffForLine(e,r,t,o){}async getDiffStatus(e,r,t,o){}async getFileStatusForCommit(e,r,t){if(t===re.p.deletedOrMissing||re.p.isUncommitted(t))return;const o=await this.getCommitForFile(e,r,{ref:t});if(o!=null)return o.findFile(r)}async getLastFetchedTimestamp(e){}async getLog(e,r){var t,o,d;if(e==null)return;const h=(0,w.UH)(),v=this.getPagingLimit(r?.limit);try{const{metadata:g,github:b,session:C}=await this.ensureRepositoryContext(e),T=!r?.ref||r.ref==="HEAD"?(await g.getRevision()).revision:r.ref,F=await b.getCommits(C.accessToken,g.repo.owner,g.repo.name,T,{all:r?.all,authors:r?.authors,after:r?.cursor,limit:v,since:r?.since?new Date(r.since):void 0}),_=new Map,{viewer:q=C.account.label}=F;for(const E of F.values){const B=q!=null&&E.author.name===q?"You":E.author.name,$=q!=null&&E.committer.name===q?"You":E.committer.name;let I=_.get(E.oid);I==null&&(I=new J.aM(this.container,e,E.oid,new J._j(B,E.author.email,new Date(E.author.date),E.author.avatarUrl),new J._j($,E.committer.email,new Date(E.committer.date)),E.message.split(`
`,1)[0],E.parents.nodes.map(G=>G.oid),E.message,(t=E.files)==null?void 0:t.map(G=>new te.K8(e,G.filename??"",(0,ye.fromCommitFileStatus)(G.status)??te.NV.Modified,G.previous_filename,void 0,{additions:G.additions??0,deletions:G.deletions??0,changes:G.changes??0})),{changedFiles:E.changedFiles??0,additions:E.additions??0,deletions:E.deletions??0},[]),_.set(E.oid,I))}const L={repoPath:e,commits:_,sha:T,range:void 0,count:_.size,limit:v,hasMore:((o=F.paging)==null?void 0:o.more)??!1,endingCursor:(d=F.paging)==null?void 0:d.cursor,query:E=>this.getLog(e,{...r,limit:E})};return L.hasMore&&(L.more=this.getLogMoreFn(L,r)),L}catch(g){K.Yd.error(g,h);return}}async getLogRefsOnly(e,r){const t=await this.getLog(e,r);if(t!=null)return new Set([...t.commits.values()].map(o=>o.ref))}getLogMoreFn(e,r){return async t=>{var o;const d=t!=null&&typeof t=="object"?t.until:void 0;let h=typeof t=="number"?t:void 0;if(d&&(0,Ee.G)(e.commits.values(),C=>C.ref===d))return e;h=this.getPagingLimit(h);const v=await this.getLog(e.repoPath,{...r,limit:h,cursor:e.endingCursor});if(v==null)return{...e,hasMore:!1,more:void 0};const g=new Map([...e.commits,...v.commits]),b={repoPath:e.repoPath,commits:g,sha:e.sha,range:void 0,count:g.size,limit:d==null?(e.limit??0)+h:void 0,hasMore:d==null?v.hasMore:!0,startingCursor:(o=(0,Ee.Z$)(e.commits))==null?void 0:o[0],endingCursor:v.endingCursor,pagedCommits:()=>{for(const C of e.commits.keys())v.commits.delete(C);return v.commits},query:e.query};return b.hasMore&&(b.more=this.getLogMoreFn(b,r)),b}}async getLogForFile(e,r,t){if(e==null)return;const o=(0,w.UH)(),d=this.getRelativePath(r,e);if(e!=null&&e===d)throw new Error(`File name cannot match the repository path; path=${d}`);t={reverse:!1,...t},t.renames=!1,t.all=!1;let h="log";t.ref!=null&&(h+=`:${t.ref}`),t.limit=this.getPagingLimit(t?.limit),t.limit&&(h+=`:n${t.limit}`),t.renames&&(h+=":follow"),t.reverse&&(h+=":reverse"),t.since&&(h+=`:since=${t.since}`),t.skip&&(h+=`:skip${t.skip}`),t.cursor&&(h+=`:cursor=${t.cursor}`);const v=await this.container.tracker.getOrAdd(ce.YY.fromFile(d,e,t.ref));if(!t.force&&t.range==null){if(v.state!=null){const b=v.state.getLog(h);if(b!=null)return K.Yd.debug(o,`Cache hit: '${h}'`),b.item;if(t.ref!=null||t.limit!=null){const C=v.state.getLog(`log${t.renames?":follow":""}${t.reverse?":reverse":""}`);if(C!=null){if(t.ref==null)return K.Yd.debug(o,`Cache hit: ~'${h}'`),C.item;K.Yd.debug(o,`Cache ?: '${h}'`);let T=await C.item;if(T!=null&&!T.hasMore&&T.commits.has(t.ref)){K.Yd.debug(o,`Cache hit: '${h}'`);let F=!0,_=0;const q=new Map((0,Ee.DZ)(T.commits.entries(),([E,B])=>{if(F){if(E!==t?.ref)return;F=!1}if(_++,!(t?.limit!=null&&_>t.limit))return[E,B]})),L={...t};return T={...T,limit:t.limit,count:q.size,commits:q,query:E=>this.getLogForFile(e,r,{...L,limit:E})},T}}}}K.Yd.debug(o,`Cache miss: '${h}'`),v.state==null&&(v.state=new Le.p2)}const g=this.getLogForFileCore(e,d,v,h,o,t);if(v.state!=null&&t.range==null){K.Yd.debug(o,`Cache add: '${h}'`);const b={item:g};v.state.setLog(h,b)}return g}async getLogForFileCore(e,r,t,o,d,h){var v,g,b;if(e==null)return;const C=this.getPagingLimit(h?.limit);try{const T=await this.ensureRepositoryContext(e);if(T==null)return;const{metadata:F,github:_,remotehub:q,session:L}=T,E=this.getAbsoluteUri(r,e),B=this.getRelativePath(E,q.getProviderRootUri(E)),$=!h?.ref||h.ref==="HEAD"?(await F.getRevision()).revision:h.ref,I=await _.getCommits(L.accessToken,F.repo.owner,F.repo.name,$,{all:h?.all,after:h?.cursor,path:B,limit:C,since:h?.since?new Date(h.since):void 0}),G=new Map,{viewer:A=L.account.label}=I;for(const j of I.values){const U=A!=null&&j.author.name===A?"You":j.author.name,oe=A!=null&&j.committer.name===A?"You":j.committer.name;let fe=G.get(j.oid);if(fe==null){const X=(v=j.files)==null?void 0:v.map(pe=>new te.K8(e,pe.filename??"",(0,ye.fromCommitFileStatus)(pe.status)??te.NV.Modified,pe.previous_filename,void 0,{additions:pe.additions??0,deletions:pe.deletions??0,changes:pe.changes??0})),me=(0,be.Mh)(B)?void 0:X?.find(pe=>pe.path===B)??new te.K8(e,B,te.NV.Modified,void 0,void 0,j.changedFiles===1?{additions:j.additions??0,deletions:j.deletions??0,changes:0}:void 0);fe=new J.aM(this.container,e,j.oid,new J._j(U,j.author.email,new Date(j.author.date),j.author.avatarUrl),new J._j(oe,j.committer.email,new Date(j.committer.date)),j.message.split(`
`,1)[0],j.parents.nodes.map(pe=>pe.oid),j.message,{file:me,files:X},{changedFiles:j.changedFiles??0,additions:j.additions??0,deletions:j.deletions??0},[]),G.set(j.oid,fe)}}const Q={repoPath:e,commits:G,sha:$,range:void 0,count:G.size,limit:C,hasMore:((g=I.paging)==null?void 0:g.more)??!1,endingCursor:(b=I.paging)==null?void 0:b.cursor,query:j=>this.getLogForFile(e,r,{...h,limit:j})};return Q.hasMore&&(Q.more=this.getLogForFileMoreFn(Q,r,h)),Q}catch(T){if(t.state!=null&&h?.range==null&&!h?.reverse){const F=T?.toString()??"";K.Yd.debug(d,`Cache replace (with empty promise): '${o}'`);const _={item:Te,errorMessage:F};return t.state.setLog(o,_),Te}return}}getLogForFileMoreFn(e,r,t){return async o=>{const d=o!=null&&typeof o=="object"?o.until:void 0;let h=typeof o=="number"?o:void 0;if(d&&(0,Ee.G)(e.commits.values(),C=>C.ref===d))return e;h=this.getPagingLimit(h);const v=await this.getLogForFile(e.repoPath,r,{...t,limit:d==null?h:0,cursor:e.endingCursor});if(v==null)return{...e,hasMore:!1,more:void 0};const g=new Map([...e.commits,...v.commits]),b={repoPath:e.repoPath,commits:g,sha:e.sha,range:e.range,count:g.size,limit:d==null?(e.limit??0)+h:void 0,hasMore:d==null?v.hasMore:!0,endingCursor:v.endingCursor,query:e.query};return b.hasMore&&(b.more=this.getLogForFileMoreFn(b,r,t)),b}}async getMergeBase(e,r,t,o){}async getMergeStatus(e){}async getRebaseStatus(e){}async getNextComparisonUris(e,r,t,o=0){if(!t)return;const d=(0,w.UH)();try{const h=await this.ensureRepositoryContext(e);if(h==null)return;const{metadata:v,github:g,remotehub:b,session:C}=h,T=this.getRelativePath(r,b.getProviderRootUri(r)),F=(await v.getRevision()).revision;t==="HEAD"&&(t=F);const _=await g.getNextCommitRefs(C.accessToken,v.repo.owner,v.repo.name,F,T,t);return{current:o===0?ce.YY.fromFile(T,e,t):new ce.YY(await this.getBestRevisionUri(e,T,_[o-1])),next:new ce.YY(await this.getBestRevisionUri(e,T,_[o]))}}catch(h){throw K.Yd.error(h,d),h}}async getPreviousComparisonUris(e,r,t,o=0,d=!1){var h,v;if(t===re.p.deletedOrMissing)return;const g=(0,w.UH)();t===re.p.uncommitted&&(t=void 0);try{const b=await this.ensureRepositoryContext(e);if(b==null)return;const{metadata:C,github:T,remotehub:F,session:_}=b,q=this.getRelativePath(r,F.getProviderRootUri(r)),L=t!=null?1:0,E=await T.getCommitRefs(_.accessToken,C.repo.owner,C.repo.name,!t||t==="HEAD"?(await C.getRevision()).revision:t,{path:q,first:L+o+1});if(E==null)return;const B=o===0?ce.YY.fromFile(q,e,t):new ce.YY(await this.getBestRevisionUri(e,q,((h=E.values[L+o-1])==null?void 0:h.oid)??re.p.deletedOrMissing));return B==null||B.sha===re.p.deletedOrMissing?void 0:{current:B,previous:new ce.YY(await this.getBestRevisionUri(e,q,((v=E.values[L+o])==null?void 0:v.oid)??re.p.deletedOrMissing))}}catch(b){throw K.Yd.error(b,g),b}}async getPreviousComparisonUrisForLine(e,r,t,o,d=0){var h,v;if(o===re.p.deletedOrMissing)return;const g=(0,w.UH)();try{const b=await this.ensureRepositoryContext(e);if(b==null)return;const{remotehub:C}=b;let T=this.getRelativePath(r,C.getProviderRootUri(r)),F=ce.YY.fromFile(T,e,o),_=t,q,L=t,E=t;for(let B=0;B<Math.max(0,d)+2;B++){const $=await this.getBlameForLine(q??F,E,void 0,{forceSingleLine:!0});if($==null)break;o=$.commit.sha,T=((h=$.commit.file)==null?void 0:h.path)??((v=$.commit.file)==null?void 0:v.originalPath)??T,E=$.line.originalLine-1;const I=ce.YY.fromFile(T,e,o);q==null?(q=I,L=E):(F=q,_=L,q=I,L=E)}return F==null?void 0:{current:F,previous:q,line:(_??t)+1}}catch(b){throw K.Yd.error(b,g),b}}async getIncomingActivity(e,r){}async getRemotes(e,r){if(e==null)return[];const t=r?.providers??(0,Pe.v)(Y.DN.get("remotes",null)),o=P.Uri.parse(e,!0),[,d,h]=o.path.split("/",3),v=`https://github.com/${d}/${h}.git`,g="github.com",b=`${d}/${h}`;return[new Me.ss(e,`${g}/${b}`,"origin","https",g,b,(0,Pe.B)(this.container,t)(v,g,b),[{type:Me.XG.Fetch,url:v},{type:Me.XG.Push,url:v}])]}async getRevisionContent(e,r,t){const o=t?this.createProviderUri(e,t,r):this.createVirtualUri(e,t,r);return P.workspace.fs.readFile(o)}async getStash(e){}async getStatusForFile(e,r){}async getStatusForFiles(e,r){}async getStatusForRepo(e){}async getTags(e,r){if(e==null)return xe;const t=(0,w.UH)();let o=r?.cursor?void 0:this._tagsCache.get(e);if(o==null){async function h(){var v,g,b;try{const{metadata:C,github:T,session:F}=await this.ensureRepositoryContext(e),_=[];let q=r?.cursor;const L=q==null;for(;;){const E=await T.getTags(F.accessToken,C.repo.owner,C.repo.name,{cursor:q});for(const B of E.values)_.push(new Ie.gE(e,B.name,B.target.oid,B.target.message??"",new Date(B.target.authoredDate??((v=B.target.tagger)==null?void 0:v.date)),new Date(B.target.committedDate??((g=B.target.tagger)==null?void 0:g.date))));if(!((b=E.paging)!=null&&b.more)||!L)return{...E,values:_};q=E.paging.cursor}}catch(C){return K.Yd.error(C,t),this._tagsCache.delete(e),xe}}R(h,"load"),o=h.call(this),r?.cursor==null&&this._tagsCache.set(e,o)}let d=await o;return r?.filter!=null&&(d={...d,values:d.values.filter(r.filter)}),r?.sort!=null&&(0,Ie.Pj)(d.values,typeof r.sort=="boolean"?void 0:r.sort),d}async getTreeEntryForRevision(e,r,t){if(e==null||!r)return;if(t==="HEAD"){const h=await this.ensureRepositoryContext(e);if(h==null)return;const v=await h.metadata.getRevision();t=v?.revision}const o=t?this.createProviderUri(e,t,r):this.createVirtualUri(e,t,r),d=await P.workspace.fs.stat(o);if(d!=null)return{path:this.getRelativePath(o,e),commitSha:t,size:d.size,type:(d.type&P.FileType.Directory)===P.FileType.Directory?"tree":"blob"}}async getTreeForRevision(e,r){if(e==null)return[];if(r==="HEAD"){const h=await this.ensureRepositoryContext(e);if(h==null)return[];const v=await h.metadata.getRevision();r=v?.revision}const t=r?this.createProviderUri(e,r):this.createVirtualUri(e,r),o=await P.workspace.fs.readDirectory(t);if(o==null)return[];const d=[];for(const[h,v]of o){const g=this.getAbsoluteUri(h,t);d.push({path:this.getRelativePath(h,g),commitSha:r,size:0,type:(v&P.FileType.Directory)===P.FileType.Directory?"tree":"blob"})}return[]}async hasBranchOrTag(e,r){var t,o;const[{values:d},{values:h}]=await Promise.all([this.getBranches(e,{filter:(t=r?.filter)==null?void 0:t.branches,sort:!1}),this.getTags(e,{filter:(o=r?.filter)==null?void 0:o.tags,sort:!1})]);return d.length!==0||h.length!==0}async hasCommitBeenPushed(e,r){return!0}isTrackable(e){return this.supportedSchemes.has(e.scheme)}async isTracked(e){if(!this.isTrackable(e)||this.container.git.getRepository(e)==null)return!1;const r=e.with({scheme:k.sN.GitHub});return await P.workspace.fs.stat(r)!=null}async getDiffTool(e){}async openDiffTool(e,r,t){}async openDirectoryCompare(e,r,t,o){}async resolveReference(e,r,t,o){if(!r||r===re.p.deletedOrMissing||t==null&&re.p.isSha(r)||t!=null&&re.p.isUncommitted(r))return r;let d;if(t!=null)d=this.getRelativePath(t,e);else if(!re.p.isShaLike(r)||r.endsWith("^3"))return r;const h=await this.ensureRepositoryContext(e);if(h==null)return r;const{metadata:v,github:g,session:b}=h,C=await g.resolveReference(b.accessToken,v.repo.owner,v.repo.name,r,d);return C??(d?re.p.deletedOrMissing:r)}async richSearchCommits(e,r,t){var o,d,h;if(e==null)return;const v=(0,w.UH)(),g=(0,qe.pD)(r),b=g.get("commit:");if(b!=null){const _=await this.getCommit(e,b[0]);return _==null?void 0:{repoPath:e,commits:new Map([[_.sha,_]]),sha:_.sha,range:void 0,count:1,limit:1,hasMore:!1}}const C=await this.getQueryArgsFromSearchQuery(r,g,e);if(C.length===0)return;const T=this.getPagingLimit(t?.limit);try{const{metadata:_,github:q,session:L}=await this.ensureRepositoryContext(e),E=`repo:${_.repo.owner}/${_.repo.name}+${C.join("+").trim()}`,B=await q.searchCommits(L.accessToken,E,{cursor:t?.cursor,limit:T,sort:t?.ordering==="date"?"committer-date":t?.ordering==="author-date"?"author-date":void 0});if(B==null)return;const $=new Map,I=L.account.label;for(const A of B.values){const Q=I!=null&&A.author.name===I?"You":A.author.name,j=I!=null&&A.committer.name===I?"You":A.committer.name;let U=$.get(A.oid);U==null&&(U=new J.aM(this.container,e,A.oid,new J._j(Q,A.author.email,new Date(A.author.date),A.author.avatarUrl),new J._j(j,A.committer.email,new Date(A.committer.date)),A.message.split(`
`,1)[0],A.parents.nodes.map(oe=>oe.oid),A.message,(o=A.files)==null?void 0:o.map(oe=>new te.K8(e,oe.filename??"",(0,ye.fromCommitFileStatus)(oe.status)??te.NV.Modified,oe.previous_filename,void 0,{additions:oe.additions??0,deletions:oe.deletions??0,changes:oe.changes??0})),{changedFiles:A.changedFiles??0,additions:A.additions??0,deletions:A.deletions??0},[]),$.set(A.oid,U))}const G={repoPath:e,commits:$,sha:void 0,range:void 0,count:$.size,limit:T,hasMore:((d=B.pageInfo)==null?void 0:d.hasNextPage)??!1,endingCursor:((h=B.pageInfo)==null?void 0:h.endCursor)??void 0,query:A=>this.getLog(e,{...t,limit:A})};if(G.hasMore){let A=R(function(Q){return async j=>{j=this.getPagingLimit(j);const U=await this.richSearchCommits(Q.repoPath,r,{...t,limit:j,cursor:Q.endingCursor});if(U==null)return{...Q,hasMore:!1,more:void 0};const oe=new Map([...Q.commits,...U.commits]),fe={repoPath:Q.repoPath,commits:oe,sha:Q.sha,range:void 0,count:oe.size,limit:(Q.limit??0)+j,hasMore:U.hasMore,endingCursor:U.endingCursor,query:Q.query};return fe.hasMore&&(fe.more=A.call(this,fe)),fe}},"richSearchCommitsCore2");var F=A;G.more=A.call(this,G)}return G}catch(_){K.Yd.error(_,v);return}}async searchCommits(e,r,t){r={matchAll:!1,matchCase:!1,matchRegex:!0,...r};const o=(0,qe.FL)(r);try{const d=new Map,h=(0,qe.pD)(r),v=h.get("commit:");if(v!=null){const q=await Promise.allSettled(v.map(E=>this.getCommit(e,E.replace(_e,""))));let L=0;for(const E of q){const B=(0,$e.Sb)(E);B!=null&&d.set(B.sha,{i:L++,date:Number(t?.ordering==="author-date"?B.author.date:B.committer.date)})}return{repoPath:e,query:r,comparisonKey:o,results:d}}const g=await this.getQueryArgsFromSearchQuery(r,h,e);if(g.length===0)return{repoPath:e,query:r,comparisonKey:o,results:d};const{metadata:b,github:C,session:T}=await this.ensureRepositoryContext(e),F=`repo:${b.repo.owner}/${b.repo.name}+${g.join("+").trim()}`;async function _(q,L){var E,B,$,I;if((E=t?.cancellation)!=null&&E.isCancellationRequested)return{repoPath:e,query:r,comparisonKey:o,results:d};q=this.getPagingLimit(q??Y.DN.get("advanced.maxSearchItems"));const G=await C.searchCommitShas(T.accessToken,F,{cursor:L,limit:q,sort:t?.ordering==="date"?"committer-date":t?.ordering==="author-date"?"author-date":void 0});if(G==null||(B=t?.cancellation)!=null&&B.isCancellationRequested)return{repoPath:e,query:r,comparisonKey:o,results:d};for(const A of G.values)d.set(A.sha,{i:d.size,date:Number(t?.ordering==="author-date"?A.authorDate:A.committerDate)});return L=(($=G.pageInfo)==null?void 0:$.endCursor)??void 0,{repoPath:e,query:r,comparisonKey:o,results:d,paging:(I=G.pageInfo)!=null&&I.hasNextPage?{limit:q,hasMore:!0}:void 0,more:async A=>_.call(this,A,L)}}return R(_,"searchForCommitsCore"),_.call(this,t?.limit)}catch(d){throw d instanceof ie.l0?d:new ie.l0(d)}}async validateBranchOrTagName(e,r){return Be.test(e)}async validateReference(e,r){return!0}async stageFile(e,r){}async stageDirectory(e,r){}async unStageFile(e,r){}async unStageDirectory(e,r){}async stashApply(e,r,t){}async stashDelete(e,r,t){}async stashSave(e,r,t,o){}async ensureRepositoryContext(e,r){let t=P.Uri.parse(e,!0);if(!/^github\+?/.test(t.authority))throw new W.kX(e,W.sh.NotAGitHubRepository);if(!r){const g=this.container.git.getRepository(t);if(g==null)throw new W.kX(e,W.sh.NotAGitHubRepository);t=g.uri}let o=this._remotehub;if(o==null)try{o=await this.ensureRemoteHubApi()}catch(g){throw g instanceof W.R5,new W.kX(e,W.sh.RemoteHubApiNotFound,g)}const d=await o?.getMetadata(t);if(d?.provider.id!=="github")throw new W.kX(e,W.sh.NotAGitHubRepository);let h,v;try{[h,v]=await Promise.all([this.ensureGitHub(),this.ensureSession()])}catch(g){throw g instanceof W._7?new W.kX(e,g.reason===W.Jx.UserDidNotConsent?W.sh.GitHubAuthenticationDenied:W.sh.GitHubAuthenticationNotFound,g):new W.kX(e)}if(h==null)throw new W.kX(e);return{github:h,metadata:d,remotehub:o,session:v}}async ensureGitHub(){if(this._github==null){const e=await this.container.github;e!=null&&this._disposables.push(e.onDidReauthenticate(()=>void this.ensureSession(!0))),this._github=e}return this._github}async ensureRemoteHubApi(e){if(this._remotehubPromise==null&&(this._remotehubPromise=Oe(),this._remotehubPromise.then(r=>this._remotehub=r,()=>this._remotehub=void 0)),!e)return this._remotehubPromise;try{return await this._remotehubPromise}catch{return}}async ensureSession(e=!1,r=!1){if(e||this._sessionPromise==null){async function t(){let o=this.container.storage.get(`provider:authentication:skip:${this.descriptor.id}`,!1);try{if(e)return o=!1,this.container.storage.delete(`provider:authentication:skip:${this.descriptor.id}`),await P.authentication.getSession("github",Ne,{forceNewSession:!0});if(!o&&!r)return await P.authentication.getSession("github",Ne,{createIfNone:!0});const d=await P.authentication.getSession("github",Ne,{createIfNone:!1,silent:r});if(d!=null)return d;throw new Error("User did not consent")}catch(d){if(d instanceof Error&&d.message.includes("User did not consent")){if(!r&&(await this.container.storage.store(`provider:authentication:skip:${this.descriptor.id}`,!0),!o))return e||queueMicrotask(async()=>{const h="Re-enable";await P.window.showInformationMessage("GitLens has been disabled. Authentication is required for GitLens to work with remote GitHub repositories.",h)===h&&this.ensureSession(!0)}),e=!1,t.call(this);throw new W._7("github",W.Jx.UserDidNotConsent)}throw K.Yd.error(d),new W._7("github",void 0,d)}}R(t,"getSession"),this._sessionPromise=t.call(this)}return this._sessionPromise}createVirtualUri(e,r,t){let o;if(typeof r=="string")r&&(re.p.isSha(r)?o={v:1,ref:{id:r,type:2}}:o={v:1,ref:{id:r,type:4}});else switch(r?.refType){case"revision":case"stash":o={v:1,ref:{id:r.ref,type:2}};break;case"branch":case"tag":o={v:1,ref:{id:r.name,type:4}};break}if(typeof e=="string"&&(e=P.Uri.parse(e,!0)),t){let d=e.path;d.endsWith("/")&&(d=d.slice(0,-1)),t=this.getRelativePath(t,e),t=`${d}/${t.startsWith("/")?t.slice(0,-1):t}`}return e.with({scheme:k.sN.Virtual,authority:Xe("github",o),path:t??e.path})}createProviderUri(e,r,t){const o=this.createVirtualUri(e,r,t);return this._remotehub==null?o.scheme!==k.sN.Virtual?o:o.with({scheme:k.sN.GitHub}):this._remotehub.getProviderUri(o)}getPagingLimit(e){return e=Math.min(100,e??Y.DN.get("advanced.maxListItems")??100),e===0&&(e=100),e}async resolveReferenceCore(e,r,t){var o,d,h,v;if(t==null||t==="HEAD")return(await r.getRevision()).revision;if(re.p.isSha(t))return t;if(re.p.isRange(t))return;const[g,b]=await Promise.allSettled([this.getBranches(e,{filter:C=>C.name===t}),this.getTags(e,{filter:C=>C.name===t})]);return t=((d=(o=(0,$e.Sb)(g))==null?void 0:o.values[0])==null?void 0:d.sha)??((v=(h=(0,$e.Sb)(b))==null?void 0:h.values[0])==null?void 0:v.sha),t==null,t}async getQueryArgsFromSearchQuery(e,r,t){const o=[];for(const[d,h]of r.entries())switch(d){case"message:":o.push(...h.map(v=>v.replace(/ /g,"+")));break;case"author:":{let v;h.includes("@me")&&(v=await this.getCurrentUser(t));for(let g of h)if(g&&(g=g.replace(_e,e.matchRegex?"\\b":""),!!g)){if(g==="@me"){if(v?.username==null)continue;g=`@${v.username}`}g=g.replace(/ /g,"+"),g.startsWith("@")?o.push(`author:${g.slice(1)}`):g.includes("@")?o.push(`author-email:${g}`):o.push(`author-name:${g}`)}break}}return o}}R(M,"GitHubGitProvider"),D([(0,w.cM)()],M.prototype,"getBestRevisionUri",1),D([(0,w.cM)()],M.prototype,"getWorkingUri",1),D([(0,w.cM)()],M.prototype,"addRemote",1),D([(0,w.cM)()],M.prototype,"pruneRemote",1),D([(0,w.cM)()],M.prototype,"applyChangesToWorkingFile",1),D([(0,w.cM)()],M.prototype,"branchContainsCommit",1),D([(0,w.cM)()],M.prototype,"checkout",1),D([(0,w.cM)({singleLine:!0})],M.prototype,"resetCaches",1),D([(0,w.cM)({args:{1:H=>H.length}})],M.prototype,"excludeIgnoredUris",1),D([(0,w.cM)()],M.prototype,"fetch",1),D([(0,Ae.H)(),(0,w.fF)()],M.prototype,"findRepositoryUri",1),D([(0,w.cM)({args:{1:H=>H.join(",")}})],M.prototype,"getAheadBehindCommitCount",1),D([(0,Ae.H)((H,e)=>`${H.toString()}|${e?.isDirty}`),(0,w.cM)({args:{1:H=>H?.isDirty}})],M.prototype,"getBlame",1),D([(0,w.cM)({args:{1:"<contents>"}})],M.prototype,"getBlameContents",1),D([(0,Ae.H)((H,e,r,t)=>`${H.toString()}|${e}|${r?.isDirty}|${t?.forceSingleLine}`),(0,w.cM)({args:{2:H=>H?.isDirty}})],M.prototype,"getBlameForLine",1),D([(0,w.cM)({args:{2:"<contents>"}})],M.prototype,"getBlameForLineContents",1),D([(0,w.cM)()],M.prototype,"getBlameForRange",1),D([(0,w.cM)({args:{2:"<contents>"}})],M.prototype,"getBlameForRangeContents",1),D([(0,w.cM)({args:{0:"<blame>"}})],M.prototype,"getBlameRange",1),D([(0,w.cM)()],M.prototype,"getBranch",1),D([(0,w.cM)({args:{1:!1}})],M.prototype,"getBranches",1),D([(0,w.cM)()],M.prototype,"getChangedFilesCount",1),D([(0,w.cM)()],M.prototype,"getCommit",1),D([(0,w.cM)()],M.prototype,"getCommitBranches",1),D([(0,w.cM)()],M.prototype,"getCommitCount",1),D([(0,w.cM)()],M.prototype,"getCommitForFile",1),D([(0,w.cM)()],M.prototype,"getCommitsForGraph",1),D([(0,w.cM)()],M.prototype,"getOldestUnpushedRefForFile",1),D([(0,w.cM)()],M.prototype,"getContributors",1),D([(0,Ae.H)(),(0,w.cM)()],M.prototype,"getCurrentUser",1),D([(0,w.cM)()],M.prototype,"getDefaultBranchName",1),D([(0,w.cM)()],M.prototype,"getDiffForFile",1),D([(0,w.cM)({args:{1:H=>"<contents>"}})],M.prototype,"getDiffForFileContents",1),D([(0,w.cM)()],M.prototype,"getDiffForLine",1),D([(0,w.cM)()],M.prototype,"getDiffStatus",1),D([(0,w.cM)()],M.prototype,"getFileStatusForCommit",1),D([(0,w.cM)()],M.prototype,"getLog",1),D([(0,w.cM)()],M.prototype,"getLogRefsOnly",1),D([(0,w.cM)()],M.prototype,"getLogForFile",1),D([(0,w.cM)()],M.prototype,"getMergeBase",1),D([(0,w.cM)()],M.prototype,"getMergeStatus",1),D([(0,w.cM)()],M.prototype,"getRebaseStatus",1),D([(0,w.cM)()],M.prototype,"getNextComparisonUris",1),D([(0,w.cM)()],M.prototype,"getPreviousComparisonUris",1),D([(0,w.cM)()],M.prototype,"getPreviousComparisonUrisForLine",1),D([(0,w.cM)()],M.prototype,"getIncomingActivity",1),D([(0,w.cM)({args:{1:!1}})],M.prototype,"getRemotes",1),D([(0,w.cM)()],M.prototype,"getRevisionContent",1),D([(0,w.cM)()],M.prototype,"getStash",1),D([(0,w.cM)()],M.prototype,"getStatusForFile",1),D([(0,w.cM)()],M.prototype,"getStatusForFiles",1),D([(0,w.cM)()],M.prototype,"getStatusForRepo",1),D([(0,w.cM)({args:{1:!1}})],M.prototype,"getTags",1),D([(0,w.cM)()],M.prototype,"getTreeEntryForRevision",1),D([(0,w.cM)()],M.prototype,"getTreeForRevision",1),D([(0,w.cM)()],M.prototype,"hasBranchOrTag",1),D([(0,w.cM)()],M.prototype,"hasCommitBeenPushed",1),D([(0,w.cM)()],M.prototype,"getDiffTool",1),D([(0,w.cM)()],M.prototype,"openDiffTool",1),D([(0,w.cM)()],M.prototype,"openDirectoryCompare",1),D([(0,w.cM)()],M.prototype,"resolveReference",1),D([(0,w.cM)()],M.prototype,"richSearchCommits",1),D([(0,w.cM)()],M.prototype,"searchCommits",1),D([(0,w.cM)()],M.prototype,"validateBranchOrTagName",1),D([(0,w.cM)()],M.prototype,"validateReference",1),D([(0,w.cM)()],M.prototype,"stageFile",1),D([(0,w.cM)()],M.prototype,"stageDirectory",1),D([(0,w.cM)()],M.prototype,"unStageFile",1),D([(0,w.cM)()],M.prototype,"unStageDirectory",1),D([(0,w.cM)()],M.prototype,"stashApply",1),D([(0,w.cM)()],M.prototype,"stashDelete",1),D([(0,w.cM)({args:{2:H=>H?.length}})],M.prototype,"stashSave",1),D([(0,Ae.H)()],M.prototype,"ensureRepositoryContext",1),D([(0,Ae.H)()],M.prototype,"ensureGitHub",1);function Xe(H,e){return`${H}${e!=null?`+${(0,Z.e)(JSON.stringify(e))}`:""}`}R(Xe,"encodeAuthority")},8301:(de,ue,S)=>{"use strict";S.r(ue),S.d(ue,{GitHubPullRequest:()=>Y,fromCommitFileStatus:()=>k});var P=S(3901),Z=S(9052),Y;(V=>{function ae(ie,he){return new Z.i7(he,{name:ie.author.login,avatarUrl:ie.author.avatarUrl,url:ie.author.url},String(ie.number),ie.title,ie.permalink,W(ie.state),new Date(ie.updatedAt),ie.closedAt==null?void 0:new Date(ie.closedAt),ie.mergedAt==null?void 0:new Date(ie.mergedAt))}R(ae,"from"),V.from=ae;function W(ie){return ie==="MERGED"?Z.o0.Merged:ie==="CLOSED"?Z.o0.Closed:Z.o0.Open}R(W,"fromState"),V.fromState=W;function we(ie){return ie===Z.o0.Merged?"MERGED":ie===Z.o0.Closed?"CLOSED":"OPEN"}R(we,"toState"),V.toState=we})(Y||(Y={}));function k(V){switch(V){case"added":return P.NV.Added;case"changed":case"modified":return P.NV.Modified;case"removed":return P.NV.Deleted;case"renamed":return P.NV.Renamed;case"copied":return P.NV.Copied}}R(k,"fromCommitFileStatus")},778:(de,ue,S)=>{var P=S(2479);de.exports=P(Z),de.exports.strict=P(Y),Z.proto=Z(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return Z(this)},configurable:!0}),Object.defineProperty(Function.prototype,"onceStrict",{value:function(){return Y(this)},configurable:!0})});function Z(k){var V=R(function(){return V.called?V.value:(V.called=!0,V.value=k.apply(this,arguments))},"f");return V.called=!1,V}R(Z,"once");function Y(k){var V=R(function(){if(V.called)throw new Error(V.onceError);return V.called=!0,V.value=k.apply(this,arguments)},"f"),ae=k.name||"Function wrapped with `once`";return V.onceError=ae+" shouldn't be called more than once",V.called=!1,V}R(Y,"onceStrict")},2479:de=>{de.exports=ue;function ue(S,P){if(S&&P)return ue(S)(P);if(typeof S!="function")throw new TypeError("need wrapper function");return Object.keys(S).forEach(function(Y){Z[Y]=S[Y]}),Z;function Z(){for(var Y=new Array(arguments.length),k=0;k<Y.length;k++)Y[k]=arguments[k];var V=S.apply(this,Y),ae=Y[Y.length-1];return typeof V=="function"&&V!==ae&&Object.keys(ae).forEach(function(W){V[W]=ae[W]}),V}R(Z,"wrapper")}R(ue,"wrappy")}};
