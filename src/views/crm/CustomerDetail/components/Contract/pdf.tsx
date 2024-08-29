import { Document, Page, Text, View, Image, BlobProvider, StyleSheet, Font, PDFViewer } from '@react-pdf/renderer';
import { useContext, useState } from 'react';
import { FormikValuesContext } from './index';
import { addcontractinfileManager } from '@/services/CommonService';
import { Button, Notification, toast } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

 
Font.register({
  family: 'Poppins',
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/poppins/v1/VIeViZ2fPtYBt3B2fQZplvesZW2xOQ-xsNqO47m55DA.ttf",
      fontWeight: 300
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v1/hlvAxH6aIdOjWlLzgm0jqg.ttf",
      fontWeight: 'normal'
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v1/hlvAxH6aIdOjWlLzgm0jqg.ttf",
      fontWeight: 'normal',
      fontStyle: 'italic'
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v1/4WGKlFyjcmCFVl8pRsgZ9vesZW2xOQ-xsNqO47m55DA.ttf",
      fontWeight: 500,
    },
    {
      src: "https://fonts.gstatic.com/s/poppins/v1/-zOABrCWORC3lyDh-ajNnPesZW2xOQ-xsNqO47m55DA.ttf",
      fontWeight: 600,
    }
    ,
    {
      src: "https://fonts.gstatic.com/s/poppins/v1/8JitanEsk5aDh7mDYs-fYfesZW2xOQ-xsNqO47m55DA.ttf",
      fontWeight: 700,
    }
  ]
 
 
});
 
const styles = StyleSheet.create({
  page: {
    fontFamily:"Times-Roman",
    paddingTop:30,
    paddingBottom:20,
  },
 
  header:{
  height: 110,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  },
 
  headerText:{
    fontSize: 16,
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontWeight: 700,
  },
  Text:{
    fontSize: 14,
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontWeight: 500,
  },
  client:{
    fontSize: 12,
    marginLeft: 80,
    marginTop: 30,
    fontFamily: 'Poppins',
    fontWeight: 600,
  },
  client1:{
      fontSize: 12,
      marginLeft: 80,
      marginTop: 10,
      fontFamily: 'Poppins',
  },
  client2:{
    fontSize: 12,
    marginLeft: 192,
    fontFamily: 'Poppins',
},
number:{
  fontSize: 12,
  marginLeft: 10,
  fontFamily: 'Poppins',
},
scope:{
 fontSize: 12,
 textAlign: 'center',
 fontFamily: 'Poppins',
 marginTop: 16,
 fontWeight: 700,
 textDecoration: "underline",
},
scope1:{
  fontSize: 12,
  fontFamily: 'Poppins',
  marginTop: 8,
  marginRight: 60,
  marginLeft: 60,
 },
scopepart:{
  fontSize: 12,
  fontFamily: 'Poppins',
  marginRight: 60,
  marginLeft: 60,
 },

 part1: {
  fontSize: 12,
  textAlign: 'center',
  fontFamily: 'Poppins',
  marginTop: 40,
  fontWeight: 700,
  textDecoration: "underline",
},

text1: {
  fontSize: 12,
  fontFamily: 'Poppins',
  marginTop: 8,
},

dothead:{
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
  alignItems: 'center',
},
dothead11:{
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
},
dothead12:{
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  gap: 10,
  marginLeft: 20,
},
 dot:{
  fontSize: 18,
  fontFamily: 'Poppins',
  fontWeight: 700,
 },

 section: {
  marginBottom: 10,
},
 sectionfees: {
  marginBottom: 10,
  marginLeft: 20,
},
list: {
  marginLeft: 17,
},
listItem: {
  marginBottom: 2,
},
sublistItem: {
  marginLeft: 10,
  marginBottom: 2,
},

subfee:{
  marginLeft: 29,
}
,
fee:{
   fontFamily: 'Poppins',
    fontWeight: 700,
    marginLeft: 18,
    marginTop: 10,
},

fee7:{
  marginLeft: 18,
  marginTop: 10,
},

design:{
  display: 'flex',
  flexDirection: 'row',
  gap: 10,
  marginTop: 10,
},
  image: {
    width: 90,
    height: 70,
  },


  feeItem: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  feeTitle: {
    flexGrow: 1,
    fontWeight: 'bold',
  },
  feePercent: {
    marginLeft: 10,
  },
  feeDescription: {
    marginLeft: 20,
    marginBottom: 5,
  }
,
  heading: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
  },
  heading1: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    textDecoration: 'underline',
  },
  heading2: {
    fontWeight: 'bold',
    fontSize: 14,

    textDecoration: 'underline',
  },

  text: {
    marginBottom: 5,
  },
  bold: {
    fontWeight: 'bold',
  },
  underline: {
    textDecoration: 'underline',
  }
