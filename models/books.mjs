import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../config/sequelize.mjs';


export default class Book extends Model {}

Book.init(
    {
    sn: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        unique: true,
    },
    book_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
        unique: true,
        primaryKey: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    genre :{
        type: DataTypes.STRING,
        allowNull: false,
    },
    publication_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    is_available: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
    },
    edition: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
            max: 100,
        },
    },
    summary: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 1,
        },
    }
    },
    {
    
    sequelize,
    modelName: 'Book', 
    updatedAt: 'updated_at',
    createdAt: 'created_at',
    },
);
