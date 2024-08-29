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
  partText1: {
    display:'flex',
    flexDirection:'row',
    gap:'25px',
    marginRight:55,
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
      <Text>Client                     - {pdfData.company_name}</Text>
      <Text>Designer                - Ms. Naomi Sahay</Text>
    </View>
    <View style={styles.client1}>
      <Text>Date                       - {pdfData.date}</Text>
      <Text>Quotation No         -  CCPL /23-24/ {pdfData.quotation}</Text>
      <Text>Site Address          - {pdfData.site_address}</Text>
    </View>
    <View style={styles.client1}>
      <Text>Client Contact      - {pdfData?.client_name[0]};</Text>
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
      <Text>Designer Contact  - Ms. Naomi Sahay, Principal Designer;</Text>
      </View>
      <View style={styles.client2}>
      <Text style={styles.number}>+91 8447500754, naomi@colonelz.com</Text>
    </View>
    <View style={styles.scope}>
      <Text>Scope of Work</Text>
    </View>
    <View style={styles.scope1}>
      <Text>The Scope of work entails Interior Designing & Implementation by Colonelz Constructions Pvt 
Ltd, represented by its Head Designs, Ms Naomi Sahay, (hereinafter known as “The Designer”), 
i.e., preparation of all drawings for the execution of works for the {pdfData.company_name}, at {pdfData.site_address}, represented by {pdfData.client_name[0]} (hereinafter known as “The Client”). Details 
given above.
</Text>
    </View>

    
    <View style={styles.scope1}>
    <View style={styles.partText1}>


      
       
        <View><Text style={styles.part} >Part I.</Text> </View>
        <View><Text >Interior Designing of the complete Space.
</Text> </View>
</View>
       <View style={styles.partText}>
       
      <View><Text style={styles.part} >Part II.</Text> </View>
      <View><Text >Implementation and Execution of the finalised Design as detailed by The 
Designer and approved by The Client.</Text> </View>
          </View>
      </View>

      <View><Text> </Text></View>
      <View><Text> </Text></View>
      <View><Text> </Text></View>
      <View><Text> </Text></View>
      <View><Text> </Text></View>

      <View style={styles.scopepart}>
       <Text style={styles.part1}>Part I</Text></View>
      <View style={styles.scope1}><Text style={styles.text1}>This is the Designing Part, which will be covered in 2 sections:

</Text></View>
      <View style={styles.part1Text}>
        <View><Text style={styles.part11} >1.</Text></View>
        <View><Text style={styles.part12}>Phase I –Conceptual Stage,</Text></View>
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

     <View style={styles.section}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Conceptual 3D Views: </Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Exterior x 1 angle view with 1-2 design options</Text>
          <Text style={styles.listItem}>{`>`}   Interior x 2 angle views per space with 1-2 finish options</Text>
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
     <View><Text >Zoning
</Text></View>
     </View>  
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text > Floor Plan
 </Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Elevations where required.
</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Structural Layout</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Furniture Layout </Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Electrical Layout</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Plumbing Layout</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >False Ceiling Layout</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text > Toilet Layout</Text></View>
     </View>
     </View>
     <View style={styles.scope1}>
<View><Text>(Please note: The spaces shall be defined and finalized as per the space available at the 
site, and the final furniture layout)
 </Text></View>
 </View>

 <View style={styles.part1Text}>
        <View><Text style={styles.part11} >2.</Text></View>
        <View><Text style={styles.part12}>Phase II –GFC Stage:</Text></View>
      </View>
      <View style={styles.part13}>
        <View> <Text style={styles.part11}>a.</Text></View>
        <View> <Text style={styles.part14}> Stage 2: Design Development Phase 1</Text></View>
      </View>
 
      <View style={styles.scope13}>
     <View style={styles.section}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Detailed 3D Views (with finalized details):</Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}    Exterior x 2 angle views</Text>
          <Text style={styles.listItem}>{`>`}    Interior x 6 angle views</Text>
        </View>
      </View>

     </View>

     <View style={styles.part13}>
        <View> <Text style={styles.part11}>b.</Text></View>
        <View> <Text style={styles.part14}> Stage 3: Good for Construction (GFC) Drawings </Text></View>
      </View>

      <View style={styles.scope13}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Furniture Layout incorporating all additions and changes requested
