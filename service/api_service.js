const rateLimiters = {};  // Stores rate limiter states per IP
const MAX_CALLS = 15; 
const PENALTY_DURATION = 60 * 1000;  // 1 minute penalty duration
const TIME_FRAME = 60 * 1000;  // 1 minute time frame for calls

exports.processData = (data) => {
    console.log("Processing data in service:", JSON.stringify(data));

    return { ...data, processed: true };
};

exports.rateLimiter = (req, res, next) => {
    const ip = req.ip;  // Get the user's IP address
    const currentTime = Date.now();

    // Initialize rate limiter for the IP if it doesn't exist
    if (!rateLimiters[ip]) {
        rateLimiters[ip] = {
            callCount: 0,
            penaltyActive: false,
            lastRequestTime: currentTime,
        };
    }

    const limiter = rateLimiters[ip];

    // If penalty is active, reject the request
    if (limiter.penaltyActive) {
        console.log(`Rate limit exceeded for IP: ${ip}. Entering penalty.`);
        res.status(429).send({ error: `Too many requests. Please try again later.` });
        return;
    }

    // Reset call count if time frame has passed
    if (currentTime - limiter.lastRequestTime > TIME_FRAME) {
        limiter.callCount = 0;
    }

    // Check if max calls are exceeded
    if (limiter.callCount >= MAX_CALLS) {
        console.log(`Rate limit exceeded for IP: ${ip}. Entering penalty for ${PENALTY_DURATION / 1000} seconds.`);
        limiter.penaltyActive = true;

        // Set a timeout for the penalty duration
        setTimeout(() => {
            limiter.penaltyActive = false;
            limiter.callCount = 0;  // Reset the call count
        }, PENALTY_DURATION);

        res.status(429).send({ error: `Rate limit exceeded. Try again later.` });
        return;
    }

    // Process the request
    limiter.callCount++;
    limiter.lastRequestTime = currentTime;

    console.log(`Processing request from IP: ${ip}. Current count: ${limiter.callCount}/${MAX_CALLS}`);
    res.status(200).send({data:req.body,message:"request is success"});
};

