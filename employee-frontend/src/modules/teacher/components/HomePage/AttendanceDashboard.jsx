import React from 'react';

const AttendanceDashboard = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto font-sans">
      {/* Tabs */}
      {/* <div className="flex space-x-4 border-b mb-6">
        <button className="px-4 py-2 bg-gray-300 font-semibold">Dashboard</button>
        <button className="px-4 py-2">School Student Attendance</button>
        <button className="px-4 py-2">College Student Attendance</button>
      </div> */}

      {/* Calendar */}
      <div>
        <h2 className="text-lg font-semibold mb-2">Calendar</h2>
        <div className="grid grid-cols-7 gap-1 border p-4 rounded">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-bold border py-2">
              {day}
            </div>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const date = i + 1;
            const highlight = date === 10;
            return (
              <div
                key={date}
                className={`text-center border py-2 ${
                  highlight ? 'bg-green-500 text-white font-bold' : ''
                }`}
              >
                {date}
              </div>
            );
          })}
        </div>
      </div>

      {/* Manual Attendance */}
      <div className="mt-8">
        <h3 className="text-md font-semibold mb-2">Manual Attendance</h3>
        <p className="text-red-600 font-bold mb-2">Logged out successfully!</p>

        <div className="flex items-center space-x-2 mb-4">
          <label className="flex items-center space-x-2">
            <input type="checkbox" />
            <span>Share Location</span>
          </label>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">Log In</button>
          <button className="bg-blue-600 text-white px-3 py-1 rounded">Log Out</button>
          <button className="bg-green-600 text-white px-3 py-1 rounded">
            Submit Manual Attendance
          </button>
        </div>

        {/* Attendance Table */}
        <table className="w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2 text-left">Action</th>
              <th className="border px-4 py-2 text-left">Date</th>
              <th className="border px-4 py-2 text-left">Time</th>
              <th className="border px-4 py-2 text-left">Location</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border px-4 py-2">Log In</td>
              <td className="border px-4 py-2">2023-05-10</td>
              <td className="border px-4 py-2">15:00</td>
              <td className="border px-4 py-2">Not shared</td>
            </tr>
            <tr>
              <td className="border px-4 py-2">Log Out</td>
              <td className="border px-4 py-2">2023-05-10</td>
              <td className="border px-4 py-2">15:00</td>
              <td className="border px-4 py-2">Not shared</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default  AttendanceDashboard;