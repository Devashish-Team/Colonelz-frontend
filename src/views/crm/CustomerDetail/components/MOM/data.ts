

export type Attendees = {
  client_name: string[] | null;
  organisor: string[];
  designer: string[];
  attendees: string[];
};

export type MomData = {
  mom_id: string;
  meetingdate: string;
  location: string;
  attendees: Attendees;
  remark: string;
  imaportant_note: string;
  files: any[]; // Add a proper type for files if needed
};
export type Data={
  client_name:string;
  momdata:MomData[]
}
export type ApiResponse = {
  message: string;
  status: boolean;
  errorMessage: string;
  code: number;
  data:Data;
  subrow:ApiResponse[]
};




