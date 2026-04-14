import React from 'react'
import SideNavbar from './SideNavbar'

const UserPreviousIssue = () => {
  const previousIssues = [
  {
    id: "ISSUE001",
    title: "AC not cooling",
    description: "AC is running but not cooling properly",
    category: "AC Repair",
    status: "Completed", // Pending | In Progress | Completed
    price: 500,
    expertName: "Rohit Sharma",
    date: "2026-04-10",
    time: "04:30 PM",
    location: "Delhi",
    rating: 4.5
  },
  {
    id: "ISSUE002",
    title: "Water leakage in kitchen",
    description: "Pipe is leaking under sink",
    category: "Plumbing",
    status: "In Progress",
    price: 300,
    expertName: "Amit Verma",
    date: "2026-04-12",
    time: "11:00 AM",
    location: "Noida",
    rating: null
  },
  {
    id: "ISSUE003",
    title: "Fan not working",
    description: "Ceiling fan stopped suddenly",
    category: "Electrical",
    status: "Pending",
    price: 200,
    expertName: null,
    date: "2026-04-13",
    time: "02:15 PM",
    location: "Ghaziabad",
    rating: null
  },
  {
    id: "ISSUE004",
    title: "Washing machine noise",
    description: "Machine making loud noise while spinning",
    category: "Appliance Repair",
    status: "Completed",
    price: 700,
    expertName: "Suresh Kumar",
    date: "2026-04-08",
    time: "06:00 PM",
    location: "Delhi",
    rating: 5
  }
];
  return (
    <div className='w-full min-h-screen flex'>
  
  {/* Sidebar */}
  <SideNavbar />

  {/* Main Content */}
  <div className='flex flex-col items-center w-full p-6 gap-4 bg-gray-100'>
    
    {previousIssues.map((prev) => (
      <div 
        key={prev.id} 
        className='w-full max-w-[600px] bg-white shadow hover:shadow-lg p-4 rounded-lg cursor-pointer'
      >
        <h2 className='font-semibold'>{prev.title}</h2>
        <p className='text-sm text-gray-500'>{prev.description}</p>

        <div className='flex justify-between mt-2'>
          <p>Status: {prev.status}</p>
          <p>₹{prev.price}</p>
        </div>

        <p className='text-xs text-gray-400 mt-1'>
          {prev.date} • {prev.time}
        </p>
      </div>
    ))}

  </div>

</div>
  )
}

export default UserPreviousIssue
