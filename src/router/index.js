import { CharactersRouter } from "../components";
import { MoviesRouter } from "../components";
import { GendersRouter } from "../components";
import { MOnGRouter } from "../components";
import { COnPRouter } from "../components";
import { AuthRouter } from "../components";

// cada vez que quiera agregar una ruta nueva,
// creo el path e importo el componente

const listRoutes = [
  ["/auth",AuthRouter],
  ["/mong", MOnGRouter],
  ["/conp", COnPRouter],
  ["/characters", CharactersRouter], 
  ["/movies", MoviesRouter], 
  ["/genders", GendersRouter]
];

export const routes = (app) => {
  listRoutes.forEach(([path, controller]) => {
    app.use(path, controller);
  });
};