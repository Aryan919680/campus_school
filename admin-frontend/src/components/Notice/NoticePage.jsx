import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import NoticeForm from "./NoticeForm";
import API_ENDPOINTS from '../../API/apiEndpoints';
import UpdateNoticePage from "./UpdateNoticePage";

export default function NoticePage() {
  const [openForm, setOpenForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [notices, setNotices] = useState([]);
  const [editNotice, setEditNotice] = useState(null);
  const [editPage, setEditPage] = useState(false)
  const fetchNotices = useCallback(async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      const token = userData?.token;

      const response = await axios.get(API_ENDPOINTS.GET_NOTICES(), {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotices(response.data.data || []);
    } catch (error) {
      console.error("Error fetching notices:", error.response?.data || error.message);
      setErrorMessage("Failed to load notices.");
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleForm = useCallback(() => {
    setEditNotice(null);
    setOpenForm(true);
  }, []);

  const handleEdit = useCallback((notice) => {
    setEditNotice(notice);
    // setOpenForm(true);
    setEditPage(true);
  }, []);

  const onClose = useCallback(() => {
    setOpenForm(false);
    setErrorMessage("");
    fetchNotices();
  }, [fetchNotices]);

  return (
    <div className="bg-white p-8 rounded-md w-full">
      <div className="flex items-center justify-between pb-6 flex-wrap gap-2">
        <h2 className="text-gray-600 font-semibold text-2xl">Notice</h2>
        <div className="flex justify-center items-center">
          <button
            onClick={handleForm}
            className="bg-linear-blue text-white font-bold py-2 px-4 rounded w-full md:w-fit"
          >
            Add Notice
          </button>
        </div>
      </div>

      {errorMessage && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{errorMessage}</span>
        </div>
      )}

      {/* Grid of Notices */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-6">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <div
              key={notice.id}
              className="p-6 bg-gray-100 rounded-lg shadow hover:shadow-lg transition-all flex flex-col justify-between"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{notice.type}</h3>
                <p className="text-gray-600 ">{notice.text}</p>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => handleEdit(notice)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold px-4 py-2 rounded-md text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500">No notices found.</div>
        )}
      </div>

      {openForm && (
        <NoticeForm
          onClose={onClose}
          editNotice={editNotice}
        />
      )}
      {
        editPage && (
            <UpdateNoticePage noticeData={editNotice} setEditPage={setEditPage}/>
        )
      }
    </div>
  );
}
