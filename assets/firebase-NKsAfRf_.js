const _h=()=>{};var sa={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vc=function(n){const t=[];let e=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?t[e++]=s:s<2048?(t[e++]=s>>6|192,t[e++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),t[e++]=s>>18|240,t[e++]=s>>12&63|128,t[e++]=s>>6&63|128,t[e++]=s&63|128):(t[e++]=s>>12|224,t[e++]=s>>6&63|128,t[e++]=s&63|128)}return t},yh=function(n){const t=[];let e=0,r=0;for(;e<n.length;){const s=n[e++];if(s<128)t[r++]=String.fromCharCode(s);else if(s>191&&s<224){const o=n[e++];t[r++]=String.fromCharCode((s&31)<<6|o&63)}else if(s>239&&s<365){const o=n[e++],a=n[e++],u=n[e++],h=((s&7)<<18|(o&63)<<12|(a&63)<<6|u&63)-65536;t[r++]=String.fromCharCode(55296+(h>>10)),t[r++]=String.fromCharCode(56320+(h&1023))}else{const o=n[e++],a=n[e++];t[r++]=String.fromCharCode((s&15)<<12|(o&63)<<6|a&63)}}return t.join("")},Ac={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,t){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const e=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const o=n[s],a=s+1<n.length,u=a?n[s+1]:0,h=s+2<n.length,f=h?n[s+2]:0,m=o>>2,y=(o&3)<<4|u>>4;let v=(u&15)<<2|f>>6,P=f&63;h||(P=64,a||(v=64)),r.push(e[m],e[y],e[v],e[P])}return r.join("")},encodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(n):this.encodeByteArray(vc(n),t)},decodeString(n,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(n):yh(this.decodeStringToByteArray(n,t))},decodeStringToByteArray(n,t){this.init_();const e=t?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const o=e[n.charAt(s++)],u=s<n.length?e[n.charAt(s)]:0;++s;const f=s<n.length?e[n.charAt(s)]:64;++s;const y=s<n.length?e[n.charAt(s)]:64;if(++s,o==null||u==null||f==null||y==null)throw new Eh;const v=o<<2|u>>4;if(r.push(v),f!==64){const P=u<<4&240|f>>2;if(r.push(P),y!==64){const N=f<<6&192|y;r.push(N)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class Eh extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const Th=function(n){const t=vc(n);return Ac.encodeByteArray(t,!0)},Tr=function(n){return Th(n).replace(/\./g,"")},Ih=function(n){try{return Ac.decodeString(n,!0)}catch(t){console.error("base64Decode failed: ",t)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wh(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vh=()=>wh().__FIREBASE_DEFAULTS__,Ah=()=>{if(typeof process>"u"||typeof sa>"u")return;const n=sa.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},Rh=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const t=n&&Ih(n[1]);return t&&JSON.parse(t)},xr=()=>{try{return _h()||vh()||Ah()||Rh()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},bh=n=>{var t,e;return(e=(t=xr())==null?void 0:t.emulatorHosts)==null?void 0:e[n]},Sh=n=>{const t=bh(n);if(!t)return;const e=t.lastIndexOf(":");if(e<=0||e+1===t.length)throw new Error(`Invalid host ${t} with no separate hostname and port!`);const r=parseInt(t.substring(e+1),10);return t[0]==="["?[t.substring(1,e-1),r]:[t.substring(0,e),r]},Rc=()=>{var n;return(n=xr())==null?void 0:n.config},F_=n=>{var t;return(t=xr())==null?void 0:t[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ph{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((t,e)=>{this.resolve=t,this.reject=e})}wrapCallback(t){return(e,r)=>{e?this.reject(e):this.resolve(r),typeof t=="function"&&(this.promise.catch(()=>{}),t.length===1?t(e):t(e,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ch(n,t){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const e={alg:"none",type:"JWT"},r=t||"demo-project",s=n.iat||0,o=n.sub||n.user_id;if(!o)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const a={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:o,user_id:o,firebase:{sign_in_provider:"custom",identities:{}},...n};return[Tr(JSON.stringify(e)),Tr(JSON.stringify(a)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function li(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function U_(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(li())}function Vh(){var t;const n=(t=xr())==null?void 0:t.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function B_(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function bc(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function q_(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function j_(){const n=li();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function Dh(){return!Vh()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function hi(){try{return typeof indexedDB=="object"}catch{return!1}}function fi(){return new Promise((n,t)=>{try{let e=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),e||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{e=!1},s.onerror=()=>{var o;t(((o=s.error)==null?void 0:o.message)||"")}}catch(e){t(e)}})}function Sc(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nh="FirebaseError";class de extends Error{constructor(t,e,r){super(e),this.code=t,this.customData=r,this.name=Nh,Object.setPrototypeOf(this,de.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Lr.prototype.create)}}class Lr{constructor(t,e,r){this.service=t,this.serviceName=e,this.errors=r}create(t,...e){const r=e[0]||{},s=`${this.service}/${t}`,o=this.errors[t],a=o?kh(o,r):"Error",u=`${this.serviceName}: ${a} (${s}).`;return new de(s,u,r)}}function kh(n,t){return n.replace(Oh,(e,r)=>{const s=t[r];return s!=null?String(s):`<${r}?>`})}const Oh=/\{\$([^}]+)}/g;function $_(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}function Pn(n,t){if(n===t)return!0;const e=Object.keys(n),r=Object.keys(t);for(const s of e){if(!r.includes(s))return!1;const o=n[s],a=t[s];if(ia(o)&&ia(a)){if(!Pn(o,a))return!1}else if(o!==a)return!1}for(const s of r)if(!e.includes(s))return!1;return!0}function ia(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function z_(n){const t=[];for(const[e,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{t.push(encodeURIComponent(e)+"="+encodeURIComponent(s))}):t.push(encodeURIComponent(e)+"="+encodeURIComponent(r));return t.length?"&"+t.join("&"):""}function G_(n,t){const e=new Mh(n,t);return e.subscribe.bind(e)}class Mh{constructor(t,e){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=e,this.task.then(()=>{t(this)}).catch(r=>{this.error(r)})}next(t){this.forEachObserver(e=>{e.next(t)})}error(t){this.forEachObserver(e=>{e.error(t)}),this.close(t)}complete(){this.forEachObserver(t=>{t.complete()}),this.close()}subscribe(t,e,r){let s;if(t===void 0&&e===void 0&&r===void 0)throw new Error("Missing Observer.");xh(t,["next","error","complete"])?s=t:s={next:t,error:e,complete:r},s.next===void 0&&(s.next=bs),s.error===void 0&&(s.error=bs),s.complete===void 0&&(s.complete=bs);const o=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),o}unsubscribeOne(t){this.observers===void 0||this.observers[t]===void 0||(delete this.observers[t],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(t){if(!this.finalized)for(let e=0;e<this.observers.length;e++)this.sendOne(e,t)}sendOne(t,e){this.task.then(()=>{if(this.observers!==void 0&&this.observers[t]!==void 0)try{e(this.observers[t])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(t){this.finalized||(this.finalized=!0,t!==void 0&&(this.finalError=t),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function xh(n,t){if(typeof n!="object"||n===null)return!1;for(const e of t)if(e in n&&typeof n[e]=="function")return!0;return!1}function bs(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Lh=1e3,Fh=2,Uh=14400*1e3,Bh=.5;function oa(n,t=Lh,e=Fh){const r=t*Math.pow(e,n),s=Math.round(Bh*r*(Math.random()-.5)*2);return Math.min(Uh,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function At(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pc(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function qh(n){return(await fetch(n,{credentials:"include"})).ok}class zt{constructor(t,e,r){this.name=t,this.instanceFactory=e,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(t){return this.instantiationMode=t,this}setMultipleInstances(t){return this.multipleInstances=t,this}setServiceProps(t){return this.serviceProps=t,this}setInstanceCreatedCallback(t){return this.onInstanceCreated=t,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const we="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jh{constructor(t,e){this.name=t,this.container=e,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(t){const e=this.normalizeInstanceIdentifier(t);if(!this.instancesDeferred.has(e)){const r=new Ph;if(this.instancesDeferred.set(e,r),this.isInitialized(e)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:e});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(e).promise}getImmediate(t){const e=this.normalizeInstanceIdentifier(t==null?void 0:t.identifier),r=(t==null?void 0:t.optional)??!1;if(this.isInitialized(e)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:e})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(t){if(t.name!==this.name)throw Error(`Mismatching Component ${t.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=t,!!this.shouldAutoInitialize()){if(zh(t))try{this.getOrInitializeService({instanceIdentifier:we})}catch{}for(const[e,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(e);try{const o=this.getOrInitializeService({instanceIdentifier:s});r.resolve(o)}catch{}}}}clearInstance(t=we){this.instancesDeferred.delete(t),this.instancesOptions.delete(t),this.instances.delete(t)}async delete(){const t=Array.from(this.instances.values());await Promise.all([...t.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...t.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return this.component!=null}isInitialized(t=we){return this.instances.has(t)}getOptions(t=we){return this.instancesOptions.get(t)||{}}initialize(t={}){const{options:e={}}=t,r=this.normalizeInstanceIdentifier(t.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:e});for(const[o,a]of this.instancesDeferred.entries()){const u=this.normalizeInstanceIdentifier(o);r===u&&a.resolve(s)}return s}onInit(t,e){const r=this.normalizeInstanceIdentifier(e),s=this.onInitCallbacks.get(r)??new Set;s.add(t),this.onInitCallbacks.set(r,s);const o=this.instances.get(r);return o&&t(o,r),()=>{s.delete(t)}}invokeOnInitCallbacks(t,e){const r=this.onInitCallbacks.get(e);if(r)for(const s of r)try{s(t,e)}catch{}}getOrInitializeService({instanceIdentifier:t,options:e={}}){let r=this.instances.get(t);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:$h(t),options:e}),this.instances.set(t,r),this.instancesOptions.set(t,e),this.invokeOnInitCallbacks(r,t),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,t,r)}catch{}return r||null}normalizeInstanceIdentifier(t=we){return this.component?this.component.multipleInstances?t:we:t}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function $h(n){return n===we?void 0:n}function zh(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gh{constructor(t){this.name=t,this.providers=new Map}addComponent(t){const e=this.getProvider(t.name);if(e.isComponentSet())throw new Error(`Component ${t.name} has already been registered with ${this.name}`);e.setComponent(t)}addOrOverwriteComponent(t){this.getProvider(t.name).isComponentSet()&&this.providers.delete(t.name),this.addComponent(t)}getProvider(t){if(this.providers.has(t))return this.providers.get(t);const e=new jh(t,this);return this.providers.set(t,e),e}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var $;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})($||($={}));const Kh={debug:$.DEBUG,verbose:$.VERBOSE,info:$.INFO,warn:$.WARN,error:$.ERROR,silent:$.SILENT},Hh=$.INFO,Wh={[$.DEBUG]:"log",[$.VERBOSE]:"log",[$.INFO]:"info",[$.WARN]:"warn",[$.ERROR]:"error"},Qh=(n,t,...e)=>{if(t<n.logLevel)return;const r=new Date().toISOString(),s=Wh[t];if(s)console[s](`[${r}]  ${n.name}:`,...e);else throw new Error(`Attempted to log a message with an invalid logType (value: ${t})`)};class di{constructor(t){this.name=t,this._logLevel=Hh,this._logHandler=Qh,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(t){if(!(t in $))throw new TypeError(`Invalid value "${t}" assigned to \`logLevel\``);this._logLevel=t}setLogLevel(t){this._logLevel=typeof t=="string"?Kh[t]:t}get logHandler(){return this._logHandler}set logHandler(t){if(typeof t!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=t}get userLogHandler(){return this._userLogHandler}set userLogHandler(t){this._userLogHandler=t}debug(...t){this._userLogHandler&&this._userLogHandler(this,$.DEBUG,...t),this._logHandler(this,$.DEBUG,...t)}log(...t){this._userLogHandler&&this._userLogHandler(this,$.VERBOSE,...t),this._logHandler(this,$.VERBOSE,...t)}info(...t){this._userLogHandler&&this._userLogHandler(this,$.INFO,...t),this._logHandler(this,$.INFO,...t)}warn(...t){this._userLogHandler&&this._userLogHandler(this,$.WARN,...t),this._logHandler(this,$.WARN,...t)}error(...t){this._userLogHandler&&this._userLogHandler(this,$.ERROR,...t),this._logHandler(this,$.ERROR,...t)}}const Jh=(n,t)=>t.some(e=>n instanceof e);let aa,ca;function Xh(){return aa||(aa=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])}function Yh(){return ca||(ca=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])}const Cc=new WeakMap,Bs=new WeakMap,Vc=new WeakMap,Ss=new WeakMap,mi=new WeakMap;function Zh(n){const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("success",o),n.removeEventListener("error",a)},o=()=>{e(te(n.result)),s()},a=()=>{r(n.error),s()};n.addEventListener("success",o),n.addEventListener("error",a)});return t.then(e=>{e instanceof IDBCursor&&Cc.set(e,n)}).catch(()=>{}),mi.set(t,n),t}function tf(n){if(Bs.has(n))return;const t=new Promise((e,r)=>{const s=()=>{n.removeEventListener("complete",o),n.removeEventListener("error",a),n.removeEventListener("abort",a)},o=()=>{e(),s()},a=()=>{r(n.error||new DOMException("AbortError","AbortError")),s()};n.addEventListener("complete",o),n.addEventListener("error",a),n.addEventListener("abort",a)});Bs.set(n,t)}let qs={get(n,t,e){if(n instanceof IDBTransaction){if(t==="done")return Bs.get(n);if(t==="objectStoreNames")return n.objectStoreNames||Vc.get(n);if(t==="store")return e.objectStoreNames[1]?void 0:e.objectStore(e.objectStoreNames[0])}return te(n[t])},set(n,t,e){return n[t]=e,!0},has(n,t){return n instanceof IDBTransaction&&(t==="done"||t==="store")?!0:t in n}};function ef(n){qs=n(qs)}function nf(n){return n===IDBDatabase.prototype.transaction&&!("objectStoreNames"in IDBTransaction.prototype)?function(t,...e){const r=n.call(Ps(this),t,...e);return Vc.set(r,t.sort?t.sort():[t]),te(r)}:Yh().includes(n)?function(...t){return n.apply(Ps(this),t),te(Cc.get(this))}:function(...t){return te(n.apply(Ps(this),t))}}function rf(n){return typeof n=="function"?nf(n):(n instanceof IDBTransaction&&tf(n),Jh(n,Xh())?new Proxy(n,qs):n)}function te(n){if(n instanceof IDBRequest)return Zh(n);if(Ss.has(n))return Ss.get(n);const t=rf(n);return t!==n&&(Ss.set(n,t),mi.set(t,n)),t}const Ps=n=>mi.get(n);function Dc(n,t,{blocked:e,upgrade:r,blocking:s,terminated:o}={}){const a=indexedDB.open(n,t),u=te(a);return r&&a.addEventListener("upgradeneeded",h=>{r(te(a.result),h.oldVersion,h.newVersion,te(a.transaction),h)}),e&&a.addEventListener("blocked",h=>e(h.oldVersion,h.newVersion,h)),u.then(h=>{o&&h.addEventListener("close",()=>o()),s&&h.addEventListener("versionchange",f=>s(f.oldVersion,f.newVersion,f))}).catch(()=>{}),u}const sf=["get","getKey","getAll","getAllKeys","count"],of=["put","add","delete","clear"],Cs=new Map;function ua(n,t){if(!(n instanceof IDBDatabase&&!(t in n)&&typeof t=="string"))return;if(Cs.get(t))return Cs.get(t);const e=t.replace(/FromIndex$/,""),r=t!==e,s=of.includes(e);if(!(e in(r?IDBIndex:IDBObjectStore).prototype)||!(s||sf.includes(e)))return;const o=async function(a,...u){const h=this.transaction(a,s?"readwrite":"readonly");let f=h.store;return r&&(f=f.index(u.shift())),(await Promise.all([f[e](...u),s&&h.done]))[0]};return Cs.set(t,o),o}ef(n=>({...n,get:(t,e,r)=>ua(t,e)||n.get(t,e,r),has:(t,e)=>!!ua(t,e)||n.has(t,e)}));/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class af{constructor(t){this.container=t}getPlatformInfoString(){return this.container.getProviders().map(e=>{if(cf(e)){const r=e.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(e=>e).join(" ")}}function cf(n){const t=n.getComponent();return(t==null?void 0:t.type)==="VERSION"}const js="@firebase/app",la="0.14.13";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt=new di("@firebase/app"),uf="@firebase/app-compat",lf="@firebase/analytics-compat",hf="@firebase/analytics",ff="@firebase/app-check-compat",df="@firebase/app-check",mf="@firebase/auth",pf="@firebase/auth-compat",gf="@firebase/database",_f="@firebase/data-connect",yf="@firebase/database-compat",Ef="@firebase/functions",Tf="@firebase/functions-compat",If="@firebase/installations",wf="@firebase/installations-compat",vf="@firebase/messaging",Af="@firebase/messaging-compat",Rf="@firebase/performance",bf="@firebase/performance-compat",Sf="@firebase/remote-config",Pf="@firebase/remote-config-compat",Cf="@firebase/storage",Vf="@firebase/storage-compat",Df="@firebase/firestore",Nf="@firebase/ai",kf="@firebase/firestore-compat",Of="firebase",Mf="12.14.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $s="[DEFAULT]",xf={[js]:"fire-core",[uf]:"fire-core-compat",[hf]:"fire-analytics",[lf]:"fire-analytics-compat",[df]:"fire-app-check",[ff]:"fire-app-check-compat",[mf]:"fire-auth",[pf]:"fire-auth-compat",[gf]:"fire-rtdb",[_f]:"fire-data-connect",[yf]:"fire-rtdb-compat",[Ef]:"fire-fn",[Tf]:"fire-fn-compat",[If]:"fire-iid",[wf]:"fire-iid-compat",[vf]:"fire-fcm",[Af]:"fire-fcm-compat",[Rf]:"fire-perf",[bf]:"fire-perf-compat",[Sf]:"fire-rc",[Pf]:"fire-rc-compat",[Cf]:"fire-gcs",[Vf]:"fire-gcs-compat",[Df]:"fire-fst",[kf]:"fire-fst-compat",[Nf]:"fire-vertex","fire-js":"fire-js",[Of]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cn=new Map,Lf=new Map,zs=new Map;function ha(n,t){try{n.container.addComponent(t)}catch(e){Gt.debug(`Component ${t.name} failed to register with FirebaseApp ${n.name}`,e)}}function ie(n){const t=n.name;if(zs.has(t))return Gt.debug(`There were multiple attempts to register component ${t}.`),!1;zs.set(t,n);for(const e of Cn.values())ha(e,n);for(const e of Lf.values())ha(e,n);return!0}function Bn(n,t){const e=n.container.getProvider("heartbeat").getImmediate({optional:!0});return e&&e.triggerHeartbeat(),n.container.getProvider(t)}function Ff(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Uf={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different options or config","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},ee=new Lr("app","Firebase",Uf);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bf{constructor(t,e,r){this._isDeleted=!1,this._options={...t},this._config={...e},this._name=e.name,this._automaticDataCollectionEnabled=e.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new zt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(t){this.checkDestroyed(),this._automaticDataCollectionEnabled=t}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(t){this._isDeleted=t}checkDestroyed(){if(this.isDeleted)throw ee.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qf=Mf;function jf(n,t={}){let e=n;typeof t!="object"&&(t={name:t});const r={name:$s,automaticDataCollectionEnabled:!0,...t},s=r.name;if(typeof s!="string"||!s)throw ee.create("bad-app-name",{appName:String(s)});if(e||(e=Rc()),!e)throw ee.create("no-options");const o=Cn.get(s);if(o){if(Pn(e,o.options)&&Pn(r,o.config))return o;throw ee.create("duplicate-app",{appName:s})}const a=new Gh(s);for(const h of zs.values())a.addComponent(h);const u=new Bf(e,r,a);return Cn.set(s,u),u}function Nc(n=$s){const t=Cn.get(n);if(!t&&n===$s&&Rc())return jf();if(!t)throw ee.create("no-app",{appName:n});return t}function K_(){return Array.from(Cn.values())}function xt(n,t,e){let r=xf[n]??n;e&&(r+=`-${e}`);const s=r.match(/\s|\//),o=t.match(/\s|\//);if(s||o){const a=[`Unable to register library "${r}" with version "${t}":`];s&&a.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&o&&a.push("and"),o&&a.push(`version name "${t}" contains illegal characters (whitespace or "/")`),Gt.warn(a.join(" "));return}ie(new zt(`${r}-version`,()=>({library:r,version:t}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $f="firebase-heartbeat-database",zf=1,Vn="firebase-heartbeat-store";let Vs=null;function kc(){return Vs||(Vs=Dc($f,zf,{upgrade:(n,t)=>{switch(t){case 0:try{n.createObjectStore(Vn)}catch(e){console.warn(e)}}}}).catch(n=>{throw ee.create("idb-open",{originalErrorMessage:n.message})})),Vs}async function Gf(n){try{const e=(await kc()).transaction(Vn),r=await e.objectStore(Vn).get(Oc(n));return await e.done,r}catch(t){if(t instanceof de)Gt.warn(t.message);else{const e=ee.create("idb-get",{originalErrorMessage:t==null?void 0:t.message});Gt.warn(e.message)}}}async function fa(n,t){try{const r=(await kc()).transaction(Vn,"readwrite");await r.objectStore(Vn).put(t,Oc(n)),await r.done}catch(e){if(e instanceof de)Gt.warn(e.message);else{const r=ee.create("idb-set",{originalErrorMessage:e==null?void 0:e.message});Gt.warn(r.message)}}}function Oc(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Kf=1024,Hf=30;class Wf{constructor(t){this.container=t,this._heartbeatsCache=null;const e=this.container.getProvider("app").getImmediate();this._storage=new Jf(e),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var t,e;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),o=da();if(((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===o||this._heartbeatsCache.heartbeats.some(a=>a.date===o))return;if(this._heartbeatsCache.heartbeats.push({date:o,agent:s}),this._heartbeatsCache.heartbeats.length>Hf){const a=Xf(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(a,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){Gt.warn(r)}}async getHeartbeatsHeader(){var t;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const e=da(),{heartbeatsToSend:r,unsentEntries:s}=Qf(this._heartbeatsCache.heartbeats),o=Tr(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=e,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),o}catch(e){return Gt.warn(e),""}}}function da(){return new Date().toISOString().substring(0,10)}function Qf(n,t=Kf){const e=[];let r=n.slice();for(const s of n){const o=e.find(a=>a.agent===s.agent);if(o){if(o.dates.push(s.date),ma(e)>t){o.dates.pop();break}}else if(e.push({agent:s.agent,dates:[s.date]}),ma(e)>t){e.pop();break}r=r.slice(1)}return{heartbeatsToSend:e,unsentEntries:r}}class Jf{constructor(t){this.app=t,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return hi()?fi().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const e=await Gf(this.app);return e!=null&&e.heartbeats?e:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return fa(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:t.heartbeats})}else return}async add(t){if(await this._canUseIndexedDBPromise){const r=await this.read();return fa(this.app,{lastSentHeartbeatDate:t.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...t.heartbeats]})}else return}}function ma(n){return Tr(JSON.stringify({version:2,heartbeats:n})).length}function Xf(n){if(n.length===0)return-1;let t=0,e=n[0].date;for(let r=1;r<n.length;r++)n[r].date<e&&(e=n[r].date,t=r);return t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yf(n){ie(new zt("platform-logger",t=>new af(t),"PRIVATE")),ie(new zt("heartbeat",t=>new Wf(t),"PRIVATE")),xt(js,la,n),xt(js,la,"esm2020"),xt("fire-js","")}Yf("");var Zf="firebase",td="12.14.0";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */xt(Zf,td,"app");var pa=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var ne,Mc;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function t(T,p){function _(){}_.prototype=p.prototype,T.F=p.prototype,T.prototype=new _,T.prototype.constructor=T,T.D=function(I,E,A){for(var g=Array(arguments.length-2),It=2;It<arguments.length;It++)g[It-2]=arguments[It];return p.prototype[E].apply(I,g)}}function e(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}t(r,e),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(T,p,_){_||(_=0);const I=Array(16);if(typeof p=="string")for(var E=0;E<16;++E)I[E]=p.charCodeAt(_++)|p.charCodeAt(_++)<<8|p.charCodeAt(_++)<<16|p.charCodeAt(_++)<<24;else for(E=0;E<16;++E)I[E]=p[_++]|p[_++]<<8|p[_++]<<16|p[_++]<<24;p=T.g[0],_=T.g[1],E=T.g[2];let A=T.g[3],g;g=p+(A^_&(E^A))+I[0]+3614090360&4294967295,p=_+(g<<7&4294967295|g>>>25),g=A+(E^p&(_^E))+I[1]+3905402710&4294967295,A=p+(g<<12&4294967295|g>>>20),g=E+(_^A&(p^_))+I[2]+606105819&4294967295,E=A+(g<<17&4294967295|g>>>15),g=_+(p^E&(A^p))+I[3]+3250441966&4294967295,_=E+(g<<22&4294967295|g>>>10),g=p+(A^_&(E^A))+I[4]+4118548399&4294967295,p=_+(g<<7&4294967295|g>>>25),g=A+(E^p&(_^E))+I[5]+1200080426&4294967295,A=p+(g<<12&4294967295|g>>>20),g=E+(_^A&(p^_))+I[6]+2821735955&4294967295,E=A+(g<<17&4294967295|g>>>15),g=_+(p^E&(A^p))+I[7]+4249261313&4294967295,_=E+(g<<22&4294967295|g>>>10),g=p+(A^_&(E^A))+I[8]+1770035416&4294967295,p=_+(g<<7&4294967295|g>>>25),g=A+(E^p&(_^E))+I[9]+2336552879&4294967295,A=p+(g<<12&4294967295|g>>>20),g=E+(_^A&(p^_))+I[10]+4294925233&4294967295,E=A+(g<<17&4294967295|g>>>15),g=_+(p^E&(A^p))+I[11]+2304563134&4294967295,_=E+(g<<22&4294967295|g>>>10),g=p+(A^_&(E^A))+I[12]+1804603682&4294967295,p=_+(g<<7&4294967295|g>>>25),g=A+(E^p&(_^E))+I[13]+4254626195&4294967295,A=p+(g<<12&4294967295|g>>>20),g=E+(_^A&(p^_))+I[14]+2792965006&4294967295,E=A+(g<<17&4294967295|g>>>15),g=_+(p^E&(A^p))+I[15]+1236535329&4294967295,_=E+(g<<22&4294967295|g>>>10),g=p+(E^A&(_^E))+I[1]+4129170786&4294967295,p=_+(g<<5&4294967295|g>>>27),g=A+(_^E&(p^_))+I[6]+3225465664&4294967295,A=p+(g<<9&4294967295|g>>>23),g=E+(p^_&(A^p))+I[11]+643717713&4294967295,E=A+(g<<14&4294967295|g>>>18),g=_+(A^p&(E^A))+I[0]+3921069994&4294967295,_=E+(g<<20&4294967295|g>>>12),g=p+(E^A&(_^E))+I[5]+3593408605&4294967295,p=_+(g<<5&4294967295|g>>>27),g=A+(_^E&(p^_))+I[10]+38016083&4294967295,A=p+(g<<9&4294967295|g>>>23),g=E+(p^_&(A^p))+I[15]+3634488961&4294967295,E=A+(g<<14&4294967295|g>>>18),g=_+(A^p&(E^A))+I[4]+3889429448&4294967295,_=E+(g<<20&4294967295|g>>>12),g=p+(E^A&(_^E))+I[9]+568446438&4294967295,p=_+(g<<5&4294967295|g>>>27),g=A+(_^E&(p^_))+I[14]+3275163606&4294967295,A=p+(g<<9&4294967295|g>>>23),g=E+(p^_&(A^p))+I[3]+4107603335&4294967295,E=A+(g<<14&4294967295|g>>>18),g=_+(A^p&(E^A))+I[8]+1163531501&4294967295,_=E+(g<<20&4294967295|g>>>12),g=p+(E^A&(_^E))+I[13]+2850285829&4294967295,p=_+(g<<5&4294967295|g>>>27),g=A+(_^E&(p^_))+I[2]+4243563512&4294967295,A=p+(g<<9&4294967295|g>>>23),g=E+(p^_&(A^p))+I[7]+1735328473&4294967295,E=A+(g<<14&4294967295|g>>>18),g=_+(A^p&(E^A))+I[12]+2368359562&4294967295,_=E+(g<<20&4294967295|g>>>12),g=p+(_^E^A)+I[5]+4294588738&4294967295,p=_+(g<<4&4294967295|g>>>28),g=A+(p^_^E)+I[8]+2272392833&4294967295,A=p+(g<<11&4294967295|g>>>21),g=E+(A^p^_)+I[11]+1839030562&4294967295,E=A+(g<<16&4294967295|g>>>16),g=_+(E^A^p)+I[14]+4259657740&4294967295,_=E+(g<<23&4294967295|g>>>9),g=p+(_^E^A)+I[1]+2763975236&4294967295,p=_+(g<<4&4294967295|g>>>28),g=A+(p^_^E)+I[4]+1272893353&4294967295,A=p+(g<<11&4294967295|g>>>21),g=E+(A^p^_)+I[7]+4139469664&4294967295,E=A+(g<<16&4294967295|g>>>16),g=_+(E^A^p)+I[10]+3200236656&4294967295,_=E+(g<<23&4294967295|g>>>9),g=p+(_^E^A)+I[13]+681279174&4294967295,p=_+(g<<4&4294967295|g>>>28),g=A+(p^_^E)+I[0]+3936430074&4294967295,A=p+(g<<11&4294967295|g>>>21),g=E+(A^p^_)+I[3]+3572445317&4294967295,E=A+(g<<16&4294967295|g>>>16),g=_+(E^A^p)+I[6]+76029189&4294967295,_=E+(g<<23&4294967295|g>>>9),g=p+(_^E^A)+I[9]+3654602809&4294967295,p=_+(g<<4&4294967295|g>>>28),g=A+(p^_^E)+I[12]+3873151461&4294967295,A=p+(g<<11&4294967295|g>>>21),g=E+(A^p^_)+I[15]+530742520&4294967295,E=A+(g<<16&4294967295|g>>>16),g=_+(E^A^p)+I[2]+3299628645&4294967295,_=E+(g<<23&4294967295|g>>>9),g=p+(E^(_|~A))+I[0]+4096336452&4294967295,p=_+(g<<6&4294967295|g>>>26),g=A+(_^(p|~E))+I[7]+1126891415&4294967295,A=p+(g<<10&4294967295|g>>>22),g=E+(p^(A|~_))+I[14]+2878612391&4294967295,E=A+(g<<15&4294967295|g>>>17),g=_+(A^(E|~p))+I[5]+4237533241&4294967295,_=E+(g<<21&4294967295|g>>>11),g=p+(E^(_|~A))+I[12]+1700485571&4294967295,p=_+(g<<6&4294967295|g>>>26),g=A+(_^(p|~E))+I[3]+2399980690&4294967295,A=p+(g<<10&4294967295|g>>>22),g=E+(p^(A|~_))+I[10]+4293915773&4294967295,E=A+(g<<15&4294967295|g>>>17),g=_+(A^(E|~p))+I[1]+2240044497&4294967295,_=E+(g<<21&4294967295|g>>>11),g=p+(E^(_|~A))+I[8]+1873313359&4294967295,p=_+(g<<6&4294967295|g>>>26),g=A+(_^(p|~E))+I[15]+4264355552&4294967295,A=p+(g<<10&4294967295|g>>>22),g=E+(p^(A|~_))+I[6]+2734768916&4294967295,E=A+(g<<15&4294967295|g>>>17),g=_+(A^(E|~p))+I[13]+1309151649&4294967295,_=E+(g<<21&4294967295|g>>>11),g=p+(E^(_|~A))+I[4]+4149444226&4294967295,p=_+(g<<6&4294967295|g>>>26),g=A+(_^(p|~E))+I[11]+3174756917&4294967295,A=p+(g<<10&4294967295|g>>>22),g=E+(p^(A|~_))+I[2]+718787259&4294967295,E=A+(g<<15&4294967295|g>>>17),g=_+(A^(E|~p))+I[9]+3951481745&4294967295,T.g[0]=T.g[0]+p&4294967295,T.g[1]=T.g[1]+(E+(g<<21&4294967295|g>>>11))&4294967295,T.g[2]=T.g[2]+E&4294967295,T.g[3]=T.g[3]+A&4294967295}r.prototype.v=function(T,p){p===void 0&&(p=T.length);const _=p-this.blockSize,I=this.C;let E=this.h,A=0;for(;A<p;){if(E==0)for(;A<=_;)s(this,T,A),A+=this.blockSize;if(typeof T=="string"){for(;A<p;)if(I[E++]=T.charCodeAt(A++),E==this.blockSize){s(this,I),E=0;break}}else for(;A<p;)if(I[E++]=T[A++],E==this.blockSize){s(this,I),E=0;break}}this.h=E,this.o+=p},r.prototype.A=function(){var T=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);T[0]=128;for(var p=1;p<T.length-8;++p)T[p]=0;p=this.o*8;for(var _=T.length-8;_<T.length;++_)T[_]=p&255,p/=256;for(this.v(T),T=Array(16),p=0,_=0;_<4;++_)for(let I=0;I<32;I+=8)T[p++]=this.g[_]>>>I&255;return T};function o(T,p){var _=u;return Object.prototype.hasOwnProperty.call(_,T)?_[T]:_[T]=p(T)}function a(T,p){this.h=p;const _=[];let I=!0;for(let E=T.length-1;E>=0;E--){const A=T[E]|0;I&&A==p||(_[E]=A,I=!1)}this.g=_}var u={};function h(T){return-128<=T&&T<128?o(T,function(p){return new a([p|0],p<0?-1:0)}):new a([T|0],T<0?-1:0)}function f(T){if(isNaN(T)||!isFinite(T))return y;if(T<0)return k(f(-T));const p=[];let _=1;for(let I=0;T>=_;I++)p[I]=T/_|0,_*=4294967296;return new a(p,0)}function m(T,p){if(T.length==0)throw Error("number format error: empty string");if(p=p||10,p<2||36<p)throw Error("radix out of range: "+p);if(T.charAt(0)=="-")return k(m(T.substring(1),p));if(T.indexOf("-")>=0)throw Error('number format error: interior "-" character');const _=f(Math.pow(p,8));let I=y;for(let A=0;A<T.length;A+=8){var E=Math.min(8,T.length-A);const g=parseInt(T.substring(A,A+E),p);E<8?(E=f(Math.pow(p,E)),I=I.j(E).add(f(g))):(I=I.j(_),I=I.add(f(g)))}return I}var y=h(0),v=h(1),P=h(16777216);n=a.prototype,n.m=function(){if(O(this))return-k(this).m();let T=0,p=1;for(let _=0;_<this.g.length;_++){const I=this.i(_);T+=(I>=0?I:4294967296+I)*p,p*=4294967296}return T},n.toString=function(T){if(T=T||10,T<2||36<T)throw Error("radix out of range: "+T);if(N(this))return"0";if(O(this))return"-"+k(this).toString(T);const p=f(Math.pow(T,6));var _=this;let I="";for(;;){const E=Pt(_,p).g;_=H(_,E.j(p));let A=((_.g.length>0?_.g[0]:_.h)>>>0).toString(T);if(_=E,N(_))return A+I;for(;A.length<6;)A="0"+A;I=A+I}},n.i=function(T){return T<0?0:T<this.g.length?this.g[T]:this.h};function N(T){if(T.h!=0)return!1;for(let p=0;p<T.g.length;p++)if(T.g[p]!=0)return!1;return!0}function O(T){return T.h==-1}n.l=function(T){return T=H(this,T),O(T)?-1:N(T)?0:1};function k(T){const p=T.g.length,_=[];for(let I=0;I<p;I++)_[I]=~T.g[I];return new a(_,~T.h).add(v)}n.abs=function(){return O(this)?k(this):this},n.add=function(T){const p=Math.max(this.g.length,T.g.length),_=[];let I=0;for(let E=0;E<=p;E++){let A=I+(this.i(E)&65535)+(T.i(E)&65535),g=(A>>>16)+(this.i(E)>>>16)+(T.i(E)>>>16);I=g>>>16,A&=65535,g&=65535,_[E]=g<<16|A}return new a(_,_[_.length-1]&-2147483648?-1:0)};function H(T,p){return T.add(k(p))}n.j=function(T){if(N(this)||N(T))return y;if(O(this))return O(T)?k(this).j(k(T)):k(k(this).j(T));if(O(T))return k(this.j(k(T)));if(this.l(P)<0&&T.l(P)<0)return f(this.m()*T.m());const p=this.g.length+T.g.length,_=[];for(var I=0;I<2*p;I++)_[I]=0;for(I=0;I<this.g.length;I++)for(let E=0;E<T.g.length;E++){const A=this.i(I)>>>16,g=this.i(I)&65535,It=T.i(E)>>>16,ge=T.i(E)&65535;_[2*I+2*E]+=g*ge,G(_,2*I+2*E),_[2*I+2*E+1]+=A*ge,G(_,2*I+2*E+1),_[2*I+2*E+1]+=g*It,G(_,2*I+2*E+1),_[2*I+2*E+2]+=A*It,G(_,2*I+2*E+2)}for(T=0;T<p;T++)_[T]=_[2*T+1]<<16|_[2*T];for(T=p;T<2*p;T++)_[T]=0;return new a(_,0)};function G(T,p){for(;(T[p]&65535)!=T[p];)T[p+1]+=T[p]>>>16,T[p]&=65535,p++}function Y(T,p){this.g=T,this.h=p}function Pt(T,p){if(N(p))throw Error("division by zero");if(N(T))return new Y(y,y);if(O(T))return p=Pt(k(T),p),new Y(k(p.g),k(p.h));if(O(p))return p=Pt(T,k(p)),new Y(k(p.g),p.h);if(T.g.length>30){if(O(T)||O(p))throw Error("slowDivide_ only works with positive integers.");for(var _=v,I=p;I.l(T)<=0;)_=ft(_),I=ft(I);var E=dt(_,1),A=dt(I,1);for(I=dt(I,2),_=dt(_,2);!N(I);){var g=A.add(I);g.l(T)<=0&&(E=E.add(_),A=g),I=dt(I,1),_=dt(_,1)}return p=H(T,E.j(p)),new Y(E,p)}for(E=y;T.l(p)>=0;){for(_=Math.max(1,Math.floor(T.m()/p.m())),I=Math.ceil(Math.log(_)/Math.LN2),I=I<=48?1:Math.pow(2,I-48),A=f(_),g=A.j(p);O(g)||g.l(T)>0;)_-=I,A=f(_),g=A.j(p);N(A)&&(A=v),E=E.add(A),T=H(T,g)}return new Y(E,T)}n.B=function(T){return Pt(this,T).h},n.and=function(T){const p=Math.max(this.g.length,T.g.length),_=[];for(let I=0;I<p;I++)_[I]=this.i(I)&T.i(I);return new a(_,this.h&T.h)},n.or=function(T){const p=Math.max(this.g.length,T.g.length),_=[];for(let I=0;I<p;I++)_[I]=this.i(I)|T.i(I);return new a(_,this.h|T.h)},n.xor=function(T){const p=Math.max(this.g.length,T.g.length),_=[];for(let I=0;I<p;I++)_[I]=this.i(I)^T.i(I);return new a(_,this.h^T.h)};function ft(T){const p=T.g.length+1,_=[];for(let I=0;I<p;I++)_[I]=T.i(I)<<1|T.i(I-1)>>>31;return new a(_,T.h)}function dt(T,p){const _=p>>5;p%=32;const I=T.g.length-_,E=[];for(let A=0;A<I;A++)E[A]=p>0?T.i(A+_)>>>p|T.i(A+_+1)<<32-p:T.i(A+_);return new a(E,T.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Mc=r,a.prototype.add=a.prototype.add,a.prototype.multiply=a.prototype.j,a.prototype.modulo=a.prototype.B,a.prototype.compare=a.prototype.l,a.prototype.toNumber=a.prototype.m,a.prototype.toString=a.prototype.toString,a.prototype.getBits=a.prototype.i,a.fromNumber=f,a.fromString=m,ne=a}).apply(typeof pa<"u"?pa:typeof self<"u"?self:typeof window<"u"?window:{});var ur=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var xc,Tn,Lc,mr,Gs,Fc,Uc,Bc;(function(){var n,t=Object.defineProperty;function e(i){i=[typeof globalThis=="object"&&globalThis,i,typeof window=="object"&&window,typeof self=="object"&&self,typeof ur=="object"&&ur];for(var c=0;c<i.length;++c){var l=i[c];if(l&&l.Math==Math)return l}throw Error("Cannot find global object")}var r=e(this);function s(i,c){if(c)t:{var l=r;i=i.split(".");for(var d=0;d<i.length-1;d++){var w=i[d];if(!(w in l))break t;l=l[w]}i=i[i.length-1],d=l[i],c=c(d),c!=d&&c!=null&&t(l,i,{configurable:!0,writable:!0,value:c})}}s("Symbol.dispose",function(i){return i||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(i){return i||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(i){return i||function(c){var l=[],d;for(d in c)Object.prototype.hasOwnProperty.call(c,d)&&l.push([d,c[d]]);return l}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var o=o||{},a=this||self;function u(i){var c=typeof i;return c=="object"&&i!=null||c=="function"}function h(i,c,l){return i.call.apply(i.bind,arguments)}function f(i,c,l){return f=h,f.apply(null,arguments)}function m(i,c){var l=Array.prototype.slice.call(arguments,1);return function(){var d=l.slice();return d.push.apply(d,arguments),i.apply(this,d)}}function y(i,c){function l(){}l.prototype=c.prototype,i.Z=c.prototype,i.prototype=new l,i.prototype.constructor=i,i.Ob=function(d,w,R){for(var C=Array(arguments.length-2),U=2;U<arguments.length;U++)C[U-2]=arguments[U];return c.prototype[w].apply(d,C)}}var v=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?i=>i&&AsyncContext.Snapshot.wrap(i):i=>i;function P(i){const c=i.length;if(c>0){const l=Array(c);for(let d=0;d<c;d++)l[d]=i[d];return l}return[]}function N(i,c){for(let d=1;d<arguments.length;d++){const w=arguments[d];var l=typeof w;if(l=l!="object"?l:w?Array.isArray(w)?"array":l:"null",l=="array"||l=="object"&&typeof w.length=="number"){l=i.length||0;const R=w.length||0;i.length=l+R;for(let C=0;C<R;C++)i[l+C]=w[C]}else i.push(w)}}class O{constructor(c,l){this.i=c,this.j=l,this.h=0,this.g=null}get(){let c;return this.h>0?(this.h--,c=this.g,this.g=c.next,c.next=null):c=this.i(),c}}function k(i){a.setTimeout(()=>{throw i},0)}function H(){var i=T;let c=null;return i.g&&(c=i.g,i.g=i.g.next,i.g||(i.h=null),c.next=null),c}class G{constructor(){this.h=this.g=null}add(c,l){const d=Y.get();d.set(c,l),this.h?this.h.next=d:this.g=d,this.h=d}}var Y=new O(()=>new Pt,i=>i.reset());class Pt{constructor(){this.next=this.g=this.h=null}set(c,l){this.h=c,this.g=l,this.next=null}reset(){this.next=this.g=this.h=null}}let ft,dt=!1,T=new G,p=()=>{const i=Promise.resolve(void 0);ft=()=>{i.then(_)}};function _(){for(var i;i=H();){try{i.h.call(i.g)}catch(l){k(l)}var c=Y;c.j(i),c.h<100&&(c.h++,i.next=c.g,c.g=i)}dt=!1}function I(){this.u=this.u,this.C=this.C}I.prototype.u=!1,I.prototype.dispose=function(){this.u||(this.u=!0,this.N())},I.prototype[Symbol.dispose]=function(){this.dispose()},I.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function E(i,c){this.type=i,this.g=this.target=c,this.defaultPrevented=!1}E.prototype.h=function(){this.defaultPrevented=!0};var A=(function(){if(!a.addEventListener||!Object.defineProperty)return!1;var i=!1,c=Object.defineProperty({},"passive",{get:function(){i=!0}});try{const l=()=>{};a.addEventListener("test",l,c),a.removeEventListener("test",l,c)}catch{}return i})();function g(i){return/^[\s\xa0]*$/.test(i)}function It(i,c){E.call(this,i?i.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,i&&this.init(i,c)}y(It,E),It.prototype.init=function(i,c){const l=this.type=i.type,d=i.changedTouches&&i.changedTouches.length?i.changedTouches[0]:null;this.target=i.target||i.srcElement,this.g=c,c=i.relatedTarget,c||(l=="mouseover"?c=i.fromElement:l=="mouseout"&&(c=i.toElement)),this.relatedTarget=c,d?(this.clientX=d.clientX!==void 0?d.clientX:d.pageX,this.clientY=d.clientY!==void 0?d.clientY:d.pageY,this.screenX=d.screenX||0,this.screenY=d.screenY||0):(this.clientX=i.clientX!==void 0?i.clientX:i.pageX,this.clientY=i.clientY!==void 0?i.clientY:i.pageY,this.screenX=i.screenX||0,this.screenY=i.screenY||0),this.button=i.button,this.key=i.key||"",this.ctrlKey=i.ctrlKey,this.altKey=i.altKey,this.shiftKey=i.shiftKey,this.metaKey=i.metaKey,this.pointerId=i.pointerId||0,this.pointerType=i.pointerType,this.state=i.state,this.i=i,i.defaultPrevented&&It.Z.h.call(this)},It.prototype.h=function(){It.Z.h.call(this);const i=this.i;i.preventDefault?i.preventDefault():i.returnValue=!1};var ge="closure_listenable_"+(Math.random()*1e6|0),Ul=0;function Bl(i,c,l,d,w){this.listener=i,this.proxy=null,this.src=c,this.type=l,this.capture=!!d,this.ha=w,this.key=++Ul,this.da=this.fa=!1}function Wn(i){i.da=!0,i.listener=null,i.proxy=null,i.src=null,i.ha=null}function Qn(i,c,l){for(const d in i)c.call(l,i[d],d,i)}function ql(i,c){for(const l in i)c.call(void 0,i[l],l,i)}function no(i){const c={};for(const l in i)c[l]=i[l];return c}const ro="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function so(i,c){let l,d;for(let w=1;w<arguments.length;w++){d=arguments[w];for(l in d)i[l]=d[l];for(let R=0;R<ro.length;R++)l=ro[R],Object.prototype.hasOwnProperty.call(d,l)&&(i[l]=d[l])}}function Jn(i){this.src=i,this.g={},this.h=0}Jn.prototype.add=function(i,c,l,d,w){const R=i.toString();i=this.g[R],i||(i=this.g[R]=[],this.h++);const C=rs(i,c,d,w);return C>-1?(c=i[C],l||(c.fa=!1)):(c=new Bl(c,this.src,R,!!d,w),c.fa=l,i.push(c)),c};function ns(i,c){const l=c.type;if(l in i.g){var d=i.g[l],w=Array.prototype.indexOf.call(d,c,void 0),R;(R=w>=0)&&Array.prototype.splice.call(d,w,1),R&&(Wn(c),i.g[l].length==0&&(delete i.g[l],i.h--))}}function rs(i,c,l,d){for(let w=0;w<i.length;++w){const R=i[w];if(!R.da&&R.listener==c&&R.capture==!!l&&R.ha==d)return w}return-1}var ss="closure_lm_"+(Math.random()*1e6|0),is={};function io(i,c,l,d,w){if(Array.isArray(c)){for(let R=0;R<c.length;R++)io(i,c[R],l,d,w);return null}return l=co(l),i&&i[ge]?i.J(c,l,u(d)?!!d.capture:!1,w):jl(i,c,l,!1,d,w)}function jl(i,c,l,d,w,R){if(!c)throw Error("Invalid event type");const C=u(w)?!!w.capture:!!w;let U=as(i);if(U||(i[ss]=U=new Jn(i)),l=U.add(c,l,d,C,R),l.proxy)return l;if(d=$l(),l.proxy=d,d.src=i,d.listener=l,i.addEventListener)A||(w=C),w===void 0&&(w=!1),i.addEventListener(c.toString(),d,w);else if(i.attachEvent)i.attachEvent(ao(c.toString()),d);else if(i.addListener&&i.removeListener)i.addListener(d);else throw Error("addEventListener and attachEvent are unavailable.");return l}function $l(){function i(l){return c.call(i.src,i.listener,l)}const c=zl;return i}function oo(i,c,l,d,w){if(Array.isArray(c))for(var R=0;R<c.length;R++)oo(i,c[R],l,d,w);else d=u(d)?!!d.capture:!!d,l=co(l),i&&i[ge]?(i=i.i,R=String(c).toString(),R in i.g&&(c=i.g[R],l=rs(c,l,d,w),l>-1&&(Wn(c[l]),Array.prototype.splice.call(c,l,1),c.length==0&&(delete i.g[R],i.h--)))):i&&(i=as(i))&&(c=i.g[c.toString()],i=-1,c&&(i=rs(c,l,d,w)),(l=i>-1?c[i]:null)&&os(l))}function os(i){if(typeof i!="number"&&i&&!i.da){var c=i.src;if(c&&c[ge])ns(c.i,i);else{var l=i.type,d=i.proxy;c.removeEventListener?c.removeEventListener(l,d,i.capture):c.detachEvent?c.detachEvent(ao(l),d):c.addListener&&c.removeListener&&c.removeListener(d),(l=as(c))?(ns(l,i),l.h==0&&(l.src=null,c[ss]=null)):Wn(i)}}}function ao(i){return i in is?is[i]:is[i]="on"+i}function zl(i,c){if(i.da)i=!0;else{c=new It(c,this);const l=i.listener,d=i.ha||i.src;i.fa&&os(i),i=l.call(d,c)}return i}function as(i){return i=i[ss],i instanceof Jn?i:null}var cs="__closure_events_fn_"+(Math.random()*1e9>>>0);function co(i){return typeof i=="function"?i:(i[cs]||(i[cs]=function(c){return i.handleEvent(c)}),i[cs])}function mt(){I.call(this),this.i=new Jn(this),this.M=this,this.G=null}y(mt,I),mt.prototype[ge]=!0,mt.prototype.removeEventListener=function(i,c,l,d){oo(this,i,c,l,d)};function yt(i,c){var l,d=i.G;if(d)for(l=[];d;d=d.G)l.push(d);if(i=i.M,d=c.type||c,typeof c=="string")c=new E(c,i);else if(c instanceof E)c.target=c.target||i;else{var w=c;c=new E(d,i),so(c,w)}w=!0;let R,C;if(l)for(C=l.length-1;C>=0;C--)R=c.g=l[C],w=Xn(R,d,!0,c)&&w;if(R=c.g=i,w=Xn(R,d,!0,c)&&w,w=Xn(R,d,!1,c)&&w,l)for(C=0;C<l.length;C++)R=c.g=l[C],w=Xn(R,d,!1,c)&&w}mt.prototype.N=function(){if(mt.Z.N.call(this),this.i){var i=this.i;for(const c in i.g){const l=i.g[c];for(let d=0;d<l.length;d++)Wn(l[d]);delete i.g[c],i.h--}}this.G=null},mt.prototype.J=function(i,c,l,d){return this.i.add(String(i),c,!1,l,d)},mt.prototype.K=function(i,c,l,d){return this.i.add(String(i),c,!0,l,d)};function Xn(i,c,l,d){if(c=i.i.g[String(c)],!c)return!0;c=c.concat();let w=!0;for(let R=0;R<c.length;++R){const C=c[R];if(C&&!C.da&&C.capture==l){const U=C.listener,it=C.ha||C.src;C.fa&&ns(i.i,C),w=U.call(it,d)!==!1&&w}}return w&&!d.defaultPrevented}function Gl(i,c){if(typeof i!="function")if(i&&typeof i.handleEvent=="function")i=f(i.handleEvent,i);else throw Error("Invalid listener argument");return Number(c)>2147483647?-1:a.setTimeout(i,c||0)}function uo(i){i.g=Gl(()=>{i.g=null,i.i&&(i.i=!1,uo(i))},i.l);const c=i.h;i.h=null,i.m.apply(null,c)}class Kl extends I{constructor(c,l){super(),this.m=c,this.l=l,this.h=null,this.i=!1,this.g=null}j(c){this.h=arguments,this.g?this.i=!0:uo(this)}N(){super.N(),this.g&&(a.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function en(i){I.call(this),this.h=i,this.g={}}y(en,I);var lo=[];function ho(i){Qn(i.g,function(c,l){this.g.hasOwnProperty(l)&&os(c)},i),i.g={}}en.prototype.N=function(){en.Z.N.call(this),ho(this)},en.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var us=a.JSON.stringify,Hl=a.JSON.parse,Wl=class{stringify(i){return a.JSON.stringify(i,void 0)}parse(i){return a.JSON.parse(i,void 0)}};function fo(){}function mo(){}var nn={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function ls(){E.call(this,"d")}y(ls,E);function hs(){E.call(this,"c")}y(hs,E);var _e={},po=null;function Yn(){return po=po||new mt}_e.Ia="serverreachability";function go(i){E.call(this,_e.Ia,i)}y(go,E);function rn(i){const c=Yn();yt(c,new go(c))}_e.STAT_EVENT="statevent";function _o(i,c){E.call(this,_e.STAT_EVENT,i),this.stat=c}y(_o,E);function Et(i){const c=Yn();yt(c,new _o(c,i))}_e.Ja="timingevent";function yo(i,c){E.call(this,_e.Ja,i),this.size=c}y(yo,E);function sn(i,c){if(typeof i!="function")throw Error("Fn must not be null and must be a function");return a.setTimeout(function(){i()},c)}function on(){this.g=!0}on.prototype.ua=function(){this.g=!1};function Ql(i,c,l,d,w,R){i.info(function(){if(i.g)if(R){var C="",U=R.split("&");for(let K=0;K<U.length;K++){var it=U[K].split("=");if(it.length>1){const at=it[0];it=it[1];const Ot=at.split("_");C=Ot.length>=2&&Ot[1]=="type"?C+(at+"="+it+"&"):C+(at+"=redacted&")}}}else C=null;else C=R;return"XMLHTTP REQ ("+d+") [attempt "+w+"]: "+c+`
`+l+`
`+C})}function Jl(i,c,l,d,w,R,C){i.info(function(){return"XMLHTTP RESP ("+d+") [ attempt "+w+"]: "+c+`
`+l+`
`+R+" "+C})}function ke(i,c,l,d){i.info(function(){return"XMLHTTP TEXT ("+c+"): "+Yl(i,l)+(d?" "+d:"")})}function Xl(i,c){i.info(function(){return"TIMEOUT: "+c})}on.prototype.info=function(){};function Yl(i,c){if(!i.g)return c;if(!c)return null;try{const R=JSON.parse(c);if(R){for(i=0;i<R.length;i++)if(Array.isArray(R[i])){var l=R[i];if(!(l.length<2)){var d=l[1];if(Array.isArray(d)&&!(d.length<1)){var w=d[0];if(w!="noop"&&w!="stop"&&w!="close")for(let C=1;C<d.length;C++)d[C]=""}}}}return us(R)}catch{return c}}var Zn={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},Eo={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},To;function fs(){}y(fs,fo),fs.prototype.g=function(){return new XMLHttpRequest},To=new fs;function an(i){return encodeURIComponent(String(i))}function Zl(i){var c=1;i=i.split(":");const l=[];for(;c>0&&i.length;)l.push(i.shift()),c--;return i.length&&l.push(i.join(":")),l}function Wt(i,c,l,d){this.j=i,this.i=c,this.l=l,this.S=d||1,this.V=new en(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new Io}function Io(){this.i=null,this.g="",this.h=!1}var wo={},ds={};function ms(i,c,l){i.M=1,i.A=er(kt(c)),i.u=l,i.R=!0,vo(i,null)}function vo(i,c){i.F=Date.now(),tr(i),i.B=kt(i.A);var l=i.B,d=i.S;Array.isArray(d)||(d=[String(d)]),xo(l.i,"t",d),i.C=0,l=i.j.L,i.h=new Io,i.g=ta(i.j,l?c:null,!i.u),i.P>0&&(i.O=new Kl(f(i.Y,i,i.g),i.P)),c=i.V,l=i.g,d=i.ba;var w="readystatechange";Array.isArray(w)||(w&&(lo[0]=w.toString()),w=lo);for(let R=0;R<w.length;R++){const C=io(l,w[R],d||c.handleEvent,!1,c.h||c);if(!C)break;c.g[C.key]=C}c=i.J?no(i.J):{},i.u?(i.v||(i.v="POST"),c["Content-Type"]="application/x-www-form-urlencoded",i.g.ea(i.B,i.v,i.u,c)):(i.v="GET",i.g.ea(i.B,i.v,null,c)),rn(),Ql(i.i,i.v,i.B,i.l,i.S,i.u)}Wt.prototype.ba=function(i){i=i.target;const c=this.O;c&&Xt(i)==3?c.j():this.Y(i)},Wt.prototype.Y=function(i){try{if(i==this.g)t:{const U=Xt(this.g),it=this.g.ya(),K=this.g.ca();if(!(U<3)&&(U!=3||this.g&&(this.h.h||this.g.la()||$o(this.g)))){this.K||U!=4||it==7||(it==8||K<=0?rn(3):rn(2)),ps(this);var c=this.g.ca();this.X=c;var l=th(this);if(this.o=c==200,Jl(this.i,this.v,this.B,this.l,this.S,U,c),this.o){if(this.U&&!this.L){e:{if(this.g){var d,w=this.g;if((d=w.g?w.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!g(d)){var R=d;break e}}R=null}if(i=R)ke(this.i,this.l,i,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,gs(this,i);else{this.o=!1,this.m=3,Et(12),ye(this),cn(this);break t}}if(this.R){i=!0;let at;for(;!this.K&&this.C<l.length;)if(at=eh(this,l),at==ds){U==4&&(this.m=4,Et(14),i=!1),ke(this.i,this.l,null,"[Incomplete Response]");break}else if(at==wo){this.m=4,Et(15),ke(this.i,this.l,l,"[Invalid Chunk]"),i=!1;break}else ke(this.i,this.l,at,null),gs(this,at);if(Ao(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),U!=4||l.length!=0||this.h.h||(this.m=1,Et(16),i=!1),this.o=this.o&&i,!i)ke(this.i,this.l,l,"[Invalid Chunked Response]"),ye(this),cn(this);else if(l.length>0&&!this.W){this.W=!0;var C=this.j;C.g==this&&C.aa&&!C.P&&(C.j.info("Great, no buffering proxy detected. Bytes received: "+l.length),As(C),C.P=!0,Et(11))}}else ke(this.i,this.l,l,null),gs(this,l);U==4&&ye(this),this.o&&!this.K&&(U==4?Jo(this.j,this):(this.o=!1,tr(this)))}else ph(this.g),c==400&&l.indexOf("Unknown SID")>0?(this.m=3,Et(12)):(this.m=0,Et(13)),ye(this),cn(this)}}}catch{}finally{}};function th(i){if(!Ao(i))return i.g.la();const c=$o(i.g);if(c==="")return"";let l="";const d=c.length,w=Xt(i.g)==4;if(!i.h.i){if(typeof TextDecoder>"u")return ye(i),cn(i),"";i.h.i=new a.TextDecoder}for(let R=0;R<d;R++)i.h.h=!0,l+=i.h.i.decode(c[R],{stream:!(w&&R==d-1)});return c.length=0,i.h.g+=l,i.C=0,i.h.g}function Ao(i){return i.g?i.v=="GET"&&i.M!=2&&i.j.Aa:!1}function eh(i,c){var l=i.C,d=c.indexOf(`
`,l);return d==-1?ds:(l=Number(c.substring(l,d)),isNaN(l)?wo:(d+=1,d+l>c.length?ds:(c=c.slice(d,d+l),i.C=d+l,c)))}Wt.prototype.cancel=function(){this.K=!0,ye(this)};function tr(i){i.T=Date.now()+i.H,Ro(i,i.H)}function Ro(i,c){if(i.D!=null)throw Error("WatchDog timer not null");i.D=sn(f(i.aa,i),c)}function ps(i){i.D&&(a.clearTimeout(i.D),i.D=null)}Wt.prototype.aa=function(){this.D=null;const i=Date.now();i-this.T>=0?(Xl(this.i,this.B),this.M!=2&&(rn(),Et(17)),ye(this),this.m=2,cn(this)):Ro(this,this.T-i)};function cn(i){i.j.I==0||i.K||Jo(i.j,i)}function ye(i){ps(i);var c=i.O;c&&typeof c.dispose=="function"&&c.dispose(),i.O=null,ho(i.V),i.g&&(c=i.g,i.g=null,c.abort(),c.dispose())}function gs(i,c){try{var l=i.j;if(l.I!=0&&(l.g==i||_s(l.h,i))){if(!i.L&&_s(l.h,i)&&l.I==3){try{var d=l.Ba.g.parse(c)}catch{d=null}if(Array.isArray(d)&&d.length==3){var w=d;if(w[0]==0){t:if(!l.v){if(l.g)if(l.g.F+3e3<i.F)or(l),sr(l);else break t;vs(l),Et(18)}}else l.xa=w[1],0<l.xa-l.K&&w[2]<37500&&l.F&&l.A==0&&!l.C&&(l.C=sn(f(l.Va,l),6e3));Po(l.h)<=1&&l.ta&&(l.ta=void 0)}else Te(l,11)}else if((i.L||l.g==i)&&or(l),!g(c))for(w=l.Ba.g.parse(c),c=0;c<w.length;c++){let K=w[c];const at=K[0];if(!(at<=l.K))if(l.K=at,K=K[1],l.I==2)if(K[0]=="c"){l.M=K[1],l.ba=K[2];const Ot=K[3];Ot!=null&&(l.ka=Ot,l.j.info("VER="+l.ka));const Ie=K[4];Ie!=null&&(l.za=Ie,l.j.info("SVER="+l.za));const Yt=K[5];Yt!=null&&typeof Yt=="number"&&Yt>0&&(d=1.5*Yt,l.O=d,l.j.info("backChannelRequestTimeoutMs_="+d)),d=l;const Zt=i.g;if(Zt){const cr=Zt.g?Zt.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(cr){var R=d.h;R.g||cr.indexOf("spdy")==-1&&cr.indexOf("quic")==-1&&cr.indexOf("h2")==-1||(R.j=R.l,R.g=new Set,R.h&&(ys(R,R.h),R.h=null))}if(d.G){const Rs=Zt.g?Zt.g.getResponseHeader("X-HTTP-Session-Id"):null;Rs&&(d.wa=Rs,Q(d.J,d.G,Rs))}}l.I=3,l.l&&l.l.ra(),l.aa&&(l.T=Date.now()-i.F,l.j.info("Handshake RTT: "+l.T+"ms")),d=l;var C=i;if(d.na=Zo(d,d.L?d.ba:null,d.W),C.L){Co(d.h,C);var U=C,it=d.O;it&&(U.H=it),U.D&&(ps(U),tr(U)),d.g=C}else Wo(d);l.i.length>0&&ir(l)}else K[0]!="stop"&&K[0]!="close"||Te(l,7);else l.I==3&&(K[0]=="stop"||K[0]=="close"?K[0]=="stop"?Te(l,7):ws(l):K[0]!="noop"&&l.l&&l.l.qa(K),l.A=0)}}rn(4)}catch{}}var nh=class{constructor(i,c){this.g=i,this.map=c}};function bo(i){this.l=i||10,a.PerformanceNavigationTiming?(i=a.performance.getEntriesByType("navigation"),i=i.length>0&&(i[0].nextHopProtocol=="hq"||i[0].nextHopProtocol=="h2")):i=!!(a.chrome&&a.chrome.loadTimes&&a.chrome.loadTimes()&&a.chrome.loadTimes().wasFetchedViaSpdy),this.j=i?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function So(i){return i.h?!0:i.g?i.g.size>=i.j:!1}function Po(i){return i.h?1:i.g?i.g.size:0}function _s(i,c){return i.h?i.h==c:i.g?i.g.has(c):!1}function ys(i,c){i.g?i.g.add(c):i.h=c}function Co(i,c){i.h&&i.h==c?i.h=null:i.g&&i.g.has(c)&&i.g.delete(c)}bo.prototype.cancel=function(){if(this.i=Vo(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const i of this.g.values())i.cancel();this.g.clear()}};function Vo(i){if(i.h!=null)return i.i.concat(i.h.G);if(i.g!=null&&i.g.size!==0){let c=i.i;for(const l of i.g.values())c=c.concat(l.G);return c}return P(i.i)}var Do=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function rh(i,c){if(i){i=i.split("&");for(let l=0;l<i.length;l++){const d=i[l].indexOf("=");let w,R=null;d>=0?(w=i[l].substring(0,d),R=i[l].substring(d+1)):w=i[l],c(w,R?decodeURIComponent(R.replace(/\+/g," ")):"")}}}function Qt(i){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let c;i instanceof Qt?(this.l=i.l,un(this,i.j),this.o=i.o,this.g=i.g,ln(this,i.u),this.h=i.h,Es(this,Lo(i.i)),this.m=i.m):i&&(c=String(i).match(Do))?(this.l=!1,un(this,c[1]||"",!0),this.o=hn(c[2]||""),this.g=hn(c[3]||"",!0),ln(this,c[4]),this.h=hn(c[5]||"",!0),Es(this,c[6]||"",!0),this.m=hn(c[7]||"")):(this.l=!1,this.i=new dn(null,this.l))}Qt.prototype.toString=function(){const i=[];var c=this.j;c&&i.push(fn(c,No,!0),":");var l=this.g;return(l||c=="file")&&(i.push("//"),(c=this.o)&&i.push(fn(c,No,!0),"@"),i.push(an(l).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),l=this.u,l!=null&&i.push(":",String(l))),(l=this.h)&&(this.g&&l.charAt(0)!="/"&&i.push("/"),i.push(fn(l,l.charAt(0)=="/"?oh:ih,!0))),(l=this.i.toString())&&i.push("?",l),(l=this.m)&&i.push("#",fn(l,ch)),i.join("")},Qt.prototype.resolve=function(i){const c=kt(this);let l=!!i.j;l?un(c,i.j):l=!!i.o,l?c.o=i.o:l=!!i.g,l?c.g=i.g:l=i.u!=null;var d=i.h;if(l)ln(c,i.u);else if(l=!!i.h){if(d.charAt(0)!="/")if(this.g&&!this.h)d="/"+d;else{var w=c.h.lastIndexOf("/");w!=-1&&(d=c.h.slice(0,w+1)+d)}if(w=d,w==".."||w==".")d="";else if(w.indexOf("./")!=-1||w.indexOf("/.")!=-1){d=w.lastIndexOf("/",0)==0,w=w.split("/");const R=[];for(let C=0;C<w.length;){const U=w[C++];U=="."?d&&C==w.length&&R.push(""):U==".."?((R.length>1||R.length==1&&R[0]!="")&&R.pop(),d&&C==w.length&&R.push("")):(R.push(U),d=!0)}d=R.join("/")}else d=w}return l?c.h=d:l=i.i.toString()!=="",l?Es(c,Lo(i.i)):l=!!i.m,l&&(c.m=i.m),c};function kt(i){return new Qt(i)}function un(i,c,l){i.j=l?hn(c,!0):c,i.j&&(i.j=i.j.replace(/:$/,""))}function ln(i,c){if(c){if(c=Number(c),isNaN(c)||c<0)throw Error("Bad port number "+c);i.u=c}else i.u=null}function Es(i,c,l){c instanceof dn?(i.i=c,uh(i.i,i.l)):(l||(c=fn(c,ah)),i.i=new dn(c,i.l))}function Q(i,c,l){i.i.set(c,l)}function er(i){return Q(i,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),i}function hn(i,c){return i?c?decodeURI(i.replace(/%25/g,"%2525")):decodeURIComponent(i):""}function fn(i,c,l){return typeof i=="string"?(i=encodeURI(i).replace(c,sh),l&&(i=i.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),i):null}function sh(i){return i=i.charCodeAt(0),"%"+(i>>4&15).toString(16)+(i&15).toString(16)}var No=/[#\/\?@]/g,ih=/[#\?:]/g,oh=/[#\?]/g,ah=/[#\?@]/g,ch=/#/g;function dn(i,c){this.h=this.g=null,this.i=i||null,this.j=!!c}function Ee(i){i.g||(i.g=new Map,i.h=0,i.i&&rh(i.i,function(c,l){i.add(decodeURIComponent(c.replace(/\+/g," ")),l)}))}n=dn.prototype,n.add=function(i,c){Ee(this),this.i=null,i=Oe(this,i);let l=this.g.get(i);return l||this.g.set(i,l=[]),l.push(c),this.h+=1,this};function ko(i,c){Ee(i),c=Oe(i,c),i.g.has(c)&&(i.i=null,i.h-=i.g.get(c).length,i.g.delete(c))}function Oo(i,c){return Ee(i),c=Oe(i,c),i.g.has(c)}n.forEach=function(i,c){Ee(this),this.g.forEach(function(l,d){l.forEach(function(w){i.call(c,w,d,this)},this)},this)};function Mo(i,c){Ee(i);let l=[];if(typeof c=="string")Oo(i,c)&&(l=l.concat(i.g.get(Oe(i,c))));else for(i=Array.from(i.g.values()),c=0;c<i.length;c++)l=l.concat(i[c]);return l}n.set=function(i,c){return Ee(this),this.i=null,i=Oe(this,i),Oo(this,i)&&(this.h-=this.g.get(i).length),this.g.set(i,[c]),this.h+=1,this},n.get=function(i,c){return i?(i=Mo(this,i),i.length>0?String(i[0]):c):c};function xo(i,c,l){ko(i,c),l.length>0&&(i.i=null,i.g.set(Oe(i,c),P(l)),i.h+=l.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const i=[],c=Array.from(this.g.keys());for(let d=0;d<c.length;d++){var l=c[d];const w=an(l);l=Mo(this,l);for(let R=0;R<l.length;R++){let C=w;l[R]!==""&&(C+="="+an(l[R])),i.push(C)}}return this.i=i.join("&")};function Lo(i){const c=new dn;return c.i=i.i,i.g&&(c.g=new Map(i.g),c.h=i.h),c}function Oe(i,c){return c=String(c),i.j&&(c=c.toLowerCase()),c}function uh(i,c){c&&!i.j&&(Ee(i),i.i=null,i.g.forEach(function(l,d){const w=d.toLowerCase();d!=w&&(ko(this,d),xo(this,w,l))},i)),i.j=c}function lh(i,c){const l=new on;if(a.Image){const d=new Image;d.onload=m(Jt,l,"TestLoadImage: loaded",!0,c,d),d.onerror=m(Jt,l,"TestLoadImage: error",!1,c,d),d.onabort=m(Jt,l,"TestLoadImage: abort",!1,c,d),d.ontimeout=m(Jt,l,"TestLoadImage: timeout",!1,c,d),a.setTimeout(function(){d.ontimeout&&d.ontimeout()},1e4),d.src=i}else c(!1)}function hh(i,c){const l=new on,d=new AbortController,w=setTimeout(()=>{d.abort(),Jt(l,"TestPingServer: timeout",!1,c)},1e4);fetch(i,{signal:d.signal}).then(R=>{clearTimeout(w),R.ok?Jt(l,"TestPingServer: ok",!0,c):Jt(l,"TestPingServer: server error",!1,c)}).catch(()=>{clearTimeout(w),Jt(l,"TestPingServer: error",!1,c)})}function Jt(i,c,l,d,w){try{w&&(w.onload=null,w.onerror=null,w.onabort=null,w.ontimeout=null),d(l)}catch{}}function fh(){this.g=new Wl}function Ts(i){this.i=i.Sb||null,this.h=i.ab||!1}y(Ts,fo),Ts.prototype.g=function(){return new nr(this.i,this.h)};function nr(i,c){mt.call(this),this.H=i,this.o=c,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}y(nr,mt),n=nr.prototype,n.open=function(i,c){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=i,this.D=c,this.readyState=1,pn(this)},n.send=function(i){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const c={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};i&&(c.body=i),(this.H||a).fetch(new Request(this.D,c)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,mn(this)),this.readyState=0},n.Pa=function(i){if(this.g&&(this.l=i,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=i.headers,this.readyState=2,pn(this)),this.g&&(this.readyState=3,pn(this),this.g)))if(this.responseType==="arraybuffer")i.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof a.ReadableStream<"u"&&"body"in i){if(this.j=i.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Fo(this)}else i.text().then(this.Oa.bind(this),this.ga.bind(this))};function Fo(i){i.j.read().then(i.Ma.bind(i)).catch(i.ga.bind(i))}n.Ma=function(i){if(this.g){if(this.o&&i.value)this.response.push(i.value);else if(!this.o){var c=i.value?i.value:new Uint8Array(0);(c=this.B.decode(c,{stream:!i.done}))&&(this.response=this.responseText+=c)}i.done?mn(this):pn(this),this.readyState==3&&Fo(this)}},n.Oa=function(i){this.g&&(this.response=this.responseText=i,mn(this))},n.Na=function(i){this.g&&(this.response=i,mn(this))},n.ga=function(){this.g&&mn(this)};function mn(i){i.readyState=4,i.l=null,i.j=null,i.B=null,pn(i)}n.setRequestHeader=function(i,c){this.A.append(i,c)},n.getResponseHeader=function(i){return this.h&&this.h.get(i.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const i=[],c=this.h.entries();for(var l=c.next();!l.done;)l=l.value,i.push(l[0]+": "+l[1]),l=c.next();return i.join(`\r
`)};function pn(i){i.onreadystatechange&&i.onreadystatechange.call(i)}Object.defineProperty(nr.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(i){this.m=i?"include":"same-origin"}});function Uo(i){let c="";return Qn(i,function(l,d){c+=d,c+=":",c+=l,c+=`\r
`}),c}function Is(i,c,l){t:{for(d in l){var d=!1;break t}d=!0}d||(l=Uo(l),typeof i=="string"?l!=null&&an(l):Q(i,c,l))}function Z(i){mt.call(this),this.headers=new Map,this.L=i||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}y(Z,mt);var dh=/^https?$/i,mh=["POST","PUT"];n=Z.prototype,n.Fa=function(i){this.H=i},n.ea=function(i,c,l,d){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+i);c=c?c.toUpperCase():"GET",this.D=i,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():To.g(),this.g.onreadystatechange=v(f(this.Ca,this));try{this.B=!0,this.g.open(c,String(i),!0),this.B=!1}catch(R){Bo(this,R);return}if(i=l||"",l=new Map(this.headers),d)if(Object.getPrototypeOf(d)===Object.prototype)for(var w in d)l.set(w,d[w]);else if(typeof d.keys=="function"&&typeof d.get=="function")for(const R of d.keys())l.set(R,d.get(R));else throw Error("Unknown input type for opt_headers: "+String(d));d=Array.from(l.keys()).find(R=>R.toLowerCase()=="content-type"),w=a.FormData&&i instanceof a.FormData,!(Array.prototype.indexOf.call(mh,c,void 0)>=0)||d||w||l.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[R,C]of l)this.g.setRequestHeader(R,C);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(i),this.v=!1}catch(R){Bo(this,R)}};function Bo(i,c){i.h=!1,i.g&&(i.j=!0,i.g.abort(),i.j=!1),i.l=c,i.o=5,qo(i),rr(i)}function qo(i){i.A||(i.A=!0,yt(i,"complete"),yt(i,"error"))}n.abort=function(i){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=i||7,yt(this,"complete"),yt(this,"abort"),rr(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),rr(this,!0)),Z.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?jo(this):this.Xa())},n.Xa=function(){jo(this)};function jo(i){if(i.h&&typeof o<"u"){if(i.v&&Xt(i)==4)setTimeout(i.Ca.bind(i),0);else if(yt(i,"readystatechange"),Xt(i)==4){i.h=!1;try{const R=i.ca();t:switch(R){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var c=!0;break t;default:c=!1}var l;if(!(l=c)){var d;if(d=R===0){let C=String(i.D).match(Do)[1]||null;!C&&a.self&&a.self.location&&(C=a.self.location.protocol.slice(0,-1)),d=!dh.test(C?C.toLowerCase():"")}l=d}if(l)yt(i,"complete"),yt(i,"success");else{i.o=6;try{var w=Xt(i)>2?i.g.statusText:""}catch{w=""}i.l=w+" ["+i.ca()+"]",qo(i)}}finally{rr(i)}}}}function rr(i,c){if(i.g){i.m&&(clearTimeout(i.m),i.m=null);const l=i.g;i.g=null,c||yt(i,"ready");try{l.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function Xt(i){return i.g?i.g.readyState:0}n.ca=function(){try{return Xt(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(i){if(this.g){var c=this.g.responseText;return i&&c.indexOf(i)==0&&(c=c.substring(i.length)),Hl(c)}};function $o(i){try{if(!i.g)return null;if("response"in i.g)return i.g.response;switch(i.F){case"":case"text":return i.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in i.g)return i.g.mozResponseArrayBuffer}return null}catch{return null}}function ph(i){const c={};i=(i.g&&Xt(i)>=2&&i.g.getAllResponseHeaders()||"").split(`\r
`);for(let d=0;d<i.length;d++){if(g(i[d]))continue;var l=Zl(i[d]);const w=l[0];if(l=l[1],typeof l!="string")continue;l=l.trim();const R=c[w]||[];c[w]=R,R.push(l)}ql(c,function(d){return d.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function gn(i,c,l){return l&&l.internalChannelParams&&l.internalChannelParams[i]||c}function zo(i){this.za=0,this.i=[],this.j=new on,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=gn("failFast",!1,i),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=gn("baseRetryDelayMs",5e3,i),this.Za=gn("retryDelaySeedMs",1e4,i),this.Ta=gn("forwardChannelMaxRetries",2,i),this.va=gn("forwardChannelRequestTimeoutMs",2e4,i),this.ma=i&&i.xmlHttpFactory||void 0,this.Ua=i&&i.Rb||void 0,this.Aa=i&&i.useFetchStreams||!1,this.O=void 0,this.L=i&&i.supportsCrossDomainXhr||!1,this.M="",this.h=new bo(i&&i.concurrentRequestLimit),this.Ba=new fh,this.S=i&&i.fastHandshake||!1,this.R=i&&i.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=i&&i.Pb||!1,i&&i.ua&&this.j.ua(),i&&i.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&i&&i.detectBufferingProxy||!1,this.ia=void 0,i&&i.longPollingTimeout&&i.longPollingTimeout>0&&(this.ia=i.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=zo.prototype,n.ka=8,n.I=1,n.connect=function(i,c,l,d){Et(0),this.W=i,this.H=c||{},l&&d!==void 0&&(this.H.OSID=l,this.H.OAID=d),this.F=this.X,this.J=Zo(this,null,this.W),ir(this)};function ws(i){if(Go(i),i.I==3){var c=i.V++,l=kt(i.J);if(Q(l,"SID",i.M),Q(l,"RID",c),Q(l,"TYPE","terminate"),_n(i,l),c=new Wt(i,i.j,c),c.M=2,c.A=er(kt(l)),l=!1,a.navigator&&a.navigator.sendBeacon)try{l=a.navigator.sendBeacon(c.A.toString(),"")}catch{}!l&&a.Image&&(new Image().src=c.A,l=!0),l||(c.g=ta(c.j,null),c.g.ea(c.A)),c.F=Date.now(),tr(c)}Yo(i)}function sr(i){i.g&&(As(i),i.g.cancel(),i.g=null)}function Go(i){sr(i),i.v&&(a.clearTimeout(i.v),i.v=null),or(i),i.h.cancel(),i.m&&(typeof i.m=="number"&&a.clearTimeout(i.m),i.m=null)}function ir(i){if(!So(i.h)&&!i.m){i.m=!0;var c=i.Ea;ft||p(),dt||(ft(),dt=!0),T.add(c,i),i.D=0}}function gh(i,c){return Po(i.h)>=i.h.j-(i.m?1:0)?!1:i.m?(i.i=c.G.concat(i.i),!0):i.I==1||i.I==2||i.D>=(i.Sa?0:i.Ta)?!1:(i.m=sn(f(i.Ea,i,c),Xo(i,i.D)),i.D++,!0)}n.Ea=function(i){if(this.m)if(this.m=null,this.I==1){if(!i){this.V=Math.floor(Math.random()*1e5),i=this.V++;const w=new Wt(this,this.j,i);let R=this.o;if(this.U&&(R?(R=no(R),so(R,this.U)):R=this.U),this.u!==null||this.R||(w.J=R,R=null),this.S)t:{for(var c=0,l=0;l<this.i.length;l++){e:{var d=this.i[l];if("__data__"in d.map&&(d=d.map.__data__,typeof d=="string")){d=d.length;break e}d=void 0}if(d===void 0)break;if(c+=d,c>4096){c=l;break t}if(c===4096||l===this.i.length-1){c=l+1;break t}}c=1e3}else c=1e3;c=Ho(this,w,c),l=kt(this.J),Q(l,"RID",i),Q(l,"CVER",22),this.G&&Q(l,"X-HTTP-Session-Id",this.G),_n(this,l),R&&(this.R?c="headers="+an(Uo(R))+"&"+c:this.u&&Is(l,this.u,R)),ys(this.h,w),this.Ra&&Q(l,"TYPE","init"),this.S?(Q(l,"$req",c),Q(l,"SID","null"),w.U=!0,ms(w,l,null)):ms(w,l,c),this.I=2}}else this.I==3&&(i?Ko(this,i):this.i.length==0||So(this.h)||Ko(this))};function Ko(i,c){var l;c?l=c.l:l=i.V++;const d=kt(i.J);Q(d,"SID",i.M),Q(d,"RID",l),Q(d,"AID",i.K),_n(i,d),i.u&&i.o&&Is(d,i.u,i.o),l=new Wt(i,i.j,l,i.D+1),i.u===null&&(l.J=i.o),c&&(i.i=c.G.concat(i.i)),c=Ho(i,l,1e3),l.H=Math.round(i.va*.5)+Math.round(i.va*.5*Math.random()),ys(i.h,l),ms(l,d,c)}function _n(i,c){i.H&&Qn(i.H,function(l,d){Q(c,d,l)}),i.l&&Qn({},function(l,d){Q(c,d,l)})}function Ho(i,c,l){l=Math.min(i.i.length,l);const d=i.l?f(i.l.Ka,i.l,i):null;t:{var w=i.i;let U=-1;for(;;){const it=["count="+l];U==-1?l>0?(U=w[0].g,it.push("ofs="+U)):U=0:it.push("ofs="+U);let K=!0;for(let at=0;at<l;at++){var R=w[at].g;const Ot=w[at].map;if(R-=U,R<0)U=Math.max(0,w[at].g-100),K=!1;else try{R="req"+R+"_"||"";try{var C=Ot instanceof Map?Ot:Object.entries(Ot);for(const[Ie,Yt]of C){let Zt=Yt;u(Yt)&&(Zt=us(Yt)),it.push(R+Ie+"="+encodeURIComponent(Zt))}}catch(Ie){throw it.push(R+"type="+encodeURIComponent("_badmap")),Ie}}catch{d&&d(Ot)}}if(K){C=it.join("&");break t}}C=void 0}return i=i.i.splice(0,l),c.G=i,C}function Wo(i){if(!i.g&&!i.v){i.Y=1;var c=i.Da;ft||p(),dt||(ft(),dt=!0),T.add(c,i),i.A=0}}function vs(i){return i.g||i.v||i.A>=3?!1:(i.Y++,i.v=sn(f(i.Da,i),Xo(i,i.A)),i.A++,!0)}n.Da=function(){if(this.v=null,Qo(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var i=4*this.T;this.j.info("BP detection timer enabled: "+i),this.B=sn(f(this.Wa,this),i)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Et(10),sr(this),Qo(this))};function As(i){i.B!=null&&(a.clearTimeout(i.B),i.B=null)}function Qo(i){i.g=new Wt(i,i.j,"rpc",i.Y),i.u===null&&(i.g.J=i.o),i.g.P=0;var c=kt(i.na);Q(c,"RID","rpc"),Q(c,"SID",i.M),Q(c,"AID",i.K),Q(c,"CI",i.F?"0":"1"),!i.F&&i.ia&&Q(c,"TO",i.ia),Q(c,"TYPE","xmlhttp"),_n(i,c),i.u&&i.o&&Is(c,i.u,i.o),i.O&&(i.g.H=i.O);var l=i.g;i=i.ba,l.M=1,l.A=er(kt(c)),l.u=null,l.R=!0,vo(l,i)}n.Va=function(){this.C!=null&&(this.C=null,sr(this),vs(this),Et(19))};function or(i){i.C!=null&&(a.clearTimeout(i.C),i.C=null)}function Jo(i,c){var l=null;if(i.g==c){or(i),As(i),i.g=null;var d=2}else if(_s(i.h,c))l=c.G,Co(i.h,c),d=1;else return;if(i.I!=0){if(c.o)if(d==1){l=c.u?c.u.length:0,c=Date.now()-c.F;var w=i.D;d=Yn(),yt(d,new yo(d,l)),ir(i)}else Wo(i);else if(w=c.m,w==3||w==0&&c.X>0||!(d==1&&gh(i,c)||d==2&&vs(i)))switch(l&&l.length>0&&(c=i.h,c.i=c.i.concat(l)),w){case 1:Te(i,5);break;case 4:Te(i,10);break;case 3:Te(i,6);break;default:Te(i,2)}}}function Xo(i,c){let l=i.Qa+Math.floor(Math.random()*i.Za);return i.isActive()||(l*=2),l*c}function Te(i,c){if(i.j.info("Error code "+c),c==2){var l=f(i.bb,i),d=i.Ua;const w=!d;d=new Qt(d||"//www.google.com/images/cleardot.gif"),a.location&&a.location.protocol=="http"||un(d,"https"),er(d),w?lh(d.toString(),l):hh(d.toString(),l)}else Et(2);i.I=0,i.l&&i.l.pa(c),Yo(i),Go(i)}n.bb=function(i){i?(this.j.info("Successfully pinged google.com"),Et(2)):(this.j.info("Failed to ping google.com"),Et(1))};function Yo(i){if(i.I=0,i.ja=[],i.l){const c=Vo(i.h);(c.length!=0||i.i.length!=0)&&(N(i.ja,c),N(i.ja,i.i),i.h.i.length=0,P(i.i),i.i.length=0),i.l.oa()}}function Zo(i,c,l){var d=l instanceof Qt?kt(l):new Qt(l);if(d.g!="")c&&(d.g=c+"."+d.g),ln(d,d.u);else{var w=a.location;d=w.protocol,c=c?c+"."+w.hostname:w.hostname,w=+w.port;const R=new Qt(null);d&&un(R,d),c&&(R.g=c),w&&ln(R,w),l&&(R.h=l),d=R}return l=i.G,c=i.wa,l&&c&&Q(d,l,c),Q(d,"VER",i.ka),_n(i,d),d}function ta(i,c,l){if(c&&!i.L)throw Error("Can't create secondary domain capable XhrIo object.");return c=i.Aa&&!i.ma?new Z(new Ts({ab:l})):new Z(i.ma),c.Fa(i.L),c}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function ea(){}n=ea.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function ar(){}ar.prototype.g=function(i,c){return new Rt(i,c)};function Rt(i,c){mt.call(this),this.g=new zo(c),this.l=i,this.h=c&&c.messageUrlParams||null,i=c&&c.messageHeaders||null,c&&c.clientProtocolHeaderRequired&&(i?i["X-Client-Protocol"]="webchannel":i={"X-Client-Protocol":"webchannel"}),this.g.o=i,i=c&&c.initMessageHeaders||null,c&&c.messageContentType&&(i?i["X-WebChannel-Content-Type"]=c.messageContentType:i={"X-WebChannel-Content-Type":c.messageContentType}),c&&c.sa&&(i?i["X-WebChannel-Client-Profile"]=c.sa:i={"X-WebChannel-Client-Profile":c.sa}),this.g.U=i,(i=c&&c.Qb)&&!g(i)&&(this.g.u=i),this.A=c&&c.supportsCrossDomainXhr||!1,this.v=c&&c.sendRawJson||!1,(c=c&&c.httpSessionIdParam)&&!g(c)&&(this.g.G=c,i=this.h,i!==null&&c in i&&(i=this.h,c in i&&delete i[c])),this.j=new Me(this)}y(Rt,mt),Rt.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},Rt.prototype.close=function(){ws(this.g)},Rt.prototype.o=function(i){var c=this.g;if(typeof i=="string"){var l={};l.__data__=i,i=l}else this.v&&(l={},l.__data__=us(i),i=l);c.i.push(new nh(c.Ya++,i)),c.I==3&&ir(c)},Rt.prototype.N=function(){this.g.l=null,delete this.j,ws(this.g),delete this.g,Rt.Z.N.call(this)};function na(i){ls.call(this),i.__headers__&&(this.headers=i.__headers__,this.statusCode=i.__status__,delete i.__headers__,delete i.__status__);var c=i.__sm__;if(c){t:{for(const l in c){i=l;break t}i=void 0}(this.i=i)&&(i=this.i,c=c!==null&&i in c?c[i]:void 0),this.data=c}else this.data=i}y(na,ls);function ra(){hs.call(this),this.status=1}y(ra,hs);function Me(i){this.g=i}y(Me,ea),Me.prototype.ra=function(){yt(this.g,"a")},Me.prototype.qa=function(i){yt(this.g,new na(i))},Me.prototype.pa=function(i){yt(this.g,new ra)},Me.prototype.oa=function(){yt(this.g,"b")},ar.prototype.createWebChannel=ar.prototype.g,Rt.prototype.send=Rt.prototype.o,Rt.prototype.open=Rt.prototype.m,Rt.prototype.close=Rt.prototype.close,Bc=function(){return new ar},Uc=function(){return Yn()},Fc=_e,Gs={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Zn.NO_ERROR=0,Zn.TIMEOUT=8,Zn.HTTP_ERROR=6,mr=Zn,Eo.COMPLETE="complete",Lc=Eo,mo.EventType=nn,nn.OPEN="a",nn.CLOSE="b",nn.ERROR="c",nn.MESSAGE="d",mt.prototype.listen=mt.prototype.J,Tn=mo,Z.prototype.listenOnce=Z.prototype.K,Z.prototype.getLastError=Z.prototype.Ha,Z.prototype.getLastErrorCode=Z.prototype.ya,Z.prototype.getStatus=Z.prototype.ca,Z.prototype.getResponseJson=Z.prototype.La,Z.prototype.getResponseText=Z.prototype.la,Z.prototype.send=Z.prototype.ea,Z.prototype.setWithCredentials=Z.prototype.Fa,xc=Z}).apply(typeof ur<"u"?ur:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gt{constructor(t){this.uid=t}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(t){return t.uid===this.uid}}gt.UNAUTHENTICATED=new gt(null),gt.GOOGLE_CREDENTIALS=new gt("google-credentials-uid"),gt.FIRST_PARTY=new gt("first-party-uid"),gt.MOCK_USER=new gt("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Je="12.14.0";function ed(n){Je=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const be=new di("@firebase/firestore");function xe(){return be.logLevel}function V(n,...t){if(be.logLevel<=$.DEBUG){const e=t.map(pi);be.debug(`Firestore (${Je}): ${n}`,...e)}}function Kt(n,...t){if(be.logLevel<=$.ERROR){const e=t.map(pi);be.error(`Firestore (${Je}): ${n}`,...e)}}function Se(n,...t){if(be.logLevel<=$.WARN){const e=t.map(pi);be.warn(`Firestore (${Je}): ${n}`,...e)}}function pi(n){if(typeof n=="string")return n;try{return(function(e){return JSON.stringify(e)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function x(n,t,e){let r="Unexpected state";typeof t=="string"?r=t:e=t,qc(n,r,e)}function qc(n,t,e){let r=`FIRESTORE (${Je}) INTERNAL ASSERTION FAILED: ${t} (ID: ${n.toString(16)})`;if(e!==void 0)try{r+=" CONTEXT: "+JSON.stringify(e)}catch{r+=" CONTEXT: "+e}throw Kt(r),new Error(r)}function z(n,t,e,r){let s="Unexpected state";typeof e=="string"?s=e:r=e,n||qc(t,s,r)}function F(n,t){return n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class D extends de{constructor(t,e){super(t,e),this.code=t,this.message=e,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class re{constructor(){this.promise=new Promise(((t,e)=>{this.resolve=t,this.reject=e}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jc{constructor(t,e){this.user=e,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${t}`)}}class nd{getToken(){return Promise.resolve(null)}invalidateToken(){}start(t,e){t.enqueueRetryable((()=>e(gt.UNAUTHENTICATED)))}shutdown(){}}class rd{constructor(t){this.token=t,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(t,e){this.changeListener=e,t.enqueueRetryable((()=>e(this.token.user)))}shutdown(){this.changeListener=null}}class sd{constructor(t){this.t=t,this.currentUser=gt.UNAUTHENTICATED,this.i=0,this.forceRefresh=!1,this.auth=null}start(t,e){z(this.o===void 0,42304);let r=this.i;const s=h=>this.i!==r?(r=this.i,e(h)):Promise.resolve();let o=new re;this.o=()=>{this.i++,this.currentUser=this.u(),o.resolve(),o=new re,t.enqueueRetryable((()=>s(this.currentUser)))};const a=()=>{const h=o;t.enqueueRetryable((async()=>{await h.promise,await s(this.currentUser)}))},u=h=>{V("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=h,this.o&&(this.auth.addAuthTokenListener(this.o),a())};this.t.onInit((h=>u(h))),setTimeout((()=>{if(!this.auth){const h=this.t.getImmediate({optional:!0});h?u(h):(V("FirebaseAuthCredentialsProvider","Auth not yet detected"),o.resolve(),o=new re)}}),0),a()}getToken(){const t=this.i,e=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(e).then((r=>this.i!==t?(V("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(z(typeof r.accessToken=="string",31837,{l:r}),new jc(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.o&&this.auth.removeAuthTokenListener(this.o),this.o=void 0}u(){const t=this.auth&&this.auth.getUid();return z(t===null||typeof t=="string",2055,{h:t}),new gt(t)}}class id{constructor(t,e,r){this.P=t,this.T=e,this.I=r,this.type="FirstParty",this.user=gt.FIRST_PARTY,this.R=new Map}A(){return this.I?this.I():null}get headers(){this.R.set("X-Goog-AuthUser",this.P);const t=this.A();return t&&this.R.set("Authorization",t),this.T&&this.R.set("X-Goog-Iam-Authorization-Token",this.T),this.R}}class od{constructor(t,e,r){this.P=t,this.T=e,this.I=r}getToken(){return Promise.resolve(new id(this.P,this.T,this.I))}start(t,e){t.enqueueRetryable((()=>e(gt.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class ga{constructor(t){this.value=t,this.type="AppCheck",this.headers=new Map,t&&t.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class ad{constructor(t,e){this.V=e,this.forceRefresh=!1,this.appCheck=null,this.m=null,this.p=null,Ff(t)&&t.settings.appCheckToken&&(this.p=t.settings.appCheckToken)}start(t,e){z(this.o===void 0,3512);const r=o=>{o.error!=null&&V("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${o.error.message}`);const a=o.token!==this.m;return this.m=o.token,V("FirebaseAppCheckTokenProvider",`Received ${a?"new":"existing"} token.`),a?e(o.token):Promise.resolve()};this.o=o=>{t.enqueueRetryable((()=>r(o)))};const s=o=>{V("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=o,this.o&&this.appCheck.addTokenListener(this.o)};this.V.onInit((o=>s(o))),setTimeout((()=>{if(!this.appCheck){const o=this.V.getImmediate({optional:!0});o?s(o):V("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.p)return Promise.resolve(new ga(this.p));const t=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(t).then((e=>e?(z(typeof e.token=="string",44558,{tokenResult:e}),this.m=e.token,new ga(e.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.o&&this.appCheck.removeTokenListener(this.o),this.o=void 0}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function cd(n){const t=typeof self<"u"&&(self.crypto||self.msCrypto),e=new Uint8Array(n);if(t&&typeof t.getRandomValues=="function")t.getRandomValues(e);else for(let r=0;r<n;r++)e[r]=Math.floor(256*Math.random());return e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gi{static newId(){const t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",e=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=cd(40);for(let o=0;o<s.length;++o)r.length<20&&s[o]<e&&(r+=t.charAt(s[o]%62))}return r}}function B(n,t){return n<t?-1:n>t?1:0}function Ks(n,t){const e=Math.min(n.length,t.length);for(let r=0;r<e;r++){const s=n.charAt(r),o=t.charAt(r);if(s!==o)return Ds(s)===Ds(o)?B(s,o):Ds(s)?1:-1}return B(n.length,t.length)}const ud=55296,ld=57343;function Ds(n){const t=n.charCodeAt(0);return t>=ud&&t<=ld}function ze(n,t,e){return n.length===t.length&&n.every(((r,s)=>e(r,t[s])))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _a="__name__";class Mt{constructor(t,e,r){e===void 0?e=0:e>t.length&&x(637,{offset:e,range:t.length}),r===void 0?r=t.length-e:r>t.length-e&&x(1746,{length:r,range:t.length-e}),this.segments=t,this.offset=e,this.len=r}get length(){return this.len}isEqual(t){return Mt.comparator(this,t)===0}child(t){const e=this.segments.slice(this.offset,this.limit());return t instanceof Mt?t.forEach((r=>{e.push(r)})):e.push(t),this.construct(e)}limit(){return this.offset+this.length}popFirst(t){return t=t===void 0?1:t,this.construct(this.segments,this.offset+t,this.length-t)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(t){return this.segments[this.offset+t]}isEmpty(){return this.length===0}isPrefixOf(t){if(t.length<this.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}isImmediateParentOf(t){if(this.length+1!==t.length)return!1;for(let e=0;e<this.length;e++)if(this.get(e)!==t.get(e))return!1;return!0}forEach(t){for(let e=this.offset,r=this.limit();e<r;e++)t(this.segments[e])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(t,e){const r=Math.min(t.length,e.length);for(let s=0;s<r;s++){const o=Mt.compareSegments(t.get(s),e.get(s));if(o!==0)return o}return B(t.length,e.length)}static compareSegments(t,e){const r=Mt.isNumericId(t),s=Mt.isNumericId(e);return r&&!s?-1:!r&&s?1:r&&s?Mt.extractNumericId(t).compare(Mt.extractNumericId(e)):Ks(t,e)}static isNumericId(t){return t.startsWith("__id")&&t.endsWith("__")}static extractNumericId(t){return ne.fromString(t.substring(4,t.length-2))}}class W extends Mt{construct(t,e,r){return new W(t,e,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...t){const e=[];for(const r of t){if(r.indexOf("//")>=0)throw new D(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);e.push(...r.split("/").filter((s=>s.length>0)))}return new W(e)}static emptyPath(){return new W([])}}const hd=/^[_a-zA-Z][_a-zA-Z0-9]*$/;class lt extends Mt{construct(t,e,r){return new lt(t,e,r)}static isValidIdentifier(t){return hd.test(t)}canonicalString(){return this.toArray().map((t=>(t=t.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),lt.isValidIdentifier(t)||(t="`"+t+"`"),t))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===_a}static keyField(){return new lt([_a])}static fromServerFormat(t){const e=[];let r="",s=0;const o=()=>{if(r.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);e.push(r),r=""};let a=!1;for(;s<t.length;){const u=t[s];if(u==="\\"){if(s+1===t.length)throw new D(b.INVALID_ARGUMENT,"Path has trailing escape character: "+t);const h=t[s+1];if(h!=="\\"&&h!=="."&&h!=="`")throw new D(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+t);r+=h,s+=2}else u==="`"?(a=!a,s++):u!=="."||a?(r+=u,s++):(o(),s++)}if(o(),a)throw new D(b.INVALID_ARGUMENT,"Unterminated ` in path: "+t);return new lt(e)}static emptyPath(){return new lt([])}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(t){this.path=t}static fromPath(t){return new M(W.fromString(t))}static fromName(t){return new M(W.fromString(t).popFirst(5))}static empty(){return new M(W.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(t){return this.path.length>=2&&this.path.get(this.path.length-2)===t}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(t){return t!==null&&W.comparator(this.path,t.path)===0}toString(){return this.path.toString()}static comparator(t,e){return W.comparator(t.path,e.path)}static isDocumentKey(t){return t.length%2==0}static fromSegments(t){return new M(new W(t.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function $c(n,t,e){if(!e)throw new D(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${t}.`)}function fd(n,t,e,r){if(t===!0&&r===!0)throw new D(b.INVALID_ARGUMENT,`${n} and ${e} cannot be used together.`)}function ya(n){if(!M.isDocumentKey(n))throw new D(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Ea(n){if(M.isDocumentKey(n))throw new D(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function zc(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function Fr(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const t=(function(r){return r.constructor?r.constructor.name:null})(n);return t?`a custom ${t} object`:"an object"}}return typeof n=="function"?"a function":x(12329,{type:typeof n})}function $t(n,t){if("_delegate"in n&&(n=n._delegate),!(n instanceof t)){if(t.name===n.constructor.name)throw new D(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const e=Fr(n);throw new D(b.INVALID_ARGUMENT,`Expected type '${t.name}', but it was: ${e}`)}}return n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function st(n,t){const e={typeString:n};return t&&(e.value=t),e}function qn(n,t){if(!zc(n))throw new D(b.INVALID_ARGUMENT,"JSON must be an object");let e;for(const r in t)if(t[r]){const s=t[r].typeString,o="value"in t[r]?{value:t[r].value}:void 0;if(!(r in n)){e=`JSON missing required field: '${r}'`;break}const a=n[r];if(s&&typeof a!==s){e=`JSON field '${r}' must be a ${s}.`;break}if(o!==void 0&&a!==o.value){e=`Expected '${r}' field to equal '${o.value}'`;break}}if(e)throw new D(b.INVALID_ARGUMENT,e);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ta=-62135596800,Ia=1e6;class J{static now(){return J.fromMillis(Date.now())}static fromDate(t){return J.fromMillis(t.getTime())}static fromMillis(t){const e=Math.floor(t/1e3),r=Math.floor((t-1e3*e)*Ia);return new J(e,r)}constructor(t,e){if(this.seconds=t,this.nanoseconds=e,e<0)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(e>=1e9)throw new D(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+e);if(t<Ta)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t);if(t>=253402300800)throw new D(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+t)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Ia}_compareTo(t){return this.seconds===t.seconds?B(this.nanoseconds,t.nanoseconds):B(this.seconds,t.seconds)}isEqual(t){return t.seconds===this.seconds&&t.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:J._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(t){if(qn(t,J._jsonSchema))return new J(t.seconds,t.nanoseconds)}valueOf(){const t=this.seconds-Ta;return String(t).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}J._jsonSchemaVersion="firestore/timestamp/1.0",J._jsonSchema={type:st("string",J._jsonSchemaVersion),seconds:st("number"),nanoseconds:st("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L{static fromTimestamp(t){return new L(t)}static min(){return new L(new J(0,0))}static max(){return new L(new J(253402300799,999999999))}constructor(t){this.timestamp=t}compareTo(t){return this.timestamp._compareTo(t.timestamp)}isEqual(t){return this.timestamp.isEqual(t.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dn=-1;function dd(n,t){const e=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=L.fromTimestamp(r===1e9?new J(e+1,0):new J(e,r));return new oe(s,M.empty(),t)}function md(n){return new oe(n.readTime,n.key,Dn)}class oe{constructor(t,e,r){this.readTime=t,this.documentKey=e,this.largestBatchId=r}static min(){return new oe(L.min(),M.empty(),Dn)}static max(){return new oe(L.max(),M.empty(),Dn)}}function pd(n,t){let e=n.readTime.compareTo(t.readTime);return e!==0?e:(e=M.comparator(n.documentKey,t.documentKey),e!==0?e:B(n.largestBatchId,t.largestBatchId))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const gd="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class _d{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(t){this.onCommittedListeners.push(t)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((t=>t()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Xe(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==gd)throw n;V("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class S{constructor(t){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,t((e=>{this.isDone=!0,this.result=e,this.nextCallback&&this.nextCallback(e)}),(e=>{this.isDone=!0,this.error=e,this.catchCallback&&this.catchCallback(e)}))}catch(t){return this.next(void 0,t)}next(t,e){return this.callbackAttached&&x(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(e,this.error):this.wrapSuccess(t,this.result):new S(((r,s)=>{this.nextCallback=o=>{this.wrapSuccess(t,o).next(r,s)},this.catchCallback=o=>{this.wrapFailure(e,o).next(r,s)}}))}toPromise(){return new Promise(((t,e)=>{this.next(t,e)}))}wrapUserFunction(t){try{const e=t();return e instanceof S?e:S.resolve(e)}catch(e){return S.reject(e)}}wrapSuccess(t,e){return t?this.wrapUserFunction((()=>t(e))):S.resolve(e)}wrapFailure(t,e){return t?this.wrapUserFunction((()=>t(e))):S.reject(e)}static resolve(t){return new S(((e,r)=>{e(t)}))}static reject(t){return new S(((e,r)=>{r(t)}))}static waitFor(t){return new S(((e,r)=>{let s=0,o=0,a=!1;t.forEach((u=>{++s,u.next((()=>{++o,a&&o===s&&e()}),(h=>r(h)))})),a=!0,o===s&&e()}))}static or(t){let e=S.resolve(!1);for(const r of t)e=e.next((s=>s?S.resolve(s):r()));return e}static forEach(t,e){const r=[];return t.forEach(((s,o)=>{r.push(e.call(this,s,o))})),this.waitFor(r)}static mapArray(t,e){return new S(((r,s)=>{const o=t.length,a=new Array(o);let u=0;for(let h=0;h<o;h++){const f=h;e(t[f]).next((m=>{a[f]=m,++u,u===o&&r(a)}),(m=>s(m)))}}))}static doWhile(t,e){return new S(((r,s)=>{const o=()=>{t()===!0?e().next((()=>{o()}),s):r()};o()}))}}function yd(n){const t=n.match(/Android ([\d.]+)/i),e=t?t[1].split(".").slice(0,2).join("."):"-1";return Number(e)}function Ye(n){return n.name==="IndexedDbTransactionError"}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ur{constructor(t,e){this.previousValue=t,e&&(e.sequenceNumberHandler=r=>this.ae(r),this.ue=r=>e.writeSequenceNumber(r))}ae(t){return this.previousValue=Math.max(t,this.previousValue),this.previousValue}next(){const t=++this.previousValue;return this.ue&&this.ue(t),t}}Ur.ce=-1;/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _i=-1;function Br(n){return n==null}function Ir(n){return n===0&&1/n==-1/0}function Ed(n){return typeof n=="number"&&Number.isInteger(n)&&!Ir(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gc="";function Td(n){let t="";for(let e=0;e<n.length;e++)t.length>0&&(t=wa(t)),t=Id(n.get(e),t);return wa(t)}function Id(n,t){let e=t;const r=n.length;for(let s=0;s<r;s++){const o=n.charAt(s);switch(o){case"\0":e+="";break;case Gc:e+="";break;default:e+=o}}return e}function wa(n){return n+Gc+""}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function va(n){let t=0;for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t++;return t}function me(n,t){for(const e in n)Object.prototype.hasOwnProperty.call(n,e)&&t(e,n[e])}function Kc(n){for(const t in n)if(Object.prototype.hasOwnProperty.call(n,t))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class X{constructor(t,e){this.comparator=t,this.root=e||ut.EMPTY}insert(t,e){return new X(this.comparator,this.root.insert(t,e,this.comparator).copy(null,null,ut.BLACK,null,null))}remove(t){return new X(this.comparator,this.root.remove(t,this.comparator).copy(null,null,ut.BLACK,null,null))}get(t){let e=this.root;for(;!e.isEmpty();){const r=this.comparator(t,e.key);if(r===0)return e.value;r<0?e=e.left:r>0&&(e=e.right)}return null}indexOf(t){let e=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(t,r.key);if(s===0)return e+r.left.size;s<0?r=r.left:(e+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(t){return this.root.inorderTraversal(t)}forEach(t){this.inorderTraversal(((e,r)=>(t(e,r),!1)))}toString(){const t=[];return this.inorderTraversal(((e,r)=>(t.push(`${e}:${r}`),!1))),`{${t.join(", ")}}`}reverseTraversal(t){return this.root.reverseTraversal(t)}getIterator(){return new lr(this.root,null,this.comparator,!1)}getIteratorFrom(t){return new lr(this.root,t,this.comparator,!1)}getReverseIterator(){return new lr(this.root,null,this.comparator,!0)}getReverseIteratorFrom(t){return new lr(this.root,t,this.comparator,!0)}}class lr{constructor(t,e,r,s){this.isReverse=s,this.nodeStack=[];let o=1;for(;!t.isEmpty();)if(o=e?r(t.key,e):1,e&&s&&(o*=-1),o<0)t=this.isReverse?t.left:t.right;else{if(o===0){this.nodeStack.push(t);break}this.nodeStack.push(t),t=this.isReverse?t.right:t.left}}getNext(){let t=this.nodeStack.pop();const e={key:t.key,value:t.value};if(this.isReverse)for(t=t.left;!t.isEmpty();)this.nodeStack.push(t),t=t.right;else for(t=t.right;!t.isEmpty();)this.nodeStack.push(t),t=t.left;return e}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const t=this.nodeStack[this.nodeStack.length-1];return{key:t.key,value:t.value}}}class ut{constructor(t,e,r,s,o){this.key=t,this.value=e,this.color=r??ut.RED,this.left=s??ut.EMPTY,this.right=o??ut.EMPTY,this.size=this.left.size+1+this.right.size}copy(t,e,r,s,o){return new ut(t??this.key,e??this.value,r??this.color,s??this.left,o??this.right)}isEmpty(){return!1}inorderTraversal(t){return this.left.inorderTraversal(t)||t(this.key,this.value)||this.right.inorderTraversal(t)}reverseTraversal(t){return this.right.reverseTraversal(t)||t(this.key,this.value)||this.left.reverseTraversal(t)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(t,e,r){let s=this;const o=r(t,s.key);return s=o<0?s.copy(null,null,null,s.left.insert(t,e,r),null):o===0?s.copy(null,e,null,null,null):s.copy(null,null,null,null,s.right.insert(t,e,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return ut.EMPTY;let t=this;return t.left.isRed()||t.left.left.isRed()||(t=t.moveRedLeft()),t=t.copy(null,null,null,t.left.removeMin(),null),t.fixUp()}remove(t,e){let r,s=this;if(e(t,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(t,e),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),e(t,s.key)===0){if(s.right.isEmpty())return ut.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(t,e))}return s.fixUp()}isRed(){return this.color}fixUp(){let t=this;return t.right.isRed()&&!t.left.isRed()&&(t=t.rotateLeft()),t.left.isRed()&&t.left.left.isRed()&&(t=t.rotateRight()),t.left.isRed()&&t.right.isRed()&&(t=t.colorFlip()),t}moveRedLeft(){let t=this.colorFlip();return t.right.left.isRed()&&(t=t.copy(null,null,null,null,t.right.rotateRight()),t=t.rotateLeft(),t=t.colorFlip()),t}moveRedRight(){let t=this.colorFlip();return t.left.left.isRed()&&(t=t.rotateRight(),t=t.colorFlip()),t}rotateLeft(){const t=this.copy(null,null,ut.RED,null,this.right.left);return this.right.copy(null,null,this.color,t,null)}rotateRight(){const t=this.copy(null,null,ut.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,t)}colorFlip(){const t=this.left.copy(null,null,!this.left.color,null,null),e=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,t,e)}checkMaxDepth(){const t=this.check();return Math.pow(2,t)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw x(43730,{key:this.key,value:this.value});if(this.right.isRed())throw x(14113,{key:this.key,value:this.value});const t=this.left.check();if(t!==this.right.check())throw x(27949);return t+(this.isRed()?0:1)}}ut.EMPTY=null,ut.RED=!0,ut.BLACK=!1;ut.EMPTY=new class{constructor(){this.size=0}get key(){throw x(57766)}get value(){throw x(16141)}get color(){throw x(16727)}get left(){throw x(29726)}get right(){throw x(36894)}copy(t,e,r,s,o){return this}insert(t,e,r){return new ut(t,e)}remove(t,e){return this}isEmpty(){return!0}inorderTraversal(t){return!1}reverseTraversal(t){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ot{constructor(t){this.comparator=t,this.data=new X(this.comparator)}has(t){return this.data.get(t)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(t){return this.data.indexOf(t)}forEach(t){this.data.inorderTraversal(((e,r)=>(t(e),!1)))}forEachInRange(t,e){const r=this.data.getIteratorFrom(t[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,t[1])>=0)return;e(s.key)}}forEachWhile(t,e){let r;for(r=e!==void 0?this.data.getIteratorFrom(e):this.data.getIterator();r.hasNext();)if(!t(r.getNext().key))return}firstAfterOrEqual(t){const e=this.data.getIteratorFrom(t);return e.hasNext()?e.getNext().key:null}getIterator(){return new Aa(this.data.getIterator())}getIteratorFrom(t){return new Aa(this.data.getIteratorFrom(t))}add(t){return this.copy(this.data.remove(t).insert(t,!0))}delete(t){return this.has(t)?this.copy(this.data.remove(t)):this}isEmpty(){return this.data.isEmpty()}unionWith(t){let e=this;return e.size<t.size&&(e=t,t=this),t.forEach((r=>{e=e.add(r)})),e}isEqual(t){if(!(t instanceof ot)||this.size!==t.size)return!1;const e=this.data.getIterator(),r=t.data.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(this.comparator(s,o)!==0)return!1}return!0}toArray(){const t=[];return this.forEach((e=>{t.push(e)})),t}toString(){const t=[];return this.forEach((e=>t.push(e))),"SortedSet("+t.toString()+")"}copy(t){const e=new ot(this.comparator);return e.data=t,e}}class Aa{constructor(t){this.iter=t}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bt{constructor(t){this.fields=t,t.sort(lt.comparator)}static empty(){return new bt([])}unionWith(t){let e=new ot(lt.comparator);for(const r of this.fields)e=e.add(r);for(const r of t)e=e.add(r);return new bt(e.toArray())}covers(t){for(const e of this.fields)if(e.isPrefixOf(t))return!0;return!1}isEqual(t){return ze(this.fields,t.fields,((e,r)=>e.isEqual(r)))}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hc extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ht{constructor(t){this.binaryString=t}static fromBase64String(t){const e=(function(s){try{return atob(s)}catch(o){throw typeof DOMException<"u"&&o instanceof DOMException?new Hc("Invalid base64 string: "+o):o}})(t);return new ht(e)}static fromUint8Array(t){const e=(function(s){let o="";for(let a=0;a<s.length;++a)o+=String.fromCharCode(s[a]);return o})(t);return new ht(e)}[Symbol.iterator](){let t=0;return{next:()=>t<this.binaryString.length?{value:this.binaryString.charCodeAt(t++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(e){return btoa(e)})(this.binaryString)}toUint8Array(){return(function(e){const r=new Uint8Array(e.length);for(let s=0;s<e.length;s++)r[s]=e.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(t){return B(this.binaryString,t.binaryString)}isEqual(t){return this.binaryString===t.binaryString}}ht.EMPTY_BYTE_STRING=new ht("");const wd=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function ae(n){if(z(!!n,39018),typeof n=="string"){let t=0;const e=wd.exec(n);if(z(!!e,46558,{timestamp:n}),e[1]){let s=e[1];s=(s+"000000000").substr(0,9),t=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:t}}return{seconds:tt(n.seconds),nanos:tt(n.nanos)}}function tt(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function ce(n){return typeof n=="string"?ht.fromBase64String(n):ht.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wc="server_timestamp",Qc="__type__",Jc="__previous_value__",Xc="__local_write_time__";function yi(n){var e,r;return((r=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[Qc])==null?void 0:r.stringValue)===Wc}function qr(n){const t=n.mapValue.fields[Jc];return yi(t)?qr(t):t}function Nn(n){const t=ae(n.mapValue.fields[Xc].timestampValue);return new J(t.seconds,t.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vd{constructor(t,e,r,s,o,a,u,h,f,m,y){this.databaseId=t,this.appId=e,this.persistenceKey=r,this.host=s,this.ssl=o,this.forceLongPolling=a,this.autoDetectLongPolling=u,this.longPollingOptions=h,this.useFetchStreams=f,this.isUsingEmulator=m,this.apiKey=y}}const wr="(default)";class kn{constructor(t,e){this.projectId=t,this.database=e||wr}static empty(){return new kn("","")}get isDefaultDatabase(){return this.database===wr}isEqual(t){return t instanceof kn&&t.projectId===this.projectId&&t.database===this.database}}function Ad(n,t){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new D(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new kn(n.options.projectId,t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yc="__type__",Rd="__max__",hr={mapValue:{}},Zc="__vector__",vr="value";function ue(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?yi(n)?4:Sd(n)?9007199254740991:bd(n)?10:11:x(28295,{value:n})}function Bt(n,t){if(n===t)return!0;const e=ue(n);if(e!==ue(t))return!1;switch(e){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===t.booleanValue;case 4:return Nn(n).isEqual(Nn(t));case 3:return(function(s,o){if(typeof s.timestampValue=="string"&&typeof o.timestampValue=="string"&&s.timestampValue.length===o.timestampValue.length)return s.timestampValue===o.timestampValue;const a=ae(s.timestampValue),u=ae(o.timestampValue);return a.seconds===u.seconds&&a.nanos===u.nanos})(n,t);case 5:return n.stringValue===t.stringValue;case 6:return(function(s,o){return ce(s.bytesValue).isEqual(ce(o.bytesValue))})(n,t);case 7:return n.referenceValue===t.referenceValue;case 8:return(function(s,o){return tt(s.geoPointValue.latitude)===tt(o.geoPointValue.latitude)&&tt(s.geoPointValue.longitude)===tt(o.geoPointValue.longitude)})(n,t);case 2:return(function(s,o){if("integerValue"in s&&"integerValue"in o)return tt(s.integerValue)===tt(o.integerValue);if("doubleValue"in s&&"doubleValue"in o){const a=tt(s.doubleValue),u=tt(o.doubleValue);return a===u?Ir(a)===Ir(u):isNaN(a)&&isNaN(u)}return!1})(n,t);case 9:return ze(n.arrayValue.values||[],t.arrayValue.values||[],Bt);case 10:case 11:return(function(s,o){const a=s.mapValue.fields||{},u=o.mapValue.fields||{};if(va(a)!==va(u))return!1;for(const h in a)if(a.hasOwnProperty(h)&&(u[h]===void 0||!Bt(a[h],u[h])))return!1;return!0})(n,t);default:return x(52216,{left:n})}}function On(n,t){return(n.values||[]).find((e=>Bt(e,t)))!==void 0}function Ge(n,t){if(n===t)return 0;const e=ue(n),r=ue(t);if(e!==r)return B(e,r);switch(e){case 0:case 9007199254740991:return 0;case 1:return B(n.booleanValue,t.booleanValue);case 2:return(function(o,a){const u=tt(o.integerValue||o.doubleValue),h=tt(a.integerValue||a.doubleValue);return u<h?-1:u>h?1:u===h?0:isNaN(u)?isNaN(h)?0:-1:1})(n,t);case 3:return Ra(n.timestampValue,t.timestampValue);case 4:return Ra(Nn(n),Nn(t));case 5:return Ks(n.stringValue,t.stringValue);case 6:return(function(o,a){const u=ce(o),h=ce(a);return u.compareTo(h)})(n.bytesValue,t.bytesValue);case 7:return(function(o,a){const u=o.split("/"),h=a.split("/");for(let f=0;f<u.length&&f<h.length;f++){const m=B(u[f],h[f]);if(m!==0)return m}return B(u.length,h.length)})(n.referenceValue,t.referenceValue);case 8:return(function(o,a){const u=B(tt(o.latitude),tt(a.latitude));return u!==0?u:B(tt(o.longitude),tt(a.longitude))})(n.geoPointValue,t.geoPointValue);case 9:return ba(n.arrayValue,t.arrayValue);case 10:return(function(o,a){var v,P,N,O;const u=o.fields||{},h=a.fields||{},f=(v=u[vr])==null?void 0:v.arrayValue,m=(P=h[vr])==null?void 0:P.arrayValue,y=B(((N=f==null?void 0:f.values)==null?void 0:N.length)||0,((O=m==null?void 0:m.values)==null?void 0:O.length)||0);return y!==0?y:ba(f,m)})(n.mapValue,t.mapValue);case 11:return(function(o,a){if(o===hr.mapValue&&a===hr.mapValue)return 0;if(o===hr.mapValue)return 1;if(a===hr.mapValue)return-1;const u=o.fields||{},h=Object.keys(u),f=a.fields||{},m=Object.keys(f);h.sort(),m.sort();for(let y=0;y<h.length&&y<m.length;++y){const v=Ks(h[y],m[y]);if(v!==0)return v;const P=Ge(u[h[y]],f[m[y]]);if(P!==0)return P}return B(h.length,m.length)})(n.mapValue,t.mapValue);default:throw x(23264,{he:e})}}function Ra(n,t){if(typeof n=="string"&&typeof t=="string"&&n.length===t.length)return B(n,t);const e=ae(n),r=ae(t),s=B(e.seconds,r.seconds);return s!==0?s:B(e.nanos,r.nanos)}function ba(n,t){const e=n.values||[],r=t.values||[];for(let s=0;s<e.length&&s<r.length;++s){const o=Ge(e[s],r[s]);if(o)return o}return B(e.length,r.length)}function Ke(n){return Hs(n)}function Hs(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(e){const r=ae(e);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(e){return ce(e).toBase64()})(n.bytesValue):"referenceValue"in n?(function(e){return M.fromName(e).toString()})(n.referenceValue):"geoPointValue"in n?(function(e){return`geo(${e.latitude},${e.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(e){let r="[",s=!0;for(const o of e.values||[])s?s=!1:r+=",",r+=Hs(o);return r+"]"})(n.arrayValue):"mapValue"in n?(function(e){const r=Object.keys(e.fields||{}).sort();let s="{",o=!0;for(const a of r)o?o=!1:s+=",",s+=`${a}:${Hs(e.fields[a])}`;return s+"}"})(n.mapValue):x(61005,{value:n})}function pr(n){switch(ue(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const t=qr(n);return t?16+pr(t):16;case 5:return 2*n.stringValue.length;case 6:return ce(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,o)=>s+pr(o)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return me(r.fields,((o,a)=>{s+=o.length+pr(a)})),s})(n.mapValue);default:throw x(13486,{value:n})}}function Sa(n,t){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${t.path.canonicalString()}`}}function Mn(n){return!!n&&"integerValue"in n}function tu(n){return Mn(n)||(function(e){return!!e&&"doubleValue"in e})(n)}function Ei(n){return!!n&&"arrayValue"in n}function Pa(n){return!!n&&"nullValue"in n}function Ca(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function gr(n){return!!n&&"mapValue"in n}function bd(n){var e,r;return((r=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[Yc])==null?void 0:r.stringValue)===Zc}function An(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const t={mapValue:{fields:{}}};return me(n.mapValue.fields,((e,r)=>t.mapValue.fields[e]=An(r))),t}if(n.arrayValue){const t={arrayValue:{values:[]}};for(let e=0;e<(n.arrayValue.values||[]).length;++e)t.arrayValue.values[e]=An(n.arrayValue.values[e]);return t}return{...n}}function Sd(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===Rd}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(t){this.value=t}static empty(){return new vt({mapValue:{}})}field(t){if(t.isEmpty())return this.value;{let e=this.value;for(let r=0;r<t.length-1;++r)if(e=(e.mapValue.fields||{})[t.get(r)],!gr(e))return null;return e=(e.mapValue.fields||{})[t.lastSegment()],e||null}}set(t,e){this.getFieldsMap(t.popLast())[t.lastSegment()]=An(e)}setAll(t){let e=lt.emptyPath(),r={},s=[];t.forEach(((a,u)=>{if(!e.isImmediateParentOf(u)){const h=this.getFieldsMap(e);this.applyChanges(h,r,s),r={},s=[],e=u.popLast()}a?r[u.lastSegment()]=An(a):s.push(u.lastSegment())}));const o=this.getFieldsMap(e);this.applyChanges(o,r,s)}delete(t){const e=this.field(t.popLast());gr(e)&&e.mapValue.fields&&delete e.mapValue.fields[t.lastSegment()]}isEqual(t){return Bt(this.value,t.value)}getFieldsMap(t){let e=this.value;e.mapValue.fields||(e.mapValue={fields:{}});for(let r=0;r<t.length;++r){let s=e.mapValue.fields[t.get(r)];gr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},e.mapValue.fields[t.get(r)]=s),e=s}return e.mapValue.fields}applyChanges(t,e,r){me(e,((s,o)=>t[s]=o));for(const s of r)delete t[s]}clone(){return new vt(An(this.value))}}function eu(n){const t=[];return me(n.fields,((e,r)=>{const s=new lt([e]);if(gr(r)){const o=eu(r.mapValue).fields;if(o.length===0)t.push(s);else for(const a of o)t.push(s.child(a))}else t.push(s)})),new bt(t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _t{constructor(t,e,r,s,o,a,u){this.key=t,this.documentType=e,this.version=r,this.readTime=s,this.createTime=o,this.data=a,this.documentState=u}static newInvalidDocument(t){return new _t(t,0,L.min(),L.min(),L.min(),vt.empty(),0)}static newFoundDocument(t,e,r,s){return new _t(t,1,e,L.min(),r,s,0)}static newNoDocument(t,e){return new _t(t,2,e,L.min(),L.min(),vt.empty(),0)}static newUnknownDocument(t,e){return new _t(t,3,e,L.min(),L.min(),vt.empty(),2)}convertToFoundDocument(t,e){return!this.createTime.isEqual(L.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=t),this.version=t,this.documentType=1,this.data=e,this.documentState=0,this}convertToNoDocument(t){return this.version=t,this.documentType=2,this.data=vt.empty(),this.documentState=0,this}convertToUnknownDocument(t){return this.version=t,this.documentType=3,this.data=vt.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=L.min(),this}setReadTime(t){return this.readTime=t,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(t){return t instanceof _t&&this.key.isEqual(t.key)&&this.version.isEqual(t.version)&&this.documentType===t.documentType&&this.documentState===t.documentState&&this.data.isEqual(t.data)}mutableCopy(){return new _t(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{constructor(t,e){this.position=t,this.inclusive=e}}function Va(n,t,e){let r=0;for(let s=0;s<n.position.length;s++){const o=t[s],a=n.position[s];if(o.field.isKeyField()?r=M.comparator(M.fromName(a.referenceValue),e.key):r=Ge(a,e.data.field(o.field)),o.dir==="desc"&&(r*=-1),r!==0)break}return r}function Da(n,t){if(n===null)return t===null;if(t===null||n.inclusive!==t.inclusive||n.position.length!==t.position.length)return!1;for(let e=0;e<n.position.length;e++)if(!Bt(n.position[e],t.position[e]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xn{constructor(t,e="asc"){this.field=t,this.dir=e}}function Pd(n,t){return n.dir===t.dir&&n.field.isEqual(t.field)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nu{}class rt extends nu{constructor(t,e,r){super(),this.field=t,this.op=e,this.value=r}static create(t,e,r){return t.isKeyField()?e==="in"||e==="not-in"?this.createKeyFieldInFilter(t,e,r):new Vd(t,e,r):e==="array-contains"?new kd(t,r):e==="in"?new Od(t,r):e==="not-in"?new Md(t,r):e==="array-contains-any"?new xd(t,r):new rt(t,e,r)}static createKeyFieldInFilter(t,e,r){return e==="in"?new Dd(t,r):new Nd(t,r)}matches(t){const e=t.data.field(this.field);return this.op==="!="?e!==null&&e.nullValue===void 0&&this.matchesComparison(Ge(e,this.value)):e!==null&&ue(this.value)===ue(e)&&this.matchesComparison(Ge(e,this.value))}matchesComparison(t){switch(this.op){case"<":return t<0;case"<=":return t<=0;case"==":return t===0;case"!=":return t!==0;case">":return t>0;case">=":return t>=0;default:return x(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class Nt extends nu{constructor(t,e){super(),this.filters=t,this.op=e,this.Pe=null}static create(t,e){return new Nt(t,e)}matches(t){return ru(this)?this.filters.find((e=>!e.matches(t)))===void 0:this.filters.find((e=>e.matches(t)))!==void 0}getFlattenedFilters(){return this.Pe!==null||(this.Pe=this.filters.reduce(((t,e)=>t.concat(e.getFlattenedFilters())),[])),this.Pe}getFilters(){return Object.assign([],this.filters)}}function ru(n){return n.op==="and"}function su(n){return Cd(n)&&ru(n)}function Cd(n){for(const t of n.filters)if(t instanceof Nt)return!1;return!0}function Ws(n){if(n instanceof rt)return n.field.canonicalString()+n.op.toString()+Ke(n.value);if(su(n))return n.filters.map((t=>Ws(t))).join(",");{const t=n.filters.map((e=>Ws(e))).join(",");return`${n.op}(${t})`}}function iu(n,t){return n instanceof rt?(function(r,s){return s instanceof rt&&r.op===s.op&&r.field.isEqual(s.field)&&Bt(r.value,s.value)})(n,t):n instanceof Nt?(function(r,s){return s instanceof Nt&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((o,a,u)=>o&&iu(a,s.filters[u])),!0):!1})(n,t):void x(19439)}function ou(n){return n instanceof rt?(function(e){return`${e.field.canonicalString()} ${e.op} ${Ke(e.value)}`})(n):n instanceof Nt?(function(e){return e.op.toString()+" {"+e.getFilters().map(ou).join(" ,")+"}"})(n):"Filter"}class Vd extends rt{constructor(t,e,r){super(t,e,r),this.key=M.fromName(r.referenceValue)}matches(t){const e=M.comparator(t.key,this.key);return this.matchesComparison(e)}}class Dd extends rt{constructor(t,e){super(t,"in",e),this.keys=au("in",e)}matches(t){return this.keys.some((e=>e.isEqual(t.key)))}}class Nd extends rt{constructor(t,e){super(t,"not-in",e),this.keys=au("not-in",e)}matches(t){return!this.keys.some((e=>e.isEqual(t.key)))}}function au(n,t){var e;return(((e=t.arrayValue)==null?void 0:e.values)||[]).map((r=>M.fromName(r.referenceValue)))}class kd extends rt{constructor(t,e){super(t,"array-contains",e)}matches(t){const e=t.data.field(this.field);return Ei(e)&&On(e.arrayValue,this.value)}}class Od extends rt{constructor(t,e){super(t,"in",e)}matches(t){const e=t.data.field(this.field);return e!==null&&On(this.value.arrayValue,e)}}class Md extends rt{constructor(t,e){super(t,"not-in",e)}matches(t){if(On(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const e=t.data.field(this.field);return e!==null&&e.nullValue===void 0&&!On(this.value.arrayValue,e)}}class xd extends rt{constructor(t,e){super(t,"array-contains-any",e)}matches(t){const e=t.data.field(this.field);return!(!Ei(e)||!e.arrayValue.values)&&e.arrayValue.values.some((r=>On(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ld{constructor(t,e=null,r=[],s=[],o=null,a=null,u=null){this.path=t,this.collectionGroup=e,this.orderBy=r,this.filters=s,this.limit=o,this.startAt=a,this.endAt=u,this.Te=null}}function Na(n,t=null,e=[],r=[],s=null,o=null,a=null){return new Ld(n,t,e,r,s,o,a)}function Ti(n){const t=F(n);if(t.Te===null){let e=t.path.canonicalString();t.collectionGroup!==null&&(e+="|cg:"+t.collectionGroup),e+="|f:",e+=t.filters.map((r=>Ws(r))).join(","),e+="|ob:",e+=t.orderBy.map((r=>(function(o){return o.field.canonicalString()+o.dir})(r))).join(","),Br(t.limit)||(e+="|l:",e+=t.limit),t.startAt&&(e+="|lb:",e+=t.startAt.inclusive?"b:":"a:",e+=t.startAt.position.map((r=>Ke(r))).join(",")),t.endAt&&(e+="|ub:",e+=t.endAt.inclusive?"a:":"b:",e+=t.endAt.position.map((r=>Ke(r))).join(",")),t.Te=e}return t.Te}function Ii(n,t){if(n.limit!==t.limit||n.orderBy.length!==t.orderBy.length)return!1;for(let e=0;e<n.orderBy.length;e++)if(!Pd(n.orderBy[e],t.orderBy[e]))return!1;if(n.filters.length!==t.filters.length)return!1;for(let e=0;e<n.filters.length;e++)if(!iu(n.filters[e],t.filters[e]))return!1;return n.collectionGroup===t.collectionGroup&&!!n.path.isEqual(t.path)&&!!Da(n.startAt,t.startAt)&&Da(n.endAt,t.endAt)}function Qs(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ze{constructor(t,e=null,r=[],s=[],o=null,a="F",u=null,h=null){this.path=t,this.collectionGroup=e,this.explicitOrderBy=r,this.filters=s,this.limit=o,this.limitType=a,this.startAt=u,this.endAt=h,this.Ie=null,this.Ee=null,this.Re=null,this.startAt,this.endAt}}function Fd(n,t,e,r,s,o,a,u){return new Ze(n,t,e,r,s,o,a,u)}function jr(n){return new Ze(n)}function ka(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function Ud(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function cu(n){return n.collectionGroup!==null}function Rn(n){const t=F(n);if(t.Ie===null){t.Ie=[];const e=new Set;for(const o of t.explicitOrderBy)t.Ie.push(o),e.add(o.field.canonicalString());const r=t.explicitOrderBy.length>0?t.explicitOrderBy[t.explicitOrderBy.length-1].dir:"asc";(function(a){let u=new ot(lt.comparator);return a.filters.forEach((h=>{h.getFlattenedFilters().forEach((f=>{f.isInequality()&&(u=u.add(f.field))}))})),u})(t).forEach((o=>{e.has(o.canonicalString())||o.isKeyField()||t.Ie.push(new xn(o,r))})),e.has(lt.keyField().canonicalString())||t.Ie.push(new xn(lt.keyField(),r))}return t.Ie}function Lt(n){const t=F(n);return t.Ee||(t.Ee=Bd(t,Rn(n))),t.Ee}function Bd(n,t){if(n.limitType==="F")return Na(n.path,n.collectionGroup,t,n.filters,n.limit,n.startAt,n.endAt);{t=t.map((s=>{const o=s.dir==="desc"?"asc":"desc";return new xn(s.field,o)}));const e=n.endAt?new Ar(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new Ar(n.startAt.position,n.startAt.inclusive):null;return Na(n.path,n.collectionGroup,t,n.filters,n.limit,e,r)}}function Js(n,t){const e=n.filters.concat([t]);return new Ze(n.path,n.collectionGroup,n.explicitOrderBy.slice(),e,n.limit,n.limitType,n.startAt,n.endAt)}function qd(n,t){const e=n.explicitOrderBy.concat([t]);return new Ze(n.path,n.collectionGroup,e,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function Xs(n,t,e){return new Ze(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),t,e,n.startAt,n.endAt)}function $r(n,t){return Ii(Lt(n),Lt(t))&&n.limitType===t.limitType}function uu(n){return`${Ti(Lt(n))}|lt:${n.limitType}`}function Le(n){return`Query(target=${(function(e){let r=e.path.canonicalString();return e.collectionGroup!==null&&(r+=" collectionGroup="+e.collectionGroup),e.filters.length>0&&(r+=`, filters: [${e.filters.map((s=>ou(s))).join(", ")}]`),Br(e.limit)||(r+=", limit: "+e.limit),e.orderBy.length>0&&(r+=`, orderBy: [${e.orderBy.map((s=>(function(a){return`${a.field.canonicalString()} (${a.dir})`})(s))).join(", ")}]`),e.startAt&&(r+=", startAt: ",r+=e.startAt.inclusive?"b:":"a:",r+=e.startAt.position.map((s=>Ke(s))).join(",")),e.endAt&&(r+=", endAt: ",r+=e.endAt.inclusive?"a:":"b:",r+=e.endAt.position.map((s=>Ke(s))).join(",")),`Target(${r})`})(Lt(n))}; limitType=${n.limitType})`}function zr(n,t){return t.isFoundDocument()&&(function(r,s){const o=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(o):M.isDocumentKey(r.path)?r.path.isEqual(o):r.path.isImmediateParentOf(o)})(n,t)&&(function(r,s){for(const o of Rn(r))if(!o.field.isKeyField()&&s.data.field(o.field)===null)return!1;return!0})(n,t)&&(function(r,s){for(const o of r.filters)if(!o.matches(s))return!1;return!0})(n,t)&&(function(r,s){return!(r.startAt&&!(function(a,u,h){const f=Va(a,u,h);return a.inclusive?f<=0:f<0})(r.startAt,Rn(r),s)||r.endAt&&!(function(a,u,h){const f=Va(a,u,h);return a.inclusive?f>=0:f>0})(r.endAt,Rn(r),s))})(n,t)}function jd(n){return n.collectionGroup||(n.path.length%2==1?n.path.lastSegment():n.path.get(n.path.length-2))}function lu(n){return(t,e)=>{let r=!1;for(const s of Rn(n)){const o=$d(s,t,e);if(o!==0)return o;r=r||s.field.isKeyField()}return 0}}function $d(n,t,e){const r=n.field.isKeyField()?M.comparator(t.key,e.key):(function(o,a,u){const h=a.data.field(o),f=u.data.field(o);return h!==null&&f!==null?Ge(h,f):x(42886)})(n.field,t,e);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return x(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(t,e){this.mapKeyFn=t,this.equalsFn=e,this.inner={},this.innerSize=0}get(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r!==void 0){for(const[s,o]of r)if(this.equalsFn(s,t))return o}}has(t){return this.get(t)!==void 0}set(t,e){const r=this.mapKeyFn(t),s=this.inner[r];if(s===void 0)return this.inner[r]=[[t,e]],void this.innerSize++;for(let o=0;o<s.length;o++)if(this.equalsFn(s[o][0],t))return void(s[o]=[t,e]);s.push([t,e]),this.innerSize++}delete(t){const e=this.mapKeyFn(t),r=this.inner[e];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],t))return r.length===1?delete this.inner[e]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(t){me(this.inner,((e,r)=>{for(const[s,o]of r)t(s,o)}))}isEmpty(){return Kc(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const zd=new X(M.comparator);function Ht(){return zd}const hu=new X(M.comparator);function In(...n){let t=hu;for(const e of n)t=t.insert(e.key,e);return t}function fu(n){let t=hu;return n.forEach(((e,r)=>t=t.insert(e,r.overlayedDocument))),t}function ve(){return bn()}function du(){return bn()}function bn(){return new Ve((n=>n.toString()),((n,t)=>n.isEqual(t)))}const Gd=new X(M.comparator),Kd=new ot(M.comparator);function q(...n){let t=Kd;for(const e of n)t=t.add(e);return t}const Hd=new ot(B);function Wd(){return Hd}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Gr(n,t){if(n.useProto3Json){if(isNaN(t))return{doubleValue:"NaN"};if(t===1/0)return{doubleValue:"Infinity"};if(t===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:Ir(t)?"-0":t}}function wi(n){return{integerValue:""+n}}function Qd(n,t){return Ed(t)?wi(t):Gr(n,t)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kr{constructor(){this._=void 0}}function Jd(n,t,e){return n instanceof Rr?(function(s,o){const a={fields:{[Qc]:{stringValue:Wc},[Xc]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return o&&yi(o)&&(o=qr(o)),o&&(a.fields[Jc]=o),{mapValue:a}})(e,t):n instanceof Ln?pu(n,t):n instanceof Fn?gu(n,t):n instanceof Un?(function(s,o){const a=mu(s,o),u=Pr(a)+Pr(s.Ae);return Mn(a)&&Mn(s.Ae)?wi(u):Gr(s.serializer,u)})(n,t):n instanceof br?(function(s,o){return Oa(s,o,Math.min)})(n,t):n instanceof Sr?(function(s,o){return Oa(s,o,Math.max)})(n,t):void 0}function Xd(n,t,e){return n instanceof Ln?pu(n,t):n instanceof Fn?gu(n,t):e}function mu(n,t){return n instanceof Un?tu(t)?t:{integerValue:0}:null}class Rr extends Kr{}class Ln extends Kr{constructor(t){super(),this.elements=t}}function pu(n,t){const e=_u(t);for(const r of n.elements)e.some((s=>Bt(s,r)))||e.push(r);return{arrayValue:{values:e}}}class Fn extends Kr{constructor(t){super(),this.elements=t}}function gu(n,t){let e=_u(t);for(const r of n.elements)e=e.filter((s=>!Bt(s,r)));return{arrayValue:{values:e}}}class vi extends Kr{constructor(t,e){super(),this.serializer=t,this.Ae=e}}class Un extends vi{}class br extends vi{}class Sr extends vi{}function Oa(n,t,e){if(!tu(t))return n.Ae;const r=e(Pr(t),Pr(n.Ae));return Mn(t)&&Mn(n.Ae)?wi(r):Gr(n.serializer,r)}function Pr(n){return tt(n.integerValue||n.doubleValue)}function _u(n){return Ei(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}function Yd(n,t){return n.field.isEqual(t.field)&&(function(r,s){return r instanceof Ln&&s instanceof Ln||r instanceof Fn&&s instanceof Fn?ze(r.elements,s.elements,Bt):r instanceof Un&&s instanceof Un||r instanceof br&&s instanceof br||r instanceof Sr&&s instanceof Sr?Bt(r.Ae,s.Ae):r instanceof Rr&&s instanceof Rr})(n.transform,t.transform)}class Zd{constructor(t,e){this.version=t,this.transformResults=e}}class Vt{constructor(t,e){this.updateTime=t,this.exists=e}static none(){return new Vt}static exists(t){return new Vt(void 0,t)}static updateTime(t){return new Vt(t)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(t){return this.exists===t.exists&&(this.updateTime?!!t.updateTime&&this.updateTime.isEqual(t.updateTime):!t.updateTime)}}function _r(n,t){return n.updateTime!==void 0?t.isFoundDocument()&&t.version.isEqual(n.updateTime):n.exists===void 0||n.exists===t.isFoundDocument()}class Hr{}function yu(n,t){if(!n.hasLocalMutations||t&&t.fields.length===0)return null;if(t===null)return n.isNoDocument()?new Ai(n.key,Vt.none()):new jn(n.key,n.data,Vt.none());{const e=n.data,r=vt.empty();let s=new ot(lt.comparator);for(let o of t.fields)if(!s.has(o)){let a=e.field(o);a===null&&o.length>1&&(o=o.popLast(),a=e.field(o)),a===null?r.delete(o):r.set(o,a),s=s.add(o)}return new pe(n.key,r,new bt(s.toArray()),Vt.none())}}function tm(n,t,e){n instanceof jn?(function(s,o,a){const u=s.value.clone(),h=xa(s.fieldTransforms,o,a.transformResults);u.setAll(h),o.convertToFoundDocument(a.version,u).setHasCommittedMutations()})(n,t,e):n instanceof pe?(function(s,o,a){if(!_r(s.precondition,o))return void o.convertToUnknownDocument(a.version);const u=xa(s.fieldTransforms,o,a.transformResults),h=o.data;h.setAll(Eu(s)),h.setAll(u),o.convertToFoundDocument(a.version,h).setHasCommittedMutations()})(n,t,e):(function(s,o,a){o.convertToNoDocument(a.version).setHasCommittedMutations()})(0,t,e)}function Sn(n,t,e,r){return n instanceof jn?(function(o,a,u,h){if(!_r(o.precondition,a))return u;const f=o.value.clone(),m=La(o.fieldTransforms,h,a);return f.setAll(m),a.convertToFoundDocument(a.version,f).setHasLocalMutations(),null})(n,t,e,r):n instanceof pe?(function(o,a,u,h){if(!_r(o.precondition,a))return u;const f=La(o.fieldTransforms,h,a),m=a.data;return m.setAll(Eu(o)),m.setAll(f),a.convertToFoundDocument(a.version,m).setHasLocalMutations(),u===null?null:u.unionWith(o.fieldMask.fields).unionWith(o.fieldTransforms.map((y=>y.field)))})(n,t,e,r):(function(o,a,u){return _r(o.precondition,a)?(a.convertToNoDocument(a.version).setHasLocalMutations(),null):u})(n,t,e)}function em(n,t){let e=null;for(const r of n.fieldTransforms){const s=t.data.field(r.field),o=mu(r.transform,s||null);o!=null&&(e===null&&(e=vt.empty()),e.set(r.field,o))}return e||null}function Ma(n,t){return n.type===t.type&&!!n.key.isEqual(t.key)&&!!n.precondition.isEqual(t.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&ze(r,s,((o,a)=>Yd(o,a)))})(n.fieldTransforms,t.fieldTransforms)&&(n.type===0?n.value.isEqual(t.value):n.type!==1||n.data.isEqual(t.data)&&n.fieldMask.isEqual(t.fieldMask))}class jn extends Hr{constructor(t,e,r,s=[]){super(),this.key=t,this.value=e,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class pe extends Hr{constructor(t,e,r,s,o=[]){super(),this.key=t,this.data=e,this.fieldMask=r,this.precondition=s,this.fieldTransforms=o,this.type=1}getFieldMask(){return this.fieldMask}}function Eu(n){const t=new Map;return n.fieldMask.fields.forEach((e=>{if(!e.isEmpty()){const r=n.data.field(e);t.set(e,r)}})),t}function xa(n,t,e){const r=new Map;z(n.length===e.length,32656,{Ve:e.length,de:n.length});for(let s=0;s<e.length;s++){const o=n[s],a=o.transform,u=t.data.field(o.field);r.set(o.field,Xd(a,u,e[s]))}return r}function La(n,t,e){const r=new Map;for(const s of n){const o=s.transform,a=e.data.field(s.field);r.set(s.field,Jd(o,a,t))}return r}class Ai extends Hr{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class nm extends Hr{constructor(t,e){super(),this.key=t,this.precondition=e,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class rm{constructor(t,e,r,s){this.batchId=t,this.localWriteTime=e,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(t,e){const r=e.mutationResults;for(let s=0;s<this.mutations.length;s++){const o=this.mutations[s];o.key.isEqual(t.key)&&tm(o,t,r[s])}}applyToLocalView(t,e){for(const r of this.baseMutations)r.key.isEqual(t.key)&&(e=Sn(r,t,e,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(t.key)&&(e=Sn(r,t,e,this.localWriteTime));return e}applyToLocalDocumentSet(t,e){const r=du();return this.mutations.forEach((s=>{const o=t.get(s.key),a=o.overlayedDocument;let u=this.applyToLocalView(a,o.mutatedFields);u=e.has(s.key)?null:u;const h=yu(a,u);h!==null&&r.set(s.key,h),a.isValidDocument()||a.convertToNoDocument(L.min())})),r}keys(){return this.mutations.reduce(((t,e)=>t.add(e.key)),q())}isEqual(t){return this.batchId===t.batchId&&ze(this.mutations,t.mutations,((e,r)=>Ma(e,r)))&&ze(this.baseMutations,t.baseMutations,((e,r)=>Ma(e,r)))}}class Ri{constructor(t,e,r,s){this.batch=t,this.commitVersion=e,this.mutationResults=r,this.docVersions=s}static from(t,e,r){z(t.mutations.length===r.length,58842,{me:t.mutations.length,fe:r.length});let s=(function(){return Gd})();const o=t.mutations;for(let a=0;a<o.length;a++)s=s.insert(o[a].key,r[a].version);return new Ri(t,e,r,s)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sm{constructor(t,e){this.largestBatchId=t,this.mutation=e}getKey(){return this.mutation.key}isEqual(t){return t!==null&&this.mutation===t.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class im{constructor(t,e){this.count=t,this.unchangedNames=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var nt,j;function om(n){switch(n){case b.OK:return x(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return x(15467,{code:n})}}function Tu(n){if(n===void 0)return Kt("GRPC error has no .code"),b.UNKNOWN;switch(n){case nt.OK:return b.OK;case nt.CANCELLED:return b.CANCELLED;case nt.UNKNOWN:return b.UNKNOWN;case nt.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case nt.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case nt.INTERNAL:return b.INTERNAL;case nt.UNAVAILABLE:return b.UNAVAILABLE;case nt.UNAUTHENTICATED:return b.UNAUTHENTICATED;case nt.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case nt.NOT_FOUND:return b.NOT_FOUND;case nt.ALREADY_EXISTS:return b.ALREADY_EXISTS;case nt.PERMISSION_DENIED:return b.PERMISSION_DENIED;case nt.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case nt.ABORTED:return b.ABORTED;case nt.OUT_OF_RANGE:return b.OUT_OF_RANGE;case nt.UNIMPLEMENTED:return b.UNIMPLEMENTED;case nt.DATA_LOSS:return b.DATA_LOSS;default:return x(39323,{code:n})}}(j=nt||(nt={}))[j.OK=0]="OK",j[j.CANCELLED=1]="CANCELLED",j[j.UNKNOWN=2]="UNKNOWN",j[j.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",j[j.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",j[j.NOT_FOUND=5]="NOT_FOUND",j[j.ALREADY_EXISTS=6]="ALREADY_EXISTS",j[j.PERMISSION_DENIED=7]="PERMISSION_DENIED",j[j.UNAUTHENTICATED=16]="UNAUTHENTICATED",j[j.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",j[j.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",j[j.ABORTED=10]="ABORTED",j[j.OUT_OF_RANGE=11]="OUT_OF_RANGE",j[j.UNIMPLEMENTED=12]="UNIMPLEMENTED",j[j.INTERNAL=13]="INTERNAL",j[j.UNAVAILABLE=14]="UNAVAILABLE",j[j.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function am(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cm=new ne([4294967295,4294967295],0);function Fa(n){const t=am().encode(n),e=new Mc;return e.update(t),new Uint8Array(e.digest())}function Ua(n){const t=new DataView(n.buffer),e=t.getUint32(0,!0),r=t.getUint32(4,!0),s=t.getUint32(8,!0),o=t.getUint32(12,!0);return[new ne([e,r],0),new ne([s,o],0)]}class bi{constructor(t,e,r){if(this.bitmap=t,this.padding=e,this.hashCount=r,e<0||e>=8)throw new wn(`Invalid padding: ${e}`);if(r<0)throw new wn(`Invalid hash count: ${r}`);if(t.length>0&&this.hashCount===0)throw new wn(`Invalid hash count: ${r}`);if(t.length===0&&e!==0)throw new wn(`Invalid padding when bitmap length is 0: ${e}`);this.ge=8*t.length-e,this.pe=ne.fromNumber(this.ge)}ye(t,e,r){let s=t.add(e.multiply(ne.fromNumber(r)));return s.compare(cm)===1&&(s=new ne([s.getBits(0),s.getBits(1)],0)),s.modulo(this.pe).toNumber()}we(t){return!!(this.bitmap[Math.floor(t/8)]&1<<t%8)}mightContain(t){if(this.ge===0)return!1;const e=Fa(t),[r,s]=Ua(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);if(!this.we(a))return!1}return!0}static create(t,e,r){const s=t%8==0?0:8-t%8,o=new Uint8Array(Math.ceil(t/8)),a=new bi(o,s,e);return r.forEach((u=>a.insert(u))),a}insert(t){if(this.ge===0)return;const e=Fa(t),[r,s]=Ua(e);for(let o=0;o<this.hashCount;o++){const a=this.ye(r,s,o);this.Se(a)}}Se(t){const e=Math.floor(t/8),r=t%8;this.bitmap[e]|=1<<r}}class wn extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $n{constructor(t,e,r,s,o){this.snapshotVersion=t,this.targetChanges=e,this.targetMismatches=r,this.documentUpdates=s,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(t,e,r){const s=new Map;return s.set(t,zn.createSynthesizedTargetChangeForCurrentChange(t,e,r)),new $n(L.min(),s,new X(B),Ht(),q())}}class zn{constructor(t,e,r,s,o){this.resumeToken=t,this.current=e,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=o}static createSynthesizedTargetChangeForCurrentChange(t,e,r){return new zn(r,e,q(),q(),q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yr{constructor(t,e,r,s){this.be=t,this.removedTargetIds=e,this.key=r,this.De=s}}class Iu{constructor(t,e){this.targetId=t,this.Ce=e}}class wu{constructor(t,e,r=ht.EMPTY_BYTE_STRING,s=null){this.state=t,this.targetIds=e,this.resumeToken=r,this.cause=s}}class Ba{constructor(t){this.targetId=t,this.ve=0,this.Fe=qa(),this.Me=ht.EMPTY_BYTE_STRING,this.xe=!1,this.Oe=!0}get current(){return this.xe}get resumeToken(){return this.Me}get Ne(){return this.ve!==0}get Be(){return this.Oe}Le(t){t.approximateByteSize()>0&&(this.Oe=!0,this.Me=t)}ke(){let t=q(),e=q(),r=q();return this.Fe.forEach(((s,o)=>{switch(o){case 0:t=t.add(s);break;case 2:e=e.add(s);break;case 1:r=r.add(s);break;default:x(38017,{changeType:o})}})),new zn(this.Me,this.xe,t,e,r)}qe(){this.Oe=!1,this.Fe=qa()}Ke(t,e){this.Oe=!0,this.Fe=this.Fe.insert(t,e)}Ue(t){this.Oe=!0,this.Fe=this.Fe.remove(t)}$e(){this.ve+=1}We(){this.ve-=1,z(this.ve>=0,3241,{ve:this.ve,targetId:this.targetId})}Qe(){this.Oe=!0,this.xe=!0}}const yn="WatchChangeAggregator";class um{constructor(t){this.Ge=t,this.ze=new Map,this.je=Ht(),this.Je=fr(),this.He=fr(),this.Ze=new X(B)}Xe(t){for(const e of t.be)t.De&&t.De.isFoundDocument()?this.Ye(e,t.De):this.et(e,t.key,t.De);for(const e of t.removedTargetIds)this.et(e,t.key,t.De)}tt(t){this.forEachTarget(t,(e=>{const r=this.ze.get(e);if(r)switch(t.state){case 0:this.nt(e)&&r.Le(t.resumeToken);break;case 1:r.We(),r.Ne||r.qe(),r.Le(t.resumeToken);break;case 2:r.We(),r.Ne||this.removeTarget(e);break;case 3:this.nt(e)&&(r.Qe(),r.Le(t.resumeToken));break;case 4:this.nt(e)&&(this.rt(e),r.Le(t.resumeToken));break;default:x(56790,{state:t.state})}else V(yn,`handleTargetChange received targetChange for untracked target ID (${e}) with state (${t.state})`)}))}forEachTarget(t,e){t.targetIds.length>0?t.targetIds.forEach(e):this.ze.forEach(((r,s)=>{this.nt(s)&&e(s)}))}it(t){const e=t.targetId,r=t.Ce.count,s=this.st(e);if(s){const o=s.target;if(Qs(o))if(r===0){const a=new M(o.path);this.et(e,a,_t.newNoDocument(a,L.min()))}else z(r===1,20013,{expectedCount:r});else{const a=this.ot(e);if(a!==r){const u=this._t(t),h=u?this.ut(u,t,a):1;if(h!==0){this.rt(e);const f=h===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.Ze=this.Ze.insert(e,f)}}}}}_t(t){const e=t.Ce.unchangedNames;if(!e||!e.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:o=0}=e;let a,u;try{a=ce(r).toUint8Array()}catch(h){if(h instanceof Hc)return Se("Decoding the base64 bloom filter in existence filter failed ("+h.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw h}try{u=new bi(a,s,o)}catch(h){return Se(h instanceof wn?"BloomFilter error: ":"Applying bloom filter failed: ",h),null}return u.ge===0?null:u}ut(t,e,r){return e.Ce.count===r-this.ht(t,e.targetId)?0:2}ht(t,e){const r=this.Ge.getRemoteKeysForTarget(e);let s=0;return r.forEach((o=>{const a=this.Ge.lt(),u=`projects/${a.projectId}/databases/${a.database}/documents/${o.path.canonicalString()}`;t.mightContain(u)||(this.et(e,o,null),s++)})),s}Pt(t){const e=new Map;this.ze.forEach(((o,a)=>{const u=this.st(a);if(u){if(o.current&&Qs(u.target)){const h=new M(u.target.path);this.Tt(h).has(a)||this.It(a,h)||this.et(a,h,_t.newNoDocument(h,t))}o.Be&&(e.set(a,o.ke()),o.qe())}}));let r=q();this.He.forEach(((o,a)=>{let u=!0;a.forEachWhile((h=>{const f=this.st(h);return!f||f.purpose==="TargetPurposeLimboResolution"||(u=!1,!1)})),u&&(r=r.add(o))})),this.je.forEach(((o,a)=>a.setReadTime(t)));const s=new $n(t,e,this.Ze,this.je,r);return this.je=Ht(),this.Je=fr(),this.He=fr(),this.Ze=new X(B),s}Ye(t,e){const r=this.ze.get(t);if(!r||!this.nt(t))return void V(yn,`addDocumentToTarget received document for unknown inactive target (${t})`);const s=this.It(t,e.key)?2:0;r.Ke(e.key,s),this.je=this.je.insert(e.key,e),this.Je=this.Je.insert(e.key,this.Tt(e.key).add(t)),this.He=this.He.insert(e.key,this.Et(e.key).add(t))}et(t,e,r){const s=this.ze.get(t);s&&this.nt(t)?(this.It(t,e)?s.Ke(e,1):s.Ue(e),this.He=this.He.insert(e,this.Et(e).delete(t)),this.He=this.He.insert(e,this.Et(e).add(t)),r&&(this.je=this.je.insert(e,r))):V(yn,`removeDocumentFromTarget received document for unknown or inactive target (${t})`)}removeTarget(t){this.ze.delete(t)}ot(t){const e=this.ze.get(t);if(!e)return 0;const r=e.ke();return this.Ge.getRemoteKeysForTarget(t).size+r.addedDocuments.size-r.removedDocuments.size}$e(t){let e=this.ze.get(t);e||(V(yn,`recordPendingTargetRequest set up tracking for target ID ${t}`),e=new Ba(t),this.ze.set(t,e)),e.$e()}Et(t){let e=this.He.get(t);return e||(e=new ot(B),this.He=this.He.insert(t,e)),e}Tt(t){let e=this.Je.get(t);return e||(e=new ot(B),this.Je=this.Je.insert(t,e)),e}nt(t){const e=this.st(t)!==null;return e||V(yn,"Detected inactive target",t),e}st(t){const e=this.ze.get(t);return e===void 0||e.Ne?null:this.Ge.Rt(t)}rt(t){this.ze.set(t,new Ba(t)),this.Ge.getRemoteKeysForTarget(t).forEach((e=>{this.et(t,e,null)}))}It(t,e){return this.Ge.getRemoteKeysForTarget(t).has(e)}}function fr(){return new X(M.comparator)}function qa(){return new X(M.comparator)}const lm={asc:"ASCENDING",desc:"DESCENDING"},hm={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},fm={and:"AND",or:"OR"};class dm{constructor(t,e){this.databaseId=t,this.useProto3Json=e}}function Ys(n,t){return n.useProto3Json||Br(t)?t:{value:t}}function Cr(n,t){return n.useProto3Json?`${new Date(1e3*t.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+t.nanoseconds).slice(-9)}Z`:{seconds:""+t.seconds,nanos:t.nanoseconds}}function vu(n,t){return n.useProto3Json?t.toBase64():t.toUint8Array()}function mm(n,t){return Cr(n,t.toTimestamp())}function Ft(n){return z(!!n,49232),L.fromTimestamp((function(e){const r=ae(e);return new J(r.seconds,r.nanos)})(n))}function Si(n,t){return Zs(n,t).canonicalString()}function Zs(n,t){const e=(function(s){return new W(["projects",s.projectId,"databases",s.database])})(n).child("documents");return t===void 0?e:e.child(t)}function Au(n){const t=W.fromString(n);return z(Cu(t),10190,{key:t.toString()}),t}function ti(n,t){return Si(n.databaseId,t.path)}function Ns(n,t){const e=Au(t);if(e.get(1)!==n.databaseId.projectId)throw new D(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+e.get(1)+" vs "+n.databaseId.projectId);if(e.get(3)!==n.databaseId.database)throw new D(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+e.get(3)+" vs "+n.databaseId.database);return new M(bu(e))}function Ru(n,t){return Si(n.databaseId,t)}function pm(n){const t=Au(n);return t.length===4?W.emptyPath():bu(t)}function ei(n){return new W(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function bu(n){return z(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function ja(n,t,e){return{name:ti(n,t),fields:e.value.mapValue.fields}}function gm(n,t){let e;if("targetChange"in t){t.targetChange;const r=(function(f){return f==="NO_CHANGE"?0:f==="ADD"?1:f==="REMOVE"?2:f==="CURRENT"?3:f==="RESET"?4:x(39313,{state:f})})(t.targetChange.targetChangeType||"NO_CHANGE"),s=t.targetChange.targetIds||[],o=(function(f,m){return f.useProto3Json?(z(m===void 0||typeof m=="string",58123),ht.fromBase64String(m||"")):(z(m===void 0||m instanceof Buffer||m instanceof Uint8Array,16193),ht.fromUint8Array(m||new Uint8Array))})(n,t.targetChange.resumeToken),a=t.targetChange.cause,u=a&&(function(f){const m=f.code===void 0?b.UNKNOWN:Tu(f.code);return new D(m,f.message||"")})(a);e=new wu(r,s,o,u||null)}else if("documentChange"in t){t.documentChange;const r=t.documentChange;r.document,r.document.name,r.document.updateTime;const s=Ns(n,r.document.name),o=Ft(r.document.updateTime),a=r.document.createTime?Ft(r.document.createTime):L.min(),u=new vt({mapValue:{fields:r.document.fields}}),h=_t.newFoundDocument(s,o,a,u),f=r.targetIds||[],m=r.removedTargetIds||[];e=new yr(f,m,h.key,h)}else if("documentDelete"in t){t.documentDelete;const r=t.documentDelete;r.document;const s=Ns(n,r.document),o=r.readTime?Ft(r.readTime):L.min(),a=_t.newNoDocument(s,o),u=r.removedTargetIds||[];e=new yr([],u,a.key,a)}else if("documentRemove"in t){t.documentRemove;const r=t.documentRemove;r.document;const s=Ns(n,r.document),o=r.removedTargetIds||[];e=new yr([],o,s,null)}else{if(!("filter"in t))return x(11601,{At:t});{t.filter;const r=t.filter;r.targetId;const{count:s=0,unchangedNames:o}=r,a=new im(s,o),u=r.targetId;e=new Iu(u,a)}}return e}function _m(n,t){let e;if(t instanceof jn)e={update:ja(n,t.key,t.value)};else if(t instanceof Ai)e={delete:ti(n,t.key)};else if(t instanceof pe)e={update:ja(n,t.key,t.data),updateMask:bm(t.fieldMask)};else{if(!(t instanceof nm))return x(16599,{Vt:t.type});e={verify:ti(n,t.key)}}return t.fieldTransforms.length>0&&(e.updateTransforms=t.fieldTransforms.map((r=>(function(o,a){const u=a.transform;if(u instanceof Rr)return{fieldPath:a.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(u instanceof Ln)return{fieldPath:a.field.canonicalString(),appendMissingElements:{values:u.elements}};if(u instanceof Fn)return{fieldPath:a.field.canonicalString(),removeAllFromArray:{values:u.elements}};if(u instanceof Un)return{fieldPath:a.field.canonicalString(),increment:u.Ae};if(u instanceof br)return{fieldPath:a.field.canonicalString(),minimum:u.Ae};if(u instanceof Sr)return{fieldPath:a.field.canonicalString(),maximum:u.Ae};throw x(20930,{transform:a.transform})})(0,r)))),t.precondition.isNone||(e.currentDocument=(function(s,o){return o.updateTime!==void 0?{updateTime:mm(s,o.updateTime)}:o.exists!==void 0?{exists:o.exists}:x(27497)})(n,t.precondition)),e}function ym(n,t){return n&&n.length>0?(z(t!==void 0,14353),n.map((e=>(function(s,o){let a=s.updateTime?Ft(s.updateTime):Ft(o);return a.isEqual(L.min())&&(a=Ft(o)),new Zd(a,s.transformResults||[])})(e,t)))):[]}function Em(n,t){return{documents:[Ru(n,t.path)]}}function Tm(n,t){const e={structuredQuery:{}},r=t.path;let s;t.collectionGroup!==null?(s=r,e.structuredQuery.from=[{collectionId:t.collectionGroup,allDescendants:!0}]):(s=r.popLast(),e.structuredQuery.from=[{collectionId:r.lastSegment()}]),e.parent=Ru(n,s);const o=(function(f){if(f.length!==0)return Pu(Nt.create(f,"and"))})(t.filters);o&&(e.structuredQuery.where=o);const a=(function(f){if(f.length!==0)return f.map((m=>(function(v){return{field:Fe(v.field),direction:vm(v.dir)}})(m)))})(t.orderBy);a&&(e.structuredQuery.orderBy=a);const u=Ys(n,t.limit);return u!==null&&(e.structuredQuery.limit=u),t.startAt&&(e.structuredQuery.startAt=(function(f){return{before:f.inclusive,values:f.position}})(t.startAt)),t.endAt&&(e.structuredQuery.endAt=(function(f){return{before:!f.inclusive,values:f.position}})(t.endAt)),{dt:e,parent:s}}function Im(n){let t=pm(n.parent);const e=n.structuredQuery,r=e.from?e.from.length:0;let s=null;if(r>0){z(r===1,65062);const m=e.from[0];m.allDescendants?s=m.collectionId:t=t.child(m.collectionId)}let o=[];e.where&&(o=(function(y){const v=Su(y);return v instanceof Nt&&su(v)?v.getFilters():[v]})(e.where));let a=[];e.orderBy&&(a=(function(y){return y.map((v=>(function(N){return new xn(Ue(N.field),(function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(N.direction))})(v)))})(e.orderBy));let u=null;e.limit&&(u=(function(y){let v;return v=typeof y=="object"?y.value:y,Br(v)?null:v})(e.limit));let h=null;e.startAt&&(h=(function(y){const v=!!y.before,P=y.values||[];return new Ar(P,v)})(e.startAt));let f=null;return e.endAt&&(f=(function(y){const v=!y.before,P=y.values||[];return new Ar(P,v)})(e.endAt)),Fd(t,s,a,o,u,"F",h,f)}function wm(n,t){const e=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return x(28987,{purpose:s})}})(t.purpose);return e==null?null:{"goog-listen-tags":e}}function Su(n){return n.unaryFilter!==void 0?(function(e){switch(e.unaryFilter.op){case"IS_NAN":const r=Ue(e.unaryFilter.field);return rt.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=Ue(e.unaryFilter.field);return rt.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const o=Ue(e.unaryFilter.field);return rt.create(o,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const a=Ue(e.unaryFilter.field);return rt.create(a,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return x(61313);default:return x(60726)}})(n):n.fieldFilter!==void 0?(function(e){return rt.create(Ue(e.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return x(58110);default:return x(50506)}})(e.fieldFilter.op),e.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(e){return Nt.create(e.compositeFilter.filters.map((r=>Su(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return x(1026)}})(e.compositeFilter.op))})(n):x(30097,{filter:n})}function vm(n){return lm[n]}function Am(n){return hm[n]}function Rm(n){return fm[n]}function Fe(n){return{fieldPath:n.canonicalString()}}function Ue(n){return lt.fromServerFormat(n.fieldPath)}function Pu(n){return n instanceof rt?(function(e){if(e.op==="=="){if(Ca(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NAN"}};if(Pa(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NULL"}}}else if(e.op==="!="){if(Ca(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NOT_NAN"}};if(Pa(e.value))return{unaryFilter:{field:Fe(e.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:Fe(e.field),op:Am(e.op),value:e.value}}})(n):n instanceof Nt?(function(e){const r=e.getFilters().map((s=>Pu(s)));return r.length===1?r[0]:{compositeFilter:{op:Rm(e.op),filters:r}}})(n):x(54877,{filter:n})}function bm(n){const t=[];return n.fields.forEach((e=>t.push(e.canonicalString()))),{fieldPaths:t}}function Cu(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function Vu(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jt{constructor(t,e,r,s,o=L.min(),a=L.min(),u=ht.EMPTY_BYTE_STRING,h=null){this.target=t,this.targetId=e,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=o,this.lastLimboFreeSnapshotVersion=a,this.resumeToken=u,this.expectedCount=h}withSequenceNumber(t){return new jt(this.target,this.targetId,this.purpose,t,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(t,e){return new jt(this.target,this.targetId,this.purpose,this.sequenceNumber,e,this.lastLimboFreeSnapshotVersion,t,null)}withExpectedCount(t){return new jt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,t)}withLastLimboFreeSnapshotVersion(t){return new jt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,t,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sm{constructor(t){this.gt=t}}function Pm(n){const t=Im({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?Xs(t,t.limit,"L"):t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cm{constructor(){this.Sn=new Vm}addToCollectionParentIndex(t,e){return this.Sn.add(e),S.resolve()}getCollectionParents(t,e){return S.resolve(this.Sn.getEntries(e))}addFieldIndex(t,e){return S.resolve()}deleteFieldIndex(t,e){return S.resolve()}deleteAllFieldIndexes(t){return S.resolve()}createTargetIndexes(t,e){return S.resolve()}getDocumentsMatchingTarget(t,e){return S.resolve(null)}getIndexType(t,e){return S.resolve(0)}getFieldIndexes(t,e){return S.resolve([])}getNextCollectionGroupToUpdate(t){return S.resolve(null)}getMinOffset(t,e){return S.resolve(oe.min())}getMinOffsetFromCollectionGroup(t,e){return S.resolve(oe.min())}updateCollectionGroup(t,e,r){return S.resolve()}updateIndexEntries(t,e){return S.resolve()}}class Vm{constructor(){this.index={}}add(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e]||new ot(W.comparator),o=!s.has(r);return this.index[e]=s.add(r),o}has(t){const e=t.lastSegment(),r=t.popLast(),s=this.index[e];return s&&s.has(r)}getEntries(t){return(this.index[t]||new ot(W.comparator)).toArray()}}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $a={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},Du=41943040;class wt{static withCacheSize(t){return new wt(t,wt.DEFAULT_COLLECTION_PERCENTILE,wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(t,e,r){this.cacheSizeCollectionThreshold=t,this.percentileToCollect=e,this.maximumSequenceNumbersToCollect=r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */wt.DEFAULT_COLLECTION_PERCENTILE=10,wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,wt.DEFAULT=new wt(Du,wt.DEFAULT_COLLECTION_PERCENTILE,wt.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),wt.DISABLED=new wt(-1,0,0);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class le{constructor(t){this.ir=t}next(){return this.ir+=2,this.ir}static sr(){return new le(0)}static _r(){return new le(-1)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const za="LruGarbageCollector",Dm=1048576;function Ga([n,t],[e,r]){const s=B(n,e);return s===0?B(t,r):s}class Nm{constructor(t){this.hr=t,this.buffer=new ot(Ga),this.Pr=0}Tr(){return++this.Pr}Ir(t){const e=[t,this.Tr()];if(this.buffer.size<this.hr)this.buffer=this.buffer.add(e);else{const r=this.buffer.last();Ga(e,r)<0&&(this.buffer=this.buffer.delete(r).add(e))}}get maxValue(){return this.buffer.last()[0]}}class km{constructor(t,e,r){this.garbageCollector=t,this.asyncQueue=e,this.localStore=r,this.Er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.Rr(6e4)}stop(){this.Er&&(this.Er.cancel(),this.Er=null)}get started(){return this.Er!==null}Rr(t){V(za,`Garbage collection scheduled in ${t}ms`),this.Er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",t,(async()=>{this.Er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(e){Ye(e)?V(za,"Ignoring IndexedDB error during garbage collection: ",e):await Xe(e)}await this.Rr(3e5)}))}}class Om{constructor(t,e){this.Ar=t,this.params=e}calculateTargetCount(t,e){return this.Ar.Vr(t).next((r=>Math.floor(e/100*r)))}nthSequenceNumber(t,e){if(e===0)return S.resolve(Ur.ce);const r=new Nm(e);return this.Ar.forEachTarget(t,(s=>r.Ir(s.sequenceNumber))).next((()=>this.Ar.dr(t,(s=>r.Ir(s))))).next((()=>r.maxValue))}removeTargets(t,e,r){return this.Ar.removeTargets(t,e,r)}removeOrphanedDocuments(t,e){return this.Ar.removeOrphanedDocuments(t,e)}collect(t,e){return this.params.cacheSizeCollectionThreshold===-1?(V("LruGarbageCollector","Garbage collection skipped; disabled"),S.resolve($a)):this.getCacheSize(t).next((r=>r<this.params.cacheSizeCollectionThreshold?(V("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),$a):this.mr(t,e)))}getCacheSize(t){return this.Ar.getCacheSize(t)}mr(t,e){let r,s,o,a,u,h,f;const m=Date.now();return this.calculateTargetCount(t,this.params.percentileToCollect).next((y=>(y>this.params.maximumSequenceNumbersToCollect?(V("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${y}`),s=this.params.maximumSequenceNumbersToCollect):s=y,a=Date.now(),this.nthSequenceNumber(t,s)))).next((y=>(r=y,u=Date.now(),this.removeTargets(t,r,e)))).next((y=>(o=y,h=Date.now(),this.removeOrphanedDocuments(t,r)))).next((y=>(f=Date.now(),xe()<=$.DEBUG&&V("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${a-m}ms
	Determined least recently used ${s} in `+(u-a)+`ms
	Removed ${o} targets in `+(h-u)+`ms
	Removed ${y} documents in `+(f-h)+`ms
Total Duration: ${f-m}ms`),S.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:o,documentsRemoved:y}))))}}function Mm(n,t){return new Om(n,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xm{constructor(){this.changes=new Ve((t=>t.toString()),((t,e)=>t.isEqual(e))),this.changesApplied=!1}addEntry(t){this.assertNotApplied(),this.changes.set(t.key,t)}removeEntry(t,e){this.assertNotApplied(),this.changes.set(t,_t.newInvalidDocument(t).setReadTime(e))}getEntry(t,e){this.assertNotApplied();const r=this.changes.get(e);return r!==void 0?S.resolve(r):this.getFromCache(t,e)}getEntries(t,e){return this.getAllFromCache(t,e)}apply(t){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(t)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lm{constructor(t,e){this.overlayedDocument=t,this.mutatedFields=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fm{constructor(t,e,r,s){this.remoteDocumentCache=t,this.mutationQueue=e,this.documentOverlayCache=r,this.indexManager=s}getDocument(t,e){let r=null;return this.documentOverlayCache.getOverlay(t,e).next((s=>(r=s,this.remoteDocumentCache.getEntry(t,e)))).next((s=>(r!==null&&Sn(r.mutation,s,bt.empty(),J.now()),s)))}getDocuments(t,e){return this.remoteDocumentCache.getEntries(t,e).next((r=>this.getLocalViewOfDocuments(t,r,q()).next((()=>r))))}getLocalViewOfDocuments(t,e,r=q()){const s=ve();return this.populateOverlays(t,s,e).next((()=>this.computeViews(t,e,s,r).next((o=>{let a=In();return o.forEach(((u,h)=>{a=a.insert(u,h.overlayedDocument)})),a}))))}getOverlayedDocuments(t,e){const r=ve();return this.populateOverlays(t,r,e).next((()=>this.computeViews(t,e,r,q())))}populateOverlays(t,e,r){const s=[];return r.forEach((o=>{e.has(o)||s.push(o)})),this.documentOverlayCache.getOverlays(t,s).next((o=>{o.forEach(((a,u)=>{e.set(a,u)}))}))}computeViews(t,e,r,s){let o=Ht();const a=bn(),u=(function(){return bn()})();return e.forEach(((h,f)=>{const m=r.get(f.key);s.has(f.key)&&(m===void 0||m.mutation instanceof pe)?o=o.insert(f.key,f):m!==void 0?(a.set(f.key,m.mutation.getFieldMask()),Sn(m.mutation,f,m.mutation.getFieldMask(),J.now())):a.set(f.key,bt.empty())})),this.recalculateAndSaveOverlays(t,o).next((h=>(h.forEach(((f,m)=>a.set(f,m))),e.forEach(((f,m)=>u.set(f,new Lm(m,a.get(f)??null)))),u)))}recalculateAndSaveOverlays(t,e){const r=bn();let s=new X(((a,u)=>a-u)),o=q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(t,e).next((a=>{for(const u of a)u.keys().forEach((h=>{const f=e.get(h);if(f===null)return;let m=r.get(h)||bt.empty();m=u.applyToLocalView(f,m),r.set(h,m);const y=(s.get(u.batchId)||q()).add(h);s=s.insert(u.batchId,y)}))})).next((()=>{const a=[],u=s.getReverseIterator();for(;u.hasNext();){const h=u.getNext(),f=h.key,m=h.value,y=du();m.forEach((v=>{if(!o.has(v)){const P=yu(e.get(v),r.get(v));P!==null&&y.set(v,P),o=o.add(v)}})),a.push(this.documentOverlayCache.saveOverlays(t,f,y))}return S.waitFor(a)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(t,e){return this.remoteDocumentCache.getEntries(t,e).next((r=>this.recalculateAndSaveOverlays(t,r)))}getDocumentsMatchingQuery(t,e,r,s){return Ud(e)?this.getDocumentsMatchingDocumentQuery(t,e.path):cu(e)?this.getDocumentsMatchingCollectionGroupQuery(t,e,r,s):this.getDocumentsMatchingCollectionQuery(t,e,r,s)}getNextDocuments(t,e,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(t,e,r,s).next((o=>{const a=s-o.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(t,e,r.largestBatchId,s-o.size):S.resolve(ve());let u=Dn,h=o;return a.next((f=>S.forEach(f,((m,y)=>(u<y.largestBatchId&&(u=y.largestBatchId),o.get(m)?S.resolve():this.remoteDocumentCache.getEntry(t,m).next((v=>{h=h.insert(m,v)}))))).next((()=>this.populateOverlays(t,f,o))).next((()=>this.computeViews(t,h,f,q()))).next((m=>({batchId:u,changes:fu(m)})))))}))}getDocumentsMatchingDocumentQuery(t,e){return this.getDocument(t,new M(e)).next((r=>{let s=In();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(t,e,r,s){const o=e.collectionGroup;let a=In();return this.indexManager.getCollectionParents(t,o).next((u=>S.forEach(u,(h=>{const f=(function(y,v){return new Ze(v,null,y.explicitOrderBy.slice(),y.filters.slice(),y.limit,y.limitType,y.startAt,y.endAt)})(e,h.child(o));return this.getDocumentsMatchingCollectionQuery(t,f,r,s).next((m=>{m.forEach(((y,v)=>{a=a.insert(y,v)}))}))})).next((()=>a))))}getDocumentsMatchingCollectionQuery(t,e,r,s){let o;return this.documentOverlayCache.getOverlaysForCollection(t,e.path,r.largestBatchId).next((a=>(o=a,this.remoteDocumentCache.getDocumentsMatchingQuery(t,e,r,o,s)))).next((a=>{o.forEach(((h,f)=>{const m=f.getKey();a.get(m)===null&&(a=a.insert(m,_t.newInvalidDocument(m)))}));let u=In();return a.forEach(((h,f)=>{const m=o.get(h);m!==void 0&&Sn(m.mutation,f,bt.empty(),J.now()),zr(e,f)&&(u=u.insert(h,f))})),u}))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Um{constructor(t){this.serializer=t,this.Or=new Map,this.Nr=new Map}getBundleMetadata(t,e){return S.resolve(this.Or.get(e))}saveBundleMetadata(t,e){return this.Or.set(e.id,(function(s){return{id:s.id,version:s.version,createTime:Ft(s.createTime)}})(e)),S.resolve()}getNamedQuery(t,e){return S.resolve(this.Nr.get(e))}saveNamedQuery(t,e){return this.Nr.set(e.name,(function(s){return{name:s.name,query:Pm(s.bundledQuery),readTime:Ft(s.readTime)}})(e)),S.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(){this.overlays=new X(M.comparator),this.Br=new Map}getOverlay(t,e){return S.resolve(this.overlays.get(e))}getOverlays(t,e){const r=ve();return S.forEach(e,(s=>this.getOverlay(t,s).next((o=>{o!==null&&r.set(s,o)})))).next((()=>r))}saveOverlays(t,e,r){return r.forEach(((s,o)=>{this.wt(t,e,o)})),S.resolve()}removeOverlaysForBatchId(t,e,r){const s=this.Br.get(r);return s!==void 0&&(s.forEach((o=>this.overlays=this.overlays.remove(o))),this.Br.delete(r)),S.resolve()}getOverlaysForCollection(t,e,r){const s=ve(),o=e.length+1,a=new M(e.child("")),u=this.overlays.getIteratorFrom(a);for(;u.hasNext();){const h=u.getNext().value,f=h.getKey();if(!e.isPrefixOf(f.path))break;f.path.length===o&&h.largestBatchId>r&&s.set(h.getKey(),h)}return S.resolve(s)}getOverlaysForCollectionGroup(t,e,r,s){let o=new X(((f,m)=>f-m));const a=this.overlays.getIterator();for(;a.hasNext();){const f=a.getNext().value;if(f.getKey().getCollectionGroup()===e&&f.largestBatchId>r){let m=o.get(f.largestBatchId);m===null&&(m=ve(),o=o.insert(f.largestBatchId,m)),m.set(f.getKey(),f)}}const u=ve(),h=o.getIterator();for(;h.hasNext()&&(h.getNext().value.forEach(((f,m)=>u.set(f,m))),!(u.size()>=s)););return S.resolve(u)}wt(t,e,r){const s=this.overlays.get(r.key);if(s!==null){const a=this.Br.get(s.largestBatchId).delete(r.key);this.Br.set(s.largestBatchId,a)}this.overlays=this.overlays.insert(r.key,new sm(e,r));let o=this.Br.get(e);o===void 0&&(o=q(),this.Br.set(e,o)),this.Br.set(e,o.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qm{constructor(){this.sessionToken=ht.EMPTY_BYTE_STRING}getSessionToken(t){return S.resolve(this.sessionToken)}setSessionToken(t,e){return this.sessionToken=e,S.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pi{constructor(){this.Lr=new ot(ct.kr),this.qr=new ot(ct.Kr)}isEmpty(){return this.Lr.isEmpty()}addReference(t,e){const r=new ct(t,e);this.Lr=this.Lr.add(r),this.qr=this.qr.add(r)}Ur(t,e){t.forEach((r=>this.addReference(r,e)))}removeReference(t,e){this.$r(new ct(t,e))}Wr(t,e){t.forEach((r=>this.removeReference(r,e)))}Qr(t){const e=new M(new W([])),r=new ct(e,t),s=new ct(e,t+1),o=[];return this.qr.forEachInRange([r,s],(a=>{this.$r(a),o.push(a.key)})),o}Gr(){this.Lr.forEach((t=>this.$r(t)))}$r(t){this.Lr=this.Lr.delete(t),this.qr=this.qr.delete(t)}zr(t){const e=new M(new W([])),r=new ct(e,t),s=new ct(e,t+1);let o=q();return this.qr.forEachInRange([r,s],(a=>{o=o.add(a.key)})),o}containsKey(t){const e=new ct(t,0),r=this.Lr.firstAfterOrEqual(e);return r!==null&&t.isEqual(r.key)}}class ct{constructor(t,e){this.key=t,this.jr=e}static kr(t,e){return M.comparator(t.key,e.key)||B(t.jr,e.jr)}static Kr(t,e){return B(t.jr,e.jr)||M.comparator(t.key,e.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jm{constructor(t,e){this.indexManager=t,this.referenceDelegate=e,this.mutationQueue=[],this.Xn=1,this.Jr=new ot(ct.kr)}checkEmpty(t){return S.resolve(this.mutationQueue.length===0)}addMutationBatch(t,e,r,s){const o=this.Xn;this.Xn++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const a=new rm(o,e,r,s);this.mutationQueue.push(a);for(const u of s)this.Jr=this.Jr.add(new ct(u.key,o)),this.indexManager.addToCollectionParentIndex(t,u.key.path.popLast());return S.resolve(a)}lookupMutationBatch(t,e){return S.resolve(this.Hr(e))}getNextMutationBatchAfterBatchId(t,e){const r=e+1,s=this.Zr(r),o=s<0?0:s;return S.resolve(this.mutationQueue.length>o?this.mutationQueue[o]:null)}getHighestUnacknowledgedBatchId(){return S.resolve(this.mutationQueue.length===0?_i:this.Xn-1)}getAllMutationBatches(t){return S.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(t,e){const r=new ct(e,0),s=new ct(e,Number.POSITIVE_INFINITY),o=[];return this.Jr.forEachInRange([r,s],(a=>{const u=this.Hr(a.jr);o.push(u)})),S.resolve(o)}getAllMutationBatchesAffectingDocumentKeys(t,e){let r=new ot(B);return e.forEach((s=>{const o=new ct(s,0),a=new ct(s,Number.POSITIVE_INFINITY);this.Jr.forEachInRange([o,a],(u=>{r=r.add(u.jr)}))})),S.resolve(this.Xr(r))}getAllMutationBatchesAffectingQuery(t,e){const r=e.path,s=r.length+1;let o=r;M.isDocumentKey(o)||(o=o.child(""));const a=new ct(new M(o),0);let u=new ot(B);return this.Jr.forEachWhile((h=>{const f=h.key.path;return!!r.isPrefixOf(f)&&(f.length===s&&(u=u.add(h.jr)),!0)}),a),S.resolve(this.Xr(u))}Xr(t){const e=[];return t.forEach((r=>{const s=this.Hr(r);s!==null&&e.push(s)})),e}removeMutationBatch(t,e){z(this.Yr(e.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.Jr;return S.forEach(e.mutations,(s=>{const o=new ct(s.key,e.batchId);return r=r.delete(o),this.referenceDelegate.markPotentiallyOrphaned(t,s.key)})).next((()=>{this.Jr=r}))}tr(t){}containsKey(t,e){const r=new ct(e,0),s=this.Jr.firstAfterOrEqual(r);return S.resolve(e.isEqual(s&&s.key))}performConsistencyCheck(t){return this.mutationQueue.length,S.resolve()}Yr(t,e){return this.Zr(t)}Zr(t){return this.mutationQueue.length===0?0:t-this.mutationQueue[0].batchId}Hr(t){const e=this.Zr(t);return e<0||e>=this.mutationQueue.length?null:this.mutationQueue[e]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m{constructor(t){this.ei=t,this.docs=(function(){return new X(M.comparator)})(),this.size=0}setIndexManager(t){this.indexManager=t}addEntry(t,e){const r=e.key,s=this.docs.get(r),o=s?s.size:0,a=this.ei(e);return this.docs=this.docs.insert(r,{document:e.mutableCopy(),size:a}),this.size+=a-o,this.indexManager.addToCollectionParentIndex(t,r.path.popLast())}removeEntry(t){const e=this.docs.get(t);e&&(this.docs=this.docs.remove(t),this.size-=e.size)}getEntry(t,e){const r=this.docs.get(e);return S.resolve(r?r.document.mutableCopy():_t.newInvalidDocument(e))}getEntries(t,e){let r=Ht();return e.forEach((s=>{const o=this.docs.get(s);r=r.insert(s,o?o.document.mutableCopy():_t.newInvalidDocument(s))})),S.resolve(r)}getDocumentsMatchingQuery(t,e,r,s){let o=Ht();const a=e.path,u=new M(a.child("__id-9223372036854775808__")),h=this.docs.getIteratorFrom(u);for(;h.hasNext();){const{key:f,value:{document:m}}=h.getNext();if(!a.isPrefixOf(f.path))break;f.path.length>a.length+1||pd(md(m),r)<=0||(s.has(m.key)||zr(e,m))&&(o=o.insert(m.key,m.mutableCopy()))}return S.resolve(o)}getAllFromCollectionGroup(t,e,r,s){x(9500)}ti(t,e){return S.forEach(this.docs,(r=>e(r)))}newChangeBuffer(t){return new zm(this)}getSize(t){return S.resolve(this.size)}}class zm extends xm{constructor(t){super(),this.Fr=t}applyChanges(t){const e=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?e.push(this.Fr.addEntry(t,s)):this.Fr.removeEntry(r)})),S.waitFor(e)}getFromCache(t,e){return this.Fr.getEntry(t,e)}getAllFromCache(t,e){return this.Fr.getEntries(t,e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gm{constructor(t){this.persistence=t,this.ni=new Ve((e=>Ti(e)),Ii),this.lastRemoteSnapshotVersion=L.min(),this.highestTargetId=0,this.ri=0,this.ii=new Pi,this.targetCount=0,this.si=le.sr()}forEachTarget(t,e){return this.ni.forEach(((r,s)=>e(s))),S.resolve()}getLastRemoteSnapshotVersion(t){return S.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(t){return S.resolve(this.ri)}allocateTargetId(t){return this.highestTargetId=this.si.next(),S.resolve(this.highestTargetId)}setTargetsMetadata(t,e,r){return r&&(this.lastRemoteSnapshotVersion=r),e>this.ri&&(this.ri=e),S.resolve()}cr(t){this.ni.set(t.target,t);const e=t.targetId;e>this.highestTargetId&&(this.si=new le(e),this.highestTargetId=e),t.sequenceNumber>this.ri&&(this.ri=t.sequenceNumber)}addTargetData(t,e){return this.cr(e),this.targetCount+=1,S.resolve()}updateTargetData(t,e){return this.cr(e),S.resolve()}removeTargetData(t,e){return this.ni.delete(e.target),this.ii.Qr(e.targetId),this.targetCount-=1,S.resolve()}removeTargets(t,e,r){let s=0;const o=[];return this.ni.forEach(((a,u)=>{u.sequenceNumber<=e&&r.get(u.targetId)===null&&(this.ni.delete(a),o.push(this.removeMatchingKeysForTargetId(t,u.targetId)),s++)})),S.waitFor(o).next((()=>s))}getTargetCount(t){return S.resolve(this.targetCount)}getTargetData(t,e){const r=this.ni.get(e)||null;return S.resolve(r)}addMatchingKeys(t,e,r){return this.ii.Ur(e,r),S.resolve()}removeMatchingKeys(t,e,r){this.ii.Wr(e,r);const s=this.persistence.referenceDelegate,o=[];return s&&e.forEach((a=>{o.push(s.markPotentiallyOrphaned(t,a))})),S.waitFor(o)}removeMatchingKeysForTargetId(t,e){return this.ii.Qr(e),S.resolve()}getMatchingKeysForTargetId(t,e){const r=this.ii.zr(e);return S.resolve(r)}containsKey(t,e){return S.resolve(this.ii.containsKey(e))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nu{constructor(t,e){this.oi={},this.overlays={},this._i=new Ur(0),this.ai=!1,this.ai=!0,this.ui=new qm,this.referenceDelegate=t(this),this.ci=new Gm(this),this.indexManager=new Cm,this.remoteDocumentCache=(function(s){return new $m(s)})((r=>this.referenceDelegate.li(r))),this.serializer=new Sm(e),this.hi=new Um(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.ai=!1,Promise.resolve()}get started(){return this.ai}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(t){return this.indexManager}getDocumentOverlayCache(t){let e=this.overlays[t.toKey()];return e||(e=new Bm,this.overlays[t.toKey()]=e),e}getMutationQueue(t,e){let r=this.oi[t.toKey()];return r||(r=new jm(e,this.referenceDelegate),this.oi[t.toKey()]=r),r}getGlobalsCache(){return this.ui}getTargetCache(){return this.ci}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.hi}runTransaction(t,e,r){V("MemoryPersistence","Starting transaction:",t);const s=new Km(this._i.next());return this.referenceDelegate.Pi(),r(s).next((o=>this.referenceDelegate.Ti(s).next((()=>o)))).toPromise().then((o=>(s.raiseOnCommittedEvent(),o)))}Ii(t,e){return S.or(Object.values(this.oi).map((r=>()=>r.containsKey(t,e))))}}class Km extends _d{constructor(t){super(),this.currentSequenceNumber=t}}class Ci{constructor(t){this.persistence=t,this.Ei=new Pi,this.Ri=null}static Ai(t){return new Ci(t)}get Vi(){if(this.Ri)return this.Ri;throw x(60996)}addReference(t,e,r){return this.Ei.addReference(r,e),this.Vi.delete(r.toString()),S.resolve()}removeReference(t,e,r){return this.Ei.removeReference(r,e),this.Vi.add(r.toString()),S.resolve()}markPotentiallyOrphaned(t,e){return this.Vi.add(e.toString()),S.resolve()}removeTarget(t,e){this.Ei.Qr(e.targetId).forEach((s=>this.Vi.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(t,e.targetId).next((s=>{s.forEach((o=>this.Vi.add(o.toString())))})).next((()=>r.removeTargetData(t,e)))}Pi(){this.Ri=new Set}Ti(t){const e=this.persistence.getRemoteDocumentCache().newChangeBuffer();return S.forEach(this.Vi,(r=>{const s=M.fromPath(r);return this.di(t,s).next((o=>{o||e.removeEntry(s,L.min())}))})).next((()=>(this.Ri=null,e.apply(t))))}updateLimboDocument(t,e){return this.di(t,e).next((r=>{r?this.Vi.delete(e.toString()):this.Vi.add(e.toString())}))}li(t){return 0}di(t,e){return S.or([()=>S.resolve(this.Ei.containsKey(e)),()=>this.persistence.getTargetCache().containsKey(t,e),()=>this.persistence.Ii(t,e)])}}class Vr{constructor(t,e){this.persistence=t,this.mi=new Ve((r=>Td(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=Mm(this,e)}static Ai(t,e){return new Vr(t,e)}Pi(){}Ti(t){return S.resolve()}forEachTarget(t,e){return this.persistence.getTargetCache().forEachTarget(t,e)}Vr(t){const e=this.gr(t);return this.persistence.getTargetCache().getTargetCount(t).next((r=>e.next((s=>r+s))))}gr(t){let e=0;return this.dr(t,(r=>{e++})).next((()=>e))}dr(t,e){return S.forEach(this.mi,((r,s)=>this.yr(t,r,s).next((o=>o?S.resolve():e(s)))))}removeTargets(t,e,r){return this.persistence.getTargetCache().removeTargets(t,e,r)}removeOrphanedDocuments(t,e){let r=0;const s=this.persistence.getRemoteDocumentCache(),o=s.newChangeBuffer();return s.ti(t,(a=>this.yr(t,a,e).next((u=>{u||(r++,o.removeEntry(a,L.min()))})))).next((()=>o.apply(t))).next((()=>r))}markPotentiallyOrphaned(t,e){return this.mi.set(e,t.currentSequenceNumber),S.resolve()}removeTarget(t,e){const r=e.withSequenceNumber(t.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(t,r)}addReference(t,e,r){return this.mi.set(r,t.currentSequenceNumber),S.resolve()}removeReference(t,e,r){return this.mi.set(r,t.currentSequenceNumber),S.resolve()}updateLimboDocument(t,e){return this.mi.set(e,t.currentSequenceNumber),S.resolve()}li(t){let e=t.key.toString().length;return t.isFoundDocument()&&(e+=pr(t.data.value)),e}yr(t,e,r){return S.or([()=>this.persistence.Ii(t,e),()=>this.persistence.getTargetCache().containsKey(t,e),()=>{const s=this.mi.get(e);return S.resolve(s!==void 0&&s>r)}])}getCacheSize(t){return this.persistence.getRemoteDocumentCache().getSize(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vi{constructor(t,e,r,s){this.targetId=t,this.fromCache=e,this.Ps=r,this.Ts=s}static Is(t,e){let r=q(),s=q();for(const o of e.docChanges)switch(o.type){case 0:r=r.add(o.doc.key);break;case 1:s=s.add(o.doc.key)}return new Vi(t,e.fromCache,r,s)}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hm{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(t){this._documentReadCount+=t}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wm{constructor(){this.Es=!1,this.Rs=!1,this.As=100,this.Vs=(function(){return Dh()?8:yd(li())>0?6:4})()}initialize(t,e){this.ds=t,this.indexManager=e,this.Es=!0}getDocumentsMatchingQuery(t,e,r,s){const o={result:null};return this.fs(t,e).next((a=>{o.result=a})).next((()=>{if(!o.result)return this.gs(t,e,s,r).next((a=>{o.result=a}))})).next((()=>{if(o.result)return;const a=new Hm;return this.ps(t,e,a).next((u=>{if(o.result=u,this.Rs)return this.ys(t,e,a,u.size)}))})).next((()=>o.result))}ys(t,e,r,s){return r.documentReadCount<this.As?(xe()<=$.DEBUG&&V("QueryEngine","SDK will not create cache indexes for query:",Le(e),"since it only creates cache indexes for collection contains","more than or equal to",this.As,"documents"),S.resolve()):(xe()<=$.DEBUG&&V("QueryEngine","Query:",Le(e),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.Vs*s?(xe()<=$.DEBUG&&V("QueryEngine","The SDK decides to create cache indexes for query:",Le(e),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(t,Lt(e))):S.resolve())}fs(t,e){if(ka(e))return S.resolve(null);let r=Lt(e);return this.indexManager.getIndexType(t,r).next((s=>s===0?null:(e.limit!==null&&s===1&&(e=Xs(e,null,"F"),r=Lt(e)),this.indexManager.getDocumentsMatchingTarget(t,r).next((o=>{const a=q(...o);return this.ds.getDocuments(t,a).next((u=>this.indexManager.getMinOffset(t,r).next((h=>{const f=this.ws(e,u);return this.Ss(e,f,a,h.readTime)?this.fs(t,Xs(e,null,"F")):this.bs(t,f,e,h)}))))})))))}gs(t,e,r,s){return ka(e)||s.isEqual(L.min())?S.resolve(null):this.ds.getDocuments(t,r).next((o=>{const a=this.ws(e,o);return this.Ss(e,a,r,s)?S.resolve(null):(xe()<=$.DEBUG&&V("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),Le(e)),this.bs(t,a,e,dd(s,Dn)).next((u=>u)))}))}ws(t,e){let r=new ot(lu(t));return e.forEach(((s,o)=>{zr(t,o)&&(r=r.add(o))})),r}Ss(t,e,r,s){if(t.limit===null)return!1;if(r.size!==e.size)return!0;const o=t.limitType==="F"?e.last():e.first();return!!o&&(o.hasPendingWrites||o.version.compareTo(s)>0)}ps(t,e,r){return xe()<=$.DEBUG&&V("QueryEngine","Using full collection scan to execute query:",Le(e)),this.ds.getDocumentsMatchingQuery(t,e,oe.min(),r)}bs(t,e,r,s){return this.ds.getDocumentsMatchingQuery(t,r,s).next((o=>(e.forEach((a=>{o=o.insert(a.key,a)})),o)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Di="LocalStore",Qm=3e8;class Jm{constructor(t,e,r,s){this.persistence=t,this.Ds=e,this.serializer=s,this.Cs=new X(B),this.vs=new Ve((o=>Ti(o)),Ii),this.Fs=new Map,this.Ms=t.getRemoteDocumentCache(),this.ci=t.getTargetCache(),this.hi=t.getBundleCache(),this.xs(r)}xs(t){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(t),this.indexManager=this.persistence.getIndexManager(t),this.mutationQueue=this.persistence.getMutationQueue(t,this.indexManager),this.localDocuments=new Fm(this.Ms,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Ms.setIndexManager(this.indexManager),this.Ds.initialize(this.localDocuments,this.indexManager)}collectGarbage(t){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(e=>t.collect(e,this.Cs)))}}function Xm(n,t,e,r){return new Jm(n,t,e,r)}async function ku(n,t){const e=F(n);return await e.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return e.mutationQueue.getAllMutationBatches(r).next((o=>(s=o,e.xs(t),e.mutationQueue.getAllMutationBatches(r)))).next((o=>{const a=[],u=[];let h=q();for(const f of s){a.push(f.batchId);for(const m of f.mutations)h=h.add(m.key)}for(const f of o){u.push(f.batchId);for(const m of f.mutations)h=h.add(m.key)}return e.localDocuments.getDocuments(r,h).next((f=>({Os:f,removedBatchIds:a,addedBatchIds:u})))}))}))}function Ym(n,t){const e=F(n);return e.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=t.batch.keys(),o=e.Ms.newChangeBuffer({trackRemovals:!0});return(function(u,h,f,m){const y=f.batch,v=y.keys();let P=S.resolve();return v.forEach((N=>{P=P.next((()=>m.getEntry(h,N))).next((O=>{const k=f.docVersions.get(N);z(k!==null,48541),O.version.compareTo(k)<0&&(y.applyToRemoteDocument(O,f),O.isValidDocument()&&(O.setReadTime(f.commitVersion),m.addEntry(O)))}))})),P.next((()=>u.mutationQueue.removeMutationBatch(h,y)))})(e,r,t,o).next((()=>o.apply(r))).next((()=>e.mutationQueue.performConsistencyCheck(r))).next((()=>e.documentOverlayCache.removeOverlaysForBatchId(r,s,t.batch.batchId))).next((()=>e.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(u){let h=q();for(let f=0;f<u.mutationResults.length;++f)u.mutationResults[f].transformResults.length>0&&(h=h.add(u.batch.mutations[f].key));return h})(t)))).next((()=>e.localDocuments.getDocuments(r,s)))}))}function Ou(n){const t=F(n);return t.persistence.runTransaction("Get last remote snapshot version","readonly",(e=>t.ci.getLastRemoteSnapshotVersion(e)))}function Zm(n,t){const e=F(n),r=t.snapshotVersion;let s=e.Cs;return e.persistence.runTransaction("Apply remote event","readwrite-primary",(o=>{const a=e.Ms.newChangeBuffer({trackRemovals:!0});s=e.Cs;const u=[];t.targetChanges.forEach(((m,y)=>{const v=s.get(y);if(!v)return;u.push(e.ci.removeMatchingKeys(o,m.removedDocuments,y).next((()=>e.ci.addMatchingKeys(o,m.addedDocuments,y))));let P=v.withSequenceNumber(o.currentSequenceNumber);t.targetMismatches.get(y)!==null?P=P.withResumeToken(ht.EMPTY_BYTE_STRING,L.min()).withLastLimboFreeSnapshotVersion(L.min()):m.resumeToken.approximateByteSize()>0&&(P=P.withResumeToken(m.resumeToken,r)),s=s.insert(y,P),(function(O,k,H){return O.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-O.snapshotVersion.toMicroseconds()>=Qm?!0:H.addedDocuments.size+H.modifiedDocuments.size+H.removedDocuments.size>0})(v,P,m)&&u.push(e.ci.updateTargetData(o,P))}));let h=Ht(),f=q();if(t.documentUpdates.forEach((m=>{t.resolvedLimboDocuments.has(m)&&u.push(e.persistence.referenceDelegate.updateLimboDocument(o,m))})),u.push(tp(o,a,t.documentUpdates).next((m=>{h=m.Ns,f=m.Bs}))),!r.isEqual(L.min())){const m=e.ci.getLastRemoteSnapshotVersion(o).next((y=>e.ci.setTargetsMetadata(o,o.currentSequenceNumber,r)));u.push(m)}return S.waitFor(u).next((()=>a.apply(o))).next((()=>e.localDocuments.getLocalViewOfDocuments(o,h,f))).next((()=>h))})).then((o=>(e.Cs=s,o)))}function tp(n,t,e){let r=q(),s=q();return e.forEach((o=>r=r.add(o))),t.getEntries(n,r).next((o=>{let a=Ht();return e.forEach(((u,h)=>{const f=o.get(u);h.isFoundDocument()!==f.isFoundDocument()&&(s=s.add(u)),h.isNoDocument()&&h.version.isEqual(L.min())?(t.removeEntry(u,h.readTime),a=a.insert(u,h)):!f.isValidDocument()||h.version.compareTo(f.version)>0||h.version.compareTo(f.version)===0&&f.hasPendingWrites?(t.addEntry(h),a=a.insert(u,h)):V(Di,"Ignoring outdated watch update for ",u,". Current version:",f.version," Watch version:",h.version)})),{Ns:a,Bs:s}}))}function ep(n,t){const e=F(n);return e.persistence.runTransaction("Get next mutation batch","readonly",(r=>(t===void 0&&(t=_i),e.mutationQueue.getNextMutationBatchAfterBatchId(r,t))))}function np(n,t){const e=F(n);return e.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return e.ci.getTargetData(r,t).next((o=>o?(s=o,S.resolve(s)):e.ci.allocateTargetId(r).next((a=>(s=new jt(t,a,"TargetPurposeListen",r.currentSequenceNumber),e.ci.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=e.Cs.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(e.Cs=e.Cs.insert(r.targetId,r),e.vs.set(t,r.targetId)),r}))}async function ni(n,t,e){const r=F(n),s=r.Cs.get(t),o=e?"readwrite":"readwrite-primary";try{e||await r.persistence.runTransaction("Release target",o,(a=>r.persistence.referenceDelegate.removeTarget(a,s)))}catch(a){if(!Ye(a))throw a;V(Di,`Failed to update sequence numbers for target ${t}: ${a}`)}r.Cs=r.Cs.remove(t),r.vs.delete(s.target)}function Ka(n,t,e){const r=F(n);let s=L.min(),o=q();return r.persistence.runTransaction("Execute query","readwrite",(a=>(function(h,f,m){const y=F(h),v=y.vs.get(m);return v!==void 0?S.resolve(y.Cs.get(v)):y.ci.getTargetData(f,m)})(r,a,Lt(t)).next((u=>{if(u)return s=u.lastLimboFreeSnapshotVersion,r.ci.getMatchingKeysForTargetId(a,u.targetId).next((h=>{o=h}))})).next((()=>r.Ds.getDocumentsMatchingQuery(a,t,e?s:L.min(),e?o:q()))).next((u=>(rp(r,jd(t),u),{documents:u,Ls:o})))))}function rp(n,t,e){let r=n.Fs.get(t)||L.min();e.forEach(((s,o)=>{o.readTime.compareTo(r)>0&&(r=o.readTime)})),n.Fs.set(t,r)}class Ha{constructor(){this.activeTargetIds=Wd()}Ws(t){this.activeTargetIds=this.activeTargetIds.add(t)}Qs(t){this.activeTargetIds=this.activeTargetIds.delete(t)}$s(){const t={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(t)}}class sp{constructor(){this.Co=new Ha,this.vo={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(t){}updateMutationState(t,e,r){}addLocalQueryTarget(t,e=!0){return e&&this.Co.Ws(t),this.vo[t]||"not-current"}updateQueryState(t,e,r){this.vo[t]=e}removeLocalQueryTarget(t){this.Co.Qs(t)}isLocalQueryTarget(t){return this.Co.activeTargetIds.has(t)}clearQueryState(t){delete this.vo[t]}getAllActiveQueryTargets(){return this.Co.activeTargetIds}isActiveQueryTarget(t){return this.Co.activeTargetIds.has(t)}start(){return this.Co=new Ha,Promise.resolve()}handleUserChange(t,e,r){}setOnlineState(t){}shutdown(){}writeSequenceNumber(t){}notifyBundleLoaded(t){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ip{Fo(t){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Wa="ConnectivityMonitor";class Qa{constructor(){this.Mo=()=>this.xo(),this.Oo=()=>this.No(),this.Bo=[],this.Lo()}Fo(t){this.Bo.push(t)}shutdown(){window.removeEventListener("online",this.Mo),window.removeEventListener("offline",this.Oo)}Lo(){window.addEventListener("online",this.Mo),window.addEventListener("offline",this.Oo)}xo(){V(Wa,"Network connectivity changed: AVAILABLE");for(const t of this.Bo)t(0)}No(){V(Wa,"Network connectivity changed: UNAVAILABLE");for(const t of this.Bo)t(1)}static v(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let dr=null;function ri(){return dr===null?dr=(function(){return 268435456+Math.round(2147483648*Math.random())})():dr++,"0x"+dr.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ks="RestConnection",op={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class ap{get ko(){return!1}constructor(t){this.databaseInfo=t,this.databaseId=t.databaseId;const e=t.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.qo=e+"://"+t.host,this.Ko=`projects/${r}/databases/${s}`,this.Uo=this.databaseId.database===wr?`project_id=${r}`:`project_id=${r}&database_id=${s}`}$o(t,e,r,s,o){const a=ri(),u=this.Wo(t,e.toUriEncodedString());V(ks,`Sending RPC '${t}' ${a}:`,u,r);const h={"google-cloud-resource-prefix":this.Ko,"x-goog-request-params":this.Uo};this.Qo(h,s,o);const{host:f}=new URL(u),m=Pc(f);return this.Go(t,u,h,r,m).then((y=>(V(ks,`Received RPC '${t}' ${a}: `,y),y)),(y=>{throw Se(ks,`RPC '${t}' ${a} failed with error: `,y,"url: ",u,"request:",r),y}))}zo(t,e,r,s,o,a){return this.$o(t,e,r,s,o)}Qo(t,e,r){t["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+Je})(),t["Content-Type"]="text/plain",this.databaseInfo.appId&&(t["X-Firebase-GMPID"]=this.databaseInfo.appId),e&&e.headers.forEach(((s,o)=>t[o]=s)),r&&r.headers.forEach(((s,o)=>t[o]=s))}Wo(t,e){const r=op[t];let s=`${this.qo}/v1/${e}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cp{constructor(t){this.jo=t.jo,this.Jo=t.Jo}Ho(t){this.Zo=t}Xo(t){this.Yo=t}e_(t){this.t_=t}onMessage(t){this.n_=t}close(){this.Jo()}send(t){this.jo(t)}r_(){this.Zo()}i_(){this.Yo()}s_(t){this.t_(t)}o_(t){this.n_(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const pt="WebChannelConnection",En=(n,t,e)=>{n.listen(t,(r=>{try{e(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class Be extends ap{constructor(t){super(t),this.__=[],this.forceLongPolling=t.forceLongPolling,this.autoDetectLongPolling=t.autoDetectLongPolling,this.useFetchStreams=t.useFetchStreams,this.longPollingOptions=t.longPollingOptions}static a_(){if(!Be.u_){const t=Uc();En(t,Fc.STAT_EVENT,(e=>{e.stat===Gs.PROXY?V(pt,"STAT_EVENT: detected buffering proxy"):e.stat===Gs.NOPROXY&&V(pt,"STAT_EVENT: detected no buffering proxy")})),Be.u_=!0}}Go(t,e,r,s,o){const a=ri();return new Promise(((u,h)=>{const f=new xc;f.setWithCredentials(!0),f.listenOnce(Lc.COMPLETE,(()=>{try{switch(f.getLastErrorCode()){case mr.NO_ERROR:const y=f.getResponseJson();V(pt,`XHR for RPC '${t}' ${a} received:`,JSON.stringify(y)),u(y);break;case mr.TIMEOUT:V(pt,`RPC '${t}' ${a} timed out`),h(new D(b.DEADLINE_EXCEEDED,"Request time out"));break;case mr.HTTP_ERROR:const v=f.getStatus();if(V(pt,`RPC '${t}' ${a} failed with status:`,v,"response text:",f.getResponseText()),v>0){let P=f.getResponseJson();Array.isArray(P)&&(P=P[0]);const N=P==null?void 0:P.error;if(N&&N.status&&N.message){const O=(function(H){const G=H.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(G)>=0?G:b.UNKNOWN})(N.status);h(new D(O,N.message))}else h(new D(b.UNKNOWN,"Server responded with status "+f.getStatus()))}else h(new D(b.UNAVAILABLE,"Connection failed."));break;default:x(9055,{c_:t,streamId:a,l_:f.getLastErrorCode(),h_:f.getLastError()})}}finally{V(pt,`RPC '${t}' ${a} completed.`)}}));const m=JSON.stringify(s);V(pt,`RPC '${t}' ${a} sending request:`,s),f.send(e,"POST",m,r,15)}))}P_(t,e,r){const s=ri(),o=[this.qo,"/","google.firestore.v1.Firestore","/",t,"/channel"],a=this.createWebChannelTransport(),u={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},h=this.longPollingOptions.timeoutSeconds;h!==void 0&&(u.longPollingTimeout=Math.round(1e3*h)),this.useFetchStreams&&(u.useFetchStreams=!0),this.Qo(u.initMessageHeaders,e,r),u.encodeInitMessageHeaders=!0;const f=o.join("");V(pt,`Creating RPC '${t}' stream ${s}: ${f}`,u);const m=a.createWebChannel(f,u);this.T_(m);let y=!1,v=!1;const P=new cp({jo:N=>{v?V(pt,`Not sending because RPC '${t}' stream ${s} is closed:`,N):(y||(V(pt,`Opening RPC '${t}' stream ${s} transport.`),m.open(),y=!0),V(pt,`RPC '${t}' stream ${s} sending:`,N),m.send(N))},Jo:()=>m.close()});return En(m,Tn.EventType.OPEN,(()=>{v||(V(pt,`RPC '${t}' stream ${s} transport opened.`),P.r_())})),En(m,Tn.EventType.CLOSE,(()=>{v||(v=!0,V(pt,`RPC '${t}' stream ${s} transport closed`),P.s_(),this.I_(m))})),En(m,Tn.EventType.ERROR,(N=>{v||(v=!0,Se(pt,`RPC '${t}' stream ${s} transport errored. Name:`,N.name,"Message:",N.message),P.s_(new D(b.UNAVAILABLE,"The operation could not be completed")))})),En(m,Tn.EventType.MESSAGE,(N=>{var O;if(!v){const k=N.data[0];z(!!k,16349);const H=k,G=(H==null?void 0:H.error)||((O=H[0])==null?void 0:O.error);if(G){V(pt,`RPC '${t}' stream ${s} received error:`,G);const Y=G.status;let Pt=(function(T){const p=nt[T];if(p!==void 0)return Tu(p)})(Y),ft=G.message;Y==="NOT_FOUND"&&ft.includes("database")&&ft.includes("does not exist")&&ft.includes(this.databaseId.database)&&Se(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),Pt===void 0&&(Pt=b.INTERNAL,ft="Unknown error status: "+Y+" with message "+G.message),v=!0,P.s_(new D(Pt,ft)),m.close()}else V(pt,`RPC '${t}' stream ${s} received:`,k),P.o_(k)}})),Be.a_(),setTimeout((()=>{P.i_()}),0),P}terminate(){this.__.forEach((t=>t.close())),this.__=[]}T_(t){this.__.push(t)}I_(t){this.__=this.__.filter((e=>e===t))}Qo(t,e,r){super.Qo(t,e,r),this.databaseInfo.apiKey&&(t["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return Bc()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function up(n){return new Be(n)}function Os(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Wr(n){return new dm(n,!0)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */Be.u_=!1;class Mu{constructor(t,e,r=1e3,s=1.5,o=6e4){this.Di=t,this.timerId=e,this.E_=r,this.R_=s,this.A_=o,this.V_=0,this.d_=null,this.m_=Date.now(),this.reset()}reset(){this.V_=0}f_(){this.V_=this.A_}g_(t){this.cancel();const e=Math.floor(this.V_+this.p_()),r=Math.max(0,Date.now()-this.m_),s=Math.max(0,e-r);s>0&&V("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.V_} ms, delay with jitter: ${e} ms, last attempt: ${r} ms ago)`),this.d_=this.Di.enqueueAfterDelay(this.timerId,s,(()=>(this.m_=Date.now(),t()))),this.V_*=this.R_,this.V_<this.E_&&(this.V_=this.E_),this.V_>this.A_&&(this.V_=this.A_)}y_(){this.d_!==null&&(this.d_.skipDelay(),this.d_=null)}cancel(){this.d_!==null&&(this.d_.cancel(),this.d_=null)}p_(){return(Math.random()-.5)*this.V_}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ja="PersistentStream";class xu{constructor(t,e,r,s,o,a,u,h){this.Di=t,this.w_=r,this.S_=s,this.connection=o,this.authCredentialsProvider=a,this.appCheckCredentialsProvider=u,this.listener=h,this.state=0,this.b_=0,this.D_=null,this.C_=null,this.stream=null,this.v_=0,this.F_=new Mu(t,e)}M_(){return this.state===1||this.state===5||this.x_()}x_(){return this.state===2||this.state===3}start(){this.v_=0,this.state!==4?this.auth():this.O_()}async stop(){this.M_()&&await this.close(0)}N_(){this.state=0,this.F_.reset()}B_(){this.x_()&&this.D_===null&&(this.D_=this.Di.enqueueAfterDelay(this.w_,6e4,(()=>this.L_())))}k_(t){this.q_(),this.stream.send(t)}async L_(){if(this.x_())return this.close(0)}q_(){this.D_&&(this.D_.cancel(),this.D_=null)}K_(){this.C_&&(this.C_.cancel(),this.C_=null)}async close(t,e){this.q_(),this.K_(),this.F_.cancel(),this.b_++,t!==4?this.F_.reset():e&&e.code===b.RESOURCE_EXHAUSTED?(Kt(e.toString()),Kt("Using maximum backoff delay to prevent overloading the backend."),this.F_.f_()):e&&e.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.U_(),this.stream.close(),this.stream=null),this.state=t,await this.listener.e_(e)}U_(){}auth(){this.state=1;const t=this.W_(this.b_),e=this.b_;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.b_===e&&this.Q_(r,s)}),(r=>{t((()=>{const s=new D(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.G_(s)}))}))}Q_(t,e){const r=this.W_(this.b_);this.stream=this.z_(t,e),this.stream.Ho((()=>{r((()=>this.listener.Ho()))})),this.stream.Xo((()=>{r((()=>(this.state=2,this.C_=this.Di.enqueueAfterDelay(this.S_,1e4,(()=>(this.x_()&&(this.state=3),Promise.resolve()))),this.listener.Xo())))})),this.stream.e_((s=>{r((()=>this.G_(s)))})),this.stream.onMessage((s=>{r((()=>++this.v_==1?this.j_(s):this.onNext(s)))}))}O_(){this.state=5,this.F_.g_((async()=>{this.state=0,this.start()}))}G_(t){return V(Ja,`close with error: ${t}`),this.stream=null,this.close(4,t)}W_(t){return e=>{this.Di.enqueueAndForget((()=>this.b_===t?e():(V(Ja,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class lp extends xu{constructor(t,e,r,s,o,a){super(t,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}z_(t,e){return this.connection.P_("Listen",t,e)}j_(t){return this.onNext(t)}onNext(t){this.F_.reset();const e=gm(this.serializer,t),r=(function(o){if(!("targetChange"in o))return L.min();const a=o.targetChange;return a.targetIds&&a.targetIds.length?L.min():a.readTime?Ft(a.readTime):L.min()})(t);return this.listener.J_(e,r)}H_(t){const e={};e.database=ei(this.serializer),e.addTarget=(function(o,a){let u;const h=a.target;if(u=Qs(h)?{documents:Em(o,h)}:{query:Tm(o,h).dt},u.targetId=a.targetId,a.resumeToken.approximateByteSize()>0){u.resumeToken=vu(o,a.resumeToken);const f=Ys(o,a.expectedCount);f!==null&&(u.expectedCount=f)}else if(a.snapshotVersion.compareTo(L.min())>0){u.readTime=Cr(o,a.snapshotVersion.toTimestamp());const f=Ys(o,a.expectedCount);f!==null&&(u.expectedCount=f)}return u})(this.serializer,t);const r=wm(this.serializer,t);r&&(e.labels=r),this.k_(e)}Z_(t){const e={};e.database=ei(this.serializer),e.removeTarget=t,this.k_(e)}}class hp extends xu{constructor(t,e,r,s,o,a){super(t,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",e,r,s,a),this.serializer=o}get X_(){return this.v_>0}start(){this.lastStreamToken=void 0,super.start()}U_(){this.X_&&this.Y_([])}z_(t,e){return this.connection.P_("Write",t,e)}j_(t){return z(!!t.streamToken,31322),this.lastStreamToken=t.streamToken,z(!t.writeResults||t.writeResults.length===0,55816),this.listener.ea()}onNext(t){z(!!t.streamToken,12678),this.lastStreamToken=t.streamToken,this.F_.reset();const e=ym(t.writeResults,t.commitTime),r=Ft(t.commitTime);return this.listener.ta(r,e)}na(){const t={};t.database=ei(this.serializer),this.k_(t)}Y_(t){const e={streamToken:this.lastStreamToken,writes:t.map((r=>_m(this.serializer,r)))};this.k_(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fp{}class dp extends fp{constructor(t,e,r,s){super(),this.authCredentials=t,this.appCheckCredentials=e,this.connection=r,this.serializer=s,this.ra=!1}ia(){if(this.ra)throw new D(b.FAILED_PRECONDITION,"The client has already been terminated.")}$o(t,e,r,s){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,a])=>this.connection.$o(t,Zs(e,r),s,o,a))).catch((o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new D(b.UNKNOWN,o.toString())}))}zo(t,e,r,s,o){return this.ia(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([a,u])=>this.connection.zo(t,Zs(e,r),s,a,u,o))).catch((a=>{throw a.name==="FirebaseError"?(a.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),a):new D(b.UNKNOWN,a.toString())}))}terminate(){this.ra=!0,this.connection.terminate()}}function mp(n,t,e,r){return new dp(n,t,e,r)}class pp{constructor(t,e){this.asyncQueue=t,this.onlineStateHandler=e,this.state="Unknown",this.sa=0,this.oa=null,this._a=!0}aa(){this.sa===0&&(this.ua("Unknown"),this.oa=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.oa=null,this.ca("Backend didn't respond within 10 seconds."),this.ua("Offline"),Promise.resolve()))))}la(t){this.state==="Online"?this.ua("Unknown"):(this.sa++,this.sa>=1&&(this.ha(),this.ca(`Connection failed 1 times. Most recent error: ${t.toString()}`),this.ua("Offline")))}set(t){this.ha(),this.sa=0,t==="Online"&&(this._a=!1),this.ua(t)}ua(t){t!==this.state&&(this.state=t,this.onlineStateHandler(t))}ca(t){const e=`Could not reach Cloud Firestore backend. ${t}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this._a?(Kt(e),this._a=!1):V("OnlineStateTracker",e)}ha(){this.oa!==null&&(this.oa.cancel(),this.oa=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qt="RemoteStore";class gp{constructor(t,e,r,s,o){this.localStore=t,this.datastore=e,this.asyncQueue=r,this.remoteSyncer={},this.Pa=[],this.Ta=new Map,this.Ia=new Map,this.Ea=new Map,this.Ra=new le(1e3),this.Aa=new le(1001),this.Va=new Set,this.da=[],this.ma=o,this.ma.Fo((a=>{r.enqueueAndForget((async()=>{De(this)&&(V(qt,"Restarting streams for network reachability change."),await(async function(h){const f=F(h);f.Va.add(4),await Gn(f),f.fa.set("Unknown"),f.Va.delete(4),await Qr(f)})(this))}))})),this.fa=new pp(r,s)}}async function Qr(n){if(De(n))for(const t of n.da)await t(!0)}async function Gn(n){for(const t of n.da)await t(!1)}function si(n,t){return n.Ia.get(t)||void 0}function Lu(n,t){const e=F(n),r=si(e,t.targetId);if(r!==void 0&&e.Ta.has(r))return;const s=(function(u,h){const f=si(u,h);f!==void 0&&u.Ea.delete(f);const m=(function(v,P){return P%2!=0?v.Aa.next():v.Ra.next()})(u,h);return u.Ia.set(h,m),u.Ea.set(m,h),m})(e,t.targetId);V(qt,"remoteStoreListen mapping SDK target ID to remote",t.targetId,s);const o=new jt(t.target,s,t.purpose,t.sequenceNumber,t.snapshotVersion,t.lastLimboFreeSnapshotVersion,t.resumeToken);e.Ta.set(s,o),Mi(e)?Oi(e):tn(e).x_()&&ki(e,o)}function Ni(n,t){const e=F(n),r=tn(e),s=si(e,t);V(qt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",t,s),e.Ta.delete(s),e.Ia.delete(t),e.Ea.delete(s),r.x_()&&Fu(e,s),e.Ta.size===0&&(r.x_()?r.B_():De(e)&&e.fa.set("Unknown"))}function ki(n,t){if(n.ga.$e(t.targetId),t.resumeToken.approximateByteSize()>0||t.snapshotVersion.compareTo(L.min())>0){const e=n.Ea.get(t.targetId);if(e===void 0)return void V(qt,"SDK target ID not found for remote ID: "+t.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(e).size;t=t.withExpectedCount(r)}tn(n).H_(t)}function Fu(n,t){n.ga.$e(t),tn(n).Z_(t)}function Oi(n){n.ga=new um({getRemoteKeysForTarget:t=>{const e=n.Ea.get(t);return e!==void 0?n.remoteSyncer.getRemoteKeysForTarget(e):q()},Rt:t=>n.Ta.get(t)||null,lt:()=>n.datastore.serializer.databaseId}),tn(n).start(),n.fa.aa()}function Mi(n){return De(n)&&!tn(n).M_()&&n.Ta.size>0}function De(n){return F(n).Va.size===0}function Uu(n){n.ga=void 0}async function _p(n){n.fa.set("Online")}async function yp(n){n.Ta.forEach(((t,e)=>{ki(n,t)}))}async function Ep(n,t){Uu(n),Mi(n)?(n.fa.la(t),Oi(n)):n.fa.set("Unknown")}async function Tp(n,t,e){if(n.fa.set("Online"),t instanceof wu&&t.state===2&&t.cause)try{await(async function(s,o){const a=o.cause;for(const u of o.targetIds){if(s.Ta.has(u)){const h=s.Ea.get(u);h!==void 0&&(await s.remoteSyncer.rejectListen(h,a),s.Ia.delete(h),s.Ea.delete(u)),s.Ta.delete(u)}s.ga.removeTarget(u)}})(n,t)}catch(r){V(qt,"Failed to remove targets %s: %s ",t.targetIds.join(","),r),await Dr(n,r)}else if(t instanceof yr?n.ga.Xe(t):t instanceof Iu?n.ga.it(t):n.ga.tt(t),!e.isEqual(L.min()))try{const r=await Ou(n.localStore);e.compareTo(r)>=0&&await(function(o,a){const u=o.ga.Pt(a);u.targetChanges.forEach(((f,m)=>{if(f.resumeToken.approximateByteSize()>0){const y=o.Ta.get(m);y&&o.Ta.set(m,y.withResumeToken(f.resumeToken,a))}})),u.targetMismatches.forEach(((f,m)=>{const y=o.Ta.get(f);if(!y)return;o.Ta.set(f,y.withResumeToken(ht.EMPTY_BYTE_STRING,y.snapshotVersion)),Fu(o,f);const v=new jt(y.target,f,m,y.sequenceNumber);ki(o,v)}));const h=(function(m,y){const v=new Map;y.targetChanges.forEach(((N,O)=>{const k=m.Ea.get(O);k!==void 0&&v.set(k,N)}));let P=new X(B);return y.targetMismatches.forEach(((N,O)=>{const k=m.Ea.get(N);k!==void 0&&(P=P.insert(k,O))})),new $n(y.snapshotVersion,v,P,y.documentUpdates,y.resolvedLimboDocuments)})(o,u);return o.remoteSyncer.applyRemoteEvent(h)})(n,e)}catch(r){V(qt,"Failed to raise snapshot:",r),await Dr(n,r)}}async function Dr(n,t,e){if(!Ye(t))throw t;n.Va.add(1),await Gn(n),n.fa.set("Offline"),e||(e=()=>Ou(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{V(qt,"Retrying IndexedDB access"),await e(),n.Va.delete(1),await Qr(n)}))}function Bu(n,t){return t().catch((e=>Dr(n,e,t)))}async function Jr(n){const t=F(n),e=he(t);let r=t.Pa.length>0?t.Pa[t.Pa.length-1].batchId:_i;for(;Ip(t);)try{const s=await ep(t.localStore,r);if(s===null){t.Pa.length===0&&e.B_();break}r=s.batchId,wp(t,s)}catch(s){await Dr(t,s)}qu(t)&&ju(t)}function Ip(n){return De(n)&&n.Pa.length<10}function wp(n,t){n.Pa.push(t);const e=he(n);e.x_()&&e.X_&&e.Y_(t.mutations)}function qu(n){return De(n)&&!he(n).M_()&&n.Pa.length>0}function ju(n){he(n).start()}async function vp(n){he(n).na()}async function Ap(n){const t=he(n);for(const e of n.Pa)t.Y_(e.mutations)}async function Rp(n,t,e){const r=n.Pa.shift(),s=Ri.from(r,t,e);await Bu(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await Jr(n)}async function bp(n,t){t&&he(n).X_&&await(async function(r,s){if((function(a){return om(a)&&a!==b.ABORTED})(s.code)){const o=r.Pa.shift();he(r).N_(),await Bu(r,(()=>r.remoteSyncer.rejectFailedWrite(o.batchId,s))),await Jr(r)}})(n,t),qu(n)&&ju(n)}async function Xa(n,t){const e=F(n);e.asyncQueue.verifyOperationInProgress(),V(qt,"RemoteStore received new credentials");const r=De(e);e.Va.add(3),await Gn(e),r&&e.fa.set("Unknown"),await e.remoteSyncer.handleCredentialChange(t),e.Va.delete(3),await Qr(e)}async function Sp(n,t){const e=F(n);t?(e.Va.delete(2),await Qr(e)):t||(e.Va.add(2),await Gn(e),e.fa.set("Unknown"))}function tn(n){return n.pa||(n.pa=(function(e,r,s){const o=F(e);return o.ia(),new lp(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)})(n.datastore,n.asyncQueue,{Ho:_p.bind(null,n),Xo:yp.bind(null,n),e_:Ep.bind(null,n),J_:Tp.bind(null,n)}),n.da.push((async t=>{t?(n.pa.N_(),Mi(n)?Oi(n):n.fa.set("Unknown")):(await n.pa.stop(),Uu(n))}))),n.pa}function he(n){return n.ya||(n.ya=(function(e,r,s){const o=F(e);return o.ia(),new hp(r,o.connection,o.authCredentials,o.appCheckCredentials,o.serializer,s)})(n.datastore,n.asyncQueue,{Ho:()=>Promise.resolve(),Xo:vp.bind(null,n),e_:bp.bind(null,n),ea:Ap.bind(null,n),ta:Rp.bind(null,n)}),n.da.push((async t=>{t?(n.ya.N_(),await Jr(n)):(await n.ya.stop(),n.Pa.length>0&&(V(qt,`Stopping write stream with ${n.Pa.length} pending writes`),n.Pa=[]))}))),n.ya}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class xi{constructor(t,e,r,s,o){this.asyncQueue=t,this.timerId=e,this.targetTimeMs=r,this.op=s,this.removalCallback=o,this.deferred=new re,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((a=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(t,e,r,s,o){const a=Date.now()+r,u=new xi(t,e,a,s,o);return u.start(r),u}start(t){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),t)}skipDelay(){return this.handleDelayElapsed()}cancel(t){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new D(b.CANCELLED,"Operation cancelled"+(t?": "+t:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((t=>this.deferred.resolve(t)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Li(n,t){if(Kt("AsyncQueue",`${t}: ${n}`),Ye(n))return new D(b.UNAVAILABLE,`${t}: ${n}`);throw n}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qe{static emptySet(t){return new qe(t.comparator)}constructor(t){this.comparator=t?(e,r)=>t(e,r)||M.comparator(e.key,r.key):(e,r)=>M.comparator(e.key,r.key),this.keyedMap=In(),this.sortedSet=new X(this.comparator)}has(t){return this.keyedMap.get(t)!=null}get(t){return this.keyedMap.get(t)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(t){const e=this.keyedMap.get(t);return e?this.sortedSet.indexOf(e):-1}get size(){return this.sortedSet.size}forEach(t){this.sortedSet.inorderTraversal(((e,r)=>(t(e),!1)))}add(t){const e=this.delete(t.key);return e.copy(e.keyedMap.insert(t.key,t),e.sortedSet.insert(t,null))}delete(t){const e=this.get(t);return e?this.copy(this.keyedMap.remove(t),this.sortedSet.remove(e)):this}isEqual(t){if(!(t instanceof qe)||this.size!==t.size)return!1;const e=this.sortedSet.getIterator(),r=t.sortedSet.getIterator();for(;e.hasNext();){const s=e.getNext().key,o=r.getNext().key;if(!s.isEqual(o))return!1}return!0}toString(){const t=[];return this.forEach((e=>{t.push(e.toString())})),t.length===0?"DocumentSet ()":`DocumentSet (
  `+t.join(`  
`)+`
)`}copy(t,e){const r=new qe;return r.comparator=this.comparator,r.keyedMap=t,r.sortedSet=e,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ya{constructor(){this.wa=new X(M.comparator)}track(t){const e=t.doc.key,r=this.wa.get(e);r?t.type!==0&&r.type===3?this.wa=this.wa.insert(e,t):t.type===3&&r.type!==1?this.wa=this.wa.insert(e,{type:r.type,doc:t.doc}):t.type===2&&r.type===2?this.wa=this.wa.insert(e,{type:2,doc:t.doc}):t.type===2&&r.type===0?this.wa=this.wa.insert(e,{type:0,doc:t.doc}):t.type===1&&r.type===0?this.wa=this.wa.remove(e):t.type===1&&r.type===2?this.wa=this.wa.insert(e,{type:1,doc:r.doc}):t.type===0&&r.type===1?this.wa=this.wa.insert(e,{type:2,doc:t.doc}):x(63341,{At:t,Sa:r}):this.wa=this.wa.insert(e,t)}ba(){const t=[];return this.wa.inorderTraversal(((e,r)=>{t.push(r)})),t}}class He{constructor(t,e,r,s,o,a,u,h,f){this.query=t,this.docs=e,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=o,this.fromCache=a,this.syncStateChanged=u,this.excludesMetadataChanges=h,this.hasCachedResults=f}static fromInitialDocuments(t,e,r,s,o){const a=[];return e.forEach((u=>{a.push({type:0,doc:u})})),new He(t,e,qe.emptySet(e),a,r,s,!0,!1,o)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(t){if(!(this.fromCache===t.fromCache&&this.hasCachedResults===t.hasCachedResults&&this.syncStateChanged===t.syncStateChanged&&this.mutatedKeys.isEqual(t.mutatedKeys)&&$r(this.query,t.query)&&this.docs.isEqual(t.docs)&&this.oldDocs.isEqual(t.oldDocs)))return!1;const e=this.docChanges,r=t.docChanges;if(e.length!==r.length)return!1;for(let s=0;s<e.length;s++)if(e[s].type!==r[s].type||!e[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pp{constructor(){this.Da=void 0,this.Ca=[]}va(){return this.Ca.some((t=>t.Fa()))}}class Cp{constructor(){this.queries=Za(),this.onlineState="Unknown",this.Ma=new Set}terminate(){(function(e,r){const s=F(e),o=s.queries;s.queries=Za(),o.forEach(((a,u)=>{for(const h of u.Ca)h.onError(r)}))})(this,new D(b.ABORTED,"Firestore shutting down"))}}function Za(){return new Ve((n=>uu(n)),$r)}async function $u(n,t){const e=F(n);let r=3;const s=t.query;let o=e.queries.get(s);o?!o.va()&&t.Fa()&&(r=2):(o=new Pp,r=t.Fa()?0:1);try{switch(r){case 0:o.Da=await e.onListen(s,!0);break;case 1:o.Da=await e.onListen(s,!1);break;case 2:await e.onFirstRemoteStoreListen(s)}}catch(a){const u=Li(a,`Initialization of query '${Le(t.query)}' failed`);return void t.onError(u)}e.queries.set(s,o),o.Ca.push(t),t.xa(e.onlineState),o.Da&&t.Oa(o.Da)&&Fi(e)}async function zu(n,t){const e=F(n),r=t.query;let s=3;const o=e.queries.get(r);if(o){const a=o.Ca.indexOf(t);a>=0&&(o.Ca.splice(a,1),o.Ca.length===0?s=t.Fa()?0:1:!o.va()&&t.Fa()&&(s=2))}switch(s){case 0:return e.queries.delete(r),e.onUnlisten(r,!0);case 1:return e.queries.delete(r),e.onUnlisten(r,!1);case 2:return e.onLastRemoteStoreUnlisten(r);default:return}}function Vp(n,t){const e=F(n);let r=!1;for(const s of t){const o=s.query,a=e.queries.get(o);if(a){for(const u of a.Ca)u.Oa(s)&&(r=!0);a.Da=s}}r&&Fi(e)}function Dp(n,t,e){const r=F(n),s=r.queries.get(t);if(s)for(const o of s.Ca)o.onError(e);r.queries.delete(t)}function Fi(n){n.Ma.forEach((t=>{t.next()}))}var ii,tc;(tc=ii||(ii={})).Na="default",tc.Cache="cache";class Gu{constructor(t,e,r){this.query=t,this.Ba=e,this.La=!1,this.ka=null,this.onlineState="Unknown",this.options=r||{}}Oa(t){if(!this.options.includeMetadataChanges){const r=[];for(const s of t.docChanges)s.type!==3&&r.push(s);t=new He(t.query,t.docs,t.oldDocs,r,t.mutatedKeys,t.fromCache,t.syncStateChanged,!0,t.hasCachedResults)}let e=!1;return this.La?this.qa(t)&&(this.Ba.next(t),e=!0):this.Ka(t,this.onlineState)&&(this.Ua(t),e=!0),this.ka=t,e}onError(t){this.Ba.error(t)}xa(t){this.onlineState=t;let e=!1;return this.ka&&!this.La&&this.Ka(this.ka,t)&&(this.Ua(this.ka),e=!0),e}Ka(t,e){if(!t.fromCache||!this.Fa())return!0;const r=e!=="Offline";return(!this.options.$a||!r)&&(!t.docs.isEmpty()||t.hasCachedResults||e==="Offline")}qa(t){if(t.docChanges.length>0)return!0;const e=this.ka&&this.ka.hasPendingWrites!==t.hasPendingWrites;return!(!t.syncStateChanged&&!e)&&this.options.includeMetadataChanges===!0}Ua(t){t=He.fromInitialDocuments(t.query,t.docs,t.mutatedKeys,t.fromCache,t.hasCachedResults),this.La=!0,this.Ba.next(t)}Fa(){return this.options.source!==ii.Cache}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ku{constructor(t){this.key=t}}class Hu{constructor(t){this.key=t}}class Np{constructor(t,e){this.query=t,this.eu=e,this.tu=null,this.hasCachedResults=!1,this.current=!1,this.nu=q(),this.mutatedKeys=q(),this.ru=lu(t),this.iu=new qe(this.ru)}get su(){return this.eu}ou(t,e){const r=e?e._u:new Ya,s=e?e.iu:this.iu;let o=e?e.mutatedKeys:this.mutatedKeys,a=s,u=!1;const h=this.query.limitType==="F"&&s.size===this.query.limit?s.last():null,f=this.query.limitType==="L"&&s.size===this.query.limit?s.first():null;if(t.inorderTraversal(((m,y)=>{const v=s.get(m),P=zr(this.query,y)?y:null,N=!!v&&this.mutatedKeys.has(v.key),O=!!P&&(P.hasLocalMutations||this.mutatedKeys.has(P.key)&&P.hasCommittedMutations);let k=!1;v&&P?v.data.isEqual(P.data)?N!==O&&(r.track({type:3,doc:P}),k=!0):this.au(v,P)||(r.track({type:2,doc:P}),k=!0,(h&&this.ru(P,h)>0||f&&this.ru(P,f)<0)&&(u=!0)):!v&&P?(r.track({type:0,doc:P}),k=!0):v&&!P&&(r.track({type:1,doc:v}),k=!0,(h||f)&&(u=!0)),k&&(P?(a=a.add(P),o=O?o.add(m):o.delete(m)):(a=a.delete(m),o=o.delete(m)))})),this.query.limit!==null)for(;a.size>this.query.limit;){const m=this.query.limitType==="F"?a.last():a.first();a=a.delete(m.key),o=o.delete(m.key),r.track({type:1,doc:m})}return{iu:a,_u:r,Ss:u,mutatedKeys:o}}au(t,e){return t.hasLocalMutations&&e.hasCommittedMutations&&!e.hasLocalMutations}applyChanges(t,e,r,s){const o=this.iu;this.iu=t.iu,this.mutatedKeys=t.mutatedKeys;const a=t._u.ba();a.sort(((m,y)=>(function(P,N){const O=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return x(20277,{At:k})}};return O(P)-O(N)})(m.type,y.type)||this.ru(m.doc,y.doc))),this.uu(r),s=s??!1;const u=e&&!s?this.cu():[],h=this.nu.size===0&&this.current&&!s?1:0,f=h!==this.tu;return this.tu=h,a.length!==0||f?{snapshot:new He(this.query,t.iu,o,a,t.mutatedKeys,h===0,f,!1,!!r&&r.resumeToken.approximateByteSize()>0),lu:u}:{lu:u}}xa(t){return this.current&&t==="Offline"?(this.current=!1,this.applyChanges({iu:this.iu,_u:new Ya,mutatedKeys:this.mutatedKeys,Ss:!1},!1)):{lu:[]}}hu(t){return!this.eu.has(t)&&!!this.iu.has(t)&&!this.iu.get(t).hasLocalMutations}uu(t){t&&(t.addedDocuments.forEach((e=>this.eu=this.eu.add(e))),t.modifiedDocuments.forEach((e=>{})),t.removedDocuments.forEach((e=>this.eu=this.eu.delete(e))),this.current=t.current)}cu(){if(!this.current)return[];const t=this.nu;this.nu=q(),this.iu.forEach((r=>{this.hu(r.key)&&(this.nu=this.nu.add(r.key))}));const e=[];return t.forEach((r=>{this.nu.has(r)||e.push(new Hu(r))})),this.nu.forEach((r=>{t.has(r)||e.push(new Ku(r))})),e}Pu(t){this.eu=t.Ls,this.nu=q();const e=this.ou(t.documents);return this.applyChanges(e,!0)}Tu(){return He.fromInitialDocuments(this.query,this.iu,this.mutatedKeys,this.tu===0,this.hasCachedResults)}}const Ui="SyncEngine";class kp{constructor(t,e,r){this.query=t,this.targetId=e,this.view=r}}class Op{constructor(t){this.key=t,this.Iu=!1}}class Mp{constructor(t,e,r,s,o,a){this.localStore=t,this.remoteStore=e,this.eventManager=r,this.sharedClientState=s,this.currentUser=o,this.maxConcurrentLimboResolutions=a,this.Eu={},this.Ru=new Ve((u=>uu(u)),$r),this.Au=new Map,this.Vu=new Set,this.du=new X(M.comparator),this.mu=new Map,this.fu=new Pi,this.gu={},this.pu=new Map,this.yu=le._r(),this.onlineState="Unknown",this.wu=void 0}get isPrimaryClient(){return this.wu===!0}}async function xp(n,t,e=!0){const r=Zu(n);let s;const o=r.Ru.get(t);return o?(r.sharedClientState.addLocalQueryTarget(o.targetId),s=o.view.Tu()):s=await Wu(r,t,e,!0),s}async function Lp(n,t){const e=Zu(n);await Wu(e,t,!0,!1)}async function Wu(n,t,e,r){const s=await np(n.localStore,Lt(t)),o=s.targetId,a=n.sharedClientState.addLocalQueryTarget(o,e);let u;return r&&(u=await Fp(n,t,o,a==="current",s.resumeToken)),n.isPrimaryClient&&e&&Lu(n.remoteStore,s),u}async function Fp(n,t,e,r,s){n.Su=(y,v,P)=>(async function(O,k,H,G){let Y=k.view.ou(H);Y.Ss&&(Y=await Ka(O.localStore,k.query,!1).then((({documents:T})=>k.view.ou(T,Y))));const Pt=G&&G.targetChanges.get(k.targetId),ft=G&&G.targetMismatches.get(k.targetId)!=null,dt=k.view.applyChanges(Y,O.isPrimaryClient,Pt,ft);return nc(O,k.targetId,dt.lu),dt.snapshot})(n,y,v,P);const o=await Ka(n.localStore,t,!0),a=new Np(t,o.Ls),u=a.ou(o.documents),h=zn.createSynthesizedTargetChangeForCurrentChange(e,r&&n.onlineState!=="Offline",s),f=a.applyChanges(u,n.isPrimaryClient,h);nc(n,e,f.lu);const m=new kp(t,e,a);return n.Ru.set(t,m),n.Au.has(e)?n.Au.get(e).push(t):n.Au.set(e,[t]),f.snapshot}async function Up(n,t,e){const r=F(n),s=r.Ru.get(t),o=r.Au.get(s.targetId);if(o.length>1)return r.Au.set(s.targetId,o.filter((a=>!$r(a,t)))),void r.Ru.delete(t);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await ni(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),e&&Ni(r.remoteStore,s.targetId),oi(r,s.targetId)})).catch(Xe)):(oi(r,s.targetId),await ni(r.localStore,s.targetId,!0))}async function Bp(n,t){const e=F(n),r=e.Ru.get(t),s=e.Au.get(r.targetId);e.isPrimaryClient&&s.length===1&&(e.sharedClientState.removeLocalQueryTarget(r.targetId),Ni(e.remoteStore,r.targetId))}async function qp(n,t,e){const r=Wp(n);try{const s=await(function(a,u){const h=F(a),f=J.now(),m=u.reduce(((P,N)=>P.add(N.key)),q());let y,v;return h.persistence.runTransaction("Locally write mutations","readwrite",(P=>{let N=Ht(),O=q();return h.Ms.getEntries(P,m).next((k=>{N=k,N.forEach(((H,G)=>{G.isValidDocument()||(O=O.add(H))}))})).next((()=>h.localDocuments.getOverlayedDocuments(P,N))).next((k=>{y=k;const H=[];for(const G of u){const Y=em(G,y.get(G.key).overlayedDocument);Y!=null&&H.push(new pe(G.key,Y,eu(Y.value.mapValue),Vt.exists(!0)))}return h.mutationQueue.addMutationBatch(P,f,H,u)})).next((k=>{v=k;const H=k.applyToLocalDocumentSet(y,O);return h.documentOverlayCache.saveOverlays(P,k.batchId,H)}))})).then((()=>({batchId:v.batchId,changes:fu(y)})))})(r.localStore,t);r.sharedClientState.addPendingMutation(s.batchId),(function(a,u,h){let f=a.gu[a.currentUser.toKey()];f||(f=new X(B)),f=f.insert(u,h),a.gu[a.currentUser.toKey()]=f})(r,s.batchId,e),await Kn(r,s.changes),await Jr(r.remoteStore)}catch(s){const o=Li(s,"Failed to persist write");e.reject(o)}}async function Qu(n,t){const e=F(n);try{const r=await Zm(e.localStore,t);t.targetChanges.forEach(((s,o)=>{const a=e.mu.get(o);a&&(z(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?a.Iu=!0:s.modifiedDocuments.size>0?z(a.Iu,14607):s.removedDocuments.size>0&&(z(a.Iu,42227),a.Iu=!1))})),await Kn(e,r,t)}catch(r){await Xe(r)}}function ec(n,t,e){const r=F(n);if(r.isPrimaryClient&&e===0||!r.isPrimaryClient&&e===1){const s=[];r.Ru.forEach(((o,a)=>{const u=a.view.xa(t);u.snapshot&&s.push(u.snapshot)})),(function(a,u){const h=F(a);h.onlineState=u;let f=!1;h.queries.forEach(((m,y)=>{for(const v of y.Ca)v.xa(u)&&(f=!0)})),f&&Fi(h)})(r.eventManager,t),s.length&&r.Eu.J_(s),r.onlineState=t,r.isPrimaryClient&&r.sharedClientState.setOnlineState(t)}}async function jp(n,t,e){const r=F(n);r.sharedClientState.updateQueryState(t,"rejected",e);const s=r.mu.get(t),o=s&&s.key;if(o){let a=new X(M.comparator);a=a.insert(o,_t.newNoDocument(o,L.min()));const u=q().add(o),h=new $n(L.min(),new Map,new X(B),a,u);await Qu(r,h),r.du=r.du.remove(o),r.mu.delete(t),Bi(r)}else await ni(r.localStore,t,!1).then((()=>oi(r,t,e))).catch(Xe)}async function $p(n,t){const e=F(n),r=t.batch.batchId;try{const s=await Ym(e.localStore,t);Xu(e,r,null),Ju(e,r),e.sharedClientState.updateMutationState(r,"acknowledged"),await Kn(e,s)}catch(s){await Xe(s)}}async function zp(n,t,e){const r=F(n);try{const s=await(function(a,u){const h=F(a);return h.persistence.runTransaction("Reject batch","readwrite-primary",(f=>{let m;return h.mutationQueue.lookupMutationBatch(f,u).next((y=>(z(y!==null,37113),m=y.keys(),h.mutationQueue.removeMutationBatch(f,y)))).next((()=>h.mutationQueue.performConsistencyCheck(f))).next((()=>h.documentOverlayCache.removeOverlaysForBatchId(f,m,u))).next((()=>h.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(f,m))).next((()=>h.localDocuments.getDocuments(f,m)))}))})(r.localStore,t);Xu(r,t,e),Ju(r,t),r.sharedClientState.updateMutationState(t,"rejected",e),await Kn(r,s)}catch(s){await Xe(s)}}function Ju(n,t){(n.pu.get(t)||[]).forEach((e=>{e.resolve()})),n.pu.delete(t)}function Xu(n,t,e){const r=F(n);let s=r.gu[r.currentUser.toKey()];if(s){const o=s.get(t);o&&(e?o.reject(e):o.resolve(),s=s.remove(t)),r.gu[r.currentUser.toKey()]=s}}function oi(n,t,e=null){n.sharedClientState.removeLocalQueryTarget(t);for(const r of n.Au.get(t))n.Ru.delete(r),e&&n.Eu.bu(r,e);n.Au.delete(t),n.isPrimaryClient&&n.fu.Qr(t).forEach((r=>{n.fu.containsKey(r)||Yu(n,r)}))}function Yu(n,t){n.Vu.delete(t.path.canonicalString());const e=n.du.get(t);e!==null&&(Ni(n.remoteStore,e),n.du=n.du.remove(t),n.mu.delete(e),Bi(n))}function nc(n,t,e){for(const r of e)r instanceof Ku?(n.fu.addReference(r.key,t),Gp(n,r)):r instanceof Hu?(V(Ui,"Document no longer in limbo: "+r.key),n.fu.removeReference(r.key,t),n.fu.containsKey(r.key)||Yu(n,r.key)):x(19791,{Du:r})}function Gp(n,t){const e=t.key,r=e.path.canonicalString();n.du.get(e)||n.Vu.has(r)||(V(Ui,"New document in limbo: "+e),n.Vu.add(r),Bi(n))}function Bi(n){for(;n.Vu.size>0&&n.du.size<n.maxConcurrentLimboResolutions;){const t=n.Vu.values().next().value;n.Vu.delete(t);const e=new M(W.fromString(t)),r=n.yu.next();n.mu.set(r,new Op(e)),n.du=n.du.insert(e,r),Lu(n.remoteStore,new jt(Lt(jr(e.path)),r,"TargetPurposeLimboResolution",Ur.ce))}}async function Kn(n,t,e){const r=F(n),s=[],o=[],a=[];r.Ru.isEmpty()||(r.Ru.forEach(((u,h)=>{a.push(r.Su(h,t,e).then((f=>{var m;if((f||e)&&r.isPrimaryClient){const y=f?!f.fromCache:(m=e==null?void 0:e.targetChanges.get(h.targetId))==null?void 0:m.current;r.sharedClientState.updateQueryState(h.targetId,y?"current":"not-current")}if(f){s.push(f);const y=Vi.Is(h.targetId,f);o.push(y)}})))})),await Promise.all(a),r.Eu.J_(s),await(async function(h,f){const m=F(h);try{await m.persistence.runTransaction("notifyLocalViewChanges","readwrite",(y=>S.forEach(f,(v=>S.forEach(v.Ps,(P=>m.persistence.referenceDelegate.addReference(y,v.targetId,P))).next((()=>S.forEach(v.Ts,(P=>m.persistence.referenceDelegate.removeReference(y,v.targetId,P)))))))))}catch(y){if(!Ye(y))throw y;V(Di,"Failed to update sequence numbers: "+y)}for(const y of f){const v=y.targetId;if(!y.fromCache){const P=m.Cs.get(v),N=P.snapshotVersion,O=P.withLastLimboFreeSnapshotVersion(N);m.Cs=m.Cs.insert(v,O)}}})(r.localStore,o))}async function Kp(n,t){const e=F(n);if(!e.currentUser.isEqual(t)){V(Ui,"User change. New user:",t.toKey());const r=await ku(e.localStore,t);e.currentUser=t,(function(o,a){o.pu.forEach((u=>{u.forEach((h=>{h.reject(new D(b.CANCELLED,a))}))})),o.pu.clear()})(e,"'waitForPendingWrites' promise is rejected due to a user change."),e.sharedClientState.handleUserChange(t,r.removedBatchIds,r.addedBatchIds),await Kn(e,r.Os)}}function Hp(n,t){const e=F(n),r=e.mu.get(t);if(r&&r.Iu)return q().add(r.key);{let s=q();const o=e.Au.get(t);if(!o)return s;for(const a of o){const u=e.Ru.get(a);s=s.unionWith(u.view.su)}return s}}function Zu(n){const t=F(n);return t.remoteStore.remoteSyncer.applyRemoteEvent=Qu.bind(null,t),t.remoteStore.remoteSyncer.getRemoteKeysForTarget=Hp.bind(null,t),t.remoteStore.remoteSyncer.rejectListen=jp.bind(null,t),t.Eu.J_=Vp.bind(null,t.eventManager),t.Eu.bu=Dp.bind(null,t.eventManager),t}function Wp(n){const t=F(n);return t.remoteStore.remoteSyncer.applySuccessfulWrite=$p.bind(null,t),t.remoteStore.remoteSyncer.rejectFailedWrite=zp.bind(null,t),t}class Nr{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(t){this.serializer=Wr(t.databaseInfo.databaseId),this.sharedClientState=this.Fu(t),this.persistence=this.Mu(t),await this.persistence.start(),this.localStore=this.xu(t),this.gcScheduler=this.Ou(t,this.localStore),this.indexBackfillerScheduler=this.Nu(t,this.localStore)}Ou(t,e){return null}Nu(t,e){return null}xu(t){return Xm(this.persistence,new Wm,t.initialUser,this.serializer)}Mu(t){return new Nu(Ci.Ai,this.serializer)}Fu(t){return new sp}async terminate(){var t,e;(t=this.gcScheduler)==null||t.stop(),(e=this.indexBackfillerScheduler)==null||e.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Nr.provider={build:()=>new Nr};class Qp extends Nr{constructor(t){super(),this.cacheSizeBytes=t}Ou(t,e){z(this.persistence.referenceDelegate instanceof Vr,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new km(r,t.asyncQueue,e)}Mu(t){const e=this.cacheSizeBytes!==void 0?wt.withCacheSize(this.cacheSizeBytes):wt.DEFAULT;return new Nu((r=>Vr.Ai(r,e)),this.serializer)}}class ai{async initialize(t,e){this.localStore||(this.localStore=t.localStore,this.sharedClientState=t.sharedClientState,this.datastore=this.createDatastore(e),this.remoteStore=this.createRemoteStore(e),this.eventManager=this.createEventManager(e),this.syncEngine=this.createSyncEngine(e,!t.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>ec(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=Kp.bind(null,this.syncEngine),await Sp(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(t){return(function(){return new Cp})()}createDatastore(t){const e=Wr(t.databaseInfo.databaseId),r=up(t.databaseInfo);return mp(t.authCredentials,t.appCheckCredentials,r,e)}createRemoteStore(t){return(function(r,s,o,a,u){return new gp(r,s,o,a,u)})(this.localStore,this.datastore,t.asyncQueue,(e=>ec(this.syncEngine,e,0)),(function(){return Qa.v()?new Qa:new ip})())}createSyncEngine(t,e){return(function(s,o,a,u,h,f,m){const y=new Mp(s,o,a,u,h,f);return m&&(y.wu=!0),y})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,t.initialUser,t.maxConcurrentLimboResolutions,e)}async terminate(){var t,e;await(async function(s){const o=F(s);V(qt,"RemoteStore shutting down."),o.Va.add(5),await Gn(o),o.ma.shutdown(),o.fa.set("Unknown")})(this.remoteStore),(t=this.datastore)==null||t.terminate(),(e=this.eventManager)==null||e.terminate()}}ai.provider={build:()=>new ai};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tl{constructor(t){this.observer=t,this.muted=!1}next(t){this.muted||this.observer.next&&this.Lu(this.observer.next,t)}error(t){this.muted||(this.observer.error?this.Lu(this.observer.error,t):Kt("Uncaught Error in snapshot listener:",t.toString()))}ku(){this.muted=!0}Lu(t,e){setTimeout((()=>{this.muted||t(e)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fe="FirestoreClient";class Jp{constructor(t,e,r,s,o){this.authCredentials=t,this.appCheckCredentials=e,this.asyncQueue=r,this._databaseInfo=s,this.user=gt.UNAUTHENTICATED,this.clientId=gi.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=o,this.authCredentials.start(r,(async a=>{V(fe,"Received user=",a.uid),await this.authCredentialListener(a),this.user=a})),this.appCheckCredentials.start(r,(a=>(V(fe,"Received new app check token=",a),this.appCheckCredentialListener(a,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(t){this.authCredentialListener=t}setAppCheckTokenChangeListener(t){this.appCheckCredentialListener=t}terminate(){this.asyncQueue.enterRestrictedMode();const t=new re;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),t.resolve()}catch(e){const r=Li(e,"Failed to shutdown persistence");t.reject(r)}})),t.promise}}async function Ms(n,t){n.asyncQueue.verifyOperationInProgress(),V(fe,"Initializing OfflineComponentProvider");const e=n.configuration;await t.initialize(e);let r=e.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await ku(t.localStore,s),r=s)})),t.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=t}async function rc(n,t){n.asyncQueue.verifyOperationInProgress();const e=await Xp(n);V(fe,"Initializing OnlineComponentProvider"),await t.initialize(e,n.configuration),n.setCredentialChangeListener((r=>Xa(t.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Xa(t.remoteStore,s))),n._onlineComponents=t}async function Xp(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){V(fe,"Using user provided OfflineComponentProvider");try{await Ms(n,n._uninitializedComponentsProvider._offline)}catch(t){const e=t;if(!(function(s){return s.name==="FirebaseError"?s.code===b.FAILED_PRECONDITION||s.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(e))throw e;Se("Error using user provided cache. Falling back to memory cache: "+e),await Ms(n,new Nr)}}else V(fe,"Using default OfflineComponentProvider"),await Ms(n,new Qp(void 0));return n._offlineComponents}async function el(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(V(fe,"Using user provided OnlineComponentProvider"),await rc(n,n._uninitializedComponentsProvider._online)):(V(fe,"Using default OnlineComponentProvider"),await rc(n,new ai))),n._onlineComponents}function Yp(n){return el(n).then((t=>t.syncEngine))}async function ci(n){const t=await el(n),e=t.eventManager;return e.onListen=xp.bind(null,t.syncEngine),e.onUnlisten=Up.bind(null,t.syncEngine),e.onFirstRemoteStoreListen=Lp.bind(null,t.syncEngine),e.onLastRemoteStoreUnlisten=Bp.bind(null,t.syncEngine),e}function Zp(n,t,e,r){const s=new tl(r),o=new Gu(t,s,e);return n.asyncQueue.enqueueAndForget((async()=>$u(await ci(n),o))),()=>{s.ku(),n.asyncQueue.enqueueAndForget((async()=>zu(await ci(n),o)))}}function tg(n,t,e={}){const r=new re;return n.asyncQueue.enqueueAndForget((async()=>(function(o,a,u,h,f){const m=new tl({next:v=>{m.ku(),a.enqueueAndForget((()=>zu(o,y)));const P=v.docs.has(u);!P&&v.fromCache?f.reject(new D(b.UNAVAILABLE,"Failed to get document because the client is offline.")):P&&v.fromCache&&h&&h.source==="server"?f.reject(new D(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):f.resolve(v)},error:v=>f.reject(v)}),y=new Gu(jr(u.path),m,{includeMetadataChanges:!0,$a:!0});return $u(o,y)})(await ci(n),n.asyncQueue,t,e,r))),r.promise}function eg(n,t){const e=new re;return n.asyncQueue.enqueueAndForget((async()=>qp(await Yp(n),t,e))),e.promise}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nl(n){const t={};return n.timeoutSeconds!==void 0&&(t.timeoutSeconds=n.timeoutSeconds),t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ng="ComponentProvider",sc=new Map;function rg(n,t,e,r,s){return new vd(n,t,e,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,nl(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const rl="firestore.googleapis.com",ic=!0;class oc{constructor(t){if(t.host===void 0){if(t.ssl!==void 0)throw new D(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=rl,this.ssl=ic}else this.host=t.host,this.ssl=t.ssl??ic;if(this.isUsingEmulator=t.emulatorOptions!==void 0,this.credentials=t.credentials,this.ignoreUndefinedProperties=!!t.ignoreUndefinedProperties,this.localCache=t.localCache,t.cacheSizeBytes===void 0)this.cacheSizeBytes=Du;else{if(t.cacheSizeBytes!==-1&&t.cacheSizeBytes<Dm)throw new D(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=t.cacheSizeBytes}fd("experimentalForceLongPolling",t.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",t.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!t.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:t.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!t.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=nl(t.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new D(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!t.useFetchStreams}isEqual(t){return this.host===t.host&&this.ssl===t.ssl&&this.credentials===t.credentials&&this.cacheSizeBytes===t.cacheSizeBytes&&this.experimentalForceLongPolling===t.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===t.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,t.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===t.ignoreUndefinedProperties&&this.useFetchStreams===t.useFetchStreams}}class Xr{constructor(t,e,r,s){this._authCredentials=t,this._appCheckCredentials=e,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new oc({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new D(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(t){if(this._settingsFrozen)throw new D(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new oc(t),this._emulatorOptions=t.emulatorOptions||{},t.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new nd;switch(r.type){case"firstParty":return new od(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new D(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(t.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(e){const r=sc.get(e);r&&(V(ng,"Removing Datastore"),sc.delete(e),r.terminate())})(this),Promise.resolve()}}function sg(n,t,e,r={}){var f;n=$t(n,Xr);const s=Pc(t),o=n._getSettings(),a={...o,emulatorOptions:n._getEmulatorOptions()},u=`${t}:${e}`;s&&qh(`https://${u}`),o.host!==rl&&o.host!==u&&Se("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const h={...o,host:u,ssl:s,emulatorOptions:r};if(!Pn(h,a)&&(n._setSettings(h),r.mockUserToken)){let m,y;if(typeof r.mockUserToken=="string")m=r.mockUserToken,y=gt.MOCK_USER;else{m=Ch(r.mockUserToken,(f=n._app)==null?void 0:f.options.projectId);const v=r.mockUserToken.sub||r.mockUserToken.user_id;if(!v)throw new D(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");y=new gt(v)}n._authCredentials=new rd(new jc(m,y))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(t,e,r){this.converter=e,this._query=r,this.type="query",this.firestore=t}withConverter(t){return new Ne(this.firestore,t,this._query)}}class et{constructor(t,e,r){this.converter=e,this._key=r,this.type="document",this.firestore=t}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new se(this.firestore,this.converter,this._key.path.popLast())}withConverter(t){return new et(this.firestore,t,this._key)}toJSON(){return{type:et._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(t,e,r){if(qn(e,et._jsonSchema))return new et(t,r||null,new M(W.fromString(e.referencePath)))}}et._jsonSchemaVersion="firestore/documentReference/1.0",et._jsonSchema={type:st("string",et._jsonSchemaVersion),referencePath:st("string")};class se extends Ne{constructor(t,e,r){super(t,e,jr(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const t=this._path.popLast();return t.isEmpty()?null:new et(this.firestore,null,new M(t))}withConverter(t){return new se(this.firestore,t,this._path)}}function W_(n,t,...e){if(n=At(n),$c("collection","path",t),n instanceof Xr){const r=W.fromString(t,...e);return Ea(r),new se(n,null,r)}{if(!(n instanceof et||n instanceof se))throw new D(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(W.fromString(t,...e));return Ea(r),new se(n.firestore,null,r)}}function Q_(n,t,...e){if(n=At(n),arguments.length===1&&(t=gi.newId()),$c("doc","path",t),n instanceof Xr){const r=W.fromString(t,...e);return ya(r),new et(n,null,new M(r))}{if(!(n instanceof et||n instanceof se))throw new D(b.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(W.fromString(t,...e));return ya(r),new et(n.firestore,n instanceof se?n.converter:null,new M(r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ac="AsyncQueue";class cc{constructor(t=Promise.resolve()){this.nc=[],this.rc=!1,this.sc=[],this.oc=null,this._c=!1,this.ac=!1,this.uc=[],this.F_=new Mu(this,"async_queue_retry"),this.cc=()=>{const r=Os();r&&V(ac,"Visibility state changed to "+r.visibilityState),this.F_.y_()},this.lc=t;const e=Os();e&&typeof e.addEventListener=="function"&&e.addEventListener("visibilitychange",this.cc)}get isShuttingDown(){return this.rc}enqueueAndForget(t){this.enqueue(t)}enqueueAndForgetEvenWhileRestricted(t){this.hc(),this.Pc(t)}enterRestrictedMode(t){if(!this.rc){this.rc=!0,this.ac=t||!1;const e=Os();e&&typeof e.removeEventListener=="function"&&e.removeEventListener("visibilitychange",this.cc)}}enqueue(t){if(this.hc(),this.rc)return new Promise((()=>{}));const e=new re;return this.Pc((()=>this.rc&&this.ac?Promise.resolve():(t().then(e.resolve,e.reject),e.promise))).then((()=>e.promise))}enqueueRetryable(t){this.enqueueAndForget((()=>(this.nc.push(t),this.Tc())))}async Tc(){if(this.nc.length!==0){try{await this.nc[0](),this.nc.shift(),this.F_.reset()}catch(t){if(!Ye(t))throw t;V(ac,"Operation failed with retryable error: "+t)}this.nc.length>0&&this.F_.g_((()=>this.Tc()))}}Pc(t){const e=this.lc.then((()=>(this._c=!0,t().catch((r=>{throw this.oc=r,this._c=!1,Kt("INTERNAL UNHANDLED ERROR: ",uc(r)),r})).then((r=>(this._c=!1,r))))));return this.lc=e,e}enqueueAfterDelay(t,e,r){this.hc(),this.uc.indexOf(t)>-1&&(e=0);const s=xi.createAndSchedule(this,t,e,r,(o=>this.Ic(o)));return this.sc.push(s),s}hc(){this.oc&&x(47125,{Ec:uc(this.oc)})}verifyOperationInProgress(){}async Rc(){let t;do t=this.lc,await t;while(t!==this.lc)}Ac(t){for(const e of this.sc)if(e.timerId===t)return!0;return!1}Vc(t){return this.Rc().then((()=>{this.sc.sort(((e,r)=>e.targetTimeMs-r.targetTimeMs));for(const e of this.sc)if(e.skipDelay(),t!=="all"&&e.timerId===t)break;return this.Rc()}))}dc(t){this.uc.push(t)}Ic(t){const e=this.sc.indexOf(t);this.sc.splice(e,1)}}function uc(n){let t=n.message||"";return n.stack&&(t=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),t}class We extends Xr{constructor(t,e,r,s){super(t,e,r,s),this.type="firestore",this._queue=new cc,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const t=this._firestoreClient.terminate();this._queue=new cc(t),this._firestoreClient=void 0,await t}}}function J_(n,t){const e=typeof n=="object"?n:Nc(),r=typeof n=="string"?n:wr,s=Bn(e,"firestore").getImmediate({identifier:r});if(!s._initialized){const o=Sh("firestore");o&&sg(s,...o)}return s}function Yr(n){if(n._terminated)throw new D(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||ig(n),n._firestoreClient}function ig(n){var r,s,o,a;const t=n._freezeSettings(),e=rg(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,t);n._componentsProvider||(o=t.localCache)!=null&&o._offlineComponentProvider&&((a=t.localCache)!=null&&a._onlineComponentProvider)&&(n._componentsProvider={_offline:t.localCache._offlineComponentProvider,_online:t.localCache._onlineComponentProvider}),n._firestoreClient=new Jp(n._authCredentials,n._appCheckCredentials,n._queue,e,n._componentsProvider&&(function(h){const f=h==null?void 0:h._online.build();return{_offline:h==null?void 0:h._offline.build(f),_online:f}})(n._componentsProvider))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ct{constructor(t){this._byteString=t}static fromBase64String(t){try{return new Ct(ht.fromBase64String(t))}catch(e){throw new D(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+e)}}static fromUint8Array(t){return new Ct(ht.fromUint8Array(t))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(t){return this._byteString.isEqual(t._byteString)}toJSON(){return{type:Ct._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(t){if(qn(t,Ct._jsonSchema))return Ct.fromBase64String(t.bytes)}}Ct._jsonSchemaVersion="firestore/bytes/1.0",Ct._jsonSchema={type:st("string",Ct._jsonSchemaVersion),bytes:st("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qi{constructor(...t){for(let e=0;e<t.length;++e)if(t[e].length===0)throw new D(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new lt(t)}isEqual(t){return this._internalPath.isEqual(t._internalPath)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ji{constructor(t){this._methodName=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ut{constructor(t,e){if(!isFinite(t)||t<-90||t>90)throw new D(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+t);if(!isFinite(e)||e<-180||e>180)throw new D(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+e);this._lat=t,this._long=e}get latitude(){return this._lat}get longitude(){return this._long}isEqual(t){return this._lat===t._lat&&this._long===t._long}_compareTo(t){return B(this._lat,t._lat)||B(this._long,t._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:Ut._jsonSchemaVersion}}static fromJSON(t){if(qn(t,Ut._jsonSchema))return new Ut(t.latitude,t.longitude)}}Ut._jsonSchemaVersion="firestore/geoPoint/1.0",Ut._jsonSchema={type:st("string",Ut._jsonSchemaVersion),latitude:st("number"),longitude:st("number")};/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dt{constructor(t){this._values=(t||[]).map((e=>e))}toArray(){return this._values.map((t=>t))}isEqual(t){return(function(r,s){if(r.length!==s.length)return!1;for(let o=0;o<r.length;++o)if(r[o]!==s[o])return!1;return!0})(this._values,t._values)}toJSON(){return{type:Dt._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(t){if(qn(t,Dt._jsonSchema)){if(Array.isArray(t.vectorValues)&&t.vectorValues.every((e=>typeof e=="number")))return new Dt(t.vectorValues);throw new D(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Dt._jsonSchemaVersion="firestore/vectorValue/1.0",Dt._jsonSchema={type:st("string",Dt._jsonSchemaVersion),vectorValues:st("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const og=/^__.*__$/;class ag{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return this.fieldMask!==null?new pe(t,this.data,this.fieldMask,e,this.fieldTransforms):new jn(t,this.data,e,this.fieldTransforms)}}class sl{constructor(t,e,r){this.data=t,this.fieldMask=e,this.fieldTransforms=r}toMutation(t,e){return new pe(t,this.data,this.fieldMask,e,this.fieldTransforms)}}function il(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw x(40011,{dataSource:n})}}class $i{constructor(t,e,r,s,o,a){this.settings=t,this.databaseId=e,this.serializer=r,this.ignoreUndefinedProperties=s,o===void 0&&this.mc(),this.fieldTransforms=o||[],this.fieldMask=a||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}i(t){return new $i({...this.settings,...t},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}gc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),r=this.i({path:e,arrayElement:!1});return r.yc(t),r}wc(t){var s;const e=(s=this.path)==null?void 0:s.child(t),r=this.i({path:e,arrayElement:!1});return r.mc(),r}Sc(t){return this.i({path:void 0,arrayElement:!0})}bc(t){return kr(t,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(t){return this.fieldMask.find((e=>t.isPrefixOf(e)))!==void 0||this.fieldTransforms.find((e=>t.isPrefixOf(e.field)))!==void 0}mc(){if(this.path)for(let t=0;t<this.path.length;t++)this.yc(this.path.get(t))}yc(t){if(t.length===0)throw this.bc("Document fields must not be empty");if(il(this.dataSource)&&og.test(t))throw this.bc('Document fields cannot begin and end with "__"')}}class cg{constructor(t,e,r){this.databaseId=t,this.ignoreUndefinedProperties=e,this.serializer=r||Wr(t)}V(t,e,r,s=!1){return new $i({dataSource:t,methodName:e,targetDoc:r,path:lt.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function zi(n){const t=n._freezeSettings(),e=Wr(n._databaseId);return new cg(n._databaseId,!!t.ignoreUndefinedProperties,e)}function ol(n,t,e,r,s,o={}){const a=n.V(o.merge||o.mergeFields?2:0,t,e,s);Gi("Data must be an object, but it was:",a,r);const u=al(r,a);let h,f;if(o.merge)h=new bt(a.fieldMask),f=a.fieldTransforms;else if(o.mergeFields){const m=[];for(const y of o.mergeFields){const v=Qe(t,y,e);if(!a.contains(v))throw new D(b.INVALID_ARGUMENT,`Field '${v}' is specified in your field mask but missing from your input data.`);ll(m,v)||m.push(v)}h=new bt(m),f=a.fieldTransforms.filter((y=>h.covers(y.field)))}else h=null,f=a.fieldTransforms;return new ag(new vt(u),h,f)}class Zr extends ji{_toFieldTransform(t){if(t.dataSource!==2)throw t.dataSource===1?t.bc(`${this._methodName}() can only appear at the top level of your update data`):t.bc(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return t.fieldMask.push(t.path),null}isEqual(t){return t instanceof Zr}}function ug(n,t,e,r){const s=n.V(1,t,e);Gi("Data must be an object, but it was:",s,r);const o=[],a=vt.empty();me(r,((h,f)=>{const m=ul(t,h,e);f=At(f);const y=s.wc(m);if(f instanceof Zr)o.push(m);else{const v=Hn(f,y);v!=null&&(o.push(m),a.set(m,v))}}));const u=new bt(o);return new sl(a,u,s.fieldTransforms)}function lg(n,t,e,r,s,o){const a=n.V(1,t,e),u=[Qe(t,r,e)],h=[s];if(o.length%2!=0)throw new D(b.INVALID_ARGUMENT,`Function ${t}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let v=0;v<o.length;v+=2)u.push(Qe(t,o[v])),h.push(o[v+1]);const f=[],m=vt.empty();for(let v=u.length-1;v>=0;--v)if(!ll(f,u[v])){const P=u[v];let N=h[v];N=At(N);const O=a.wc(P);if(N instanceof Zr)f.push(P);else{const k=Hn(N,O);k!=null&&(f.push(P),m.set(P,k))}}const y=new bt(f);return new sl(m,y,a.fieldTransforms)}function hg(n,t,e,r=!1){return Hn(e,n.V(r?4:3,t))}function Hn(n,t){if(cl(n=At(n)))return Gi("Unsupported field value:",t,n),al(n,t);if(n instanceof ji)return(function(r,s){if(!il(s.dataSource))throw s.bc(`${r._methodName}() can only be used with update() and set()`);if(!s.path)throw s.bc(`${r._methodName}() is not currently supported inside arrays`);const o=r._toFieldTransform(s);o&&s.fieldTransforms.push(o)})(n,t),null;if(n===void 0&&t.ignoreUndefinedProperties)return null;if(t.path&&t.fieldMask.push(t.path),n instanceof Array){if(t.settings.arrayElement&&t.dataSource!==4)throw t.bc("Nested arrays are not supported");return(function(r,s){const o=[];let a=0;for(const u of r){let h=Hn(u,s.Sc(a));h==null&&(h={nullValue:"NULL_VALUE"}),o.push(h),a++}return{arrayValue:{values:o}}})(n,t)}return(function(r,s){if((r=At(r))===null)return{nullValue:"NULL_VALUE"};if(typeof r=="number")return Qd(s.serializer,r);if(typeof r=="boolean")return{booleanValue:r};if(typeof r=="string")return{stringValue:r};if(r instanceof Date){const o=J.fromDate(r);return{timestampValue:Cr(s.serializer,o)}}if(r instanceof J){const o=new J(r.seconds,1e3*Math.floor(r.nanoseconds/1e3));return{timestampValue:Cr(s.serializer,o)}}if(r instanceof Ut)return{geoPointValue:{latitude:r.latitude,longitude:r.longitude}};if(r instanceof Ct)return{bytesValue:vu(s.serializer,r._byteString)};if(r instanceof et){const o=s.databaseId,a=r.firestore._databaseId;if(!a.isEqual(o))throw s.bc(`Document reference is for database ${a.projectId}/${a.database} but should be for database ${o.projectId}/${o.database}`);return{referenceValue:Si(r.firestore._databaseId||s.databaseId,r._key.path)}}if(r instanceof Dt)return(function(a,u){const h=a instanceof Dt?a.toArray():a;return{mapValue:{fields:{[Yc]:{stringValue:Zc},[vr]:{arrayValue:{values:h.map((m=>{if(typeof m!="number")throw u.bc("VectorValues must only contain numeric values.");return Gr(u.serializer,m)}))}}}}}})(r,s);if(Vu(r))return r._toProto(s.serializer);throw s.bc(`Unsupported field value: ${Fr(r)}`)})(n,t)}function al(n,t){const e={};return Kc(n)?t.path&&t.path.length>0&&t.fieldMask.push(t.path):me(n,((r,s)=>{const o=Hn(s,t.gc(r));o!=null&&(e[r]=o)})),{mapValue:{fields:e}}}function cl(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof J||n instanceof Ut||n instanceof Ct||n instanceof et||n instanceof ji||n instanceof Dt||Vu(n))}function Gi(n,t,e){if(!cl(e)||!zc(e)){const r=Fr(e);throw r==="an object"?t.bc(n+" a custom object"):t.bc(n+" "+r)}}function Qe(n,t,e){if((t=At(t))instanceof qi)return t._internalPath;if(typeof t=="string")return ul(n,t);throw kr("Field path arguments must be of type string or ",n,!1,void 0,e)}const fg=new RegExp("[~\\*/\\[\\]]");function ul(n,t,e){if(t.search(fg)>=0)throw kr(`Invalid field path (${t}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,e);try{return new qi(...t.split("."))._internalPath}catch{throw kr(`Invalid field path (${t}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,e)}}function kr(n,t,e,r,s){const o=r&&!r.isEmpty(),a=s!==void 0;let u=`Function ${t}() called with invalid data`;e&&(u+=" (via `toFirestore()`)"),u+=". ";let h="";return(o||a)&&(h+=" (found",o&&(h+=` in field ${r}`),a&&(h+=` in document ${s}`),h+=")"),new D(b.INVALID_ARGUMENT,u+n+h)}function ll(n,t){return n.some((e=>e.isEqual(t)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dg{convertValue(t,e="none"){switch(ue(t)){case 0:return null;case 1:return t.booleanValue;case 2:return tt(t.integerValue||t.doubleValue);case 3:return this.convertTimestamp(t.timestampValue);case 4:return this.convertServerTimestamp(t,e);case 5:return t.stringValue;case 6:return this.convertBytes(ce(t.bytesValue));case 7:return this.convertReference(t.referenceValue);case 8:return this.convertGeoPoint(t.geoPointValue);case 9:return this.convertArray(t.arrayValue,e);case 11:return this.convertObject(t.mapValue,e);case 10:return this.convertVectorValue(t.mapValue);default:throw x(62114,{value:t})}}convertObject(t,e){return this.convertObjectMap(t.fields,e)}convertObjectMap(t,e="none"){const r={};return me(t,((s,o)=>{r[s]=this.convertValue(o,e)})),r}convertVectorValue(t){var r,s,o;const e=(o=(s=(r=t.fields)==null?void 0:r[vr].arrayValue)==null?void 0:s.values)==null?void 0:o.map((a=>tt(a.doubleValue)));return new Dt(e)}convertGeoPoint(t){return new Ut(tt(t.latitude),tt(t.longitude))}convertArray(t,e){return(t.values||[]).map((r=>this.convertValue(r,e)))}convertServerTimestamp(t,e){switch(e){case"previous":const r=qr(t);return r==null?null:this.convertValue(r,e);case"estimate":return this.convertTimestamp(Nn(t));default:return null}}convertTimestamp(t){const e=ae(t);return new J(e.seconds,e.nanos)}convertDocumentKey(t,e){const r=W.fromString(t);z(Cu(r),9688,{name:t});const s=new kn(r.get(1),r.get(3)),o=new M(r.popFirst(5));return s.isEqual(e)||Kt(`Document ${o} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${e.projectId}/${e.database}) instead.`),o}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class hl extends dg{constructor(t){super(),this.firestore=t}convertBytes(t){return new Ct(t)}convertReference(t){const e=this.convertDocumentKey(t,this.firestore._databaseId);return new et(this.firestore,null,e)}}const lc="@firebase/firestore",hc="4.15.0";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function fc(n){return(function(e,r){if(typeof e!="object"||e===null)return!1;const s=e;for(const o of r)if(o in s&&typeof s[o]=="function")return!0;return!1})(n,["next","error","complete"])}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fl{constructor(t,e,r,s,o){this._firestore=t,this._userDataWriter=e,this._key=r,this._document=s,this._converter=o}get id(){return this._key.path.lastSegment()}get ref(){return new et(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const t=new mg(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(t)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var t;return((t=this._document)==null?void 0:t.data.clone().value.mapValue.fields)??void 0}get(t){if(this._document){const e=this._document.data.field(Qe("DocumentSnapshot.get",t));if(e!==null)return this._userDataWriter.convertValue(e)}}}class mg extends fl{data(){return super.data()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function pg(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new D(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Ki{}class dl extends Ki{}function X_(n,t,...e){let r=[];t instanceof Ki&&r.push(t),r=r.concat(e),(function(o){const a=o.filter((h=>h instanceof Wi)).length,u=o.filter((h=>h instanceof Hi)).length;if(a>1||a>0&&u>0)throw new D(b.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class Hi extends dl{constructor(t,e,r){super(),this._field=t,this._op=e,this._value=r,this.type="where"}static _create(t,e,r){return new Hi(t,e,r)}_apply(t){const e=this._parse(t);return ml(t._query,e),new Ne(t.firestore,t.converter,Js(t._query,e))}_parse(t){const e=zi(t.firestore);return(function(o,a,u,h,f,m,y){let v;if(f.isKeyField()){if(m==="array-contains"||m==="array-contains-any")throw new D(b.INVALID_ARGUMENT,`Invalid Query. You can't perform '${m}' queries on documentId().`);if(m==="in"||m==="not-in"){mc(y,m);const N=[];for(const O of y)N.push(dc(h,o,O));v={arrayValue:{values:N}}}else v=dc(h,o,y)}else m!=="in"&&m!=="not-in"&&m!=="array-contains-any"||mc(y,m),v=hg(u,a,y,m==="in"||m==="not-in");return rt.create(f,m,v)})(t._query,"where",e,t.firestore._databaseId,this._field,this._op,this._value)}}class Wi extends Ki{constructor(t,e){super(),this.type=t,this._queryConstraints=e}static _create(t,e){return new Wi(t,e)}_parse(t){const e=this._queryConstraints.map((r=>r._parse(t))).filter((r=>r.getFilters().length>0));return e.length===1?e[0]:Nt.create(e,this._getOperator())}_apply(t){const e=this._parse(t);return e.getFilters().length===0?t:((function(s,o){let a=s;const u=o.getFlattenedFilters();for(const h of u)ml(a,h),a=Js(a,h)})(t._query,e),new Ne(t.firestore,t.converter,Js(t._query,e)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}class Qi extends dl{constructor(t,e){super(),this._field=t,this._direction=e,this.type="orderBy"}static _create(t,e){return new Qi(t,e)}_apply(t){const e=(function(s,o,a){if(s.startAt!==null)throw new D(b.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new D(b.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new xn(o,a)})(t._query,this._field,this._direction);return new Ne(t.firestore,t.converter,qd(t._query,e))}}function Y_(n,t="asc"){const e=t,r=Qe("orderBy",n);return Qi._create(r,e)}function dc(n,t,e){if(typeof(e=At(e))=="string"){if(e==="")throw new D(b.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!cu(t)&&e.indexOf("/")!==-1)throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${e}' contains a '/' character.`);const r=t.path.child(W.fromString(e));if(!M.isDocumentKey(r))throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Sa(n,new M(r))}if(e instanceof et)return Sa(n,e._key);throw new D(b.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${Fr(e)}.`)}function mc(n,t){if(!Array.isArray(n)||n.length===0)throw new D(b.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${t.toString()}' filters.`)}function ml(n,t){const e=(function(s,o){for(const a of s)for(const u of a.getFlattenedFilters())if(o.indexOf(u.op)>=0)return u.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(t.op));if(e!==null)throw e===t.op?new D(b.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${t.op.toString()}' filter.`):new D(b.INVALID_ARGUMENT,`Invalid query. You cannot use '${t.op.toString()}' filters with '${e.toString()}' filters.`)}function pl(n,t,e){let r;return r=n?e&&(e.merge||e.mergeFields)?n.toFirestore(t,e):n.toFirestore(t):t,r}class vn{constructor(t,e){this.hasPendingWrites=t,this.fromCache=e}isEqual(t){return this.hasPendingWrites===t.hasPendingWrites&&this.fromCache===t.fromCache}}class Re extends fl{constructor(t,e,r,s,o,a){super(t,e,r,s,a),this._firestore=t,this._firestoreImpl=t,this.metadata=o}exists(){return super.exists()}data(t={}){if(this._document){if(this._converter){const e=new Er(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(e,t)}return this._userDataWriter.convertValue(this._document.data.value,t.serverTimestamps)}}get(t,e={}){if(this._document){const r=this._document.data.field(Qe("DocumentSnapshot.get",t));if(r!==null)return this._userDataWriter.convertValue(r,e.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t=this._document,e={};return e.type=Re._jsonSchemaVersion,e.bundle="",e.bundleSource="DocumentSnapshot",e.bundleName=this._key.toString(),!t||!t.isValidDocument()||!t.isFoundDocument()?e:(this._userDataWriter.convertObjectMap(t.data.value.mapValue.fields,"previous"),e.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),e)}}Re._jsonSchemaVersion="firestore/documentSnapshot/1.0",Re._jsonSchema={type:st("string",Re._jsonSchemaVersion),bundleSource:st("string","DocumentSnapshot"),bundleName:st("string"),bundle:st("string")};class Er extends Re{data(t={}){return super.data(t)}}class je{constructor(t,e,r,s){this._firestore=t,this._userDataWriter=e,this._snapshot=s,this.metadata=new vn(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const t=[];return this.forEach((e=>t.push(e))),t}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(t,e){this._snapshot.docs.forEach((r=>{t.call(e,new Er(this._firestore,this._userDataWriter,r.key,r,new vn(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(t={}){const e=!!t.includeMetadataChanges;if(e&&this._snapshot.excludesMetadataChanges)throw new D(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===e||(this._cachedChanges=(function(s,o){if(s._snapshot.oldDocs.isEmpty()){let a=0;return s._snapshot.docChanges.map((u=>{const h=new Er(s._firestore,s._userDataWriter,u.doc.key,u.doc,new vn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);return u.doc,{type:"added",doc:h,oldIndex:-1,newIndex:a++}}))}{let a=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((u=>o||u.type!==3)).map((u=>{const h=new Er(s._firestore,s._userDataWriter,u.doc.key,u.doc,new vn(s._snapshot.mutatedKeys.has(u.doc.key),s._snapshot.fromCache),s.query.converter);let f=-1,m=-1;return u.type!==0&&(f=a.indexOf(u.doc.key),a=a.delete(u.doc.key)),u.type!==1&&(a=a.add(u.doc),m=a.indexOf(u.doc.key)),{type:gg(u.type),doc:h,oldIndex:f,newIndex:m}}))}})(this,e),this._cachedChangesIncludeMetadataChanges=e),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new D(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const t={};t.type=je._jsonSchemaVersion,t.bundleSource="QuerySnapshot",t.bundleName=gi.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const e=[],r=[],s=[];return this.docs.forEach((o=>{o._document!==null&&(e.push(o._document),r.push(this._userDataWriter.convertObjectMap(o._document.data.value.mapValue.fields,"previous")),s.push(o.ref.path))})),t.bundle=(this._firestore,this.query._query,t.bundleName,"NOT SUPPORTED"),t}}function gg(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return x(61501,{type:n})}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */je._jsonSchemaVersion="firestore/querySnapshot/1.0",je._jsonSchema={type:st("string",je._jsonSchemaVersion),bundleSource:st("string","QuerySnapshot"),bundleName:st("string"),bundle:st("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _g{constructor(t,e){this._firestore=t,this._commitHandler=e,this._mutations=[],this._committed=!1,this._dataReader=zi(t)}set(t,e,r){this._verifyNotCommitted();const s=xs(t,this._firestore),o=pl(s.converter,e,r),a=ol(this._dataReader,"WriteBatch.set",s._key,o,s.converter!==null,r);return this._mutations.push(a.toMutation(s._key,Vt.none())),this}update(t,e,r,...s){this._verifyNotCommitted();const o=xs(t,this._firestore);let a;return a=typeof(e=At(e))=="string"||e instanceof qi?lg(this._dataReader,"WriteBatch.update",o._key,e,r,s):ug(this._dataReader,"WriteBatch.update",o._key,e),this._mutations.push(a.toMutation(o._key,Vt.exists(!0))),this}delete(t){this._verifyNotCommitted();const e=xs(t,this._firestore);return this._mutations=this._mutations.concat(new Ai(e._key,Vt.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new D(b.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function xs(n,t){if((n=At(n)).firestore!==t)throw new D(b.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Z_(n){n=$t(n,et);const t=$t(n.firestore,We),e=Yr(t);return tg(e,n._key).then((r=>_l(t,n,r)))}function ty(n,t,e){n=$t(n,et);const r=$t(n.firestore,We),s=pl(n.converter,t,e),o=zi(r);return gl(r,[ol(o,"setDoc",n._key,s,n.converter!==null,e).toMutation(n._key,Vt.none())])}function ey(n,...t){var f,m,y;n=At(n);let e={includeMetadataChanges:!1,source:"default"},r=0;typeof t[r]!="object"||fc(t[r])||(e=t[r++]);const s={includeMetadataChanges:e.includeMetadataChanges,source:e.source};if(fc(t[r])){const v=t[r];t[r]=(f=v.next)==null?void 0:f.bind(v),t[r+1]=(m=v.error)==null?void 0:m.bind(v),t[r+2]=(y=v.complete)==null?void 0:y.bind(v)}let o,a,u;if(n instanceof et)a=$t(n.firestore,We),u=jr(n._key.path),o={next:v=>{t[r]&&t[r](_l(a,n,v))},error:t[r+1],complete:t[r+2]};else{const v=$t(n,Ne);a=$t(v.firestore,We),u=v._query;const P=new hl(a);o={next:N=>{t[r]&&t[r](new je(a,P,v,N))},error:t[r+1],complete:t[r+2]},pg(n._query)}const h=Yr(a);return Zp(h,u,s,o)}function gl(n,t){const e=Yr(n);return eg(e,t)}function _l(n,t,e){const r=e.docs.get(t._key),s=new hl(n);return new Re(n,s,t._key,r,new vn(e.hasPendingWrites,e.fromCache),t.converter)}function ny(n){return n=$t(n,We),Yr(n),new _g(n,(t=>gl(n,t)))}(function(t,e=!0){ed(qf),ie(new zt("firestore",((r,{instanceIdentifier:s,options:o})=>{const a=r.getProvider("app").getImmediate(),u=new We(new sd(r.getProvider("auth-internal")),new ad(a,r.getProvider("app-check-internal")),Ad(a,s),a);return o={useFetchStreams:e,...o},u._setSettings(o),u}),"PUBLIC").setMultipleInstances(!0)),xt(lc,hc,t),xt(lc,hc,"esm2020")})();const yl="@firebase/installations",Ji="0.6.22";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const El=1e4,Tl=`w:${Ji}`,Il="FIS_v2",yg="https://firebaseinstallations.googleapis.com/v1",Eg=3600*1e3,Tg="installations",Ig="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wg={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},Pe=new Lr(Tg,Ig,wg);function wl(n){return n instanceof de&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function vl({projectId:n}){return`${yg}/projects/${n}/installations`}function Al(n){return{token:n.token,requestStatus:2,expiresIn:Ag(n.expiresIn),creationTime:Date.now()}}async function Rl(n,t){const r=(await t.json()).error;return Pe.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function bl({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function vg(n,{refreshToken:t}){const e=bl(n);return e.append("Authorization",Rg(t)),e}async function Sl(n){const t=await n();return t.status>=500&&t.status<600?n():t}function Ag(n){return Number(n.replace("s","000"))}function Rg(n){return`${Il} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function bg({appConfig:n,heartbeatServiceProvider:t},{fid:e}){const r=vl(n),s=bl(n),o=t.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={fid:e,authVersion:Il,appId:n.appId,sdkVersion:Tl},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await Sl(()=>fetch(r,u));if(h.ok){const f=await h.json();return{fid:f.fid||e,registrationStatus:2,refreshToken:f.refreshToken,authToken:Al(f.authToken)}}else throw await Rl("Create Installation",h)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pl(n){return new Promise(t=>{setTimeout(t,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sg(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Pg=/^[cdef][\w-]{21}$/,ui="";function Cg(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const e=Vg(n);return Pg.test(e)?e:ui}catch{return ui}}function Vg(n){return Sg(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ts(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Cl=new Map;function Vl(n,t){const e=ts(n);Dl(e,t),Dg(e,t)}function Dl(n,t){const e=Cl.get(n);if(e)for(const r of e)r(t)}function Dg(n,t){const e=Ng();e&&e.postMessage({key:n,fid:t}),kg()}let Ae=null;function Ng(){return!Ae&&"BroadcastChannel"in self&&(Ae=new BroadcastChannel("[Firebase] FID Change"),Ae.onmessage=n=>{Dl(n.data.key,n.data.fid)}),Ae}function kg(){Cl.size===0&&Ae&&(Ae.close(),Ae=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Og="firebase-installations-database",Mg=1,Ce="firebase-installations-store";let Ls=null;function Xi(){return Ls||(Ls=Dc(Og,Mg,{upgrade:(n,t)=>{switch(t){case 0:n.createObjectStore(Ce)}}})),Ls}async function Or(n,t){const e=ts(n),s=(await Xi()).transaction(Ce,"readwrite"),o=s.objectStore(Ce),a=await o.get(e);return await o.put(t,e),await s.done,(!a||a.fid!==t.fid)&&Vl(n,t.fid),t}async function Nl(n){const t=ts(n),r=(await Xi()).transaction(Ce,"readwrite");await r.objectStore(Ce).delete(t),await r.done}async function es(n,t){const e=ts(n),s=(await Xi()).transaction(Ce,"readwrite"),o=s.objectStore(Ce),a=await o.get(e),u=t(a);return u===void 0?await o.delete(e):await o.put(u,e),await s.done,u&&(!a||a.fid!==u.fid)&&Vl(n,u.fid),u}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yi(n){let t;const e=await es(n.appConfig,r=>{const s=xg(r),o=Lg(n,s);return t=o.registrationPromise,o.installationEntry});return e.fid===ui?{installationEntry:await t}:{installationEntry:e,registrationPromise:t}}function xg(n){const t=n||{fid:Cg(),registrationStatus:0};return kl(t)}function Lg(n,t){if(t.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(Pe.create("app-offline"));return{installationEntry:t,registrationPromise:s}}const e={fid:t.fid,registrationStatus:1,registrationTime:Date.now()},r=Fg(n,e);return{installationEntry:e,registrationPromise:r}}else return t.registrationStatus===1?{installationEntry:t,registrationPromise:Ug(n)}:{installationEntry:t}}async function Fg(n,t){try{const e=await bg(n,t);return Or(n.appConfig,e)}catch(e){throw wl(e)&&e.customData.serverCode===409?await Nl(n.appConfig):await Or(n.appConfig,{fid:t.fid,registrationStatus:0}),e}}async function Ug(n){let t=await pc(n.appConfig);for(;t.registrationStatus===1;)await Pl(100),t=await pc(n.appConfig);if(t.registrationStatus===0){const{installationEntry:e,registrationPromise:r}=await Yi(n);return r||e}return t}function pc(n){return es(n,t=>{if(!t)throw Pe.create("installation-not-found");return kl(t)})}function kl(n){return Bg(n)?{fid:n.fid,registrationStatus:0}:n}function Bg(n){return n.registrationStatus===1&&n.registrationTime+El<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function qg({appConfig:n,heartbeatServiceProvider:t},e){const r=jg(n,e),s=vg(n,e),o=t.getImmediate({optional:!0});if(o){const f=await o.getHeartbeatsHeader();f&&s.append("x-firebase-client",f)}const a={installation:{sdkVersion:Tl,appId:n.appId}},u={method:"POST",headers:s,body:JSON.stringify(a)},h=await Sl(()=>fetch(r,u));if(h.ok){const f=await h.json();return Al(f)}else throw await Rl("Generate Auth Token",h)}function jg(n,{fid:t}){return`${vl(n)}/${t}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Zi(n,t=!1){let e;const r=await es(n.appConfig,o=>{if(!Ol(o))throw Pe.create("not-registered");const a=o.authToken;if(!t&&Gg(a))return o;if(a.requestStatus===1)return e=$g(n,t),o;{if(!navigator.onLine)throw Pe.create("app-offline");const u=Hg(o);return e=zg(n,u),u}});return e?await e:r.authToken}async function $g(n,t){let e=await gc(n.appConfig);for(;e.authToken.requestStatus===1;)await Pl(100),e=await gc(n.appConfig);const r=e.authToken;return r.requestStatus===0?Zi(n,t):r}function gc(n){return es(n,t=>{if(!Ol(t))throw Pe.create("not-registered");const e=t.authToken;return Wg(e)?{...t,authToken:{requestStatus:0}}:t})}async function zg(n,t){try{const e=await qg(n,t),r={...t,authToken:e};return await Or(n.appConfig,r),e}catch(e){if(wl(e)&&(e.customData.serverCode===401||e.customData.serverCode===404))await Nl(n.appConfig);else{const r={...t,authToken:{requestStatus:0}};await Or(n.appConfig,r)}throw e}}function Ol(n){return n!==void 0&&n.registrationStatus===2}function Gg(n){return n.requestStatus===2&&!Kg(n)}function Kg(n){const t=Date.now();return t<n.creationTime||n.creationTime+n.expiresIn<t+Eg}function Hg(n){const t={requestStatus:1,requestTime:Date.now()};return{...n,authToken:t}}function Wg(n){return n.requestStatus===1&&n.requestTime+El<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Qg(n){const t=n,{installationEntry:e,registrationPromise:r}=await Yi(t);return r?r.catch(console.error):Zi(t).catch(console.error),e.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Jg(n,t=!1){const e=n;return await Xg(e),(await Zi(e,t)).token}async function Xg(n){const{registrationPromise:t}=await Yi(n);t&&await t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yg(n){if(!n||!n.options)throw Fs("App Configuration");if(!n.name)throw Fs("App Name");const t=["projectId","apiKey","appId"];for(const e of t)if(!n.options[e])throw Fs(e);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Fs(n){return Pe.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ml="installations",Zg="installations-internal",t_=n=>{const t=n.getProvider("app").getImmediate(),e=Yg(t),r=Bn(t,"heartbeat");return{app:t,appConfig:e,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},e_=n=>{const t=n.getProvider("app").getImmediate(),e=Bn(t,Ml).getImmediate();return{getId:()=>Qg(e),getToken:s=>Jg(e,s)}};function n_(){ie(new zt(Ml,t_,"PUBLIC")),ie(new zt(Zg,e_,"PRIVATE"))}n_();xt(yl,Ji);xt(yl,Ji,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Mr="analytics",r_="firebase_id",s_="origin",i_=60*1e3,o_="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",to="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Tt=new di("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const a_={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},St=new Lr("analytics","Analytics",a_);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function c_(n){if(!n.startsWith(to)){const t=St.create("invalid-gtag-resource",{gtagURL:n});return Tt.warn(t.message),""}return n}function xl(n){return Promise.all(n.map(t=>t.catch(e=>e)))}function u_(n,t){let e;return window.trustedTypes&&(e=window.trustedTypes.createPolicy(n,t)),e}function l_(n,t){const e=u_("firebase-js-sdk-policy",{createScriptURL:c_}),r=document.createElement("script"),s=`${to}?l=${n}&id=${t}`;r.src=e?e==null?void 0:e.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function h_(n){let t=[];return Array.isArray(window[n])?t=window[n]:window[n]=t,t}async function f_(n,t,e,r,s,o){const a=r[s];try{if(a)await t[a];else{const h=(await xl(e)).find(f=>f.measurementId===s);h&&await t[h.appId]}}catch(u){Tt.error(u)}n("config",s,o)}async function d_(n,t,e,r,s){try{let o=[];if(s&&s.send_to){let a=s.send_to;Array.isArray(a)||(a=[a]);const u=await xl(e);for(const h of a){const f=u.find(y=>y.measurementId===h),m=f&&t[f.appId];if(m)o.push(m);else{o=[];break}}}o.length===0&&(o=Object.values(t)),await Promise.all(o),n("event",r,s||{})}catch(o){Tt.error(o)}}function m_(n,t,e,r){async function s(o,...a){try{if(o==="event"){const[u,h]=a;await d_(n,t,e,u,h)}else if(o==="config"){const[u,h]=a;await f_(n,t,e,r,u,h)}else if(o==="consent"){const[u,h]=a;n("consent",u,h)}else if(o==="get"){const[u,h,f]=a;n("get",u,h,f)}else if(o==="set"){const[u]=a;n("set",u)}else n(o,...a)}catch(u){Tt.error(u)}}return s}function p_(n,t,e,r,s){let o=function(...a){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(o=window[s]),window[s]=m_(o,n,t,e),{gtagCore:o,wrappedGtag:window[s]}}function g_(n){const t=window.document.getElementsByTagName("script");for(const e of Object.values(t))if(e.src&&e.src.includes(to)&&e.src.includes(n))return e;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const __=30,y_=1e3;class E_{constructor(t={},e=y_){this.throttleMetadata=t,this.intervalMillis=e}getThrottleMetadata(t){return this.throttleMetadata[t]}setThrottleMetadata(t,e){this.throttleMetadata[t]=e}deleteThrottleMetadata(t){delete this.throttleMetadata[t]}}const Ll=new E_;function T_(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function I_(n){var a;const{appId:t,apiKey:e}=n,r={method:"GET",headers:T_(e)},s=o_.replace("{app-id}",t),o=await fetch(s,r);if(o.status!==200&&o.status!==304){let u="";try{const h=await o.json();(a=h.error)!=null&&a.message&&(u=h.error.message)}catch{}throw St.create("config-fetch-failed",{httpStatus:o.status,responseMessage:u})}return o.json()}async function w_(n,t=Ll,e){const{appId:r,apiKey:s,measurementId:o}=n.options;if(!r)throw St.create("no-app-id");if(!s){if(o)return{measurementId:o,appId:r};throw St.create("no-api-key")}const a=t.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},u=new R_;return setTimeout(async()=>{u.abort()},i_),Fl({appId:r,apiKey:s,measurementId:o},a,u,t)}async function Fl(n,{throttleEndTimeMillis:t,backoffCount:e},r,s=Ll){var u;const{appId:o,measurementId:a}=n;try{await v_(r,t)}catch(h){if(a)return Tt.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${h==null?void 0:h.message}]`),{appId:o,measurementId:a};throw h}try{const h=await I_(n);return s.deleteThrottleMetadata(o),h}catch(h){const f=h;if(!A_(f)){if(s.deleteThrottleMetadata(o),a)return Tt.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${a} provided in the "measurementId" field in the local Firebase config. [${f==null?void 0:f.message}]`),{appId:o,measurementId:a};throw h}const m=Number((u=f==null?void 0:f.customData)==null?void 0:u.httpStatus)===503?oa(e,s.intervalMillis,__):oa(e,s.intervalMillis),y={throttleEndTimeMillis:Date.now()+m,backoffCount:e+1};return s.setThrottleMetadata(o,y),Tt.debug(`Calling attemptFetch again in ${m} millis`),Fl(n,y,r,s)}}function v_(n,t){return new Promise((e,r)=>{const s=Math.max(t-Date.now(),0),o=setTimeout(e,s);n.addEventListener(()=>{clearTimeout(o),r(St.create("fetch-throttle",{throttleEndTimeMillis:t}))})})}function A_(n){if(!(n instanceof de)||!n.customData)return!1;const t=Number(n.customData.httpStatus);return t===429||t===500||t===503||t===504}class R_{constructor(){this.listeners=[]}addEventListener(t){this.listeners.push(t)}abort(){this.listeners.forEach(t=>t())}}async function b_(n,t,e,r,s){if(s&&s.global){n("event",e,r);return}else{const o=await t,a={...r,send_to:o};n("event",e,a)}}async function S_(n,t,e,r){if(r&&r.global){const s={};for(const o of Object.keys(e))s[`user_properties.${o}`]=e[o];return n("set",s),Promise.resolve()}else{const s=await t;n("config",s,{update:!0,user_properties:e})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function P_(){if(hi())try{await fi()}catch(n){return Tt.warn(St.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Tt.warn(St.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function C_(n,t,e,r,s,o,a){const u=w_(n);u.then(v=>{e[v.measurementId]=v.appId,n.options.measurementId&&v.measurementId!==n.options.measurementId&&Tt.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${v.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(v=>Tt.error(v)),t.push(u);const h=P_().then(v=>{if(v)return r.getId()}),[f,m]=await Promise.all([u,h]);g_(o)||l_(o,f.measurementId),s("js",new Date);const y=(a==null?void 0:a.config)??{};return y[s_]="firebase",y.update=!0,m!=null&&(y[r_]=m),s("config",f.measurementId,y),f.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class V_{constructor(t){this.app=t}_delete(){return delete $e[this.app.options.appId],Promise.resolve()}}let $e={},_c=[];const yc={};let Us="dataLayer",D_="gtag",Ec,eo,Tc=!1;function N_(){const n=[];if(bc()&&n.push("This is a browser extension environment."),Sc()||n.push("Cookies are not available."),n.length>0){const t=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),e=St.create("invalid-analytics-context",{errorInfo:t});Tt.warn(e.message)}}function k_(n,t,e){N_();const r=n.options.appId;if(!r)throw St.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Tt.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw St.create("no-api-key");if($e[r]!=null)throw St.create("already-exists",{id:r});if(!Tc){h_(Us);const{wrappedGtag:o,gtagCore:a}=p_($e,_c,yc,Us,D_);eo=o,Ec=a,Tc=!0}return $e[r]=C_(n,_c,yc,t,Ec,Us,e),new V_(n)}function ry(n=Nc()){n=At(n);const t=Bn(n,Mr);return t.isInitialized()?t.getImmediate():O_(n)}function O_(n,t={}){const e=Bn(n,Mr);if(e.isInitialized()){const s=e.getImmediate();if(Pn(t,e.getOptions()))return s;throw St.create("already-initialized")}return e.initialize({options:t})}async function sy(){if(bc()||!Sc()||!hi())return!1;try{return await fi()}catch{return!1}}function M_(n,t,e){n=At(n),S_(eo,$e[n.app.options.appId],t,e).catch(r=>Tt.error(r))}function x_(n,t,e,r){n=At(n),b_(eo,$e[n.app.options.appId],t,e,r).catch(s=>Tt.error(s))}const Ic="@firebase/analytics",wc="0.10.22";function L_(){ie(new zt(Mr,(t,{options:e})=>{const r=t.getProvider("app").getImmediate(),s=t.getProvider("installations-internal").getImmediate();return k_(r,s,e)},"PUBLIC")),ie(new zt("analytics-internal",n,"PRIVATE")),xt(Ic,wc),xt(Ic,wc,"esm2020");function n(t){try{const e=t.getProvider(Mr).getImmediate();return{logEvent:(r,s,o)=>x_(e,r,s,o),setUserProperties:(r,s)=>M_(e,r,s)}}catch(e){throw St.create("interop-component-reg-failed",{reason:e})}}}L_();export{ey as A,Y_ as B,zt as C,qh as D,Lr as E,de as F,X_ as G,z_ as H,xt as I,ty as J,ny as K,$ as L,qf as S,Bn as _,di as a,Ff as b,ie as c,Ih as d,W_ as e,G_ as f,Pn as g,Q_ as h,ry as i,Nc as j,K_ as k,bh as l,Z_ as m,F_ as n,J_ as o,At as p,li as q,jf as r,bc as s,Pc as t,B_ as u,$_ as v,j_ as w,U_ as x,q_ as y,sy as z};
