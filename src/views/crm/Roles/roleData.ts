import { apiGetRoleDetails, apiGetRoleWiseDetails } from "@/services/CommonService";

type RoleAccessPermissions = {
    read?: string[];
    create?: string[];
    update?: string[];
    delete?: string[];
    restore?: string[];
  };
  
  type ModuleNames = 
    | "user"
    | "lead"
    | "project"
    | "task"
    | "file"
    | "mom"
    | "archive"
    | "contract"
    | "quotation"
    | "addMember"
    | "userArchive"
    | "role"
    | "companyData";
  
  type RoleAccessData = {
    message: string;
    status: boolean;
    errorMessage: string;
    code: number;
    data: {
      [key in ModuleNames]?: RoleAccessPermissions;
    };
  };


  export async function fetchRoleAccessData(): Promise<RoleAccessData> {
    const response = await apiGetRoleWiseDetails(); 
    return response;
  }
  fetchRoleAccessData()
    .then((roleAccessData) => {
      console.log("Fetched role access data:", roleAccessData);
    })
    .catch((error) => {
      console.error("Error fetching role access data:", error);
    });
  