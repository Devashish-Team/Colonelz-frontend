// types.ts

export interface Attendees {
    client_name: string;
  }
interface Files{

}
  
  export interface Mom {
    mom_id: number;
    meetingdate: string;
    source: string;
    attendees: Attendees;
    location:string
    files:Files[]
  }
  
  export interface Project {
    project_name: string;
    mom: Mom[];
  }
  