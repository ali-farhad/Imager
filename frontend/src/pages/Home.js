import React, { useCallback, useMemo, useRef, useState } from 'react';
//import user

import axios from 'axios'

import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css'; // Core grid CSS, always needed
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'; // Optional theme CSS

//import download btn
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';


//import select
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';


import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Environment } from 'ag-grid-community';

//table img styles
const tableImg = {
  width: '100%',
  objectFit: 'cover',
}

const prodUri = process.env.REACT_APP_API_ENDPOINT;

  

function Home() {


    //general states
    const [rowData, setRowData] = useState();
    const [gridApi, setGridApi] = useState(null);
    const [gridColApi, setGridColApi] = useState(null);
    

  const gridRef = useRef();
  const containerStyle = useMemo(() => ({ width: '100%', height: '80vh' }), []);
  const gridStyle = useMemo(() => ({ height: '100%', width: '100%' }), []);

  const defaultColDef = useMemo(() => {
    return {
      resizable: true,
      sortable: true,
    // editable: true,
    filter: true,
    floatingFilter: true,
    // flex: 1,
    };
  }, []);



  const onFirstDataRendered = useCallback((params) => {
    gridRef.current.api.sizeColumnsToFit();
  }, []);


   //rows selection sate
   const [selectedRows, setSelectedRows] = useState([]);
   const [validRows, setValidRows] = useState([]);
  


  // const handleBtn = (prams) => {
  //   console.log(prams.getValue());
  // };


  
  // const rowSelectionType = 'single'
  const rowSelectionType = 'multiple';

  const handleSelection = (e) => {
    // console.log(e)
    // console.log(e.api.getSelectedRows());
    let selectedNodes = e.api.getSelectedNodes();

    let selectedData = selectedNodes.map(node => node.data);

    // console.log(JSON.stringify(selectedData));
    // console.log(selectedData)
    //length of selected rows
    console.log(selectedData.length, "total length")

    setSelectedRows(selectedData);
  };

  const getPdfFile = async () => {

    //fetch call response type blob
    
      axios(`${prodUri}pdf/getPdf/order`, {
        method: "GET",
        responseType: "blob"
        //Force to receive data in a Blob Format
      })
        .then(response => {
          //Create a Blob from the PDF Stream
          const file = new Blob([response.data], {
            type: "application/pdf",
            
          });
          //Build a URL from the file
          const fileURL = URL.createObjectURL(file);
          //rename the file name
          const link = document.createElement("a");
          link.href = fileURL;
          //get current date and time
          const date = new Date();
          const time = date.getTime();
          //format date and time in month/day/year format
          const dateString = date.toLocaleDateString();
          //convert time to 24 hours format
          const timeString = date.toLocaleTimeString("en-US", {
            hour12: false,
            hour: "numeric",
            minute: "numeric"
          });
          //append date and time to file name
          link.download = `${dateString}-${timeString}.pdf`;
          link.click();
          //clean up
          //Open the URL on new Window
          window.open(link);
          URL.revokeObjectURL(fileURL);

        })
        .catch(error => {
          console.log(error);
        });
    };

  const handleExportBtn = () => {
    
    if(selectedRows.length > 0){ 
fetch(prodUri + "pdf/generate", {
	
	// Adding method type
	method: "POST",
	
	// Adding body or contents to send
	body: JSON.stringify({
		filename: "order",
		rows: selectedRows
	}),
	
	// Adding headers to the request
	headers: {
		"Content-type": "application/json; charset=UTF-8"
	}
})

// Converting to JSON
.then(response => response)
.then(data => {
  getPdfFile();
}
)

  }
  else{
    alert("Please select rows to export")
  }
  };


  var numberValueFormatter = function (params) {
    //change params to number
    return Number(params.value).toFixed(2);
  };


  const columnDefs = [
    {
      headerName: 'Reference',
      field: 'Reference',
      headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true,
      checkboxSelection: function(params) {
        if(serverImgs.includes(params.data.Reference + ".jpg")){
          return true;
        } else {
          return false;
        }      
      },
      minWidth: 150
    },
    {
      headerName: 'imgs',
      field: 'Reference',
      valueGetter: function(params) {
        if(serverImgs.includes(params.data.Reference + ".jpg")){
          return params.data.Reference;
        } else {
          return "";
        }
      },
      minWidth: 224,
      cellRenderer: (prams) => {
        //if prams.value is included in serverImgs
        let tableValue = `${prams.value}.jpg`
        if(serverImgs.includes(tableValue)) {
          return (
            <img style={tableImg} src={`${prodUri}api/getImgFile/${prams.value}.jpg`}/>
          )
        } else {
          return (
            <span>Please upload Images</span>
           
          )
        }
        
      }
    },
    {
      headerName: 'Description',
      field: 'Description',
      minWidth: 300,
    },
    {
      headerName: 'Price A',
      field: 'Price A',
      minWidth: 97,
      filter: 'agNumberColumnFilter',
      valueFormatter: numberValueFormatter,

    },
    {
      headerName: 'Marca',
      field: 'Marca',
      minWidth: 115
    },
    
    {
      headerName: 'Rubro',
      field: 'Rubro',
      minWidth: 102
    },

    {
      headerName: 'Temporada',
      field: 'Temporada',
      minWidth: 115
    },
    
    {
      headerName: 'Sub Rubro',
      field: 'Sub Rubro',
      minWidth: 120
    },
    // {
    //   headerName: 'Category',
    //   field: 'Category',
    //   minWidth: 110
    // },
    // {
    //   headerName: 'Codigo de Barra',
    //   field: 'Codigo de Barra',
    //   minWidth: 158
    // },
 
    {
      headerName: 'Cant x Bulto',
      field: 'Cant x Bulto',
      minWidth: 133,
      filter: 'agNumberColumnFilter',

    },
    {
      headerName: 'Stock',
      field: 'Stock',
      minWidth: 90,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Comprado',
      field: 'Comprado',
      minWidth: 115,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Pendiente',
      field: 'Pendiente',
      minWidth: 115,
      filter: 'agNumberColumnFilter',
    },
    {
      headerName: 'Disponible',
      field: 'Disponible',
      minWidth: 115,
      filter: 'agNumberColumnFilter',
    },
   
   
    {
      headerName: 'Características',
      field: 'Características',
      minWidth: 300
    },
    // {
    //   headerName: 'Observaciones',
    //   field: 'Observaciones',
    //   minWidth: 115
    // },
    // {
    //   headerName: 'Price F',
    //   field: 'Price F',
    //   minWidth: 115
    // },
    // {
    //   headerName: 'Tipo',
    //   field: 'Tipo',
    //   minWidth: 115
    // },
  ];


 
  const [serverImgs, setServerImgs] = useState([]);

  const onGridReady = async (prams) => {
    //placeholder to use grid api in any part
    setGridApi(prams.api);
    setGridColApi(prams.columnApi);

    const getImgs = async () => {
      const imgsArr = await fetch(prodUri + "api/getImgNames")
      const json = await imgsArr.json();
    
      if(imgsArr.ok) {
          setServerImgs(json.imgs);
    
      }
    }
    
    getImgs();
    

    

 


    //get the data from api

    const response = await fetch(prodUri + "api/csv")
    // console.log(response);
    
    const json = await response.json();

    if(response.ok) {
        prams.api.applyTransaction({add: json});
        console.log(json)
    }


    prams.api.onFilterChanged();




 //get real urls  from api





    };


  // const handleSearch = (e) => {
  //   gridApi.setQuickFilter(e.target.value);
  // };


//   {
//     
   //column stats
   const [refCol, setRefCol] = useState(false);
   const [desCol, setDesCol] = useState(false);

   const [priceACol, setPriceACol] = useState(false);
   const [categoryCol, setCategoryCol] = useState(false);
   const [codigoCol, setCodigoCol] = useState(false);
   const [rubroCol, setRubroCol] = useState(false);
   const [cantxCol, setCantxCol] = useState(false);
   const [stockCol, setStockCol] = useState(false);
   const [compradoCol, setCompradoCol] = useState(false);
   const [pendiCol, setPendiCol] = useState(false);
   const [disponCol, setDisponCol] = useState(false);
   const [tempoCol, setTempoCol] = useState(false);
   const [marcaCol, setMarcaCol] = useState(false);
   const [caraCol, setCaraCol] = useState(false);
   const [observCol, setObservCol] = useState(false);
   const [priceFCol, setPriceFCol] = useState(false);
   const [tipoCol, setTipoCol] = useState(false);

   const colsStatesArr = [refCol, desCol, priceACol, categoryCol, codigoCol, rubroCol, cantxCol, stockCol, compradoCol, pendiCol, disponCol, tempoCol, marcaCol, caraCol, observCol, priceFCol, tipoCol];

   const colsSetStatesArr = [setRefCol, setDesCol, setPriceACol, setCategoryCol, setCodigoCol, setRubroCol, setCantxCol, setStockCol, setCompradoCol, setPendiCol, setDisponCol, setTempoCol, setMarcaCol, setCaraCol, setObservCol, setPriceFCol, setTipoCol];

  
  const colsNamesArr = ['Reference', 'Description', 'Price A', 'Category', 'Codigo de Barra', 'Rubro', 'Sub Rubro', 'Cant x Bulto', 'Stock', 'Comprado', 'Pendiente', 'Disponible', 'Temporada', 'Marca', 'Caracteristicas', 'Observaciones', 'Price F', 'Tipo'];

  const handleColumnVisiblity = (e) => {
      //loop through the array of states and change the state of the column
      colsNamesArr.map((state, index) => {
        
        switch (e.target.name) {
          case state:
            gridColApi.setColumnVisible(state, colsStatesArr[index]);
            colsSetStatesArr[index](!colsStatesArr[index]);
            break;
          default:
            break;
        }

      })

  }

  const isRowSelectable = (node) => {


    const imgs = serverImgs.map(img => img.split('.')[0]);
   
    if(imgs.includes(node.data.Reference)) {
        return true;

      
    }
    else {
      return false;
    }

    
  }



  const uploadHandler = (event) => {
    //get the file
    const file = event.target.files[0];
    console.log(file)
    
    // create a formdata object
    const formData = new FormData();
    //add the file to the formdata object
    formData.append('csv', file);
    //create an object of options to pass to the fetch call
    axios.post(prodUri + 'api/singleCsv', formData)
            .then((res) => {
               console.log("ok ");
               window.location.reload();


        
            })
            .catch((err) => {
                // inform the user
                console.error(err)
                window.location.reload();


            });
  };

  
  const rowHeight = 150;

  return (
    <div>


         <div style={{display: "flex", justifyContent: "space-between"}}>

  

         <Accordion style={{maxWidth: '22rem'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>CSV Settings & Exports</Typography>
        </AccordionSummary>
        <AccordionDetails>
    
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(1, 1fr)', gap: "2rem" }}>
          <div className="file-inputs">
      

   
              <Button sx = {{width: "100%"}} variant="contained" component="label" color="primary">
     
        <AddIcon/> Upload CSV File
        <input hidden name="csv" onChange={uploadHandler} type="file"  accept="csv/*" />
      </Button>

        
    

                </div>

          <Button onClick={handleExportBtn} variant="contained">Generate PDF</Button>

          <Button disabled variant="contained">Total Rows Selected: {selectedRows.length}</Button>


            </div>
  
        </AccordionDetails>
      </Accordion>
   


         <Accordion style={{maxWidth: '22rem'}}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography>Hide Columns</Typography>
        </AccordionSummary>
        <AccordionDetails>
    
          {/* for each item in colsStatesArr */}
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)'}}>

          {colsStatesArr.map((item, index) => {
            return (
                <FormGroup key={index}>
        <FormControlLabel
          control={
 
            <Switch  
            //cast item to boolean          
            checked={item}
            onChange={handleColumnVisiblity}
            label="wtf"
            inputProps={{ 'aria-label': 'controlled' }}
            name={colsNamesArr[index]}
          />          }

          label={colsNamesArr[index]}
        />
       
    </FormGroup>
    
  
            )
          })}
            </div>
  
        </AccordionDetails>
      </Accordion>

     
     
        </div>
      <div style={containerStyle}>
        <div style={gridStyle} className="ag-theme-alpine">
          <AgGridReact
            ref={gridRef}
            rowData={rowData}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            onGridReady={onGridReady}
            onFirstDataRendered={onFirstDataRendered}
            onSelectionChanged={handleSelection}
            rowSelection={rowSelectionType}
            isRowSelectable={isRowSelectable}
            rowHeight={rowHeight}
            groupSelectsFiltered={true}
          ></AgGridReact>
        </div>
      </div>
    </div>
  )
}

export default Home