,
  scope3: {
    fontSize: 12,
    fontFamily: 'Poppins',
    marginTop: 8,
    marginRight: 60,
    justifyContent: 'space-between',
  },

  part: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight:700,
    textDecoration: 'underline',
  },
  partText: {
    display:'flex',
    flexDirection:'row',
    gap:'25px',
    justifyContent:'space-between',marginRight:55,
  },

  part1Text: {
      display:'flex',
      flexDirection:'row',
      gap:'12px',
      marginRight:55,
      marginLeft:60
    },
    part11: {
      fontSize: 12,
      fontFamily: 'Poppins',
      marginTop: 8,
    },
    part12: {
      fontSize: 12,
      fontFamily: 'Poppins',
      fontWeight: 700,
      marginTop: 8,
    },
    part13: {
      display:'flex',
      flexDirection:'row',
      gap:'20px',
      marginRight:55,
      marginLeft:80,
    },
    part14: {
      fontSize: 12,
      fontFamily: 'Poppins',
      marginTop: 8,
      textDecoration: 'underline',
    },

    part15:{
      fontSize: 12,
          fontFamily: 'Poppins',
          marginTop: 8,
          marginRight:30,
          marginLeft:25
     
    },
    part16:{
    marginLeft:50
    },
  terms:{
marginLeft: 20,
  }
,
  header1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  column: {
    width: '45%',
  },
  text2: {
    fontSize: 10,
    marginBottom: 3,
  },
  highlightedText: {
    fontSize: 10,
    marginBottom: 3,
    backgroundColor: 'yellow',
  },
  boldText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  redText: {
    fontSize: 10,
    color: 'red',
  },
  bankDetails: {
    marginTop: 20,
  },


  dothead1:{
    display: 'flex',
    flexDirection: 'row',
    gap: 20,
    fontFamily:"Poppins",
    marginLeft:88
   
   
  },
  dot1:{
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: 700,
   
   
   },
  part7:{
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: 600,
    marginRight:30
  },
  part71: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: 700,
    marginTop: 8,
    textDecoration:'underline'
  },
  part72:{
    marginTop:20,
    marginBottom:20,
    fontSize: 12,
    fontFamily: 'Poppins',
    color:'#dcdcdc',
    fontStyle:'italic'
   
  },
  line: {
    height: 1,
    backgroundColor: '#000',
    marginBottom: 20,
    marginTop:70,
    width: 150,
  },
  scope13:{
    fontSize: 12,
    fontFamily: 'Poppins',
    marginTop: 8,
    marginRight: 60,
    marginLeft: 110,
  }
});

