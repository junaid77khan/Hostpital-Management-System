import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import QuestionTree from './QuestionTree';

function Structure() {
  const [problems, setProblems] = useState([]);

  const fetchProblems = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/problems/fetch_problems.php`);
      const data = await response.json();
      setProblems(data);
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  useEffect(() => {
    fetchProblems();
  }, []);

  return (
    <div className="flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className='shadow-md p-4'>
          <QuestionTree 
            items={problems} 
            refreshProblems={fetchProblems}
          />
        </div>
      </div>
    </div>
  );
}

export default Structure