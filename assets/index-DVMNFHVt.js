(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))r(a);new MutationObserver(a=>{for(const o of a)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&r(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const o={};return a.integrity&&(o.integrity=a.integrity),a.referrerPolicy&&(o.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?o.credentials="include":a.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function r(a){if(a.ep)return;a.ep=!0;const o=t(a);fetch(a.href,o)}})();var Ve=1e-6,tt=typeof Float32Array<"u"?Float32Array:Array;function de(){var i=new tt(16);return tt!=Float32Array&&(i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=0,i[12]=0,i[13]=0,i[14]=0),i[0]=1,i[5]=1,i[10]=1,i[15]=1,i}function bt(i){return i[0]=1,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=1,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[10]=1,i[11]=0,i[12]=0,i[13]=0,i[14]=0,i[15]=1,i}function yt(i,e){var t=e[0],r=e[1],a=e[2],o=e[3],s=e[4],u=e[5],b=e[6],y=e[7],h=e[8],c=e[9],l=e[10],d=e[11],m=e[12],w=e[13],v=e[14],f=e[15],p=t*u-r*s,x=t*b-a*s,S=t*y-o*s,C=r*b-a*u,k=r*y-o*u,V=a*y-o*b,O=h*w-c*m,L=h*v-l*m,F=h*f-d*m,P=c*v-l*w,G=c*f-d*w,N=l*f-d*v,D=p*N-x*G+S*P+C*F-k*L+V*O;return D?(D=1/D,i[0]=(u*N-b*G+y*P)*D,i[1]=(a*G-r*N-o*P)*D,i[2]=(w*V-v*k+f*C)*D,i[3]=(l*k-c*V-d*C)*D,i[4]=(b*F-s*N-y*L)*D,i[5]=(t*N-a*F+o*L)*D,i[6]=(v*S-m*V-f*x)*D,i[7]=(h*V-l*S+d*x)*D,i[8]=(s*G-u*F+y*O)*D,i[9]=(r*F-t*G-o*O)*D,i[10]=(m*k-w*S+f*p)*D,i[11]=(c*S-h*k-d*p)*D,i[12]=(u*L-s*P-b*O)*D,i[13]=(t*P-r*L+a*O)*D,i[14]=(w*x-m*C-v*p)*D,i[15]=(h*C-c*x+l*p)*D,i):null}function it(i,e,t){var r=e[0],a=e[1],o=e[2],s=e[3],u=e[4],b=e[5],y=e[6],h=e[7],c=e[8],l=e[9],d=e[10],m=e[11],w=e[12],v=e[13],f=e[14],p=e[15],x=t[0],S=t[1],C=t[2],k=t[3];return i[0]=x*r+S*u+C*c+k*w,i[1]=x*a+S*b+C*l+k*v,i[2]=x*o+S*y+C*d+k*f,i[3]=x*s+S*h+C*m+k*p,x=t[4],S=t[5],C=t[6],k=t[7],i[4]=x*r+S*u+C*c+k*w,i[5]=x*a+S*b+C*l+k*v,i[6]=x*o+S*y+C*d+k*f,i[7]=x*s+S*h+C*m+k*p,x=t[8],S=t[9],C=t[10],k=t[11],i[8]=x*r+S*u+C*c+k*w,i[9]=x*a+S*b+C*l+k*v,i[10]=x*o+S*y+C*d+k*f,i[11]=x*s+S*h+C*m+k*p,x=t[12],S=t[13],C=t[14],k=t[15],i[12]=x*r+S*u+C*c+k*w,i[13]=x*a+S*b+C*l+k*v,i[14]=x*o+S*y+C*d+k*f,i[15]=x*s+S*h+C*m+k*p,i}function xt(i,e,t,r,a){var o=1/Math.tan(e/2);if(i[0]=o/t,i[1]=0,i[2]=0,i[3]=0,i[4]=0,i[5]=o,i[6]=0,i[7]=0,i[8]=0,i[9]=0,i[11]=-1,i[12]=0,i[13]=0,i[15]=0,a!=null&&a!==1/0){var s=1/(r-a);i[10]=(a+r)*s,i[14]=2*a*r*s}else i[10]=-1,i[14]=-2*r;return i}var wt=xt;function St(i,e,t,r){var a,o,s,u,b,y,h,c,l,d,m=e[0],w=e[1],v=e[2],f=r[0],p=r[1],x=r[2],S=t[0],C=t[1],k=t[2];return Math.abs(m-S)<Ve&&Math.abs(w-C)<Ve&&Math.abs(v-k)<Ve?bt(i):(h=m-S,c=w-C,l=v-k,d=1/Math.sqrt(h*h+c*c+l*l),h*=d,c*=d,l*=d,a=p*l-x*c,o=x*h-f*l,s=f*c-p*h,d=Math.sqrt(a*a+o*o+s*s),d?(d=1/d,a*=d,o*=d,s*=d):(a=0,o=0,s=0),u=c*s-l*o,b=l*a-h*s,y=h*o-c*a,d=Math.sqrt(u*u+b*b+y*y),d?(d=1/d,u*=d,b*=d,y*=d):(u=0,b=0,y=0),i[0]=a,i[1]=u,i[2]=h,i[3]=0,i[4]=o,i[5]=b,i[6]=c,i[7]=0,i[8]=s,i[9]=y,i[10]=l,i[11]=0,i[12]=-(a*m+o*w+s*v),i[13]=-(u*m+b*w+y*v),i[14]=-(h*m+c*w+l*v),i[15]=1,i)}class q{constructor(e,t,r,a,o="div"){this.parent=e,this.object=t,this.property=r,this._disabled=!1,this._hidden=!1,this.initialValue=this.getValue(),this.domElement=document.createElement(o),this.domElement.classList.add("lil-controller"),this.domElement.classList.add(a),this.$name=document.createElement("div"),this.$name.classList.add("lil-name"),q.nextNameID=q.nextNameID||0,this.$name.id=`lil-gui-name-${++q.nextNameID}`,this.$widget=document.createElement("div"),this.$widget.classList.add("lil-widget"),this.$disable=this.$widget,this.domElement.appendChild(this.$name),this.domElement.appendChild(this.$widget),this.domElement.addEventListener("keydown",s=>s.stopPropagation()),this.domElement.addEventListener("keyup",s=>s.stopPropagation()),this.parent.children.push(this),this.parent.controllers.push(this),this.parent.$children.appendChild(this.domElement),this._listenCallback=this._listenCallback.bind(this),this.name(r)}name(e){return this._name=e,this.$name.textContent=e,this}onChange(e){return this._onChange=e,this}_callOnChange(){this.parent._callOnChange(this),this._onChange!==void 0&&this._onChange.call(this,this.getValue()),this._changed=!0}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(){this._changed&&(this.parent._callOnFinishChange(this),this._onFinishChange!==void 0&&this._onFinishChange.call(this,this.getValue())),this._changed=!1}reset(){return this.setValue(this.initialValue),this._callOnFinishChange(),this}enable(e=!0){return this.disable(!e)}disable(e=!0){return e===this._disabled?this:(this._disabled=e,this.domElement.classList.toggle("lil-disabled",e),this.$disable.toggleAttribute("disabled",e),this)}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}options(e){const t=this.parent.add(this.object,this.property,e);return t.name(this._name),this.destroy(),t}min(e){return this}max(e){return this}step(e){return this}decimals(e){return this}listen(e=!0){return this._listening=e,this._listenCallbackID!==void 0&&(cancelAnimationFrame(this._listenCallbackID),this._listenCallbackID=void 0),this._listening&&this._listenCallback(),this}_listenCallback(){this._listenCallbackID=requestAnimationFrame(this._listenCallback);const e=this.save();e!==this._listenPrevValue&&this.updateDisplay(),this._listenPrevValue=e}getValue(){return this.object[this.property]}setValue(e){return this.getValue()!==e&&(this.object[this.property]=e,this._callOnChange(),this.updateDisplay()),this}updateDisplay(){return this}load(e){return this.setValue(e),this._callOnFinishChange(),this}save(){return this.getValue()}destroy(){this.listen(!1),this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.controllers.splice(this.parent.controllers.indexOf(this),1),this.parent.$children.removeChild(this.domElement)}}class Ct extends q{constructor(e,t,r){super(e,t,r,"lil-boolean","label"),this.$input=document.createElement("input"),this.$input.setAttribute("type","checkbox"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$widget.appendChild(this.$input),this.$input.addEventListener("change",()=>{this.setValue(this.$input.checked),this._callOnFinishChange()}),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.checked=this.getValue(),this}}function Le(i){let e,t;return(e=i.match(/(#|0x)?([a-f0-9]{6})/i))?t=e[2]:(e=i.match(/rgb\(\s*(\d*)\s*,\s*(\d*)\s*,\s*(\d*)\s*\)/))?t=parseInt(e[1]).toString(16).padStart(2,0)+parseInt(e[2]).toString(16).padStart(2,0)+parseInt(e[3]).toString(16).padStart(2,0):(e=i.match(/^#?([a-f0-9])([a-f0-9])([a-f0-9])$/i))&&(t=e[1]+e[1]+e[2]+e[2]+e[3]+e[3]),t?"#"+t:!1}const kt={isPrimitive:!0,match:i=>typeof i=="string",fromHexString:Le,toHexString:Le},ue={isPrimitive:!0,match:i=>typeof i=="number",fromHexString:i=>parseInt(i.substring(1),16),toHexString:i=>"#"+i.toString(16).padStart(6,0)},_t={isPrimitive:!1,match:i=>Array.isArray(i)||ArrayBuffer.isView(i),fromHexString(i,e,t=1){const r=ue.fromHexString(i);e[0]=(r>>16&255)/255*t,e[1]=(r>>8&255)/255*t,e[2]=(r&255)/255*t},toHexString([i,e,t],r=1){r=255/r;const a=i*r<<16^e*r<<8^t*r<<0;return ue.toHexString(a)}},Mt={isPrimitive:!1,match:i=>Object(i)===i,fromHexString(i,e,t=1){const r=ue.fromHexString(i);e.r=(r>>16&255)/255*t,e.g=(r>>8&255)/255*t,e.b=(r&255)/255*t},toHexString({r:i,g:e,b:t},r=1){r=255/r;const a=i*r<<16^e*r<<8^t*r<<0;return ue.toHexString(a)}},At=[kt,ue,_t,Mt];function Dt(i){return At.find(e=>e.match(i))}class Bt extends q{constructor(e,t,r,a){super(e,t,r,"lil-color"),this.$input=document.createElement("input"),this.$input.setAttribute("type","color"),this.$input.setAttribute("tabindex",-1),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$text=document.createElement("input"),this.$text.setAttribute("type","text"),this.$text.setAttribute("spellcheck","false"),this.$text.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$display.appendChild(this.$input),this.$widget.appendChild(this.$display),this.$widget.appendChild(this.$text),this._format=Dt(this.initialValue),this._rgbScale=a,this._initialValueHexString=this.save(),this._textFocused=!1,this.$input.addEventListener("input",()=>{this._setValueFromHexString(this.$input.value)}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$text.addEventListener("input",()=>{const o=Le(this.$text.value);o&&this._setValueFromHexString(o)}),this.$text.addEventListener("focus",()=>{this._textFocused=!0,this.$text.select()}),this.$text.addEventListener("blur",()=>{this._textFocused=!1,this.updateDisplay(),this._callOnFinishChange()}),this.$disable=this.$text,this.updateDisplay()}reset(){return this._setValueFromHexString(this._initialValueHexString),this}_setValueFromHexString(e){if(this._format.isPrimitive){const t=this._format.fromHexString(e);this.setValue(t)}else this._format.fromHexString(e,this.getValue(),this._rgbScale),this._callOnChange(),this.updateDisplay()}save(){return this._format.toHexString(this.getValue(),this._rgbScale)}load(e){return this._setValueFromHexString(e),this._callOnFinishChange(),this}updateDisplay(){return this.$input.value=this._format.toHexString(this.getValue(),this._rgbScale),this._textFocused||(this.$text.value=this.$input.value.substring(1)),this.$display.style.backgroundColor=this.$input.value,this}}class Oe extends q{constructor(e,t,r){super(e,t,r,"lil-function"),this.$button=document.createElement("button"),this.$button.appendChild(this.$name),this.$widget.appendChild(this.$button),this.$button.addEventListener("click",a=>{a.preventDefault(),this.getValue().call(this.object),this._callOnChange()}),this.$button.addEventListener("touchstart",()=>{},{passive:!0}),this.$disable=this.$button}}class Ft extends q{constructor(e,t,r,a,o,s){super(e,t,r,"lil-number"),this._initInput(),this.min(a),this.max(o);const u=s!==void 0;this.step(u?s:this._getImplicitStep(),u),this.updateDisplay()}decimals(e){return this._decimals=e,this.updateDisplay(),this}min(e){return this._min=e,this._onUpdateMinMax(),this}max(e){return this._max=e,this._onUpdateMinMax(),this}step(e,t=!0){return this._step=e,this._stepExplicit=t,this}updateDisplay(){const e=this.getValue();if(this._hasSlider){let t=(e-this._min)/(this._max-this._min);t=Math.max(0,Math.min(t,1)),this.$fill.style.width=t*100+"%"}return this._inputFocused||(this.$input.value=this._decimals===void 0?e:e.toFixed(this._decimals)),this}_initInput(){this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("aria-labelledby",this.$name.id),window.matchMedia("(pointer: coarse)").matches&&(this.$input.setAttribute("type","number"),this.$input.setAttribute("step","any")),this.$widget.appendChild(this.$input),this.$disable=this.$input;const t=()=>{let p=parseFloat(this.$input.value);isNaN(p)||(this._stepExplicit&&(p=this._snap(p)),this.setValue(this._clamp(p)))},r=p=>{const x=parseFloat(this.$input.value);isNaN(x)||(this._snapClampSetValue(x+p),this.$input.value=this.getValue())},a=p=>{p.key==="Enter"&&this.$input.blur(),p.code==="ArrowUp"&&(p.preventDefault(),r(this._step*this._arrowKeyMultiplier(p))),p.code==="ArrowDown"&&(p.preventDefault(),r(this._step*this._arrowKeyMultiplier(p)*-1))},o=p=>{this._inputFocused&&(p.preventDefault(),r(this._step*this._normalizeMouseWheel(p)))};let s=!1,u,b,y,h,c;const l=5,d=p=>{u=p.clientX,b=y=p.clientY,s=!0,h=this.getValue(),c=0,window.addEventListener("mousemove",m),window.addEventListener("mouseup",w)},m=p=>{if(s){const x=p.clientX-u,S=p.clientY-b;Math.abs(S)>l?(p.preventDefault(),this.$input.blur(),s=!1,this._setDraggingStyle(!0,"vertical")):Math.abs(x)>l&&w()}if(!s){const x=p.clientY-y;c-=x*this._step*this._arrowKeyMultiplier(p),h+c>this._max?c=this._max-h:h+c<this._min&&(c=this._min-h),this._snapClampSetValue(h+c)}y=p.clientY},w=()=>{this._setDraggingStyle(!1,"vertical"),this._callOnFinishChange(),window.removeEventListener("mousemove",m),window.removeEventListener("mouseup",w)},v=()=>{this._inputFocused=!0},f=()=>{this._inputFocused=!1,this.updateDisplay(),this._callOnFinishChange()};this.$input.addEventListener("input",t),this.$input.addEventListener("keydown",a),this.$input.addEventListener("wheel",o,{passive:!1}),this.$input.addEventListener("mousedown",d),this.$input.addEventListener("focus",v),this.$input.addEventListener("blur",f)}_initSlider(){this._hasSlider=!0,this.$slider=document.createElement("div"),this.$slider.classList.add("lil-slider"),this.$fill=document.createElement("div"),this.$fill.classList.add("lil-fill"),this.$slider.appendChild(this.$fill),this.$widget.insertBefore(this.$slider,this.$input),this.domElement.classList.add("lil-has-slider");const e=(f,p,x,S,C)=>(f-p)/(x-p)*(C-S)+S,t=f=>{const p=this.$slider.getBoundingClientRect();let x=e(f,p.left,p.right,this._min,this._max);this._snapClampSetValue(x)},r=f=>{this._setDraggingStyle(!0),t(f.clientX),window.addEventListener("mousemove",a),window.addEventListener("mouseup",o)},a=f=>{t(f.clientX)},o=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("mousemove",a),window.removeEventListener("mouseup",o)};let s=!1,u,b;const y=f=>{f.preventDefault(),this._setDraggingStyle(!0),t(f.touches[0].clientX),s=!1},h=f=>{f.touches.length>1||(this._hasScrollBar?(u=f.touches[0].clientX,b=f.touches[0].clientY,s=!0):y(f),window.addEventListener("touchmove",c,{passive:!1}),window.addEventListener("touchend",l))},c=f=>{if(s){const p=f.touches[0].clientX-u,x=f.touches[0].clientY-b;Math.abs(p)>Math.abs(x)?y(f):(window.removeEventListener("touchmove",c),window.removeEventListener("touchend",l))}else f.preventDefault(),t(f.touches[0].clientX)},l=()=>{this._callOnFinishChange(),this._setDraggingStyle(!1),window.removeEventListener("touchmove",c),window.removeEventListener("touchend",l)},d=this._callOnFinishChange.bind(this),m=400;let w;const v=f=>{if(Math.abs(f.deltaX)<Math.abs(f.deltaY)&&this._hasScrollBar)return;f.preventDefault();const x=this._normalizeMouseWheel(f)*this._step;this._snapClampSetValue(this.getValue()+x),this.$input.value=this.getValue(),clearTimeout(w),w=setTimeout(d,m)};this.$slider.addEventListener("mousedown",r),this.$slider.addEventListener("touchstart",h,{passive:!1}),this.$slider.addEventListener("wheel",v,{passive:!1})}_setDraggingStyle(e,t="horizontal"){this.$slider&&this.$slider.classList.toggle("lil-active",e),document.body.classList.toggle("lil-dragging",e),document.body.classList.toggle(`lil-${t}`,e)}_getImplicitStep(){return this._hasMin&&this._hasMax?(this._max-this._min)/1e3:.1}_onUpdateMinMax(){!this._hasSlider&&this._hasMin&&this._hasMax&&(this._stepExplicit||this.step(this._getImplicitStep(),!1),this._initSlider(),this.updateDisplay())}_normalizeMouseWheel(e){let{deltaX:t,deltaY:r}=e;return Math.floor(e.deltaY)!==e.deltaY&&e.wheelDelta&&(t=0,r=-e.wheelDelta/120,r*=this._stepExplicit?1:10),t+-r}_arrowKeyMultiplier(e){let t=this._stepExplicit?1:10;return e.shiftKey?t*=10:e.altKey&&(t/=10),t}_snap(e){let t=0;return this._hasMin?t=this._min:this._hasMax&&(t=this._max),e-=t,e=Math.round(e/this._step)*this._step,e+=t,e=parseFloat(e.toPrecision(15)),e}_clamp(e){return e<this._min&&(e=this._min),e>this._max&&(e=this._max),e}_snapClampSetValue(e){this.setValue(this._clamp(this._snap(e)))}get _hasScrollBar(){const e=this.parent.root.$children;return e.scrollHeight>e.clientHeight}get _hasMin(){return this._min!==void 0}get _hasMax(){return this._max!==void 0}}class Ut extends q{constructor(e,t,r,a){super(e,t,r,"lil-option"),this.$select=document.createElement("select"),this.$select.setAttribute("aria-labelledby",this.$name.id),this.$display=document.createElement("div"),this.$display.classList.add("lil-display"),this.$select.addEventListener("change",()=>{this.setValue(this._values[this.$select.selectedIndex]),this._callOnFinishChange()}),this.$select.addEventListener("focus",()=>{this.$display.classList.add("lil-focus")}),this.$select.addEventListener("blur",()=>{this.$display.classList.remove("lil-focus")}),this.$widget.appendChild(this.$select),this.$widget.appendChild(this.$display),this.$disable=this.$select,this.options(a)}options(e){return this._values=Array.isArray(e)?e:Object.values(e),this._names=Array.isArray(e)?e:Object.keys(e),this.$select.replaceChildren(),this._names.forEach(t=>{const r=document.createElement("option");r.textContent=t,this.$select.appendChild(r)}),this.updateDisplay(),this}updateDisplay(){const e=this.getValue(),t=this._values.indexOf(e);return this.$select.selectedIndex=t,this.$display.textContent=t===-1?e:this._names[t],this}}class Pt extends q{constructor(e,t,r){super(e,t,r,"lil-string"),this.$input=document.createElement("input"),this.$input.setAttribute("type","text"),this.$input.setAttribute("spellcheck","false"),this.$input.setAttribute("aria-labelledby",this.$name.id),this.$input.addEventListener("input",()=>{this.setValue(this.$input.value)}),this.$input.addEventListener("keydown",a=>{a.code==="Enter"&&this.$input.blur()}),this.$input.addEventListener("blur",()=>{this._callOnFinishChange()}),this.$widget.appendChild(this.$input),this.$disable=this.$input,this.updateDisplay()}updateDisplay(){return this.$input.value=this.getValue(),this}}var Et=`.lil-gui {
  font-family: var(--font-family);
  font-size: var(--font-size);
  line-height: 1;
  font-weight: normal;
  font-style: normal;
  text-align: left;
  color: var(--text-color);
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  --background-color: #1f1f1f;
  --text-color: #ebebeb;
  --title-background-color: #111111;
  --title-text-color: #ebebeb;
  --widget-color: #424242;
  --hover-color: #4f4f4f;
  --focus-color: #595959;
  --number-color: #2cc9ff;
  --string-color: #a2db3c;
  --font-size: 11px;
  --input-font-size: 11px;
  --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif;
  --font-family-mono: Menlo, Monaco, Consolas, "Droid Sans Mono", monospace;
  --padding: 4px;
  --spacing: 4px;
  --widget-height: 20px;
  --title-height: calc(var(--widget-height) + var(--spacing) * 1.25);
  --name-width: 45%;
  --slider-knob-width: 2px;
  --slider-input-width: 27%;
  --color-input-width: 27%;
  --slider-input-min-width: 45px;
  --color-input-min-width: 45px;
  --folder-indent: 7px;
  --widget-padding: 0 0 0 3px;
  --widget-border-radius: 2px;
  --checkbox-size: calc(0.75 * var(--widget-height));
  --scrollbar-width: 5px;
}
.lil-gui, .lil-gui * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.lil-gui.lil-root {
  width: var(--width, 245px);
  display: flex;
  flex-direction: column;
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-title {
  background: var(--title-background-color);
  color: var(--title-text-color);
}
.lil-gui.lil-root > .lil-children {
  overflow-x: hidden;
  overflow-y: auto;
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar {
  width: var(--scrollbar-width);
  height: var(--scrollbar-width);
  background: var(--background-color);
}
.lil-gui.lil-root > .lil-children::-webkit-scrollbar-thumb {
  border-radius: var(--scrollbar-width);
  background: var(--focus-color);
}
@media (pointer: coarse) {
  .lil-gui.lil-allow-touch-styles, .lil-gui.lil-allow-touch-styles .lil-gui {
    --widget-height: 28px;
    --padding: 6px;
    --spacing: 6px;
    --font-size: 13px;
    --input-font-size: 16px;
    --folder-indent: 10px;
    --scrollbar-width: 7px;
    --slider-input-min-width: 50px;
    --color-input-min-width: 65px;
  }
}
.lil-gui.lil-force-touch-styles, .lil-gui.lil-force-touch-styles .lil-gui {
  --widget-height: 28px;
  --padding: 6px;
  --spacing: 6px;
  --font-size: 13px;
  --input-font-size: 16px;
  --folder-indent: 10px;
  --scrollbar-width: 7px;
  --slider-input-min-width: 50px;
  --color-input-min-width: 65px;
}
.lil-gui.lil-auto-place, .lil-gui.autoPlace {
  max-height: 100%;
  position: fixed;
  top: 0;
  right: 15px;
  z-index: 1001;
}

.lil-controller {
  display: flex;
  align-items: center;
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
}
.lil-controller.lil-disabled {
  opacity: 0.5;
}
.lil-controller.lil-disabled, .lil-controller.lil-disabled * {
  pointer-events: none !important;
}
.lil-controller > .lil-name {
  min-width: var(--name-width);
  flex-shrink: 0;
  white-space: pre;
  padding-right: var(--spacing);
  line-height: var(--widget-height);
}
.lil-controller .lil-widget {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  min-height: var(--widget-height);
}
.lil-controller.lil-string input {
  color: var(--string-color);
}
.lil-controller.lil-boolean {
  cursor: pointer;
}
.lil-controller.lil-color .lil-display {
  width: 100%;
  height: var(--widget-height);
  border-radius: var(--widget-border-radius);
  position: relative;
}
@media (hover: hover) {
  .lil-controller.lil-color .lil-display:hover:before {
    content: " ";
    display: block;
    position: absolute;
    border-radius: var(--widget-border-radius);
    border: 1px solid #fff9;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
}
.lil-controller.lil-color input[type=color] {
  opacity: 0;
  width: 100%;
  height: 100%;
  cursor: pointer;
}
.lil-controller.lil-color input[type=text] {
  margin-left: var(--spacing);
  font-family: var(--font-family-mono);
  min-width: var(--color-input-min-width);
  width: var(--color-input-width);
  flex-shrink: 0;
}
.lil-controller.lil-option select {
  opacity: 0;
  position: absolute;
  width: 100%;
  max-width: 100%;
}
.lil-controller.lil-option .lil-display {
  position: relative;
  pointer-events: none;
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  line-height: var(--widget-height);
  max-width: 100%;
  overflow: hidden;
  word-break: break-all;
  padding-left: 0.55em;
  padding-right: 1.75em;
  background: var(--widget-color);
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-display.lil-focus {
    background: var(--focus-color);
  }
}
.lil-controller.lil-option .lil-display.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-option .lil-display:after {
  font-family: "lil-gui";
  content: "↕";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  padding-right: 0.375em;
}
.lil-controller.lil-option .lil-widget,
.lil-controller.lil-option select {
  cursor: pointer;
}
@media (hover: hover) {
  .lil-controller.lil-option .lil-widget:hover .lil-display {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number input {
  color: var(--number-color);
}
.lil-controller.lil-number.lil-has-slider input {
  margin-left: var(--spacing);
  width: var(--slider-input-width);
  min-width: var(--slider-input-min-width);
  flex-shrink: 0;
}
.lil-controller.lil-number .lil-slider {
  width: 100%;
  height: var(--widget-height);
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
  padding-right: var(--slider-knob-width);
  overflow: hidden;
  cursor: ew-resize;
  touch-action: pan-y;
}
@media (hover: hover) {
  .lil-controller.lil-number .lil-slider:hover {
    background: var(--hover-color);
  }
}
.lil-controller.lil-number .lil-slider.lil-active {
  background: var(--focus-color);
}
.lil-controller.lil-number .lil-slider.lil-active .lil-fill {
  opacity: 0.95;
}
.lil-controller.lil-number .lil-fill {
  height: 100%;
  border-right: var(--slider-knob-width) solid var(--number-color);
  box-sizing: content-box;
}

.lil-dragging .lil-gui {
  --hover-color: var(--widget-color);
}
.lil-dragging * {
  cursor: ew-resize !important;
}
.lil-dragging.lil-vertical * {
  cursor: ns-resize !important;
}

.lil-gui .lil-title {
  height: var(--title-height);
  font-weight: 600;
  padding: 0 var(--padding);
  width: 100%;
  text-align: left;
  background: none;
  text-decoration-skip: objects;
}
.lil-gui .lil-title:before {
  font-family: "lil-gui";
  content: "▾";
  padding-right: 2px;
  display: inline-block;
}
.lil-gui .lil-title:active {
  background: var(--title-background-color);
  opacity: 0.75;
}
@media (hover: hover) {
  body:not(.lil-dragging) .lil-gui .lil-title:hover {
    background: var(--title-background-color);
    opacity: 0.85;
  }
  .lil-gui .lil-title:focus {
    text-decoration: underline var(--focus-color);
  }
}
.lil-gui.lil-root > .lil-title:focus {
  text-decoration: none !important;
}
.lil-gui.lil-closed > .lil-title:before {
  content: "▸";
}
.lil-gui.lil-closed > .lil-children {
  transform: translateY(-7px);
  opacity: 0;
}
.lil-gui.lil-closed:not(.lil-transition) > .lil-children {
  display: none;
}
.lil-gui.lil-transition > .lil-children {
  transition-duration: 300ms;
  transition-property: height, opacity, transform;
  transition-timing-function: cubic-bezier(0.2, 0.6, 0.35, 1);
  overflow: hidden;
  pointer-events: none;
}
.lil-gui .lil-children:empty:before {
  content: "Empty";
  padding: 0 var(--padding);
  margin: var(--spacing) 0;
  display: block;
  height: var(--widget-height);
  font-style: italic;
  line-height: var(--widget-height);
  opacity: 0.5;
}
.lil-gui.lil-root > .lil-children > .lil-gui > .lil-title {
  border: 0 solid var(--widget-color);
  border-width: 1px 0;
  transition: border-color 300ms;
}
.lil-gui.lil-root > .lil-children > .lil-gui.lil-closed > .lil-title {
  border-bottom-color: transparent;
}
.lil-gui + .lil-controller {
  border-top: 1px solid var(--widget-color);
  margin-top: 0;
  padding-top: var(--spacing);
}
.lil-gui .lil-gui .lil-gui > .lil-title {
  border: none;
}
.lil-gui .lil-gui .lil-gui > .lil-children {
  border: none;
  margin-left: var(--folder-indent);
  border-left: 2px solid var(--widget-color);
}
.lil-gui .lil-gui .lil-controller {
  border: none;
}

.lil-gui label, .lil-gui input, .lil-gui button {
  -webkit-tap-highlight-color: transparent;
}
.lil-gui input {
  border: 0;
  outline: none;
  font-family: var(--font-family);
  font-size: var(--input-font-size);
  border-radius: var(--widget-border-radius);
  height: var(--widget-height);
  background: var(--widget-color);
  color: var(--text-color);
  width: 100%;
}
@media (hover: hover) {
  .lil-gui input:hover {
    background: var(--hover-color);
  }
  .lil-gui input:active {
    background: var(--focus-color);
  }
}
.lil-gui input:disabled {
  opacity: 1;
}
.lil-gui input[type=text],
.lil-gui input[type=number] {
  padding: var(--widget-padding);
  -moz-appearance: textfield;
}
.lil-gui input[type=text]:focus,
.lil-gui input[type=number]:focus {
  background: var(--focus-color);
}
.lil-gui input[type=checkbox] {
  appearance: none;
  width: var(--checkbox-size);
  height: var(--checkbox-size);
  border-radius: var(--widget-border-radius);
  text-align: center;
  cursor: pointer;
}
.lil-gui input[type=checkbox]:checked:before {
  font-family: "lil-gui";
  content: "✓";
  font-size: var(--checkbox-size);
  line-height: var(--checkbox-size);
}
@media (hover: hover) {
  .lil-gui input[type=checkbox]:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui button {
  outline: none;
  cursor: pointer;
  font-family: var(--font-family);
  font-size: var(--font-size);
  color: var(--text-color);
  width: 100%;
  border: none;
}
.lil-gui .lil-controller button {
  height: var(--widget-height);
  text-transform: none;
  background: var(--widget-color);
  border-radius: var(--widget-border-radius);
}
@media (hover: hover) {
  .lil-gui .lil-controller button:hover {
    background: var(--hover-color);
  }
  .lil-gui .lil-controller button:focus {
    box-shadow: inset 0 0 0 1px var(--focus-color);
  }
}
.lil-gui .lil-controller button:active {
  background: var(--focus-color);
}

@font-face {
  font-family: "lil-gui";
  src: url("data:application/font-woff2;charset=utf-8;base64,d09GMgABAAAAAALkAAsAAAAABtQAAAKVAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHFQGYACDMgqBBIEbATYCJAMUCwwABCAFhAoHgQQbHAbIDiUFEYVARAAAYQTVWNmz9MxhEgodq49wYRUFKE8GWNiUBxI2LBRaVnc51U83Gmhs0Q7JXWMiz5eteLwrKwuxHO8VFxUX9UpZBs6pa5ABRwHA+t3UxUnH20EvVknRerzQgX6xC/GH6ZUvTcAjAv122dF28OTqCXrPuyaDER30YBA1xnkVutDDo4oCi71Ca7rrV9xS8dZHbPHefsuwIyCpmT7j+MnjAH5X3984UZoFFuJ0yiZ4XEJFxjagEBeqs+e1iyK8Xf/nOuwF+vVK0ur765+vf7txotUi0m3N0m/84RGSrBCNrh8Ee5GjODjF4gnWP+dJrH/Lk9k4oT6d+gr6g/wssA2j64JJGP6cmx554vUZnpZfn6ZfX2bMwPPrlANsB86/DiHjhl0OP+c87+gaJo/gY084s3HoYL/ZkWHTRfBXvvoHnnkHvngKun4KBE/ede7tvq3/vQOxDXB1/fdNz6XbPdcr0Vhpojj9dG+owuSKFsslCi1tgEjirjXdwMiov2EioadxmqTHUCIwo8NgQaeIasAi0fTYSPTbSmwbMOFduyh9wvBrESGY0MtgRjtgQR8Q1bRPohn2UoCRZf9wyYANMXFeJTysqAe0I4mrherOekFdKMrYvJjLvOIUM9SuwYB5DVZUwwVjJJOaUnZCmcEkIZZrKqNvRGRMvmFZsmhP4VMKCSXBhSqUBxgMS7h0cZvEd71AWkEhGWaeMFcNnpqyJkyXgYL7PQ1MoSq0wDAkRtJIijkZSmqYTiSImfLiSWXIZwhRh3Rug2X0kk1Dgj+Iu43u5p98ghopcpSo0Uyc8SnjlYX59WUeaMoDqmVD2TOWD9a4pCRAzf2ECgwGcrHjPOWY9bNxq/OL3I/QjwEAAAA=") format("woff2");
}`;function $t(i){const e=document.createElement("style");e.innerHTML=i;const t=document.querySelector("head link[rel=stylesheet], head style");t?document.head.insertBefore(e,t):document.head.appendChild(e)}let nt=!1;class Ge{constructor({parent:e,autoPlace:t=e===void 0,container:r,width:a,title:o="Controls",closeFolders:s=!1,injectStyles:u=!0,touchStyles:b=!0}={}){if(this.parent=e,this.root=e?e.root:this,this.children=[],this.controllers=[],this.folders=[],this._closed=!1,this._hidden=!1,this.domElement=document.createElement("div"),this.domElement.classList.add("lil-gui"),this.$title=document.createElement("button"),this.$title.classList.add("lil-title"),this.$title.setAttribute("aria-expanded",!0),this.$title.addEventListener("click",()=>this.openAnimated(this._closed)),this.$title.addEventListener("touchstart",()=>{},{passive:!0}),this.$children=document.createElement("div"),this.$children.classList.add("lil-children"),this.domElement.appendChild(this.$title),this.domElement.appendChild(this.$children),this.title(o),this.parent){this.parent.children.push(this),this.parent.folders.push(this),this.parent.$children.appendChild(this.domElement);return}this.domElement.classList.add("lil-root"),b&&this.domElement.classList.add("lil-allow-touch-styles"),!nt&&u&&($t(Et),nt=!0),r?r.appendChild(this.domElement):t&&(this.domElement.classList.add("lil-auto-place","autoPlace"),document.body.appendChild(this.domElement)),a&&this.domElement.style.setProperty("--width",a+"px"),this._closeFolders=s}add(e,t,r,a,o){if(Object(r)===r)return new Ut(this,e,t,r);const s=e[t];switch(typeof s){case"number":return new Ft(this,e,t,r,a,o);case"boolean":return new Ct(this,e,t);case"string":return new Pt(this,e,t);case"function":return new Oe(this,e,t)}console.error(`gui.add failed
	property:`,t,`
	object:`,e,`
	value:`,s)}addColor(e,t,r=1){return new Bt(this,e,t,r)}addFolder(e){const t=new Ge({parent:this,title:e});return this.root._closeFolders&&t.close(),t}load(e,t=!0){return e.controllers&&this.controllers.forEach(r=>{r instanceof Oe||r._name in e.controllers&&r.load(e.controllers[r._name])}),t&&e.folders&&this.folders.forEach(r=>{r._title in e.folders&&r.load(e.folders[r._title])}),this}save(e=!0){const t={controllers:{},folders:{}};return this.controllers.forEach(r=>{if(!(r instanceof Oe)){if(r._name in t.controllers)throw new Error(`Cannot save GUI with duplicate property "${r._name}"`);t.controllers[r._name]=r.save()}}),e&&this.folders.forEach(r=>{if(r._title in t.folders)throw new Error(`Cannot save GUI with duplicate folder "${r._title}"`);t.folders[r._title]=r.save()}),t}open(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),this.domElement.classList.toggle("lil-closed",this._closed),this}close(){return this.open(!1)}_setClosed(e){this._closed!==e&&(this._closed=e,this._callOnOpenClose(this))}show(e=!0){return this._hidden=!e,this.domElement.style.display=this._hidden?"none":"",this}hide(){return this.show(!1)}openAnimated(e=!0){return this._setClosed(!e),this.$title.setAttribute("aria-expanded",!this._closed),requestAnimationFrame(()=>{const t=this.$children.clientHeight;this.$children.style.height=t+"px",this.domElement.classList.add("lil-transition");const r=o=>{o.target===this.$children&&(this.$children.style.height="",this.domElement.classList.remove("lil-transition"),this.$children.removeEventListener("transitionend",r))};this.$children.addEventListener("transitionend",r);const a=e?this.$children.scrollHeight:0;this.domElement.classList.toggle("lil-closed",!e),requestAnimationFrame(()=>{this.$children.style.height=a+"px"})}),this}title(e){return this._title=e,this.$title.textContent=e,this}reset(e=!0){return(e?this.controllersRecursive():this.controllers).forEach(r=>r.reset()),this}onChange(e){return this._onChange=e,this}_callOnChange(e){this.parent&&this.parent._callOnChange(e),this._onChange!==void 0&&this._onChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onFinishChange(e){return this._onFinishChange=e,this}_callOnFinishChange(e){this.parent&&this.parent._callOnFinishChange(e),this._onFinishChange!==void 0&&this._onFinishChange.call(this,{object:e.object,property:e.property,value:e.getValue(),controller:e})}onOpenClose(e){return this._onOpenClose=e,this}_callOnOpenClose(e){this.parent&&this.parent._callOnOpenClose(e),this._onOpenClose!==void 0&&this._onOpenClose.call(this,e)}destroy(){this.parent&&(this.parent.children.splice(this.parent.children.indexOf(this),1),this.parent.folders.splice(this.parent.folders.indexOf(this),1)),this.domElement.parentElement&&this.domElement.parentElement.removeChild(this.domElement),Array.from(this.children).forEach(e=>e.destroy())}controllersRecursive(){let e=Array.from(this.controllers);return this.folders.forEach(t=>{e=e.concat(t.controllersRecursive())}),e}foldersRecursive(){let e=Array.from(this.folders);return this.folders.forEach(t=>{e=e.concat(t.foldersRecursive())}),e}}var ce=function(){var i=0,e=document.createElement("div");e.style.cssText="position:fixed;top:0;left:0;cursor:pointer;opacity:0.9;z-index:10000",e.addEventListener("click",function(h){h.preventDefault(),r(++i%e.children.length)},!1);function t(h){return e.appendChild(h.dom),h}function r(h){for(var c=0;c<e.children.length;c++)e.children[c].style.display=c===h?"block":"none";i=h}var a=(performance||Date).now(),o=a,s=0,u=t(new ce.Panel("FPS","#0ff","#002")),b=t(new ce.Panel("MS","#0f0","#020"));if(self.performance&&self.performance.memory)var y=t(new ce.Panel("MB","#f08","#201"));return r(0),{REVISION:16,dom:e,addPanel:t,showPanel:r,begin:function(){a=(performance||Date).now()},end:function(){s++;var h=(performance||Date).now();if(b.update(h-a,200),h>o+1e3&&(u.update(s*1e3/(h-o),100),o=h,s=0,y)){var c=performance.memory;y.update(c.usedJSHeapSize/1048576,c.jsHeapSizeLimit/1048576)}return h},update:function(){a=this.end()},domElement:e,setMode:r}};ce.Panel=function(i,e,t){var r=1/0,a=0,o=Math.round,s=o(window.devicePixelRatio||1),u=80*s,b=48*s,y=3*s,h=2*s,c=3*s,l=15*s,d=74*s,m=30*s,w=document.createElement("canvas");w.width=u,w.height=b,w.style.cssText="width:80px;height:48px";var v=w.getContext("2d");return v.font="bold "+9*s+"px Helvetica,Arial,sans-serif",v.textBaseline="top",v.fillStyle=t,v.fillRect(0,0,u,b),v.fillStyle=e,v.fillText(i,y,h),v.fillRect(c,l,d,m),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(c,l,d,m),{dom:w,update:function(f,p){r=Math.min(r,f),a=Math.max(a,f),v.fillStyle=t,v.globalAlpha=1,v.fillRect(0,0,u,l),v.fillStyle=e,v.fillText(o(f)+" "+i+" ("+o(r)+"-"+o(a)+")",y,h),v.drawImage(w,c+s,l,d-s,m,c,l,d-s,m),v.fillRect(c+d-s,l,s,m),v.fillStyle=t,v.globalAlpha=.9,v.fillRect(c+d-s,l,s,o((1-f/p)*m))}}};const ve=new ce;ve.showPanel(0);document.body.appendChild(ve.dom);function he(i){return function(){i|=0,i=i+1831565813|0;let e=Math.imul(i^i>>>15,1|i);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}function pe(i,e,t={}){const{replicationIterations:r=2,childrenPerSphere:a=4,keepProbability:o=.5,scaleMult:s=.55}=t,u=[...i];let b=0,y=u.length/4;for(let h=0;h<r;h++){const c=u.length;for(let l=0;l<y;l++){const d=(b+l)*4,m=u[d],w=u[d+1],v=u[d+2],f=u[d+3];for(let p=0;p<a;p++){if(e()>o)continue;const x=e()*2-1,S=e()*Math.PI*2,C=Math.sqrt(1-x*x),k=f*s;u.push(m+C*Math.cos(S)*f,w+C*Math.sin(S)*f,v+x*f,k)}}b=c/4,y=(u.length-c)/4}return new Float32Array(u)}function Tt(i,e,t,r,a){const o=[r[0]-t[0],r[1]-t[1],r[2]-t[2]],s=[a[0]-t[0],a[1]-t[1],a[2]-t[2]],u=[e[1]*s[2]-e[2]*s[1],e[2]*s[0]-e[0]*s[2],e[0]*s[1]-e[1]*s[0]],b=o[0]*u[0]+o[1]*u[1]+o[2]*u[2];if(b>-1e-5&&b<1e-5)return null;const y=1/b,h=[i[0]-t[0],i[1]-t[1],i[2]-t[2]],c=y*(h[0]*u[0]+h[1]*u[1]+h[2]*u[2]);if(c<0||c>1)return null;const l=[h[1]*o[2]-h[2]*o[1],h[2]*o[0]-h[0]*o[2],h[0]*o[1]-h[1]*o[0]],d=y*(e[0]*l[0]+e[1]*l[1]+e[2]*l[2]);if(d<0||c+d>1)return null;const m=y*(s[0]*l[0]+s[1]*l[1]+s[2]*l[2]);return m>1e-5?m:null}function Vt(i,e,t={}){const{resolution:r=15,seed:a=42}=t,o=he(a);let s=[1/0,1/0,1/0],u=[-1/0,-1/0,-1/0];for(let l=0;l<i.length;l+=3)for(let d=0;d<3;d++)s[d]=Math.min(s[d],i[l+d]),u[d]=Math.max(u[d],i[l+d]);const b=[u[0]-s[0],u[1]-s[1],u[2]-s[2]],h=Math.max(...b)/r,c=[];for(let l=s[0]+h/2;l<=u[0];l+=h)for(let d=s[1]+h/2;d<=u[1];d+=h)for(let m=s[2]+h/2;m<=u[2];m+=h){let w=0;const v=[l,d,m],f=[1,.432,.123];for(let p=0;p<e.length;p+=3){const x=[i[e[p]*3],i[e[p]*3+1],i[e[p]*3+2]],S=[i[e[p+1]*3],i[e[p+1]*3+1],i[e[p+1]*3+2]],C=[i[e[p+2]*3],i[e[p+2]*3+1],i[e[p+2]*3+2]];Tt(v,f,x,S,C)!==null&&w++}if(w%2===1){const p=t.radiusVariation||.4,x=1-p/2+o()*p;c.push(l+(o()-.5)*h*.3,d+(o()-.5)*h*.3,m+(o()-.5)*h*.3,h*.75*x)}}return pe(c,o,t)}function Ot(i){const e=[],t=[],r=i.split(`
`);for(let a of r){const o=a.trim().split(/\s+/);if(o[0]==="v")e.push(parseFloat(o[1]),parseFloat(o[2]),parseFloat(o[3]));else if(o[0]==="f"){const s=parseInt(o[1].split("/")[0])-1,u=parseInt(o[2].split("/")[0])-1,b=parseInt(o[3].split("/")[0])-1;t.push(s,u,b)}}return{vertices:new Float32Array(e),indices:new Uint32Array(t)}}function ze(i,e,t,r,a){const o=(t-i)*.5,s=(r-e)*.5,u=a*a,b=u*a;return(2*e-2*t+o+s)*b+(-3*e+3*t-2*o-s)*u+o*a+e}function zt(i={}){const{curveType:e="S-Curve",numPoints:t=20,thickness:r=.2,backboneNoise:a=.1,seed:o=42,radiusVariation:s=.5}=i,u=he(o),b=[];let y=[];if(e==="S-Curve")y=[[-.8,0,0],[-.4,.2,.3],[0,-.1,-.2],[.4,.3,.4],[.8,0,0]];else if(e==="Spiral")for(let d=0;d<12;d++){const m=d/11,w=m*Math.PI*2*2.5,v=m*.8;y.push([Math.cos(w)*v,(u()-.5)*.1,Math.sin(w)*v])}else if(e==="Circle"){for(let c=0;c<8;c++){const l=c/8*Math.PI*2;y.push([Math.cos(l)*.7,0,Math.sin(l)*.7])}y.push(y[0],y[1],y[2])}const h=c=>{const l=y.length-1,d=Math.floor(c*l),m=c*l-d,w=y[Math.min(d,l)],v=y[Math.min(d+1,l)],f=y[Math.max(d-1,0)],p=y[Math.min(d+2,l)];return[ze(f[0],w[0],v[0],p[0],m),ze(f[1],w[1],v[1],p[1],m),ze(f[2],w[2],v[2],p[2],m)]};for(let c=0;c<t;c++){const l=c/(t-1),d=h(l),m=d[0]+(u()-.5)*a,w=d[1]+(u()-.5)*a,v=d[2]+(u()-.5)*a,f=Math.sin(l*Math.PI),p=r*(.6+.4*f)*(1+(u()-.5)*s);b.push(m,w,v,p)}return pe(b,u,i)}function Ie(i={}){const{species:e="Mediocris",gridX:t=4,gridY:r=4,gridZ:a=4,pointSeparation:o=.25,flattenBottom:s=-.3,windShear:u=0,seed:b=42,radiusVariation:y=.5,replicationIterations:h=2,childrenPerSphere:c=4,keepProbability:l=.5,scaleMult:d=.55}=i,m=he(b),w=[];let v=t,f=r,p=a;e==="Humilis"&&(f=Math.max(1,Math.floor(f*.5))),e==="Congestus"&&(f=Math.ceil(f*2),v=Math.max(1,Math.floor(v*.7)),p=Math.max(1,Math.floor(p*.7))),e==="Fractus"&&(f=Math.max(1,Math.floor(f*.6)));const x=(v-1)*o/2,S=(f-1)*o/2,C=(p-1)*o/2;for(let k=0;k<v;k++)for(let V=0;V<f;V++)for(let O=0;O<p;O++){if(e==="Fractus"&&m()>.4)continue;let L=k*o-x+(m()*2-1)*o*.8,F=V*o-S+(m()*2-1)*o*.8,P=O*o-C+(m()*2-1)*o*.8;const G=(F+S)/(f*o);L+=G*u,F<s&&(F=s);const N=y||.5,D=o*(1.1+(m()-.5)*N);w.push(L,F,P,D)}return pe(w,m,{replicationIterations:h,childrenPerSphere:c,keepProbability:l,scaleMult:d})}function It(i={}){const{seed:e=42,replicationIterations:t=1,childrenPerSphere:r=3,keepProbability:a=.5,scaleMult:o=.5}=i,s=he(e),u=[],b=.7,y=.5,h=.6,c=.2;for(let l=-b;l<=b;l+=c)for(let d=-y;d<=y;d+=c)for(let m=-h;m<=h;m+=c){const w=(l/b)**2+(d/y)**2+(m/h)**2;if(w>1)continue;const f=.08+(1-Math.sqrt(w))*.12+s()*.04;u.push(l+(s()*2-1)*.03,d+(s()*2-1)*.03,m+(s()*2-1)*.03,f)}return pe(u,s,{replicationIterations:t,childrenPerSphere:r,keepProbability:a,scaleMult:o})}function Lt(i={}){const{seed:e=42,skyboxWidth:t=4,skyboxDepth:r=4,skyboxHeight:a=.8,skyboxDensity:o=.5,skyboxCloudSize:s=.15,skyboxSizeVariation:u=.5,replicationIterations:b=1,childrenPerSphere:y=3,keepProbability:h=.5,scaleMult:c=.5}=i,l=he(e),d=[],m=s*3,w=Math.ceil(t/m),v=Math.ceil(r/m);for(let f=0;f<w;f++)for(let p=0;p<v;p++){if(l()>o)continue;const x=(f/w-.5)*t+(l()-.5)*m*.8,S=(p/v-.5)*r+(l()-.5)*m*.8,C=(l()-.5)*a*.5,k=1+Math.floor(l()*4),V=.7+l()*u;for(let O=0;O<k;O++){const L=(l()-.5)*s*2,F=(l()-.5)*s*1.5,P=(l()-.5)*s*2,G=s*V*(.5+l()*.5);d.push(x+L,C+F,S+P,G)}}return pe(d,l,{replicationIterations:b,childrenPerSphere:y,keepProbability:h,scaleMult:c})}function rt(i,e=.15){let t=1/0,r=1/0,a=1/0,o=-1/0,s=-1/0,u=-1/0;for(let b=0;b<i.length;b+=4){const y=i[b],h=i[b+1],c=i[b+2],l=i[b+3];t=Math.min(t,y-l),r=Math.min(r,h-l),a=Math.min(a,c-l),o=Math.max(o,y+l),s=Math.max(s,h+l),u=Math.max(u,c+l)}return{min:[t-e,r-e,a-e],max:[o+e,s+e,u+e]}}function ot(i){const[e,t,r]=i.min,[a,o,s]=i.max;return new Float32Array([e,t,s,1,a,t,s,1,a,o,s,1,e,o,s,1,e,t,r,1,a,t,r,1,a,o,r,1,e,o,r,1])}const Gt=`
struct Uniforms {
  modelViewProjectionMatrix : mat4x4<f32>,
  color : vec4<f32>,
};

@binding(0) @group(0) var<uniform> uniforms : Uniforms;

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
};

@vertex
fn vs_main(@location(0) position: vec4<f32>) -> VertexOutput {
  var output: VertexOutput;
  output.Position = uniforms.modelViewProjectionMatrix * position;
  return output;
}

@fragment
fn fs_main() -> @location(0) vec4<f32> {
  return uniforms.color;
}
`,Rt=`
struct NoiseUniforms {
  resolution : u32,
  octaves : u32,
  _pad1 : u32,
  _pad2 : u32,
};

@binding(0) @group(0) var<uniform> noiseUniforms : NoiseUniforms;
@binding(1) @group(0) var noiseTextureWrite : texture_storage_3d<rgba16float, write>;

// Noise functions for baking
fn hash33_noise(p : vec3<f32>) -> vec3<f32> {
  var q = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123) * 2.0 - 1.0;
}

fn noise3D_bake(p : vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(dot(hash33_noise(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
          dot(hash33_noise(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
      mix(dot(hash33_noise(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
          dot(hash33_noise(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(
      mix(dot(hash33_noise(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
          dot(hash33_noise(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
      mix(dot(hash33_noise(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
          dot(hash33_noise(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}

fn fbm3D_noise(p : vec3<f32>, octaves : i32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  for (var i = 0; i < octaves; i++) {
    value += amplitude * noise3D_bake(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

@compute @workgroup_size(4, 4, 4)
fn bakeNoise3D(@builtin(global_invocation_id) id : vec3<u32>) {
  let res = noiseUniforms.resolution;

  if (id.x >= res || id.y >= res || id.z >= res) {
    return;
  }

  // Normalize to [0, 1] then scale to create tileable noise
  // Using a scale that tiles well (e.g., 4.0 means 4 periods across the texture)
  let uvw = vec3<f32>(id) / f32(res);
  let noiseCoord = uvw * 8.0;  // 8 periods for good detail

  // Compute different noise values for different uses
  // .r = billowy noise (4 octaves)
  // .g = wispy noise (3 octaves)
  // .b = warp noise X
  // .a = warp noise Y (we'll compute Z from a different sample)
  let billowy = fbm3D_noise(noiseCoord, 4);
  let wispy = fbm3D_noise(noiseCoord + vec3(100.0, 0.0, 0.0), 3);
  let warpX = fbm3D_noise(noiseCoord + vec3(0.0, 100.0, 0.0), 3);
  let warpY = fbm3D_noise(noiseCoord + vec3(0.0, 0.0, 100.0), 3);

  textureStore(noiseTextureWrite, id, vec4(billowy, wispy, warpX, warpY));
}
`,Nt=`
struct BakeUniforms {
  boxMin : vec3<f32>,         // 0-11
  sphereCount : u32,          // 12-15
  boxMax : vec3<f32>,         // 16-27
  smoothness : f32,           // 28-31
  resolution : u32,           // 32-35
  bakeNoise : u32,            // 36-39 (0 = no noise, 1 = bake noise)
  billowyScale : f32,         // 40-43
  billowyStrength : f32,      // 44-47
  wispyScale : f32,           // 48-51
  wispyStrength : f32,        // 52-55
  coverage : f32,             // 56-59
  gradientStrength : f32,     // 60-63
  gradientBottom : f32,       // 64-67
  gradientTop : f32,          // 68-71
  warpStrength : f32,         // 72-75
  flipZ : f32,                // 76-79
  zPadding : f32,             // 80-83
  _pad1 : f32,                // 84-87
  _pad2 : f32,                // 88-91
  _pad3 : f32,                // 92-95 (total: 96 bytes)
};

@binding(0) @group(0) var<uniform> bakeUniforms : BakeUniforms;
@binding(1) @group(0) var<storage, read> spheres : array<vec4<f32>>;
@binding(2) @group(0) var sdfTextureWrite : texture_storage_3d<rgba16float, write>;

fn sphereSDF(p : vec3<f32>, center : vec3<f32>, radius : f32) -> f32 {
  return length(p - center) - radius;
}

fn smin(a : f32, b : f32, k : f32) -> f32 {
  let h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// Noise functions for baking
fn hash33(p : vec3<f32>) -> vec3<f32> {
  var q = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123) * 2.0 - 1.0;
}

fn noise3D(p : vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(dot(hash33(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
          dot(hash33(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
      mix(dot(hash33(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
          dot(hash33(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(
      mix(dot(hash33(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
          dot(hash33(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
      mix(dot(hash33(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
          dot(hash33(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}

fn fbm3D_bake(p : vec3<f32>, octaves : i32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  for (var i = 0; i < octaves; i++) {
    value += amplitude * noise3D(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

@compute @workgroup_size(4, 4, 4)
fn bakeSDF(@builtin(global_invocation_id) id : vec3<u32>) {
  let res = bakeUniforms.resolution;

  // Skip if outside texture bounds
  if (id.x >= res || id.y >= res || id.z >= res) {
    return;
  }

  // Convert voxel coordinate to world position
  let uvw = (vec3<f32>(id) + 0.5) / f32(res);
  let worldPos = mix(bakeUniforms.boxMin, bakeUniforms.boxMax, uvw);

  // Compute SDF: smooth union of all spheres
  var d = 1e10;
  let k = bakeUniforms.smoothness;

  for (var i = 0u; i < bakeUniforms.sphereCount; i++) {
    let s = spheres[i];
    let sd = sphereSDF(worldPos, s.xyz, s.w);
    if (k > 0.0) {
      d = smin(d, sd, k);
    } else {
      d = min(d, sd);
    }
  }

  // Optionally bake noise into the SDF
  if (bakeUniforms.bakeNoise > 0u) {
    let p = worldPos;

    // Domain warping
    var warpPos = p;
    let warpStr = bakeUniforms.warpStrength;
    if (warpStr > 0.0) {
      let warpX = fbm3D_bake(p * 1.5, 3);
      let warpY = fbm3D_bake(p * 1.5 + vec3(100.0, 0.0, 0.0), 3);
      let warpZ = fbm3D_bake(p * 1.5 + vec3(0.0, 100.0, 0.0), 3);
      warpPos += vec3(warpX, warpY, warpZ) * warpStr;
    }

    // Density gradient
    let gStrength = bakeUniforms.gradientStrength;
    if (gStrength > 0.0) {
      var heightFrac = smoothstep(bakeUniforms.gradientBottom, bakeUniforms.gradientTop, p.y);
      if (bakeUniforms.flipZ > 0.5) {
        heightFrac = 1.0 - heightFrac;
      }
      d += heightFrac * gStrength;
    }

    // Billowy noise
    let billowyStr = bakeUniforms.billowyStrength;
    if (billowyStr > 0.0) {
      let bn = fbm3D_bake(warpPos * bakeUniforms.billowyScale, 4);
      d += bn * billowyStr;
    }

    // Wispy noise
    let wispyStr = bakeUniforms.wispyStrength;
    if (wispyStr > 0.0) {
      let wn = fbm3D_bake(warpPos * bakeUniforms.wispyScale, 3);
      d += wn * wispyStr;
    }

    // Coverage
    d -= bakeUniforms.coverage;

    // Z-padding
    let zPad = bakeUniforms.zPadding;
    if (zPad > 0.0) {
      let bMin = bakeUniforms.boxMin.y;
      let bMax = bakeUniforms.boxMax.y;
      let clipBottom = smoothstep(bMin, bMin + zPad, p.y);
      let clipTop = smoothstep(bMax, bMax - zPad, p.y);
      let clipMask = clipBottom * clipTop;
      d += (1.0 - clipMask) * 0.5;
    }
  }

  // Write SDF value to texture (store in .r channel)
  textureStore(sdfTextureWrite, id, vec4(d, 0.0, 0.0, 1.0));
}
`,Ht=`
struct AOBakeUniforms {
  boxMin : vec3<f32>,         // 0-11
  aoSamples : u32,            // 12-15
  boxMax : vec3<f32>,         // 16-27
  aoConeAngle : f32,          // 28-31 (in degrees)
  resolution : u32,           // 32-35
  aoRadius : f32,             // 36-39
  aoSteps : u32,              // 40-43
  _pad : u32,                 // 44-47 (total: 48 bytes)
};

@binding(0) @group(0) var<uniform> aoUniforms : AOBakeUniforms;
@binding(1) @group(0) var sdfTexture : texture_3d<f32>;
@binding(2) @group(0) var sdfSampler : sampler;
@binding(3) @group(0) var aoTextureWrite : texture_storage_3d<rgba16float, write>;

// Sample SDF texture
fn sampleSDF(p : vec3<f32>) -> f32 {
  let uvw = (p - aoUniforms.boxMin) / (aoUniforms.boxMax - aoUniforms.boxMin);
  return textureSampleLevel(sdfTexture, sdfSampler, uvw, 0.0).r;
}

// Convert SDF to density
fn sampleDensity(p : vec3<f32>) -> f32 {
  let dist = sampleSDF(p);
  return smoothstep(0.1, -0.1, dist);
}

// Fibonacci sphere distribution for stratified sampling (full sphere)
fn fibonacciSphere(index : u32, total : u32) -> vec3<f32> {
  let goldenAngle = 2.399963229728653;  // pi * (3 - sqrt(5))
  let i = f32(index);
  let n = f32(total);

  // Handle edge case of single sample
  if (n <= 1.0) {
    return vec3(0.0, 1.0, 0.0);  // Point straight up
  }

  // y goes from 1 to -1 (full sphere)
  let y = 1.0 - (i / (n - 1.0)) * 2.0;
  let radiusAtY = sqrt(max(0.0, 1.0 - y * y));
  let theta = goldenAngle * i;

  return vec3(cos(theta) * radiusAtY, y, sin(theta) * radiusAtY);
}

// Fibonacci hemisphere distribution (upper hemisphere only, for directional AO)
fn fibonacciHemisphere(index : u32, total : u32, coneAngleDeg : f32) -> vec3<f32> {
  let goldenAngle = 2.399963229728653;
  let i = f32(index);
  let n = f32(total);

  if (n <= 1.0) {
    return vec3(0.0, 1.0, 0.0);
  }

  // Convert cone angle to cosine (90° = hemisphere, smaller = narrower cone)
  let maxCosTheta = cos(coneAngleDeg * 3.14159265 / 180.0);

  // Distribute y from 1 (up) to maxCosTheta (edge of cone)
  // Using stratified distribution for better coverage
  let y = 1.0 - i / n * (1.0 - maxCosTheta);
  let radiusAtY = sqrt(max(0.0, 1.0 - y * y));
  let theta = goldenAngle * i;

  return vec3(cos(theta) * radiusAtY, y, sin(theta) * radiusAtY);
}

@compute @workgroup_size(4, 4, 4)
fn bakeAO(@builtin(global_invocation_id) id : vec3<u32>) {
  let res = aoUniforms.resolution;

  if (id.x >= res || id.y >= res || id.z >= res) {
    return;
  }

  // Convert voxel coordinate to world position
  let uvw = (vec3<f32>(id) + 0.5) / f32(res);
  let worldPos = mix(aoUniforms.boxMin, aoUniforms.boxMax, uvw);

  // Sample density at this point
  let centerDensity = sampleDensity(worldPos);

  // If outside cloud, AO = 1.0 (fully visible)
  if (centerDensity < 0.001) {
    textureStore(aoTextureWrite, id, vec4(1.0, 0.0, 0.0, 1.0));
    return;
  }

  let numSamples = aoUniforms.aoSamples;
  let numSteps = aoUniforms.aoSteps;
  let maxDist = aoUniforms.aoRadius;
  let coneAngle = aoUniforms.aoConeAngle;
  let stepSize = maxDist / f32(numSteps);

  // Absorption coefficient - controls how quickly density blocks light
  let absorptionCoeff = 8.0;

  var totalVisibility = 0.0;

  for (var s = 0u; s < numSamples; s++) {
    // Get stratified direction from hemisphere/cone
    // coneAngle = 90 means full hemisphere, smaller = narrower cone around up
    let rayDir = fibonacciHemisphere(s, numSamples, coneAngle);

    // March along ray and accumulate optical depth (density * distance)
    var opticalDepth = 0.0;
    for (var step = 1u; step <= numSteps; step++) {
      let t = f32(step) * stepSize;
      let samplePos = worldPos + rayDir * t;

      // Check bounds - if outside volume, stop marching
      let sampleUvw = (samplePos - aoUniforms.boxMin) / (aoUniforms.boxMax - aoUniforms.boxMin);
      if (any(sampleUvw < vec3(0.0)) || any(sampleUvw > vec3(1.0))) {
        break;
      }

      opticalDepth += sampleDensity(samplePos) * stepSize;
    }

    // Beer-Lambert law: transmittance = exp(-absorption * optical_depth)
    let visibility = exp(-opticalDepth * absorptionCoeff);
    totalVisibility += visibility;
  }

  // Average visibility across all sample directions
  let ao = totalVisibility / f32(numSamples);

  textureStore(aoTextureWrite, id, vec4(ao, 0.0, 0.0, 1.0));
}
`,Yt=`
struct VolumeUniforms {
  viewProjection : mat4x4<f32>,
  inverseViewProjection : mat4x4<f32>,
  cameraPosition : vec3<f32>,
  sphereCount : u32,
  smoothness : f32,
  gradientBottom : f32,
  gradientTop : f32,
  gradientStrength : f32,
  boxMin : vec3<f32>,
  billowyScale : f32,
  boxMax : vec3<f32>,
  billowyStrength : f32,
  wispyScale : f32,
  wispyStrength : f32,
  coverage : f32,
  zPadding : f32,
  flipZ : f32,
  absorption : f32,
  renderSteps : f32,
  lightSteps : f32,
  renderMode : f32,
  anisotropy1 : f32,
  anisotropy2 : f32,
  phaseBlend : f32,
  lightDir : vec3<f32>,
  ambient : f32,
  cloudColor : vec3<f32>,
  time : f32,
  timeScale : f32,
  warpStrength : f32,
  sdfMode : f32,     // 0.0 = dynamic (loop spheres), 1.0 = baked (sample texture)
  noiseBaked : f32,  // 0.0 = compute noise live, 1.0 = noise is baked in texture
  normalEpsilon : f32,
  aoStrength : f32,
  aoRemap : f32,
  aoEnabled : f32,
};

@binding(0) @group(0) var<uniform> volumeUniforms : VolumeUniforms;
@binding(1) @group(0) var<storage, read> spheres : array<vec4<f32>>;
@binding(2) @group(0) var sdfTexture : texture_3d<f32>;
@binding(3) @group(0) var sdfSampler : sampler;
@binding(4) @group(0) var noiseTexture : texture_3d<f32>;
@binding(5) @group(0) var noiseSampler : sampler;
@binding(6) @group(0) var aoTexture : texture_3d<f32>;
@binding(7) @group(0) var aoSampler : sampler;

// Helper: sample baked SDF texture
// Uses textureSampleLevel (explicit LOD) instead of textureSample to allow non-uniform control flow
fn sampleBakedSDF(p : vec3<f32>) -> f32 {
  let uvw = (p - volumeUniforms.boxMin) / (volumeUniforms.boxMax - volumeUniforms.boxMin);
  return textureSampleLevel(sdfTexture, sdfSampler, uvw, 0.0).r;
}

// Helper: sample baked AO texture
fn sampleAO(p : vec3<f32>) -> f32 {
  let uvw = (p - volumeUniforms.boxMin) / (volumeUniforms.boxMax - volumeUniforms.boxMin);
  return textureSampleLevel(aoTexture, aoSampler, uvw, 0.0).r;
}

// Helper: sample pre-computed noise texture with animation
// The noise texture tiles seamlessly, so we can animate by offsetting coordinates
// Returns vec4: .r = billowy, .g = wispy, .b = warpX, .a = warpY
fn sampleNoise3D(p : vec3<f32>, scale : f32, timeOffset : vec3<f32>) -> vec4<f32> {
  // Scale position and add time-based offset for animation
  // The noise texture has 8 periods baked in, so we divide by 8 to get proper tiling
  let uvw = fract((p * scale + timeOffset) / 8.0);
  return textureSampleLevel(noiseTexture, noiseSampler, uvw, 0.0);
}

// Fast billowy noise using pre-computed texture
fn billowyNoiseFast(p : vec3<f32>, t : f32) -> f32 {
  let noiseVal = sampleNoise3D(p, volumeUniforms.billowyScale, vec3(0.0, -t * 0.5, 0.0));
  return noiseVal.r;
}

// Fast wispy noise using pre-computed texture
fn wispyNoiseFast(p : vec3<f32>, t : f32) -> f32 {
  let noiseVal = sampleNoise3D(p, volumeUniforms.wispyScale, vec3(t, t * 0.2, 0.0));
  return noiseVal.g;
}

// Fast domain warp using pre-computed texture
fn domainWarpFast(p : vec3<f32>, t : f32) -> vec3<f32> {
  let noiseVal = sampleNoise3D(p, 1.5, vec3(t, 0.0, 0.0));
  // Sample Z warp from a different location
  let noiseValZ = sampleNoise3D(p + vec3(50.0, 0.0, 0.0), 1.5, vec3(0.0, 0.0, t));
  return vec3(noiseVal.b, noiseVal.a, noiseValZ.b);
}

struct VertexOutput {
  @builtin(position) Position : vec4<f32>,
  @location(0) worldPos : vec3<f32>,
};

@vertex
fn vs_volume(@location(0) position: vec4<f32>) -> VertexOutput {
  var output : VertexOutput;
  output.Position = volumeUniforms.viewProjection * position;
  output.worldPos = position.xyz;
  return output;
}

fn intersectAABB(origin : vec3<f32>, dir : vec3<f32>, boxMin : vec3<f32>, boxMax : vec3<f32>) -> vec2<f32> {
  let invDir = 1.0 / dir;
  let t1 = (boxMin - origin) * invDir;
  let t2 = (boxMax - origin) * invDir;
  let tMin = min(t1, t2);
  let tMax = max(t1, t2);
  let tNear = max(max(tMin.x, tMin.y), tMin.z);
  let tFar = min(min(tMax.x, tMax.y), tMax.z);
  return vec2(tNear, tFar);
}

fn sphereSDF(p : vec3<f32>, center : vec3<f32>, radius : f32) -> f32 {
  return length(p - center) - radius;
}

fn smin(a : f32, b : f32, k : f32) -> f32 {
  let h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - h * h * k * 0.25;
}

// --- 3D Simplex-like noise (hash-based gradient noise) ---
fn hash33(p : vec3<f32>) -> vec3<f32> {
  var q = vec3(
    dot(p, vec3(127.1, 311.7, 74.7)),
    dot(p, vec3(269.5, 183.3, 246.1)),
    dot(p, vec3(113.5, 271.9, 124.6)),
  );
  return fract(sin(q) * 43758.5453123) * 2.0 - 1.0;
}

fn noise3D(p : vec3<f32>) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let u = f * f * (3.0 - 2.0 * f);

  return mix(
    mix(
      mix(dot(hash33(i + vec3(0.0, 0.0, 0.0)), f - vec3(0.0, 0.0, 0.0)),
          dot(hash33(i + vec3(1.0, 0.0, 0.0)), f - vec3(1.0, 0.0, 0.0)), u.x),
      mix(dot(hash33(i + vec3(0.0, 1.0, 0.0)), f - vec3(0.0, 1.0, 0.0)),
          dot(hash33(i + vec3(1.0, 1.0, 0.0)), f - vec3(1.0, 1.0, 0.0)), u.x), u.y),
    mix(
      mix(dot(hash33(i + vec3(0.0, 0.0, 1.0)), f - vec3(0.0, 0.0, 1.0)),
          dot(hash33(i + vec3(1.0, 0.0, 1.0)), f - vec3(1.0, 0.0, 1.0)), u.x),
      mix(dot(hash33(i + vec3(0.0, 1.0, 1.0)), f - vec3(0.0, 1.0, 1.0)),
          dot(hash33(i + vec3(1.0, 1.0, 1.0)), f - vec3(1.0, 1.0, 1.0)), u.x), u.y),
    u.z);
}

fn fbm3D(p : vec3<f32>, octaves : i32) -> f32 {
  var value = 0.0;
  var amplitude = 0.5;
  var frequency = 1.0;
  for (var i = 0; i < octaves; i++) {
    value += amplitude * noise3D(p * frequency);
    frequency *= 2.0;
    amplitude *= 0.5;
  }
  return value;
}

fn cloudSDF(p : vec3<f32>) -> f32 {
  var d : f32;

  // Choose between baked texture or dynamic sphere loop
  if (volumeUniforms.sdfMode > 0.5) {
    // Baked mode: sample pre-computed SDF from 3D texture (O(1))
    d = sampleBakedSDF(p);

    // If noise is baked, skip all noise computation - just return the sampled value
    if (volumeUniforms.noiseBaked > 0.5) {
      return d;
    }
  } else {
    // Dynamic mode: loop through all spheres (O(n))
    let k = volumeUniforms.smoothness;
    d = 1e10;
    for (var i = 0u; i < volumeUniforms.sphereCount; i++) {
      let s = spheres[i];
      let sd = sphereSDF(p, s.xyz, s.w);
      if (k > 0.0) {
        d = smin(d, sd, k);
      } else {
        d = min(d, sd);
      }
    }
  }

  // === Noise computation using fast texture lookups ===
  let t = volumeUniforms.time * volumeUniforms.timeScale;

  // Domain Warping using pre-computed noise texture (FAST!)
  var warpPos = p;
  let warpStr = volumeUniforms.warpStrength;
  if (warpStr > 0.0) {
    let warp = domainWarpFast(p, t);
    warpPos += warp * warpStr;
  }

  // Density gradient: erode the SDF based on height (no noise, just math)
  let gStrength = volumeUniforms.gradientStrength;
  if (gStrength > 0.0) {
    var heightFrac = smoothstep(volumeUniforms.gradientBottom, volumeUniforms.gradientTop, p.y);
    // FlipZ: erode bottom instead of top
    if (volumeUniforms.flipZ > 0.5) {
      heightFrac = 1.0 - heightFrac;
    }
    d += heightFrac * gStrength;
  }

  // Billowy noise using pre-computed noise texture (FAST!)
  let billowyStr = volumeUniforms.billowyStrength;
  if (billowyStr > 0.0) {
    let bn = billowyNoiseFast(warpPos, t);
    d += bn * billowyStr;
  }

  // Wispy noise using pre-computed noise texture (FAST!)
  let wispyStr = volumeUniforms.wispyStrength;
  if (wispyStr > 0.0) {
    let wn = wispyNoiseFast(warpPos, t);
    d += wn * wispyStr;
  }

  // Coverage: shift the entire SDF inward (negative = puffier)
  d -= volumeUniforms.coverage;

  // Z-padding: clip cloud at top/bottom by pushing SDF outward near bounds
  let zPad = volumeUniforms.zPadding;
  if (zPad > 0.0) {
    let bMin = volumeUniforms.boxMin.y;
    let bMax = volumeUniforms.boxMax.y;
    let clipBottom = smoothstep(bMin, bMin + zPad, p.y);
    let clipTop = smoothstep(bMax, bMax - zPad, p.y);
    let clipMask = clipBottom * clipTop;
    d += (1.0 - clipMask) * 0.5;
  }

  return d;
}

fn sampleDensity(p : vec3<f32>) -> f32 {
  let dist = cloudSDF(p);
  return smoothstep(0.1, -0.1, dist);
}

fn calcNormal(p : vec3<f32>) -> vec3<f32> {
  let e = volumeUniforms.normalEpsilon;
  let n = vec3(
    cloudSDF(p + vec3(e, 0.0, 0.0)) - cloudSDF(p - vec3(e, 0.0, 0.0)),
    cloudSDF(p + vec3(0.0, e, 0.0)) - cloudSDF(p - vec3(0.0, e, 0.0)),
    cloudSDF(p + vec3(0.0, 0.0, e)) - cloudSDF(p - vec3(0.0, 0.0, e)),
  );
  return normalize(n);
}

fn henyeyGreenstein(cosTheta : f32, g : f32) -> f32 {
  let g2 = g * g;
  let denom = 1.0 + g2 - 2.0 * g * cosTheta;
  return (1.0 - g2) / (4.0 * 3.14159265 * pow(denom, 1.5));
}

fn dualPhase(cosTheta : f32) -> f32 {
  let hg1 = henyeyGreenstein(cosTheta, volumeUniforms.anisotropy1);
  let hg2 = henyeyGreenstein(cosTheta, volumeUniforms.anisotropy2);
  return mix(hg1, hg2, volumeUniforms.phaseBlend);
}

fn lightMarch(pos : vec3<f32>, lightDir : vec3<f32>, absorption : f32) -> f32 {
  // March toward the light to estimate how much cloud is in the way
  let numSteps = i32(volumeUniforms.lightSteps);
  let stepSize = 0.12;
  var totalDensity = 0.0;
  for (var i = 1; i <= numSteps; i++) {
    let samplePos = pos + lightDir * f32(i) * stepSize;
    totalDensity += sampleDensity(samplePos);
  }
  // Beer's Law: how much light reaches this point
  return exp(-totalDensity * stepSize * absorption);
}

@fragment
fn fs_volume(@location(0) worldPos : vec3<f32>) -> @location(0) vec4<f32> {
  let rayOrigin = volumeUniforms.cameraPosition;
  let rayDir = normalize(worldPos - rayOrigin);

  // Intersect with dynamic bounding box to find entry/exit points
  let t = intersectAABB(rayOrigin, rayDir, volumeUniforms.boxMin, volumeUniforms.boxMax);

  if (t.x > t.y || t.y < 0.0) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }

  let tNear = max(t.x, 0.0);
  let tFar = t.y;
  let lightDir = normalize(volumeUniforms.lightDir);

  // Surface mode: sphere tracing with normal-based shading
  if (volumeUniforms.renderMode < 0.5) {
    var tCurrent = tNear;
    var hit = false;
    for (var i = 0; i < 128; i++) {
      if (tCurrent > tFar) { break; }
      let p = rayOrigin + rayDir * tCurrent;
      let d = cloudSDF(p);
      if (d < 0.001) {
        hit = true;
        break;
      }
      tCurrent += max(d, 0.005);
    }

    if (!hit) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    }

    let hitPos = rayOrigin + rayDir * tCurrent;
    let normal = calcNormal(hitPos);
    let diffuse = max(dot(normal, lightDir), 0.0);
    let ambient = volumeUniforms.ambient;
    let shade = ambient + diffuse * (1.0 - ambient);
    return vec4(volumeUniforms.cloudColor * shade, 1.0);
  }

  // Volume mode: adaptive raymarching with Beer's Law
  let maxSteps = i32(volumeUniforms.renderSteps);
  let denseStepSize = (tFar - tNear) / volumeUniforms.renderSteps;
  let absorption = volumeUniforms.absorption;

  var transmittance = 1.0;
  var accColor = vec3(0.0);
  let cloudColor = volumeUniforms.cloudColor;

  var tCurrent = tNear;
  for (var i = 0; i < maxSteps; i++) {
    if (tCurrent > tFar || transmittance < 0.01) { break; }

    let pos = rayOrigin + rayDir * tCurrent;
    let sdfDist = cloudSDF(pos);

    // If far from surface, skip ahead using SDF distance
    if (sdfDist > denseStepSize * 2.0) {
      tCurrent += sdfDist * 0.8;
      continue;
    }

    // Inside or near cloud: sample density and accumulate
    let density = smoothstep(0.1, -0.1, sdfDist);
    if (density > 0.001) {
      let attenuation = exp(-density * denseStepSize * absorption);
      let lightTransmittance = lightMarch(pos, lightDir, absorption);

      // Henyey-Greenstein phase function for anisotropic scattering
      let cosTheta = dot(rayDir, lightDir);
      let phase = dualPhase(cosTheta) * 4.0 * 3.14159265;

      // Ambient occlusion
      var aoFactor = 1.0;
      if (volumeUniforms.aoEnabled > 0.5) {
        let rawAO = sampleAO(pos);
        // Remap AO: aoRemap controls minimum brightness (approximates multiple scattering)
        aoFactor = mix(volumeUniforms.aoRemap, 1.0, rawAO);
        // Blend with strength
        aoFactor = mix(1.0, aoFactor, volumeUniforms.aoStrength);
      }

      // Base lighting: always present
      let ambient = volumeUniforms.ambient * aoFactor;
      let directional = lightTransmittance * 0.7;
      // Silver lining boost: phase > 1 adds extra brightness (forward scattering)
      let phaseBoost = lightTransmittance * max(phase - 1.0, 0.0) * 0.7;
      let luminance = ambient + directional + phaseBoost;
      let shade = luminance * cloudColor;

      accColor += shade * density * denseStepSize * absorption * transmittance;
      transmittance *= attenuation;
    }

    tCurrent += denseStepSize;
  }

  let alpha = 1.0 - transmittance;
  if (alpha < 0.001) {
    return vec4(0.0, 0.0, 0.0, 0.0);
  }
  return vec4(accColor, alpha);
}
`;async function qt(){const i=document.getElementById("webgpu-canvas");if(!navigator.gpu){alert("WebGPU not supported on this browser.");return}const e=await navigator.gpu.requestAdapter();if(!e){alert("No appropriate GPU adapter found.");return}const t=await e.requestDevice(),r=i.getContext("webgpu"),a=navigator.gpu.getPreferredCanvasFormat();r.configure({device:t,format:a,alphaMode:"premultiplied"});const o=t.createBuffer({size:128,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST}),s=new Uint16Array([0,1,1,2,2,3,3,0,4,5,5,6,6,7,7,4,0,4,1,5,2,6,3,7]),u=t.createBuffer({size:s.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(u,0,s);const b=new Uint16Array([0,1,2,0,2,3,4,7,6,4,6,5,0,4,5,0,5,1,3,2,6,3,6,7,0,3,7,0,7,4,1,5,6,1,6,2]),y=t.createBuffer({size:b.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(y,0,b);const h=20,c=10,l=[],d=[];let m=0;for(let g=0;g<=h;g++){const _=g/h*c-c/2;l.push(-c/2,-1,_,1),l.push(c/2,-1,_,1),d.push(m++,m++),l.push(_,-1,-c/2,1),l.push(_,-1,c/2,1),d.push(m++,m++)}const w=new Float32Array(l),v=new Uint16Array(d),f=t.createBuffer({size:w.byteLength,usage:GPUBufferUsage.VERTEX|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(f,0,w);const p=t.createBuffer({size:v.byteLength,usage:GPUBufferUsage.INDEX|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(p,0,v);const x=t.createShaderModule({code:Gt}),S=t.createRenderPipeline({layout:"auto",vertex:{module:x,entryPoint:"vs_main",buffers:[{arrayStride:16,attributes:[{shaderLocation:0,offset:0,format:"float32x4"}]}]},fragment:{module:x,entryPoint:"fs_main",targets:[{format:a}]},primitive:{topology:"line-list"},depthStencil:{depthWriteEnabled:!0,depthCompare:"less",format:"depth24plus"}}),C=()=>{const g=t.createBuffer({size:80,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),_=t.createBindGroup({layout:S.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:g}}]});return{buffer:g,bindGroup:_}},k=C(),V=C(),O=t.createShaderModule({code:Yt}),L=t.createRenderPipeline({layout:"auto",vertex:{module:O,entryPoint:"vs_volume",buffers:[{arrayStride:16,attributes:[{shaderLocation:0,offset:0,format:"float32x4"}]}]},fragment:{module:O,entryPoint:"fs_volume",targets:[{format:a,blend:{color:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"},alpha:{srcFactor:"one",dstFactor:"one-minus-src-alpha",operation:"add"}},writeMask:GPUColorWrite.ALL}]},primitive:{topology:"triangle-list",cullMode:"front"},depthStencil:{depthWriteEnabled:!1,depthCompare:"less",format:"depth24plus"}}),F=t.createBuffer({size:320,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});let P=null;function G(g){P&&P.destroy(),P=t.createTexture({size:[g,g,g],format:"rgba16float",dimension:"3d",usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING});const _=(g**3*8/1024/1024).toFixed(1);return console.log(`[SDF Texture] Created ${g}³ 3D texture (${_}MB)`),typeof Ne=="function"&&Ne(g),typeof xe=="function"&&xe(),typeof we=="function"&&we(),typeof Ce=="function"&&Ce(),P}const N=t.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"});console.log("[SDF Sampler] Created trilinear sampler");const D=64,Re=t.createTexture({size:[D,D,D],format:"rgba16float",dimension:"3d",usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING});console.log(`[Noise Texture] Created ${D}³ 3D noise texture`);const st=t.createSampler({magFilter:"linear",minFilter:"linear",mipmapFilter:"linear",addressModeU:"repeat",addressModeV:"repeat",addressModeW:"repeat"});console.log("[Noise Sampler] Created trilinear sampler with repeat mode");let W=null;function Ne(g){W&&W.destroy(),W=t.createTexture({size:[g,g,g],format:"rgba16float",dimension:"3d",usage:GPUTextureUsage.STORAGE_BINDING|GPUTextureUsage.TEXTURE_BINDING});const _=(g**3*8/1024/1024).toFixed(1);console.log(`[AO Texture] Created ${g}³ 3D texture (${_}MB)`)}const at=t.createSampler({magFilter:"linear",minFilter:"linear",addressModeU:"clamp-to-edge",addressModeV:"clamp-to-edge",addressModeW:"clamp-to-edge"});console.log("[AO Sampler] Created trilinear sampler");const lt=t.createShaderModule({code:Nt}),He=t.createComputePipeline({layout:"auto",compute:{module:lt,entryPoint:"bakeSDF"}}),Ye=t.createBuffer({size:96,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});console.log("[Compute Pipeline] SDF bake pipeline created");const dt=t.createShaderModule({code:Ht}),qe=t.createComputePipeline({layout:"auto",compute:{module:dt,entryPoint:"bakeAO"}}),Xe=t.createBuffer({size:48,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST});console.log("[Compute Pipeline] AO bake pipeline created");const ct=t.createShaderModule({code:Rt}),We=t.createComputePipeline({layout:"auto",compute:{module:ct,entryPoint:"bakeNoise3D"}}),Ze=t.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),ut=t.createBindGroup({layout:We.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ze}},{binding:1,resource:Re.createView()}]});function ht(){const g=performance.now(),_=new ArrayBuffer(16),A=new Uint32Array(_);A[0]=D,A[1]=4,A[2]=0,A[3]=0,t.queue.writeBuffer(Ze,0,_);const U=t.createCommandEncoder(),E=U.beginComputePass();E.setPipeline(We),E.setBindGroup(0,ut);const z=Math.ceil(D/4);E.dispatchWorkgroups(z,z,z),E.end(),t.queue.submit([U.finish()]);const M=performance.now();console.log(`[Noise Bake] Baked ${D}³ noise texture, ${z}³ workgroups (~${(M-g).toFixed(1)}ms CPU time)`)}ht(),console.log("[Compute Pipeline] Noise bake pipeline created");let ne=Ie(),j=ne.length/4,$=rt(ne);console.log(`[Cumulus] Generated ${j} spheres`),t.queue.writeBuffer(o,0,ot($));let K=t.createBuffer({size:ne.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});t.queue.writeBuffer(K,0,ne);let be=null,ye=null;function xe(){if(!P||!W){console.warn("[BindGroup] SDF or AO texture not ready, skipping bind group creation");return}be=t.createBindGroup({layout:L.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:F}},{binding:1,resource:{buffer:K}},{binding:2,resource:P.createView()},{binding:3,resource:N},{binding:4,resource:Re.createView()},{binding:5,resource:st},{binding:6,resource:W.createView()},{binding:7,resource:at}]}),console.log("[BindGroup] Volume bind group created with SDF, noise, and AO textures")}function we(){if(!P){console.warn("[BindGroup] SDF texture not ready, skipping bake bind group creation");return}ye=t.createBindGroup({layout:He.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Ye}},{binding:1,resource:{buffer:K}},{binding:2,resource:P.createView()}]}),console.log("[BindGroup] SDF bake bind group created")}let Se=null;function Ce(){if(!P||!W){console.warn("[BindGroup] SDF or AO texture not ready, skipping AO bind group creation");return}Se=t.createBindGroup({layout:qe.getBindGroupLayout(0),entries:[{binding:0,resource:{buffer:Xe}},{binding:1,resource:P.createView()},{binding:2,resource:N},{binding:3,resource:W.createView()}]}),console.log("[BindGroup] AO bake bind group created")}function pt(g){K.destroy(),ne=g,j=g.length/4,$=rt(g),t.queue.writeBuffer(o,0,ot($)),K=t.createBuffer({size:g.byteLength,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST}),t.queue.writeBuffer(K,0,g),xe(),we(),Ce()}function ft(g,_,A=null){if(!ye||!P){console.warn("[Bake] Bind group or texture not ready, skipping bake");return}const U=performance.now(),E=A!==null,z=new ArrayBuffer(96),M=new Float32Array(z),Y=new Uint32Array(z);M[0]=$.min[0],M[1]=$.min[1],M[2]=$.min[2],Y[3]=j,M[4]=$.max[0],M[5]=$.max[1],M[6]=$.max[2],M[7]=_,Y[8]=g,Y[9]=E?1:0,E&&A&&(M[10]=A.billowyScale,M[11]=A.billowyStrength,M[12]=A.wispyScale,M[13]=A.wispyStrength,M[14]=A.coverage,M[15]=A.gradientStrength,M[16]=A.gradientBottom,M[17]=A.gradientTop,M[18]=A.warpStrength,M[19]=A.flipZ?1:0,M[20]=A.zPadding,M[21]=0,M[22]=0,M[23]=0),t.queue.writeBuffer(Ye,0,z);const ee=t.createCommandEncoder(),te=ee.beginComputePass();te.setPipeline(He),te.setBindGroup(0,ye);const ie=Math.ceil(g/4);te.dispatchWorkgroups(ie,ie,ie),te.end(),t.queue.submit([ee.finish()]);const $e=performance.now();console.log(`[Bake] Dispatched SDF bake${E?" + noise":""}: ${g}³ voxels, ${j} spheres, ${ie}³ workgroups (~${($e-U).toFixed(1)}ms CPU time)`)}function je(g){if(!Se||!W||!n.aoEnabled){console.log("[AO Bake] Skipping AO bake (disabled or not ready)");return}const _=performance.now(),A=new ArrayBuffer(48),U=new Float32Array(A),E=new Uint32Array(A);U[0]=$.min[0],U[1]=$.min[1],U[2]=$.min[2],E[3]=n.aoSamples,U[4]=$.max[0],U[5]=$.max[1],U[6]=$.max[2],U[7]=n.aoConeAngle,E[8]=g,U[9]=n.aoRadius,E[10]=8,E[11]=0,t.queue.writeBuffer(Xe,0,A);const z=t.createCommandEncoder(),M=z.beginComputePass();M.setPipeline(qe),M.setBindGroup(0,Se);const Y=Math.ceil(g/4);M.dispatchWorkgroups(Y,Y,Y),M.end(),t.queue.submit([z.finish()]);const ee=performance.now();console.log(`[AO Bake] Dispatched AO bake: ${g}³ voxels, ${n.aoSamples} samples, cone ${n.aoConeAngle}°, radius ${n.aoRadius}, ${Y}³ workgroups (~${(ee-_).toFixed(1)}ms CPU time)`)}i.width=window.innerWidth*window.devicePixelRatio,i.height=window.innerHeight*window.devicePixelRatio;let ke=t.createTexture({size:[i.width,i.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT});const _e=de(),Ke=de(),Me=de(),Ae=de(),De=de(),n={shape:"Cumulus",gridX:4,gridZ:4,pointSeparation:.25,iterations:2,children:4,keepProb:.5,scaleMult:.55,seed:47,gradientBottom:-.2,gradientTop:.5,gradientStrength:.25,billowyScale:2.5,billowyStrength:.4,wispyScale:8,wispyStrength:.2,coverage:.05,zPadding:0,flipZ:!1,absorption:5,renderSteps:64,lightSteps:6,renderMode:"Volume",anisotropy1:.5,anisotropy2:-.3,phaseBlend:.5,sunX:1,sunY:1,sunZ:.5,ambient:.3,cloudColor:"#ffffff",cloudScale:1,blendMode:"Sharp",smoothness:.25,timeScale:0,warpStrength:.15,meshResolution:15,customMesh:null,radiusVariation:.5,curveType:"S-Curve",curvePoints:20,curveThickness:.2,curveBackboneNoise:.1,species:"Mediocris",gridY:4,windShear:0,skyboxWidth:4,skyboxDepth:4,skyboxHeight:.8,skyboxDensity:.5,skyboxCloudSize:.15,skyboxSizeVariation:.5,sdfResolution:128,sdfMode:"Baked",bakeNoise:!0,normalEpsilon:.01,aoEnabled:!0,aoStrength:.5,aoSamples:8,aoConeAngle:60,aoRadius:.3,aoRemap:.2};function B(){let g;const _={replicationIterations:n.iterations,childrenPerSphere:n.children,keepProbability:n.keepProb,scaleMult:n.scaleMult,seed:n.seed,radiusVariation:n.radiusVariation};n.shape==="Cumulus"?g=Ie({species:n.species,gridX:n.gridX,gridY:n.gridY,gridZ:n.gridZ,pointSeparation:n.pointSeparation,windShear:n.windShear,..._}):n.shape==="Wispy"?g=zt({curveType:n.curveType,numPoints:n.curvePoints,thickness:n.curveThickness,backboneNoise:n.curveBackboneNoise,..._}):n.shape==="Ellipsoid"?g=It(_):n.shape==="Skybox"?g=Lt({skyboxWidth:n.skyboxWidth,skyboxDepth:n.skyboxDepth,skyboxHeight:n.skyboxHeight,skyboxDensity:n.skyboxDensity,skyboxCloudSize:n.skyboxCloudSize,skyboxSizeVariation:n.skyboxSizeVariation,..._}):n.shape==="Custom Mesh"&&n.customMesh?g=Vt(n.customMesh.vertices,n.customMesh.indices,{resolution:n.meshResolution,..._}):g=Ie(_);const A=n.cloudScale;if(A!==1)for(let U=0;U<g.length;U++)g[U]*=A;pt(g),console.log(`[${n.shape}] Generated ${j} spheres`),typeof X=="function"&&X()}const T=new Ge;T.add(n,"shape",["Cumulus","Wispy","Ellipsoid","Skybox","Custom Mesh"]).name("Shape").onChange(B);const Je=T.addFolder("Mesh Settings");Je.add(n,"meshResolution",5,30,1).name("Voxel Res");const mt={loadMesh:()=>{const g=document.createElement("input");g.type="file",g.accept=".obj",g.onchange=_=>{const A=_.target.files[0],U=new FileReader;U.onload=E=>{n.customMesh=Ot(E.target.result),n.shape="Custom Mesh",T.controllers.find(z=>z._name==="Shape").updateDisplay(),B()},U.readAsText(A)},g.click()}};Je.add(mt,"loadMesh").name("Upload OBJ (.obj)");const Z=T.addFolder("Shape Settings");Z.add(n,"species",["Humilis","Mediocris","Congestus","Fractus"]).name("Species").onChange(B),Z.add(n,"radiusVariation",0,1,.05).name("Radius Var").onChange(B),Z.add(n,"gridX",1,12,1).name("Grid X").onChange(B),Z.add(n,"gridY",1,12,1).name("Grid Y").onChange(B),Z.add(n,"gridZ",1,12,1).name("Grid Z").onChange(B),Z.add(n,"pointSeparation",.1,.5,.01).name("Separation").onChange(B),Z.add(n,"windShear",-1,1,.01).name("Wind Shear").onChange(B);const fe=T.addFolder("Curve Settings");fe.add(n,"curveType",["S-Curve","Spiral","Circle"]).name("Curve Type").onChange(B),fe.add(n,"curvePoints",5,100,1).name("Segments").onChange(B),fe.add(n,"curveThickness",.05,.5,.01).name("Thickness").onChange(B),fe.add(n,"curveBackboneNoise",0,.5,.01).name("Backbone Noise").onChange(B);const J=T.addFolder("Skybox Settings");J.add(n,"skyboxWidth",1,10,.5).name("Width").onChange(B),J.add(n,"skyboxDepth",1,10,.5).name("Depth").onChange(B),J.add(n,"skyboxHeight",.2,2,.1).name("Height").onChange(B),J.add(n,"skyboxDensity",.1,1,.05).name("Density").onChange(B),J.add(n,"skyboxCloudSize",.05,.5,.01).name("Cloud Size").onChange(B),J.add(n,"skyboxSizeVariation",0,1,.05).name("Size Variation").onChange(B);const re=T.addFolder("Replication");re.add(n,"iterations",0,4,1).name("Iterations").onChange(B),re.add(n,"children",1,8,1).name("Children").onChange(B),re.add(n,"keepProb",.1,1,.05).name("Keep Prob").onChange(B),re.add(n,"scaleMult",.2,.9,.05).name("Scale Mult").onChange(B),re.add(n,"seed",1,100,1).name("Seed").onChange(B);function R(){n.bakeNoise&&typeof X=="function"&&X()}const oe=T.addFolder("Density Gradient");oe.add(n,"gradientBottom",-1,1,.05).name("Bottom").onChange(R),oe.add(n,"gradientTop",-1,1,.05).name("Top").onChange(R),oe.add(n,"gradientStrength",0,1,.01).name("Strength").onChange(R),oe.add(n,"zPadding",0,1,.01).name("Z Padding").onChange(R),oe.add(n,"flipZ").name("Flip Z").onChange(R);const se=T.addFolder("Noise");se.add(n,"billowyScale",.5,5,.1).name("Billowy Scale").onChange(R),se.add(n,"billowyStrength",0,.5,.01).name("Billowy Strength").onChange(R),se.add(n,"wispyScale",2,20,.5).name("Wispy Scale").onChange(R),se.add(n,"wispyStrength",0,.3,.01).name("Wispy Strength").onChange(R),se.add(n,"coverage",-.5,.5,.01).name("Coverage").onChange(R);const H=T.addFolder("Lighting");H.add(n,"renderMode",["Surface","Volume"]).name("Render Mode"),H.add(n,"absorption",1,20,.5).name("Absorption"),H.add(n,"renderSteps",16,128,1).name("Render Steps"),H.add(n,"lightSteps",1,16,1).name("Light Steps"),H.add(n,"sunX",-1,1,.01).name("Sun X"),H.add(n,"sunY",-1,1,.01).name("Sun Y"),H.add(n,"sunZ",-1,1,.01).name("Sun Z"),H.add(n,"anisotropy1",-.99,.99,.01).name("Anisotropy 1"),H.add(n,"anisotropy2",-.99,.99,.01).name("Anisotropy 2"),H.add(n,"phaseBlend",0,1,.01).name("Phase Blend");const Be=T.addFolder("Appearance");Be.addColor(n,"cloudColor").name("Cloud Color"),Be.add(n,"ambient",0,1,.01).name("Ambient"),Be.add(n,"cloudScale",.2,3,.05).name("Cloud Scale").onChange(B);const Qe=T.addFolder("Animation");Qe.add(n,"timeScale",0,1,.01).name("Evolution Speed"),Qe.add(n,"warpStrength",0,1,.01).name("Warp Strength").onChange(R),T.add(n,"blendMode",["Sharp","Smooth"]).name("Blend Mode").onChange(X),T.add(n,"smoothness",.05,1,.01).name("Smoothness").onChange(X);const me=T.addFolder("Performance");me.add(n,"sdfMode",["Dynamic","Baked"]).name("SDF Mode"),me.add(n,"bakeNoise").name("Bake Noise").onChange(()=>{X()}),me.add(n,"sdfResolution",[32,64,128,256]).name("SDF Resolution").onChange(g=>{G(g),X()}),me.add(n,"normalEpsilon",.001,.05,.001).name("Normal Epsilon");const Q=T.addFolder("Ambient Occlusion");Q.add(n,"aoEnabled").name("Enable AO").onChange(ge),Q.add(n,"aoStrength",0,1,.01).name("Strength"),Q.add(n,"aoSamples",[4,8,12,16]).name("Samples").onChange(ge),Q.add(n,"aoConeAngle",30,90,5).name("Cone Angle").onChange(ge),Q.add(n,"aoRadius",.1,1,.05).name("Radius").onChange(ge),Q.add(n,"aoRemap",0,1,.01).name("Remap (Multi-scatter)");function gt(){return{billowyScale:n.billowyScale,billowyStrength:n.billowyStrength,wispyScale:n.wispyScale,wispyStrength:n.wispyStrength,coverage:n.coverage,gradientStrength:n.gradientStrength,gradientBottom:n.gradientBottom,gradientTop:n.gradientTop,warpStrength:n.warpStrength,flipZ:n.flipZ,zPadding:n.zPadding}}function X(){const g=n.blendMode==="Smooth"?n.smoothness:0,_=n.bakeNoise?gt():null;ft(n.sdfResolution,g,_),je(n.sdfResolution)}function ge(){je(n.sdfResolution)}G(n.sdfResolution),X();let Fe=Math.PI*80/180,ae=Math.PI*90/180,le=4,Ue=!1,Pe=0,Ee=0;i.addEventListener("pointerdown",g=>{Ue=!0,Pe=g.clientX,Ee=g.clientY,i.setPointerCapture(g.pointerId)}),i.addEventListener("pointermove",g=>{if(!Ue)return;const _=g.clientX-Pe,A=g.clientY-Ee;Fe-=_*.005,ae=Math.max(.05,Math.min(Math.PI-.05,ae-A*.005)),Pe=g.clientX,Ee=g.clientY}),i.addEventListener("pointerup",g=>{Ue=!1,i.releasePointerCapture(g.pointerId)}),i.addEventListener("wheel",g=>{g.preventDefault(),le=Math.max(1.5,Math.min(20,le+g.deltaY*.01))},{passive:!1});function et(){ve.begin();const g=i.clientWidth/i.clientHeight;wt(Me,2*Math.PI/5,g,.1,100);const _=le*Math.sin(ae)*Math.cos(Fe),A=le*Math.cos(ae),U=le*Math.sin(ae)*Math.sin(Fe),E=[_,A,U];St(Ae,E,[0,0,0],[0,1,0]),it(De,Me,Ae),t.queue.writeBuffer(k.buffer,0,De),t.queue.writeBuffer(k.buffer,64,new Float32Array([1,.5,.2,1])),t.queue.writeBuffer(V.buffer,0,De),t.queue.writeBuffer(V.buffer,64,new Float32Array([.5,.5,.5,1])),it(_e,Me,Ae),yt(Ke,_e),t.queue.writeBuffer(F,0,_e),t.queue.writeBuffer(F,64,Ke),t.queue.writeBuffer(F,128,new Float32Array([E[0],E[1],E[2]])),t.queue.writeBuffer(F,140,new Uint32Array([j]));const z=n.blendMode==="Smooth"?n.smoothness:0;t.queue.writeBuffer(F,144,new Float32Array([z,n.gradientBottom,n.gradientTop,n.gradientStrength])),t.queue.writeBuffer(F,160,new Float32Array([...$.min,n.billowyScale])),t.queue.writeBuffer(F,176,new Float32Array([...$.max,n.billowyStrength])),t.queue.writeBuffer(F,192,new Float32Array([n.wispyScale,n.wispyStrength,n.coverage,n.zPadding,n.flipZ?1:0,n.absorption,n.renderSteps,n.lightSteps])),t.queue.writeBuffer(F,224,new Float32Array([n.renderMode==="Volume"?1:0,n.anisotropy1,n.anisotropy2,n.phaseBlend]));const M=parseInt(n.cloudColor.slice(1),16),Y=(M>>16&255)/255,ee=(M>>8&255)/255,te=(M&255)/255,ie=n.sdfMode==="Baked"?1:0,$e=n.sdfMode==="Baked"&&n.bakeNoise&&n.timeScale===0?1:0;t.queue.writeBuffer(F,240,new Float32Array([n.sunX,n.sunY,n.sunZ,n.ambient,Y,ee,te,performance.now()/1e3,n.timeScale,n.warpStrength,ie,$e,n.normalEpsilon,n.aoStrength,n.aoRemap,n.aoEnabled?1:0]));const Te=t.createCommandEncoder(),vt={colorAttachments:[{view:r.getCurrentTexture().createView(),clearValue:{r:64/255,g:62/255,b:63/255,a:1},loadOp:"clear",storeOp:"store"}],depthStencilAttachment:{view:ke.createView(),depthClearValue:1,depthLoadOp:"clear",depthStoreOp:"store"}},I=Te.beginRenderPass(vt);I.setPipeline(S),I.setVertexBuffer(0,f),I.setIndexBuffer(p,"uint16"),I.setBindGroup(0,V.bindGroup),I.drawIndexed(v.length),I.setVertexBuffer(0,o),I.setIndexBuffer(u,"uint16"),I.setBindGroup(0,k.bindGroup),I.drawIndexed(s.length),be&&(I.setPipeline(L),I.setVertexBuffer(0,o),I.setIndexBuffer(y,"uint16"),I.setBindGroup(0,be),I.drawIndexed(b.length)),I.end(),t.queue.submit([Te.finish()]),ve.end(),requestAnimationFrame(et)}requestAnimationFrame(et),window.addEventListener("resize",()=>{i.width=window.innerWidth*window.devicePixelRatio,i.height=window.innerHeight*window.devicePixelRatio,ke.destroy(),ke=t.createTexture({size:[i.width,i.height],format:"depth24plus",usage:GPUTextureUsage.RENDER_ATTACHMENT})})}qt();
