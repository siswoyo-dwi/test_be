import express from 'express';
import {msAuth, msAuthCb, redirect} from './module.js';
import {gAuth, gAuthCb, gRedirect} from './module.js';
import {aAuth, aAuthCb, aRedirect} from './module.js';
const router = express.Router()


router.get('/ms', msAuth)
router.get('/ms/callback', msAuthCb, redirect)

router.get('/g', gAuth)
router.get('/g/callback', gAuthCb, gRedirect)

router.get('/a', aAuth)
router.post('/a/callback', aAuthCb, aRedirect)

export default router;