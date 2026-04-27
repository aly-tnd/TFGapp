import { Router } from 'express';
import { espectrometroController } from '../../../../app.container';
// IMPORTANTE: Importa la instancia (minúscula) desde el container


const router = Router(); // <--- Asegúrate de tener los paréntesis ()

// Usa 'espectrometroController' (el objeto), NO 'EspectrometroController' (la clase)
router.post('/', (req, res) => espectrometroController.crear(req, res));
router.get('/', (req, res) => espectrometroController.listar(req, res));

export default router;