function numberToWords(number:number) {
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const teens = ['', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
 
  let result = '';
 
  const hundreds = Math.floor(number / 100);
  const tensAndUnits = number % 100;
 
  if (hundreds > 0) {
    result += units[hundreds] + ' hundred ';
  }
 
  if (tensAndUnits > 0) {
    if (tensAndUnits < 10) {
      result += units[tensAndUnits];
    } else if (tensAndUnits < 20) {
      result += teens[tensAndUnits - 10];
    } else {
      const tensDigit = Math.floor(tensAndUnits / 10);
      const unitsDigit = tensAndUnits % 10;
      result += tens[tensDigit];
      if (unitsDigit > 0) {
        result += ' ' + units[unitsDigit];
      }
    }
  }
 
  return result;
}

function numberToWordsString(number:number) {
  if (number === 0) {
    return 'zero';
  }
 
  let result = '';
 
  if (number < 0) {
    result += 'negative ';
    number = Math.abs(number);
  }
 
  const billion = Math.floor(number / 1000000000);
  const million = Math.floor((number % 1000000000) / 1000000);
  const thousand = Math.floor((number % 1000000) / 1000);
  const remainder = number % 1000;
 
  if (billion > 0) {
    result += numberToWords(billion) + ' billion ';
  }
 
  if (million > 0) {
    result += numberToWords(million) + ' million ';
  }
 
  if (thousand > 0) {
    result += numberToWords(thousand) + ' thousand ';
  }
 
  if (remainder > 0) {
    result += numberToWords(remainder);
  }
 
  return result.trim();
}
 
const MyDocument = (data:any) => {
  const pdfData=data.data;

const date=new Date();

let number=1;

  return(
  <Document>
  <Page style={styles.page}>
    <View style={styles.header}>
    <Image style={styles.image} src={'/Images/logo.png'} />
      </View>
    <View>
    <Text style={styles.headerText}>{pdfData.contract_type}</Text>
    <Text style={styles.headerText}>CONTRACT</Text>
      <Text style={styles.Text}>{pdfData.project_name}, {pdfData.city}</Text>
    </View>
    <View style={styles.client}>
      <Text>Client                     - {pdfData.client_name[0]}</Text>
      <Text>Designer                - Ms. Naomi Sahay</Text>
    </View>
    <View style={styles.client1}>
      <Text>Date                       - {pdfData.date}</Text>
      <Text>Quotation No         -  CCPL /FY25/ {pdfData.quotation}</Text>
      <Text>Site Address          - {pdfData.site_address}</Text>
    </View>
    <View style={styles.client1}>
      <Text>Client Contact      - {pdfData.client_name[0]};</Text>
      </View>
    <View style={styles.client2}>
      <Text style={styles.number}> +91 {pdfData.client_phone[0]}, {pdfData.client_email[0]}</Text>
      {pdfData.client_name.slice(1).map((name:any, index:any) => (
 <>
    <Text>- {name};</Text>
    <Text style={styles.number}>+91 {pdfData.client_phone[index + 1]}, {pdfData.client_email[index + 1]}</Text>
    </>
))}
    </View>
    <View style={styles.client1}>
      <Text>Colonelz’ Contact  - Ms. Naomi Sahay, Principal Designer;</Text>
      </View>
      <View style={styles.client2}>
      <Text style={styles.number}>+91 8447500754, naomi@colonelz.com</Text>
    </View>
    <View style={styles.scope}>
      <Text>Scope of Work</Text>
    </View>
    <View style={styles.scope1}>
      <Text>The Scope of work entails Architectural Planning, Construction, Interior Designing
and Implementation by Colonelz Constructions Pvt Ltd, with Corporate Office at
D11, Vipul World, Sector 48, Sohna Road, Gurgaon, Haryana- 122018,
represented by Ms Naomi Sahay, (hereinafter known as The Designer). The
Scope shall include the preparation of all drawings for the execution of the
designs finalised and the implementation of finalised designs by the Colonelz
Team, in the apartment of {pdfData.client_name[0]}, r/o {pdfData.site_address}, (hereinafter
known as The Client). Design scope shall also cover supervision during the
implementation of the same.</Text>
    </View>
    <View style={styles.scope1}>
      <View style={styles.partText}>
       
        <View><Text style={styles.part} >Part I.</Text> </View>
        <View><Text >Architectural Planning, Construction & Interior Designing of the
complete space.</Text> </View>
            </View>
       <View style={styles.partText}>
       
      <View><Text style={styles.part} >Part II.</Text> </View>
      <View><Text >Implementation and Execution of the finalised Design as detailed by
          The Designer and approved by The Client</Text> </View>
          </View>
      </View>
      <View style={styles.scopepart}>
       <Text style={styles.part1}>Part I</Text></View>
      <View style={styles.scope1}><Text style={styles.text1}>This is the Designing Part, which will be covered in 2 parts, as below:
</Text></View>
      <View style={styles.part1Text}>
        <View><Text style={styles.part11} >1.</Text></View>
        <View><Text style={styles.part12}>Phase I –Design Stage,</Text></View>
        <View><Text style={styles.part11} >i.e., Stage 1:</Text></View>
      </View>
      <View style={styles.part13}>
        <View> <Text style={styles.part11}>a.</Text></View>
        <View> <Text style={styles.part14}>Presentation Drawings:</Text></View>
      </View>
 
      <View style={styles.scope13}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Furniture Layout Plan</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Presentation with Conceptual Pictures & Sketches
</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Conceptual 3D Views with 1 view each of the following spaces:</Text></View>
     </View>
 
     <View style={styles.section}>
        <View style={styles.list}>
          {
            pdfData.design_stage.map((item:any, index:number) => {
             if(item==='Bedrooms'){
              return <Text style={styles.listItem}>{`>`}   {item}          {pdfData.bedroom_number} no.</Text>
             }
             else if(item==='Toilets'){
              return <Text style={styles.listItem}>{`>`}   {item}              {pdfData.toilet_number} no.</Text>
             }
             else if(item==='Balconies'){
              return <Text style={styles.listItem}>{`>`}   {item}          {pdfData.balcony_number} no.</Text>
             }
             else{
              return <Text style={styles.listItem}>{`>`}   {item}</Text>
             }
            })
}
          {/* <Text style={styles.listItem}>{`>`}   Bedrooms          - 3 no.</Text>
          <Text style={styles.listItem}>{`>`}   Drawing room</Text>
          <Text style={styles.listItem}>{`>`}   Kitchen</Text>
          <Text style={styles.listItem}>{`>`}   Living & Dining area</Text>
          <Text style={styles.listItem}>{`>`}   Main Entrance</Text>
          <Text style={styles.listItem}>{`>`}   Foyer.</Text>
          <Text style={styles.listItem}>{`>`}   Lift lobby</Text>
          <Text style={styles.listItem}>{`>`}   Balconies         - 2 no.</Text>
          <Text style={styles.listItem}>{`>`}   Toilets               - 4 no.</Text>
          <Text style={styles.listItem}>{`>`}   Terrace Hall room</Text>
          <Text style={styles.listItem}>{`>`}   Terrace Open area</Text> */}
        </View>
      </View>
     </View>
     <View style={styles.part13}>
        <View> <Text style={styles.part11}>b.</Text></View>
        <View> <Text style={styles.part14}>Civil Work Drawings (as per requirement):</Text></View>
      </View>
      <View style={styles.scope13}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text > Floor Plan
 </Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Structural Layout
</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Electrical Layout</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Plumbing Layout </Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >HVAC ducting Layout</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >False Ceiling Plan</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Toilet Layout</Text></View>
     </View>
     </View>
 
<View><Text>  </Text></View>
<View><Text>  </Text></View>

     <View style={styles.part1Text}>
        <View><Text style={styles.part11} >2.</Text></View>
        <View><Text style={styles.part12}>Phase II – Interior Fit Out Stage:</Text></View>
      </View>
      <View style={styles.part13}>
        <View> <Text style={styles.part11}>a.</Text></View>
        <View> <Text style={styles.part14}>Stage 2: Design Development Phase 1</Text></View>
      </View>
      <View style={styles.scope13}>
      <View style={styles.dothead11}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Detailed 3D Views with 1-2 views each (as per requirement) of the
following spaces (with finalised details):
</Text></View>
     </View>
     <View style={styles.section}>
        <View style={styles.list}>
        {
            pdfData.design_stage.map((item:any, index:number) => {
             if(item==='Bedrooms'){
              return <Text style={styles.listItem}>{`>`}   {item}          {pdfData.bedroom_number} no.</Text>
             }
             else if(item==='Toilets'){
              return <Text style={styles.listItem}>{`>`}   {item}              {pdfData.toilet_number} no.</Text>
             }
             else if(item==='Balconies'){
              return <Text style={styles.listItem}>{`>`}   {item}          {pdfData.balcony_number} no.</Text>
             }
             else{
              return <Text style={styles.listItem}>{`>`}   {item}</Text>
             }
            })
}
        </View>
      </View>
     </View>
     <View style={styles.part1Text}>
        <View><Text style={styles.part11} >b.</Text></View>
        <View><Text style={styles.part14}>Stage 3: Good for Construction (GFC) Drawings </Text></View>
        <View><Text style={styles.part15}>– Working drawings    </Text>
        </View>
      </View>
 
      <View style={styles.scope1}>
      <View><Text style={styles.part16}>that give detailed dimensions, graphical information that can be used by a contractor/site teams to construct the works, or by suppliers to 
fabricate components of the works.</Text></View>
      </View>


    
    <View style={styles.scope1}>
      <Text></Text>
    </View>


    <View style={styles.scope13}>


     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text>Furniture Layout</Text></View>
     </View>



      <View style={styles.section}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Flooring Layout Plan </Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Detailed Space Plan/ Furniture Layout</Text>
          <Text style={styles.listItem}>{`>`}   Floor Finish Detail</Text>
          <Text style={styles.listItem}>{`>`}   Floor LVL Layout</Text>
        </View>
      </View>


      <View style={styles.section}>
        <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Toilet Details </Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Plumbing Layout</Text>
          <Text style={styles.listItem}>{`>`}   Water Supply Plan</Text>
          <Text style={styles.listItem}>{`>`}   Drain Layout</Text>
          <Text style={styles.listItem}>{`>`}   Wall Elevations</Text>
        </View>
      </View>


      <View style={styles.section}>
        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Reflected Ceiling Plan </Text>
        </View>
        </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   False Ceiling Plan</Text>
          <Text style={styles.listItem}>{`>`}   Ceiling Lighting Plan</Text>
          <Text style={styles.listItem}>{`>`}   Ceiling Finish layout</Text>
        </View>
      </View>


      <View style={styles.section}>
        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Electrical Drawings </Text>
        </View>
        </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Looping Plan</Text>
          <Text style={styles.listItem}>{`>`}   Wall Lighting Plan</Text>
          <Text style={styles.listItem}>{`>`}   Wall Electrical</Text>
        </View>
      </View>

      <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Wall Finishes Plan </Text>
        </View>
        </View>

        <View style={styles.section}>
        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Terrace Details </Text>
        </View>
        </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Addition/ Alteration Layout</Text>
          <Text style={styles.listItem}>{`>`}   Parapet Details</Text>
          <Text style={styles.listItem}>{`>`}   Electrical Layout</Text>
          <Text style={styles.listItem}>{`>`}   Plumbing Layout</Text>
          <Text style={styles.listItem}>{`>`}   Wall Elevations</Text>
          <Text style={styles.listItem}>{`>`}   Woodwork Details</Text>
        </View>
      </View>


      <View style={styles.section}>
        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Woodwork Details: </Text>
        </View>
        </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Fixed Furniture</Text>
          <Text style={styles.listItem}>{`>`}   Wardrobes & Storages</Text>
          <Text style={styles.listItem}>{`>`}   Kitchen Storages</Text>
          <Text style={styles.listItem}>{`>`}   Wall Paneling</Text>
          <Text style={styles.listItem}>{`>`}   Loose Furniture</Text>
          <Text style={styles.listItem}>{`>`}   Wooden Ceiling Detail</Text>
          <Text style={styles.listItem}>{`>`}   Moulding & Detailing if any</Text>
        </View>
      </View>


      <View style={styles.section}>
        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Stage 4: Documents & BOQs </Text>
        </View>
        </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Light fixtures BOQ</Text>
          <Text style={styles.listItem}>{`>`}   Furniture BOQ</Text>
          <Text style={styles.listItem}>{`>`}   Toilet Fixtures BOQ</Text>
          <Text style={styles.listItem}>{`>`}   Tiling & Stone BOQ</Text>
          <Text style={styles.listItem}>{`>`}   Furnishing BOQ</Text>
        </View>
      </View>

    


    </View>

    

    <View style={styles.scope1}>
    <View> <Text style={styles.part1}>Part II</Text></View>
      <View><Text style={styles.text1}>The Designer shall implement the Design as finalised with The Client. The 
Designer shall ensure Quality checks, as also coordination with all stakeholders 
and supervision of all site teams.
</Text></View>
</View>


    <View style={styles.scopepart}>
    <View> <Text style={styles.part1}>Fee Proposal</Text></View>
      <View><Text style={styles.text1}>Our Design charges are @ ₹{pdfData.design_charges}/ Sft but with special regards we offer {pdfData.discount}% 
discount for you, thus the complete process of designing, supervision, site and 
joint material selection visits will be done as per the following rates:
</Text></View>


        <View >
        <View ><Text style={styles.fee} >{number++}. Design charges @ ₹{pdfData.design_charges_per_sft}/ Sft x Covered area @{pdfData.design_cover_area_in_sft} Sft = ₹{Number(pdfData.design_charges_per_sft)*Number(pdfData.design_cover_area_in_sft)}/-</Text></View>
        </View>
        <View>
          <Text style={styles.subfee} >({numberToWordsString(Number(pdfData.design_charges_per_sft)*Number(pdfData.design_cover_area_in_sft))}) excl. of
          taxes and the Terrace & Balcony.
          </Text>
        </View>

{ pdfData.design_stage.map((item:any, index:number) => {
  if(item==='Balconies'){
    return(
      <>
        <View >
        <View ><Text style={styles.fee} >{number++}. Balconies @ ₹{pdfData.balcony_charges_per_sft}/ Sft x Balcony area @ {pdfData.balcony_area_in_sft} Sft = ₹{Number(pdfData.balcony_area_in_sft)*Number(pdfData.balcony_charges_per_sft)}/-</Text></View>
        </View>
        <View>
          <Text style={styles.subfee} >({numberToWordsString(Number(pdfData.balcony_area_in_sft)*Number(pdfData.balcony_charges_per_sft))}) excl. of taxes.
          </Text>
        </View>
        </>
 )}})} 



{pdfData.design_stage.map((item:any, index:number) => {
      if(item==='Terrace'){
        return(
          <>
            <View>
              <View><Text style={styles.fee} >{number++}. Terrace covered area @ ₹{pdfData.terrace_covered_charges_per_sft}/ Sft x Terrace area @ {pdfData.terrace_covered_area_in_sft} Sft = 
              ₹{Number(pdfData.terrace_covered_area_in_sft)*Number(pdfData.terrace_covered_charges_per_sft)}/-</Text></View>
            </View>
            <View>
              <Text style={styles.subfee} > ({numberToWordsString(Number(pdfData.terrace_covered_area_in_sft)*Number(pdfData.terrace_covered_charges_per_sft))}) excl. of taxes.
              </Text>
            </View>

            <View>
              <View><Text style={styles.fee} >{number++}. Terrace open area @ ₹{pdfData.terrace_open_charges_per_sft}/ Sft x Terrace area @ {pdfData.terrace_open_area_in_sft} Sft = {Number(pdfData.terrace_open_area_in_sft)*Number(pdfData.terrace_open_charges_per_sft)}/-</Text></View>
            </View>
            <View>
              <Text style={styles.subfee} > ({numberToWordsString(Number(pdfData.terrace_open_area_in_sft)*Number(pdfData.terrace_open_charges_per_sft))}) excl. of
              taxes.
              </Text>
            </View>
          </>
        )
      }
    })}



       <View>   <View >
        <View ><Text style={styles.fee} >{number++}. Final Design charges as per the site areas mentioned above are ₹
        {Number(pdfData.design_charges_per_sft)*Number(pdfData.design_cover_area_in_sft)}/- (Covered area) + ₹ {Number(pdfData.balcony_area_in_sft)*Number(pdfData.balcony_charges_per_sft)}/- (Balcony area) + ₹ {Number(pdfData.terrace_covered_area_in_sft)*Number(pdfData.terrace_covered_charges_per_sft)}/- (Terrace covered area)+ ₹ {Number(pdfData.terrace_open_area_in_sft)*Number(pdfData.terrace_open_charges_per_sft)}/- (Terrace open area) = 
₹{Number(pdfData.design_charges_per_sft)*Number(pdfData.design_cover_area_in_sft)+Number(pdfData.balcony_area_in_sft)*Number(pdfData.balcony_charges_per_sft)+Number(pdfData.terrace_covered_area_in_sft)*Number(pdfData.terrace_covered_charges_per_sft)+Number(pdfData.terrace_open_area_in_sft)*Number(pdfData.terrace_open_charges_per_sft)}/-</Text></View>
        </View>
        <View>
          <Text style={styles.subfee} > ({numberToWordsString(Number(pdfData.design_charges_per_sft)*Number(pdfData.design_cover_area_in_sft)+Number(pdfData.balcony_area_in_sft)*Number(pdfData.balcony_charges_per_sft)+Number(pdfData.terrace_covered_area_in_sft)*Number(pdfData.terrace_covered_charges_per_sft)+Number(pdfData.terrace_open_area_in_sft)*Number(pdfData.terrace_open_charges_per_sft))}) 
excl. of taxes.
          </Text>
        </View></View>


        <View  >
        <View ><Text style={styles.fee} >{number++}. The Tentative Project Execution cost will be shared with you as a 
tentative estimate, after our design & scope of work discussion and 
finalization.</Text></View>

        </View>


        <View  >
        <View >
          <Text style={styles.fee7}>{number++}. Note:</Text>
          <Text style={styles.subfee}>a) Billing shall be as per covered area, as per measurement on-site.</Text>
          <Text style={styles.subfee}>b) The covered area includes all internal and external walls.</Text>
          <Text style={styles.subfee}>c) The above fees does not include services such as Landscape design, 
