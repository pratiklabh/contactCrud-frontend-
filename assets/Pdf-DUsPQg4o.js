import{a as u}from"./axios-CCb-kr4I.js";import{_ as f,l as x,m as g,c as _,a as w,b as a,g as y,u as s,o as $,p as l,i as v,q as N}from"./index-DkiEf_42.js";const P={class:"table-container"},C={__name:"Pdf",setup(D){const i=x([]),b=async()=>{try{const t=await u.get("sbs-api/sales");t.data.success==="true"?i.value=t.data.result||[]:console.error("Error:",t.data.message)}catch(t){console.error("Error:",t)}},m=async t=>{const d=t.id,o=await u.get(`sbs-api/sales/details/${d}`);if(o.data.success==="true"){const c=o.data.result;let n=`
      <h2>Sales Detail</h2>
      <p><strong>Customer Name:</strong> ${t.customerName}</p>
      <table style="width: 100%; border-collapse: collapse; text-align: center;">
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
    `,p=0;c.forEach(e=>{const h=(e.rate-e.discount)*e.quantity;p+=h,n+=`
        <tr>
          <td style="border: 1px solid #000;">${e.productName}</td>
          <td style="border: 1px solid #000;">${e.rate}</td>
          <td style="border: 1px solid #000;">${e.quantity}</td>
          <td style="border: 1px solid #000;">${e.discount}</td>
          <td style="border: 1px solid #000;">${h}</td>
        </tr>
      `}),n+=`
        </tbody>
      </table>
      <h3>Grand Total: ${p}</h3>
    `;const r=window.open("","","width=800,height=600");r.document.write(`
      <html><head><title>Sales Invoice</title><style>
      @media print {
        @page { margin: 10% 5%; }
        body { margin: 0; font-family: Arial, sans-serif; }
        h2 { text-align: center; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #000; padding: 8px; text-align: center; }
      }
      </style></head><body>${n}</body></html>`),r.document.close(),r.focus(),r.print(),r.close()}else console.error("Error:",o.data.message)};return g(()=>{b()}),(t,d)=>($(),_("div",P,[d[0]||(d[0]=w("h2",null,"Sales Details",-1)),a(s(N),{value:i.value,tableStyle:"min-width: 50rem"},{default:y(()=>[a(s(l),{field:"date",header:"Date"}),a(s(l),{field:"total",header:"Total"}),a(s(l),{field:"customerName",header:"Customer Name"}),a(s(l),{field:"paymentMode",header:"Payment Mode"}),a(s(l),{header:"Actions"},{body:y(o=>[a(s(v),{label:"Print Preview",onClick:c=>m(o.data)},null,8,["onClick"])]),_:1})]),_:1},8,["value"])]))}},k=f(C,[["__scopeId","data-v-fa163a1a"]]);export{k as default};
