
import { CrearEspectrometroUseCase } from "./domain/espectrometro/application/use-cases/crear-espectrometro.use-case";
import { ListarEspectrometrosUseCase } from "./domain/espectrometro/application/use-cases/listar-espectrometros.use-case";
import { EspectrometroController } from "./domain/espectrometro/infrastructure/controllers/espectrometro.controller";
import { MongoEspectrometroRepository } from "./domain/espectrometro/infrastructure/db/mongo-espectrometro.repository";
import { MongoUserRepository } from "./domain/apiGestion/infrastructure/db/mongo/repositories/mongo-user.repository";
import { MongoRegistroRepository } from "./domain/apiGestion/infrastructure/db/mongo/repositories/MongoRegistroRepository";
import { CrearUsuarioUseCase } from "./domain/apiGestion/application/use-cases/create-user.use-cases";
import { ListUsersUseCase } from "./domain/apiGestion/application/use-cases/listar-usuarios.use-cases";
import { ObtenerUsuarioYMuestrasUseCase } from "./domain/apiGestion/application/use-cases/obtener-usuario-muestras.use-case";
import { LoginUseCase } from "./domain/apiGestion/application/use-cases/login.use-case";
import { ApiController } from "./domain/apiGestion/http/controllers/api.controller";
import { AuthService } from "./shared/services/auth.service";

// ============= REPOSITORIES =============
const userRepository = new MongoUserRepository();
const registroRepository = new MongoRegistroRepository();
const espectrometroRepository = new MongoEspectrometroRepository();

// ============= SERVICES =============
const authService = new AuthService();

// ============= USE CASES - USUARIOS =============
const createUserUseCase = new CrearUsuarioUseCase(userRepository);
const listUsersUseCase = new ListUsersUseCase(userRepository);
const obtenerUsuarioYMuestrasUseCase = new ObtenerUsuarioYMuestrasUseCase(
  userRepository,
  registroRepository
);
const loginUseCase = new LoginUseCase(userRepository, authService);

// ============= USE CASES - ESPECTROMETRO =============
const crearEspectrometroUseCase = new CrearEspectrometroUseCase(espectrometroRepository);
const listarEspectrometrosUseCase = new ListarEspectrometrosUseCase(espectrometroRepository);

// ============= CONTROLLERS =============
export const apiController = new ApiController(
  createUserUseCase,
  listUsersUseCase,
  obtenerUsuarioYMuestrasUseCase,
  loginUseCase,
  userRepository,
  registroRepository,
  authService
);

export const espectrometroController = new EspectrometroController(
  crearEspectrometroUseCase,
  listarEspectrometrosUseCase
);