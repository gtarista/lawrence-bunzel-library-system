import { useState, useEffect, useRef } from "react";
import './DropDown.css'

export const DropDown = ({handleSelection}) => {
    const handleSelectChange = (event) => {
        handleSelection(event.target.value);
    };
    return (
        <div className="dropdown">
            <div>
                <label for="genre">Genre</label>
            </div>
            <select class = "drop-select" onChange = {handleSelectChange}>
                <option value = 'all'>All</option>
                <option value = 'fiction'>Fiction</option>
                <option value = 'nonfiction'>Non-Fiction</option>
            </select>
        </div>
    );
};