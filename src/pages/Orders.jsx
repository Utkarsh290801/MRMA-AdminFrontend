import React, { useRef } from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Resize,
  Sort,
  ContextMenu,
  Filter,
  Page,
  ExcelExport,
  PdfExport,
  Edit,
  Inject,
} from "@syncfusion/ej2-react-grids";
import { ordersData, ordersGrid } from "../data/dummy";
import { Header } from "../components";

const Orders = () => {
  let gridInstance = useRef(null);

  const exportToPDF = () => {
    if (gridInstance.current) {
      gridInstance.current.pdfExport();
    }
  };

  return (
    <div className="m-2 md:m-10 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Page" title="Orders" />
      <button onClick={exportToPDF}>Export to PDF</button>
      <GridComponent
        id="gridcomp"
        dataSource={ordersData}
        allowPaging
        allowSorting
        toolbar={["PdfExport"]} // Add PdfExport to the toolbar
        allowPdfExport={true}
        ref={gridInstance}
      >
        <ColumnsDirective>
          {ordersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject
          services={[
            Resize,
            Sort,
            ContextMenu,
            Filter,
            Page,
            ExcelExport,
            Edit,
            PdfExport,
          ]}
        />
      </GridComponent>
    </div>
  );
};

export default Orders;