</Text></View>
     </View>
   

     <View style={styles.section}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Flooring Layout Plan</Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Detailed Space Plan/Furniture Layout</Text>
          <Text style={styles.listItem}>{`>`}   Floor Finish Detail</Text>
          <Text style={styles.listItem}>{`>`}    Floor LVL Layout</Text>
        </View>
      </View>
     <View style={styles.section}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Plumbing Details </Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Water Supply Layout</Text>
          <Text style={styles.listItem}>{`>`}   Drain Layout</Text>
          <Text style={styles.listItem}>{`>`}   Wall Elevations for plumbing points</Text>
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
          <Text style={styles.listItem}>{`>`}   Ceiling Plan</Text>
          <Text style={styles.listItem}>{`>`}   Ceiling Lighting Plan </Text>
          <Text style={styles.listItem}>{`>`}   Ceiling Finish Detail</Text>
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
          <Text style={styles.listItem}>{`>`}   Looping Detail</Text>
          <Text style={styles.listItem}>{`>`}   Wall Lighting Plan</Text>
          <Text style={styles.listItem}>{`>`}    Wall Electrical</Text>
        </View>
      </View>


     <View style={styles.section}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View>
      <Text>Wall Finishes Plan </Text>
     </View>
     </View>
        <View style={styles.list}>
          <Text style={styles.listItem}>{`>`}   Wall Elevations</Text>
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
          <Text style={styles.listItem}>{`>`}   Wall Paneling</Text>
          <Text style={styles.listItem}>{`>`}   Loose Furniture</Text>
          <Text style={styles.listItem}>{`>`}   Storages Details </Text>
          <Text style={styles.listItem}>{`>`}   Wooden Ceiling Detail</Text>
          <Text style={styles.listItem}>{`>`}   Moulding & Detailing if any</Text>
        </View>
      </View>

     </View>


     <View style={styles.part13}>
        <View> <Text style={styles.part11}>c.</Text></View>
        <View> <Text style={styles.part14}>  Stage 4: Documents & BOQs </Text></View>
      </View>

      <View style={styles.scope13}>
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Light fixtures BOQ
</Text></View>
     </View>  
      <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text > Furniture BOQ
 </Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Electrical BOQ
</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Plumbing BOQ</Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Tiling BOQ </Text></View>
     </View>
     <View style={styles.dothead}>
     <View ><Text style={styles.dot} >•</Text></View>
     <View><Text >Furnishing BOQ</Text></View>
     </View>
     </View>


     

    

    <View style={styles.scope1}>
    <View> <Text style={styles.part1}>Part II</Text></View>
      <View><Text style={styles.text1}>The Designer shall implement the Design as finalized with The Client, with Quality 
checks, coordination and supervision with all teams.
</Text></View>
</View>


    <View style={styles.scopepart}>
    <View> <Text style={styles.part1}>Fee Proposal</Text></View>
      <View><Text style={styles.text1}>The Designing & Project Management will be done as per the following rates;
</Text></View>
      <View><Text style={styles.text1}>Total cost for Designing and Supervision shall be INR <Text style={{textDecoration:'underline'}}>{pdfData.design_charges}</Text>/excl. taxes <Text>(Rupees {numberToWordsString(pdfData.design_charges)}</Text> Only)
applicable solely to the “{pdfData.company_name}” situated at “{pdfData.site_address}”.
</Text></View>
      <View><Text style={styles.text1}>For all “{pdfData.company_name}” Projects at other locations, the contract will be duly 
modified based on the Location & the Scope of work.
</Text></View>
      <View><Text style={styles.text1}>The Client shall release respective payment instalments within 3 days from the date of 
completion of stage OR intimation from the Designer as elucidated below:
</Text></View>


     




        <View  >

        <View> <Text> </Text></View>
        <View> <Text style={styles.part1}>Designing Payment Terms & Conditions
        
        </Text></View>


        </View>

        <View style={styles.design}><Text>1.</Text><Text>Design work shall commence within 2 Business days (Mon-Fri) from the date of receipt 
of Mobilization Advance & Work Contract duly signed.
</Text></View>
        <View style={styles.design}><Text>2.</Text><Text>Payment Terms:</Text></View>

</View>
    
<View style={styles.scope1}>
<View style={styles.sectionfees}>
        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• Booking fee</Text>
          <Text style={styles.feePercent}>- 35% of total Design &</Text>
        </View>
        <Text style={styles.feeDescription}>Project Management Fees</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• On Finalisation of Furniture Layout</Text>
          <Text style={styles.feePercent}>- 50% of total Design &</Text>
        </View>
        <Text style={styles.feeDescription}>Project Management Fees</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• After Finalisation of Conceptual 3D Designs</Text>
          <Text style={styles.feePercent}>- 70% of total Design & </Text>
        </View>
        <Text style={styles.feeDescription}>Project Management Fees (ie, before the commencement of site execution)
