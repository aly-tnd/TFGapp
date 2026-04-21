
// --- INSTANCIACIÓN ---

import { CrearEspectrometroUseCase } from "./domain/espectrometro/application/use-cases/crear-espectrometro.use-case";
import { ListarEspectrometrosUseCase } from "./domain/espectrometro/application/use-cases/listar-espectrometros.use-case";
import { EspectrometroController } from "./domain/espectrometro/infrastructure/controllers/espectrometro.controller";
import { MongoEspectrometroRepository } from "./domain/espectrometro/infrastructure/db/mongo-espectrometro.repository";


// 1. Capa de Infraestructura (Persistencia)
const espectrometroRepository = new MongoEspectrometroRepository();

// 2. Capa de Aplicación (Lógica de negocio)
const crearEspectrometroUseCase = new CrearEspectrometroUseCase(espectrometroRepository);
const listarEspectrometrosUseCase = new ListarEspectrometrosUseCase(espectrometroRepository);

// 3. Capa de Infraestructura (Puntos de entrada)
// Exportamos el controlador ya configurado con sus dependencias
export const espectrometroController = new EspectrometroController(
  crearEspectrometroUseCase,
  listarEspectrometrosUseCase
);