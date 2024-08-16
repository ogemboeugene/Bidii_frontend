import React, { useRef, useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpandArrowsAlt, faTable, faSort, faFilter } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import FormRecordsWindow from '../forms/FormRecordsWindow';
import "./css/HistoryTable.css";

const HistoryTable = () => {
  const tableContainerRef = useRef(null);
  const [isFormVisible, setFormVisible] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  // Base URL from environment variable
  const apiUrl = process.env.REACT_APP_API_URL;

  // Fetch history data from the backend
  const fetchHistoryData = () => {
    const token = localStorage.getItem('authToken');

    if (token) {
      axios.get(`${apiUrl}/histories`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        setHistoryData(response.data);
      })
      .catch(error => {
        // console.error("There was an error fetching the history data!", error);
      });
    } else {
      // console.warn("No auth token found.");
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, []);

  const handleRowClick = (id) => {
    setSelectedHistoryId(id);
    setFormVisible(true);
  };

  const handleCloseForm = () => {
    setFormVisible(false);
    setSelectedHistoryId(null);
  };

  const handleFullscreenToggle = () => {
    if (!document.fullscreenElement) {
      tableContainerRef.current.requestFullscreen().catch(err => {
        // console.error("Failed to enter fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen().catch(err => {
        // console.error("Failed to exit fullscreen mode:", err);
      });
    }
  };

  return (
    <div className="history-table">
      <div className="main-content">
        <div className="content">
          <div className="table-container" ref={tableContainerRef}>
            <div className="table-header-container">
              <div className="table-header-title">
                <FontAwesomeIcon icon={faTable} className="table-icon" />
                <h2>History Table</h2>
                <div className="header-icons">
                  <FontAwesomeIcon icon={faSort} className="icon sort-icon" title="Sort" />
                  <FontAwesomeIcon icon={faFilter} className="icon filter-icon" title="Filter" />
                </div>
              </div>
              <button className="fullscreen-button" onClick={handleFullscreenToggle}>
                <FontAwesomeIcon icon={faExpandArrowsAlt} className="fullscreen-icon" />
              </button>
            </div>
            <div className="table">
              <div className="table-header">
                <div className="header-group-name">
                  Group Name
                  <FontAwesomeIcon icon={faSort} className="icon sort-icon" title="Sort" />
                </div>
                <div className="header-date">
                  Date
                  <FontAwesomeIcon icon={faSort} className="icon sort-icon" title="Sort" />
                </div>
              </div>
              {historyData.map((entry) => (
                <div 
                  className="table-row" 
                  key={entry.id} 
                  onClick={() => handleRowClick(entry.id)}
                >
                  <div>{entry.group_name}</div>
                  <div>{entry.date}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {isFormVisible && (
        <FormRecordsWindow 
          historyId={selectedHistoryId} 
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default HistoryTable;
