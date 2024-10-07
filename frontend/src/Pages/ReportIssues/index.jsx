import React, { useRef, useState, useEffect, useMemo } from "react";
import { axiosSecure } from '../../api/axios';

const ReportIssues = () => {

    const [deviceIssueList, setDeviceIssueList] = useState([]);

    useEffect(() => {
        const getDeviceIssueDetails = async () => {
            const response = await axiosSecure.get("/deviceIssue", {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
                },
            });

            console.log(response?.data?.deviceIssues)
            setDeviceIssueList(response?.data?.deviceIssues);
        };
        getDeviceIssueDetails();
        console.log(deviceIssueList)
    }, []);
    
    return (
        <div>
            Report Your Device Issues
        </div>
    );
};

export default ReportIssues;