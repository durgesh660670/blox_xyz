const {processData,rateLimiter}=require('../service/api_service')

exports.task3 = (req, res) => {
    try {
        const  data  = req.body;
        console.log("Received data:", data);

        const result = processData(data);

        res.status(200).send(result);
    } catch (error) {
        console.error("Error in task1:", error);
        res.status(500).send({ error: "An error occurred while processing data" });
    }
};



exports.task4 = (req, res) => {
     rateLimiter(req, res);
    

};