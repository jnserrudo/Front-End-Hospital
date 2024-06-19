import React from 'react';

export const RecetaSee = ({ receta }) => {
  console.log(receta);
  return (
    <div>
      <div className="receta_foto_ingredientes">

        <div className="receta_foto">
          <p className='titulo_receta'>{receta.nombre}</p>
          <img  className='img_receta' src={receta.urlFoto} alt={receta.nombre} />
        </div>

        <div className="receta_ingredientes">

          <div className="receta_valores">
            <div className="receta_valor">
              <p >Porciones</p>
              <p>{receta.porciones}</p>
            </div>
            <div className="receta_valor">
              <p>Calorías</p>
              <p>{receta.calorias}</p>
            </div>
            <div className="receta_valor">
              <p>Tiempo</p>
              <p>{receta.tiempo}</p>
            </div>
          </div>
         <div className="ingredientes">   
            <p className='titulo_receta' >Ingredientes</p>
            <p>{receta.ingredientes}</p>
         </div> 
        </div>

      </div>
      <div className="receta_preparacion">
        <p className='titulo_receta' >Preparación</p>
        <p>{receta.preparacion}</p>
      </div>
    </div>
  );
};
