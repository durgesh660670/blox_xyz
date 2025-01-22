const express=require('express')
const  taskController=require('../controller/api_controller')
const router=express.Router();

router.post('/task3', taskController.task3);
router.post('/task4', taskController.task4);

module.exports=router;