Govt. fees/ costs, Liaison with authorities for approval, completion, etc. </Text>
          <Text style={styles.subfee}>d) Terrace area as mentioned above excludes the mumty area.</Text>
        </View>

        <View> <Text> </Text></View>
        <View> <Text style={styles.part1}>Designing Payment Terms & Conditions
        
        </Text></View>


        </View>

        <View style={styles.design}><Text>1.</Text><Text>Interior Designing process shall commence within 5 Business days (MonFri) from the date of receipt of Mobilization Advance & Work Contract duly
signed.</Text></View>
        <View style={styles.design}><Text>2.</Text><Text>Payment Terms:</Text></View>

</View>
    
<View style={styles.scope1}>
<View style={styles.sectionfees}>
        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• Booking fee</Text>
          <Text style={styles.feePercent}>- 35% of total</Text>
        </View>
        <Text style={styles.feeDescription}>Design Fees</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• On Finalisation of Furniture Layout</Text>
          <Text style={styles.feePercent}>- 50% of total</Text>
        </View>
        <Text style={styles.feeDescription}>Design fees</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• After Finalisation of Conceptual 3D Designs</Text>
          <Text style={styles.feePercent}>- 70% of total</Text>
        </View>
        <Text style={styles.feeDescription}>Design Fees (ie, before the commencement of site execution)</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• After Finalisation of GFCs and 3Ds</Text>
          <Text style={styles.feePercent}>- 95% of total</Text>
        </View>
        <Text style={styles.feeDescription}>Design Fees</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• After handing over</Text>
          <Text style={styles.feePercent}>- 5% of total</Text>
        </View>
        <Text style={styles.feeDescription}>Design Fees</Text>
      </View>
     


      <View style={styles.section}>
        <Text style={styles.text}>The Client shall release respective payment installments within 3 days from the date of completion of stage as intimated by the Designer.</Text>
       

        <View style={styles.design}><Text>3.</Text><Text style={{fontWeight:'bold', textDecoration:'underline'}}>Site Visit</Text></View>
        <View style={styles.design}><Text> </Text><Text>Up to 10 visits to the site, by The Designer’s Design Team
