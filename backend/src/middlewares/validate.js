
export const validate = (schemas) => 
    (req, res, next) => {
        try {
            const targets = ["body", "params", "query"];

            for (const target of targets) {
                const schema = schemas[target];
                if (!schema) continue;

                const result = schema.safeParse(req[target]);

                if (!result.success) {
                    return res.status(400).json({
                        message: "Validation failed",
                        location: target,
                        errors: result.error.flatten().fieldErrors,
                    });
                }

                req[target] = result.data;

                next();
            }
        } catch (error) {
            next(error);
            
        }
    }