import { Router } from 'express';
import { espectrometroController } from '../../../../app.container';

const router = Router();

router.post('/', (req, res) => espectrometroController.crear(req, res));
router.get('/', (req, res) => espectrometroController.listar(req, res));

export default router;