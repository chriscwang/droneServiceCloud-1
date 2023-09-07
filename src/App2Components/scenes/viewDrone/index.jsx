import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
// can use API Here instead of Mockdata
import { mockDataTeam } from "../../data/mockData";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import Header from "../../components/Header";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Button, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MapIcon from "@mui/icons-material/Map";
import { format } from 'date-fns';


const ViewDrone = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const navigate = useNavigate();
  const [docs, setDocs] = useState([]);
  const [docs2, setDocs2] = useState([]);
  const [mergeddocs, setMergedDocs] = useState([]);


  const sendRequest = async () => {
    const res = await axios.get(
      "http://localhost:5001/api/viewdrone",
      { withCredentials: true }
    );
    console.log('Data received from backend:', res.data);
    return res.data;
  };

  const sendRequest2 = async () => {
    const res = await axios.get(
      "http://localhost:5001/api/viewschedule",
      { withCredentials: true }
    );
    console.log('Data received from backend:', res.data);
    return res.data;
  };

  const deleteDrone = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/drones/${id}`,
        { withCredentials: true }
      );
      console.log("Drone deleted successfully:", response.data);
      setDocs(docs.filter((doc) => doc.drone_id !== id));
    } catch (error) {
      console.error("Error deleting drone:", error);
    }
  };
  
  const handleEdit = (row) => {
    console.log("Edit clicked for drone_id:", row.drone_id);
    navigate('/dashboard/editDrone', { state: { drone_info: row } });
  };
  const handleExplore = (row) => {
    console.log("Explore clicked for drone_id:", row.drone_id);
    if(parseInt(row.drone_id.slice(-1)) % 2 == 0)
      window.open('https://www.dronedeploy.com/app2/progress-photos/641a21b852eeb4e5124bca78?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjI1MzQwMjMwMDc5OSwiaWQiOiI2NDFhMjFiODUyZWViNGU1MTI0YmNhNzgiLCJzY29wZSI6WyI5MTIwY2ViZjhmXzM3MDg5NjE2REZPUEVOUElQRUxJTkUiXSwidHlwZSI6IlJlYWRPbmx5UGxhbiJ9.Klc_bYbcKWQ5PArzXQi0QO_6kJ6JJOP5O_qk_Vqyl_7528ruBaWopYC-zShxf4BmeZbKEfXubqwQ7bvQ4zHA_A', '_blank');
    else
    window.open('https://www.dronedeploy.com/app2/data/6437c98d02e3bb78b4d29ac7?jwt_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJleHAiOjI1MzQwMjMwMDc5OSwiaWQiOiI2NDM3Yzk4ZDAyZTNiYjc4YjRkMjlhYzciLCJzY29wZSI6WyIyY2M5ZTdkNDI4XzM3MDg5NjE2REZPUEVOUElQRUxJTkUiXSwidHlwZSI6IlJlYWRPbmx5UGxhbiIsIm92ZXJsYXlfZm9sZGVyX2lkIjoiNjQzN2M5OGIwMmUzYmI3OGI0ZDI5YWM2In0.wsHCE-yRUJTFbnyCyeQkehcnmaAJDGrr0IHOwysJSGAtKP3d_b3ivdkgcppRPDqQqvm0-iAsiqqhuu91tao9ow', '_blank');
  };
  
  
  const handleDelete = async (id) => {
    console.log("Delete clicked for drone_id:", id);
    await deleteDrone(id);
  };
  
  useEffect(() => {
  async function fetchData() {
    const data = await sendRequest();
    const formattedData = data.map((item) => {
      const { _id, __v, ...rest } = item;
      return {
        ...rest,
        location:"SanJose",
        status:"Completed",
      };
    });
    setDocs(formattedData);
    console.log('Formatted data:', formattedData);
  }
  fetchData();
}, []);

useEffect(() => {
  async function fetchData() {
    const data = await sendRequest2();
    const formattedData = data.map((item) => {
      const { _id, __v, ...rest } = item;
      return {
        ...rest,
        start_time: format(new Date(item.start_time), 'yyyy/MM/dd HH:mm:ss'),
        end_time: format(new Date(item.end_time), 'yyyy/MM/dd HH:mm:ss'),
      };
    });
    setDocs2(formattedData);
    console.log('Formatted data:', formattedData);
  }
  fetchData();
}, []);

useEffect(() => {
  console.log("docs11:",docs);
  console.log("docs211:",docs2);
  console.log(docs2.find(item => item.drone_id === "D001")?.mission_id)
  const mergedDocs = docs.map((row) => ({
    ...row,
    mission: docs2.find(item => item.drone_id === row.drone_id)?.mission_id || "",
    start_time: docs2.find(item => item.drone_id === row.drone_id)?.start_time || "",
    end_time: docs2.find(item => item.drone_id === row.drone_id)?.end_time || "",
  }));
  console.log(mergedDocs);
  setMergedDocs(mergedDocs);
  //setDocs(mergedDocs);
}, [docs, docs2]);



  console.log("docs:",docs);
  console.log("docs2:",docs2);
  console.log("mergeddocs:",mergeddocs);
  const mergedDocs = [...docs, ...docs2];
  //mission2:docs2.filter(item => item.drone_id == formattedData["drone_id"])["mission_id"],
  

  const columns = [
    { field: "drone_id", headerName: "DroneId",flex: 0.3 },
    {
      field: "name",
      headerName: "Drone Name",
      flex: 0.3,
      //cellClassName: "name-column--cell",
    },
    // {
    //   field: "manufacturer",
    //   headerName: "Manufacturer",
    //   flex: 1,
    //   cellClassName: "name-column--cell",
    // },
    // {
    //   field: "model_number",
    //   headerName: "Model_number",
    //   flex: 0.4,
    // },
    {
      field: "price",
      headerName: "Price",
      flex: 0.3,
    },
    {
      field: "mission",
      headerName: "Latest Mission",
      flex: 0.4,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 0.4,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.4,
    },
    {
      field: "start_time",
      headerName: "StartTime",
      flex: 0.6,
    },
    {
      field: "end_time",
      headerName: "EndTime",
      flex: 0.6,
    },
    {
      field: "actions",
      headerName: "Explore",
      flex: 1,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <IconButton
            color="primary"
            onClick={() => handleExplore(params.row)}
            sx={{ marginRight: "-24px" }}
          >
            <MapIcon style={{ color: "green" }} />
          </IconButton>
          <IconButton
            color="primary"
            onClick={() => handleEdit(params.row)}
            sx={{ marginRight: "-24px" }}
          >
            <EditIcon style={{ color: "white" }} />
          </IconButton>
          <IconButton
            color="secondary"
            onClick={() => handleDelete(params.row.drone_id)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },    
  ];

  return (
    <Box m="20px">
      <Header title="Drone Catalog" />
      {docs.length > 0 ?
        <Box
          m="40px 0 0 0"
          height="75vh"
          sx={{
            "& .MuiDataGrid-root": {
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "none",
            },
            "& .name-column--cell": {
              color: colors.greenAccent[700],
            },
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: colors.blueAccent[300],
              borderBottom: "none",
            },
            "& .MuiDataGrid-virtualScroller": {
              backgroundColor: colors.primary[600],
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "none",
              backgroundColor: colors.blueAccent[300],
            },
            "& .MuiCheckbox-root": {
              color: `${colors.greenAccent[200]} !important`,
            },
          }}
        >
          <DataGrid checkboxSelection rows={mergeddocs} columns={columns} getRowId={(row) => row.drone_id} />
        </Box>
        :
        <Typography>Loading...</Typography>
      }
    </Box>
  );
};

export default ViewDrone;