</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• After Finalisation of GFCs and 3Ds</Text>
          <Text style={styles.feePercent}>- 95% of total Design &</Text>
        </View>
        <Text style={styles.feeDescription}>Project Management Fees</Text>

        <View style={styles.feeItem}>
          <Text style={styles.feeTitle}>• After handing over</Text>
          <Text style={styles.feePercent}>- 05% of total Design &</Text>
        </View>
        <Text style={styles.feeDescription}>Project Management Fees</Text>
      </View>
     


      <View style={styles.section}>
        <Text style={styles.text}>The Client shall release respective payment instalments within 3 days from the date of 
completion of stage OR intimation from the Designer.</Text>
       

        <View style={styles.design}><Text>3.</Text><Text style={{fontWeight:'bold', textDecoration:'underline'}}>Site Visit</Text></View>
        <View style={styles.design}><Text> </Text><Text> A total of 8 site visits are included in the cost. Any visit thereafter will be 
chargeable @ ₹3000/ per visit for 2 hours on site. Every additional 30 mins will be 
charged @ ₹500/ per half an hour. The Designer’s design team shall be visiting as 
given above, to ascertain the progress, quality etc.
</Text></View>
        <View style={styles.design}><Text>4.</Text><Text>The price quoted is valid for 30 days from the date of Quotation & may be revised at 
the time of finalization.
</Text></View>
        <View style={styles.design}><Text>5.</Text><Text>GST @ 18% will be additionally charged on the total fee. In case of any Policy Change 
by the Govt., Taxes & duties will be charged as per actual.
</Text></View>
        <View style={styles.design}><Text>6.</Text><Text>Order once placed cannot be cancelled. In case of cancellation, the Fee till the stage of 
services prepared & rendered shall be paid and cleared.
</Text></View>
        <View style={styles.design}><Text>7.</Text><Text>The Design and Project Management charges outlined above are valid for the project 
duration of 6 months. Should the project extend beyond this period, the Design and 
Project Management charges for the extended duration will be subject to re-evaluation 
and discussion.
</Text></View>
</View>


        <View> <Text style={styles.part1}>General Terms & Conditions</Text></View>
       

        <View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >1.</Text></View>
        <View><Text style={styles.part71}>Scope</Text></View>
       
      </View>
        <View style={styles.design}><Text> </Text><Text> Implementation Work shall be completed as per the plan mutually decided, 
which will be placed on a Pert Chart. W will be the day of commencement of Work. All 
Sundays / days when work is not permitted to be done will be added to the timeline. As 
the entire work has to be done between 11 PM to 8 AM, the timelines will be worked out 
accordingly. All restrictions on work time will be added to the Work Plan. Day to Day 
Handling of the Commercial Site’s Real Estate Manager or the Building Management will 
be done by Colonelz. However, in case of any levies, disputes, etc., the same shall be 
handled by the Client
</Text></View>


<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >2.</Text></View>
        <View><Text style={styles.part71}>Design Finalisation</Text></View>
       
      </View>
        <View style={styles.design}><Text> </Text><Text> It is reiterated that once designs are finalised, any changes 
requested thereafter, causes restart of the entire design process for that area, all over 
again. Hence, it is in the interest of both parties that due deliberation is given to finalise 
the designs and thereafter, restrict the scope for change, unless extremely necessary. 
Charges for the same are listed below:
</Text></View>


        
      <View style={styles.terms}>
        <Text style={styles.heading}>• Furniture Layout</Text>
        <Text style={styles.text}> Minor changes are acceptable till 1 week after the finalization of 
layout. Any major changes / more than 2 changes shall be chargeable @ ₹ 4,000/ 
per major change, eg, each change in layout of furniture, incl modular furniture is 
considered as a major change.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• LV, Electrical & False Ceiling Plans</Text>
        <Text style={styles.text}> Unlimited revisions allowed in the drawings 
until finalization. However, only 1-time minor changes are free of cost up to 5 days 
from the date of finalization of plans. Any change thereafter shall be chargeable @ 
₹,2,000/ per change. Any additional cost incurred to change the plan, shall be added 
to the Bills.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• Fixed Furniture</Text>
        <Text style={styles.text}> Unlimited revisions are allowed in the drawings until finalization. 
