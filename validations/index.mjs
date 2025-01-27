import Joi from 'joi';


export const validateCreateBook = (data)=>{
    const schema = Joi.object({
        title: Joi.string().required(),
        quantity: Joi.number().integer().required(),
        summary: Joi.string().required(),
        author: Joi.string().required(),
        genre: Joi.string().required(),
        publication_date: Joi.date().required(),
        edition: Joi.number().required(),
    });

    return schema.validate(data)
}

export const validateUpdateBook = (data)=>{
    const schema = Joi.object({
        title: Joi.string(),
        quantity: Joi.number().integer(),
        summary: Joi.string(),
        author: Joi.string(),
        genre: Joi.string(),
        publication_date: Joi.date(),
        edition: Joi.number(),
    });

    return schema.validate(data)
}