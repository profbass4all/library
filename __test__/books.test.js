import { createBooks } from '../controller/book.mjs'
import validations, { validateCreateBook } from '../validations/index.mjs'
import Book from '../models/books.mjs'


const req = {
    body: {
        title: 'How to land a tech job as a Nigerian',
        author: 'Murewa',
        genre: 'Self Development',
        summary: 'This book focuses on building and developing you into a successful programmer that you are',
    }
}

const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
}

jest.mock('../validations/index.mjs', ()=> ({
    validateCreateBook: jest.fn(()=>({
        error: undefined,
    }))
}))

jest.mock('../models/books.mjs')
it('should create a new book', async function(){

    await Book.findOne.mockImplementationOnce( ()=> null)
    await Book.create.mockImplementationOnce(()=> ({
        title: req.title,
            author: req.author,
            genre: req.genre,
            is_available: true,
            quantity: expect.any(Number)
    }))
    await createBooks(req, res)
    expect(Book.create).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(201)
    expect(res.json).toHaveBeenCalledWith({
        status: true,
        message: 'A new book has been created successfully',
        code: 201,
        data:{
            title: req.title,
            author: req.author,
            genre: req.genre,
            is_available: true,
            quantity: expect.any(Number)
        }
    })
})

it('should return 400 error when the validation fails', async function(){
    jest.spyOn(validations, 'validateCreateBook').mockImplementationOnce(()=>({
        error: !undefined,
    }))

    await createBooks(req, res)
    expect(validations.validateCreateBook).toHaveBeenCalledWith(req.body)
    expect(res.status).toHaveBeenCalledWith(400)
    expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'validation error occurred',
        code: 400,
    })
})

it('should return 409 if book already exists', async()=>{
    await Book.findOne.mockImplementationOnce( ()=> !null)

    await createBooks(req, res)
    expect(res.status).toHaveBeenCalledWith(409)
    expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: 'Conflict!!!...Book already exists',
        code: 409,
    })
})

it('should return 500 for any server error', async()=>{

    await createBooks(req, res)
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith({
        status: false,
        message: expect.any(String),
        code: 500,
    })
})