However, only 1-time minor changes are free of cost up to 3 days from date of 
finalization of plans. Any change thereafter shall be chargeable @ ₹ 2,000/ per 
change, provided the material for production has not been procured and / or resized 
as per the design to be implemented.</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• Loose Furniture</Text>
        <Text style={styles.text}> Unlimited revisions are allowed in the drawings until finalization. 
However, only 1-time minor changes are free of cost up to 3 days from date of 
finalization of plans. Any change thereafter shall be chargeable @ ₹ 2,000/ per 
change. However, NO change is acceptable after 5 days, or once the frame is made, 
whichever is earlier</Text>
      </View>
      <View style={styles.terms}>
        <Text style={styles.heading}>• Major Changes</Text>
        <Text style={styles.text}>  In case of any major change in plan after the plans are frozen and 
/ or work has commenced, will be reassessed, and considered as a new design/
drawing/ work.</Text>
      </View>
      


      <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text style={{fontWeight:'bold'}}> Orders once confirmed / closed, cannot be cancelled and are 100% payable.

</Text></View>
</View>
     <View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >3.</Text></View>
        <View><Text style={styles.part71}>3D Visualisation</Text></View>
       
      </View>
 <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> Conceptual Stage- 2 selected design options in 3D for each space as per views 
mentioned in Design Contract will be provided.
</Text></View>
</View>


   

 <View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> Detail Finalization- 2 selected finish combinations in 3D for each space as per views 
mentioned in Design Contract will be provided.
</Text></View>
</View>

<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> Revisions- minor revisions offered until finalization of design, will be free, thereafter 
chargeable; these will be chargeable @₹4000/ per render view.
</Text></View>
</View>

  <View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >4.</Text></View>
        <View><Text style={styles.part71}>Changes and Approvals. </Text></View>
       
      </View>

<View style={{display:'flex' ,gap:10, flexDirection:'row', marginLeft:14}}>
       
        <View><Text style={styles.part71}>Changes</Text></View>
       
      </View>
<View style={styles.design}><Text>  </Text><Text>Any major change in the Furniture Layout / Toilets / Electrical & other plan, 
leads to relook of the entire plan, and making of fresh drawings, which adds on to our 
timeline minimum 3 working days (Designer workdays are Monday to Friday). However, 
minor changes like an additional switch point at an existing place, which do not need 
major modifications in the plan, will be acceptable without delay clause. Changes in 
plans of Furniture and items to be customized, if requested to be changed by The Client, 
6
will be at Fresh Cost and added to the timeline also. The Client shall be responsible for 
any delay caused due to site restrictions / hindrances, etc.
</Text></View>


<View style={{display:'flex' ,gap:10, flexDirection:'row', marginLeft:14}}>
       
        <View><Text style={styles.part71}>Approvals.</Text></View>
       
      </View>
<View style={styles.design}><Text>  </Text><Text> To keep the pace of work speedy approvals of materials is paramount. Any 
material, fixtures / fittings like Laminates, ACs, Lights, tiles, electrical switches etc,
shall be approved by the Client within 3 working days including the day of receiving the 
necessary files/ samples/ estimates, etc (files sent during working hours). Any further 
delay or keeping approvals on hold for any reason shall be added to the Project Timeline.
</Text></View>


<View style={styles.design}><Text>5.</Text><Text>Client shall be responsible for any delay caused due to site restrictions / hindrances, 
delay in approving materials, or keeping approvals on hold for any reason.
</Text></View>
<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} > </Text></View>
        <View><Text style={styles.part71}>Supervision of Execution.</Text></View>
       
      </View>

<View style={styles.design}><Text> </Text><Text>. The Designer’s team shall do periodic supervision and 
provide regular guidance. Supervision till the Original Timeline planned shall be 
complementary. 10 Days delay beyond the original timeline, shall be acceptable. 
Beyond that, there will be a Supervision cost @ ₹1,000/ per day, till Handover
</Text></View>


<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >6.</Text></View>
        <View><Text style={styles.part71}>Project Implementation and Completion. </Text></View>
       
      </View>
        <View style={styles.design}><Text> </Text><Text>Implementation of Work will depend on 
the finalization of the Design and Plans. This is Phase 2 of the Contract and 
commences once the Designs are frozen. 
</Text></View>