shall be made to ensure suitable progress, quality, and other checks.
However, the Site Supervisor would be on the Site regularly.
</Text></View>
        <View style={styles.design}><Text>4.</Text><Text>Additional Site visits @3000/- visit for the designers, @5000/- visit for the 
head designer.
</Text></View>
      

<View style={styles.design}><Text>5.</Text><Text style={{fontWeight:'bold', textDecoration:'underline'}}>Market Visitsx</Text></View>
 
        <View style={styles.list}>

        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>One visit for stone, tile selection at the vendor location. </Text>
        </View>
        </View>

        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>One visit for furniture factory visit or finish selection at the vendor location.</Text>
        </View>
        </View>

        <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>One visit for soft furnishings selection like curtains, blinds, etc.</Text>
        </View>
        </View>
        </View>

          <View style={styles.list}>
          <View style={styles.dothead12}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View >
          <Text >In Delhi/Gurgaon - 3hrs, time is allotted</Text>
        </View>
        </View>
          <View style={styles.dothead12}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View >
          <Text >Outside Delhi/Gurgaon - 2hrs, time is allotted</Text>
        </View>
        </View>
        
        
          </View>
          <View style={styles.dothead}>
        <View ><Text style={styles.dot} >•</Text></View>
        <View>
          <Text>Visit outside Delhi/Gurgaon to include transportation costs.</Text>
        </View>
        </View>
        </View>
        <View style={styles.section}>
        <Text style={styles.text}>
          <Text>6. </Text>
          The price quoted is valid for <Text style={styles.underline}>30 days</Text> from the date of Quotation & may be revised at the time of finalisation.
        </Text>
        <Text style={styles.text}>
          <Text>7. </Text>
          Order once placed cannot be cancelled. In case of cancellation, the Fee till the stage of services prepared & rendered shall be paid and cleared.
        </Text>

