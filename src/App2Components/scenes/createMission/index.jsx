import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import TenantIdSingleton from "../../components/TenantId";
import * as yup from "yup";


function CreateMission() {

    const [shouldRedirect, setShouldRedirect] = useState(false)
    const navigate = useNavigate();
    const isNonMobile = useMediaQuery("(min-width:600px)");
    const [missionOptions, setMissionOptions] = useState([
        { value: 'Campus Perimeter Patrol', label: 'Campus Perimeter Patrol' },
        { value: 'Crowd Monitoring', label: 'Crowd Monitoring' },
        { value: 'Building Inspection', label: 'Building Inspection' },
        { value: 'Emergency response', label: 'Emergency response' },
        { value: 'Parking Lot Surveillance', label: 'Parking Lot Surveillance' }
      ]);
    const [errorMessage, setErrorMessage] = useState("");
    let userdetails=JSON.parse(window.sessionStorage.getItem("userdetails"));
    const TenantId=userdetails.email;

    const [maps, setMaps] = useState([{}]);
    const [coords,setCoords]=useState(null);
    console.log("Co-ords from child:",coords);
    
    const [DroneOptions, setDroneOptions] = useState([
        { value: 'Drone_001', label: 'Drone_001' },
        { value: 'Drone_002', label: 'Drone_002' },
        { value: 'Drone_003', label: 'Drone_003' },
        { value: 'Drone_004', label: 'Drone_004' },
        { value: 'Drone_005', label: 'Drone_005' }
      ]);

    const sendRequest = async(values) => {
        await axios.post('http://localhost:5001/api/createMissionPlan',{
            TenantId: TenantId,
            ServiceType:values.ServiceType,
            DroneId:values.DroneId,
        })
        .then((res) => {
            console.log(res);
        })
        .catch(err=>console.log(err));
    }

    const handleFormSubmit = async(values) => {
        //e.preventDefault();
        console.log(values);
        const responseData = await sendRequest(values);
        if (responseData) {
            alert("Added mission plan to db!")
            navigate("/dashboard");
        }
    }

    return (
        <Box m="20px">
            <Header title="Create New Service Mission" />
                <Formik
                    onSubmit={handleFormSubmit}
                    initialValues={initialValues}
                    validationSchema={checkoutSchema}
                >
                    {({
                    values,
                    errors,
                    touched,
                    handleBlur,
                    handleChange,
                    handleSubmit,
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Box
                            display="grid"
                            gap="30px"
                            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
                            sx={{
                                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
                            }}
                            >
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    error={!!touched.ServiceType && !!errors.ServiceType}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <InputLabel htmlFor="ServiceType">Service Type</InputLabel>
                                    <Select
                                    label="Service Type"
                                    value={values.ServiceType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        name: "ServiceType",
                                        id: "ServiceType",
                                    }}
                                    >
                                    {missionOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                    <FormHelperText>
                                    {touched.ServiceType && errors.ServiceType}
                                    </FormHelperText>
                                </FormControl>
                                
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    error={!!touched.DroneId && !!errors.DroneId}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <InputLabel htmlFor="DroneId">Capable Drones for the Service Type</InputLabel>
                                    <Select
                                    label="Capable Drones"
                                    value={values.DroneId}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        name: "DroneId",
                                        id: "DroneId",
                                    }}
                                    >
                                    {DroneOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                    <FormHelperText>
                                    {touched.DroneId && errors.DroneId}
                                    </FormHelperText>
                                </FormControl>
                                
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained" onClick={() => navigate("/dashboard/missionPlanner")}>
                                    Create Mission
                                </Button>
                            </Box>
                            {errorMessage && (
                            <Box mt="10px">
                                <Typography color="error">{errorMessage}</Typography>
                            </Box>
                            )}
                            <br />
                            <br />
                        </form>
                    )}
                </Formik>
        </Box>
    )
};
const checkoutSchema = yup.object().shape({
    ServiceType: yup.string().required("required"),
    DroneId: yup.string().required("required"),
});
const initialValues = {
    ServiceType: "",
    DroneId:"",
};

export default CreateMission;