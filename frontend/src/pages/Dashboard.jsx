import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Menu from '../components/common/Menu';
import {  getDocs, collection, addDoc, query, where } from "firebase/firestore";
import {  db } from "../lib/firebase";
import DataTable from 'react-data-table-component';

function Dashboard() {
  const [cageName, setCageName] = useState("")
  const [error, setError] = useState("")
  const [cagesData, setCagesData] = useState([])
  const [tableData, setTableData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showTable, setShowTable] = useState(true)

  const handleSignup = async (e) => {
    e.preventDefault()
    let userUid = JSON.parse(localStorage.getItem("user")) 

    console.log(userUid)

    let sendData = {
      name: cageName,
      ownerId: userUid.uid,
      location: {
        longitude: null,
        latitude: null
      },
      oxygen: null,
      nitrogen: null,
      phosphorus: null,
      temp: null
    }

    toast.loading("Adding cage")

    try{
      const cage = await addDoc(collection(db, "cages"), sendData);
      toast.dismiss()
      if(cage){
        toast.success("Cage added successfuly")
      }
      handleShowForm()
    }catch(err){
      console.error("Add cage error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      toast.error("An error occurred. Try again")
    }finally{
      return
    }

  }

  const handleShowForm = () => {
    setShowTable(false)
    setShowForm(true)
  }

  const handleShowTable = () => {
    setShowForm(false)
    setShowTable(true)
  }

  const loadData = async ()=>{
    try {
      let userUid = JSON.parse(localStorage.getItem("user"))
      const cages = await getDocs(query(collection(db, "cages"), where("ownerId", "==", userUid.uid)))
      const cagesData = cages.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log(cagesData)
      setCagesData(cagesData);
    } catch (err) {
      console.error("Load data error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
    }
  }

  useEffect(()=>{
    loadData()
  },[])

  useEffect(()=>{
    const data = cagesData.map(cage => {
      return {
        name: cage.name,
        location: `${cage.location.latitude},${cage.location.longitude}`,
        oxygen: cage.oxygen,
        nitrogen: cage.nitrogen,
        phosphorus: cage.phosphorus,
        temperature: cage.temp
      }
    })
    setTableData(data)
  },[cagesData])

  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
    },
    {
      name: 'Location',
      selector: row => row.location,
    },
    {
      name: 'Oxygen',
      selector: row => row.oxygen,
    },
    {
      name: 'Nitrogen',
      selector: row => row.nitrogen,
    },
    {
      name: 'Phosphorus',
      selector: row => row.phosphorus,
    },
    {
      name: 'Temperature',
      selector: row => row.temperature,
    },
  ];
  

  return (
    <div>
        <Menu/>
        <div className="container mx-auto px-4 mt-10">
          <div id='buttons' className='flex justify-between item-center'>
            <h1 className='m-0 p-0 text-base font-bold'>Cages</h1>
            <div>
              <button 
                className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 w-24 mr-4 text-sm"
                onClick={handleShowTable}
                style={{cursor: 'pointer'}}>
                    View cages
              </button>
              <button 
                className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 w-24 text-sm"
                onClick={handleShowForm}
                style={{cursor: 'pointer'}}>
                    Add cage
              </button>
            </div>
          </div>

          {showTable && ( <div id="table" className='mt-5'>
            <DataTable
              columns={columns}
              data={tableData}
              customStyles={{
                headCells: {
                  style: {
                    fontSize: '15px', // Increase font size for header cells
                  },
                },
                cells: {
                  style: {
                    fontSize: '14px', // Increase font size for body cells
                  },
                },
              }}
            />
          </div>)}

          {showForm && 
          (<form onSubmit={handleSignup} className="mt-5 p-0 m-0">
            <label htmlFor="cageName">Enter cage name</label>
            <div className='flex mt-2'>
              <input
                type="text"
                id="cageName"
                placeholder="Cage one"
                className="p-2 mb-3 border rounded w-96 h-10"
                value={cageName}
                onChange={(e) => setCageName(e.target.value)}
                required
              />
              <button
                type="submit"
                className="p-0 pl-2 pr-2 text-white bg-blue-500 rounded hover:bg-blue-600 text-sm ml-2 w-36 h-10"
              >
                Submit
              </button>
            </div>
          </form>)}

        </div>
        <Toaster />
    </div>
  )
}

export default Dashboard