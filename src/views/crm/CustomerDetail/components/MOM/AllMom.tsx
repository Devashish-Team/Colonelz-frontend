import { Button, Card, Dropdown, Input } from '@/components/ui';
import React, { useContext, useEffect, useState } from 'react';
import { MomData } from './data';
import { useLocation } from 'react-router-dom';
import { apiGetCrmProjectsMom } from '@/services/CrmService';
import { useMomContext } from '../../store/MomContext';
import { BsThreeDotsVertical } from 'react-icons/bs';
import parse, { domToReact, HTMLReactParserOptions } from 'html-react-parser';

interface Attendees {
  client_name: string[];
  [key: string]: string | string[];
}

interface LeadDataItem {
  mom_id: string;
  meetingdate: string;
  location: string;
  attendees: Attendees;
  remark: string;
  important_note: string;
}

interface File {
  fileUrl: string;
  fileName: string;
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedText, setHighlightedText] = useState<string>('');
  const [searchInput, setSearchInput] = useState<string>('');
  const { leadData, client } = useMomContext();

  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    setSearchInput(term);
    setHighlightedText(term);
  };

  const handleSearchButtonClick = () => {
    setHighlightedText(searchTerm);
  };

  interface QueryParams {
    id: string;
    project_id: string;
    mom: string;
  }
  type Files = {
    fileUrl: string;
  }

  const location = useLocation();
  const [data, setdata] = useState([] as LeadDataItem[] | null);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const projectId = searchParams.get('project_id');
    if (projectId) {
      const fetchData = async () => {
        try {
          const response = await apiGetCrmProjectsMom(projectId);
          const data = response;
          setdata(data.data.mom_data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchData();
    }
  }, [location.search]);

  const filteredMomData = data? data.filter((item) => {
      const searchIn = (str: string | unknown): boolean => {
        if (str === undefined) {
          return false;
        }
        return str?.toLowerCase().includes(searchTerm.toLowerCase());
      };

      return (
        searchIn(item.mom_id) ||
        searchIn(item.meetingdate) ||
        searchIn(item.location) ||
        (Array.isArray(item.attendees.client_name) && searchIn(item.attendees.client_name.join(', '))) ||
        searchIn(item.remark) ||
        searchIn(item.important_note) ||
        (item.attendees && Object.entries(item.attendees).some(([key, value]) => searchIn(value)))
      );
    })
    : [];

  const highlightText = (text: string, isDate: boolean = false): JSX.Element => {
    if (!highlightedText.trim()) {
      return <>{text}</>;
    }

    const regex = new RegExp(`(${highlightedText})`, 'gi');
    const parts = text ? text.split(regex) : [];

    return (
      <>
        {parts.map((part, index) =>
          regex.test(part) ? (
            <span
              key={index}
              className=" bg-[#FFFF00] bg-opacity-100 text-black rounded-md"
            >
              {isDate && regex.test(part) && text
                ? new Date(part).toISOString().split('T')[0]
                : part}
            </span>
          ) : (
            <span key={index}>{part}</span>
          ),
        )}
      </>
    )
  };

  const highlightHtmlText = (html: string) => {
    const options: HTMLReactParserOptions = {
      replace: (domNode) => {
        if (domNode.type === 'text') {
          return highlightText(domNode.data);
        }
      },
    };
    return parse(html, options);
  };

  const getNames = (names: string[] | string) => {
    if (Array.isArray(names)) {
      return names.join(', ');
    } else if (typeof names === 'string') {
      return names;
    }
    return 'Invalid format';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getUTCDate()).padStart(2, '0');
    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
    const year = date.getUTCFullYear();

    return `${day}-${month}-${year}`;
  };

  return (
    <>
      <div className="flex justify-between ">
        <h3>MOM Data</h3>
        <Input
          type="text"
          placeholder="Search..."
          value={searchInput}
          className=" w-1/5"
          size='sm'
          onChange={handleSearchInputChange}
        />
      </div>
      <div>
        {filteredMomData.length > 0 ? (
          filteredMomData.map((rowData: any) => (
            <Card className='my-6'>
              <main className="pb-10 ">
                <div className=" dark:bg-gray-950 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between mb-8">
                      <h2 className="text-2xl font-bold">Meeting Details</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className='flex gap-1 items-center'>
                          <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">Location: </p>
                          <p className=' text-base'>{highlightText(getNames(rowData.location))}</p>
                        </div>
                        <div className='flex gap-1 items-center'>
                          <p className="text-gray-500 dark:text-gray-400 font-semibold text-lg">Date: </p>
                          <p className=' text-base'>{highlightText(formatDate(rowData.meetingdate))}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl">Attendees</p>
                        <ul className="space-y-1">
                          <li className=' text-base'><span className='font-semibold text-lg'>Client:</span> {highlightText(rowData.attendees.client_name ? rowData.attendees.client_name : "-")} </li>
                          <li className=' text-base'><span className='font-semibold text-lg'>Organizer:</span> {highlightText(rowData.attendees.organisor ? rowData.attendees.organisor : "-")} </li>
                          <li className=' text-base'><span className='font-semibold text-lg'>Others:</span> {highlightText(rowData.attendees.attendees ? rowData.attendees.attendees : "-")} </li>
                        </ul>
                      </div>
                    </div>
                    <div className='mb-6'>
                      <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl ">Remarks</p>
                      <div className="remark-content">{highlightHtmlText(rowData.remark)}</div>
                    </div>
                    <div>
                      <p className="text-gray-500 dark:text-gray-400 font-semibold text-xl">Files</p>
                      <div className="space-y-2">
                        {rowData.files.length > 0 ? (
                          rowData.files.map((file: File) => (
                            <a className="flex items-center gap-2 text-blue-600 hover:underline" href={file.fileUrl} target='_blank'>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="24"
                                height="24"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                              >
                                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
                                <polyline points="14 2 14 8 20 8"></polyline>
                              </svg>
                              {highlightText(getNames(file.fileName.length > 20 ? `${file.fileName.substring(0, 20)}...` : file.fileName))}
                            </a>
                          ))
                        ) : (
                          <p>No files</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </main>
            </Card>
          ))) : (
          <div style={{ textAlign: 'center' }}>No Mom Data</div>
        )}
      </div>
    </>
  )
}

export default App;