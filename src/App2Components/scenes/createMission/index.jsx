import React, {useState, useEffect} from "react";
import axios from "axios";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography } from "@mui/material";
import { Formik } from "formik";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { useNavigate } from 'react-router-dom';
import Map from "../ggleMapRender/Map";
import TenantIdSingleton from "../../components/TenantId";
import * as yup from "yup";

function CreateMission() {

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
    /*
    const [inputData, setInputData] = useState({
        TenantId: TenantId,
        MissionId:"",
        MissionType: "",
        Location:"",
        FlightPlanCooridnates:"",
        FlightHeight: "",
        Alerts:""
        
    });
    */

    const [maps, setMaps] = useState([{}]);
    const [coords,setCoords]=useState(null);
    console.log("Co-ords from child:",coords);

    
    const handleLocationChange = (e) => {
        let maps = JSON.parse(window.sessionStorage.getItem("maps"));
        const activeMap = maps.filter((map) => e.target.value == map.Name);
        console.log("AM:", activeMap);
        setCoords({ lat: activeMap[0].Lat, lng: activeMap[0].Long });
        console.log("C:", coords);
      };
      
    

    useEffect(() => {
        fetch(`http://localhost:5001/api/getAllMaps/${TenantId}`)
        .then(res => res.json())
        .then(data => {setMaps(data); console.log("MAPS:",data);window.sessionStorage.setItem("maps",JSON.stringify(data));});
    }, []);
    useEffect(()=>{
    },[coords])


    const sendRequest = async(values) => {
        await axios.post('http://localhost:5001/api/createMissionPlan',{
            TenantId: TenantId,
            MissionId:values.MissionId,
            MissionType:values.MissionType,
            Location:values.Location,
            FlightPlanCoordinates: coords,
            FlightHeight: values.FlightHeight,
            Alerts: values.Alerts
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
    console.log("Shakshi:",maps);

    return (
        <Box m="20px">
            <Header title="Create New Mission Plan" />
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
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Mission ID"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.MissionId}
                                    name="MissionId"
                                    error={!!touched.MissionId && !!errors.MissionId}
                                    helperText={touched.MissionId && errors.MissionId}
                                    sx={{ gridColumn: "span 4" }}
                                />
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    error={!!touched.MissionType && !!errors.MissionType}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <InputLabel htmlFor="MissionType">Mission Type</InputLabel>
                                    <Select
                                    label="Mission Type"
                                    value={values.MissionType}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    inputProps={{
                                        name: "MissionType",
                                        id: "MissionType",
                                    }}
                                    >
                                    {missionOptions.map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                        {option.label}
                                        </MenuItem>
                                    ))}
                                    </Select>
                                    <FormHelperText>
                                    {touched.MissionType && errors.MissionType}
                                    </FormHelperText>
                                </FormControl>
                                <FormControl
                                    fullWidth
                                    variant="filled"
                                    error={!!touched.Location && !!errors.Location}
                                    sx={{ gridColumn: "span 4" }}
                                >
                                    <InputLabel htmlFor="Location">Service Location</InputLabel>
                                    <Select
                                        label="Location"
                                        value={values.Location}
                                        onChange={(e) => {
                                            handleLocationChange(e);
                                            handleChange(e);
                                          }}
                                        onBlur={handleBlur}
                                        inputProps={{
                                            name: "Location",
                                            id: "Location",
                                        }}
                                    >
                                        <MenuItem disabled value="">
                                            Choose Location
                                        </MenuItem>
                                        {maps.map((option) => (
                                            <MenuItem key={option.Name} value={option.Name}>
                                                {option.Name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    <FormHelperText>{touched.Location && errors.Location}</FormHelperText>
                                </FormControl>
                                <TextField
                                    fullWidth
                                    variant="filled"
                                    type="text"
                                    label="Flight Height"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.FlightHeight}
                                    name="FlightHeight"
                                    error={!!touched.FlightHeight && !!errors.FlightHeight}
                                    helperText={touched.FlightHeight && errors.FlightHeight}
                                    sx={{ gridColumn: "span 4" }}
                                />
                            </Box>
                            <Box display="flex" justifyContent="end" mt="20px">
                                <Button type="submit" color="secondary" variant="contained">
                                    Create Mission Plan
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
                <Map center={coords}/>
        </Box>
    )
};
const checkoutSchema = yup.object().shape({
    MissionId: yup.string().required("required"),
    MissionType: yup.string().required("required"),
    Location: yup.string().required("required"),
    //FlightPlanCooridnates: yup.string().required("required"),
    FlightHeight: yup.string().required("required"),
    //Alerts:yup.string().required("required"),
});
const initialValues = {
    MissionId:"",
    MissionType: "",
    Location:"",
    FlightHeight: "",
};

export default CreateMission;