</View>

      



        <View> <Text style={styles.part1}>General Terms & Conditions</Text></View>
       

        <View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >1.</Text></View>
        <View><Text style={styles.part71}>Scope</Text></View>
       
      </View>
        <View style={styles.design}><Text> </Text><Text> Implementation Work shall be completed by The Designer as per the designs finalised. WII will be the day of commencement of Work. All
        Sundays / Holidays / days when work is not permitted to be done will be
added to the timeline. A Workday is considered as 8 working hours,
excluding 1 hour of mandatory lunch & tea breaks, during the day. All
restrictions on work time like half-day work, work stoppage due to Force
Majeure / Govt. Orders / Regulatory bodies’ orders, will be added to the 
Work Time Plan.
</Text></View>


<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >2.</Text></View>
        <View><Text style={styles.part71}>Design Finalisation</Text></View>
       
      </View>
        <View style={styles.design}><Text> </Text><Text> It is reiterated that once designs are finalised, any 
changes requested thereafter, causes restart of the entire design process 
for that area, all over again. Hence, it is in the interest of both parties that 
due deliberation is given to finalise the designs and thereafter, restrict the 
scope for change, unless extremely necessary. Charges for the same are 
listed below:
</Text></View>


        
      <View style={styles.terms}>
        <Text style={styles.heading}>• Furniture Layout</Text>
        <Text style={styles.text}>Minor changes are acceptable till 1 week after finalisation of layout. Major changes / more than 2 Minor changes shall be chargeable @ ₹ 2,000/ per Major Change / more than two Minor Changes, as, each change in layout of furniture, not modular furniture is considered as a Major Change.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• LV, Electrical & False Ceiling Plans</Text>
        <Text style={styles.text}>Unlimited revisions are allowed in the drawings until finalisation. However, only 1-time minor change, free of cost up to 5 days from the date of finalisation of plans, is acceptable. Any change thereafter, shall be chargeable @ ₹ 2,000/per change. Any additional cost incurred due to the changed plan, shall be added to the Bills.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• Fixed Furniture</Text>
        <Text style={styles.text}>Unlimited revisions are allowed in the drawings until finalisation. However, only 1-time minor change is free of cost up to 3 days from the date of finalisation of plans. Any change thereafter shall be chargeable @ ₹ 2,000/ per change, provided the material for production has not been procured and/or resized as per the design to be implemented. In case any order has gone into production/material has been procured, the cost for the same, shall be borne by The Client.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• Loose Furniture</Text>
        <Text style={styles.text}>Unlimited revisions are allowed in the drawings until finalisation. However, only 1-time minor change is free of cost up to 3 days from the date of finalisation of plans. Any change thereafter shall be chargeable @ ₹ 2,000/ per change. However, NO change is acceptable after 5 days, or once the frame is made, whichever is earlier. In case any order has gone into production/material has been procured, the cost for the same, shall be borne by The Client.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• Major Changes</Text>
        <Text style={styles.text}> In case of any major change in the plan after the plans are frozen and/or work has commenced, will be reassessed, and considered as a new design/drawing/work.</Text>
      </View>
      


      <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text style={{fontWeight:'bold'}}> Orders once confirmed / closed, cannot be cancelled and are
