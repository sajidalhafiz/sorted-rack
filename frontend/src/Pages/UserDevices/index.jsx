import React, { useRef, useState, useEffect, useMemo } from "react";
import { axiosSecure } from "../../api/axios";

const UserDevices = () => {

    const [assignedDeviceUserList, setAssignedDeviceUserList] = useState([]);

    useEffect(() => {
        const getAssignedDeviceDetails = async () => {
            const response = await axiosSecure.get("/assignedProduct/allMyProducts", {
                headers: {
                    Authorization: `Bearer ${localStorage.userDetails && JSON.parse(localStorage.userDetails).token}`,
                },
            });

            console.log(response?.data?.myList)
            setAssignedDeviceUserList(response?.data?.myList);
        };
        getAssignedDeviceDetails();
        console.log(assignedDeviceUserList)
    }, []);

    return (
        <div>
            UserDevices
        </div>
    );
};

export default UserDevices;