import{a as _}from"./axios-CCb-kr4I.js";import{_ as E,l as n,m as $,c as v,a,b as s,g as f,u as o,o as y,p as c,i as x,q as B,D as S,t as i,ad as F,e as H,B as M}from"./index-DkiEf_42.js";import{s as N}from"./index-CRviYiyA.js";import{h as A}from"./html2pdf-Ej1PnI55.js";import{m as L}from"./mustache-lDDT9aR0.js";import"./_commonjsHelpers-BosuxZz1.js";const U={class:"table-container"},j={style:{width:"100%","border-collapse":"collapse","text-align":"center"}},I={style:{border:"1px solid #000"}},G={style:{border:"1px solid #000"}},Q={style:{border:"1px solid #000"}},R={style:{border:"1px solid #000"}},J={style:{border:"1px solid #000"}},K={style:{"margin-top":"1rem"}},O={__name:"Html2pdfDatabase",setup(W){const w=n([]),h=n(!1),p=n(!1),d=n(null),D=n(0),g=n(null),P=n([{label:"A4",value:"a4"},{label:"A5",value:"a5"},{label:"58 mm",value:[58,230]},{label:"72 mm",value:[72,230]},{label:"80 mm",value:[80,230]}]),C=async()=>{try{const l=await _.get("/sbs-api/sales");l.data.success==="true"?w.value=l.data.result||[]:console.error("Error fetching sales data:",l.data.message)}catch(l){console.error("Error fetching sales data:",l)}},V=async l=>{const t=l.id,e=await _.get(`sbs-api/sales/details/${t}`);e.data.success==="true"?(d.value={...l,items:e.data.result},D.value=d.value.items.reduce((m,u)=>m+(u.rate-u.discount)*u.quantity,0),h.value=!0):console.error("Error fetching sales details:",e.data.message)},k=()=>{p.value=!0},q=async()=>{p.value=!1,await T(d.value)},T=async l=>{try{const t=await _.get("/sbs-api/sales/localTemplate");if(t.data.success==="true"){let e=t.data.result.fileContent,m={customerName:l.customerName,grandTotal:l.total,details:l.items.map(r=>({productName:r.productName,rate:r.rate,quantity:r.quantity,discount:r.discount,total:(r.rate-r.discount)*r.quantity}))},u=L.render(e,m);const b=document.createElement("div");b.innerHTML=u,document.body.appendChild(b);const z={margin:[2,2],filename:`sales-detail-${l.id}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"mm",format:g.value||"a4",orientation:"portrait"}};A().from(b).set(z).toPdf().get("pdf").then(r=>{r.autoPrint(),window.open(r.output("bloburl"),"_blank")}),document.body.removeChild(b)}else console.error("Error fetching template:",t.data.message)}catch(t){console.error("Error generating PDF:",t)}};return $(C),(l,t)=>(y(),v("div",U,[t[5]||(t[5]=a("h2",null,"Sales Details",-1)),s(o(B),{value:w.value,tableStyle:"min-width: 50rem"},{default:f(()=>[s(o(c),{field:"date",header:"Date"}),s(o(c),{field:"total",header:"Total"}),s(o(c),{field:"customerName",header:"Customer Name"}),s(o(c),{field:"paymentMode",header:"Payment Mode"}),s(o(c),{header:"Actions"},{body:f(e=>[s(o(x),{label:"View Details",onClick:m=>V(e.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value"]),s(o(N),{visible:h.value,"onUpdate:visible":t[0]||(t[0]=e=>h.value=e),header:"Sales Details",modal:!0,closable:!0,style:{width:"50vw"}},{default:f(()=>[d.value?(y(),v(S,{key:0},[a("h3",null,"Customer Name: "+i(d.value.customerName),1),a("table",j,[t[3]||(t[3]=a("thead",null,[a("tr",null,[a("th",{style:{border:"1px solid #000"}},"Product Name"),a("th",{style:{border:"1px solid #000"}},"Rate"),a("th",{style:{border:"1px solid #000"}},"Quantity"),a("th",{style:{border:"1px solid #000"}},"Discount"),a("th",{style:{border:"1px solid #000"}},"Total")])],-1)),a("tbody",null,[(y(!0),v(S,null,F(d.value.items,e=>(y(),v("tr",{key:e.productName},[a("td",I,i(e.productName),1),a("td",G,i(e.rate),1),a("td",Q,i(e.quantity),1),a("td",R,i(e.discount),1),a("td",J,i((e.rate-e.discount)*e.quantity),1)]))),128))])]),a("h3",null,"Grand Total: "+i(D.value),1),s(o(x),{label:"Print",onClick:k})],64)):H("",!0)]),_:1},8,["visible"]),s(o(N),{visible:p.value,"onUpdate:visible":t[2]||(t[2]=e=>p.value=e),header:"Select Paper Size",modal:!0,closable:!0,style:{width:"30vw"}},{default:f(()=>[a("div",null,[t[4]||(t[4]=a("p",null,"Select the paper size for the PDF:",-1)),s(o(M),{modelValue:g.value,"onUpdate:modelValue":t[1]||(t[1]=e=>g.value=e),options:P.value,optionLabel:"label",optionValue:"value",placeholder:"Select Paper Size"},null,8,["modelValue","options"]),a("div",K,[s(o(x),{label:"Confirm",onClick:q})])])]),_:1},8,["visible"])]))}},le=E(O,[["__scopeId","data-v-5ac61f45"]]);export{le as default};
