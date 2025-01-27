import { validateCreateBook, validateUpdateBook } from '../validations/index.mjs'
import Book from '../models/books.mjs'
import { Op } from "sequelize";


export const createBooks = async(req, res)=>{
    try {
        const { title, author, genre, summary} = req.body
        const {error} = validateCreateBook(req.body)

        if(error != undefined){
            return res.status(400).json(
                {
                    status: false,
                    message: error.details[0].message,
                    code: 400,
                }
            )
        }

        const checkIfBookAlreadyExists = await Book.findOne({
            where:{
                title,
                author,
                genre,
                summary
            }
        })
        if(checkIfBookAlreadyExists){
            return res.status(400).json(
                {
                    status: false,
                    message: 'Book already exists',
                    code: 400,
                }
            )
        }

        const book = await Book.create(req.body)

        res.status(201).json({
            status: true,
            message: 'A new book has been created successfully',
            code: 201,
            data: book
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            code: 500,
        })
    }
}

export const getAllBooks = async (req, res) =>{
    try {
        const { page = 1, author, pageSize = 2, sortBy = 'publication_date', sortOrder = 'DESC', title, genre } = req.query

        const filter = {is_available: true}

        if(author){
            filter.author = { [Op.like]: `%${author}%` }
        }

        if(title){
            filter.title = { [Op.like]: `%${title}%`}
        }

        if(genre){
            filter.genre = { [Op.like]: `%${genre}%`}
        }

        const offset = (page - 1) * pageSize;

        const books = await Book.findAll({
            where: filter,
            order: [[sortBy, sortOrder]],
            limit: parseInt(pageSize),
            offset: offset,
        });

        if(books.length < 1){
            return res.status(404).json({
                status: false,
                message: 'Books not found',
                code: 404,
            })
        }
        const totalCount =await Book.count({where: filter})

        res.status(200).json({
            status: true,
            message: 'Books fetched successfully',
            code: 200,
            data: books,
            pagination: {
                page,
                pageSize,
                totalCount,
                totalPages: Math.ceil(totalCount / pageSize),
            }
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            code: 500,
        })
    }
}

export const getBookById = async (req, res) =>{
    try {
        const { id } = req.params

        if(!id){
            return res.status(400).json({
                status: false,
                message: 'Invalid book ID',
                code: 400,
            })
        }

        const book = await Book.findByPk(id)
        
        if(!book){
            return res.status(404).json({
                status: false,
                message: 'Book not found',
                code: 404,
            })
        }

        res.status(200).json({
            status: true,
            message: 'Book fetched successfully',
            code: 200,
            data: book
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            code: 500,
        })
    }
}

export const updateBookById = async (req, res) =>{
    try {

        const { id } = req.params

        if(!id){
            return res.status(400).json({
                status: false,
                message: 'Invalid book ID',
                code: 400,
            })
        }

        const { error } = validateUpdateBook(req.body)

        if(error != undefined){
            return res.status(400).json(
                {
                    status: false,
                    message: error.details[0].message,
                    code: 400,
                }
            )
        }

        const updatedBook =await Book.update(req.body, 
            {where: {
                book_id: id,
            }}
        )
        if(updatedBook[0] === 0){
            return res.status(404).json({
                status: false,
                message: 'Book not found',
                code: 404,
            })
        }

        res.status(200).json({
            status: true,
            message: 'Book updated successfully',
            code: 200,
            data: updatedBook,
        })

    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            code: 500,
        })
    }
}

export const deleteBookById = async (req, res) =>{
    try {
        
        const { id } = req.params

        if(!id){
            return res.status(400).json({
                status: false,
                message: 'Invalid book ID',
                code: 400,
            })
        }

        const deletedBook = await Book.destroy({where: {
                book_id: id,
            }})
        console.log(deletedBook)
        if(deletedBook === 0){
            return res.status(404).json({
                status: false,
                message: 'Book not found',
                code: 404,
            })
        }

        res.status(200).json({
            status: true,
            message: 'Book deleted successfully',
            code: 200,
        })
    } catch (error) {
        res.status(500).json({
            status: false,
            message: error.message,
            code: 500,
        })
    }
}