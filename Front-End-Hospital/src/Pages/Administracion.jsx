import React from "react";
import { Table } from "antd";
import { EditOutlined, DragOutlined } from "@ant-design/icons";

export const Administracion = () => {


    const columns = [
        {
          title: "DNI",
          dataIndex: "dni",
          render: (text) => <a>{text}</a>,
          align: "center",
        },
        {
          title: "Nombre",
          dataIndex: "nombre",
          align: "center",
        },
        {
          title: "Apellido",
          dataIndex: "apellido",
          align: "center",
        },
    
        {
          title: "Acciones",
          key: "acciones",
          align: "center",
          render: (_, record) => (
            <div className="cont_acciones">
              {/* <EditOutlined
                className="icon_accion"
                onClick={(e) => handleEditPacient(record)}
              /> */}
              <DragOutlined
                className="icon_accion"
                onClick={(e) => handleEditUsuario(record)}
              />
            </div>
          ),
        },
      ];
    

const handleEditUsuario=()=>{

}

  return (
    <div>
      <Table
        className="tabla"
        columns={columns}
        /* pagination={{
          position: [top, bottom],
        }} */
        pagination={{ position: ["none", "bottomRight"], pageSize: 5 }}
        /* el pageSize determina la cantidad filas por tabla */

        /* dataSource={dbSearch.length > 0 ? dbSearch : db} */
      />
    </div>
  );
};
