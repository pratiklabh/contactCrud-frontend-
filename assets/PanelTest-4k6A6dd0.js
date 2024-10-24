import{G as v,U as u,H as y,I as B,i as w,R as P,J as k,o as l,c as s,a as i,K as r,z as a,t as C,e as c,L as $,n as g,g as p,M as D,b as h,f as I,N as A,T as L,O as S,u as T}from"./index-DkiEf_42.js";var q=function(t){var n=t.dt;return`
.p-panel {
    border: 1px solid `.concat(n("panel.border.color"),`;
    border-radius: `).concat(n("panel.border.radius"),`;
    background: `).concat(n("panel.background"),`;
    color: `).concat(n("panel.color"),`;
}

.p-panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: `).concat(n("panel.header.padding"),`;
    background: `).concat(n("panel.header.background"),`;
    color: `).concat(n("panel.header.color"),`;
    border-style: solid;
    border-width: `).concat(n("panel.header.border.width"),`;
    border-color: `).concat(n("panel.header.border.color"),`;
    border-radius: `).concat(n("panel.header.border.radius"),`;
}

.p-panel-toggleable .p-panel-header {
    padding: `).concat(n("panel.toggleable.header.padding"),`;
}

.p-panel-title {
    line-height: 1;
    font-weight: `).concat(n("panel.title.font.weight"),`;
}

.p-panel-content {
    padding: `).concat(n("panel.content.padding"),`;
}

.p-panel-footer {
    padding: `).concat(n("panel.footer.padding"),`;
}
`)},K={root:function(t){var n=t.props;return["p-panel p-component",{"p-panel-toggleable":n.toggleable}]},header:"p-panel-header",title:"p-panel-title",headerActions:"p-panel-header-actions",pcToggleButton:"p-panel-toggle-button",contentContainer:"p-panel-content-container",content:"p-panel-content",footer:"p-panel-footer"},E=v.extend({name:"panel",theme:q,classes:K}),N={name:"BasePanel",extends:S,props:{header:String,toggleable:Boolean,collapsed:Boolean,toggleButtonProps:{type:Object,default:function(){return{severity:"secondary",text:!0,rounded:!0}}}},style:E,provide:function(){return{$pcPanel:this,$parentInstance:this}}},m={name:"Panel",extends:N,inheritAttrs:!1,emits:["update:collapsed","toggle"],data:function(){return{id:this.$attrs.id,d_collapsed:this.collapsed}},watch:{"$attrs.id":function(t){this.id=t||u()},collapsed:function(t){this.d_collapsed=t}},mounted:function(){this.id=this.id||u()},methods:{toggle:function(t){this.d_collapsed=!this.d_collapsed,this.$emit("update:collapsed",this.d_collapsed),this.$emit("toggle",{originalEvent:t,value:this.d_collapsed})},onKeyDown:function(t){(t.code==="Enter"||t.code==="NumpadEnter"||t.code==="Space")&&(this.toggle(t),t.preventDefault())}},computed:{buttonAriaLabel:function(){return this.toggleButtonProps&&this.toggleButtonProps.ariaLabel?this.toggleButtonProps.ariaLabel:this.header}},components:{PlusIcon:y,MinusIcon:B,Button:w},directives:{ripple:P}},_=["id"],M=["id","aria-labelledby"];function U(e,t,n,j,o,d){var b=k("Button");return l(),s("div",a({class:e.cx("root")},e.ptmi("root")),[i("div",a({class:e.cx("header")},e.ptm("header")),[r(e.$slots,"header",{id:o.id+"_header",class:$(e.cx("title"))},function(){return[e.header?(l(),s("span",a({key:0,id:o.id+"_header",class:e.cx("title")},e.ptm("title")),C(e.header),17,_)):c("",!0)]}),i("div",a({class:e.cx("headerActions")},e.ptm("headerActions")),[r(e.$slots,"icons"),e.toggleable?(l(),g(b,a({key:0,id:o.id+"_header",class:e.cx("pcToggleButton"),"aria-label":d.buttonAriaLabel,"aria-controls":o.id+"_content","aria-expanded":!o.d_collapsed,unstyled:e.unstyled,onClick:d.toggle,onKeydown:d.onKeyDown},e.toggleButtonProps,{pt:e.ptm("pcToggleButton")}),{icon:p(function(f){return[r(e.$slots,e.$slots.toggleicon?"toggleicon":"togglericon",{collapsed:o.d_collapsed},function(){return[(l(),g(D(o.d_collapsed?"PlusIcon":"MinusIcon"),a({class:f.class},e.ptm("pcToggleButton").icon),null,16,["class"]))]})]}),_:3},16,["id","class","aria-label","aria-controls","aria-expanded","unstyled","onClick","onKeydown","pt"])):c("",!0)],16)],16),h(L,a({name:"p-toggleable-content"},e.ptm("transition")),{default:p(function(){return[I(i("div",a({id:o.id+"_content",class:e.cx("contentContainer"),role:"region","aria-labelledby":o.id+"_header"},e.ptm("contentContainer")),[i("div",a({class:e.cx("content")},e.ptm("content")),[r(e.$slots,"default")],16),e.$slots.footer?(l(),s("div",a({key:0,class:e.cx("footer")},e.ptm("footer")),[r(e.$slots,"footer")],16)):c("",!0)],16,M),[[A,!o.d_collapsed]])]}),_:3},16)],16)}m.render=U;const V={class:"card"},H={__name:"PanelTest",setup(e){return(t,n)=>(l(),s("div",V,[h(T(m),{header:"Header",toggleable:""},{default:p(()=>n[0]||(n[0]=[i("p",{class:"m-0"}," Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. ",-1)])),_:1})]))}};export{H as default};
