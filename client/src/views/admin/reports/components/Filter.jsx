import React, { useState } from "react";

export default function Filter({ onFilterChange }) {
  const [localFilter, setLocalFilter] = useState({
    startDate: "",
    endDate: "",
    groupBy: "day"
  });

 const handleChange=(key,value)=>{
   const updated={
      ...localFilter,
      [key]:value
   }

   setLocalFilter(updated)
}

const applyFilter=()=>{
   onFilterChange(localFilter)
}

  return (
    <div className="flex gap-4 mb-6">
      <input
        type="date"
        className="border p-2 rounded"
        onChange={(e) => handleChange("startDate", e.target.value)}
      />

      <input
        type="date"
        className="border p-2 rounded"
        onChange={(e) => handleChange("endDate", e.target.value)}
      />

      <select
        className="border p-2 rounded"
        onChange={(e) => handleChange("groupBy", e.target.value)}
      >
        <option value="day">Daily</option>
        <option value="week">Weekly</option>
        <option value="month">Monthly</option>
      </select>

      <button
onClick={applyFilter}
className="bg-blue-500 text-white px-4 py-2 rounded"
>
Apply
</button>
    </div>
  );
}