<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text> As per the <Text style={{textDecoration:'underline'}}>scope discussed till date</Text>, the project is likely to be completed within {pdfData.working_days} Working days (W+{pdfData.working_days}). W shall commence from day after the Date of 
Signing of finalized BoQ, Finalized Furniture & other plans and Receipt of 
Project Implementation Mobilization Advance. In case of major change in 
plans, the timeline shall be reassessed. 
</Text></View>
</View>

<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>W starts from the date of signing of this Contract, Signing of finalized BoQ & 
payment of Execution Advance to the Company, signing of all three documents 
mandatory.     
</Text></View>
</View>



<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>W is the day of commencement of Work. Sundays will be included in Workdays. 
However, Holidays (like Holi) / days when work is not permitted /restrictions 
imposed on working, due to any reason, will be added to the timeline.  
</Text></View>
</View>
<View style={styles.terms}>
      <View style={styles.design}><Text style={{fontWeight:"bold"}}>•</Text><Text>The timeline also pertains to the <Text style={{textDecoration:'underline'}}>freezing of all designs</Text>, except very limited 
revisions /changes, as elucidated earlier. All changes which may entail a change 
in Timeline will be communicated. A detailed timeline shall be shared. 
</Text></View>
</View>
    

      {/* 8thpage */}

      

      


<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >7.</Text></View>
        <View><Text style={styles.part71}>Suspension / Termination of Project.</Text></View>
       
      </View>

<View style={styles.design}><Text> </Text><Text> If the Client suspends/terminates the work 
on the project, it will be communicated in writing on mail to biraj@colonelz.com. All 
payments for the works done as per Work Schedule will be made within two working 
days, from the date of suspension/cancellation of the project. If No work is allowed on 
the Site for 15 working days, by the Client or the Building’s Estate Management, for 
whatever reason, the work shall be deemed as Suspended. In the event of suspension, 
there may be a rate revision in case the prices of input materials go up by 5% or more. 
If work is still NOT permitted for 30 days, it will be deemed as Termination.
</Text></View>

{pdfData.additional_note ?
<>
<View style={{display:'flex' ,gap:10, flexDirection:'row'}}>
        <View><Text style={styles.part11} >8.</Text></View>
        <View><Text style={styles.part71}>Additional Note</Text></View>
       
      </View>
      <View style={styles.design}><Text> </Text><Text>{pdfData.additional_note}
</Text></View></>:null
}


<View> <Text style={styles.part1}>Design Implementation Payment Terms & Conditions</Text></View>

<View style={styles.design}><Text>1.</Text><Text> Work shall commence within 5 Business days from the date of receipt of Mobilization 
Advance & Work Contract, duly signed.
</Text></View>

<View style={styles.design}><Text>2.</Text><Text>Payment Terms for the execution is as mentioned below (X being the completion time):
</Text></View>

<View style={styles.terms}>
      <Text>a. <Text style={{fontWeight:'bold'}}> 25%</Text> Mobilization Advance based on the Proposed Plan.</Text>
      <Text>b. <Text style={{fontWeight:'bold'}}> 30%</Text> on W plus 21 X.</Text>
      <Text>c. <Text style={{fontWeight:'bold'}}> 35%</Text> on W plus 35 X.</Text>
      <Text>d. <Text style={{fontWeight:'bold'}}> 5%</Text>  on Completion of Scope of Works.
</Text>
</View>


<View style={styles.design}><Text>3.</Text><Text>Price quoted for the execution will be deemed valid for the duration of the proposed 
implementation. However, there may be rate revision in case the prices of input 
materials go up by 10% or more. GST @ 18% will be charged additionally, on the total 
fee. In case of any Policy Change by the Govt, Taxes & duties will be charged as per 
actual.
</Text></View>

<View style={styles.design}><Text>4.</Text><Text style={{fontWeight:'bold'}}>Orders once confirmed and closed, cannot be cancelled.
</Text></View>






<View style={styles.header1}>
        <View style={styles.column}>
        <View style={styles.line}></View>
          <Text>{pdfData.company_name}</Text>
          <Text style={styles.text}>Client</Text>
        </View>
        <View style={styles.column}>
        <View style={styles.line}></View>
          <Text style={styles.text}>Ms. Naomi Sahay</Text>
          <Text style={styles.text}>Principal Designer</Text>
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
 
  const navigate = useNavigate();
  
  
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