100% payable.

</Text></View>
</View>
     <View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >3.</Text></View>
        <View><Text style={styles.part71}>3D Visualisation</Text></View>
       
      </View>
 <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>Conceptual Stage- 2 selected design options in 3D for each space as per
views mentioned in Design Contract will be provided.
</Text></View>
</View>


 


<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}> </Text><Text style={{fontFamily:'Times-Italic', color:'gray'}}>Please note, major changes in the 3D after finalisation lead to revisions in 
2D drawings and the project timeline.
</Text></View>
</View>
   

 <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>Detail Finalisation- 2 selected finish combinations in 3D for each space as
per views mentioned in Design Contract will be provided
</Text></View>
</View>

<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> Revisions. Minor revisions offered until finalisation of design, will be free,
thereafter chargeable. These will be chargeable @₹3500/ per render
</Text></View>
</View>

<View style={styles.design}><Text>4.</Text><Text>Client shall be responsible for any delay caused due to site restrictions /
hindrances, delay in approving materials, or keeping approvals on hold for 
any reason.
</Text></View>

<View style={{display:'flex' ,gap:10, flexDirection:'row', marginLeft:14}}>
       
        <View><Text style={styles.part71}>Supervision of Execution.</Text></View>
       
      </View>
<View style={styles.design}><Text>  </Text><Text> The Designer’s team shall do periodic
supervision and provide regular guidance. Supervision till the Original 
Timeline planned shall be complementary. 10 Days delay beyond the 
original timeline, shall be acceptable. Beyond that, there will be a 
Supervision cost @ ₹1,000/ per day, till Handover. 
</Text></View>


<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >5.</Text></View>
        <View><Text style={styles.part71}>Project Implementation and Completion.</Text></View>
       
      </View>

<View style={styles.design}><Text> </Text><Text>Implementation of Work will
depend on the finalisation of Design and Plans. Project Implementation is <View  style={{fontFamily:'Poppins',fontWeight:700}}>
<Text style={{fontFamily:'Poppins',fontWeight:700}}> Phase 2 of the Contract and Commences once the Designs are 
frozen, i.e. after completion of the DESIGN PHASE, ie Phase I.</Text></View>
</Text></View>

<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> As per the scope discussed till date, the project is likely to be completed 
within 120 Working days (W+ 120) from the Date of Signing of the 
Finalised BOQ, Finalised Furniture & other plans and Receipt of 
Project Implementation Mobilization Advance. In case of a major 
change in plans, the timeline shall be reassessed.
</Text></View>
</View>

<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> To Commence W period, all three conditions need to be met, i.e., 
Signing of this Contract, Signing of finalised BOQ and Payment of 
Execution Advance to the Company.      
</Text></View>
</View>



<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> W is the day of commencement of Work. Sundays will not be included in 
Work days. Similarly, Holidays (like Holi)/days when work is not 
permitted/restrictions are imposed on working, due to any reason, will 
also be added to the timeline.   
</Text></View>
</View>
    

      {/* 8thpage */}

      <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>The timeline also pertains to the freezing of all designs, except very 
limited revisions /changes, as elucidated earlier. All changes that may 
entail changes in the Timeline will be communicated. A detailed timeline 
shall be shared.
</Text></View>
</View>
      <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>As detailed above, W shall be deemed to commence from the Date of 
Signing of the finalised BOQ, Finalised Furniture and other Plans and 
receipt of Project Implementation Mobilization Advance. All delays due to 
whatsoever reason shall be communicated on the “{pdfData.project_name}” group 
and preferably on the emails as in this document. After accounting and 
adjusting for all delays, the Final Completion Date shall be arrived at.

</Text></View>
</View>

      <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> A Workday is considered as 8 working hours, excluding 1 hour of
mandatory lunch & tea breaks. Work breaks during the day or as
specified by the society’s rules & and regulations add to the timeline. 
The labour is expected to start the day around 10-10:30 am. Starting 
earlier than that regularly is not possible, even if society permits.

</Text></View>
</View>


<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >6.</Text></View>
        <View><Text style={styles.part71}>Suspension / Termination of Project.</Text></View>
       
      </View>

