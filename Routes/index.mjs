import { createBooks, getAllBooks, getBookById, updateBookById, deleteBookById } from '../controller/book.mjs'
import { Router } from 'express'
const router = Router()

router.post('/books', createBooks )

router.get('/books', getAllBooks)

router.get('/books/:id', getBookById)

router.put('/books/:id', updateBookById)

router.delete('/books/:id', deleteBookById)

export default router