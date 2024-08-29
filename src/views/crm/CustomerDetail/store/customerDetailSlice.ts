export const SLICE_NAME = 'crmCustomerDetails'

export type Notes = {
    content: string
    
}
export type minutesofMeeting = {
    id: string
    mode: string
    meetingDate:string

}

type mom={
   mom_id:string
}
export type Project = {
    data:Data
}
export type Data = {
    data:Customer
}
type Client = {
    client_name:string
    client_email:string
    client_contact:string

}
export type Customer = {
    id: string
    designer:string
    client:Client[]
    project_name: string
    project_id:string
    project_type:string
    project_status:string
    project_start_date:string
    project_end_date:string
    timeline_date:string
    project_budget:string
    description:string
    notes: Notes
    mom:[]
    project_updated_by:ProjectUpdate[]
    
}
 export type ProjectUpdate = {
    updated_date:string
    username:string
    message:string
    role:string
}
export type Tasks = {
    project_id: string;
    task_id: string;
    task_name: string;
    task_description: string;
    actual_task_start_date: string;
    actual_task_end_date: string;
    estimated_task_start_date: string;
    estimated_task_end_date: string;
    task_status: string;
    task_priority: string;
    task_createdOn: string;
    reporter: string;
    task_createdBy: string;
    number_of_subtasks: number;
    user_id: string;
    task_assignee: string;
    percentage:string;
};


