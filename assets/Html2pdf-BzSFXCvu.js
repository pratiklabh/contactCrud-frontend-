import{a as g}from"./axios-CCb-kr4I.js";import{_ as B,l as i,m as M,c as h,a as t,b as a,g as y,u as o,o as v,p as c,i as _,q as A,D as N,t as n,ad as F,e as H,B as I}from"./index-DkiEf_42.js";import{s as P}from"./index-CRviYiyA.js";import{h as L}from"./html2pdf-Ej1PnI55.js";import"./_commonjsHelpers-BosuxZz1.js";const U={class:"table-container"},j={style:{width:"100%","border-collapse":"collapse","text-align":"center"}},G={style:{border:"1px solid #000"}},Q={style:{border:"1px solid #000"}},R={style:{border:"1px solid #000"}},J={style:{border:"1px solid #000"}},K={style:{border:"1px solid #000"}},O={style:{"margin-top":"1rem"}},W={__name:"Html2pdf",setup(X){const w=i([]),f=i(!1),p=i(!1),u=i(null),S=i(0),x=i(null),C=i([{label:"A4",value:"a4"},{label:"A5",value:"a5"},{label:"58 mm",value:[58,230]},{label:"72 mm",value:[72,230]},{label:"80 mm",value:[80,230]}]),V=async()=>{try{const s=await g.get("sbs-api/sales");s.data.success==="true"?w.value=s.data.result||[]:console.error("Error fetching sales data:",s.data.message)}catch(s){console.error("Error fetching sales data:",s)}},k=async s=>{const l=s.id,e=await g.get(`sbs-api/sales/details/${l}`);e.data.success==="true"?(u.value={...s,items:e.data.result},S.value=u.value.items.reduce((b,d)=>b+(d.rate-d.discount)*d.quantity,0),f.value=!0):console.error("Error fetching sales details:",e.data.message)},z=()=>{p.value=!0},T=()=>{p.value=!1,q(u.value)},q=async s=>{const l=s.id,e=await g.get(`sbs-api/sales/details/${l}`);if(e.data.success==="true"){const b=e.data.result;let d=`
      <div>
        <h2>Sales Detail</h2>
        <p><strong><span style="font-size: 10px;">Customer Name: ${s.customerName}</span></strong> </p>
        <table style="width: 100%; border-collapse: collapse; text-align: center; font-size: 0.7rem">
          <thead>
            <tr>
              <th style="border: 1px solid #000;">Product Name</th>
              <th style="border: 1px solid #000;">Rate</th>
              <th style="border: 1px solid #000;">Quantity</th>
              <th style="border: 1px solid #000;">Discount</th>
              <th style="border: 1px solid #000;">Total</th>
            </tr>
          </thead>
          <tbody>
    `,D=0;b.forEach(r=>{const $=(r.rate-r.discount)*r.quantity;D+=$,d+=`
        <tr>
          <td style="border: 1px solid #000;">${r.productName}</td>
          <td style="border: 1px solid #000;">${r.rate}</td>
          <td style="border: 1px solid #000;">${r.quantity}</td>
          <td style="border: 1px solid #000;">${r.discount}</td>
          <td style="border: 1px solid #000;">${$}</td>
        </tr>
      `}),d+=`
          </tbody>
        </table>
        <h3>Grand Total: ${D}</h3>
      </div>
    `;const m=document.createElement("div");m.innerHTML=d,document.body.appendChild(m);const E={margin:[2,2],filename:`sales-detail-${l}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"mm",format:x.value||"a4",orientation:"portrait"}};L().from(m).set(E).toPdf().get("pdf").then(function(r){r.autoPrint(),window.open(r.output("bloburl"),"_blank")}),document.body.removeChild(m)}else console.error("Error fetching sales details:",e.data.message)};return M(V),(s,l)=>(v(),h("div",U,[l[5]||(l[5]=t("h2",null,"Sales Details",-1)),a(o(A),{value:w.value,tableStyle:"min-width: 50rem"},{default:y(()=>[a(o(c),{field:"date",header:"Date"}),a(o(c),{field:"total",header:"Total"}),a(o(c),{field:"customerName",header:"Customer Name"}),a(o(c),{field:"paymentMode",header:"Payment Mode"}),a(o(c),{header:"Actions"},{body:y(e=>[a(o(_),{label:"View Details",onClick:b=>k(e.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value"]),a(o(P),{visible:f.value,"onUpdate:visible":l[0]||(l[0]=e=>f.value=e),header:"Sales Details",modal:!0,closable:!0,style:{width:"50vw"}},{default:y(()=>[u.value?(v(),h(N,{key:0},[t("h3",null,"Customer Name: "+n(u.value.customerName),1),t("table",j,[l[3]||(l[3]=t("thead",null,[t("tr",null,[t("th",{style:{border:"1px solid #000"}},"Product Name"),t("th",{style:{border:"1px solid #000"}},"Rate"),t("th",{style:{border:"1px solid #000"}},"Quantity"),t("th",{style:{border:"1px solid #000"}},"Discount"),t("th",{style:{border:"1px solid #000"}},"Total")])],-1)),t("tbody",null,[(v(!0),h(N,null,F(u.value.items,e=>(v(),h("tr",{key:e.productName},[t("td",G,n(e.productName),1),t("td",Q,n(e.rate),1),t("td",R,n(e.quantity),1),t("td",J,n(e.discount),1),t("td",K,n((e.rate-e.discount)*e.quantity),1)]))),128))])]),t("h3",null,"Grand Total: "+n(S.value),1),a(o(_),{label:"Print",onClick:z})],64)):H("",!0)]),_:1},8,["visible"]),a(o(P),{visible:p.value,"onUpdate:visible":l[2]||(l[2]=e=>p.value=e),header:"Select Paper Size",modal:!0,closable:!0,style:{width:"30vw"}},{default:y(()=>[t("div",null,[l[4]||(l[4]=t("p",null,"Select the paper size for the PDF:",-1)),a(o(I),{modelValue:x.value,"onUpdate:modelValue":l[1]||(l[1]=e=>x.value=e),options:C.value,optionLabel:"label",optionValue:"value",placeholder:"Select Paper Size"},null,8,["modelValue","options"]),t("div",O,[a(o(_),{label:"Confirm",onClick:T})])])]),_:1},8,["visible"])]))}},se=B(W,[["__scopeId","data-v-00fe39b9"]]);export{se as default};
