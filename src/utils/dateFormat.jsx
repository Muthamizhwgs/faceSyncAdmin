import React from 'react'

const DateFormat = (data) => {
const date = new Date(data.data);
const day = date.getDate().toString().padStart(2, '0'); 
const month = (date.getMonth() + 1).toString().padStart(2, '0');
const year = date.getFullYear();

const formattedDate = `${day}-${month}-${year}`;
  return (
    <div>{formattedDate}</div>
  )
}

export default DateFormat