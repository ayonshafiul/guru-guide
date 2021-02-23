import React from "react";
import Select from "react-select";


export default function SortComponent(props) {
  const options = [
    { value: 'ratingdesc', label: 'Rating High > Low' },
    { value: 'ratingasc', label: 'Rating Low < High' },
    { value: 'nameasc', label: 'Name A-Z' },
    { value: 'namedesc', label: 'Name Z-A' }
  ];
  return (
    <div className="sort-select-container">
      <Select className="sort-select" options={options} placeholder="Sort by.." onChange={props.handleChange}/>  
   </div>
  )
}