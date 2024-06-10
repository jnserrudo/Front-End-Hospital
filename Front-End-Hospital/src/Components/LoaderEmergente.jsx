import React from "react";
import Loading from "react-loading";
/* import { ProgressBar } from "../components/ProgressBar"; */
import "../style.css";

export const LoaderEmergente = () => {
  //Vamos a poner un componente de progreso para

  return (
    <div className="loader-container">
      <div className="mensaje">
        <p>Cargando ...</p>
        <Loading
          className="loading"
          type="spin"
          color="#333"
          height={50}
          width={50}
        />
{/*         <ProgressBar progress={progress} />
 */}      </div>

    
    </div>
  );
};