<View style={styles.design}><Text> </Text><Text>If the Client
suspends/terminates the work on the project, it will be communicated in 
writing on mail to biraj@colonelz.com. All payments for the works done
as per WorkSchedule will be made within two working days, from the date
of suspension/cancellation of the project. If No work is allowed on the Site
for 15 workingdays, by the Client or the Building’s Estate Management, for 
whatever reason, the work shall be deemed as Suspended. In the event of 
suspension, there may be a rate revision in case the prices of input 
materials go up by 5% or more. If work is still NOT permitted for 30 days,
it will be deemed as Termination.
</Text></View>

{pdfData.additional_note ?
<>
<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >7.</Text></View>
        <View><Text style={styles.part71}>Additional Note</Text></View>
       
      </View>
      <View style={styles.design}><Text> </Text><Text>{pdfData.additional_note}
</Text></View></>:null
}

<View> <Text style={styles.part1}>Design Implementation Payment Terms & Conditions</Text></View>

<View style={styles.design}><Text>1.</Text><Text> Work shall commence within 5 Business days from the date of receipt of
Mobilization Advance & Work Contract, duly signed.
</Text></View>

<View style={styles.design}><Text>2.</Text><Text>Payment Terms for the execution are as mentioned below (X being
thecompletion time):
</Text></View>

<View style={styles.terms}>
      <Text>a. <Text style={{fontWeight:'bold'}}> 25%</Text> Mobilization Advance based on the Proposed Plan.</Text>
      <Text>b. <Text style={{fontWeight:'bold'}}> 35%</Text> on W plus 1/3 X.</Text>
      <Text>c. <Text style={{fontWeight:'bold'}}> 35%</Text> on W plus 3/4 X</Text>
      <Text>d. <Text style={{fontWeight:'bold'}}> 5%</Text>  on Completion of Scope of Works.
</Text>
</View>


<View style={styles.design}><Text>3.</Text><Text>The price quoted for the execution will be deemed valid for the duration of 
the proposed implementation. However, there may be rate revision in case
theprices of input materials go up by 10% or more. GST @ 18% and any 
other Govt Levy, will be charged will be charged, as per actual.
</Text></View>

<View style={styles.design}><Text>4.</Text><Text style={{fontWeight:'bold'}}>Orders once confirmed and closed, cannot be cancelled.
</Text></View>





<View style={styles.header1}>
        <View style={styles.column}>
        <View style={styles.line}></View>
          <Text>{pdfData.client_name[0]}</Text>
          <Text style={styles.text}>The Client</Text>
        </View>
        <View style={styles.column}>
        <View style={styles.line}></View>
          <Text style={styles.text}>Ms. Naomi Sahay</Text>
          <Text style={styles.text}>The Designer</Text>
          <Text style={styles.text}>For</Text>
          <Text style={styles.text}>Colonelz Constructions Pvt Ltd</Text>
        </View>
      </View>
      <View style={styles.bankDetails}>
        <Text style={styles.boldText}>Bank Details:</Text>
        <Text style={styles.text}>Bank              -    HDFC Bank Account</Text>
        <Text style={styles.text}>A/c Holder    - <Text style={styles.redText}>   COLONELZ CONSTRUCTIONS PVT LTD</Text></Text>
        <Text style={styles.text}>A/c no.          -    50200007351695</Text>
        <Text style={styles.text}>IFSC               -    HDFC0000043</Text>
      </View>

      </View>
  </Page>
</Document>
)};
export const useFormikValues = () => useContext(FormikValuesContext);
const MyComponent = (data:any) => {
 
  console.log(data);
  const navigate=useNavigate()
  
  const [isLoading, setIsLoading] = useState(false);

  const handlePost = async (blob: any) => {
    setIsLoading(true); 
    const formData = new FormData();
    formData.append('lead_id', data.data.lead_id);
    formData.append('user_id', localStorage.getItem('userId') || '');
    formData.append('file', blob, `${data.data.file_name}.pdf`);
  
    const response = await addcontractinfileManager(formData);
    const result = await response.json();
  
    setIsLoading(false);
    if(result.code===200){
      toast.push(
        <Notification type='success' duration={2000}>
          Contract Created Successfully
        </Notification>
      )
    }
    else{
      toast.push(
        <Notification type='danger' duration={2000}>
          {result.errorMessage}
        </Notification>
      )
    
    }
  }
  return(
  <div>
    <BlobProvider document={<MyDocument data={data.data}/>}>
      {({ blob, url, loading, error }) => {
        if (loading) {
          return 'Loading document...';
        }
        if (error) {
          console.error(error);
          return `Error: ${error.message}`;
        }
       
        return (
          <div className='mb-6 gap-5 flex'>
            <Button variant='solid' onClick={()=>{handlePost(blob)}} loading={isLoading} type='button'>Submit</Button>
            <Button  onClick={()=>navigate(-1)}  type='button'>Discard</Button>
            {/* <a href={url || ""} target="_blank" rel="noopener noreferrer">View PDF</a>
            <a href={url || ""} download="myDocument.pdf">Download PDF</a> */}
          </div>
        );
      }}
    </BlobProvider>
    <PDFViewer width="100%" height="600">
      <MyDocument data={data.data}/>
    </PDFViewer>
  </div>
)};
 
export default MyComponent;