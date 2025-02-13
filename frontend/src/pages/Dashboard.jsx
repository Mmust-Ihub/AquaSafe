import React, { useEffect, useState } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import Menu from '../components/common/Menu';
import { collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import {  db } from "../lib/firebase";
import DataTable, { defaultThemes } from 'react-data-table-component';

function Dashboard() {
  const [cageName, setCageName] = useState("")
  const [error, setError] = useState("")
  const [cagesData, setCagesData] = useState([])
  const [tableData, setTableData] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [showTable, setShowTable] = useState(true)

  const [selectedRows, setSelectedRows] = useState([])
  const [toggleCleared, setToggleCleared] = useState(false)

  const handleAddCage = async (e) => {
    e.preventDefault()
    let userUid = JSON.parse(localStorage.getItem("user")) 
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
      setCageName("")
      handleShowTable()
    }catch(err){
      console.error("Add cage error:", err);
      setError(err.message || "An unexpected error occurred. Please try again.");
      toast.error("An error occurred. Try again")
    }finally{
      return
    }

  }

  // Show/hide form
  const handleShowForm = () => {
    setShowTable(false)
    setShowForm(true)
  }

  // Show/hide table
  const handleShowTable = () => {
    setShowForm(false)
    setShowTable(true)
  }

  // Get cages data from snapshot
  useEffect(()=>{
    let userUid = JSON.parse(localStorage.getItem("user"))
    const q = query(collection(db, "cages"), where("ownerId", "==", userUid.uid))
    const unsubscribe = onSnapshot(q,(querySnapshot) => {
      const cagesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      console.log(cagesData)
      setCagesData(cagesData);
    })
    return ()=> unsubscribe()
  },[])

  // Set table data from cages data
  useEffect(()=>{
    const data = cagesData.map(cage => {
      return {
        name: cage.name,
        location: `${cage.location.latitude},${cage.location.longitude}`,
        oxygen: cage.oxygen,
        nitrogen: cage.nitrogen,
        phosphorus: cage.phosphorus,
        temperature: cage.temp,
        id: cage.id,
      }
    })
    setTableData(data)
  },[cagesData])

  // Table columns
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: "true",
      // grow: 2,
    },
    {
      name: 'Location',
      selector: row => row.location,
      sortable: "true",
      right: "true",
      // hide: 'md',
    },
    {
      name: 'Oxygen',
      selector: row => row.oxygen,
      sortable: "true",
      right: "true",
      hide: 'md',
    },
    {
      name: 'Nitrogen',
      selector: row => row.nitrogen,
      sortable: "true",
      right: "true",
      hide: 'md',
    },
    {
      name: 'Phosphorus',
      selector: row => row.phosphorus,
      sortable: "true",
      right: "true",
      hide: 'md',
    },
    {
      name: 'Temperature',
      selector: row => row.temperature,
      sortable: "true",
      right: "true",
      hide: 'sm',
    },
    {
      name: 'Id',
      selector: row => row.id,
      sortable: "true",
      right: "true",
      omit: "true"
    },
  ];

  // Define data to be shown when a row is expanded
  const ExpandedComponent = ({ data }) => `Location: ${data.location} || Oxygen: ${data.oxygen} || Nitrogen: ${data.nitrogen} || Phosphorus: ${data.phosphorus} || Temperature: ${data.temperature}`;

  // Delet selected rows
  const handleRowsSelected = async ({ selectedRows }) => {
      setSelectedRows(selectedRows)
  }

  const contextActions = React.useMemo(() => {
		const handleDeleteSelected = async () => {
      if (selectedRows.length === 0) {
        toast.error("No rows selected");
        return;
      }

      const confirmDelete = window.confirm("Are you sure you want to delete the selected cages?");
      if (!confirmDelete) return;

      toast.loading("Deleting selected cages");
      try {
        selectedRows.forEach(async (row) => {
          await deleteDoc(doc(db, "cages", row.id));
        })
        toast.dismiss();
        toast.success("Selected cages deleted successfully");
        setSelectedRows([]);
        setToggleCleared(!toggleCleared);
        window.location.reload();
      } catch (err) {
        console.error("Delete cages error:", err);
        toast.dismiss();
        toast.error("An error occurred while deleting cages. Please try again.");
      }
    }

		return (
			<button
        className="p-2 text-white bg-red-500 rounded hover:bg-red-600 md:w-auto text-sm"
        onClick={handleDeleteSelected}
        style={{ cursor: 'pointer' }}
      >
        Delete selected
      </button>
		);
	}, [selectedRows, toggleCleared]);
  

  return (
    <div>
        <Menu/>
        <div className="container mx-auto px-4 mt-10">
          <div id='buttons' className='flex flex-row-reverse'>
              <button 
                className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 md:w-auto mr-4 text-sm"
                onClick={handleShowForm}
                style={{cursor: 'pointer'}}>
                    Add cage
              </button>
              <button 
                className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600 md:w-auto mr-4 text-sm"
                onClick={handleShowTable}
                style={{cursor: 'pointer'}}>
                    View cages
              </button>
          </div>

          {showTable && ( <div id="table" className='mt-1'>
            <DataTable
              title="Cages"
              columns={columns}
              data={tableData}
              customStyles={{
                headRow: {
                  style: {
                    borderTopStyle: 'solid',
                    borderTopWidth: '1px',
                    borderTopColor: defaultThemes.default.divider.default,
                  },
                },
                headCells: {
                  style: {
                    fontSize: '15px',
                    '&:not(:last-of-type)': {
                      borderRightStyle: 'solid',
                      borderRightWidth: '1px',
                      borderRightColor: defaultThemes.default.divider.default,
                    },
                  },
                },
                cells: {
                  style: {
                    fontSize: '14px',
                    '&:not(:last-of-type)': {
                      borderRightStyle: 'solid',
                      borderRightWidth: '1px',
                      borderRightColor: defaultThemes.default.divider.default,
                    },
                  },
                },
              }}
              pagination
              expandableRows 
              expandableRowsComponent={ExpandedComponent}
              selectableRows
              onSelectedRowsChange={handleRowsSelected}
              contextActions={contextActions}
            />
          </div>)}

          {showForm && 
          (<form onSubmit={handleAddCage} className="mt-5 p-0 m-0">
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