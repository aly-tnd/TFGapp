
import { CrearEspectrometroUseCase } from "./domain/espectrometro/application/use-cases/crear-espectrometro.use-case";
import { ListarEspectrometrosUseCase } from "./domain/espectrometro/application/use-cases/listar-espectrometros.use-case";
import { EspectrometroController } from "./domain/espectrometro/infrastructure/controllers/espectrometro.controller";
import { MongoEspectrometroRepository } from "./domain/espectrometro/infrastructure/db/mongo-espectrometro.repository";


const espectrometroRepository = new MongoEspectrometroRepository();

const crearEspectrometroUseCase = new CrearEspectrometroUseCase(espectrometroRepository);
const listarEspectrometrosUseCase = new ListarEspectrometrosUseCase(espectrometroRepository);

export const espectrometroController = new EspectrometroController(
  crearEspectrometroUseCase,
  listarEspectrometrosUseCase
);