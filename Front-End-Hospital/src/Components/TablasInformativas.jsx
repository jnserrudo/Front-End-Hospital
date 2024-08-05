import React from 'react'
import ExcelViewer from './ExcelViewer'
import { ChakraProvider } from '@chakra-ui/react';

export const TablasInformativas = () => {
  return (
    <ChakraProvider>
    <p className='titulo_administracion'>Tablas Informativas</p>
    <div className='cont_tablas_info'>

      <ExcelViewer 
        filePath="/Vegetales.xls" 
        toggleMessage="Ver la tabla de Vegetales"
      />
      <ExcelViewer 
        filePath="/Frutas.xls" 
        toggleMessage="Ver la tabla de Frutas"
      />
      <ExcelViewer 
        filePath="/Pescados.xls" 
        toggleMessage="Ver la tabla de Pescados"
      />
    </div>
  </ChakraProvider>
  )
}
