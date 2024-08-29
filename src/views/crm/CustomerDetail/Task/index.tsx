import React, { useEffect, useState } from 'react'
import Task from './Task'
import { useLocation } from 'react-router-dom';
import { apiGetCrmProjectsTaskData } from '@/services/CrmService';
import { Tasks } from '../store';
type Data={
  task:Tasks[]
  users:string[]
}


const Index = ({task,users}:Data) => {
  console.log(users);
  
  
  
  return (
    <div><Task task={task} users={users} /></div>
  )
}

export default Index