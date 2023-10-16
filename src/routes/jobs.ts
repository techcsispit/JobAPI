import { Router } from 'express';
import {
    createJob,
    deleteJob,
    getAllJobs,
    getJob,
    updateJob,
} from '../controllers/jobs';

const router = Router();

router.route('/').get(getAllJobs).post(createJob);
router.route('/:id').get(getJob).delete(deleteJob).patch(updateJob);

export default router;
