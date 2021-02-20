import React from "react";
import Select from "react-select";
import { getOptionLabel } from "react-select/src/builtins";
import {getDepartmentArray} from "../utils/departmentDetails";

function AddFaculty(props){
    const departmentArray=getDepartmentArray();
    const options = departmentArray.map((department) =>{return {value:department, label :department }})


    return(
        <div> 
            <h1 className="af-title">Add New Faculty</h1>
        <form className="af">
            <Select className="af-select" 
            options={options} 
            placeholder="Select Department" 
            name="deapartmentID"
            onChange={props.handleChange}
            />
            <input className="af-details"
             type="text"
             value={props.facultyName}
             placeholder="Faculty Name" 
             name="facultyName"
             onChange={props.handleChange} 
            />
            <input className="af-details"
             type="text"
             value={props.facultyInitials}
             placeholder="Faculty Initials in CAPITAL" 
             name="facultyInitials"
             onChange={props.handleChange} 
            />
            <button className="af-create" onClick = {props.addFaculty}>Create</button>
        </form>
        </div>
    )

}

export default AddFaculty