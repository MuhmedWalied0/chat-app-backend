export default (schema) => (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
        return res.status(400).json({
            success: false,
            errors: [
                {
                    field: "body",
                    message: "Request body is missing or empty"
                }
            ]
        });
    }

    const data = schema.safeParse(req.body);
    
    if (!data.success) {
        const formattedErrors = data.error.issues.map(issue => ({
            field: issue.path[0] || "unknown",
            message: issue.message
        }));
        
        return res.status(400).json({
            success: false,
            errors: formattedErrors
        });
    }
    
    req.validatedData = data.data;
    next();
};